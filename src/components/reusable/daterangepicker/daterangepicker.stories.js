import { html } from 'lit';
import './index';
import '@kyndryl-design-system/shidoka-foundation/components/icon';
import { ifDefined } from 'lit/directives/if-defined.js';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Components/Date Range Picker',
  component: 'kyn-date-range-picker',
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
  argTypes: {
    size: {
      options: ['sm', 'md', 'lg'],
      control: { type: 'select' },
    },
    minDate: {
      control: { type: 'text' },
    },
    maxDate: {
      control: { type: 'text' },
    },
    step: {
      control: { type: 'text' },
    },
    startDate: {
      control: { type: 'text' },
    },
    endDate: {
      control: { type: 'text' },
    },
  },
};

const args = {
  name: '',
  invalidText: '',
  size: 'md',
  startDate: '',
  endDate: '',
  caption: '',
  required: false,
  disabled: false,
  datePickerType: 'single',
  warnText: '',
  minDate: undefined,
  maxDate: undefined,
  step: undefined,
  textStrings: {
    requiredText: 'Required',
  },
  unnamed: '',
};

export const DateRange = {
  args,
  render: (args) => {
    return html` <kyn-date-range-picker
      size=${args.size}
      name=${args.name}
      datePickerType=${args.datePickerType}
      caption=${args.caption}
      ?required=${args.required}
      ?disabled=${args.disabled}
      invalidText=${args.invalidText}
      warnText=${args.warnText}
      .textStrings=${args.textStrings}
      startDate=${args.startDate}
      endDate=${args.endDate}
      minDate=${ifDefined(args.minDate)}
      maxDate=${ifDefined(args.maxDate)}
      step=${ifDefined(args.step)}
      @on-input=${(e) => action(e.type)(e)}
      @keydown=${(e) => e.stopPropagation()}
    >
      ${args.unnamed}
    </kyn-date-range-picker>`;
  },
};
