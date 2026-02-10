import { html } from 'lit';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { action } from 'storybook/actions';
import './index';
import '../header';
import '../../reusable/link';
import '../../reusable/search';
import exampleData from './example_account_switcher_data.json';

import checkmarkFilledIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/checkmark-filled.svg';
import copyIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/copy.svg';
import userAvatarIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/user.svg';
import chevronDownIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/chevron-down.svg';
import helpIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/question.svg';
import circleIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/circle-stroke.svg';
import filledNotificationIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/notifications-new.svg';

// --- Data setup (unchanged from before) ---

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

/** Render workspace menu items for the workspaces slot. */
const renderWorkspaces = (onWorkspaceClick) => html`
  ${workspaces.map(
    (ws) => html`
      <kyn-account-switcher-menu-item
        slot="left-list"
        variant="workspace"
        value=${ws.id}
        name=${ws.name}
        .count=${ws.count ?? null}
        ?selected=${ws.selected}
        @on-click=${(e) => onWorkspaceClick(e, ws)}
      ></kyn-account-switcher-menu-item>
    `
  )}
`;

/** Render item menu items for the items slot. */
const renderItems = (items, onItemClick) => html`
  ${items.map(
    (item) => html`
      <kyn-account-switcher-menu-item
        slot="right-list"
        variant="item"
        value=${item.id}
        name=${item.name}
        ?selected=${item.selected}
        ?favorited=${item.favorited}
        showFavorite
        @on-click=${(e) => onItemClick(e, item)}
        @on-favorite-change=${(e) => action('on-favorite-change')(e.detail)}
      ></kyn-account-switcher-menu-item>
    `
  )}
`;

/** Account header with full metadata (name, account ID, country). */
const renderFullAccountHeader = (name) => html`
  <div
    slot="left"
    style="
      display: flex; flex-direction: column; gap: 2px;
      padding-bottom: 12px; margin: 0 auto 12px;
      border-bottom: 1px solid var(--kd-color-border-variants-light);
      width: 100%; box-sizing: border-box;
    "
  >
    <div style="display: flex; align-items: flex-start; gap: 8px;">
      <span
        style="display: flex; align-items: center; color: var(--kd-color-badge-heavy-background-success);"
        >${unsafeSVG(checkmarkFilledIcon)}</span
      >
      <div style="display: flex; flex-direction: column;">
        <span
          style="
            max-width: 25ch; overflow: hidden; text-overflow: ellipsis;
            white-space: nowrap; color: var(--kd-color-text-level-primary);
          "
          >${name}</span
        >
        <kyn-link standalone animationInactive href="javascript:void(0)">
          ${exampleData.accountDetails.accountId}
          <span slot="icon">${unsafeSVG(copyIcon)}</span>
        </kyn-link>
        <span style="color: var(--kd-color-text-level-primary);"
          >${exampleData.accountDetails.country}</span
        >
      </div>
    </div>
  </div>
`;

/** Account header with just the name. */
const renderSimpleAccountHeader = (name) => html`
  <div
    slot="left"
    style="
      display: flex; flex-direction: column; gap: 2px;
      padding-bottom: 12px; margin: 0 auto 12px;
      border-bottom: 1px solid var(--kd-color-border-variants-light);
      width: 100%; box-sizing: border-box;
    "
  >
    <div style="display: flex; align-items: flex-start; gap: 8px;">
      <span
        style="display: flex; align-items: center; color: var(--kd-color-badge-heavy-background-success);"
        >${unsafeSVG(checkmarkFilledIcon)}</span
      >
      <span
        style="
          max-width: 25ch; overflow: hidden; text-overflow: ellipsis;
          white-space: nowrap; color: var(--kd-color-text-level-primary);
        "
        >${name}</span
      >
    </div>
  </div>
`;

/**
 * Basic workspace click handler for standalone stories.
 * Updates the right-panel items by replacing them in the DOM.
 */
const handleWorkspaceClick = (e, ws) => {
  action('on-workspace-select')({ workspace: ws });

  const switcher = e.target.closest('kyn-account-switcher');
  if (!switcher) return;

  // Transition to detail view (mobile drill-down)
  switcher.view = 'detail';

  // Update selected state on workspace items
  switcher
    .querySelectorAll('kyn-account-switcher-menu-item[slot="left-list"]')
    .forEach((el) => {
      el.selected = el.value === ws.id;
    });

  // Determine new items
  const newItems =
    ws.id === 'global' ? allItems : exampleData.itemsByWorkspace[ws.id] || [];

  // Remove existing right-slot items
  switcher
    .querySelectorAll('kyn-account-switcher-menu-item[slot="right-list"]')
    .forEach((el) => el.remove());

  // Append new items
  newItems.forEach((item) => {
    const el = document.createElement('kyn-account-switcher-menu-item');
    el.slot = 'items';
    el.variant = 'item';
    el.value = item.id;
    el.name = item.name;
    el.favorited = item.favorited || false;
    el.showFavorite = true;
    el.addEventListener('on-click', (ev) => handleItemClick(ev, item));
    el.addEventListener('on-favorite-change', (ev) =>
      action('on-favorite-change')(ev.detail)
    );
    switcher.appendChild(el);
  });
};

