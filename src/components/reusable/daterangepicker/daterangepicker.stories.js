import { html } from 'lit';
import './index';
import './daterangepicker.scss';
import '@kyndryl-design-system/shidoka-foundation/components/icon';
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
    locale: {
      control: { type: 'text' },
    },
    dateFormat: {
      options: [
        'Y-m-d',
        'm-d-Y',
        'd-m-Y',
        'Y-m-d H:i',
        'Y-m-d H:i:s',
        'm-d-Y H:i:s',
        'd-m-Y H:i:s',
      ],
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
  return html`<kyn-date-range-picker
    .nameAttr="${args.nameAttr}"
    .locale="${args.locale}"
    .dateFormat="${args.dateFormat}"
    .size="${args.size}"
    .value="${args.value}"
    .warnText="${args.warnText}"
    .invalidText="${args.invalidText}"
    .altFormat=${args.altFormat}
    .disable="${args.disable}"
    .enable="${args.enable}"
    .mode=${args.mode}
    .caption="${args.caption}"
    ?required="${args.required}"
    ?dateRangePickerDisabled="${args.dateRangePickerDisabled}"
    .minDate="${args.minDate}"
    .maxDate="${args.maxDate}"
    @on-change=${(e) => action(e.type)(e)}
  >
    <span slot="start-label">Start Date</span>
    <span slot="end-label">End Date</span>
  </kyn-date-range-picker>`;
};

export const DateRangePicker = Template.bind({});
DateRangePicker.args = {
  nameAttr: 'default-date-range-picker',
  locale: 'en',
  dateFormat: 'Y-m-d',
  size: 'md',
  value: [null, null],
  warnText: '',
  invalidText: '',
  altFormat: 'F j, Y',
  disable: [],
  enable: [],
  caption: '',
  required: false,
  dateRangePickerDisabled: false,
  mode: 'range',
  minDate: '',
  maxDate: '',
};

export const DateTimeRangePicker = Template.bind({});
DateTimeRangePicker.args = {
  ...DateRangePicker.args,
  locale: 'es',
  nameAttr: 'date-time-picker',
  dateFormat: 'Y-m-d H:i',
  caption: 'Example of spanish (es) calendar locale.',
};
DateTimeRangePicker.storyName = 'Date Time Range Picker (Español)';
