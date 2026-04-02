import { html } from 'lit';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { action } from 'storybook/actions';
import './index';
import '../header';
import '../../reusable/link';
import '../../reusable/search';

import exampleData from './example_workspace_switcher_data.json';

import userAvatarIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/user.svg';
import chevronDownIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/chevron-down.svg';
import helpIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/question.svg';
import circleIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/circle-stroke.svg';
import filledNotificationIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/notifications-new.svg';
import bridgeLogo from '@kyndryl-design-system/shidoka-foundation/assets/svg/bridge-logo-large.svg';

// --- Data setup ---

const defaultWorkspaceId = exampleData.defaultSelectedWorkspace;

const allItems = Object.values(exampleData.itemsByWorkspace).flatMap(
  (items) => items
);

const defaultItems = (
  exampleData.itemsByWorkspace[defaultWorkspaceId] || allItems
).map((item, index) => ({ ...item, selected: index === 0 }));

const workspaces = exampleData.workspaces.map((workspace) => ({
  ...workspace,
  count:
    workspace.id === 'global'
      ? null
      : exampleData.itemsByWorkspace[workspace.id]?.length || 0,
  selected: workspace.id === defaultWorkspaceId,
}));

const selectedItem = defaultItems.find((item) => item.selected);

// --- Helpers ---

const createAccountMeta = (name) =>
  /** @type {import('./workspaceSwitcher').WorkspaceSwitcherAccountMeta} */ ({
    name,
    items: [
      {
        text: exampleData.accountDetails.accountId,
        actionIcon: 'copy',
        copyValue: exampleData.accountDetails.accountId,
      },
      { text: exampleData.accountDetails.country },
    ],
  });

const renderAccountItem = (item, clickHandler) => html`
  <kyn-workspace-switcher-menu-item
    slot="right-list"
    variant="item"
    value=${item.id}
    name=${item.name}
    ?selected=${item.selected}
    ?favorited=${item.favorited}
    ?showLaunchIndicator=${item.opensInNewTab}
    ?showFavorite=${!item.hideFavorite}
    @on-click=${(e) => clickHandler(e, item)}
    @on-favorite-change=${(e) => action('on-favorite-change')(e.detail)}
  ></kyn-workspace-switcher-menu-item>
`;

/** item click handler — updates selected state and account meta info. */
const handleItemClick = (e, item) => {
  action('on-item-select')({ item });

  const switcher = e.target.closest('kyn-workspace-switcher');
  if (!switcher) return;

  switcher
    .querySelectorAll('kyn-workspace-switcher-menu-item[slot="right-list"]')
    .forEach((el) => {
      el.selected = el.value === item.id;
    });
  switcher.accountMeta = createAccountMeta(item.name);
};

/**
 * Factory for workspace click handlers.
 * The shared logic (view switch, selection update, item rebuild) is identical across stories — only the item click handler varies.
 */
const createWorkspaceClickHandler = (itemClickHandler) => (e, ws) => {
  action('on-workspace-select')({ workspace: ws });

  const switcher = e.target.closest('kyn-workspace-switcher');
  if (!switcher) return;

  switcher.view = 'detail';

  switcher
    .querySelectorAll('kyn-workspace-switcher-menu-item[slot="left-list"]')
    .forEach((el) => {
      el.selected = el.value === ws.id;
    });

  const newItems =
    ws.id === 'global' ? allItems : exampleData.itemsByWorkspace[ws.id] || [];

  switcher
    .querySelectorAll('kyn-workspace-switcher-menu-item[slot="right-list"]')
    .forEach((el) => el.remove());

  newItems.forEach((item) => {
    const el = document.createElement('kyn-workspace-switcher-menu-item');
    el.slot = 'right-list';
    el.variant = 'item';
    el.value = item.id;
    el.name = item.name;
    el.favorited = item.favorited || false;
    el.showLaunchIndicator = !!item.opensInNewTab;
    el.showFavorite = !item.hideFavorite;
    el.addEventListener('on-click', (ev) => itemClickHandler(ev, item));
    el.addEventListener('on-favorite-change', (ev) =>
      action('on-favorite-change')(ev.detail)
    );
    switcher.appendChild(el);
  });
};

const handleWorkspaceClick = createWorkspaceClickHandler(handleItemClick);

const getSwitcherStyle = (args) =>
  `--kyn-workspace-switcher-max-height: ${args['--kyn-workspace-switcher-max-height']};`;

