import { html } from 'lit';
import './index';
import { action } from 'storybook/actions';
import { useArgs } from 'storybook/preview-api';
import { ValidationArgs } from '../../../common/helpers/helpers';

import '../button';
import '../modal';
import '../tabs';

export default {
  title: 'Components/Timepicker',
  component: 'kyn-time-picker',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/qyPEUQckxj8LUgesi1OEES/Component-Library?node-id=19723-26652&p=f&m=dev',
    },
  },
  argTypes: {
    size: {
      options: ['xs', 'sm', 'md', 'lg'],
      control: { type: 'select' },
    },
    required: { control: { type: 'boolean' } },
    staticPosition: { control: { type: 'boolean' } },
    label: { control: { type: 'text' } },
    locale: { control: { type: 'text' } },
    minTime: { control: { type: 'text' } },
    maxTime: { control: { type: 'text' } },
    // defaultHour/defaultMinute/defaultSeconds are soft deprecated — prefer controlling the component via `value`
    defaultHour: {
      control: { type: 'number' },
      table: {
        category: 'Deprecated',
        summary: 'Soft Deprecated – use `value` instead',
      },
    },
    defaultMinute: {
      control: { type: 'number' },
      table: {
        category: 'Deprecated',
        summary: 'Soft Deprecated – use `value` instead',
      },
    },
    defaultSeconds: {
      control: { type: 'number' },
      table: {
        category: 'Deprecated',
        summary: 'Soft Deprecated – use `value` instead',
      },
    },
    invalidText: { control: { type: 'text' } },
    defaultErrorMessage: { control: { type: 'text' } },
    enableSeconds: { control: { type: 'boolean' } },
    twentyFourHourFormat: { control: { type: 'boolean' } },
    ...ValidationArgs,
  },
};

const inTabsState = {
  a: null,
  b: null,
};

const ensureInTabsInitialValues = () => {
  if (!inTabsState.a) {
    const valA = new Date();
    valA.setHours(9, 0, 0, 0);
    inTabsState.a = valA;
  }
  if (!inTabsState.b) {
    const valB = new Date();
    valB.setHours(15, 30, 0, 0);
    inTabsState.b = valB;
  }
};

const Template = (args) => {
  return html`
    <kyn-time-picker
      .name=${args.name}
      .label=${args.label}
      .locale=${args.locale}
      ?required=${args.required}
      ?staticPosition=${args.staticPosition}
      .size=${args.size}
      .warnText=${args.warnText}
      .invalidText=${args.invalidText}
      .caption=${args.caption}
      .defaultHour=${args.defaultHour}
      .defaultMinute=${args.defaultMinute}
      .defaultSeconds=${args.defaultSeconds === '' ||
      args.defaultSeconds == null
        ? null
        : Number(args.defaultSeconds)}
      .defaultErrorMessage=${args.defaultErrorMessage}
      .minTime=${args.minTime}
      .maxTime=${args.maxTime}
      .errorAriaLabel=${args.errorAriaLabel}
      .errorTitle=${args.errorTitle}
      .warningAriaLabel=${args.warningAriaLabel}
      .warningTitle=${args.warningTitle}
      .enableSeconds=${args.enableSeconds}
      ?timepickerDisabled=${args.timepickerDisabled}
      ?readonly=${args.readonly}
      ?twentyFourHourFormat=${args.twentyFourHourFormat}
      .value=${args.value ?? ''}
      @on-change=${(e) => action(e.type)({ ...e, detail: e.detail })}
    >
    </kyn-time-picker>
  `;
};

export const DefaultTimePicker = Template.bind({});
DefaultTimePicker.args = {
  name: 'default-timepicker',
  locale: 'en',
  required: false,
  size: 'md',
  warnText: '',
  invalidText: '',
  staticPosition: false,
  caption: '',
  defaultErrorMessage: 'A time value is required',
  minTime: '',
  maxTime: '',
  errorAriaLabel: 'Error message icon',
  errorTitle: '',
  warningAriaLabel: '',
  warningTitle: '',
  timepickerDisabled: false,
  readonly: false,
  enableSeconds: false,
  twentyFourHourFormat: false,
  label: 'Timepicker',
  value: '',
  defaultHour: null,
  defaultMinute: null,
  defaultSeconds: null,
  textStrings: {
    requiredText: 'Required',
    clearAll: 'Clear',
    pleaseSelectDate: 'Please select a time',
    noTimeSelected: 'No time selected',
    pleaseSelectValidDate: 'Please select a valid time',
  },
};
DefaultTimePicker.storyName = 'Default (12H)';

export const TimePickerWithSeconds = Template.bind({});
TimePickerWithSeconds.args = {
  ...DefaultTimePicker.args,
  label: 'Timepicker with seconds',
  enableSeconds: true,
  value: '12:30:15',
  defaultHour: null,
  defaultMinute: null,
  defaultSeconds: null,
};
TimePickerWithSeconds.storyName = 'With Seconds (12H)';

export const TimePickerTwentyFourHour = Template.bind({});
TimePickerTwentyFourHour.args = {
  ...DefaultTimePicker.args,
  locale: 'en',
  twentyFourHourFormat: true,
  label: 'Timepicker (24H)',
};
TimePickerTwentyFourHour.storyName = 'Timepicker (24H)';

export const TimePickerAltLanguage = Template.bind({});
TimePickerAltLanguage.args = {
  ...DefaultTimePicker.args,
  locale: 'ja',
  twentyFourHourFormat: false,
  label: 'Non-English 12H Example (Japanese locale)',
};
TimePickerAltLanguage.storyName = 'Japanese Locale Example';

