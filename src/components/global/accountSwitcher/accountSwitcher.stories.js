import { html } from 'lit';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { action } from 'storybook/actions';
import './index';
import '../header';
import exampleData from './example_account_switcher_data.json';

import userAvatarIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/user.svg';
import helpIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/question.svg';

// All items aggregated for Global Zone default view
const allItems = Object.entries(exampleData.itemsByWorkspace)
  .filter(([key]) => key !== 'global')
  .flatMap(([, items]) => items);

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
      .currentAccount=${exampleData.currentAccount}
      .workspaces=${exampleData.workspaces}
      .items=${allItems}
      @on-workspace-select=${handleWorkspaceSelect}
      @on-item-select=${(e) => action('on-item-select')(e.detail)}
      @on-favorite-change=${(e) => action('on-favorite-change')(e.detail)}
    ></kyn-account-switcher>
  `,
};

export const SimpleAccountInfo = {
  render: () => html`
    <kyn-account-switcher
      .currentAccount=${exampleData.simpleCurrentAccount}
      .workspaces=${exampleData.workspaces}
      .items=${allItems}
      @on-workspace-select=${handleWorkspaceSelect}
      @on-item-select=${(e) => action('on-item-select')(e.detail)}
      @on-favorite-change=${(e) => action('on-favorite-change')(e.detail)}
    ></kyn-account-switcher>
  `,
};

export const WithSearch = {
  render: () => html`
    <kyn-account-switcher
      .currentAccount=${exampleData.currentAccount}
      .workspaces=${exampleData.workspaces}
      .items=${allItems}
      showSearch
      searchLabel="Search"
      @on-workspace-select=${handleWorkspaceSelect}
      @on-item-select=${(e) => action('on-item-select')(e.detail)}
      @on-favorite-change=${(e) => action('on-favorite-change')(e.detail)}
      @on-search=${(e) => action('on-search')(e.detail)}
    ></kyn-account-switcher>
  `,
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
        <kyn-header-flyout label="Account Switcher" hideMenuLabel>
          <span slot="button">${unsafeSVG(helpIcon)}</span>

          <kyn-account-switcher
            .currentAccount=${exampleData.currentAccount}
            .workspaces=${exampleData.workspaces}
            .items=${allItems}
            @on-workspace-select=${handleWorkspaceSelect}
            @on-item-select=${(e) => action('on-item-select')(e.detail)}
            @on-favorite-change=${(e) => action('on-favorite-change')(e.detail)}
          ></kyn-account-switcher>
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
