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
    mode: {
      options: ['single', 'multiple', 'range', 'time'],
      control: { type: 'select' },
    },
    datePickerType: {
      options: ['default', 'date-time'],
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
  nameAttr: 'Date',
  dateFormat: 'Y-m-d H:i',
  size: 'md',
  value: null,
  datePickerType: 'date-time',
  warnText: '',
  invalidText: '',
  altFormat: 'F j, Y',
  disable: [],
  enable: false,
  mode: 'single',
  caption: '',
  required: false,
  datePickerDisabled: false,
  minDate: '',
  maxDate: '',
  step: '',
  unnamed: 'Date Picker',
};

export const DatePicker = {
  args,
  render: (args) => {
    return html`<kyn-date-picker
      .nameAttr="${args.nameAttr}"
      .dateFormat="${args.dateFormat}"
      .size="${args.size}"
      .value="${args.value}"
      .datePickerType="${args.datePickerType}"
      .warnText="${args.warnText}"
      .invalidText="${args.invalidText}"
      .altFormat=${args.altFormat}
      .disable="${args.disable}"
      .enable="${args.enable}"
      .mode="${args.mode}"
      .caption="${args.caption}"
      ?required="${args.required}"
      ?datePickerDisabled="${args.datePickerDisabled}"
      .minDate="${args.minDate}"
      .maxDate="${args.maxDate}"
      .step="${args.step}"
      >${args.unnamed}</kyn-date-picker
    >`;
  },
};
