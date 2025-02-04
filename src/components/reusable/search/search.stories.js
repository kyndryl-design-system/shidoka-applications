import { html } from 'lit';
import './index';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Components/Search',
  component: 'kyn-search',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/6AovH7Iay9Y7BkpoL5975s/Applications-Specs-for-Devs?node-id=5115-28788&t=JlOHq5O66s36vTFm-0',
    },
  },
  argTypes: {
    size: {
      options: ['sm', 'md', 'lg'],
      control: { type: 'select' },
    },
  },
};

export const Search = {
  args: {
    name: 'search',
    expandable: false,
    disabled: false,
    readonly: false,
    value: '',
    label: 'Search...',
    size: 'md',
    suggestions: ['Strings', 'Matching', 'Value', 'Here'],
    expandableSearchBtnDescription: 'Expandable search button',
    assistiveTextStrings: {
      searchSuggestions: 'Search suggestions',
      noMatches: 'No matches found for',
      selected: 'Selected',
      found: 'Found',
    },
  },
  render: (args) => {
    return html`
      <kyn-search
        name=${args.name}
        label=${args.label}
        value=${args.value}
        ?expandable=${args.expandable}
        ?disabled=${args.disabled}
        ?readonly=${args.readonly}
        size=${args.size}
        .suggestions=${args.suggestions}
        expandableSearchBtnDescription=${args.expandableSearchBtnDescription}
        .assistiveTextStrings=${args.assistiveTextStrings}
        @on-input=${(e) => action(e.type)(e)}
      ></kyn-search>
    `;
  },
};
