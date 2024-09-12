import { html } from 'lit';
import './index';
import { action } from '@storybook/addon-actions';
import { ifDefined } from 'lit/directives/if-defined.js';
import { createOptionsArray } from '../../../common/helpers/helpers';

import { DATE_PICKER_TYPES } from '../datePicker/defs';
const createSelectOptions = (defs) => [null, ...createOptionsArray(defs)];

export default {
  title: 'Components/Date Range Picker',
  component: 'kyn-date-range-picker',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/6AovH7Iay9Y7BkpoL5975s/Component-Library-for-Dev?node-id=508%3A142381&mode=dev',
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
    datePickerType: {
      options: createSelectOptions(DATE_PICKER_TYPES),
      control: { type: 'select', labels: { null: DATE_PICKER_TYPES.SINGLE } },
      table: {
        defaultValue: { summary: DATE_PICKER_TYPES.SINGLE },
      },
    },
  },
};

const args = {
  unnamed: 'Date',
  size: 'md',
  name: 'dateRangePicker',
  startDate: '',
  endDate: '',
  caption: '',
  required: false,
  disabled: false,
  datePickerType: 'single',
  invalidText: '',
  warnText: '',
  minDate: undefined,
  maxDate: undefined,
  step: undefined,
  textStrings: {
    requiredText: 'Required',
  },
};

export const DateRangePicker = {
  args,
  render: (args) => {
    return html`
      <kyn-date-range-picker
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
      </kyn-date-range-picker>
    `;
  },
};

export const DateTimeRangePicker = {
  args: { ...args, datePickerType: 'date-time' },
  render: (args) => {
    return html`
      <kyn-date-range-picker
        size=${args.size}
        name=${args.name}
        datePickerType=${args.datePickerType}
        caption=${args.caption}
        ?required=${args.required}
        ?disabled=${args.disabled}
        invalidText=${args.invalidText}
        warnText=${args.warnText}
        startDate=${args.startDate}
        endDate=${args.endDate}
        minDate=${ifDefined(args.minDate)}
        maxDate=${ifDefined(args.maxDate)}
        step=${ifDefined(args.step)}
        @on-input=${(e) => action(e.type)(e)}
        @keydown=${(e) => e.stopPropagation()}
      >
        ${args.unnamed}
      </kyn-date-range-picker>
    `;
  },
};
