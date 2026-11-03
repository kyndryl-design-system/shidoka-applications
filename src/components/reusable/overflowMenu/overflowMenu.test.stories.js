import { html } from 'lit';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import './index';

export default {
  title: 'Tests/Components/Overflow Menu',
  component: 'kyn-overflow-menu',
  tags: ['!autodocs'],
};

const exportAction = fn();

const options = () => html`
  <kyn-overflow-menu-item
    slot="submenu"
    id="json"
    @on-click=${() => exportAction('json')}
    >Export as JSON</kyn-overflow-menu-item
  >
  <kyn-overflow-menu-item
    slot="submenu"
    id="zip"
    href="#zip"
    @on-click=${(event) => {
      event.detail.origEvent.preventDefault();
      exportAction('zip');
    }}
    >Export as ZIP</kyn-overflow-menu-item
  >
  <kyn-overflow-menu-item slot="submenu" disabled
    >Disabled</kyn-overflow-menu-item
  >
  <kyn-overflow-menu-item slot="submenu" id="deeper">
    Deeper
    <kyn-overflow-menu-item
      slot="submenu"
      id="deep"
      @on-click=${() => exportAction('deep')}
      >Deep action</kyn-overflow-menu-item
    >
  </kyn-overflow-menu-item>
`;

const play = async ({ canvasElement }) => {
  exportAction.mockClear();
  const menu = canvasElement.querySelector('kyn-overflow-menu');
  const parent = menu.querySelector('#export');
  const json = menu.querySelector('#json');
  const zip = menu.querySelector('#zip');
  const deeper = menu.querySelector('#deeper');
  const deep = menu.querySelector('#deep');
  const action = (item) => item.shadowRoot.querySelector('button, a');
  const settle = async () => {
    await menu.updateComplete;
    await Promise.all(
      [...menu.querySelectorAll('kyn-overflow-menu-item')].map(
        (item) => item.updateComplete
      )
    );
    expect(menu.getMenuItems()).toEqual([parent, json, zip, deeper, deep]);
  };
  await settle();
  const toggle = menu.shadowRoot.querySelector('.btn');
  const back = () => menu.shadowRoot.querySelector('.submenu-back-item');
  const openMenu = async () => {
    await userEvent.click(toggle);
    await waitFor(() => {
      expect(
        getComputedStyle(menu.shadowRoot.querySelector('.menu')).visibility
      ).toBe('visible');
    });
  };
  for (const [item, format] of [
    [json, 'json'],
    [zip, 'zip'],
  ]) {
    await openMenu();
    await userEvent.click(action(parent));
    await settle();
    expect(menu.querySelector(`#${format}`)).toBe(item);
    expect(action(parent).getClientRects()).toHaveLength(0);
    expect(menu._getCurrentMenuItems()).toEqual([json, zip, deeper]);
    await waitFor(() => {
      expect(back().shadowRoot.activeElement).toBe(action(back()));
    });
    expect(action(menu.querySelector('[disabled]')).disabled).toBe(true);
    expect(menu.open).toBe(true);
    await userEvent.click(action(item));
    await settle();
    expect(exportAction).toHaveBeenLastCalledWith(format);
    expect(menu.open).toBe(false);
  }
  expect(exportAction).toHaveBeenCalledTimes(2);
  await openMenu();
  await userEvent.click(action(parent));
  await settle();
  menu.kind = 'ai';
  await settle();
  for (const item of [parent, json, zip, deeper, deep]) {
    expect(item.kind).toBe('ai');
  }
  await userEvent.click(action(deeper));
  await settle();
  expect(menu._getCurrentMenuItems()).toEqual([deep]);
  await userEvent.click(action(back()));
  await settle();
  expect(menu._getCurrentMenuItems()).toEqual([json, zip, deeper]);
  await userEvent.click(action(back()));
  await settle();
  expect(menu._getCurrentMenuItems()).toEqual([parent]);
  expect(parent.kind).toBe('ai');
  menu.kind = 'default';
  await settle();
  for (const item of [parent, json, zip, deeper, deep]) {
    expect(item.kind).toBe('default');
  }
  await waitFor(() => {
    expect(parent.shadowRoot.activeElement).toBe(action(parent));
  });
  await userEvent.click(action(parent));
  await settle();
  await userEvent.click(action(deeper));
  await settle();
  await userEvent.click(action(deep));
  await settle();
  expect(exportAction).toHaveBeenLastCalledWith('deep');
  expect(exportAction).toHaveBeenCalledTimes(3);
  expect(menu.open).toBe(false);
  await openMenu();
  await userEvent.click(action(parent));
  await settle();
  await waitFor(() => {
    expect(back().shadowRoot.activeElement).toBe(action(back()));
  });
  const dynamic = document.createElement('kyn-overflow-menu-item');
  dynamic.slot = 'submenu';
  dynamic.textContent = 'Dynamic action';
  json.parentElement.append(dynamic);
  await waitFor(() => {
    expect(menu.getMenuItems()).toContain(dynamic);
    expect(menu._getCurrentMenuItems()).toContain(dynamic);
    expect(action(dynamic).getClientRects().length).toBeGreaterThan(0);
  });
  dynamic.remove();
  action(json).focus();
  action(json).dispatchEvent(
    new KeyboardEvent('keydown', {
      key: 'ArrowDown',
      keyCode: 40,
      bubbles: true,
      composed: true,
    })
  );
  expect(zip.shadowRoot.activeElement).toBe(action(zip));
  action(zip).dispatchEvent(
    new KeyboardEvent('keydown', {
      key: 'Escape',
      keyCode: 27,
      bubbles: true,
      composed: true,
    })
  );
  await settle();
  expect(menu.open).toBe(false);
  expect(exportAction).toHaveBeenCalledTimes(3);
  await waitFor(() => {
    expect(
      getComputedStyle(menu.shadowRoot.querySelector('.menu')).visibility
    ).toBe('hidden');
  });
};

