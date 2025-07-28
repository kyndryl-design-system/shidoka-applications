import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { html } from 'lit';
import './index';
import { action } from 'storybook/actions';
import { ifDefined } from 'lit/directives/if-defined.js';
import { ValidationArgs } from '../../../common/helpers/helpers';
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
    ...ValidationArgs,
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
  autoComplete: 'off',
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
        autoComplete=${args.autoComplete}
        pattern=${ifDefined(args.pattern)}
        minLength=${ifDefined(args.minLength)}
        maxLength=${ifDefined(args.maxLength)}
        .textStrings=${args.textStrings}
        label=${args.label}
        @on-input=${(e) => action(e.type)({ ...e, detail: e.detail })}
      >
      </kyn-text-input>
    `;
  },
};

TextInput.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/design/9Q2XfTSxfzTXfNe2Bi8KDS/Component-Viewer?node-id=4-421381&p=f&m=dev',
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
        autoComplete=${args.autoComplete}
        pattern=${ifDefined(args.pattern)}
        minLength=${ifDefined(args.minLength)}
        maxLength=${ifDefined(args.maxLength)}
        .textStrings=${args.textStrings}
        label=${args.label}
        @on-input=${(e) => action(e.type)({ ...e, detail: e.detail })}
      >
        <span slot="icon" role="img" aria-label="Currency" title="Currency"
          >${unsafeSVG(currencyIcon)}</span
        >
      </kyn-text-input>
    `;
  },
};

export const PasswordInput = {
  args: {
    ...args,
    type: 'password',
    label: 'Password',
    name: 'password',
    placeholder: 'Enter password',
  },
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
        ?iconRight=${args.iconRight}
        pattern=${ifDefined(args.pattern)}
        minLength=${ifDefined(args.minLength)}
        maxLength=${ifDefined(args.maxLength)}
        .textStrings=${args.textStrings}
        label=${args.label}
        @on-input=${(e) => action(e.type)({ ...e, detail: e.detail })}
        style="min-width: 350px;"
      >
      </kyn-text-input>
    `;
  },
};

export const PasswordInputWithValidation = {
  args: {
    ...args,
    type: 'password',
    label: 'Create Password',
    name: 'password-validation',
    placeholder: 'Enter a secure password',
    required: true,
    pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$',
    minLength: 8,
  },
  render: (args) => {
    return html`
      <div class="password-container">
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
          @on-input=${(e) => action(e.type)({ ...e, detail: e.detail })}
          style="min-width: 350px;"
        >
        </kyn-text-input>

        <div
          class="password-validation"
          style="max-width: 350px; margin-top: 8px;"
        >
          <p>Password requirements:</p>
          <div class="validation-item">
            <span class="validation-icon">&bull;</span> At least 8 characters
          </div>
          <div class="validation-item">
            <span class="validation-icon">&bull;</span> At least one uppercase
            letter
          </div>
          <div class="validation-item">
            <span class="validation-icon">&bull;</span> At least one lowercase
            letter
          </div>
          <div class="validation-item">
            <span class="validation-icon">&bull;</span> At least one number
          </div>
        </div>
      </div>
    `;
  },
};
