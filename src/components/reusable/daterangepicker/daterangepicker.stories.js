import { html } from 'lit';
import './index';
import './daterangepicker.scss';
import { action } from '@storybook/addon-actions';
import { useEffect } from '@storybook/addons';
import { getPlaceholder } from '../../../common/helpers/flatpickr';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';

import './daterangepicker.scss';

import '@kyndryl-design-system/shidoka-foundation/components/icon';
import overflowIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/overflow.svg';
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
    locale: {
      control: { type: 'text' },
    },
    startDateLabel: {
      control: { type: 'text' },
    },
    endDateLabel: {
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
  const startAnchorId = 'date-range-picker-start';

  return html`
    <kyn-date-range-picker
      .nameAttr="${args.nameAttr}"
      .locale="${args.locale}"
      .dateFormat="${args.dateFormat}"
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
      .startDateLabel="${args.startDateLabel}"
      .endDateLabel="${args.endDateLabel}"
      @on-change=${(e) => action(e.type)(e)}
    >
      <label
        slot="start-label"
        class="label-text"
        for=${startAnchorId}
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
        ${args.startDateLabel}
      </label>
      <input
        slot="start-anchor"
        type="text"
        id=${startAnchorId}
        name=${args.nameAttr}
        placeholder=${placeholder}
        ?disabled=${args.datePickerDisabled}
        ?required=${args.required}
        aria-invalid=${args._isInvalid ? 'true' : 'false'}
      />
      <span slot="start-icon">${unsafeSVG(calendarIcon)}</span>
    </kyn-date-range-picker>
  `;
};

const ButtonIconAnchorTemplate = (args) => {
  useEffect(() => {
    return () => {
      disconnectFlatpickr();
    };
  }, []);

  return html`
    <kyn-date-range-picker
      .nameAttr="${args.nameAttr}"
      .locale="${args.locale}"
      .dateFormat="${args.dateFormat}"
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
      .startDateLabel="${args.startDateLabel}"
      .endDateLabel="${args.endDateLabel}"
      @on-change=${(e) => action(e.type)(e)}
    >
      <label
        slot="start-label"
        class="label-text"
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
        ${args.startDateLabel}
      </label>
      <kd-button
        slot="start-anchor"
        value="Primary"
        kind=${'primary-app'}
        class="btn interactive"
        ?disabled=${args.dateRangePickerDisabled}
        description="Date range picker button containing icon"
      >
        ${unsafeSVG(overflowIcon)}
      </kd-button>
    </kyn-date-range-picker>
  `;
};

