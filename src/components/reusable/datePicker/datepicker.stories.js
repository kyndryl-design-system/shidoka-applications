import { html } from 'lit';
import './index';
import { action } from '@storybook/addon-actions';
import { ifDefined } from 'lit/directives/if-defined.js';
import '@kyndryl-design-system/foundation/components/icon';

export default {
  title: 'Components/DatePicker',
  component: 'kyn-date-picker',
  argTypes: {
    type: {
      options: ['date', 'datetime-local'],
      control: { type: 'select' },
      table: { defaultValue: { summary: 'date' } },
    },
    datePickerType: {
      options: ['single', 'range'],
      control: { type: 'select', labels: { null: 'single' } },
      table: {
        defaultValue: { summary: 'single' },
      },
    },
    size: {
      options: ['sm', 'md', 'lg'],
      control: { type: 'select' },
    },
    min: {
      control: { type: 'text' },
    },
    max: {
      control: { type: 'text' },
    },
  },
};

const args = {
  unnamed: 'Label',
  size: 'md',
  type: 'date',
  placeholder: 'MM/DD/YYYY',
  name: 'datepicker',
  value: '12/12/2022',
  datePickerType: 'single',
  caption: '',
  required: false,
  disabled: false,
  invalidText: '',
  min: null,
  max: null,
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
        min=${ifDefined(args.min)}
        max=${ifDefined(args.max)}
        @on-input=${(e) => action(e.type)(e)}
      >
        ${args.unnamed}
      </kyn-date-picker>
    `;
  },
};
