import { expect, userEvent, waitFor } from 'storybook/test';

import * as WorkspaceSwitcherStories from './WorkspaceSwitcher.stories.js';

export default {
  title: 'Tests/Patterns/Workspace Switcher',
  tags: ['!autodocs'],
  parameters: {
    docs: {
      disable: true,
    },
    controls: {
      disable: true,
    },
  },
};

export const WorkspaceSelectionUpdatesPatternState = {
  args: {
    ...WorkspaceSwitcherStories.default.args,
  },
  render: WorkspaceSwitcherStories.FullWorkspaceInfo.render,
  play: async ({ canvasElement }) => {
    const host = canvasElement.querySelector('.workspace-switcher-host');
    expect(host).not.toBeNull();

    const leftPanel = canvasElement.querySelector('.workspace-switcher__left');
    const rightPanel = canvasElement.querySelector(
      '.workspace-switcher__right'
    );

    expect(
      leftPanel?.classList.contains('workspace-switcher__panel--active')
    ).toBe(true);
    expect(
      rightPanel?.classList.contains('workspace-switcher__panel--inactive')
    ).toBe(true);

    const aiopsButton = Array.from(
      canvasElement.querySelectorAll('.workspace-switcher__menu-button')
    ).find((button) => button.textContent?.includes('AIOps Account'));

    expect(aiopsButton?.textContent).toContain('Opens in a new tab');

    const computeZonesButton = Array.from(
      canvasElement.querySelectorAll('.workspace-switcher__menu-button')
    ).find((button) => button.textContent?.includes('Compute Zones'));

    expect(computeZonesButton).toBeTruthy();

    await userEvent.click(computeZonesButton);

    await waitFor(() => {
      expect(host.getAttribute('data-view')).toBe('detail');
      expect(canvasElement.textContent).toContain('US East (Virginia)');
      expect(
        leftPanel?.classList.contains('workspace-switcher__panel--inactive')
      ).toBe(true);
      expect(
        rightPanel?.classList.contains('workspace-switcher__panel--active')
      ).toBe(true);
    });

    const usEastButton = Array.from(
      canvasElement.querySelectorAll('.workspace-switcher__menu-button')
    ).find((button) => button.textContent?.includes('US East (Virginia)'));

    expect(usEastButton).toBeTruthy();

    await userEvent.click(usEastButton);

    await waitFor(() => {
      const accountMetaName = canvasElement.querySelector(
        '.workspace-switcher__account-meta-name'
      );

      expect(accountMetaName?.textContent?.trim()).toBe('US East (Virginia)');
      expect(
        canvasElement.querySelector(
          '.workspace-switcher__menu-item--item.workspace-switcher__menu-item--selected[data-value="c-1"]'
        )
      ).not.toBeNull();
    });

    const backButton = canvasElement.querySelector(
      '.workspace-switcher__menu-item--back .workspace-switcher__menu-button'
    );

    expect(backButton).not.toBeNull();
    await userEvent.click(backButton);

    await waitFor(() => {
      expect(host.getAttribute('data-view')).toBe('root');
      expect(
        leftPanel?.classList.contains('workspace-switcher__panel--active')
      ).toBe(true);
      expect(
        rightPanel?.classList.contains('workspace-switcher__panel--inactive')
      ).toBe(true);
    });
  },
};

export const WithSearchFiltersAccountItems = {
  args: {
    ...WorkspaceSwitcherStories.default.args,
  },
  render: WorkspaceSwitcherStories.WithSearch.render,
  play: async ({ canvasElement }) => {
    const search = canvasElement.querySelector('kyn-search');
    expect(search).not.toBeNull();

    search.dispatchEvent(
      new CustomEvent('on-input', {
        bubbles: true,
        composed: true,
        detail: {
          value: 'gamma',
          origEvent: new InputEvent('input'),
        },
      })
    );

    await waitFor(() => {
      expect(canvasElement.textContent).toContain('Gamma Holdings');
      expect(canvasElement.textContent).not.toContain('Beta Industries');
      expect(canvasElement.textContent).not.toContain('AIOps Account');
    });
  },
};