export default {
  title: 'Global Components/Workspace Switcher',
  component: 'kyn-workspace-switcher',
  subcomponents: {
    'kyn-workspace-switcher-menu-item': 'kyn-workspace-switcher-menu-item',
  },
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
  argTypes: {
    '--kyn-workspace-switcher-max-height': {
      name: '--kyn-workspace-switcher-max-height',
      control: { type: 'text' },
      description: 'CSS custom property: max height of the switcher panel.',
      table: {
        category: 'CSS Custom Properties',
        defaultValue: { summary: 'none' },
      },
    },
    'on-click': {
      description:
        'Fired when a menu item is clicked. detail: { value: string }',
      table: { category: 'Events' },
      control: false,
    },
    'on-favorite-change': {
      description:
        'Fired when a favorite is toggled. detail: { value: string, favorited: boolean }',
      table: { category: 'Events' },
      control: false,
    },
  },
  args: {
    hideCurrentTitle: false,
    hideWorkspacesTitle: false,
    textStrings: {
      currentTitle: 'CURRENT',
      workspacesTitle: 'WORKSPACES',
      backToWorkspaces: 'Workspaces',
      launchAssistiveText: 'Opens in a new tab',
    },
    '--kyn-workspace-switcher-max-height': 'none',
  },
  decorators: [
    (story) => html`
      <style>
        .workspace-switcher-search {
          margin-bottom: 0;
          padding: 4px 8px 2px 0;
        }

        @media (max-width: calc(52rem - 0.001px)) {
          .workspace-switcher-search {
            padding: 4px 0 2px 0;
          }
        }
      </style>
      ${story()}
    `,
  ],
};

// --- header flyout ---

const handleUIItemClick = (e, item) => {
  handleItemClick(e, item);

  const flyout = e.target.closest('kyn-header-flyout');
  if (flyout) {
    const nameEl = flyout.querySelector('.account-name');
    if (nameEl) nameEl.textContent = item.name;
    flyout.label = item.name;
  }
};

const handleUIWorkspaceClick = createWorkspaceClickHandler(handleUIItemClick);

const handleFlyoutToggle = (e) => {
  const chevron = e.target.querySelector('.account-chevron');
  if (chevron) {
    chevron.style.transform = e.detail.open ? 'rotate(180deg)' : 'rotate(0deg)';
  }
};

export const UIImplementation = {
  decorators: [
    (story) =>
      html`
        <style>
          .account-name {
            max-width: 200px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .account-chevron {
            display: flex;
            transition: transform 0.2s;
          }

          .ui-impl-switcher {
            width: 625px;
          }

          @media (max-width: calc(52rem - 0.001px)) {
            .ui-impl-switcher {
              max-width: 375px;
            }

            .account-chevron {
              display: none;
            }
          }

          @media (max-width: calc(42rem - 0.001px)) {
            .ui-impl-switcher {
              width: 100%;
              max-width: none;
            }
          }
        </style>
        <div
          style="height: 100vh; min-height: 500px; transform: translate3d(0,0,0); margin: var(--kd-negative-page-gutter);"
        >
          ${story()}
        </div>
      `,
  ],
  render: (args) => html`
    <kyn-header rootUrl="/" appTitle="Bridge">
      <span slot="logo" style="--kyn-header-logo-width: 120px;">
        ${unsafeSVG(bridgeLogo)}
      </span>
      <kyn-header-nav>
        <kyn-header-link href="javascript:void(0)">
          <span>${unsafeSVG(circleIcon)}</span>
          Dashboard
        </kyn-header-link>
        <kyn-header-link href="javascript:void(0)">
          <span>${unsafeSVG(circleIcon)}</span>
          Services
        </kyn-header-link>
        <kyn-header-link href="javascript:void(0)">
          <span>${unsafeSVG(circleIcon)}</span>
          Reports
        </kyn-header-link>
        <kyn-header-link href="javascript:void(0)">
          <span>${unsafeSVG(circleIcon)}</span>
          Administration
        </kyn-header-link>
      </kyn-header-nav>

      <kyn-header-flyouts>
        <kyn-header-flyout
          label=${selectedItem?.name || ''}
          hideMenuLabel
          hideButtonLabel
          noPadding
          @on-flyout-toggle=${handleFlyoutToggle}
        >
          <span
            slot="button"
            style="display: flex; align-items: center; gap: 8px; font-size: 14px;"
          >
            <span class="account-name">${selectedItem?.name || ''}</span>
            <span class="account-chevron">${unsafeSVG(chevronDownIcon)}</span>
          </span>

          <kyn-workspace-switcher
            style=${getSwitcherStyle(args)}
            class="ui-impl-switcher"
            .accountMeta=${createAccountMeta(selectedItem?.name || '')}
            .textStrings=${args.textStrings}
            ?hideCurrentTitle=${args.hideCurrentTitle}
            ?hideWorkspacesTitle=${args.hideWorkspacesTitle}
          >
            ${workspaces.map(
              (ws) => html`
                <kyn-workspace-switcher-menu-item
                  slot="left-list"
                  variant="workspace"
                  value=${ws.id}
                  name=${ws.name}
                  .count=${ws.count ?? null}
                  ?selected=${ws.selected}
                  @on-click=${(e) => handleUIWorkspaceClick(e, ws)}
                ></kyn-workspace-switcher-menu-item>
              `
            )}
            ${defaultItems.map((item) =>
              renderAccountItem(item, handleUIItemClick)
            )}
          </kyn-workspace-switcher>
        </kyn-header-flyout>

        <kyn-header-flyout label="Notifications" hideMenuLabel>
          <span slot="button">${unsafeSVG(filledNotificationIcon)}</span>

          <kyn-header-link href="javascript:void(0)">
            <span>${unsafeSVG(circleIcon)}</span>
            System update scheduled
          </kyn-header-link>
          <kyn-header-link href="javascript:void(0)">
            <span>${unsafeSVG(circleIcon)}</span>
            New report available
          </kyn-header-link>
        </kyn-header-flyout>

        <kyn-header-flyout label="Help">
          <span slot="button">${unsafeSVG(helpIcon)}</span>

          <kyn-header-link href="javascript:void(0)">
            <span>${unsafeSVG(circleIcon)}</span>
            Documentation
          </kyn-header-link>
          <kyn-header-link href="javascript:void(0)">
            <span>${unsafeSVG(circleIcon)}</span>
            Support
          </kyn-header-link>
        </kyn-header-flyout>

        <kyn-header-flyout label="User Profile" hideMenuLabel>
          <span slot="button">${unsafeSVG(userAvatarIcon)}</span>

          <kyn-header-user-profile
            name="User Name"
            subtitle="Job Title"
            email="user@kyndryl.com"
            profileLink="#"
          >
          </kyn-header-user-profile>

          <kyn-header-link href="javascript:void(0)">
            Profile Settings
          </kyn-header-link>
          <kyn-header-link href="javascript:void(0)">
            Sign Out
          </kyn-header-link>
        </kyn-header-flyout>
      </kyn-header-flyouts>
    </kyn-header>
  `,
};

