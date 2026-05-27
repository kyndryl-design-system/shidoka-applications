import { html } from 'lit';
import './index';
import { action } from 'storybook/actions';
import { ifDefined } from 'lit/directives/if-defined.js';
import { ValidationArgs } from '../../../common/helpers/helpers';

export default {
  title: 'Components/Form Inputs/Text Area',
  component: 'kyn-text-area',
  argTypes: {
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
  label: 'Label',
  name: 'text-area-1',
  value: '',
  placeholder: '',
  caption: '',
  required: false,
  disabled: false,
  readonly: false,
  invalidText: '',
  warnText: '',
  hideLabel: false,
  minLength: undefined,
  maxLength: undefined,
  rows: undefined,
  autoComplete: 'off',
  textStrings: {
    requiredText: 'Required',
    errorText: 'Error',
    warning: 'Warning',
  },
};

const Template = (args) => {
  return html`
    <kyn-text-area
      name=${args.name}
      value=${args.value}
      placeholder=${args.placeholder}
      caption=${args.caption}
      ?required=${args.required}
      ?disabled=${args.disabled}
      ?readonly=${args.readonly}
      invalidText=${args.invalidText}
      warnText=${args.warnText}
      .textStrings=${args.textStrings}
      minLength=${ifDefined(args.minLength)}
      maxLength=${ifDefined(args.maxLength)}
      rows=${args.rows}
      ?hideLabel=${args.hideLabel}
      ?aiConnected=${args.aiConnected}
      ?notResizeable=${args.notResizeable}
      maxRowsVisible=${args.maxRowsVisible}
      autoComplete=${args.autoComplete}
      @on-input=${(e) => action(e.type)({ ...e, detail: e.detail })}
      @keydown=${(e) => e.stopPropagation()}
      label=${args.label}
    >
    </kyn-text-area>
  `;
};

export const TextArea = Template.bind({});
TextArea.args = {
  ...args,
};

export const AIConnected = Template.bind({});
AIConnected.args = {
  ...args,
  aiConnected: true,
  notResizeable: true,
  rows: 2,
  maxRowsVisible: 4,
};
