import { html } from 'lit';
import './index';
import { action } from '@storybook/addon-actions';
import { ifDefined } from 'lit/directives/if-defined.js';

export default {
  title: 'Components/Text Area',
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
    unnamed: 'Label',
    name: 'name',
    value: '',
    placeholder: 'Placeholder',
    caption: '',
    required: false,
    disabled: false,
    invalidText: '',
    minLength: undefined,
    maxLength: undefined,
    rows: undefined,
  },
  render: (args) => {
    return html`
      <kyn-text-area
        name=${args.name}
        value=${args.value}
        placeholder=${args.placeholder}
        caption=${args.caption}
        ?required=${args.required}
        ?disabled=${args.disabled}
        invalidText=${args.invalidText}
        minLength=${ifDefined(args.minLength)}
        maxLength=${ifDefined(args.maxLength)}
        rows=${args.rows}
        @on-input=${(e) => action(e.type)(e)}
        @keydown=${(e) => e.stopPropagation()}
      >
        ${args.unnamed}
      </kyn-text-area>
    `;
  },
};

TextArea.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/6AovH7Iay9Y7BkpoL5975s/Component-Library-for-Dev?node-id=215%3A2099&mode=dev',
  },
};
