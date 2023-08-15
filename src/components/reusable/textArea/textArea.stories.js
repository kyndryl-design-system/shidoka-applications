import { html } from 'lit';
import './index';
import { action } from '@storybook/addon-actions';
import { ifDefined } from 'lit/directives/if-defined.js';

export default {
  title: 'Reusable/Text Area',
  component: 'kyn-text-area',
  argTypes: {
    minLength: {
      control: { type: 'number' },
    },
    maxLength: {
      control: { type: 'number' },
    },
  },
};

export const TextArea = {
  args: {
    labelText: 'Label',
    name: 'name',
    value: '',
    placeholder: 'Placeholder',
    caption: '',
    required: false,
    disabled: false,
    invalidText: '',
    minLength: null,
    maxLength: null,
  },
  render: (args) => {
    return html`
      <kyn-text-area
        labelText=${args.labelText}
        name=${args.name}
        value=${args.value}
        placeholder=${args.placeholder}
        caption=${args.caption}
        ?required=${args.required}
        ?disabled=${args.disabled}
        invalidText=${args.invalidText}
        minLength=${ifDefined(args.minLength)}
        maxLength=${ifDefined(args.maxLength)}
        @on-input=${(e) => action(e.type)(e)}
        @keydown=${(e) => e.stopPropagation()}
      ></kyn-text-area>
    `;
  },
};

TextArea.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/6AovH7Iay9Y7BkpoL5975s/Component-Library-for-Dev?node-id=85%3A611&mode=dev',
  },
};
