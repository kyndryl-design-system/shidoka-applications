import './index';
import { html } from 'lit';
import { action } from 'storybook/actions';
import { useEffect } from 'storybook/preview-api';

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
        'Y-m-d h:i K', // 12-hour format with AM/PM
        'm-d-Y H:i',
        'm-d-Y h:i K',
        'd-m-Y H:i',
        'd-m-Y h:i K',
      ],
      control: { type: 'select' },
    },
    size: {
      options: ['sm', 'md', 'lg'],
      control: { type: 'select' },
    },
    defaultDate: { control: { type: 'object' } },
    required: { control: { type: 'boolean' } },
    staticPosition: { control: { type: 'boolean' } },
    disable: { control: { type: 'object' } },
    label: { control: { type: 'text' } },
    minDate: { control: { type: 'text' } },
    maxDate: { control: { type: 'text' } },
    invalidText: { control: { type: 'text' } },
    defaultErrorMessage: { control: { type: 'text' } },
    twentyFourHourFormat: { control: { type: 'boolean' } },
    multiInput: { control: { type: 'boolean' } },
    showSingleMonth: { control: { type: 'boolean' } },
    closeOnSelection: { control: { type: 'boolean' } },
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
      .defaultDate=${args.defaultDate}
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
      .errorAriaLabel=${args.errorAriaLabel}
      .errorTitle=${args.errorTitle}
      .warningAriaLabel=${args.warningAriaLabel}
      .warningTitle=${args.warningTitle}
      ?multiInput=${args.multiInput}
      ?showSingleMonth=${args.showSingleMonth}
      ?closeOnSelection=${args.closeOnSelection}
      .textStrings=${args.textStrings}
      .startDateLabel=${args.startDateLabel}
      .endDateLabel=${args.endDateLabel}
      @on-change=${(e) => action(e.type)({ ...e, detail: e.detail })}
    >
    </kyn-date-range-picker>
  `;
};

const LimitedTemplate = (args) => {
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
      style="max-width: 400px;"
      .name=${args.name}
      .label=${args.label}
      .locale=${args.locale}
      .dateFormat=${args.dateFormat}
      .defaultDate=${args.defaultDate}
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
      .errorAriaLabel=${args.errorAriaLabel}
      .errorTitle=${args.errorTitle}
      .warningAriaLabel=${args.warningAriaLabel}
      .warningTitle=${args.warningTitle}
      ?multiInput=${args.multiInput}
      ?showSingleMonth=${args.showSingleMonth}
      ?closeOnSelection=${args.closeOnSelection}
      .textStrings=${args.textStrings}
      @on-change=${(e) => action(e.type)(e)}
    >
    </kyn-date-range-picker>
  `;
};

export const DateRangeDefault = Template.bind({});
DateRangeDefault.args = {
  name: 'default-date-range-picker',
  locale: 'en',
  dateFormat: 'Y-m-d',
  defaultDate: [],
  required: false,
  staticPosition: false,
  closeOnSelection: false,
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
  label: 'Date Range',
};

export const DateTimeRange = Template.bind({});
DateTimeRange.args = {
  ...DateRangeDefault.args,
  name: 'date-time-range-picker',
  dateFormat: 'Y-m-d H:i',
  caption: 'Example caption for the Date Range Picker with Time Input',
  label: 'Start + End Date / Time',
};

export const InvalidDefaultDates = LimitedTemplate.bind({});
InvalidDefaultDates.args = {
  ...DateRangeDefault.args,
  name: 'invalid-default-dates-picker',
  label: 'Invalid Default Dates',
  dateFormat: 'Y-m-d',
  defaultDate: ['2024-12-01', '2024-06-01'],
  minDate: '2024-01-01',
  maxDate: '2024-12-31',
  caption: 'Invalid default dates will trigger validation errors..',
  required: false,
  size: 'md',
  staticPosition: false,
};
InvalidDefaultDates.storyName = 'Invalid / Out-of-Range Defaults';

