import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { html } from 'lit';
import './index';
import { action } from '@storybook/addon-actions';
import { ifDefined } from 'lit/directives/if-defined.js';
import currencyIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/cost.svg';

export default {
  title: 'Components/Text Input',
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

const args = {
  size: 'md',
  type: 'text',
  name: 'textInput',
  value: '',
  placeholder: '',
  caption: '',
  label: 'Label',
  required: false,
  disabled: false,
  readonly: false,
  invalidText: '',
  iconRight: false,
  hideLabel: false,
  pattern: undefined,
  minLength: undefined,
  maxLength: undefined,
  textStrings: {
    requiredText: 'Required',
    clearAll: 'Clear all',
    errorText: 'Error',
  },
};

export const TextInput = {
  args,
  render: (args) => {
    return html`
      <kyn-text-input
        type=${args.type}
        size=${args.size}
        name=${args.name}
        value=${args.value}
        placeholder=${args.placeholder}
        caption=${args.caption}
        ?required=${args.required}
        ?disabled=${args.disabled}
        ?readonly=${args.readonly}
        invalidText=${args.invalidText}
        ?hideLabel=${args.hideLabel}
        pattern=${ifDefined(args.pattern)}
        minLength=${ifDefined(args.minLength)}
        maxLength=${ifDefined(args.maxLength)}
        .textStrings=${args.textStrings}
        label=${args.label}
        @on-input=${(e) => action(e.type)(e)}
      >
      </kyn-text-input>
    `;
  },
};

TextInput.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/6AovH7Iay9Y7BkpoL5975s/Component-Library-for-Dev?node-id=85%3A611&mode=dev',
  },
};

export const WithIcon = {
  args,
  render: (args) => {
    return html`
      <style>
        span[slot='icon'] {
          display: flex;
        }
      </style>
      <kyn-text-input
        type=${args.type}
        size=${args.size}
        name=${args.name}
        value=${args.value}
        placeholder=${args.placeholder}
        caption=${args.caption}
        ?required=${args.required}
        ?disabled=${args.disabled}
        ?readonly=${args.readonly}
        invalidText=${args.invalidText}
        ?hideLabel=${args.hideLabel}
        ?iconRight=${args.iconRight}
        pattern=${ifDefined(args.pattern)}
        minLength=${ifDefined(args.minLength)}
        maxLength=${ifDefined(args.maxLength)}
        .textStrings=${args.textStrings}
        label=${args.label}
        @on-input=${(e) => action(e.type)(e)}
      >
        <span slot="icon" role="img" aria-label="Currency" title="Currency"
          >${unsafeSVG(currencyIcon)}</span
        >
      </kyn-text-input>
    `;
  },
};
