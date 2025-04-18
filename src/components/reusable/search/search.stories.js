import { html } from 'lit';
import './index';
import { action } from '@storybook/addon-actions';

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

export const Search = {
  args: {
    name: 'search',
    expandable: false,
    disabled: false,
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
        size=${args.size}
        .suggestions=${args.suggestions}
        expandableSearchBtnDescription=${args.expandableSearchBtnDescription}
        .assistiveTextStrings=${args.assistiveTextStrings}
        @on-input=${(e) => action(e.type)(e)}
      ></kyn-search>
    `;
  },
};
