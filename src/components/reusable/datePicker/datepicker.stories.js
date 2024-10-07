import { html } from 'lit';
import './index';
import '@kyndryl-design-system/shidoka-foundation/components/icon';
import { action } from '@storybook/addon-actions';
import { useEffect } from '@storybook/addons';

export default {
  title: 'Components/DatePicker',
  component: 'kyn-date-picker',
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
    mode: {
      options: ['single', 'multiple'],
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

  return html`<kyn-date-picker
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
    .mode="${args.mode}"
    .caption="${args.caption}"
    ?required="${args.required}"
    ?datePickerDisabled="${args.datePickerDisabled}"
    ?twentyFourHourFormat="${args.twentyFourHourFormat}"
    .minDate="${args.minDate}"
    .maxDate="${args.maxDate}"
    @on-change=${(e) => action(e.type)(e)}
    >Date</kyn-date-picker
  >`;
};

export const DatePicker = Template.bind({});
DatePicker.args = {
  nameAttr: 'default-date-picker',
  locale: 'en',
  dateFormat: 'Y-m-d',
  size: 'md',
  value: '',
  warnText: '',
  invalidText: '',
  altFormat: 'F j, Y',
  disable: [],
  enable: [],
  mode: 'single',
  caption: 'Example datepicker caption.',
  required: false,
  datePickerDisabled: false,
  twentyFourHourFormat: false,
  minDate: '',
  maxDate: '',
};

export const DateWithTime = Template.bind({});
DateWithTime.args = {
  ...DatePicker.args,
  locale: 'hi',
  nameAttr: 'date-time-picker',
  dateFormat: 'Y-m-d H:i',
  caption: '',
  unnamed: 'Date & Time Picker',
};
DateWithTime.storyName = 'Date w/ Time (Hindi Locale Example)';

export const DatePickerMultiple = Template.bind({});
DatePickerMultiple.args = {
  ...DatePicker.args,
  locale: 'en',
  nameAttr: 'date-multiple-picker',
  dateFormat: 'Y-m-d',
  caption: '',
  mode: 'multiple',
};
DatePickerMultiple.storyName = 'Date Picker w/ Multiple Selection';