/** Item click handler — updates selected state. */
const handleItemClick = (e, item) => {
  action('on-item-select')({ item });

  const switcher = e.target.closest('kyn-account-switcher');
  if (!switcher) return;

  // Update selected state on item menu items
  switcher
    .querySelectorAll('kyn-account-switcher-menu-item[slot="right-list"]')
    .forEach((el) => {
      el.selected = el.value === item.id;
    });
};

// --- Story config ---

export default {
  title: 'Global Components/Account Switcher',
  component: 'kyn-account-switcher',
  subcomponents: {
    'kyn-account-switcher-menu-item': 'kyn-account-switcher-menu-item',
  },
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
};

// --- Stories ---

export const FullAccountInfo = {
  render: () => html`
    <kyn-account-switcher style="--kyn-account-switcher-max-height: 450px">
      ${renderFullAccountHeader(selectedItem?.name || '')}
      ${renderWorkspaces(handleWorkspaceClick)}
      ${renderItems(defaultItems, handleItemClick)}
    </kyn-account-switcher>
  `,
};

export const SimpleAccountInfo = {
  render: () => html`
    <kyn-account-switcher style="--kyn-account-switcher-max-height: 450px">
      ${renderSimpleAccountHeader(selectedItem?.name || '')}
      ${renderWorkspaces(handleWorkspaceClick)}
      ${renderItems(defaultItems, handleItemClick)}
    </kyn-account-switcher>
  `,
};

export const WithSearch = {
  render: () => html`
    <kyn-account-switcher style="--kyn-account-switcher-max-height: 450px">
      ${renderFullAccountHeader(selectedItem?.name || '')}
      ${renderWorkspaces(handleWorkspaceClick)}
      <kyn-search
        slot="right"
        size="sm"
        label="Search"
        @on-input=${(e) => action('on-search')(e.detail)}
        style="margin-bottom: 0; padding: 4px 8px 2px 0;"
      ></kyn-search>
      ${renderItems(defaultItems, handleItemClick)}
    </kyn-account-switcher>
  `,
};

// --- UIImplementation with header flyout ---

const truncateName = (name, maxLen = 20) =>
  name.length > maxLen ? name.slice(0, maxLen) + '…' : name;

const handleUIItemClick = (e, item) => {
  handleItemClick(e, item);

  const flyout = e.target.closest('kyn-header-flyout');
  if (flyout) {
    const nameEl = flyout.querySelector('.account-name');
    if (nameEl) nameEl.textContent = truncateName(item.name);
    flyout.label = truncateName(item.name);
  }
};

/** Workspace click handler for UIImplementation — uses the UIItemClick handler. */
const handleUIWorkspaceClick = (e, ws) => {
  action('on-workspace-select')({ workspace: ws });

  const switcher = e.target.closest('kyn-account-switcher');
  if (!switcher) return;

  switcher.view = 'detail';

  switcher
    .querySelectorAll('kyn-account-switcher-menu-item[slot="left-list"]')
    .forEach((el) => {
      el.selected = el.value === ws.id;
    });

  const newItems =
    ws.id === 'global' ? allItems : exampleData.itemsByWorkspace[ws.id] || [];

  switcher
    .querySelectorAll('kyn-account-switcher-menu-item[slot="right-list"]')
    .forEach((el) => el.remove());

  newItems.forEach((item) => {
    const el = document.createElement('kyn-account-switcher-menu-item');
    el.slot = 'items';
    el.variant = 'item';
    el.value = item.id;
    el.name = item.name;
    el.favorited = item.favorited || false;
    el.showFavorite = true;
    el.addEventListener('on-click', (ev) => handleUIItemClick(ev, item));
    el.addEventListener('on-favorite-change', (ev) =>
      action('on-favorite-change')(ev.detail)
    );
    switcher.appendChild(el);
  });
};

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
        <div
          style="height: 100vh; min-height: 500px; transform: translate3d(0,0,0); margin: var(--kd-negative-page-gutter);"
        >
          ${story()}
        </div>
      `,
  ],
  render: () => html`
    <kyn-header rootUrl="/" appTitle="Bridge">
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
          label=${truncateName(selectedItem?.name || '')}
          hideMenuLabel
          @on-flyout-toggle=${handleFlyoutToggle}
        >
          <span
            slot="button"
            style="display: flex; align-items: center; gap: 8px; font-size: 14px;"
          >
            <span class="account-name"
              >${truncateName(selectedItem?.name || '')}</span
            >
            <span
              class="account-chevron"
              style="display: flex; transition: transform 0.2s;"
              >${unsafeSVG(chevronDownIcon)}</span
            >
          </span>

          <kyn-account-switcher
            style="--kyn-account-switcher-max-height: 450px; width: 625px;"
          >
            ${renderFullAccountHeader(selectedItem?.name || '')}
            ${renderWorkspaces(handleUIWorkspaceClick)}
            ${renderItems(defaultItems, handleUIItemClick)}
          </kyn-account-switcher>
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
