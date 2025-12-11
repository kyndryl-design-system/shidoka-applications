import './index';
import { html } from 'lit';
import { action } from 'storybook/actions';
import { useEffect, useArgs } from 'storybook/preview-api';
import { ValidationArgs } from '../../../common/helpers/helpers';

import '../button';
import '../modal';
import '../accordion';

export default {
  title: 'Components/Date Range Picker',
  component: 'kyn-date-range-picker',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/9Q2XfTSxfzTXfNe2Bi8KDS/Component-Viewer?node-id=1-376248&m=dev',
    },
  },
  argTypes: {
    locale: { control: { type: 'text' } },
    dateRangePickerDisabled: { control: { type: 'boolean' } },
    readonly: { control: { type: 'boolean' } },
    rangeEditMode: {
      options: ['both', 'start', 'end', 'none'],
      control: { type: 'select' },
    },
    dateFormat: {
      options: [
        'Y-m-d',
        'm-d-Y',
        'd-m-Y',
        'Y-m-d H:i', // 24-hour format without seconds
        'Y-m-d H:i:s',
        'Y-m-d h:i K', // 12-hour format with AM/PM
        'Y-m-d h:i:s K',
        'm-d-Y H:i',
        'm-d-Y H:i:s',
        'm-d-Y h:i K',
        'm-d-Y h:i:s K',
        'd-m-Y H:i',
        'd-m-Y H:i:s',
        'd-m-Y h:i K',
        'd-m-Y h:i:s K',
      ],
      control: { type: 'select' },
    },
    size: {
      options: ['sm', 'md', 'lg'],
      control: { type: 'select' },
    },
    // defaultDate is soft deprecated — prefer controlling the component via `value`
    defaultDate: {
      control: { type: 'object' },
      table: {
        category: 'Soft Deprecated',
        summary: 'Soft Deprecated – use `value` instead',
      },
    },
    required: { control: { type: 'boolean' } },
    staticPosition: { control: { type: 'boolean' } },
    disable: { control: { type: 'object' } },
    label: { control: { type: 'text' } },
    minDate: { control: { type: 'text' } },
    maxDate: { control: { type: 'text' } },
    invalidText: { control: { type: 'text' } },
    defaultErrorMessage: { control: { type: 'text' } },
    twentyFourHourFormat: { control: { type: 'boolean' } },
    ...ValidationArgs,
  },
};

const Template = (args) => {
  useEffect(() => {
    const renderId = Math.random().toString(36).substring(2, 9);

    setTimeout(() => {
      const container = document.createElement('div');
      container.setAttribute('data-picker-container', renderId);
      container.style.display = 'contents';

      const picker = document.querySelector(
        `kyn-date-range-picker[name="${args.name}"]`
      );
      if (picker && picker.parentNode) {
        picker.parentNode.insertBefore(container, picker);
        container.appendChild(picker);

        if (args.rangeEditMode !== undefined) {
          picker.rangeEditMode = args.rangeEditMode;
          if (
            picker.flatpickrInstance &&
            args.defaultDate &&
            Array.isArray(args.defaultDate) &&
            args.defaultDate.length === 2 &&
            (!args.defaultDate[0] || !args.defaultDate[1])
          ) {
            picker.flatpickrInstance.destroy();
            setTimeout(() => picker.initializeFlatpickr(), 10);
          }
        }
      }
    }, 0);

    return () => {
      const container = document.querySelector(
        `div[data-picker-container="${renderId}"]`
      );
      if (container) {
        if (container.firstChild) {
          const picker = container.firstChild;
          container.parentNode.insertBefore(picker, container);
        }
        container.remove();
      }
    };
  }, [args.rangeEditMode, args.defaultDate, args.name]);

  return html`
    <kyn-date-range-picker
      .name=${args.name}
      .label=${args.label}
      .locale=${args.locale}
      .dateFormat=${args.dateFormat}
      .rangeEditMode=${args.rangeEditMode}
      .value=${args.value}
      .defaultErrorMessage=${args.defaultErrorMessage}
      .warnText=${args.warnText}
      .invalidText=${args.invalidText}
      .disable=${args.disable}
      .enable=${args.enable}
      .caption=${args.caption}
      ?required=${args.required}
      ?staticPosition=${args.staticPosition}
      .size=${args.size}
      ?dateRangePickerDisabled=${args.dateRangePickerDisabled}
      ?readonly=${args.readonly}
      ?twentyFourHourFormat=${args.twentyFourHourFormat}
      .minDate=${args.minDate}
      .maxDate=${args.maxDate}
      ?allowManualInput=${args.allowManualInput}
      .errorAriaLabel=${args.errorAriaLabel}
      .errorTitle=${args.errorTitle}
      .warningAriaLabel=${args.warningAriaLabel}
      .warningTitle=${args.warningTitle}
      .startDateLabel=${args.startDateLabel}
      .endDateLabel=${args.endDateLabel}
      @on-change=${(e) => action(e.type)({ ...e, detail: e.detail })}
    >
    </kyn-date-range-picker>
  `;
};

