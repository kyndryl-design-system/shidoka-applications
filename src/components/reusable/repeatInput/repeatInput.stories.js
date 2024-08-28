import { html } from 'lit';
import './index';
import { action } from '@storybook/addon-actions'; // used to log an action in storybook
import { ifDefined } from 'lit/directives/if-defined.js';

export default {
  title: 'Components/RepeatInput', // component name
  component: 'kyn-repeat-input', // custom element tag name
  parameters: {
    design: {
      type: 'figma',
      url: '', // figma reference link
    },
  },
  argTypes: {
    type: {
      options: ['text', 'password', 'email', 'search', 'tel', 'url'],
      control: { type: 'select' },
    },
    size: {
      options: ['sm', 'md', 'lg'],
      control: { type: 'select' },
    },
    pattern: {
      control: { type: 'text' },
    },
    minLength: {
      control: { type: 'number' },
    },
    maxLength: {
      control: { type: 'number' },
    },
  },
};

export const Component = {
  args: {
    unnamed: 'Enter text and quantity to repeat',
    size: 'md',
    type: 'text',
    placeholder: '',
    hideLabel: false,
    required: false,
    disabled: false,
    invalidText: '',
    name: 'textInput',
    value: '',
    caption: '',
    pattern: undefined,
    minLength: undefined,
    maxLength: undefined,
  },
  render: (args) => {
    return html`
      <kyn-repeat-input
        size=${args.size}
        type=${args.type}
        placeholder=${args.placeholder}
        ?hideLabel=${args.hideLabel}
        ?required=${args.required}
        ?disabled=${args.disabled}
        invalidText=${args.invalidText}
        name=${args.name}
        value=${args.value}
        caption=${args.caption}
        pattern=${ifDefined(args.pattern)}
        minLength=${ifDefined(args.minLength)}
        maxLength=${ifDefined(args.maxLength)}
        @on-input=${(e) => action(e.type)(e)}
      >
        ${args.unnamed}
      </kyn-repeat-input>
    `;
  },
};
