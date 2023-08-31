import { html } from 'lit';
import './index';
import { action } from '@storybook/addon-actions';
import { ifDefined } from 'lit/directives/if-defined.js';
import '@kyndryl-design-system/foundation/components/icon';

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
    type: {
      options: ['date', 'datetime-local'],
      control: { type: 'select' },
      table: { defaultValue: { summary: 'date' } },
    },
    datePickerType: {
      options: ['single', 'date-range', 'date-time'],
      control: { type: 'select', labels: { null: 'single' } },
      table: {
        defaultValue: { summary: 'single' },
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
  },
};

const args = {
  unnamed: 'Date',
  size: 'md',
  type: 'date',
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
};

export const DatePicker = {
  args,
  // argTypes: {
  //   type: {
  //     table: {
  //       disable: true,
  //     },
  //   },
  // },
  render: (args) => {
    return html`
      <kyn-date-picker
        size=${args.size}
        name=${args.name}
        type=${args.type}
        placeholder=${args.placeholder}
        datePickerType=${args.datePickerType}
        caption=${args.caption}
        ?required=${args.required}
        ?disabled=${args.disabled}
        invalidText=${args.invalidText}
        warnText=${args.warnText}
        minDate=${ifDefined(args.minDate)}
        maxDate=${ifDefined(args.maxDate)}
        @on-input=${(e) => action(e.type)(e)}
      >
        ${args.unnamed}
      </kyn-date-picker>
    `;
  },
};
