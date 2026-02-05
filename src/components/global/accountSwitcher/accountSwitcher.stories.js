import { html, LitElement } from 'lit';
import { action } from 'storybook/actions';
import './index';
import exampleData from './example_account_switcher_data.json';

// Wrapper component for interactive demo with state management
class AccountSwitcherDemo extends LitElement {
  static properties = {
    currentAccount: { type: Object },
    showSearch: { type: Boolean },
    searchLabel: { type: String },
    _currentItems: { state: true },
    _baseItems: { state: true },
    _currentWorkspaceId: { state: true },
  };

  constructor() {
    super();
    const defaultWorkspaceId = exampleData.defaultSelectedWorkspace;
    this.currentAccount = exampleData.currentAccount;
    this.showSearch = true;
    this.searchLabel = 'Search';
    this._currentWorkspaceId = defaultWorkspaceId;
    this._baseItems = [...exampleData.itemsByWorkspace[defaultWorkspaceId]];
    this._currentItems = [...this._baseItems];
  }

  // Disable shadow DOM so styles from parent work
  createRenderRoot() {
    return this;
  }

  _handleWorkspaceSelect(e) {
    action('on-workspace-select')(e.detail);
    const workspaceId = e.detail.workspace.id;

    this._currentWorkspaceId = workspaceId;

    // Global Zone shows all items from all workspaces
    if (workspaceId === 'global') {
      const allItems = Object.entries(exampleData.itemsByWorkspace)
        .filter(([key]) => key !== 'global')
        .flatMap(([, items]) => items);
      this._baseItems = [...allItems];
    } else {
      this._baseItems = [...(exampleData.itemsByWorkspace[workspaceId] || [])];
    }
    this._currentItems = [...this._baseItems];
  }

  _handleItemSelect(e) {
    action('on-item-select')(e.detail);
    const selectedId = e.detail.item.id;

    this._currentItems = this._currentItems.map((item) => ({
      ...item,
      selected: item.id === selectedId,
    }));
  }

  _handleSearch(e) {
    action('on-search')(e.detail);
    const searchValue = e.detail.value.toLowerCase().trim();

    if (searchValue) {
      this._currentItems = this._baseItems.filter((item) =>
        item.name.toLowerCase().includes(searchValue)
      );
    } else {
      this._currentItems = [...this._baseItems];
    }
  }

  _handleFavoriteChange(e) {
    action('on-favorite-change')(e.detail);
    const { item, favorited } = e.detail;

    this._baseItems = this._baseItems.map((i) =>
      i.id === item.id ? { ...i, favorited } : i
    );
    this._currentItems = this._currentItems.map((i) =>
      i.id === item.id ? { ...i, favorited } : i
    );
  }

  render() {
    const workspacesWithCounts = exampleData.workspaces.map((workspace) => ({
      ...workspace,
      count:
        workspace.id === 'global'
          ? null // Global Zone doesn't show count per design
          : exampleData.itemsByWorkspace[workspace.id]?.length || 0,
      selected: workspace.id === this._currentWorkspaceId,
    }));

    return html`
      <kyn-account-switcher
        .currentAccount=${this.currentAccount}
        .workspaces=${workspacesWithCounts}
        .items=${this._currentItems}
        ?showSearch=${this.showSearch}
        searchLabel=${this.searchLabel}
        @on-workspace-select=${this._handleWorkspaceSelect}
        @on-item-select=${this._handleItemSelect}
        @on-favorite-change=${this._handleFavoriteChange}
        @on-search=${this._handleSearch}
      ></kyn-account-switcher>
    `;
  }
}

customElements.define('account-switcher-demo', AccountSwitcherDemo);

export default {
  title: 'Global Components/Account Switcher',
  component: 'kyn-account-switcher',
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
  argTypes: {
    showSearch: {
      control: { type: 'boolean' },
    },
    searchLabel: {
      control: { type: 'text' },
    },
  },
};

// Account info variants
const fullAccountInfo = exampleData.currentAccount;

const simpleAccountInfo = {
  name: 'Nonaccountc...rrentlyselected',
};

// Story: Full account info (with ID and country)
export const FullAccountInfo = {
  args: {
    showSearch: true,
    searchLabel: 'Search',
  },
  render: (args) => html`
    <account-switcher-demo
      .currentAccount=${fullAccountInfo}
      ?showSearch=${args.showSearch}
      searchLabel=${args.searchLabel}
    ></account-switcher-demo>
  `,
};

// Story: Simple account info (name only)
export const SimpleAccountInfo = {
  args: {
    showSearch: true,
    searchLabel: 'Search',
  },
  render: (args) => html`
    <account-switcher-demo
      .currentAccount=${simpleAccountInfo}
      ?showSearch=${args.showSearch}
      searchLabel=${args.searchLabel}
    ></account-switcher-demo>
  `,
};

// Story: Without search
export const WithoutSearch = {
  args: {
    showSearch: false,
  },
  render: (args) => html`
    <account-switcher-demo
      .currentAccount=${fullAccountInfo}
      ?showSearch=${args.showSearch}
    ></account-switcher-demo>
  `,
};
