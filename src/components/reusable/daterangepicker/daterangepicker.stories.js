import './index';
import { html } from 'lit';
import { action } from '@storybook/addon-actions';
import { useEffect } from '@storybook/addons';
import { getPlaceholder } from '../../../common/helpers/flatpickr';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';

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
    locale: { control: { type: 'text' } },
    startDateLabel: { control: { type: 'text' } },
    endDateLabel: { control: { type: 'text' } },
    twentyFourHourFormat: { control: { type: 'boolean' } },
    dateRangePickerDisabled: { control: { type: 'boolean' } },
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
    minDate: { control: { type: 'text' } },
    maxDate: { control: { type: 'text' } },
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
      ?twentyFourHourFormat="${args.twentyFourHourFormat}"
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
      ?twentyFourHourFormat="${args.twentyFourHourFormat}"
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
        size="medium"
        value=""
        iconPosition="center"
        kind="primary-app"
        type="button"
        size="medium"
        ?disabled=${args.dateRangePickerDisabled}
        description="Date range picker button containing icon"
      >
        <span slot="icon" style="line-height: 1;"
          >${unsafeSVG(overflowIcon)}</span
        >
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
      ?required="${args.required}"
      .value="${args.value}"
      .warnText="${args.warnText}"
      .invalidText="${args.invalidText}"
      .altFormat=${args.altFormat}
      .disable="${args.disable}"
      .enable="${args.enable}"
      .multipleInputs="${args.multipleInputs}"
      .caption="${args.caption}"
      ?dateRangePickerDisabled="${args.dateRangePickerDisabled}"
      ?twentyFourHourFormat="${args.twentyFourHourFormat}"
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
        <span part="icon" style="margin: 3px 12px 0 0;"
          >${unsafeSVG(calendarIcon)}</span
        >
        Choose Date Range
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
      ?required="${args.required}"
      .value="${args.value}"
      .warnText="${args.warnText}"
      .invalidText="${args.invalidText}"
      .altFormat=${args.altFormat}
      .disable="${args.disable}"
      .enable="${args.enable}"
      .multipleInputs="${args.multipleInputs}"
      .caption="${args.caption}"
      ?dateRangePickerDisabled="${args.dateRangePickerDisabled}"
      ?twentyFourHourFormat="${args.twentyFourHourFormat}"
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

export const DefaultDateRangePicker = SingleInput.bind({});
DefaultDateRangePicker.args = {
  nameAttr: 'default-date-range-picker',
  locale: 'en',
  dateFormat: 'Y-m-d',
  required: false,
  multipleInputs: false,
  value: [null, null],
  warnText: '',
  invalidText: '',
  altFormat: 'F j, Y',
  disable: [],
  enable: [],
  caption: 'Click the input above to select a date range.',
  dateRangePickerDisabled: false,
  twentyFourHourFormat: false,
  minDate: '',
  maxDate: '',
  startDateLabel: 'Date Range',
  endDateLabel: '',
};
DefaultDateRangePicker.storyName = 'Single-Input (Default)';

export const DateRangeIconPicker = ButtonIconAnchorTemplate.bind({});
DateRangeIconPicker.args = {
  ...DefaultDateRangePicker.args,
  required: true,
  nameAttr: 'date-range-icon-button-picker',
  caption: 'Click the button above to launch the date range picker.',
  startDateLabel: 'Range Picker Button w/ Icon',
  endDateLabel: '',
};
DateRangeIconPicker.storyName = 'Button Anchor w/ Icon';

export const DateRangeIconTextAnchor = ButtonIconTextAnchorTemplate.bind({});
DateRangeIconTextAnchor.args = {
  ...DefaultDateRangePicker.args,
  nameAttr: 'default-date-range-picker',
  caption: 'Click the button above to launch the date range picker.',
  startDateLabel: 'Range Picker Button w/ Icon + Text',
  endDateLabel: '',
};
DateRangeIconTextAnchor.storyName = 'Button Anchor w/ Icon + Text';

export const DateRangePickerMulti = MultiInputTemplate.bind({});
DateRangePickerMulti.args = {
  ...DefaultDateRangePicker.args,
  nameAttr: 'date-range-multi-input-picker',
  multipleInputs: true,
  caption: '',
  startDateLabel: 'Start Date',
  endDateLabel: 'End Date',
};
DateRangePickerMulti.storyName = 'Multi-Input';

export const DateTimeRangePickerSingle = SingleInput.bind({});
DateTimeRangePickerSingle.args = {
  ...DefaultDateRangePicker.args,
  nameAttr: 'date-time-range-picker',
  dateFormat: 'Y-m-d H:i',
  required: true,
  caption: '',
  startDateLabel: 'Start + End Date / Time',
  endDateLabel: '',
};
DateTimeRangePickerSingle.storyName = 'Single-Input, Date / Time';

export const DateTimeRangePickerMulti = MultiInputTemplate.bind({});
DateTimeRangePickerMulti.args = {
  ...DefaultDateRangePicker.args,
  locale: 'es',
  nameAttr: 'date-time-range-multi-picker',
  dateFormat: 'Y-m-d H:i',
  required: true,
  multipleInputs: true,
  caption:
    "Ejemplo de configuración regional del calendario en español ('es').",
  startDateLabel: 'Fecha de inicio',
  endDateLabel: 'Fecha de finalización',
};
DateTimeRangePickerMulti.storyName = 'Multi-Input, Date /Time (Spanish)';