export const LaunchIndicatorTriggersSameRowSelection = {
  args: {
    ...WorkspaceSwitcherStories.default.args,
  },
  render: WorkspaceSwitcherStories.FullWorkspaceInfo.render,
  play: async ({ canvasElement }) => {
    const launchButton = canvasElement.querySelector(
      '[aria-label="AIOps Account. Opens in a new tab"]'
    );

    expect(launchButton).not.toBeNull();

    await userEvent.click(launchButton);

    await waitFor(() => {
      const accountMetaName = canvasElement.querySelector(
        '.workspace-switcher__account-meta-name'
      );

      expect(accountMetaName?.textContent?.trim()).toBe('AIOps Account');
      expect(
        canvasElement.querySelector(
          '.workspace-switcher__menu-item--item.workspace-switcher__menu-item--selected[data-value="t-1"]'
        )
      ).not.toBeNull();
    });
  },
};

export const CopyFeedbackResetsWhenSelectingAnotherItem = {
  args: {
    ...WorkspaceSwitcherStories.default.args,
  },
  render: WorkspaceSwitcherStories.FullWorkspaceInfo.render,
  play: async ({ canvasElement }) => {
    const view = canvasElement.ownerDocument.defaultView;
    Object.defineProperty(view.navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async () => {},
      },
    });

    const copyButton = canvasElement.querySelector(
      '.workspace-switcher__account-meta-action'
    );

    expect(copyButton).not.toBeNull();
    const initialMarkup = copyButton.innerHTML;

    await userEvent.click(copyButton);

    await waitFor(() => {
      expect(
        canvasElement.querySelector('.workspace-switcher__account-meta-action')
          ?.innerHTML
      ).not.toBe(initialMarkup);
    });

    const aiopsButton = Array.from(
      canvasElement.querySelectorAll('.workspace-switcher__menu-button')
    ).find((button) => button.textContent?.includes('AIOps Account'));

    expect(aiopsButton).toBeTruthy();

    await userEvent.click(aiopsButton);

    await waitFor(() => {
      const accountMetaName = canvasElement.querySelector(
        '.workspace-switcher__account-meta-name'
      );
      const currentCopyButton = canvasElement.querySelector(
        '.workspace-switcher__account-meta-action'
      );

      expect(accountMetaName?.textContent?.trim()).toBe('AIOps Account');
      expect(currentCopyButton?.innerHTML).toBe(initialMarkup);
    });
  },
};

export const UIImplementationResetsDetailViewOnFlyoutClose = {
  args: {
    ...WorkspaceSwitcherStories.default.args,
  },
  render: WorkspaceSwitcherStories.UIImplementation.render,
  decorators: WorkspaceSwitcherStories.UIImplementation.decorators,
  play: async ({ canvasElement }) => {
    const flyout = canvasElement.querySelector('kyn-header-flyout');
    const host = canvasElement.querySelector('.workspace-switcher-host');

    expect(flyout).not.toBeNull();
    expect(host).not.toBeNull();

    const computeZonesButton = Array.from(
      canvasElement.querySelectorAll('.workspace-switcher__menu-button')
    ).find((button) => button.textContent?.includes('Compute Zones'));

    expect(computeZonesButton).toBeTruthy();

    await userEvent.click(computeZonesButton);

    await waitFor(() => {
      expect(host.getAttribute('data-view')).toBe('detail');
    });

    flyout.dispatchEvent(
      new CustomEvent('on-flyout-toggle', {
        bubbles: true,
        composed: true,
        detail: { open: false },
      })
    );

    await waitFor(() => {
      expect(host.getAttribute('data-view')).toBe('root');
    });
  },
};
