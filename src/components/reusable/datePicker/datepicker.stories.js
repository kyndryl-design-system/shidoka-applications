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
      .nameAttr="${args.nameAttr}"
      .locale="${args.locale}"
      .label="${args.label}"
      .dateFormat="${args.dateFormat}"
      .defaultErrorMessage="${args.defaultErrorMessage}"
      ?required="${args.required}"
      .value="${args.value}"
      .warnText="${args.warnText}"
      .invalidText="${args.invalidText}"
      .altFormat=${args.altFormat}
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
  nameAttr: 'default-date-picker',
  locale: 'en',
  dateFormat: 'Y-m-d',
  defaultErrorMessage: 'A date value is required',
  required: false,
  value: '',
  warnText: '',
  invalidText: '',
  altFormat: 'F j, Y',
  disable: [],
  enable: [],
  errorAriaLabel: '',
  errorTitle: '',
  warningAriaLabel: '',
  warningTitle: '',
  mode: 'single',
  caption: 'Example datepicker caption.',
  datePickerDisabled: false,
  twentyFourHourFormat: false,
  minDate: '',
  maxDate: '',
  label: 'Date',
};
DatePickerDefault.storyName = 'Date Selection (Default)';

export const DateWithTime = Template.bind({});
DateWithTime.args = {
  ...DatePickerDefault.args,
  locale: 'hi',
  nameAttr: 'date-time-picker',
  dateFormat: 'Y-m-d H:i',
  caption: '',
  label: 'दिनांक एवं समय चयनकर्ता',
};
DateWithTime.storyName = 'Date + Time (Hindi Locale)';

export const DatePickerMultiple = Template.bind({});
DatePickerMultiple.args = {
  ...DatePickerDefault.args,
  locale: 'en',
  nameAttr: 'date-multiple-picker',
  dateFormat: 'Y-m-d',
  caption: '',
  mode: 'multiple',
  label: 'Date Picker (w/ Multiselect)',
};
DatePickerMultiple.storyName = 'Multiple Date Selection';