export const DateRangeDefault = Template.bind({});
DateRangeDefault.args = {
  name: 'default-date-range-picker',
  locale: 'en',
  dateFormat: 'Y-m-d',
  value: [null, null],
  required: false,
  staticPosition: false,
  size: 'md',
  defaultErrorMessage: 'Both start and end dates are required',
  warnText: '',
  invalidText: '',
  disable: [],
  enable: [],
  errorAriaLabel: 'Error message icon',
  errorTitle: '',
  warningAriaLabel: '',
  warningTitle: '',
  caption: 'Click the input above to select a date range.',
  dateRangePickerDisabled: false,
  readonly: false,
  minDate: '',
  maxDate: '',
  allowManualInput: false,
  label: 'Date Range',
};

export const DateTimeRange = Template.bind({});
DateTimeRange.args = {
  ...DateRangeDefault.args,
  name: 'date-time-range-picker',
  dateFormat: 'Y-m-d H:i',
  caption: 'Example caption for the Date Range Picker with Time Input',
  label: 'Start + End Date / Time',
  allowManualInput: false,
};

export const InvalidDefaultDates = Template.bind({});
InvalidDefaultDates.args = {
  name: 'invalid-default-dates-picker',
  label: 'Invalid Default Dates',
  dateFormat: 'Y-m-d',
  defaultDate: ['2025-13-01', '2023-06-01'],
  minDate: '2024-01-01',
  maxDate: '2024-12-31',
  allowManualInput: false,
  caption: 'Invalid default dates will trigger validation errors..',
  invalidText: '',
  defaultErrorMessage: '',
  required: false,
  size: 'md',
  staticPosition: false,
  disable: [],
  enable: [],
};
InvalidDefaultDates.storyName = 'Invalid / Out-of-Range Defaults';

export const WithPreselectedRange = Template.bind({});
WithPreselectedRange.args = {
  ...DateRangeDefault.args,
  name: 'preselected-date-range',
  dateFormat: 'Y-m-d',
  value: [new Date('2024-01-01'), new Date('2024-01-07')],
  allowManualInput: false,
  caption: 'Example with preselected date range (format: Y-m-d)',
  label: 'Preselected Range',
};

export const WithPreselectedDateTime = Template.bind({});
WithPreselectedDateTime.args = {
  ...DateRangeDefault.args,
  name: 'preselected-date-time-range',
  dateFormat: 'Y-m-d H:i',
  value: [new Date('2024-01-01 09:00:00'), new Date('2024-01-02 17:00:00')],
  allowManualInput: false,
  caption: 'Example with preselected date/time range (format: Y-m-d H:i)',
  label: 'Preselected Date/Time Range',
};

export const WithDisabledDates = Template.bind({});
WithDisabledDates.args = {
  ...DateRangeDefault.args,
  name: 'date-range-picker-with-disabled-dates',
  dateFormat: 'Y-m-d',
  caption:
    'Example showing disabled dates (weekends and specific dates are disabled)',
  label: 'Date Range Selection',
  allowManualInput: false,
  disable: [
    function (date) {
      return date.getDay() === 0 || date.getDay() === 6;
    },
    '2024-03-15',
    '2024-03-20',
    '2024-03-25',
  ],
};

