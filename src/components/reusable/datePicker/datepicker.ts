import { TemplateResult } from 'lit';
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
import DatePickerStyles from './datepicker.scss?inline';
import ShidokaFlatpickrTheme from '../../../common/scss/shidoka-flatpickr-theme.scss?inline';

import calendarIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/24/calendar.svg';

/**
 * Datepicker: uses Flatpickr's datetime picker library — https://flatpickr.js.org
 * @fires on-change - Captures the input event and emits the selected value and original event details.
 * @slot tooltip - Slot for tooltip.
 */
@customElement('kyn-date-picker')
export class DatePicker extends FlatpickrBase {
  static override styles = [
    unsafeCSS(DatePickerStyles),
    unsafeCSS(ShidokaFlatpickrTheme),
  ];

  /** Sets entire datepicker form element to enabled/disabled. */
  @property({ type: Boolean })
  accessor datePickerDisabled = false;

  /**
   * Bound value - single Date for 'single' mode, Date array for 'multiple' mode.
   * @type {Date | Date[] | null}
   */
  override value: Date | Date[] | null = null;

  /**
   * Selection mode: 'single' allows one date, 'multiple' allows multiple dates.
   * @type {'single' | 'multiple'}
   */
  @property({ type: String })
  accessor mode: 'single' | 'multiple' = 'single';

  protected get config(): FlatpickrConfig {
    return {
      mode: this.mode,
    };
  }

  protected hasValue(): boolean {
    if (this.mode === 'multiple') {
      return Array.isArray(this.value) && this.value.length > 0;
    }
    return this.value instanceof Date || !!this._inputEl?.value;
  }

  protected updateFormValue(): void {
    let formValue = '';
    if (this.mode === 'multiple' && Array.isArray(this.value)) {
      formValue = JSON.stringify(this.value.map((date) => date.toISOString()));
    } else if (this.value instanceof Date) {
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
    opts.mode = this.mode;
    if (this.defaultDate != null) opts.defaultDate = this.defaultDate;
    return opts;
  }

  protected setInitialDates(instance: flatpickr.Instance): void {
    if (this.defaultDate == null) return;
    instance.setDate(this.defaultDate, false);
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

      if (this.mode === 'multiple') {
        this.value = [...selectedDates];
      } else {
        this.value = selectedDates[0] || null;
      }

      this._validate(true, false);
      await this.updateComplete;
      this.updateFormValue();

      this.emitFlatpickrChange(instance, selectedDates, dateStr, event);
    } catch (error) {
      console.error('Error handling date change:', error);
      this._validate(true, false);
    }
  }

  protected getPickerIcon(): string {
    return calendarIcon;
  }

  protected getPickerClasses(): Record<string, boolean> {
    return {
      'date-picker': true,
      'date-picker__enable-time': this._enableTime,
      'date-picker__multiple-select': this.mode === 'multiple',
      'date-picker__disabled': this.disabled,
    };
  }

  protected async clearValue(): Promise<void> {
    this.value = this.mode === 'multiple' ? [] : null;
    this.defaultDate = null;
  }

  protected resetValue(): void {
    this.value = this.mode === 'multiple' ? [] : null;
    this.defaultDate = null;
  }

  protected getAriaLabel(): string {
    return this.mode === 'multiple'
      ? 'Date picker, multiple selection'
      : 'Date picker, single selection';
  }

  protected override emitChangeEvent(source?: string): void {
    const selectedDates = Array.isArray(this.value)
      ? this.value
      : this.value instanceof Date
      ? [this.value]
      : [];

    const dateStr = (this._inputEl as HTMLInputElement)?.value || '';

    if (this.flatpickrInstance) {
      const customEvent = new CustomEvent('on-change', {
        detail: { source: source ?? 'manual' },
      });
      this.emitFlatpickrChange(
        this.flatpickrInstance,
        selectedDates,
        dateStr,
        customEvent
      );
    }
  }

  override updated(changedProperties: Map<string, unknown>) {
    super.updated(changedProperties);

    if (changedProperties.has('datePickerDisabled')) {
      this.disabled = this.datePickerDisabled;
    }

    if (changedProperties.has('mode')) {
      this.value = this.mode === 'multiple' ? [] : null;

      if (this.flatpickrInstance && this._initialized) {
        this.initializeFlatpickr();
      }
    }
  }

  override async firstUpdated(changedProperties: Map<string, unknown>) {
    super.firstUpdated(changedProperties);
    injectFlatpickrStyles(ShidokaFlatpickrTheme.toString());
  }

  override render(): TemplateResult {
    const placeholder = getPlaceholder(this.dateFormat) || '';
    const anchorId =
      this.name || `date-picker-${Math.random().toString(36).slice(2)}`;
    return this.renderBaseStructure(anchorId, placeholder, true);
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'kyn-date-picker': DatePicker;
  }
}
