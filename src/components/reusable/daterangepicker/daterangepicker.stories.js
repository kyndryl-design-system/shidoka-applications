import { html } from 'lit';
import './index';
import './daterangepicker.scss';
import '@kyndryl-design-system/shidoka-foundation/components/icon';
import { action } from '@storybook/addon-actions';
import { useEffect } from '@storybook/addons';
import { getPlaceholder } from '../../../common/helpers/flatpickr';

import './daterangepicker.scss';

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

function getInputsValue(index, value) {
  return Array.isArray(value) && value[index] != null
    ? new Date(value[index]).toLocaleString()
    : '';
}

const SingleInput = (args) => {
  // prevents flatpickr calendar overlay from persisting on view change
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
        ?disabled=${args.datePickerDisabled}
      >
        ${args.required
          ? html`<abbr
              class="required"
              title=${args._textStrings?.requiredText || 'Required'}
              aria-label=${args._textStrings?.requiredText || 'Required'}
              >*</abbr
            >`
          : null}
        Start Date Label
      </label>
      <input
        slot="start-input"
        type="text"
        id=${startInputId}
        name=${args.nameAttr}
        placeholder=${placeholder}
        ?disabled=${args.datePickerDisabled}
        ?required=${args.required}
        aria-invalid=${args._isInvalid ? 'true' : 'false'}
      />
    </kyn-date-range-picker>
  `;
};

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
              title=${args._textStrings?.requiredText || 'Required'}
              aria-label=${args._textStrings?.requiredText || 'Required'}
              >*</abbr
            >`
          : null}
        Start Date Label
      </label>
      <input
        slot="start-input"
        type="text"
        id=${startInputId}
        name="${args.nameAttr}-start"
        placeholder=${placeholder}
        ?disabled=${args.dateRangePickerDisabled}
        ?required=${args.required}
        .value=${getInputsValue(0, args.value)}
        aria-invalid=${args._isInvalid ? 'true' : 'false'}
      />

      <label
        slot="end-label"
        class="label-text"
        for=${endInputId}
        ?disabled=${args.dateRangePickerDisabled}
      >
        ${args.required
          ? html`<abbr
              class="required"
              title=${args._textStrings?.requiredText || 'Required'}
              aria-label=${args._textStrings?.requiredText || 'Required'}
              >*</abbr
            >`
          : null}
        End Date Label
      </label>
      <input
        slot="end-input"
        type="text"
        id=${endInputId}
        name="${args.nameAttr}-end"
        placeholder=${placeholder}
        ?disabled=${args.dateRangePickerDisabled}
        ?required=${args.required}
        .value=${getInputsValue(1, args.value)}
        aria-invalid=${args._isInvalid ? 'true' : 'false'}
      />
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
