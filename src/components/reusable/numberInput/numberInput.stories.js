import { html } from 'lit';
import './index';
import { action } from '@storybook/addon-actions';
import { ifDefined } from 'lit/directives/if-defined.js';

export default {
  title: 'Components/Number Input',
  component: 'kyn-number-input',
  argTypes: {
    size: {
      options: ['sm', 'md', 'lg'],
      control: { type: 'select' },
    },
    value: {
      control: { type: 'number' },
    },
    step: {
      control: { type: 'number' },
    },
    min: {
      control: { type: 'number' },
    },
    max: {
      control: { type: 'number' },
    },
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/CQuDZEeLiuGiALvCWjAKlu/Applications---Component-Library?node-id=14893-233109&m=dev',
    },
  },
};

const args = {
  label: 'Label',
  size: 'md',
  name: 'numberInput',
  value: 0,
  placeholder: '',
  caption: '',
  required: false,
  disabled: false,
  readonly: false,
  invalidText: '',
  hideLabel: false,
  step: 1,
  min: undefined,
  max: undefined,
  textStrings: {
    requiredText: 'Required',
    subtract: 'Subtract',
    add: 'Add',
    error: 'Error',
  },
};

export const NumberInput = {
  args,
  render: (args) => {
    return html`
      <kyn-number-input
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
        step=${ifDefined(args.step)}
        min=${ifDefined(args.min)}
        max=${ifDefined(args.max)}
        .textStrings=${args.textStrings}
        label=${args.label}
        @on-input=${(e) => action(e.type)(e)}
      >
      </kyn-number-input>
    `;
  },
};
