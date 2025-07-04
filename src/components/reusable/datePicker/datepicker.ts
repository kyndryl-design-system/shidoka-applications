import { TemplateResult } from 'lit';
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
  getPlaceholder,
  emitValue,
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

  /** Label text. */
  @property({ type: String })
  override accessor label = '';

  /** Sets entire datepicker form element to enabled/disabled. */
  @property({ type: Boolean })
  accessor datePickerDisabled = false;

  /** Locale setting. */
  @property({ type: String })
  override accessor locale: (typeof langsArray)[number] | string = 'en';

  /** Display format (e.g. `Y-m-d H:i`). */
  @property({ type: String })
  override accessor dateFormat = 'Y-m-d';

  /** Bound value(s). */
  override value: Date | Date[] | null = null;

  /** single (default) or multiple. */
  @property({ type: String })
  accessor mode: 'single' | 'multiple' = 'single';

  /** Default error message. */
  @property({ type: String })
  override accessor defaultErrorMessage = '';

  /** Warning message. */
  @property({ type: String })
  override accessor warnText = '';

  /** Disable specific dates. */
  @property({ type: Array })
  override accessor disable: (string | number | Date)[] = [];

  /** Enable specific dates. */
  @property({ type: Array })
  override accessor enable: (string | number | Date)[] = [];

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

  /** Readonly toggle. */
  @property({ type: Boolean })
  override accessor readonly = false;

  /** Force 24h format. */
  @property({ type: Boolean })
  override accessor twentyFourHourFormat: boolean | null = null;

  /** Min date boundary. */
  @property({ type: String })
  override accessor minDate: string | number | Date = '';

  /** Max date boundary. */
  @property({ type: String })
  override accessor maxDate: string | number | Date = '';

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

  protected config: FlatpickrConfig = {
    mode: this.mode,
  };

  // ─── Implement abstract methods ─────────────────────────────────────────────

  protected hasValue(): boolean {
    return !!(this._inputEl?.value || this.value);
  }

  protected updateFormValue(): void {
    this._internals.setFormValue((this._inputEl as HTMLInputElement).value);
  }

  protected async getComponentFlatpickrOptions(): Promise<
    Partial<BaseOptions>
  > {
    const opts = await this.getBaseFlatpickrOptions();
    if (this.defaultDate != null) opts.defaultDate = this.defaultDate;
    return opts;
  }

  protected setInitialDates(instance: flatpickr.Instance): void {
    if (this.defaultDate == null) return;
    instance.setDate(this.defaultDate, false);
  }

  protected async handleDateChange(
    selectedDates: Date[],
    dateStr: string
  ): Promise<void> {
    if (this._isClearing) return;
    this._hasInteracted = true;

    if (selectedDates.some((d) => isNaN(d.getTime()))) {
      this.invalidText = this._textStrings.invalidDateFormat ?? '';
      this._validate(true, false);
      return;
    }

    this.value =
      this.mode === 'multiple' ? [...selectedDates] : selectedDates[0] || null;
    this.invalidText && (this.invalidText = '');

    const formatted =
      this.mode === 'multiple'
        ? (this.value as Date[]).map((d) => d.toISOString())
        : this.value instanceof Date
        ? this.value.toISOString()
        : null;
    emitValue(this, 'on-change', {
      dates: formatted,
      dateString: (this._inputEl as HTMLInputElement).value,
      source: selectedDates.length === 0 ? 'clear' : undefined,
    });

    this._validate(true, false);
    await this.updateComplete;
    this.updateFormValue();
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
    return 'Date picker';
  }

  protected override emitChangeEvent(source?: string): void {
    const formatted =
      this.mode === 'multiple'
        ? Array.isArray(this.value)
          ? this.value.map((d) => (d as Date).toISOString())
          : []
        : this.value instanceof Date
        ? this.value.toISOString()
        : null;

    emitValue(this, 'on-change', {
      dates: formatted,
      dateString: (this._inputEl as HTMLInputElement).value,
      source,
    });
  }

  // ─── Lifecycle ─────────────────────────────────────────────────────────────

  override async firstUpdated(changedProperties: Map<string, unknown>) {
    super.firstUpdated(changedProperties);
    injectFlatpickrStyles(ShidokaFlatpickrTheme.toString());
  }

  // ─── Rendering ──────────────────────────────────────────────────────────────

  override render(): TemplateResult {
    const placeholder = getPlaceholder(this.dateFormat) || '';
    const anchorId = this.name || this.generateRandomId('date-picker');
    return this.renderBaseStructure(anchorId, placeholder, true);
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'kyn-date-picker': DatePicker;
  }
}
