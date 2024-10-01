import { html } from 'lit';
import './index';
import '@kyndryl-design-system/shidoka-foundation/components/icon';
import { action } from '@storybook/addon-actions';

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
    minDate: {
      control: { type: 'text' },
    },
    maxDate: {
      control: { type: 'text' },
    },
  },
};

const Template = (args) => {
  return html`<kyn-date-picker
    .nameAttr="${args.nameAttr}"
    .dateFormat="${args.dateFormat}"
    .size="${args.size}"
    .value="${args.value}"
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
    @on-change=${(e) => action(e.type)(e)}
    >${args.unnamed}</kyn-date-picker
  >`;
};

export const Default = Template.bind({});
Default.args = {
  nameAttr: 'default-date-picker',
  dateFormat: 'Y-m-d',
  size: 'md',
  value: null,
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
  unnamed: 'Date Only Picker',
};

export const DateTime = Template.bind({});
DateTime.args = {
  ...Default.args,
  nameAttr: 'date-time-picker',
  dateFormat: 'Y-m-d H:i',
  unnamed: 'Date & Time Picker',
};
