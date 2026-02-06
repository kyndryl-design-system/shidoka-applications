import { html } from 'lit';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { action } from 'storybook/actions';
import './index';
import '../header';
import exampleData from './example_account_switcher_data.json';

import userAvatarIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/user.svg';
import chevronDownIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/chevron-down.svg';
import helpIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/question.svg';
import circleIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/circle-stroke.svg';

// All items aggregated for Global Zone default view
// Mark the first item as selected by default
const allItems = Object.entries(exampleData.itemsByWorkspace)
  .filter(([key]) => key !== 'global')
  .flatMap(([, items]) => items)
  .map((item, index) => ({ ...item, selected: index === 0 }));

// Workspaces with counts computed from actual items data
const workspaces = exampleData.workspaces.map((workspace) => ({
  ...workspace,
  count:
    workspace.id === 'global'
      ? null
      : exampleData.itemsByWorkspace[workspace.id]?.length || 0,
}));

// Current account derives its name from the selected item
// In production, apps would manage this via their state management
const selectedItem = allItems.find((item) => item.selected) || allItems[0];

// Full account info includes additional metadata (accountId, country)
const fullCurrentAccount = {
  name: selectedItem?.name || '',
  ...exampleData.accountDetails,
};

// Simple account info only has the name
const simpleCurrentAccount = {
  name: selectedItem?.name || '',
};

// Consuming apps are responsible for managing their own data. Real apps will likely
// fetch items from an API when a workspace is selected, use their own state management,
// or have different data structures. The component just emits events and accepts items.
const handleWorkspaceSelect = (e) => {
  action('on-workspace-select')(e.detail);
  const workspaceId = e.detail.workspace.id;
  const switcher = e.target.closest('kyn-account-switcher') || e.target;

  if (workspaceId === 'global') {
    switcher.items = allItems;
  } else {
    switcher.items = exampleData.itemsByWorkspace[workspaceId] || [];
  }
};

// When an item is selected, update the currentAccount name while preserving other fields.
// In production, apps would typically update their state management and re-render.
const handleItemSelect = (e) => {
  action('on-item-select')(e.detail);
  const switcher = e.target.closest('kyn-account-switcher') || e.target;
  switcher.currentAccount = {
    ...switcher.currentAccount,
    name: e.detail.item.name,
  };
};

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

export const FullAccountInfo = {
  render: () => html`
    <kyn-account-switcher
      .currentAccount=${fullCurrentAccount}
      .workspaces=${workspaces}
      .items=${allItems}
      @on-workspace-select=${handleWorkspaceSelect}
      @on-item-select=${handleItemSelect}
      @on-favorite-change=${(e) => action('on-favorite-change')(e.detail)}
    ></kyn-account-switcher>
  `,
};

export const SimpleAccountInfo = {
  render: () => html`
    <kyn-account-switcher
      .currentAccount=${simpleCurrentAccount}
      .workspaces=${workspaces}
      .items=${allItems}
      @on-workspace-select=${handleWorkspaceSelect}
      @on-item-select=${handleItemSelect}
      @on-favorite-change=${(e) => action('on-favorite-change')(e.detail)}
    ></kyn-account-switcher>
  `,
};

export const WithSearch = {
  render: () => html`
    <kyn-account-switcher
      .currentAccount=${fullCurrentAccount}
      .workspaces=${workspaces}
      .items=${allItems}
      showSearch
      @on-workspace-select=${handleWorkspaceSelect}
      @on-item-select=${handleItemSelect}
      @on-favorite-change=${(e) => action('on-favorite-change')(e.detail)}
      @on-search=${(e) => action('on-search')(e.detail)}
    ></kyn-account-switcher>
  `,
};

const truncateName = (name, maxLen = 10) =>
  name.length > maxLen ? name.slice(0, maxLen) + '…' : name;

const handleUIItemSelect = (e) => {
  handleItemSelect(e);
  const name = e.detail.item.name;
  const flyout = e.target.closest('kyn-header-flyout');
  if (flyout) {
    const nameEl = flyout.querySelector('.account-name');
    if (nameEl) nameEl.textContent = truncateName(name);
    flyout.label = truncateName(name);
  }
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
    <kyn-header rootUrl="/" appTitle="Application">
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
            .currentAccount=${fullCurrentAccount}
            .workspaces=${workspaces}
            .items=${allItems}
            @on-workspace-select=${handleWorkspaceSelect}
            @on-item-select=${handleUIItemSelect}
            @on-favorite-change=${(e) => action('on-favorite-change')(e.detail)}
          ></kyn-account-switcher>
        </kyn-header-flyout>

        <kyn-header-flyout label="Menu Label">
          <span slot="button">${unsafeSVG(helpIcon)}</span>

          <kyn-header-link href="javascript:void(0)">
            <span>${unsafeSVG(circleIcon)}</span>
            Example 1
          </kyn-header-link>
          <kyn-header-link href="javascript:void(0)">
            <span>${unsafeSVG(circleIcon)}</span>
            Example 2
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
