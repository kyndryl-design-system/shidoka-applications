import { TemplateResult, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { unsafeCSS } from 'lit';
import flatpickr from 'flatpickr';
import { BaseOptions } from 'flatpickr/dist/types/options';

import {
  FlatpickrBase,
  FlatpickrConfig,
} from '../../../common/base/flatpickr-base';
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

  /**
   * Bound time value.
   * @type {Date | null}
   */
  override value: Date | null = null;

  /** Initial hour (0-23). */
  @property({ type: Number })
  accessor defaultHour: number | null = null;

  /** Initial minute (0-59). */
  @property({ type: Number })
  accessor defaultMinute: number | null = null;

  /** Sets entire timepicker form element to enabled/disabled. */
  @property({ type: Boolean })
  accessor timePickerDisabled = false;

  override render(): TemplateResult {
    const anchorId = this.name || this.generateRandomId('time-picker');
    const placeholder =
      this._textStrings.timepickerPlaceholder ??
      getPlaceholder(this.dateFormat);
    return this.renderBaseStructure(anchorId, placeholder, true);
  }

  protected get config(): FlatpickrConfig {
    return {
      mode: 'time',
      enableTime: true,
      noCalendar: true,
    };
  }

  override async firstUpdated(changedProps: PropertyValues): Promise<void> {
    this.updateTimeFormat();

    await super.firstUpdated(changedProps);
    injectFlatpickrStyles(ShidokaFlatpickrTheme.toString());
  }

  private createDefaultTime(): Date {
    const d = new Date();
    if (this.defaultHour != null) {
      if (this.defaultHour < 0 || this.defaultHour > 23) {
        console.warn(`Invalid defaultHour: ${this.defaultHour}. Must be 0-23.`);
        d.setHours(0);
      } else {
        d.setHours(this.defaultHour);
      }
    }
    if (this.defaultMinute != null) {
      if (this.defaultMinute < 0 || this.defaultMinute > 59) {
        console.warn(
          `Invalid defaultMinute: ${this.defaultMinute}. Must be 0-59.`
        );
        d.setMinutes(0);
      } else {
        d.setMinutes(this.defaultMinute);
      }
    }
    d.setSeconds(0);
    d.setMilliseconds(0);
    return d;
  }

  override updated(changedProperties: PropertyValues): void {
    super.updated(changedProperties);

    if (changedProperties.has('timePickerDisabled')) {
      this.disabled = this.timePickerDisabled;
    }

    if (changedProperties.has('twentyFourHourFormat')) {
      this.updateTimeFormat();
      if (this.flatpickrInstance && this._initialized) {
        this.debouncedUpdate();
      }
    }

    if (
      changedProperties.has('defaultHour') ||
      changedProperties.has('defaultMinute') ||
      changedProperties.has('minTime') ||
      changedProperties.has('maxTime')
    ) {
      if (this.flatpickrInstance && this._initialized) {
        this.debouncedUpdate();
      }
    }
  }

  private updateTimeFormat(): void {
    const is24Hour = this.twentyFourHourFormat ?? false;
    this.dateFormat = is24Hour ? 'H:i' : 'h:i K';
  }

  protected setInitialDates(instance: flatpickr.Instance): void {
    if (this.value) {
      instance.setDate(this.value, false);
      return;
    }
    if (this.defaultHour != null || this.defaultMinute != null) {
      instance.setDate(this.createDefaultTime(), true);
    }
  }

  protected override emitChangeEvent(): void {
    const date = this.value instanceof Date ? this.value : null;
    const dateStr = (this._inputEl as HTMLInputElement)?.value || '';

    if (this.flatpickrInstance && date) {
      this.emitFlatpickrChange(this.flatpickrInstance, [date], dateStr, {
        type: 'manual',
      } as Event);
    }
  }

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

    const is24Hour = this.twentyFourHourFormat ?? false;
    opts.time_24hr = is24Hour;

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
