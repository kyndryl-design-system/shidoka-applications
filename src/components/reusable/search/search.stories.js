import { html } from 'lit';
import './index';
import { action } from 'storybook/actions';

export default {
  title: 'Components/Search',
  component: 'kyn-search',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/9Q2XfTSxfzTXfNe2Bi8KDS/Component-Viewer?node-id=1-554036&p=f&m=dev',
    },
  },
  argTypes: {
    size: {
      options: ['sm', 'md', 'lg'],
      control: { type: 'select' },
    },
  },
};
const args = {
  name: 'search',
  expandable: false,
  disabled: false,
  value: '',
  label: 'Search...',
  size: 'md',
  suggestions: [
    'Component',
    'Component search',
    'Component example',
    'Shidoka',
  ],
  expandableSearchBtnDescription: 'Expandable search button',
  assistiveTextStrings: {
    searchSuggestions: 'Search suggestions',
    noMatches: 'No matches found for',
    selected: 'Selected',
    found: 'Found',
    recentSearches: 'Recent searches',
  },
};

export const Search = {
  args,
  render: (args) => {
    return html`
      <kyn-search
        name=${args.name}
        label=${args.label}
        value=${args.value}
        ?expandable=${args.expandable}
        ?disabled=${args.disabled}
        size=${args.size}
        .suggestions=${args.suggestions}
        expandableSearchBtnDescription=${args.expandableSearchBtnDescription}
        .assistiveTextStrings=${args.assistiveTextStrings}
        @on-input=${(e) => action(e.type)({ ...e, detail: e.detail })}
      ></kyn-search>
    `;
  },
};

export const SearchHistory = {
  args: {
    ...args,
    suggestions: [
      'Shidoka search',
      'Shidoka input',
      'Shidoka component',
      'Shidoka',
    ],
    searchHistory: [
      'Shidoka input',
      'Shidoka text',
      'Shidoka pageTitle',
      'Shidoka search',
    ],
  },
  render: (args) => {
    return html`
      <kyn-search
        name=${args.name}
        label=${args.label}
        value=${args.value}
        ?expandable=${args.expandable}
        ?disabled=${args.disabled}
        size=${args.size}
        ?enableSearchHistory=${true}
        .searchHistory=${args.searchHistory}
        .suggestions=${args.suggestions}
        expandableSearchBtnDescription=${args.expandableSearchBtnDescription}
        .assistiveTextStrings=${args.assistiveTextStrings}
        @on-input=${(e) => action(e.type)({ ...e, detail: e.detail })}
      ></kyn-search>
    `;
  },
};

export const TypeAheadSuggestions = {
  args: {
    ...args,
    value: 'Shidoka',
    suggestions: [
      'Shidoka input',
      'Shidoka text',
      'Shidoka pageTitle',
      'Shidoka search',
    ],
  },
  render: (args) => {
    return html`
      <kyn-search
        name=${args.name}
        label=${args.label}
        value=${args.value}
        ?expandable=${args.expandable}
        ?disabled=${args.disabled}
        size=${args.size}
        .suggestions=${args.suggestions}
        expandableSearchBtnDescription=${args.expandableSearchBtnDescription}
        .assistiveTextStrings=${args.assistiveTextStrings}
        @on-input=${(e) => action(e.type)({ ...e, detail: e.detail })}
      ></kyn-search>
    `;
  },
};
