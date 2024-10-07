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
      url: 'https://www.figma.com/file/PDrJbUpubptqYdtRxih328/Kyndryl-Bridge-Styleguide?type=design&node-id=453%3A5461&mode=design&t=IlM5BJosU7XtIXHl-1',
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

const SingleInput = (args) => {
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
    .multipleInputs="${args.multipleInputs}"
    .caption="${args.caption}"
    ?required="${args.required}"
    ?dateRangePickerDisabled="${args.dateRangePickerDisabled}"
    .minDate="${args.minDate}"
    .maxDate="${args.maxDate}"
    @on-change=${(e) => action(e.type)(e)}
  >
    <span slot="start-label">Date</span>
  </kyn-date-range-picker>`;
};

const MultiInputTemplate = (args) => {
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
    .multipleInputs="${args.multipleInputs}"
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

export const DateRangePicker = SingleInput.bind({});
DateRangePicker.args = {
  nameAttr: 'default-date-range-picker',
  locale: 'en',
  dateFormat: 'Y-m-d',
  multipleInputs: false,
  size: 'md',
  value: [null, null],
  warnText: '',
  invalidText: '',
  altFormat: 'F j, Y',
  disable: [],
  enable: [],
  caption: 'Click the input above to select a date range.',
  required: false,
  dateRangePickerDisabled: false,
  minDate: '',
  maxDate: '',
};
DateRangePicker.storyName = 'Date Range Single Input (Default)';

export const DateRangePickerMulti = MultiInputTemplate.bind({});
DateRangePickerMulti.args = {
  ...DateRangePicker.args,
  locale: 'en',
  nameAttr: 'date-range-picker',
  dateFormat: 'Y-m-d',
  multipleInputs: true,
  caption: '',
};
DateRangePickerMulti.storyName = 'Date Range Multi Input';

export const DateTimeRangePickerSingle = SingleInput.bind({});
DateTimeRangePickerSingle.args = {
  ...DateRangePicker.args,
  locale: 'en',
  nameAttr: 'date-time-picker',
  dateFormat: 'Y-m-d H:i',
  multipleInputs: false,
  caption: '',
};
DateTimeRangePickerSingle.storyName = 'Date / Time Range Single Input';

export const DateTimeRangePickerMulti = MultiInputTemplate.bind({});
DateTimeRangePickerMulti.args = {
  ...DateRangePicker.args,
  locale: 'es',
  nameAttr: 'date-time-picker',
  dateFormat: 'Y-m-d H:i',
  multipleInputs: true,
  caption: "Example of spanish ('es') calendar locale.",
};
DateTimeRangePickerMulti.storyName =
  'Date / Time Range Multi Input (Spanish Locale)';
