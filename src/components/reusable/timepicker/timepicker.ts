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
  getPlaceholder,
  injectFlatpickrStyles,
} from '../../../common/helpers/flatpickr';
import TimepickerStyles from './timepicker.scss?inline';
import ShidokaFlatpickrTheme from '../../../common/scss/shidoka-flatpickr-theme.scss?inline';

import clockIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/24/time.svg';

/**
 * Timepicker: uses Flatpickr library,time picker implementation  -- `https://flatpickr.js.org/examples/#time-picker`
 * @fires on-change - Captures the input event and emits the selected value and original event details. `detail:{ origEvent: Event, value: string }`
 * @slot tooltip - Slot for tooltip.
 * @attr {string} [name=''] - The name of the input, used for form submission.
 * @attr {string} [invalidText=''] - The custom validation message when the input is invalid.
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
    const anchorId =
      this.name || `time-picker-${Math.random().toString(36).slice(2)}`;
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

  getTimepickerClasses() {
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
        this.initializeFlatpickr();
      }
    }

    if (
      changedProperties.has('defaultHour') ||
      changedProperties.has('defaultMinute') ||
      changedProperties.has('minTime') ||
      changedProperties.has('maxTime')
    ) {
      if (this.flatpickrInstance && this._initialized) {
        this.initializeFlatpickr();
      }
    }
  }

  private updateTimeFormat(): void {
    const is24Hour =
      this.twentyFourHourFormat === true ||
      (this.twentyFourHourFormat === null && this.shouldDefault24Hour());
    this.dateFormat = is24Hour ? 'H:i' : 'h:i K';
  }

  private shouldDefault24Hour(): boolean {
    return false;
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
      const customEvent = new CustomEvent('on-change', {
        detail: { source: 'manual' },
      });
      this.emitFlatpickrChange(
        this.flatpickrInstance,
        [date],
        dateStr,
        customEvent
      );
    }
  }

  protected hasValue(): boolean {
    return this.value instanceof Date;
  }

  protected updateFormValue(): void {
    let formValue = '';
    if (this.value instanceof Date) {
      formValue = this.value.toISOString();
    } else if (this._inputEl) {
      formValue = (this._inputEl as HTMLInputElement).value;
    }
    this._internals.setFormValue(formValue);
  }

  protected async getComponentFlatpickrOptions(): Promise<
    Partial<BaseOptions>
  > {
    const opts = await this.getBaseFlatpickrOptions(false);

    opts.dateFormat = this.dateFormat;
    delete (opts as any).defaultDate;
    opts.noCalendar = true;
    opts.enableTime = true;
    opts.allowInput = true;

    const is24Hour =
      this.twentyFourHourFormat === true ||
      (this.twentyFourHourFormat === null && this.shouldDefault24Hour());
    opts.time_24hr = is24Hour;

    if (this.defaultHour != null) opts.defaultHour = this.defaultHour;
    if (this.defaultMinute != null) opts.defaultMinute = this.defaultMinute;
    if (this.minTime) opts.minTime = this.minTime;
    if (this.maxTime) opts.maxTime = this.maxTime;

    return opts;
  }

  protected async handleDateChange(
    selectedDates: Date[],
    dateStr: string,
    instance: flatpickr.Instance,
    event?: Event
  ): Promise<void> {
    if (this._isClearing) return;

    try {
      this._hasInteracted = true;
      this.value = selectedDates[0] || null;

      this._validate(true, false);
      await this.updateComplete;
      this.updateFormValue();

      this.emitFlatpickrChange(instance, selectedDates, dateStr, event);
    } catch (error) {
      console.error('Error handling time change:', error);
      this._validate(true, false);
    }
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
