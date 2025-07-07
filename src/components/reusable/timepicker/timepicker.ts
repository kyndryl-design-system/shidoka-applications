import { TemplateResult, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { unsafeCSS } from 'lit';
import flatpickr from 'flatpickr';
import { BaseOptions } from 'flatpickr/dist/types/options';

import {
  FlatpickrBase,
  FlatpickrConfig,
  defaultTextStrings as baseTextStrings,
  FlatpickrTextStrings,
} from '../../../common/base/flatpickr-base';
import { langsArray } from '../../../common/flatpickrLangs';
import {
  emitValue,
  getPlaceholder,
  injectFlatpickrStyles,
} from '../../../common/helpers/flatpickr';
import TimepickerStyles from './timepicker.scss?inline';
import ShidokaFlatpickrTheme from '../../../common/scss/shidoka-flatpickr-theme.scss?inline';

import clockIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/24/time.svg';

/**
 * Timepicker: uses Flatpickr's time picker implementation — https://flatpickr.js.org/examples/#time-picker
 * @fires on-change - Emits selected time and original event details.
 * @slot tooltip - Slot for tooltip.
 */
@customElement('kyn-time-picker')
export class TimePicker extends FlatpickrBase {
  static override styles = [
    unsafeCSS(TimepickerStyles),
    unsafeCSS(ShidokaFlatpickrTheme),
  ];

  /** Label text. */
  @property({ type: String })
  override accessor label = '';

  /** Locale setting. */
  @property({ type: String })
  override accessor locale: (typeof langsArray)[number] | string = 'en';

  /** Bound time value. */
  override value: Date | null = null;

  /** Display formatted time in the input box. */
  @property({ type: String })
  override accessor dateFormat = 'H:i';

  /** Initial hour. */
  @property({ type: Number })
  accessor defaultHour: number | null = null;

  /** Initial minute. */
  @property({ type: Number })
  accessor defaultMinute: number | null = null;

  /** Default error message. */
  @property({ type: String })
  override accessor defaultErrorMessage = '';

  /** Warning message. */
  @property({ type: String })
  override accessor warnText = '';

  /** Caption under picker. */
  @property({ type: String })
  override accessor caption = '';

  /** Required flag. */
  @property({ type: Boolean })
  override accessor required = false;

  /** Input size. */
  @property({ type: String })
  override accessor size = 'md';

  /** Disabled toggle. */
  @property({ type: Boolean })
  override accessor disabled = false;

  /** Disabled timepicker import toggle. */
  @property({ type: Boolean })
  accessor timePickerDisabled = false;

  /** Readonly toggle. */
  @property({ type: Boolean })
  override accessor readonly = false;

  /** Force 24h format. */
  @property({ type: Boolean })
  override accessor twentyFourHourFormat: boolean | null = null;

  /** Min time boundary. */
  @property({ type: String })
  override accessor minTime: string | number | Date = '';

  /** Max time boundary. */
  @property({ type: String })
  override accessor maxTime: string | number | Date = '';

  /** aria-label for error. */
  @property({ type: String })
  override accessor errorAriaLabel = '';

  /** title for error. */
  @property({ type: String })
  override accessor errorTitle = '';

  /** aria-label for warning. */
  @property({ type: String })
  override accessor warningAriaLabel = '';

  /** title for warning. */
  @property({ type: String })
  override accessor warningTitle = '';

  /** Static calendar positioning. */
  @property({ type: Boolean })
  override accessor staticPosition = false;

  /** Custom text overrides. */
  @property({ type: Object })
  override accessor textStrings: Partial<FlatpickrTextStrings> = {
    ...baseTextStrings,
  };

  override render(): TemplateResult {
    const anchorId = this.name || this.generateRandomId('time-picker');
    const placeholder =
      this._textStrings.timepickerPlaceholder ??
      getPlaceholder(this.dateFormat);
    return this.renderBaseStructure(anchorId, placeholder, true);
  }

  protected config: FlatpickrConfig = {
    mode: 'time',
    enableTime: true,
    noCalendar: true,
  };

  override async firstUpdated(changedProps: PropertyValues): Promise<void> {
    await super.firstUpdated(changedProps);
    injectFlatpickrStyles(ShidokaFlatpickrTheme.toString());
    if (
      this.flatpickrInstance &&
      !this.value &&
      (this.defaultHour != null || this.defaultMinute != null)
    ) {
      const d = new Date();
      if (this.defaultHour != null) d.setHours(this.defaultHour);
      if (this.defaultMinute != null) d.setMinutes(this.defaultMinute);
      d.setSeconds(0);
      d.setMilliseconds(0);
      this.flatpickrInstance.setDate(d, true);
    }
  }

  override updated(changedProperties: PropertyValues): void {
    super.updated(changedProperties);

    if (changedProperties.has('timePickerDisabled')) {
      this.disabled = this.timePickerDisabled;
    }

    if (changedProperties.has('twentyFourHourFormat')) {
      this.dateFormat = this.twentyFourHourFormat ? 'H:i' : 'h:i K';
      this.updateFlatpickrOptions();
    }

    if (
      changedProperties.has('defaultHour') ||
      changedProperties.has('defaultMinute') ||
      changedProperties.has('minTime') ||
      changedProperties.has('maxTime')
    ) {
      this.updateFlatpickrOptions();
    }
  }

  protected setInitialDates(instance: flatpickr.Instance): void {
    if (this.value) {
      instance.setDate(this.value, false);
      return;
    }
    if (this.defaultHour != null || this.defaultMinute != null) {
      const d = new Date();
      if (this.defaultHour != null) d.setHours(this.defaultHour);
      if (this.defaultMinute != null) d.setMinutes(this.defaultMinute);
      d.setSeconds(0);
      d.setMilliseconds(0);
      instance.setDate(d, true);
    }
  }

  protected emitChangeEvent(): void {}

  protected hasValue(): boolean {
    return this.value instanceof Date;
  }

  protected updateFormValue(): void {
    this._internals.setFormValue((this._inputEl as HTMLInputElement).value);
  }

  protected async getComponentFlatpickrOptions(): Promise<
    Partial<BaseOptions>
  > {
    const opts = await this.getBaseFlatpickrOptions();

    opts.dateFormat = this.dateFormat;
    delete (opts as any).defaultDate;
    opts.noCalendar = true;
    opts.enableTime = true;
    opts.allowInput = true;
    opts.time_24hr = this.twentyFourHourFormat ?? opts.time_24hr;

    if (this.defaultHour != null) opts.defaultHour = this.defaultHour;
    if (this.defaultMinute != null) opts.defaultMinute = this.defaultMinute;
    if (this.minTime) opts.minTime = this.minTime;
    if (this.maxTime) opts.maxTime = this.maxTime;

    return opts;
  }

  protected async handleDateChange(
    selectedDates: Date[],
    dateStr: string
  ): Promise<void> {
    if (this._isClearing) return;
    this._hasInteracted = true;
    this.value = selectedDates[0] || null;
    emitValue(this, 'on-change', {
      time: dateStr,
      source: this.value ? undefined : 'clear',
    });
    this._validate(true, false);
    await this.updateComplete;
    this.updateFormValue();
  }

  protected getPickerIcon(): string {
    return clockIcon;
  }

  protected getPickerClasses(): Record<string, boolean> {
    return { 'time-picker': true, 'time-picker__disabled': this.disabled };
  }

  protected async clearValue(): Promise<void> {
    this.value = null;
  }

  protected resetValue(): void {
    this.value = null;
  }

  protected getAriaLabel(): string {
    return 'Time picker';
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-time-picker': TimePicker;
  }
}
