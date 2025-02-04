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
      url: 'https://www.figma.com/design/CQuDZEeLiuGiALvCWjAKlu/branch/qMpff4GuFUEcsMUkvacS3U/Applications---Component-Library?node-id=19723-26652&node-type=canvas&m=dev',
    },
  },
  argTypes: {
    locale: { control: { type: 'text' } },
    twentyFourHourFormat: { control: { type: 'boolean' } },
    dateRangePickerDisabled: { control: { type: 'boolean' } },
    readonly: { control: { type: 'boolean' } },
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
    defaultDate: { control: { type: 'object' } },
    label: { control: { type: 'text' } },
    defaultErrorMessage: { control: { type: 'text' } },
    minDate: { control: { type: 'text' } },
    maxDate: { control: { type: 'text' } },
    invalidText: { control: { type: 'text' } },
  },
};

const Template = (args) => {
  useEffect(() => {
    return () => {
      const picker = document.querySelector('kyn-date-range-picker');
      if (picker) {
        picker.remove();
      }
    };
  }, []);

  return html`
    <kyn-date-range-picker
      .name="${args.name}"
      .label="${args.label}"
      .locale="${args.locale}"
      .dateFormat="${args.dateFormat}"
      .defaultDate=${args.defaultDate}
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
      ?readonly="${args.readonly}"
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

export const DateRangeDefault = Template.bind({});
DateRangeDefault.args = {
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
  readonly: false,
  minDate: '',
  maxDate: '',
  label: 'Date Range',
};

export const DateTimeRange = Template.bind({});
DateTimeRange.args = {
  ...DateRangeDefault.args,
  name: 'date-time-range-picker',
  dateFormat: 'Y-m-d H:i',
  caption: 'Example caption for the Date Range Picker with Time Input',
  label: 'Start + End Date / Time',
};

export const WithPreselectedRange = Template.bind({});
WithPreselectedRange.args = {
  ...DateRangeDefault.args,
  name: 'preselected-date-range',
  dateFormat: 'Y-m-d',
  defaultDate: ['2024-01-01', '2024-01-07'],
  caption: 'Example with preselected date range (format: Y-m-d)',
  label: 'Preselected Range',
};

export const WithPreselectedDateTime = Template.bind({});
WithPreselectedDateTime.args = {
  ...DateRangeDefault.args,
  name: 'preselected-date-time-range',
  dateFormat: 'Y-m-d H:i',
  defaultDate: ['2024-01-01 09:00', '2024-01-02 17:00'],
  caption: 'Example with preselected date/time range (format: Y-m-d H:i)',
  label: 'Preselected Date/Time Range',
};