export const TimePickerPreSelected = Template.bind({});
TimePickerPreSelected.args = {
  ...DefaultTimePicker.args,
  locale: 'en',
  twentyFourHourFormat: false,
  label: 'Timepicker with Pre-selected Hour and Minutes',
  value: '12:30:00',
  defaultHour: null,
  defaultMinute: null,
  defaultSeconds: null,
};
TimePickerPreSelected.storyName = 'With Pre-selected Time';

export const ValueOverridesDefaultTime = Template.bind({});
ValueOverridesDefaultTime.args = {
  ...DefaultTimePicker.args,
  name: 'value-overrides-default-timepicker',
  label: 'Value overrides default hour/minute/seconds',
  value: '12:30:00',
  defaultHour: 9,
  defaultMinute: 15,
  defaultSeconds: 30,
};
ValueOverridesDefaultTime.storyName =
  'Value Overrides defaultHour/defaultMinute/defaultSeconds';

export const InModal = {
  args: {
    ...DefaultTimePicker.args,
    locale: 'en',
    name: 'timepicker-in-modal',
    dateFormat: 'Y-m-d',
    caption: 'Timepicker in a modal.',
    label: 'Time',
    open: false,
    size: 'lg',
    staticPosition: false,
    titleText: 'Select Time',
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
    defaultHour: null,
    defaultMinute: null,
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
        <kyn-button slot="anchor" kind="primary"> Open Modal </kyn-button>
        <kyn-time-picker
          .name=${args.name}
          .label=${args.label}
          .locale=${args.locale}
          ?required=${args.required}
          .size=${args.size}
          .warnText=${args.warnText}
          .invalidText=${args.invalidText}
          ?staticPosition=${args.staticPosition}
          .caption=${args.caption}
          .defaultErrorMessage=${args.defaultErrorMessage}
          .minTime=${args.minTime}
          .maxTime=${args.maxTime}
          .errorAriaLabel=${args.errorAriaLabel}
          .errorTitle=${args.errorTitle}
          .warningAriaLabel=${args.warningAriaLabel}
          .warningTitle=${args.warningTitle}
          .enableSeconds=${args.enableSeconds}
          ?timepickerDisabled=${args.timepickerDisabled}
          ?readonly=${args.readonly}
          ?twentyFourHourFormat=${args.twentyFourHourFormat}
          @on-change=${(e) => action(e.type)({ ...e, detail: e.detail })}
        >
        </kyn-time-picker>
      </kyn-modal>
    `;
  },
};

export const ControlledEcho = {
  args: {
    ...DefaultTimePicker.args,
    label: 'Controlled echo (writes value back on change)',
    enableSeconds: true,
    twentyFourHourFormat: false,
  },
  render: (args) => {
    const [_, updateArgs] = useArgs();

    const handleChange = (e) => {
      const detail = e.detail || {};
      action(e.type)({ ...e, detail });

      // Echo back in a different type to simulate framework patterns.
      // Prefer a time string (most common in form state).
      updateArgs({ value: detail.time ?? '' });
    };

    return html`
      <kyn-time-picker
        .name=${args.name}
        .label=${args.label}
        .locale=${args.locale}
        ?required=${args.required}
        ?staticPosition=${args.staticPosition}
        .size=${args.size}
        .warnText=${args.warnText}
        .invalidText=${args.invalidText}
        .caption=${args.caption}
        .defaultHour=${args.defaultHour}
        .defaultMinute=${args.defaultMinute}
        .defaultSeconds=${args.defaultSeconds}
        .defaultErrorMessage=${args.defaultErrorMessage}
        .minTime=${args.minTime}
        .maxTime=${args.maxTime}
        .errorAriaLabel=${args.errorAriaLabel}
        .errorTitle=${args.errorTitle}
        .warningAriaLabel=${args.warningAriaLabel}
        .warningTitle=${args.warningTitle}
        .enableSeconds=${args.enableSeconds}
        ?timepickerDisabled=${args.timepickerDisabled}
        ?readonly=${args.readonly}
        ?twentyFourHourFormat=${args.twentyFourHourFormat}
        .value=${args.value ?? ''}
        @on-change=${handleChange}
      >
      </kyn-time-picker>
    `;
  },
};

export const InTabs = {
  args: {
    ...DefaultTimePicker.args,
    label: 'Timepicker in tabs (simple panels)',
    defaultHour: null,
    defaultMinute: null,
  },
  render: (args) => {
    ensureInTabsInitialValues();

    const handleChange = (panelKey) => (e) => {
      const detail = e.detail || {};

      action(e.type)({
        ...e,
        detail: {
          ...detail,
          panel: panelKey,
        },
      });

      if (detail.source === 'clear') {
        inTabsState[panelKey] = null;
        return;
      }

      inTabsState[panelKey] = detail.date ?? null;
    };

    return html`
      <kyn-tabs>
        <kyn-tab slot="tabs" id="tab-a" selected>Panel A</kyn-tab>
        <kyn-tab slot="tabs" id="tab-b">Panel B</kyn-tab>

        <kyn-tab-panel tabId="tab-a" visible>
          <kyn-time-picker
            .label=${`${args.label} - A`}
            .locale=${args.locale}
            .size=${args.size}
            .value=${inTabsState.a ?? ''}
            @on-change=${handleChange('a')}
          >
          </kyn-time-picker>
        </kyn-tab-panel>

        <kyn-tab-panel tabId="tab-b">
          <kyn-time-picker
            .label=${`${args.label} - B`}
            .locale=${args.locale}
            .size=${args.size}
            .value=${inTabsState.b ?? ''}
            @on-change=${handleChange('b')}
          >
          </kyn-time-picker>
        </kyn-tab-panel>
      </kyn-tabs>
    `;
  },
};
