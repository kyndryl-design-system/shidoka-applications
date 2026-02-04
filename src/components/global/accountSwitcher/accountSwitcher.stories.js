import { html } from 'lit';
import { action } from 'storybook/actions';
import './index';

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
    currentSectionLabel: {
      control: { type: 'text' },
    },
    workspacesSectionLabel: {
      control: { type: 'text' },
    },
  },
};

// Sample data
const currentAccountSelected = {
  name: 'CurrentSelect...AccountName',
  accountId: '023497uw02399023509',
  country: 'United States',
};

const currentAccountNonSelected = {
  name: 'Nonaccountc...rrentlyselected',
};

const manyTypesWorkspaces = [
  { id: 'global', name: 'Global Zone (All)', count: null },
  { id: 'tenants', name: 'Account Tenants', count: 23, selected: true },
  { id: 'compute', name: 'Compute Zones', count: 12 },
  { id: 'countries', name: 'Countries', count: 7 },
  { id: 'pods', name: 'Delivery Pods', count: 5 },
  { id: 'buying', name: 'Global Buying Groups', count: 12 },
  { id: 'markets', name: 'Markets', count: 2 },
  { id: 'org-markets', name: 'Org Markets', count: 4 },
  { id: 'pools', name: 'Pools', count: 7 },
  { id: 'regions', name: 'Regions', count: 13 },
];

const manyTypesSmallCountsWorkspaces = [
  { id: 'global', name: 'Global Zone (All)', count: null },
  { id: 'tenants', name: 'Account Tenants', count: 3, selected: true },
  { id: 'compute', name: 'Compute Zones', count: 2 },
  { id: 'countries', name: 'Countries', count: 2 },
  { id: 'pods', name: 'Delivery Pods', count: 1 },
  { id: 'buying', name: 'Global Buying Groups', count: 1 },
  { id: 'markets', name: 'Markets', count: 1 },
  { id: 'org-markets', name: 'Org Markets', count: 1 },
  { id: 'pools', name: 'Pools', count: 1 },
  { id: 'regions', name: 'Regions', count: 1 },
];

const fewTypesWorkspaces = [
  { id: 'global', name: 'Global Zone (All)', count: null },
  { id: 'tenants', name: 'Account Tenants', count: 3, selected: true },
  { id: 'buying', name: 'Global Buying Groups', count: 1 },
  { id: 'org-markets', name: 'Org Markets', count: 1 },
];

const manyTypesComputeSelectedWorkspaces = [
  { id: 'global', name: 'Global Zone (All)', count: null },
  { id: 'tenants', name: 'Account Tenants', count: 2 },
  { id: 'compute', name: 'Compute Zones', count: 2, selected: true },
  { id: 'countries', name: 'Countries', count: 2 },
  { id: 'pods', name: 'Delivery Pods', count: 1 },
  { id: 'buying', name: 'Global Buying Groups', count: 1 },
  { id: 'markets', name: 'Markets', count: 1 },
  { id: 'org-markets', name: 'Org Markets', count: 1 },
  { id: 'pools', name: 'Pools', count: 1 },
  { id: 'regions', name: 'Regions', count: 1 },
];

const manyItemsAccounts = [
  { id: '1', name: 'Account 1' },
  { id: '2', name: 'Account 2' },
  { id: 'current', name: 'CurrentlySelectedAccountName', selected: true },
  { id: '4', name: 'Account 4' },
  { id: '5', name: 'Account 5' },
  { id: '6', name: 'Account 6' },
  { id: '7', name: 'Account 7' },
  { id: '8', name: 'Account 8' },
  { id: '9', name: 'Account 9' },
  { id: '10', name: 'Account 10' },
  { id: '11', name: 'Account 11' },
  { id: '12', name: 'Account 12' },
  { id: '13', name: 'Account 13' },
];

const fewItemsAccounts = [
  { id: '1', name: 'Account 1' },
  { id: 'current', name: 'CurrentlySelectedAccountName', selected: true },
  { id: '3', name: 'Account 3' },
];

