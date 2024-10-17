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
      url: 'https://www.figma.com/design/s9VKYHFn1GncFyxd5l19nU/1.11-Amsterdam?node-id=6086-1559&node-type=canvas&m=dev',
    },
  },
  argTypes: {
    locale: { control: { type: 'text' } },
    minTime: { control: { type: 'text' } },
    maxTime: { control: { type: 'text' } },
    defaultDate: { control: { type: 'text' } },
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
      .nameAttr="${args.nameAttr}"
      .locale="${args.locale}"
      ?required="${args.required}"
      .value="${args.value}"
      .warnText="${args.warnText}"
      .invalidText="${args.invalidText}"
      .caption="${args.caption}"
      .defaultDate="${args.defaultDate}"
      .minTime="${args.minTime}"
      .maxTime="${args.maxTime}"
      ?timepickerDisabled="${args.timepickerDisabled}"
      ?twentyFourHourFormat="${args.twentyFourHourFormat}"
      @on-change=${(e) => action(e.type)(e)}
    >
      ${args.unnamed}
    </kyn-time-picker>
  `;
};

export const DefaultTimePicker = Template.bind({});
DefaultTimePicker.args = {
  nameAttr: 'default-timepicker',
  locale: 'en',
  required: true,
  value: null,
  warnText: '',
  invalidText: '',
  caption: '',
  defaultDate: '',
  minTime: '',
  maxTime: '',
  timepickerDisabled: false,
  twentyFourHourFormat: false,
  unnamed: 'Timepicker',
  textStrings: { requiredText: 'Required' },
};
DefaultTimePicker.storyName = 'Default (12H)';

export const TimePickerTwentyFourHour = Template.bind({});
TimePickerTwentyFourHour.args = {
  ...DefaultTimePicker.args,
  locale: 'en',
  twentyFourHourFormat: true,
  unnamed: 'Timepicker (24H)',
};
TimePickerTwentyFourHour.storyName = 'Timepicker (24H)';

export const TimePickerAltLanguage = Template.bind({});
TimePickerAltLanguage.args = {
  ...DefaultTimePicker.args,
  locale: 'ja',
  unnamed: 'タイムピッカー',
};
TimePickerAltLanguage.storyName = 'Japanese Locale Example';