export const FixedStartDate = Template.bind({});
FixedStartDate.args = {
  ...DateRangeDefault.args,
  name: 'fixed-deadline-date-picker',
  dateFormat: 'Y-m-d',
  value: [new Date('2024-05-01'), new Date('2024-05-15')],
  rangeEditMode: 'end',
  allowManualInput: false,
  label: 'Fixed Start - Flexible Deadline',
};

export const FixedDeadline = Template.bind({});
FixedDeadline.args = {
  ...DateRangeDefault.args,
  name: 'fixed-deadline-date-picker',
  dateFormat: 'Y-m-d',
  defaultDate: ['2024-05-01', '2024-05-15'],
  rangeEditMode: 'start',
  allowManualInput: false,
  label: 'Flexible Start - Fixed Deadline',
};

export const ScheduleLockdown_BothDatesFixed = Template.bind({});
ScheduleLockdown_BothDatesFixed.args = {
  ...DateRangeDefault.args,
  name: 'both-dates-fixed-picker',
  dateFormat: 'Y-m-d',
  defaultDate: ['2024-01-01', '2024-01-07'],
  rangeEditMode: 'none',
  allowManualInput: false,
  label: 'Fixed Date Range (View Only)',
};
ScheduleLockdown_BothDatesFixed.storyName = 'Both Dates Fixed';

export const InModal = {
  args: {
    ...DateRangeDefault.args,
    locale: 'en',
    name: 'date-range-picker-in-modal',
    dateFormat: 'Y-m-d',
    defaultDate: [],
    caption: 'Date Range Picker in a modal.',
    label: 'Date',
    open: false,
    allowManualInput: false,
    size: 'lg',
    titleText: 'Select Date',
    labelText: '',
    okText: 'OK',
    cancelText: 'Cancel',
    closeText: 'Close',
    destructive: false,
    okDisabled: false,
    hideFooter: false,
    showSecondaryButton: false,
    hideCancelButton: false,
    aiConnected: false,
    disableScroll: false,
  },
  render: (args) => {
    return html`
      <kyn-modal
        ?open=${args.open}
        size=${args.size}
        titleText=${args.titleText}
        labelText=${args.labelText}
        okText=${args.okText}
        cancelText=${args.cancelText}
        closeText=${args.closeText}
        ?destructive=${args.destructive}
        ?okDisabled=${args.okDisabled}
        ?showSecondaryButton=${args.showSecondaryButton}
        ?hideFooter=${args.hideFooter}
        ?hideCancelButton=${args.hideCancelButton}
        ?aiConnected=${args.aiConnected}
        ?disableScroll=${args.disableScroll}
        @on-close=${(e) => action(e.type)({ ...e, detail: e.detail })}
        @on-open=${(e) => action(e.type)({ ...e, detail: e.detail })}
      >
        <kyn-button slot="anchor" kind=${'primary'}> Open Modal </kyn-button>

        <kyn-date-range-picker
          .name=${args.name}
          .label=${args.label}
          .locale=${args.locale}
          .dateFormat=${args.dateFormat}
          .value=${args.value}
          ?staticPosition=${args.staticPosition}
          .defaultErrorMessage=${args.defaultErrorMessage}
          .warnText=${args.warnText}
          .invalidText=${args.invalidText}
          .disable=${args.disable}
          .enable=${args.enable}
          .caption=${args.caption}
          ?required=${args.required}
          .size=${args.size}
          ?dateRangePickerDisabled=${args.dateRangePickerDisabled}
          ?readonly=${args.readonly}
          ?twentyFourHourFormat=${args.twentyFourHourFormat}
          .minDate=${args.minDate}
          .maxDate=${args.maxDate}
          ?allowManualInput=${args.allowManualInput}
          .errorAriaLabel=${args.errorAriaLabel}
          .errorTitle=${args.errorTitle}
          .warningAriaLabel=${args.warningAriaLabel}
          .warningTitle=${args.warningTitle}
          .startDateLabel=${args.startDateLabel}
          .endDateLabel=${args.endDateLabel}
          style="width: 300px;"
          @on-change=${(e) => action(e.type)({ ...e, detail: e.detail })}
        >
        </kyn-date-range-picker>
      </kyn-modal>
    `;
  },
};

