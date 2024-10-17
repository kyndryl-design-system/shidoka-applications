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
    minDate: { control: { type: 'text' } },
    maxDate: { control: { type: 'text' } },
  },
};

const disconnectFlatpickr = () => {
  const calendarElements = document.querySelectorAll('.flatpickr-calendar');
  calendarElements.forEach((calendar) => calendar.remove());
};

const InputTemplate = (args) => {
  useEffect(() => {
    return () => {
      disconnectFlatpickr();
    };
  }, []);

  return html`<kyn-date-picker
    .nameAttr="${args.nameAttr}"
    .locale="${args.locale}"
    .dateFormat="${args.dateFormat}"
    ?required="${args.required}"
    .value="${args.value}"
    .warnText="${args.warnText}"
    .invalidText="${args.invalidText}"
    .altFormat=${args.altFormat}
    .disable="${args.disable}"
    .enable="${args.enable}"
    .mode="${args.mode}"
    .caption="${args.caption}"
    ?datePickerDisabled="${args.datePickerDisabled}"
    ?twentyFourHourFormat="${args.twentyFourHourFormat}"
    .minDate="${args.minDate}"
    .maxDate="${args.maxDate}"
    @on-change=${(e) => action(e.type)(e)}
  >
    ${args.unnamed}
  </kyn-date-picker>`;
};

export const DatePickerDefault = InputTemplate.bind({});
DatePickerDefault.args = {
  nameAttr: 'default-date-picker',
  locale: 'en',
  dateFormat: 'Y-m-d',
  required: true,
  value: '',
  warnText: '',
  invalidText: '',
  altFormat: 'F j, Y',
  disable: [],
  enable: [],
  mode: 'single',
  caption: 'Example datepicker caption.',
  datePickerDisabled: false,
  twentyFourHourFormat: false,
  minDate: '',
  maxDate: '',
  unnamed: 'Date',
};
DatePickerDefault.storyName = 'Single Date Selection (Default)';

export const DateWithTime = InputTemplate.bind({});
DateWithTime.args = {
  ...DatePickerDefault.args,
  locale: 'hi',
  nameAttr: 'date-time-picker',
  dateFormat: 'Y-m-d H:i',
  caption: '',
  unnamed: 'दिनांक एवं समय चयनकर्ता',
};
DateWithTime.storyName = 'Single Date + Time (Hindi Locale)';

export const DatePickerMultiple = InputTemplate.bind({});
DatePickerMultiple.args = {
  ...DatePickerDefault.args,
  locale: 'en',
  nameAttr: 'date-multiple-picker',
  dateFormat: 'Y-m-d',
  caption: '',
  mode: 'multiple',
  unnamed: 'Date Picker (w/ Multiselect)',
};
DatePickerMultiple.storyName = 'Multiple Date Selection';