export const FullWorkspaceInfo = {
  render: (args) => html`
    <kyn-workspace-switcher
      style=${getSwitcherStyle(args)}
      .accountMeta=${createAccountMeta(selectedItem?.name || '')}
      .textStrings=${args.textStrings}
      ?hideCurrentTitle=${args.hideCurrentTitle}
      ?hideWorkspacesTitle=${args.hideWorkspacesTitle}
    >
      ${workspaces.map(
        (ws) => html`
          <kyn-workspace-switcher-menu-item
            slot="left-list"
            variant="workspace"
            value=${ws.id}
            name=${ws.name}
            .count=${ws.count ?? null}
            ?selected=${ws.selected}
            @on-click=${(e) => handleWorkspaceClick(e, ws)}
          ></kyn-workspace-switcher-menu-item>
        `
      )}
      ${defaultItems.map((item) => renderAccountItem(item, handleItemClick))}
    </kyn-workspace-switcher>
  `,
};

export const SimpleWorkspaceInfo = {
  args: {
    hideWorkspacesTitle: true,
  },
  render: (args) => html`
    <kyn-workspace-switcher
      style=${getSwitcherStyle(args)}
      .accountMeta=${createAccountMeta(selectedItem?.name || '')}
      .textStrings=${args.textStrings}
      ?hideCurrentTitle=${args.hideCurrentTitle}
      ?hideWorkspacesTitle=${args.hideWorkspacesTitle}
    >
      ${workspaces.map(
        (ws) => html`
          <kyn-workspace-switcher-menu-item
            slot="left-list"
            variant="workspace"
            value=${ws.id}
            name=${ws.name}
            .count=${ws.count ?? null}
            ?selected=${ws.selected}
            hideWorkspacesTitle
            @on-click=${(e) => handleWorkspaceClick(e, ws)}
          ></kyn-workspace-switcher-menu-item>
        `
      )}
      ${defaultItems.map((item) => renderAccountItem(item, handleItemClick))}
    </kyn-workspace-switcher>
  `,
};

export const WithSearch = {
  render: (args) => html`
    <kyn-workspace-switcher
      style=${getSwitcherStyle(args)}
      .accountMeta=${createAccountMeta(selectedItem?.name || '')}
      .textStrings=${args.textStrings}
      ?hideCurrentTitle=${args.hideCurrentTitle}
      ?hideWorkspacesTitle=${args.hideWorkspacesTitle}
    >
      ${workspaces.map(
        (ws) => html`
          <kyn-workspace-switcher-menu-item
            slot="left-list"
            variant="workspace"
            value=${ws.id}
            name=${ws.name}
            .count=${ws.count ?? null}
            ?selected=${ws.selected}
            @on-click=${(e) => handleWorkspaceClick(e, ws)}
          ></kyn-workspace-switcher-menu-item>
        `
      )}

      <kyn-search
        slot="right"
        size="sm"
        label="Search"
        class="workspace-switcher-search"
        @on-input=${(e) => action('on-search')(e.detail)}
      ></kyn-search>

      ${defaultItems.map((item) => renderAccountItem(item, handleItemClick))}
    </kyn-workspace-switcher>
  `,
};
