import { html } from 'lit';
import { expect, fn, spyOn, userEvent, waitFor } from 'storybook/test';
import './index';

export default {
  title: 'Tests/Components/Overflow Menu',
  component: 'kyn-overflow-menu',
  tags: ['!autodocs', '!dev'],
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
  await waitFor(() => {
    for (const item of [parent, json, zip, deeper, deep]) {
      expect(item.kind).toBe('ai');
    }
  });
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
  await waitFor(() => {
    for (const item of [parent, json, zip, deeper, deep]) {
      expect(item.kind).toBe('default');
    }
  });
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

export const ItemSynchronization = {
  render: OriginalItemBindings.render,
  play: async ({ canvasElement }) => {
    const menu = canvasElement.querySelector('kyn-overflow-menu');
    const parent = menu.querySelector('#export');
    const json = menu.querySelector('#json');
    const action = (item) => item.shadowRoot.querySelector('button, a');
    await menu.updateComplete;
    await Promise.all(
      [...menu.querySelectorAll('kyn-overflow-menu-item')].map(
        (item) => item.updateComplete
      )
    );
    await new Promise(requestAnimationFrame);
    const queryItems = spyOn(menu, 'querySelectorAll');
    try {
      json.kind = 'ai';
      await json.updateComplete;
      menu.assistiveText = 'Actions';
      menu.backButtonText = 'Previous';
      menu.anchorRight = true;
      menu.verticalDots = true;
      await menu.updateComplete;
      expect(queryItems).not.toHaveBeenCalled();
      expect(json.kind).toBe('ai');

      menu.requestUpdate();
      await menu.updateComplete;
      expect(queryItems).not.toHaveBeenCalled();
      expect(json.kind).toBe('ai');

      menu.kind = 'ai';
      await waitFor(() => {
        expect(parent.kind).toBe('ai');
      });
      expect(queryItems).not.toHaveBeenCalled();
      menu.kind = 'default';
      await waitFor(() => {
        expect(parent.kind).toBe('default');
        expect(json.kind).toBe('default');
      });
      expect(queryItems).not.toHaveBeenCalled();

      json.kind = 'ai';
      await json.updateComplete;
      await userEvent.click(menu.shadowRoot.querySelector('.btn'));
      await userEvent.click(action(parent));
      await menu.updateComplete;
      await json.updateComplete;
      expect(parent._itemVisible).toBe(false);
      expect(parent._submenuExpanded).toBe(true);
      expect(json._itemVisible).toBe(true);
      expect(json.kind).toBe('ai');

      const dynamic = document.createElement('kyn-overflow-menu-item');
      dynamic.textContent = 'Dynamic action';
      menu.append(dynamic);
      try {
        await waitFor(() => {
          expect(dynamic._itemVisible).toBe(false);
        });
        dynamic.slot = 'submenu';
        parent.append(dynamic);
        await waitFor(() => {
          expect(dynamic._itemVisible).toBe(true);
          expect(action(dynamic).getClientRects().length).toBeGreaterThan(0);
        });
        queryItems.mockClear();
        dynamic.slot = '';
        await waitFor(() => {
          expect(queryItems).toHaveBeenCalledWith('kyn-overflow-menu-item');
          expect(action(dynamic).getClientRects()).toHaveLength(0);
        });
        dynamic.slot = 'submenu';
        await waitFor(() => {
          expect(action(dynamic).getClientRects().length).toBeGreaterThan(0);
        });
        dynamic.slot = '';
        menu.append(dynamic);
        await waitFor(() => {
          expect(dynamic._itemVisible).toBe(false);
        });
      } finally {
        dynamic.remove();
      }

      const back = menu.shadowRoot.querySelector('.submenu-back-item');
      await userEvent.click(action(back));
      await menu.updateComplete;
      await parent.updateComplete;
      await json.updateComplete;
      expect(parent._itemVisible).toBe(true);
      expect(parent._submenuExpanded).toBe(false);
      expect(json._itemVisible).toBe(false);
      expect(json.kind).toBe('ai');
    } finally {
      queryItems.mockRestore();
    }
  },
};

export const AncestorEventPropagation = {
  render: OriginalItemBindings.render,
  play: async ({ canvasElement }) => {
    const menu = canvasElement.querySelector('kyn-overflow-menu');
    const parent = menu.querySelector('#export');
    const json = menu.querySelector('#json');
    const deeper = menu.querySelector('#deeper');
    const deep = menu.querySelector('#deep');
    await menu.updateComplete;
    await parent.updateComplete;
    await json.updateComplete;
    const onMenu = fn();
    const onParent = fn();
    const onChild = fn();
    menu.addEventListener('on-click', onMenu);
    parent.addEventListener('on-click', onParent);
    json.addEventListener('on-click', onChild);
    deeper.addEventListener('on-click', onParent);
    deep.addEventListener('on-click', onChild);
    try {
      await userEvent.click(menu.shadowRoot.querySelector('.btn'));
      await waitFor(() => {
        expect(
          getComputedStyle(menu.shadowRoot.querySelector('.menu')).visibility
        ).toBe('visible');
      });
      await userEvent.click(parent.shadowRoot.querySelector('button'));
      await menu.updateComplete;
      await json.updateComplete;
      await userEvent.click(json.shadowRoot.querySelector('button'));
      await menu.updateComplete;
      expect(onChild).toHaveBeenCalledTimes(1);
      expect(onParent).not.toHaveBeenCalled();
      expect(onMenu).toHaveBeenCalledTimes(1);
      const event = onChild.mock.calls[0][0];
      expect(onMenu.mock.calls[0][0].detail).toBe(event.detail);
      expect(onMenu.mock.calls[0][0].target).toBe(menu);
      expect(event.target).toBe(json);
      expect(event.detail.origEvent.type).toBe('click');
      expect(menu.open).toBe(false);
      await userEvent.click(menu.shadowRoot.querySelector('.btn'));
      await waitFor(() => {
        expect(
          getComputedStyle(menu.shadowRoot.querySelector('.menu')).visibility
        ).toBe('visible');
      });
      await userEvent.click(parent.shadowRoot.querySelector('button'));
      await menu.updateComplete;
      await deeper.updateComplete;
      await userEvent.click(deeper.shadowRoot.querySelector('button'));
      await menu.updateComplete;
      await deep.updateComplete;
      await userEvent.click(deep.shadowRoot.querySelector('button'));
      await menu.updateComplete;
      expect(onChild).toHaveBeenCalledTimes(2);
      expect(onParent).not.toHaveBeenCalled();
      expect(onMenu).toHaveBeenCalledTimes(2);
      expect(onMenu.mock.calls[1][0].detail).toBe(
        onChild.mock.calls[1][0].detail
      );
      expect(menu.open).toBe(false);
      await userEvent.click(menu.shadowRoot.querySelector('.btn'));
      await waitFor(() => {
        expect(
          getComputedStyle(menu.shadowRoot.querySelector('.menu')).visibility
        ).toBe('visible');
      });
      await userEvent.click(parent.shadowRoot.querySelector('button'));
      await menu.updateComplete;
      await json.updateComplete;
      json.addEventListener('on-click', (e) => e.stopPropagation(), {
        once: true,
      });
      await userEvent.click(json.shadowRoot.querySelector('button'));
      await menu.updateComplete;
      expect(onChild).toHaveBeenCalledTimes(3);
      expect(onParent).not.toHaveBeenCalled();
      expect(onMenu).toHaveBeenCalledTimes(2);
      expect(menu.open).toBe(true);
      await userEvent.click(menu.shadowRoot.querySelector('.btn'));
      await waitFor(() => {
        expect(
          getComputedStyle(menu.shadowRoot.querySelector('.menu')).visibility
        ).toBe('hidden');
      });
    } finally {
      menu.removeEventListener('on-click', onMenu);
      parent.removeEventListener('on-click', onParent);
      json.removeEventListener('on-click', onChild);
      deeper.removeEventListener('on-click', onParent);
      deep.removeEventListener('on-click', onChild);
    }
  },
};

export const WrappedAncestorEventPropagation = {
  ...AncestorEventPropagation,
  render: WrappedItemBindings.render,
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

export const BackButtonKeyboardNavigation = {
  render: OriginalItemBindings.render,
  play: async ({ canvasElement }) => {
    const menu = canvasElement.querySelector('kyn-overflow-menu');
    const parent = menu.querySelector('#export');
    const json = menu.querySelector('#json');
    const zip = menu.querySelector('#zip');
    const deeper = menu.querySelector('#deeper');
    const action = (item) => item.shadowRoot.querySelector('button, a');
    const arrow = (item, key, keyCode) => {
      action(item).dispatchEvent(
        new KeyboardEvent('keydown', {
          key,
          keyCode,
          bubbles: true,
          composed: true,
        })
      );
    };
    const focusedBack = async () => {
      await menu.updateComplete;
      const back = menu.shadowRoot.querySelector('.submenu-back-item');
      await waitFor(() => {
        expect(back.shadowRoot.activeElement).toBe(action(back));
      });
      return back;
    };
    await menu.updateComplete;
    await parent.updateComplete;
    await userEvent.click(menu.shadowRoot.querySelector('.btn'));
    await waitFor(() => {
      expect(
        getComputedStyle(menu.shadowRoot.querySelector('.menu')).visibility
      ).toBe('visible');
    });
    await userEvent.click(action(parent));
    const back = await focusedBack();
    arrow(back, 'ArrowDown', 40);
    expect(json.shadowRoot.activeElement).toBe(action(json));
    arrow(json, 'ArrowUp', 38);
    expect(back.shadowRoot.activeElement).toBe(action(back));
    arrow(back, 'ArrowDown', 40);
    arrow(json, 'ArrowDown', 40);
    expect(zip.shadowRoot.activeElement).toBe(action(zip));
    arrow(zip, 'ArrowDown', 40);
    expect(deeper.shadowRoot.activeElement).toBe(action(deeper));
    await userEvent.keyboard('{Enter}');
    const deepBack = await focusedBack();
    arrow(deepBack, 'ArrowDown', 40);
    const deep = menu.querySelector('#deep');
    expect(deep.shadowRoot.activeElement).toBe(action(deep));
    arrow(deep, 'ArrowUp', 38);
    expect(deepBack.shadowRoot.activeElement).toBe(action(deepBack));
    await userEvent.keyboard('{Enter}');
    const previousBack = await focusedBack();
    expect(menu._getCurrentMenuItems()).toEqual([json, zip, deeper]);
    arrow(previousBack, 'ArrowUp', 38);
    expect(menu.shadowRoot.activeElement).toBe(
      menu.shadowRoot.querySelector('.btn')
    );
    action(previousBack).focus();
    await userEvent.keyboard(' ');
    await menu.updateComplete;
    await waitFor(() => {
      expect(parent.shadowRoot.activeElement).toBe(action(parent));
    });
    expect(menu.shadowRoot.querySelector('.submenu-back-item')).toBeNull();
    expect(menu.open).toBe(true);
    await userEvent.click(menu.shadowRoot.querySelector('.btn'));
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
    const disabledBack = menu.shadowRoot.querySelector('.submenu-back-item');
    action(disabledBack).dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'ArrowDown',
        keyCode: 40,
        bubbles: true,
        composed: true,
      })
    );
    expect(disabledBack.shadowRoot.activeElement).toBe(action(disabledBack));
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