export const WithPreselectedRange = Template.bind({});
WithPreselectedRange.args = {
  ...DateRangeDefault.args,
  name: 'preselected-date-range',
  dateFormat: 'Y-m-d',
  defaultDate: ['2024-01-01', '2024-01-07'],
  caption: 'Example with preselected date range (format: Y-m-d)',
  label: 'Preselected Range',
};

export const WithPreselectedDateTime = Template.bind({});
WithPreselectedDateTime.args = {
  ...DateRangeDefault.args,
  name: 'preselected-date-time-range',
  dateFormat: 'Y-m-d H:i',
  defaultDate: ['2024-01-01 09:00:00', '2024-01-02 17:00:00'],
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
  defaultDate: ['2024-05-01', '2024-05-15'],
  rangeEditMode: 'end',
  label: 'Fixed Start - Flexible Deadline',
};

export const FixedDeadline = Template.bind({});
FixedDeadline.args = {
  ...DateRangeDefault.args,
  name: 'fixed-deadline-date-picker',
  dateFormat: 'Y-m-d',
  defaultDate: ['2024-05-01', '2024-05-15'],
  rangeEditMode: 'start',
  label: 'Flexible Start - Fixed Deadline',
};

export const ScheduleLockdown_BothDatesFixed = Template.bind({});
ScheduleLockdown_BothDatesFixed.args = {
  ...DateRangeDefault.args,
  name: 'both-dates-fixed-picker',
  dateFormat: 'Y-m-d',
  defaultDate: ['2024-01-01', '2024-01-07'],
  rangeEditMode: 'none',
  label: 'Fixed Date Range (View Only)',
};
ScheduleLockdown_BothDatesFixed.storyName = 'Both Dates Fixed';

export const MultiInputDateRange = Template.bind({});
MultiInputDateRange.args = {
  ...DateRangeDefault.args,
  name: 'multi-input-date-range-picker',
  dateFormat: 'Y-m-d',
  multiInput: true,
  textStrings: {
    startLabel: 'Start Date',
    endLabel: 'End Date',
  },
  label: 'Date Range Selection',
  caption: 'Example with separate start and end date inputs.',
};

export const MultiInputSingleMonthCalendar = Template.bind({});
MultiInputSingleMonthCalendar.args = {
  ...DateRangeDefault.args,
  name: 'multi-input-datetime-range-picker',
  dateFormat: 'Y-m-d H:i',
  multiInput: true,
  showSingleMonth: true,
  textStrings: {
    startLabel: 'Start Date & Time',
    endLabel: 'End Date & Time',
  },
  label: 'Date & Time Range Selection',
  caption: 'Example with separate start and end date/time inputs.',
};

export const MultiInputWithPreselected = Template.bind({});
MultiInputWithPreselected.args = {
  ...DateRangeDefault.args,
  name: 'multi-input-preselected-range',
  dateFormat: 'Y-m-d',
  defaultDate: ['2024-01-01', '2024-01-07'],
  multiInput: true,
  textStrings: {
    startLabel: 'From',
    endLabel: 'To',
  },
  label: 'Start and End Dates Example',
  caption: 'Example with preselected dates in multi-input mode.',
};

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
    size: 'lg',
    titleText: 'Select Date',
    labelText: '',
    okText: 'OK',
    cancelText: 'Cancel',
    closeText: 'Close',
    destructive: false,
    closeOnSelection: true,
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
          .defaultDate=${args.defaultDate}
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
          .errorAriaLabel=${args.errorAriaLabel}
          .errorTitle=${args.errorTitle}
          .warningAriaLabel=${args.warningAriaLabel}
          .warningTitle=${args.warningTitle}
          .startDateLabel=${args.startDateLabel}
          ?closeOnSelection=${args.closeOnSelection}
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
    closeOnSelection: false,
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
                .defaultDate=${args.defaultDate}
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
                .errorAriaLabel=${args.errorAriaLabel}
                .errorTitle=${args.errorTitle}
                .warningAriaLabel=${args.warningAriaLabel}
                .warningTitle=${args.warningTitle}
                .startDateLabel=${args.startDateLabel}
                ?closeOnSelection=${args.closeOnSelection}
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