const ButtonIconTextAnchorTemplate = (args) => {
  useEffect(() => {
    return () => {
      disconnectFlatpickr();
    };
  }, []);

  const startAnchorId = 'date-range-picker-start';

  return html`
    <kyn-date-range-picker
      .nameAttr="${args.nameAttr}"
      .locale="${args.locale}"
      .dateFormat="${args.dateFormat}"
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
      .startDateLabel="${args.startDateLabel}"
      .endDateLabel="${args.endDateLabel}"
      @on-change=${(e) => action(e.type)(e)}
    >
      <label
        slot="start-label"
        class="label-text"
        for=${startAnchorId}
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
        ${args.startDateLabel}
      </label>
      <kd-button
        slot="start-anchor"
        value="Primary"
        kind=${'primary-app'}
        id=${startAnchorId}
        class="btn interactive"
        ?disabled=${args.dateRangePickerDisabled}
      >
        <span part="icon" style="margin: 3px 10px 0 0;"
          >${unsafeSVG(calendarIcon)}</span
        >
        Start Date
      </kd-button>
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
  const startAnchorId = 'date-range-picker-start';
  const endAnchorId = 'date-range-picker-end';

  return html`
    <kyn-date-range-picker
      .nameAttr="${args.nameAttr}"
      .locale="${args.locale}"
      .dateFormat="${args.dateFormat}"
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
      .startDateLabel="${args.startDateLabel}"
      .endDateLabel="${args.endDateLabel}"
      @on-change=${(e) => action(e.type)(e)}
    >
      <label
        slot="start-label"
        class="label-text"
        for=${startAnchorId}
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
        ${args.startDateLabel}
      </label>
      <input
        slot="start-anchor"
        type="text"
        id=${startAnchorId}
        name="${args.nameAttr}-start"
        placeholder=${placeholder}
        ?disabled=${args.dateRangePickerDisabled}
        ?required=${args.required}
        .value=${getInputsValue(0, args.value)}
        aria-invalid=${args._isInvalid ? 'true' : 'false'}
      />
      <span slot="start-icon">${unsafeSVG(calendarIcon)}</span>

      <label
        slot="end-label"
        class="label-text"
        for=${endAnchorId}
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
        ${args.endDateLabel}
      </label>
      <input
        slot="end-anchor"
        type="text"
        id=${endAnchorId}
        name="${args.nameAttr}-end"
        placeholder=${placeholder}
        ?disabled=${args.dateRangePickerDisabled}
        ?required=${args.required}
        .value=${getInputsValue(1, args.value)}
        aria-invalid=${args._isInvalid ? 'true' : 'false'}
      />
      <span slot="end-icon">${unsafeSVG(calendarIcon)}</span>
    </kyn-date-range-picker>
  `;
};

export const DateRangePicker = SingleInput.bind({});
DateRangePicker.args = {
  nameAttr: 'default-date-range-picker',
  locale: 'en',
  dateFormat: 'Y-m-d',
  multipleInputs: false,
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
  startDateLabel: 'Start Date',
  endDateLabel: 'End Date',
};
DateRangePicker.storyName = 'Date Range Single Input (Default)';

export const DateRangeIconPicker = ButtonIconAnchorTemplate.bind({});
DateRangeIconPicker.args = {
  nameAttr: 'default-date-range-picker',
  locale: 'en',
  dateFormat: 'Y-m-d',
  multipleInputs: false,
  value: [null, null],
  warnText: '',
  invalidText: '',
  altFormat: 'F j, Y',
  disable: [],
  enable: [],
  caption: 'Click the button above to launch the date range picker.',
  required: false,
  dateRangePickerDisabled: false,
  minDate: '',
  maxDate: '',
  startDateLabel: 'Button w/ Icon Date Range Picker Launcher',
  endDateLabel: '',
};
DateRangeIconPicker.storyName = 'Date Range (Button w/ Icon)';

export const DateRangeIconTextAnchor = ButtonIconTextAnchorTemplate.bind({});
DateRangeIconTextAnchor.args = {
  nameAttr: 'default-date-range-picker',
  locale: 'en',
  dateFormat: 'Y-m-d',
  multipleInputs: false,
  value: [null, null],
  warnText: '',
  invalidText: '',
  altFormat: 'F j, Y',
  disable: [],
  enable: [],
  caption: 'Click the button above to launch the date range picker.',
  required: false,
  dateRangePickerDisabled: false,
  minDate: '',
  maxDate: '',
  startDateLabel: 'Button w/ Icon + Text Date Range Picker Launcher',
  endDateLabel: '',
};
DateRangeIconTextAnchor.storyName = 'Date Range (Button w/ Icon and Text)';

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
  startDateLabel: 'Start + End Date / Time',
  endDateLabel: '',
};
DateTimeRangePickerSingle.storyName = 'Date / Time Range Single Input';

export const DateTimeRangePickerMulti = MultiInputTemplate.bind({});
DateTimeRangePickerMulti.args = {
  ...DateRangePicker.args,
  locale: 'es',
  nameAttr: 'date-time-picker',
  dateFormat: 'Y-m-d H:i',
  multipleInputs: true,
  caption:
    "Ejemplo de configuración regional del calendario en español ('es').",
  startDateLabel: 'Fecha de inicio',
  endDateLabel: 'Fecha de finalización',
};
DateTimeRangePickerMulti.storyName =
  'Date / Time Range Multi Input (Spanish Locale)';
