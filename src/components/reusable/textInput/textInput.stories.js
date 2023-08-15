import { html } from 'lit';
import './index';
import { action } from '@storybook/addon-actions';
import { ifDefined } from 'lit/directives/if-defined.js';

export default {
  title: 'Reusable/Text Input',
  component: 'kyn-text-input',
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

export const TextInput = {
  args: {
    labelText: 'Label',
    size: 'md',
    type: 'text',
    name: 'name',
    value: '',
    placeholder: 'Placeholder',
    caption: '',
    required: false,
    disabled: false,
    invalidText: '',
    pattern: null,
    minLength: null,
    maxLength: null,
  },
  render: (args) => {
    return html`
      <kyn-text-input
        labelText=${args.labelText}
        type=${args.type}
        size=${args.size}
        name=${args.name}
        value=${args.value}
        placeholder=${args.placeholder}
        caption=${args.caption}
        ?required=${args.required}
        ?disabled=${args.disabled}
        invalidText=${args.invalidText}
        pattern=${ifDefined(args.pattern)}
        minLength=${ifDefined(args.minLength)}
        maxLength=${ifDefined(args.maxLength)}
        @on-input=${(e) => action(e.type)(e)}
      ></kyn-text-input>
    `;
  },
};

TextInput.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/6AovH7Iay9Y7BkpoL5975s/Component-Library-for-Dev?node-id=85%3A611&mode=dev',
  },
};
