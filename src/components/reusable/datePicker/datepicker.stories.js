import { html } from 'lit';
import './index';
import { action } from '@storybook/addon-actions';
import { ifDefined } from 'lit/directives/if-defined.js';
import '@kyndryl-design-system/foundation/components/icon';
import { createOptionsArray } from '../../../common/helpers/helpers';
import { DATE_PICKER_TYPES } from './defs';

const createSelectOptions = (defs) => [null, ...createOptionsArray(defs)];

export default {
  title: 'Components/DatePicker',
  component: 'kyn-date-picker',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/6AovH7Iay9Y7BkpoL5975s/Component-Library-for-Dev?node-id=508%3A142381&mode=dev',
    },
  },
  argTypes: {
    datePickerType: {
      options: createSelectOptions(DATE_PICKER_TYPES),
      control: { type: 'select', labels: { null: DATE_PICKER_TYPES.SINGLE } },
      table: {
        defaultValue: { summary: DATE_PICKER_TYPES.SINGLE },
      },
    },
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
  },
};

const args = {
  unnamed: 'Date',
  size: 'md',
  name: 'datepicker',
  value: '',
  datePickerType: 'single',
  caption: '',
  required: false,
  disabled: false,
  invalidText: '',
  warnText: '',
  minDate: null,
  maxDate: null,
  step: null,
};

export const DatePicker = {
  args,
  argTypes: {
    datePickerType: {
      table: {
        disabled: true,
      },
    },
  },
  render: (args) => {
    return html`
      <kyn-date-picker
        size=${args.size}
        name=${args.name}
        placeholder=${args.placeholder}
        datePickerType=${args.datePickerType}
        caption=${args.caption}
        ?required=${args.required}
        ?disabled=${args.disabled}
        invalidText=${args.invalidText}
        warnText=${args.warnText}
        minDate=${ifDefined(args.minDate)}
        maxDate=${ifDefined(args.maxDate)}
        step=${ifDefined(args.step)}
        @on-input=${(e) => action(e.type)(e)}
      >
        ${args.unnamed}
      </kyn-date-picker>
    `;
  },
};

export const DateWithTime = {
  args: { ...args, datePickerType: 'date-time', name: 'dateTimePicker' },
  argTypes: {
    datePickerType: {
      table: {
        disabled: true,
      },
    },
  },
  render: (args) => {
    return html`
      <kyn-date-picker
        size=${args.size}
        name=${args.name}
        placeholder=${args.placeholder}
        datePickerType=${args.datePickerType}
        caption=${args.caption}
        ?required=${args.required}
        ?disabled=${args.disabled}
        invalidText=${args.invalidText}
        warnText=${args.warnText}
        minDate=${ifDefined(args.minDate)}
        maxDate=${ifDefined(args.maxDate)}
        step=${ifDefined(args.step)}
        @on-input=${(e) => action(e.type)(e)}
      >
        ${args.unnamed}
      </kyn-date-picker>
    `;
  },
};
