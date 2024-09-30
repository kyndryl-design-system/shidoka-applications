import { html } from 'lit';
import './index';
import '@kyndryl-design-system/shidoka-foundation/components/icon';

export default {
  title: 'Components/DatePicker',
  component: 'kyn-date-picker',
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
  },
};

const args = {
  name: '',
  invalidText: '',
  size: 'md',
  value: '',
  datePickerType: 'date-time',
  caption: '',
  required: false,
  disabled: false,
  minDate: '',
  maxDate: '',
  step: '',
  unnamed: '',
};

export const DatePicker = {
  args,
  render: (args) => {
    return html`<kyn-date-picker
      name="${args.name}"
      invalid-text="${args.invalidText}"
      size="${args.size}"
      value="${args.value}"
      date-picker-type="${args.datePickerType}"
      caption="${args.caption}"
      ?required="${args.required}"
      ?disabled="${args.disabled}"
      min-date="${args.minDate}"
      max-date="${args.maxDate}"
      step="${args.step}"
    ></kyn-date-picker>`;
  },
};
