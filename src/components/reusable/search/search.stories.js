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
};

export const Search = {
  args: {
    name: 'search',
    collapsed: false,
    value: '',
    label: 'Search',
    suggestions: ['Strings', 'Matching', 'Value', 'Here'],
  },
  render: (args) => {
    return html`
      <kyn-search
        name=${args.name}
        label=${args.label}
        value=${args.value}
        ?collapsed=${args.collapsed}
        .suggestions=${args.suggestions}
        @on-input=${(e) => action(e.type)(e)}
      ></kyn-search>
    `;
  },
};
