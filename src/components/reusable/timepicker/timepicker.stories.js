import { html } from 'lit';
import './index';
import { action } from '@storybook/addon-actions';
import { useEffect } from '@storybook/addons';

export default {
  title: 'Components/Timepicker',
  component: 'kyn-time-picker',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/CQuDZEeLiuGiALvCWjAKlu/branch/qMpff4GuFUEcsMUkvacS3U/Applications---Component-Library?node-id=19723-26652&node-type=canvas&m=dev',
    },
  },
  argTypes: {
    size: {
      options: ['sm', 'md', 'lg'],
      control: { type: 'select' },
    },
    label: { control: { type: 'text' } },
    locale: { control: { type: 'text' } },
    minTime: { control: { type: 'text' } },
    maxTime: { control: { type: 'text' } },
    defaultDate: { control: { type: 'text' } },
    defaultHour: { control: { type: 'number' } },
    defaultMinute: { control: { type: 'number' } },
    invalidText: { control: { type: 'text' } },
    defaultErrorMessage: { control: { type: 'text' } },
    twentyFourHourFormat: { control: { type: 'boolean' } },
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
    <kyn-time-picker
      .name="${args.name}"
      .label="${args.label}"
      .locale="${args.locale}"
      ?required="${args.required}"
      .size="${args.size}"
      .value="${args.value}"
      .warnText="${args.warnText}"
      .invalidText="${args.invalidText}"
      .caption="${args.caption}"
      .defaultDate="${args.defaultDate}"
      .defaultHour="${args.defaultHour}"
      .defaultMinute="${args.defaultMinute}"
      .defaultErrorMessage="${args.defaultErrorMessage}"
      .minTime="${args.minTime}"
      .maxTime="${args.maxTime}"
      .errorAriaLabel="${args.errorAriaLabel}"
      .errorTitle="${args.errorTitle}"
      .warningAriaLabel="${args.warningAriaLabel}"
      .warningTitle="${args.warningTitle}"
      ?timepickerDisabled="${args.timepickerDisabled}"
      ?readonly="${args.readonly}"
      ?twentyFourHourFormat="${args.twentyFourHourFormat}"
      @on-change=${(e) => action(e.type)(e)}
    >
    </kyn-time-picker>
  `;
};

export const DefaultTimePicker = Template.bind({});
DefaultTimePicker.args = {
  name: 'default-timepicker',
  locale: 'en',
  required: false,
  size: 'md',
  value: null,
  warnText: '',
  invalidText: '',
  caption: '',
  defaultDate: '',
  defaultErrorMessage: 'A time value is required',
  minTime: '',
  maxTime: '',
  errorAriaLabel: 'Error message icon',
  errorTitle: '',
  warningAriaLabel: '',
  warningTitle: '',
  timepickerDisabled: false,
  readonly: false,
  label: 'Timepicker',
};
DefaultTimePicker.storyName = 'Default (12H)';

export const TimePickerTwentyFourHour = Template.bind({});
TimePickerTwentyFourHour.args = {
  ...DefaultTimePicker.args,
  locale: 'en',
  twentyFourHourFormat: true,
  label: 'Timepicker (24H)',
};
TimePickerTwentyFourHour.storyName = 'Timepicker (24H)';

export const TimePickerAltLanguage = Template.bind({});
TimePickerAltLanguage.args = {
  ...DefaultTimePicker.args,
  locale: 'ja',
  twentyFourHourFormat: false,
  label: 'Non-English 12H Example (Japanese locale)',
};
TimePickerAltLanguage.storyName = 'Japanese Locale Example';