export const DateRangePickerInAccordionInModal = {
  args: {
    ...DateRangeDefault.args,
    locale: 'en',
    name: 'date-range-picker-in-modal',
    dateFormat: 'Y-m-d',
    defaultDate: [],
    caption: 'Date-range picker in a modal.',
    label: 'Date',
    staticPosition: true,
    allowManualInput: false,
    open: false,
    size: 'lg',
    titleText: 'Select Date',
    labelText: '',
    okText: 'OK',
    cancelText: 'Cancel',
    closeText: 'Close',
    destructive: false,
    okDisabled: false,
    hideFooter: false,
    showSecondaryButton: false,
    hideCancelButton: false,
    aiConnected: false,
    disableScroll: false,
  },
  render: (args) => {
    return html`
      <kyn-modal
        ?open=${args.open}
        size=${args.size}
        titleText=${args.titleText}
        labelText=${args.labelText}
        okText=${args.okText}
        cancelText=${args.cancelText}
        closeText=${args.closeText}
        ?destructive=${args.destructive}
        ?okDisabled=${args.okDisabled}
        ?showSecondaryButton=${args.showSecondaryButton}
        ?hideFooter=${args.hideFooter}
        ?hideCancelButton=${args.hideCancelButton}
        ?aiConnected=${args.aiConnected}
        ?disableScroll=${args.disableScroll}
        @on-close=${(e) => action(e.type)({ ...e, detail: e.detail })}
        @on-open=${(e) => action(e.type)({ ...e, detail: e.detail })}
      >
        <kyn-button slot="anchor" kind=${'primary'}> Open Modal </kyn-button>

        <kyn-accordion
          ?filledHeaders="${args.filledHeaders}"
          ?compact="${args.compact}"
          ?showNumbers="${args.showNumbers}"
          startNumber="${args.startNumber}"
          expandLabel="${args.expandLabel}"
          collapseLabel="${args.collapseLabel}"
        >
          <kyn-accordion-item
            opened
            @on-toggle=${(e) => action(e.type)({ ...e, detail: e.detail })}
          >
            <span slot="title"> Accordion Title 1 </span>
            <span slot="subtitle"> Accordion subtitle 1 </span>
            <div slot="body">
              <kyn-date-range-picker
                .name=${args.name}
                .label=${args.label}
                .locale=${args.locale}
                .dateFormat=${args.dateFormat}
                .value=${args.value}
                .defaultErrorMessage=${args.defaultErrorMessage}
                ?staticPosition=${args.staticPosition}
                .warnText=${args.warnText}
                .invalidText=${args.invalidText}
                .disable=${args.disable}
                .enable=${args.enable}
                .caption=${args.caption}
                ?required=${args.required}
                .size=${args.size}
                ?dateRangePickerDisabled=${args.dateRangePickerDisabled}
                ?readonly=${args.readonly}
                ?twentyFourHourFormat=${args.twentyFourHourFormat}
                .minDate=${args.minDate}
                .maxDate=${args.maxDate}
                ?allowManualInput=${args.allowManualInput}
                .errorAriaLabel=${args.errorAriaLabel}
                .errorTitle=${args.errorTitle}
                .warningAriaLabel=${args.warningAriaLabel}
                .warningTitle=${args.warningTitle}
                .startDateLabel=${args.startDateLabel}
                .endDateLabel=${args.endDateLabel}
                style="width: 300px;"
                @on-change=${(e) => action(e.type)({ ...e, detail: e.detail })}
              >
              </kyn-date-range-picker>
            </div>
          </kyn-accordion-item>

          <kyn-accordion-item
            @on-toggle=${(e) => action(e.type)({ ...e, detail: e.detail })}
          >
            <span slot="title"> Accordion Title 2 </span>
            <span slot="subtitle"> Accordion subtitle 2 </span>
            <div slot="body">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </div>
          </kyn-accordion-item>

          <kyn-accordion-item
            disabled
            @on-toggle=${(e) => action(e.type)({ ...e, detail: e.detail })}
          >
            <span slot="title"> Accordion Title 3 </span>
            <span slot="subtitle"> Accordion subtitle 3 </span>
            <div slot="body">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </div>
          </kyn-accordion-item>
        </kyn-accordion>
      </kyn-modal>
    `;
  },
};
DateRangePickerInAccordionInModal.storyName =
  'Static Position In Nested Accordion';

