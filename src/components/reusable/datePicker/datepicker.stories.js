import './index';
import { html } from 'lit';
import { action } from 'storybook/actions';
import { useEffect } from 'storybook/preview-api';
import { ValidationArgs } from '../../../common/helpers/helpers';

import '../button';
import '../modal';
import '../sideDrawer';

export default {
  title: 'Components/Date Picker',
  component: 'kyn-date-picker',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/9Q2XfTSxfzTXfNe2Bi8KDS/Component-Viewer?node-id=1-372464&p=f&m=dev',
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
        'Y-m-d h:i K',
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
    mode: {
      options: ['single', 'multiple'],
      control: { type: 'select' },
    },
    size: {
      options: ['sm', 'md', 'lg'],
      control: { type: 'select' },
    },
    defaultDate: { control: { type: 'text' } },
    required: { control: { type: 'boolean' } },
    staticPosition: { control: { type: 'boolean' } },
    disable: { control: { type: 'object' } },
    twentyFourHourFormat: { control: { type: 'boolean' } },
    defaultErrorMessage: { control: { type: 'text' } },
    minDate: { control: { type: 'text' } },
    maxDate: { control: { type: 'text' } },
    label: { control: { type: 'text' } },
    invalidText: { control: { type: 'text' } },
    ...ValidationArgs,
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
      ?readonly=${args.readonly}
      ?twentyFourHourFormat=${args.twentyFourHourFormat}
      .minDate=${args.minDate}
      .maxDate=${args.maxDate}
      ?allowManualInput=${args.allowManualInput}
      @on-change=${(e) => action(e.type)({ ...e, detail: e.detail })}
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
  readonly: false,
  minDate: '',
  maxDate: '',
  allowManualInput: false,
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

export const MinMaxDateExample = Template.bind({});
MinMaxDateExample.args = {
  ...DatePickerDefault.args,
  name: 'date-time-picker',
  dateFormat: 'Y-m-d',
  minDate: '2024-01-01',
  maxDate: '2024-12-31',
  caption: '',
  label: 'Min and Max dates set',
};

export const DatePickerMultiple = Template.bind({});
DatePickerMultiple.args = {
  ...DatePickerDefault.args,
  locale: 'en',
  name: 'date-multiple-picker',
  dateFormat: 'Y-m-d',
  caption: 'Select multiple dates.',
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
  defaultDate: '2024-01-01 09:00',
  caption: 'Select multiple dates with time. Example shows preselected dates.',
  mode: 'multiple',
  label: 'Multiple Date/Time Selection',
};
DateTimeMultiple.storyName = 'With Preselected Date Time';

export const WithDisabledDates = Template.bind({});
WithDisabledDates.args = {
  ...DatePickerDefault.args,
  name: 'date-picker-with-disabled-dates',
  dateFormat: 'Y-m-d',
  caption: 'Example showing disabled dates (weekends are disabled)',
  label: 'Date Selection',
  disable: [
    function (date) {
      return date.getDay() === 0 || date.getDay() === 6;
    },
    '2024-03-15',
    '2024-03-20',
    '2024-03-25',
  ],
};

export const InModal = {
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
    allowManualInput: false,
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
          ?readonly=${args.readonly}
          ?twentyFourHourFormat=${args.twentyFourHourFormat}
          .minDate=${args.minDate}
          .maxDate=${args.maxDate}
          ?allowManualInput=${args.allowManualInput}
          style="width: 225px;"
          @on-change=${(e) => action(e.type)({ ...e, detail: e.detail })}
        >
        </kyn-date-picker>
      </kyn-modal>
    `;
  },
};

export const InSideDrawer = {
  args: {
    ...DatePickerDefault.args,
    open: false,
    size: 'md',
    titleText: 'Select Date',
    labelText: 'Label',
    submitBtnText: 'Ok',
    cancelBtnText: 'Cancel',
    submitBtnDisabled: false,
    hideFooter: false,
    destructive: false,
    showSecondaryButton: true,
    secondaryButtonText: 'Secondary',
    hideCancelButton: false,
    // DatePicker args
    locale: 'en',
    name: 'date-picker-in-side-drawer',
    dateFormat: 'Y-m-d',
    staticPosition: true,
    defaultDate: '',
    caption: 'Datepicker in a modal.',
    label: 'Date',
    defaultErrorMessage: '',
    required: false,
    warnText: '',
    invalidText: '',
    disable: false,
    enable: true,
    mode: 'single',
    errorAriaLabel: '',
    errorTitle: '',
    warningAriaLabel: '',
    warningTitle: '',
    datePickerDisabled: false,
    allowManualInput: false,
    readonly: false,
    twentyFourHourFormat: false,
    minDate: '',
    maxDate: '',
  },
  render: (args) => {
    const {
      open,
      size,
      titleText,
      labelText,
      submitBtnText,
      cancelBtnText,
      submitBtnDisabled,
      hideFooter,
      destructive,
      showSecondaryButton,
      secondaryButtonText,
      hideCancelButton,
      // DatePicker args
      name,
      locale,
      label,
      dateFormat,
      defaultDate,
      staticPosition,
      defaultErrorMessage,
      required,
      warnText,
      invalidText,
      disable,
      enable,
      mode,
      caption,
      errorAriaLabel,
      errorTitle,
      warningAriaLabel,
      warningTitle,
      datePickerDisabled,
      readonly,
      allowManualInput,
      twentyFourHourFormat,
      minDate,
      maxDate,
    } = args;

    const sideDrawerProps = {
      open,
      size,
      titleText,
      labelText,
      submitBtnText,
      cancelBtnText,
      submitBtnDisabled,
      hideFooter,
      destructive,
      showSecondaryButton,
      secondaryButtonText,
      hideCancelButton,
    };

    const datePickerProps = {
      name,
      locale,
      label,
      dateFormat,
      defaultDate,
      staticPosition,
      defaultErrorMessage,
      required,
      size,
      warnText,
      invalidText,
      disable,
      enable,
      mode,
      caption,
      errorAriaLabel,
      errorTitle,
      allowManualInput,
      warningAriaLabel,
      warningTitle,
      datePickerDisabled,
      readonly,
      twentyFourHourFormat,
      minDate,
      maxDate,
    };

    return html`
      <kyn-side-drawer
        ?open=${sideDrawerProps.open}
        size=${sideDrawerProps.size}
        titleText=${sideDrawerProps.titleText}
        labelText=${sideDrawerProps.labelText}
        submitBtnText=${sideDrawerProps.submitBtnText}
        cancelBtnText=${sideDrawerProps.cancelBtnText}
        ?submitBtnDisabled=${sideDrawerProps.submitBtnDisabled}
        ?hideFooter=${sideDrawerProps.hideFooter}
        ?destructive=${sideDrawerProps.destructive}
        ?showSecondaryButton=${sideDrawerProps.showSecondaryButton}
        secondaryButtonText=${sideDrawerProps.secondaryButtonText}
        ?hideCancelButton=${sideDrawerProps.hideCancelButton}
        @on-close=${(e) => action(e.type)({ ...e, detail: e.detail })}
        @on-open=${(e) => action(e.type)({ ...e, detail: e.detail })}
      >
        <kyn-button slot="anchor">Open Drawer</kyn-button>

        <div>
          This drawer contains some example content and a DatePicker component.
        </div>
        <br />

        <kyn-date-picker
          .name=${datePickerProps.name}
          .locale=${datePickerProps.locale}
          .label=${datePickerProps.label}
          .dateFormat=${datePickerProps.dateFormat}
          .defaultDate=${datePickerProps.defaultDate}
          ?staticPosition=${datePickerProps.staticPosition}
          .defaultErrorMessage=${datePickerProps.defaultErrorMessage}
          ?required=${datePickerProps.required}
          .size=${datePickerProps.size}
          .warnText=${datePickerProps.warnText}
          .invalidText=${datePickerProps.invalidText}
          .disable=${datePickerProps.disable}
          .enable=${datePickerProps.enable}
          .mode=${datePickerProps.mode}
          .caption=${datePickerProps.caption}
          .errorAriaLabel=${datePickerProps.errorAriaLabel}
          .errorTitle=${datePickerProps.errorTitle}
          .warningAriaLabel=${datePickerProps.warningAriaLabel}
          .warningTitle=${datePickerProps.warningTitle}
          ?datePickerDisabled=${datePickerProps.datePickerDisabled}
          ?readonly=${datePickerProps.readonly}
          ?twentyFourHourFormat=${datePickerProps.twentyFourHourFormat}
          .minDate=${datePickerProps.minDate}
          .maxDate=${datePickerProps.maxDate}
          ?allowManualInput=${datePickerProps.allowManualInput}
          @on-change=${(e) => action(e.type)({ ...e, detail: e.detail })}
          style="margin-left: 4px; width: 225px;"
        >
        </kyn-date-picker>

        <div class="spacer-div" style="margin: 20px 0;"></div>

        <div>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin cursus,
          purus vitae egestas mollis, augue augue interdum quam, sit amet
          volutpat justo magna quis justo. Aliquam dapibus mi a arcu consequat,
          sed placerat metus bibendum. Suspendisse pretium nibh.
        </div>
      </kyn-side-drawer>
    `;
  },
};

export const InModalScrollablePage = {
  args: {
    ...DatePickerDefault.args,
    locale: 'en',
    name: 'date-picker-in-modal-scroll-page',
    dateFormat: 'Y-m-d',
    staticPosition: false,
    defaultDate: '',
    caption: 'Scroll the page under the modal, then open the calendar.',
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
    allowManualInput: false,
    showSecondaryButton: false,
    hideCancelButton: false,
    aiConnected: false,
    disableScroll: false,
  },
  render: (args) => {
    return html`
      <div style="height: 1400px;"></div>
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
        <kyn-button slot="anchor" kind="primary">Open Modal</kyn-button>

        <div style="line-height: 1.6">
          <p>Scroll down the page first, then open the date picker.</p>
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
            ?readonly=${args.readonly}
            ?twentyFourHourFormat=${args.twentyFourHourFormat}
            .minDate=${args.minDate}
            .maxDate=${args.maxDate}
            ?allowManualInput=${args.allowManualInput}
            style="width: 225px;"
            @on-change=${(e) => action(e.type)({ ...e, detail: e.detail })}
          >
          </kyn-date-picker>
        </div>
      </kyn-modal>
      <div style="height: 1600px;"></div>
    `;
  },
};

export const InModalScrollableContent = {
  args: {
    ...DatePickerDefault.args,
    locale: 'en',
    name: 'date-picker-in-modal-scroll-content',
    dateFormat: 'Y-m-d',
    staticPosition: false,
    defaultDate: '',
    caption: 'Scroll inside the modal content, then open the calendar.',
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
    disableScroll: true,
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
        <kyn-button slot="anchor" kind="primary">Open Modal</kyn-button>

        <div style="max-height: 60vh; overflow: auto; padding-right: 8px;">
          <p>
            Scroll this content, then open the date picker at various offsets.
          </p>
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
            ?readonly=${args.readonly}
            ?twentyFourHourFormat=${args.twentyFourHourFormat}
            .minDate=${args.minDate}
            .maxDate=${args.maxDate}
            style="width: 225px;"
            @on-change=${(e) => action(e.type)({ ...e, detail: e.detail })}
          >
          </kyn-date-picker>

          <div style="height: 1200px;"></div>
        </div>
      </kyn-modal>
    `;
  },
};