export const OriginalItemBindings = {
  render: () => html`
    <kyn-overflow-menu backButtonText="Back">
      <kyn-overflow-menu-item id="export">
        Export ${options()}
      </kyn-overflow-menu-item>
    </kyn-overflow-menu>
  `,
  play,
};

export const WrappedItemBindings = {
  render: () => html`
    <kyn-overflow-menu backButtonText="Back">
      <kyn-overflow-menu-item id="export">
        Export
        <div slot="submenu">${options()}</div>
      </kyn-overflow-menu-item>
    </kyn-overflow-menu>
  `,
  play,
};

export const AncestorEventPropagation = {
  render: OriginalItemBindings.render,
  play: async ({ canvasElement }) => {
    const menu = canvasElement.querySelector('kyn-overflow-menu');
    const parent = menu.querySelector('#export');
    const json = menu.querySelector('#json');
    await menu.updateComplete;
    await parent.updateComplete;
    await json.updateComplete;
    const onMenu = fn();
    const onParent = fn();
    const onChild = fn();
    menu.addEventListener('on-click', onMenu);
    parent.addEventListener('on-click', onParent);
    json.addEventListener('on-click', onChild);
    try {
      await userEvent.click(menu.shadowRoot.querySelector('.btn'));
      await userEvent.click(parent.shadowRoot.querySelector('button'));
      await menu.updateComplete;
      await json.updateComplete;
      await userEvent.click(json.shadowRoot.querySelector('button'));
      await menu.updateComplete;
      expect(onChild).toHaveBeenCalledTimes(1);
      expect(onParent).toHaveBeenCalledTimes(1);
      expect(onMenu).toHaveBeenCalledTimes(1);
      const event = onChild.mock.calls[0][0];
      expect(onParent.mock.calls[0][0]).toBe(event);
      expect(onMenu.mock.calls[0][0]).toBe(event);
      expect(event.target).toBe(json);
      expect(event.detail.origEvent.type).toBe('click');
      expect(menu.open).toBe(false);
      await waitFor(() => {
        expect(
          getComputedStyle(menu.shadowRoot.querySelector('.menu')).visibility
        ).toBe('hidden');
      });
    } finally {
      menu.removeEventListener('on-click', onMenu);
      parent.removeEventListener('on-click', onParent);
      json.removeEventListener('on-click', onChild);
    }
  },
};

export const RemovingOpenSubmenus = {
  render: OriginalItemBindings.render,
  play: async ({ canvasElement }) => {
    const menu = canvasElement.querySelector('kyn-overflow-menu');
    const parent = menu.querySelector('#export');
    const deeper = menu.querySelector('#deeper');
    const json = menu.querySelector('#json');
    const action = (item) => item.shadowRoot.querySelector('button, a');
    await menu.updateComplete;
    await parent.updateComplete;
    await deeper.updateComplete;
    const toggle = menu.shadowRoot.querySelector('.btn');
    const back = () => menu.shadowRoot.querySelector('.submenu-back-item');
    await userEvent.click(toggle);
    await userEvent.click(action(parent));
    await menu.updateComplete;
    await userEvent.click(action(deeper));
    await menu.updateComplete;
    deeper.remove();
    await waitFor(() => {
      expect(back().getBoundingClientRect().height).toBeGreaterThan(0);
    });
    await userEvent.click(action(back()));
    await waitFor(() => {
      expect(action(json).getClientRects().length).toBeGreaterThan(0);
    });
    parent.remove();
    await menu.updateComplete;
    await userEvent.click(action(back()));
    await menu.updateComplete;
    expect(menu._menuHistory).toEqual([]);
    expect(menu.getMenuItems()).toEqual([]);
    await userEvent.click(toggle);
    await menu.updateComplete;
    expect(menu.open).toBe(false);
    await userEvent.click(toggle);
    await menu.updateComplete;
    expect(menu.open).toBe(true);
    expect(menu._menuHistory).toEqual([]);
    await userEvent.click(toggle);
    await waitFor(() => {
      expect(
        getComputedStyle(menu.shadowRoot.querySelector('.menu')).visibility
      ).toBe('hidden');
    });
  },
};

