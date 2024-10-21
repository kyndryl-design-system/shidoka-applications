import './index';
import { html } from 'lit';
import { action } from '@storybook/addon-actions';
import { useEffect } from '@storybook/addons';

export default {
  title: 'Components/Date Range Picker',
  component: 'kyn-date-range-picker',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/s9VKYHFn1GncFyxd5l19nU/1.11-Amsterdam?node-id=6086-1559&node-type=canvas&m=dev',
    },
  },
  argTypes: {
    locale: { control: { type: 'text' } },
    twentyFourHourFormat: { control: { type: 'boolean' } },
    dateRangePickerDisabled: { control: { type: 'boolean' } },
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
    size: {
      options: ['sm', 'md', 'lg'],
      control: { type: 'select' },
    },
    label: { control: { type: 'text' } },
    defaultErrorMessage: { control: { type: 'text' } },
    minDate: { control: { type: 'text' } },
    maxDate: { control: { type: 'text' } },
    invalidText: { control: { type: 'text' } },
  },
};

const disconnectFlatpickr = () => {
  const calendarElements = document.querySelectorAll('.flatpickr-calendar');
  calendarElements.forEach((calendar) => calendar.remove());
};

const SingleInput = (args) => {
  // prevents flatpickr calendar overlay from persisting on view change
  useEffect(() => {
    return () => {
      disconnectFlatpickr();
    };
  }, []);

  return html`
    <kyn-date-range-picker
      .name="${args.name}"
      .label="${args.label}"
      .locale="${args.locale}"
      .dateFormat="${args.dateFormat}"
      .defaultDate="${args.defaultDate}"
      .defaultErrorMessage="${args.defaultErrorMessage}"
      .value="${args.value}"
      .warnText="${args.warnText}"
      .invalidText="${args.invalidText}"
      .disable="${args.disable}"
      .enable="${args.enable}"
      .caption="${args.caption}"
      ?required="${args.required}"
      .size="${args.size}"
      ?dateRangePickerDisabled="${args.dateRangePickerDisabled}"
      ?twentyFourHourFormat="${args.twentyFourHourFormat}"
      .minDate="${args.minDate}"
      .maxDate="${args.maxDate}"
      .errorAriaLabel="${args.errorAriaLabel}"
      .errorTitle="${args.errorTitle}"
      .warningAriaLabel="${args.warningAriaLabel}"
      .warningTitle="${args.warningTitle}"
      .startDateLabel="${args.startDateLabel}"
      .endDateLabel="${args.endDateLabel}"
      @on-change=${(e) => action(e.type)(e)}
    >
    </kyn-date-range-picker>
  `;
};

export const DefaultDateRangePicker = SingleInput.bind({});
DefaultDateRangePicker.args = {
  name: 'default-date-range-picker',
  locale: 'en',
  dateFormat: 'Y-m-d',
  defaultDate: '',
  required: false,
  size: 'md',
  defaultErrorMessage: 'Both start and end dates are required',
  value: [null, null],
  warnText: '',
  invalidText: '',
  disable: [],
  enable: [],
  errorAriaLabel: 'Error message icon',
  errorTitle: '',
  warningAriaLabel: '',
  warningTitle: '',
  caption: 'Click the input above to select a date range.',
  dateRangePickerDisabled: false,
  twentyFourHourFormat: false,
  minDate: '',
  maxDate: '',
  label: 'Date Range',
};
DefaultDateRangePicker.storyName = 'Date Range Only (Default)';

export const DateTimeRangePickerSingle = SingleInput.bind({});
DateTimeRangePickerSingle.args = {
  ...DefaultDateRangePicker.args,
  name: 'date-time-range-picker',
  dateFormat: 'Y-m-d H:i',
  caption: 'Example caption for the Date Range Picker with Time Input',
  label: 'Start + End Date / Time',
};
DateTimeRangePickerSingle.storyName = 'Date + Time Range';
