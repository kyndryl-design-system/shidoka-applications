import './index';
import { html } from 'lit';
import { action } from '@storybook/addon-actions';
import { useEffect } from '@storybook/preview-api';

import '../button';
import '../modal';

export default {
  title: 'Components/DatePicker',
  component: 'kyn-date-picker',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/CQuDZEeLiuGiALvCWjAKlu/branch/qMpff4GuFUEcsMUkvacS3U/Applications---Component-Library?node-id=19723-26652&node-type=canvas&m=dev',
    },
  },
  argTypes: {
    locale: { control: { type: 'text' } },
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
    mode: {
      options: ['single', 'multiple'],
      control: { type: 'select' },
    },
    size: {
      options: ['sm', 'md', 'lg'],
      control: { type: 'select' },
    },
    defaultDate: { control: { type: 'object' } },
    twentyFourHourFormat: { control: { type: 'boolean' } },
    defaultErrorMessage: { control: { type: 'text' } },
    minDate: { control: { type: 'text' } },
    maxDate: { control: { type: 'text' } },
    label: { control: { type: 'text' } },
    invalidText: { control: { type: 'text' } },
  },
};

const Template = (args) => {
  useEffect(() => {
    return () => {
      const picker = document.querySelector('kyn-date-picker');
      if (picker) {
        picker.remove();
      }
    };
  }, []);

  return html`
    <kyn-date-picker
      .name=${args.name}
      .locale=${args.locale}
      .label=${args.label}
      .dateFormat=${args.dateFormat}
      .defaultDate=${args.defaultDate}
      ?staticPosition=${args.staticPosition}
      .defaultErrorMessage=${args.defaultErrorMessage}
      ?required=${args.required}
      .size=${args.size}
      .value=${args.value}
      .warnText=${args.warnText}
      .invalidText=${args.invalidText}
      .disable=${args.disable}
      .enable=${args.enable}
      .mode=${args.mode}
      .caption=${args.caption}
      .errorAriaLabel=${args.errorAriaLabel}
      .errorTitle=${args.errorTitle}
      .warningAriaLabel=${args.warningAriaLabel}
      .warningTitle=${args.warningTitle}
      ?datePickerDisabled=${args.datePickerDisabled}
      ?twentyFourHourFormat=${args.twentyFourHourFormat}
      .minDate=${args.minDate}
      .maxDate=${args.maxDate}
      @on-change=${(e) => action(e.type)(e)}
    >
    </kyn-date-picker>
  `;
};

export const DatePickerDefault = Template.bind({});
DatePickerDefault.args = {
  name: 'default-date-picker',
  locale: 'en',
  dateFormat: 'Y-m-d',
  defaultDate: '',
  defaultErrorMessage: 'A date value is required',
  required: false,
  size: 'md',
  staticPosition: false,
  value: '',
  warnText: '',
  invalidText: '',
  disable: [],
  enable: [],
  errorAriaLabel: 'Error message icon',
  errorTitle: '',
  warningAriaLabel: '',
  warningTitle: '',
  mode: 'single',
  caption: 'Example datepicker caption.',
  datePickerDisabled: false,
  minDate: '',
  maxDate: '',
  label: 'Date',
};
DatePickerDefault.storyName = 'Single Date (Default)';

export const DateWithTime = Template.bind({});
DateWithTime.args = {
  ...DatePickerDefault.args,
  locale: 'hi',
  name: 'date-time-picker',
  dateFormat: 'Y-m-d H:i',
  caption: '',
  label: 'Hindi Locale Example',
};
DateWithTime.storyName = 'Date + Time (Hindi Locale)';

export const DatePickerMultiple = Template.bind({});
DatePickerMultiple.args = {
  ...DatePickerDefault.args,
  locale: 'en',
  name: 'date-multiple-picker',
  dateFormat: 'Y-m-d',
  defaultDate: '',
  caption: 'Select multiple dates. Example shows preselected dates.',
  mode: 'multiple',
  label: 'Multiple Date Selection',
};
DatePickerMultiple.storyName = 'Multiple Date Selection';

export const DateTimeMultiple = Template.bind({});
DateTimeMultiple.args = {
  ...DatePickerDefault.args,
  locale: 'en',
  name: 'date-time-multiple-picker',
  dateFormat: 'Y-m-d H:i',
  defaultDate: ['2024-01-01 09:00', '2024-01-02 17:00'],
  caption: 'Select multiple dates with time. Example shows preselected dates.',
  mode: 'multiple',
  label: 'Multiple Date/Time Selection',
};
DateTimeMultiple.storyName = 'With Preselected Date Time';

export const DatepickerInModal = {
  args: {
    ...DatePickerDefault.args,
    locale: 'en',
    name: 'date-picker-in-modal',
    dateFormat: 'Y-m-d',
    staticPosition: false,
    defaultDate: '',
    caption: 'Datepicker in a modal.',
    label: 'Date',
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
        @on-close=${(e) => action(e.type)(e)}
        @on-open=${(e) => action(e.type)(e)}
      >
        <kyn-button slot="anchor" kind=${'primary'}> Open Modal </kyn-button>

        <kyn-date-picker
          .name=${args.name}
          .locale=${args.locale}
          .label=${args.label}
          .dateFormat=${args.dateFormat}
          .defaultDate=${args.defaultDate}
          ?staticPosition=${args.staticPosition}
          .defaultErrorMessage=${args.defaultErrorMessage}
          ?required=${args.required}
          .size=${args.size}
          .value=${args.value}
          .warnText=${args.warnText}
          .invalidText=${args.invalidText}
          .disable=${args.disable}
          .enable=${args.enable}
          .mode=${args.mode}
          .caption=${args.caption}
          .errorAriaLabel=${args.errorAriaLabel}
          .errorTitle=${args.errorTitle}
          .warningAriaLabel=${args.warningAriaLabel}
          .warningTitle=${args.warningTitle}
          ?datePickerDisabled=${args.datePickerDisabled}
          ?twentyFourHourFormat=${args.twentyFourHourFormat}
          .minDate=${args.minDate}
          .maxDate=${args.maxDate}
          @on-change=${(e) => action(e.type)(e)}
        >
        </kyn-date-picker>
      </kyn-modal>
    `;
  },
};
DatepickerInModal.storyName = 'In Modal';
