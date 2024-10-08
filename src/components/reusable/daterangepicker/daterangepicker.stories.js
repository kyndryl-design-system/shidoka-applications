import { html } from 'lit';
import './index';
import './daterangepicker.scss';
import '@kyndryl-design-system/shidoka-foundation/components/icon';
import { action } from '@storybook/addon-actions';
import { useEffect } from '@storybook/addons';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { getPlaceholder } from '../../../common/helpers/flatpickr';

import './daterangepicker.scss';

import '@kyndryl-design-system/shidoka-foundation/components/icon';
import calendarIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/calendar.svg';

export default {
  title: 'Components/Date Range Picker',
  component: 'kyn-date-range-picker',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/dhPuQQrqxHqMvtmnMMuTry/Santorini---Global-Filters?node-id=518-47488&node-type=frame&m=dev',
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

const SingleInput = (args) => {
  useEffect(() => {
    return () => {
      disconnectFlatpickr();
    };
  }, []);

  const placeholder = getPlaceholder(args.dateFormat);
  const startInputId = 'date-range-picker-start';

  return html`
    <kyn-date-range-picker
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
      .multipleInputs="${args.multipleInputs}"
      .caption="${args.caption}"
      ?required="${args.required}"
      ?dateRangePickerDisabled="${args.dateRangePickerDisabled}"
      .minDate="${args.minDate}"
      .maxDate="${args.maxDate}"
      @on-change=${(e) => action(e.type)(e)}
    >
      <label
        slot="start-label"
        class="label-text"
        for=${startInputId}
        ?disabled=${args.dateRangePickerDisabled}
      >
        ${args.required
          ? html`<abbr
              class="required"
              title=${args._textStrings.requiredText}
              aria-label=${args._textStrings.requiredText}
              >*</abbr
            >`
          : null}
        Start Date Label
      </label>
      <div slot="start-input" class="input-container">
        <input
          type="text"
          id=${startInputId}
          class="start-date"
          placeholder=${placeholder}
          ?disabled=${args.dateRangePickerDisabled}
          .value=${getInputsValue(0, args.value)}
          aria-required=${args.required ? 'true' : 'false'}
          aria-invalid=${args._isInvalid ? 'true' : 'false'}
        />
        <span class="icon">${unsafeSVG(calendarIcon)}</span>
      </div>
    </kyn-date-range-picker>
  `;
};

function getInputsValue(index, value) {
  return Array.isArray(value) && value[index] != null
    ? new Date(value[index]).toLocaleString()
    : '';
}

const MultiInputTemplate = (args) => {
  useEffect(() => {
    return () => {
      disconnectFlatpickr();
    };
  }, []);

  const placeholder = getPlaceholder(args.dateFormat);
  const startInputId = 'date-range-picker-start';
  const endInputId = 'date-range-picker-end';

  return html`
    <kyn-date-range-picker
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
      .multipleInputs="${args.multipleInputs}"
      .caption="${args.caption}"
      ?required="${args.required}"
      ?dateRangePickerDisabled="${args.dateRangePickerDisabled}"
      .minDate="${args.minDate}"
      .maxDate="${args.maxDate}"
      @on-change=${(e) => action(e.type)(e)}
    >
      <label
        slot="start-label"
        class="label-text"
        for=${startInputId}
        ?disabled=${args.dateRangePickerDisabled}
      >
        ${args.required
          ? html`<abbr
              class="required"
              title=${args._textStrings.requiredText}
              aria-label=${args._textStrings.requiredText}
              >*</abbr
            >`
          : null}
        Start Date Label
      </label>
      <div slot="start-input" class="input-container">
        <input
          type="text"
          id=${startInputId}
          class="start-date"
          placeholder=${placeholder}
          ?disabled=${args.dateRangePickerDisabled}
          .value=${getInputsValue(0, args.value)}
          aria-required=${args.required ? 'true' : 'false'}
          aria-invalid=${args._isInvalid ? 'true' : 'false'}
        />
        <span class="icon">${unsafeSVG(calendarIcon)}</span>
      </div>

      <label
        slot="end-label"
        class="label-text"
        for=${endInputId}
        ?disabled=${args.dateRangePickerDisabled}
      >
        ${args.required
          ? html`<abbr
              class="required"
              title=${args._textStrings.requiredText}
              aria-label=${args._textStrings.requiredText}
              >*</abbr
            >`
          : null}
        End Date Label
      </label>
      <div slot="end-input" class="input-container">
        <input
          type="text"
          id=${endInputId}
          class="end-date"
          placeholder=${placeholder}
          ?disabled=${args.dateRangePickerDisabled}
          .value=${getInputsValue(1, args.value)}
          aria-required=${args.required ? 'true' : 'false'}
          aria-invalid=${args._isInvalid ? 'true' : 'false'}
        />
        <span class="icon">${unsafeSVG(calendarIcon)}</span>
      </div>
    </kyn-date-range-picker>
  `;
};

export const DateRangePicker = SingleInput.bind({});
DateRangePicker.args = {
  nameAttr: 'default-date-range-picker',
  locale: 'en',
  dateFormat: 'Y-m-d',
  multipleInputs: false,
  size: 'md',
  value: [null, null],
  warnText: '',
  invalidText: '',
  altFormat: 'F j, Y',
  disable: [],
  enable: [],
  caption: 'Click the input above to select a date range.',
  required: false,
  dateRangePickerDisabled: false,
  minDate: '',
  maxDate: '',
};
DateRangePicker.storyName = 'Date Range Single Input (Default)';

export const DateRangePickerMulti = MultiInputTemplate.bind({});
DateRangePickerMulti.args = {
  ...DateRangePicker.args,
  locale: 'en',
  nameAttr: 'date-range-picker',
  dateFormat: 'Y-m-d',
  multipleInputs: true,
  caption: '',
};
DateRangePickerMulti.storyName = 'Date Range Multi Input';

export const DateTimeRangePickerSingle = SingleInput.bind({});
DateTimeRangePickerSingle.args = {
  ...DateRangePicker.args,
  locale: 'en',
  nameAttr: 'date-time-picker',
  dateFormat: 'Y-m-d H:i',
  multipleInputs: false,
  caption: '',
};
DateTimeRangePickerSingle.storyName = 'Date / Time Range Single Input';

export const DateTimeRangePickerMulti = MultiInputTemplate.bind({});
DateTimeRangePickerMulti.args = {
  ...DateRangePicker.args,
  locale: 'es',
  nameAttr: 'date-time-picker',
  dateFormat: 'Y-m-d H:i',
  multipleInputs: true,
  caption: "Example of spanish ('es') calendar locale.",
};
DateTimeRangePickerMulti.storyName =
  'Date / Time Range Multi Input (Spanish Locale)';
