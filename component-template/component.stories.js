import { html } from 'lit';
import './index';
import { action } from '@storybook/addon-actions'; // used to log an action in storybook

export default {
  title: 'Components/Component', // component name
  component: 'kyn-component', // custom element tag name
  parameters: {
    design: {
      type: 'figma',
      url: '', // figma reference link
    },
  },
};

export const Component = {
  args: {
    unnamed: 'Hello World!',
    stringProp: 'Exposed Prop',
    booleanProp: false,
    arrayProp: [],
  },
  render: (args) => {
    return html`
      <kyn-toggle-button
        stringProp=${args.stringProp}
        ?booleanProp=${args.booleanProp}
        .arrayProp=${args.arrayProp}
        @on-click=${(e) => action(e.type)(e)}
      >
        ${args.unnamed}
      </kyn-toggle-button>
    `;
  },
};
