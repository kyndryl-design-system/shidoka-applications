import { html } from 'lit';
import './index';
import { action } from 'storybook/actions';
import { useEffect, useArgs } from 'storybook/preview-api';
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
      url: 'https://www.figma.com/design/9Q2XfTSxfzTXfNe2Bi8KDS/Component-Viewer?node-id=1-373273&m=dev',
    },
  },
  argTypes: {
    size: {
      options: ['sm', 'md', 'lg'],
      control: { type: 'select' },
    },
    required: { control: { type: 'boolean' } },
    staticPosition: { control: { type: 'boolean' } },
    label: { control: { type: 'text' } },
    locale: { control: { type: 'text' } },
    minTime: { control: { type: 'text' } },
    maxTime: { control: { type: 'text' } },
    defaultHour: { control: { type: 'number' } },
    defaultMinute: { control: { type: 'number' } },
    invalidText: { control: { type: 'text' } },
    defaultErrorMessage: { control: { type: 'text' } },
    enableSeconds: { control: { type: 'boolean' } },
    twentyFourHourFormat: { control: { type: 'boolean' } },
    ...ValidationArgs,
  },
};

const disconnectFlatpickr = () => {
  const calendarElements = document.querySelectorAll('.flatpickr-calendar');
  calendarElements.forEach((calendar) => calendar.remove());
};

const Template = (args) => {
  useEffect(() => {
    return () => {
      disconnectFlatpickr();
    };
  }, []);

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
  `;
};

const ControlledTemplate = (args) => {
  const [{ value }, updateArgs] = useArgs();

  useEffect(() => {
    return () => {
      disconnectFlatpickr();
    };
  }, []);

  const toDate = (input) => {
    if (!input) return null;
    if (input instanceof Date) return input;
    if (typeof input === 'string') {
      const parsed = new Date(input);
      return Number.isNaN(parsed.getTime()) ? null : parsed;
    }
    return null;
  };

  const handleChange = (e) => {
    const detail = e.detail || {};

    if (detail.source === 'clear') {
      updateArgs({ value: null });
      action(e.type)({ ...e, detail });
      return;
    }

    const raw =
      detail.date ??
      detail.value ??
      (Array.isArray(detail.dates) ? detail.dates[0] : null);

    const nextValue = toDate(raw);
    updateArgs({ value: nextValue });
    action(e.type)({ ...e, detail });
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
      .value=${value}
      @on-change=${handleChange}
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
  defaultHour: null,
  defaultMinute: null,
};
DefaultTimePicker.storyName = 'Default (12H)';

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
  defaultHour: 12,
  defaultMinute: 30,
};
TimePickerPreSelected.storyName = 'With Pre-selected Time';

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
    useEffect(() => {
      return () => {
        disconnectFlatpickr();
      };
    }, []);
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
          .defaultHour=${args.defaultHour}
          .defaultMinute=${args.defaultMinute}
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

export const ControlledTimePickerValueOverridesDefaults =
  ControlledTemplate.bind({});
ControlledTimePickerValueOverridesDefaults.args = {
  ...DefaultTimePicker.args,
  name: 'controlled-timepicker',
  label: 'Controlled Timepicker (value overrides defaults)',
  caption:
    'Both defaultHour/defaultMinute and value are set; value (Date) takes precedence.',
  defaultHour: 9,
  defaultMinute: 0,
  value: (() => {
    const d = new Date(0);
    d.setHours(14, 30, 0, 0);
    return d;
  })(),
};
ControlledTimePickerValueOverridesDefaults.storyName =
  'Value Overrides Other Defaults';

export const InTabs = {
  args: {
    ...DefaultTimePicker.args,
    label: 'Timepicker in tabs (lazy mount)',
    defaultHour: null,
    defaultMinute: null,
  },
  render: (args) => {
    const [{ activeTab = 'tab-a' }, updateArgs] = useArgs();

    useEffect(() => {
      return () => disconnectFlatpickr();
    }, []);

    const selectTab = (id) => {
      updateArgs({ activeTab: id });
    };

    const valA = new Date();
    valA.setHours(9, 0, 0, 0);
    const valB = new Date();
    valB.setHours(15, 30, 0, 0);

    return html`
      <kyn-tabs>
        <kyn-tab
          slot="tabs"
          id="tab-a"
          ?selected=${activeTab === 'tab-a'}
          @click=${() => selectTab('tab-a')}
        >
          Panel A
        </kyn-tab>
        <kyn-tab
          slot="tabs"
          id="tab-b"
          ?selected=${activeTab === 'tab-b'}
          @click=${() => selectTab('tab-b')}
        >
          Panel B
        </kyn-tab>

        <kyn-tab-panel tabId="tab-a" ?visible=${activeTab === 'tab-a'}>
          ${activeTab === 'tab-a'
            ? html`
                <kyn-time-picker
                  .label=${args.label + ' - A'}
                  .value=${valA}
                  .defaultHour=${args.defaultHour}
                  .defaultMinute=${args.defaultMinute}
                  .locale=${args.locale}
                  .size=${args.size}
                  @on-change=${(e) =>
                    action(e.type)({
                      ...e,
                      detail: e.detail,
                    })}
                >
                </kyn-time-picker>
              `
            : null}
        </kyn-tab-panel>

        <kyn-tab-panel tabId="tab-b" ?visible=${activeTab === 'tab-b'}>
          ${activeTab === 'tab-b'
            ? html`
                <kyn-time-picker
                  .label=${args.label + ' - B'}
                  .value=${valB}
                  .defaultHour=${args.defaultHour}
                  .defaultMinute=${args.defaultMinute}
                  .locale=${args.locale}
                  .size=${args.size}
                  @on-change=${(e) =>
                    action(e.type)({
                      ...e,
                      detail: e.detail,
                    })}
                >
                </kyn-time-picker>
              `
            : null}
        </kyn-tab-panel>
      </kyn-tabs>
    `;
  },
};
