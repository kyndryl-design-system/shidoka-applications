import { html } from 'lit';
import './index';
import { action } from 'storybook/actions';
import { ifDefined } from 'lit/directives/if-defined.js';
import { ValidationArgs } from '../../../common/helpers/helpers';

export default {
  title: 'Components/Form Inputs/Number Input',
  component: 'kyn-number-input',
  parameters: {
    docs: {
      description: {
        component:
          'Integers above `Number.MAX_SAFE_INTEGER` (9007199254740991) are not exact in JavaScript. Set `max` if you want range-overflow invalid text. Use `allowEmpty` to leave the field blank (`null` instead of resetting to `0`).',
      },
    },
  },
  argTypes: {
    size: {
      options: ['xs', 'sm', 'md', 'lg'],
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
    allowEmpty: {
      control: { type: 'boolean' },
    },
    ...ValidationArgs,
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
  warnText: '',
  hideLabel: false,
  inline: false,
  allowEmpty: false,
  step: 1,
  min: undefined,
  max: undefined,
  textStrings: {
    requiredText: 'Required',
    subtract: 'Subtract',
    add: 'Add',
    error: 'Error',
    warning: 'Warning',
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
        warnText=${args.warnText}
        ?hideLabel=${args.hideLabel}
        ?inline=${args.inline}
        ?allowEmpty=${args.allowEmpty}
        step=${ifDefined(args.step)}
        min=${ifDefined(args.min)}
        max=${ifDefined(args.max)}
        .textStrings=${args.textStrings}
        label=${args.label}
        @on-input=${(e) => action(e.type)({ ...e, detail: e.detail })}
        @on-change=${(e) => action(e.type)({ ...e, detail: e.detail })}
      >
      </kyn-number-input>
    `;
  },
};

export const AllowEmpty = {
  args: {
    ...args,
    allowEmpty: true,
    caption: 'Clearing the field leaves it empty (value is null).',
  },
  render: NumberInput.render,
};

export const FullWidth = {
  args: {
    ...args,
    label:
      'Extra Extra Extra Extra Extra Extra Extra Extra Extra Extra Extra Extra Long Label',
  },
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
        warnText=${args.warnText}
        ?hideLabel=${args.hideLabel}
        ?inline=${args.inline}
        ?allowEmpty=${args.allowEmpty}
        step=${ifDefined(args.step)}
        min=${ifDefined(args.min)}
        max=${ifDefined(args.max)}
        .textStrings=${args.textStrings}
        label=${args.label}
        @on-input=${(e) => action(e.type)({ ...e, detail: e.detail })}
        style="width: 100%; --kyn-number-input-inner-max-width: 100%;"
      >
      </kyn-number-input>
    `;
  },
};

export const ConstrainedMaxWidth = {
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
        warnText=${args.warnText}
        ?hideLabel=${args.hideLabel}
        ?inline=${args.inline}
        ?allowEmpty=${args.allowEmpty}
        step=${ifDefined(args.step)}
        min=${ifDefined(args.min)}
        max=${ifDefined(args.max)}
        .textStrings=${args.textStrings}
        label=${args.label}
        style="max-width: 300px"
        @on-input=${(e) => action(e.type)({ ...e, detail: e.detail })}
      >
      </kyn-number-input>
    `;
  },
};

export const LongLabelContrainedInput = {
  args: {
    ...args,
    label:
      'Extra Extra Extra Extra Extra Extra Extra Extra Extra Extra Extra Extra Long Label',
  },
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
        warnText=${args.warnText}
        ?hideLabel=${args.hideLabel}
        ?inline=${args.inline}
        ?allowEmpty=${args.allowEmpty}
        step=${ifDefined(args.step)}
        min=${ifDefined(args.min)}
        max=${ifDefined(args.max)}
        .textStrings=${args.textStrings}
        label=${args.label}
        @on-input=${(e) => action(e.type)({ ...e, detail: e.detail })}
        style="max-width: 700px; --kyn-number-input-inner-max-width: 160px"
      >
      </kyn-number-input>
    `;
  },
};

export const LongWrappingLabel = {
  args: {
    ...args,
    label:
      'Extra Extra Extra Extra Extra Extra Extra Extra Extra Extra Extra Extra Long Label',
  },
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
        warnText=${args.warnText}
        ?hideLabel=${args.hideLabel}
        ?inline=${args.inline}
        ?allowEmpty=${args.allowEmpty}
        step=${ifDefined(args.step)}
        min=${ifDefined(args.min)}
        max=${ifDefined(args.max)}
        .textStrings=${args.textStrings}
        label=${args.label}
        @on-input=${(e) => action(e.type)({ ...e, detail: e.detail })}
        style="max-width: 275px"
      >
      </kyn-number-input>
    `;
  },
};