const ControlledTemplate = (args) => {
  const [{ value, defaultDate }, updateArgs] = useArgs();

  useEffect(() => {
    const renderId = Math.random().toString(36).substring(2, 9);

    setTimeout(() => {
      const container = document.createElement('div');
      container.setAttribute('data-picker-container', renderId);
      container.style.display = 'contents';

      const picker = document.querySelector(
        `kyn-date-range-picker[name="${args.name}"]`
      );
      if (picker && picker.parentNode) {
        picker.parentNode.insertBefore(container, picker);
        container.appendChild(picker);

        if (args.rangeEditMode !== undefined) {
          picker.rangeEditMode = args.rangeEditMode;
          if (
            picker.flatpickrInstance &&
            defaultDate &&
            Array.isArray(defaultDate) &&
            defaultDate.length === 2 &&
            (!defaultDate[0] || !defaultDate[1])
          ) {
            picker.flatpickrInstance.destroy();
            setTimeout(() => picker.initializeFlatpickr(), 10);
          }
        }
      }
    }, 0);

    return () => {
      const container = document.querySelector(
        `div[data-picker-container="${renderId}"]`
      );
      if (container) {
        if (container.firstChild) {
          const picker = container.firstChild;
          container.parentNode.insertBefore(picker, container);
        }
        container.remove();
      }
    };
  }, [args.rangeEditMode, defaultDate, args.name]);

  const toDate = (d) => {
    if (!d) return null;
    if (d instanceof Date) return d;
    if (typeof d === 'string') {
      const parsed = new Date(d);
      return Number.isNaN(parsed.getTime()) ? null : parsed;
    }
    return null;
  };

  const handleChange = (e) => {
    const detail = e.detail || {};
    const dates = Array.isArray(detail.dates) ? detail.dates : [];

    // If the clear button was used, wipe both value and defaultDate
    if (detail.source === 'clear') {
      updateArgs({
        value: [null, null],
        defaultDate: [],
      });
      action(e.type)({ ...e, detail: e.detail });
      return;
    }

    const nextValue = [
      dates.length > 0 ? toDate(dates[0]) : null,
      dates.length > 1 ? toDate(dates[1]) : null,
    ];

    updateArgs({ value: nextValue });
    action(e.type)({ ...e, detail: e.detail });
  };

  return html`
    <kyn-date-range-picker
      .name=${args.name}
      .label=${args.label}
      .locale=${args.locale}
      .dateFormat=${args.dateFormat}
      .defaultDate=${defaultDate}
      .value=${value}
      .rangeEditMode=${args.rangeEditMode}
      .defaultErrorMessage=${args.defaultErrorMessage}
      .warnText=${args.warnText}
      .invalidText=${args.invalidText}
      .disable=${args.disable}
      .enable=${args.enable}
      .caption=${args.caption}
      ?required=${args.required}
      ?staticPosition=${args.staticPosition}
      .size=${args.size}
      ?dateRangePickerDisabled=${args.dateRangePickerDisabled}
      ?readonly=${args.readonly}
      ?twentyFourHourFormat=${args.twentyFourHourFormat}
      .minDate=${args.minDate}
      .maxDate=${args.maxDate}
      ?allowManualInput=${args.allowManualInput}
      .errorAriaLabel=${args.errorAriaLabel}
      .errorTitle=${args.errorTitle}
      .warningAriaLabel=${args.warningAriaLabel}
      .warningTitle=${args.warningTitle}
      .startDateLabel=${args.startDateLabel}
      .endDateLabel=${args.endDateLabel}
      @on-change=${handleChange}
    >
    </kyn-date-range-picker>
  `;
};

export const ControlledValueOverridesDefault = ControlledTemplate.bind({});
ControlledValueOverridesDefault.args = {
  ...DateRangeDefault.args,
  name: 'controlled-value-overrides-default-date-range',
  label: 'Controlled Value Overrides defaultDate',
  caption:
    'Both defaultDate and value are set; value (Date objects) takes precedence.',
  defaultDate: ['2024-01-01', '2024-01-07'],
  value: [new Date('2024-02-10'), new Date('2024-02-20')],
};
ControlledValueOverridesDefault.storyName = 'Value Overrides defaultDate';