export const ToggleKeyboardNavigation = {
  render: () => html`
    <kyn-overflow-menu backButtonText="Back">
      <kyn-overflow-menu-item disabled>
        Disabled root
        <kyn-overflow-menu-item slot="submenu">
          Hidden action
        </kyn-overflow-menu-item>
      </kyn-overflow-menu-item>
      <kyn-overflow-menu-item id="parent">
        More actions
        <kyn-overflow-menu-item slot="submenu" disabled>
          Disabled child
        </kyn-overflow-menu-item>
        <kyn-overflow-menu-item slot="submenu" id="link" href="#action">
          Link action
        </kyn-overflow-menu-item>
        <kyn-overflow-menu-item slot="submenu" id="disabled-level">
          Disabled options
          <kyn-overflow-menu-item slot="submenu" disabled>
            Unavailable
          </kyn-overflow-menu-item>
        </kyn-overflow-menu-item>
      </kyn-overflow-menu-item>
    </kyn-overflow-menu>
  `,
  play: async ({ canvasElement }) => {
    const menu = canvasElement.querySelector('kyn-overflow-menu');
    await menu.updateComplete;
    await Promise.all(
      [...menu.querySelectorAll('kyn-overflow-menu-item')].map(
        (item) => item.updateComplete
      )
    );
    const toggle = menu.shadowRoot.querySelector('.btn');
    const parent = menu.querySelector('#parent');
    const link = menu.querySelector('#link');
    const disabledLevel = menu.querySelector('#disabled-level');
    const allItems = menu.getMenuItems();
    const action = (item) => item.shadowRoot.querySelector('button, a');
    // The existing handler uses keyCode, which userEvent does not populate.
    const press = (key, keyCode) => {
      toggle.focus();
      const event = new KeyboardEvent('keydown', {
        key,
        keyCode,
        bubbles: true,
        composed: true,
        cancelable: true,
      });
      toggle.dispatchEvent(event);
      return event;
    };

    expect(press('Enter', 13).defaultPrevented).toBe(true);
    await menu.updateComplete;
    await waitFor(() => {
      expect(
        getComputedStyle(menu.shadowRoot.querySelector('.menu')).visibility
      ).toBe('visible');
    });
    expect(menu.open).toBe(true);
    expect(press('ArrowDown', 40).defaultPrevented).toBe(true);
    expect(parent.shadowRoot.activeElement).toBe(action(parent));
    expect(menu.open).toBe(true);
    expect(press('Tab', 9).defaultPrevented).toBe(false);
    expect(menu.shadowRoot.activeElement).toBe(toggle);

    await userEvent.click(action(parent));
    await menu.updateComplete;
    await link.updateComplete;
    await waitFor(() => {
      const back = menu.shadowRoot.querySelector('.submenu-back-item');
      expect(back.shadowRoot.activeElement).toBe(action(back));
    });
    press('ArrowDown', 40);
    expect(link.shadowRoot.activeElement).toBe(action(link));
    expect(menu.getMenuItems()).toEqual(allItems);

    await userEvent.click(action(disabledLevel));
    await menu.updateComplete;
    await waitFor(() => {
      const back = menu.shadowRoot.querySelector('.submenu-back-item');
      expect(back.shadowRoot.activeElement).toBe(action(back));
    });
    press('ArrowDown', 40);
    expect(menu.shadowRoot.activeElement).toBe(toggle);
    expect(menu.open).toBe(true);
    expect(menu.getMenuItems()).toEqual(allItems);

    press(' ', 32);
    await menu.updateComplete;
    expect(menu.open).toBe(false);
    press(' ', 32);
    await menu.updateComplete;
    expect(menu.open).toBe(true);
    expect(menu._menuHistory).toEqual([]);
    press('Enter', 13);
    await menu.updateComplete;
    expect(menu.open).toBe(false);
    await waitFor(() => {
      expect(
        getComputedStyle(menu.shadowRoot.querySelector('.menu')).visibility
      ).toBe('hidden');
    });

    const emptyMenu = document.createElement('kyn-overflow-menu');
    canvasElement.append(emptyMenu);
    try {
      await emptyMenu.updateComplete;
      const emptyToggle = emptyMenu.shadowRoot.querySelector('.btn');
      emptyToggle.focus();
      emptyToggle.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'ArrowDown',
          keyCode: 40,
          bubbles: true,
          composed: true,
        })
      );
      expect(emptyMenu.shadowRoot.activeElement).toBe(emptyToggle);
      expect(emptyMenu.open).toBe(false);
    } finally {
      emptyMenu.remove();
    }
  },
};
