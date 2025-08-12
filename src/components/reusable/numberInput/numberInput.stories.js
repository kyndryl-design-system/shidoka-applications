import { html } from 'lit';
import './index';
import { action } from 'storybook/actions';
import { ifDefined } from 'lit/directives/if-defined.js';
import { ValidationArgs } from '../../../common/helpers/helpers';

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
    ...ValidationArgs,
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/9Q2XfTSxfzTXfNe2Bi8KDS/Component-Viewer?node-id=1-550224&p=f&m=dev',
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

export const DefaultFullWidth = {
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
        ?hideLabel=${args.hideLabel}
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

export const ContrainedMaxWidth = {
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
        ?hideLabel=${args.hideLabel}
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
        ?hideLabel=${args.hideLabel}
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
