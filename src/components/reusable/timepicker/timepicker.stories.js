import { html } from 'lit';
import './index';
import { action } from '@storybook/addon-actions';
import { useEffect } from '@storybook/addons';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';

import '@kyndryl-design-system/shidoka-foundation/components/icon';
import clockIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/time.svg';
import overflowIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/overflow.svg';

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

const getPlaceholder = (args) => {
  return args.twentyFourHourFormat ? '--:--' : '--:-- --';
};

const Template = (args) => {
  const anchorId = args.nameAttr || 'time-picker-input';

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
      <label
        slot="label"
        class="label-text"
        for=${anchorId}
        ?disabled=${args.timepickerDisabled}
      >
        ${args.required
          ? html`<abbr
              class="required"
              title=${args.textStrings?.requiredText || 'Required'}
              aria-label=${args.textStrings?.requiredText || 'Required'}
              >*</abbr
            >`
          : null}
        ${args.unnamed}
      </label>
      <input
        slot="anchor"
        type="text"
        id=${anchorId}
        placeholder=${getPlaceholder(args)}
        ?disabled=${args.timepickerDisabled}
        aria-required=${args.required ? 'true' : 'false'}
      />
      <span slot="icon" class="icon">${unsafeSVG(clockIcon)}</span>
    </kyn-time-picker>
  `;
};

const ButtonTemplate = (args) => {
  useEffect(() => {
    return () => {
      disconnectFlatpickr();
    };
  }, []);

  return html`
    <kyn-time-picker
      .nameAttr="${args.nameAttr}"
      .locale="${args.locale}"
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
    >
      <label
        slot="label"
        class="label-text"
        ?disabled=${args.timepickerDisabled}
      >
        ${args.required
          ? html`<abbr
              class="required"
              title=${args.textStrings?.requiredText || 'Required'}
              aria-label=${args.textStrings?.requiredText || 'Required'}
              >*</abbr
            >`
          : null}
        ${args.unnamed}
      </label>
      <kd-button
        slot="anchor"
        value="Primary"
        kind=${'primary-app'}
        class="btn interactive"
        description="Date picker button containing icon"
        ?disabled=${args.timepickerDisabled}
      >
        <span slot="icon" style="line-height: 1;"
          >${unsafeSVG(overflowIcon)}</span
        >
      </kd-button>
    </kyn-time-picker>
  `;
};

export const DefaultTimePicker = Template.bind({});
DefaultTimePicker.args = {
  nameAttr: 'default-timepicker',
  locale: 'en',
  required: false,
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
DefaultTimePicker.storyName = 'Default';

export const TimePickerButtonAnchor = ButtonTemplate.bind({});
TimePickerButtonAnchor.args = {
  ...DefaultTimePicker.args,
  locale: 'en',
  required: true,
  unnamed: 'Timepicker with Button Anchor',
};
TimePickerButtonAnchor.storyName = 'Button Anchor';

export const TimePickerTwentyFourHour = Template.bind({});
TimePickerTwentyFourHour.args = {
  ...DefaultTimePicker.args,
  locale: 'en',
  required: true,
  twentyFourHourFormat: true,
  unnamed: 'Timepicker with Button Anchor',
};
TimePickerTwentyFourHour.storyName = 'Twenty-Four-Hour Format';

export const TimePickerAltLanguage = Template.bind({});
TimePickerAltLanguage.args = {
  ...DefaultTimePicker.args,
  locale: 'ja',
  unnamed: 'タイムピッカー',
};
TimePickerAltLanguage.storyName = 'Japanese Locale Example';
