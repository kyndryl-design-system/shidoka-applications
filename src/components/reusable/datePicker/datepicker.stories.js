import './index';
import { html } from 'lit';
import { action } from '@storybook/addon-actions';
import { useEffect } from '@storybook/addons';

export default {
  title: 'Components/DatePicker',
  component: 'kyn-date-picker',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/s9VKYHFn1GncFyxd5l19nU/1.11-Amsterdam?node-id=6086-1559&node-type=canvas&m=dev',
    },
  },
  argTypes: {
    locale: { control: { type: 'text' } },
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
    mode: {
      options: ['single', 'multiple'],
      control: { type: 'select' },
    },
    size: {
      options: ['sm', 'md', 'lg'],
      control: { type: 'select' },
    },
    defaultDate: { control: { type: 'text' } },
    twentyFourHourFormat: { control: { type: 'boolean' } },
    defaultErrorMessage: { control: { type: 'text' } },
    minDate: { control: { type: 'text' } },
    maxDate: { control: { type: 'text' } },
    label: { control: { type: 'text' } },
    invalidText: { control: { type: 'text' } },
  },
};

const disconnectFlatpickr = () => {
  const calendarElements = document.querySelectorAll('.flatpickr-calendar');
  calendarElements.forEach((calendar) => calendar.remove());
};

const Template = (args) => {
  useEffect(() => {
    return () => {
      disconnectFlatpickr();
    };
  }, []);

  return html`
    <kyn-date-picker
      .name="${args.name}"
      .locale="${args.locale}"
      .label="${args.label}"
      .dateFormat="${args.dateFormat}"
      .defaultDate="${args.defaultDate}"
      .defaultErrorMessage="${args.defaultErrorMessage}"
      ?required="${args.required}"
      .size="${args.size}"
      .value="${args.value}"
      .warnText="${args.warnText}"
      .invalidText="${args.invalidText}"
      .disable="${args.disable}"
      .enable="${args.enable}"
      .mode="${args.mode}"
      .caption="${args.caption}"
      .errorAriaLabel="${args.errorAriaLabel}"
      .errorTitle="${args.errorTitle}"
      .warningAriaLabel="${args.warningAriaLabel}"
      .warningTitle="${args.warningTitle}"
      ?datePickerDisabled="${args.datePickerDisabled}"
      ?twentyFourHourFormat="${args.twentyFourHourFormat}"
      .minDate="${args.minDate}"
      .maxDate="${args.maxDate}"
      @on-change=${(e) => action(e.type)(e)}
    >
    </kyn-date-picker>
  `;
};

export const DatePickerDefault = Template.bind({});
DatePickerDefault.args = {
  name: 'default-date-picker',
  locale: 'en',
  dateFormat: 'Y-m-d',
  defaultDate: '',
  defaultErrorMessage: 'A date value is required',
  required: false,
  size: 'md',
  value: '',
  warnText: '',
  invalidText: '',
  disable: [],
  enable: [],
  errorAriaLabel: 'Error message icon',
  errorTitle: '',
  warningAriaLabel: '',
  warningTitle: '',
  mode: 'single',
  caption: 'Example datepicker caption.',
  datePickerDisabled: false,
  minDate: '',
  maxDate: '',
  label: 'Date',
};
DatePickerDefault.storyName = 'Single Date (Default)';

export const DateWithTime = Template.bind({});
DateWithTime.args = {
  ...DatePickerDefault.args,
  locale: 'hi',
  name: 'date-time-picker',
  dateFormat: 'Y-m-d H:i',
  caption: '',
  label: 'Hindi Locale Example',
};
DateWithTime.storyName = 'Date + Time (Hindi Locale)';

export const DatePickerMultiple = Template.bind({});
DatePickerMultiple.args = {
  ...DatePickerDefault.args,
  locale: 'en',
  name: 'date-multiple-picker',
  dateFormat: 'Y-m-d',
  caption: '',
  mode: 'multiple',
  label: 'Date Picker (w/ Multiselect)',
};
DatePickerMultiple.storyName = 'Multiple Date Selection';