const fewItemsComputeZones = [
  { id: '1', name: 'Compute Zone 1' },
  { id: '2', name: 'Compute Zone 2' },
];

// Story: Many types, many items, account selected
export const ManyTypesManyItemsAccountSelected = {
  args: {
    showSearch: true,
    searchLabel: 'Search',
    currentSectionLabel: 'Current',
    workspacesSectionLabel: 'Workspaces',
  },
  render: (args) => html`
    <kyn-account-switcher
      .currentAccount=${currentAccountSelected}
      .workspaces=${manyTypesWorkspaces}
      .items=${manyItemsAccounts}
      ?showSearch=${args.showSearch}
      searchLabel=${args.searchLabel}
      currentSectionLabel=${args.currentSectionLabel}
      workspacesSectionLabel=${args.workspacesSectionLabel}
      @on-workspace-select=${(e) => action('on-workspace-select')(e.detail)}
      @on-item-select=${(e) => action('on-item-select')(e.detail)}
      @on-favorite-change=${(e) => action('on-favorite-change')(e.detail)}
      @on-search=${(e) => action('on-search')(e.detail)}
    ></kyn-account-switcher>
  `,
};

// Story: Many types, many items, non account
export const ManyTypesManyItemsNonAccount = {
  args: {
    showSearch: true,
    searchLabel: 'Search',
  },
  render: (args) => html`
    <kyn-account-switcher
      .currentAccount=${currentAccountNonSelected}
      .workspaces=${manyTypesWorkspaces}
      .items=${manyItemsAccounts}
      ?showSearch=${args.showSearch}
      searchLabel=${args.searchLabel}
      @on-workspace-select=${(e) => action('on-workspace-select')(e.detail)}
      @on-item-select=${(e) => action('on-item-select')(e.detail)}
      @on-favorite-change=${(e) => action('on-favorite-change')(e.detail)}
      @on-search=${(e) => action('on-search')(e.detail)}
    ></kyn-account-switcher>
  `,
};

// Story: Few items, many types, account selected
export const FewItemsManyTypesAccountSelected = {
  args: {
    showSearch: false,
  },
  render: (args) => html`
    <kyn-account-switcher
      .currentAccount=${currentAccountSelected}
      .workspaces=${manyTypesSmallCountsWorkspaces}
      .items=${fewItemsAccounts}
      ?showSearch=${args.showSearch}
      @on-workspace-select=${(e) => action('on-workspace-select')(e.detail)}
      @on-item-select=${(e) => action('on-item-select')(e.detail)}
      @on-favorite-change=${(e) => action('on-favorite-change')(e.detail)}
    ></kyn-account-switcher>
  `,
};

// Story: Few items, few types, account selected
export const FewItemsFewTypesAccountSelected = {
  args: {
    showSearch: false,
  },
  render: (args) => html`
    <kyn-account-switcher
      .currentAccount=${currentAccountSelected}
      .workspaces=${fewTypesWorkspaces}
      .items=${fewItemsAccounts}
      ?showSearch=${args.showSearch}
      @on-workspace-select=${(e) => action('on-workspace-select')(e.detail)}
      @on-item-select=${(e) => action('on-item-select')(e.detail)}
      @on-favorite-change=${(e) => action('on-favorite-change')(e.detail)}
    ></kyn-account-switcher>
  `,
};

// Story: Few items, many types, non account selected
export const FewItemsManyTypesNonAccount = {
  args: {
    showSearch: false,
  },
  render: (args) => html`
    <kyn-account-switcher
      .currentAccount=${currentAccountNonSelected}
      .workspaces=${manyTypesComputeSelectedWorkspaces}
      .items=${fewItemsComputeZones}
      ?showSearch=${args.showSearch}
      @on-workspace-select=${(e) => action('on-workspace-select')(e.detail)}
      @on-item-select=${(e) => action('on-item-select')(e.detail)}
      @on-favorite-change=${(e) => action('on-favorite-change')(e.detail)}
    ></kyn-account-switcher>
  `,
};
