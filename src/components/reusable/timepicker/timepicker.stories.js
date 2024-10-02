import { html } from 'lit';
import './index';
import '@kyndryl-design-system/shidoka-foundation/components/icon';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Components/Timepicker',
  component: 'kyn-time-picker',
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
    minTime: {
      control: { type: 'text' },
    },
    maxTime: {
      control: { type: 'text' },
    },
    defaultDate: {
      control: { type: 'text' },
    },
  },
};

const Template = (args) => {
  return html`<kyn-time-picker
    .nameAttr="${args.nameAttr}"
    .locale="${args.locale}"
    .size="${args.size}"
    .value="${args.value}"
    .warnText="${args.warnText}"
    .invalidText="${args.invalidText}"
    .caption="${args.caption}"
    .defaultDate="${args.defaultDate}"
    .minTime="${args.minTime}"
    .maxTime="${args.maxTime}"
    ?required="${args.required}"
    ?timepickerDisabled="${args.timepickerDisabled}"
    ?twentyFourHourFormat="${args.twentyFourHourFormat}"
    @on-change=${(e) => action(e.type)(e)}
    >${args.unnamed}</kyn-time-picker
  >`;
};

export const TimePicker = Template.bind({});
TimePicker.args = {
  nameAttr: 'default-timepicker',
  locale: 'en',
  size: 'md',
  value: null,
  warnText: '',
  invalidText: '',
  caption: '',
  defaultDate: '',
  minTime: '',
  maxTime: '',
  required: false,
  timepickerDisabled: false,
  twentyFourHourFormat: false,
  unnamed: 'Timepicker',
};

export const TimePickerAltLanguage = Template.bind({});
TimePickerAltLanguage.args = {
  ...TimePicker.args,
  locale: 'ja',
};
TimePickerAltLanguage.storyName = 'Time Picker (Japanese)';
