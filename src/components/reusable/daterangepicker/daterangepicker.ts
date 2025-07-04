import { html, TemplateResult, PropertyValues, unsafeCSS } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { customElement, property, query } from 'lit/decorators.js';
import flatpickr from 'flatpickr';
import { BaseOptions } from 'flatpickr/dist/types/options';

import {
  FlatpickrBase,
  FlatpickrConfig,
  FlatpickrTextStrings,
} from '../../../common/base/flatpickr-base';
import { langsArray } from '../../../common/flatpickrLangs';
import {
  emitValue,
  getPlaceholder,
  injectFlatpickrStyles,
  initializeMultiAnchorFlatpickr,
  setCalendarAttributes,
  applyDateRangeEditingRestrictions,
  DateRangeEditableMode,
} from '../../../common/helpers/flatpickr';

import { unsafeSVG } from 'lit/directives/unsafe-svg.js';

import '../button';

import DateRangePickerStyles from './daterangepicker.scss?inline';
import ShidokaFlatpickrTheme from '../../../common/scss/shidoka-flatpickr-theme.scss?inline';
import calendarIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/24/calendar.svg';
import clearIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/close-simple.svg';

/**
 * Default text strings for the date-range picker.
 */
const _defaultTextStrings = {
  requiredText: 'Required',
  clearAll: 'Clear',
  pleaseSelectDate: 'Please select a date',
  pleaseSelectValidDate: 'Please select a valid date',
  pleaseSelectBothDates: 'Please select a start and end date.',
  dateRange: 'Date range',
  noDateSelected: 'No dates selected',
  startDateSelected: 'Start date selected: {0}. Please select end date.',
  invalidDateRange:
    'Invalid date range: End date cannot be earlier than start date',
  dateRangeSelected: 'Selected date range: {0} to {1}',
  lockedStartDate: 'Start date is locked',
  lockedEndDate: 'End date is locked',
  dateLocked: 'Date is locked',
  dateNotAvailable: 'Date is not available',
  dateInSelectedRange: 'Date is in selected range',
};

/**
 * Date Range Picker: uses Flatpickr library, range picker implementation.
 * @fires on-change - Captures the input event and emits the selected value and original event details.
 * @slot tooltip - Slot for tooltip.
 */
@customElement('kyn-date-range-picker')
export class DateRangePicker extends FlatpickrBase {
  private _initialValueSet = false;
  private _initialValue: [Date | null, Date | null] = [null, null];

  override async firstUpdated(changedProps: PropertyValues): Promise<void> {
    await super.firstUpdated(changedProps);
    injectFlatpickrStyles(ShidokaFlatpickrTheme.toString());
    await this.initializeFlatpickr();
  }

  static override styles = [
    unsafeCSS(DateRangePickerStyles),
    unsafeCSS(ShidokaFlatpickrTheme),
  ];

  /** Label text. */
  @property({ type: String }) override accessor label = '';

  /** Locale setting. */
  @property({ type: String })
  override accessor locale: (typeof langsArray)[number] | string = 'en';

  /** Date format for input/display. */
  @property({ type: String }) override accessor dateFormat = 'Y-m-d';

  /** Editable parts of the date range. */
  @property({ type: String })
  accessor rangeEditMode: DateRangeEditableMode = DateRangeEditableMode.BOTH;

  /** Default error message. */
  @property({ type: String }) override accessor defaultErrorMessage = '';

  /** Controlled value for the date range. */
  override value: [Date | null, Date | null] = [null, null];

  /** Validation warning messaging. */
  @property({ type: String }) override accessor warnText = '';

  /** Dates to disable. */
  @property({ type: Array }) override accessor disable: (
    | string
    | number
    | Date
  )[] = [];

  /** Dates to enable. */
  @property({ type: Array }) override accessor enable: (
    | string
    | number
    | Date
  )[] = [];

  /** Caption displayed under the picker. */
  @property({ type: String }) override accessor caption = '';

  /** Required flag. */
  @property({ type: Boolean }) override accessor required = false;

  /** Input size. */
  @property({ type: String }) override accessor size = 'md';

  /** Disabled toggle. */
  @property({ type: Boolean }) override accessor disabled = false;

  /** Readonly toggle. */
  @property({ type: Boolean }) override accessor readonly = false;

  /** Sets entire date range picker form element to enabled/disabled. */
  @property({ type: Boolean })
  accessor dateRangePickerDisabled = false;

  /** 24-hour format toggle. */
  @property({ type: Boolean })
  override accessor twentyFourHourFormat: boolean | null = null;

  /** Min date boundary. */
  @property({ type: String })
  override accessor minDate: string | number | Date = '';

  /** Max date boundary. */
  @property({ type: String })
  override accessor maxDate: string | number | Date = '';

  /** Aria-label for error. */
  @property({ type: String }) override accessor errorAriaLabel = '';

  /** Title for error. */
  @property({ type: String }) override accessor errorTitle = '';

  /** Aria-label for warning. */
  @property({ type: String }) override accessor warningAriaLabel = '';

  /** Title for warning. */
  @property({ type: String }) override accessor warningTitle = '';

  /** Static calendar positioning. */
  @property({ type: Boolean }) override accessor staticPosition = false;

  /** Close on selection. */
  @property({ type: Boolean }) accessor closeOnSelection = false;

  /** Multi-input toggle. */
  @property({ type: Boolean, reflect: true }) override accessor multiInput =
    false;

  /** Custom text overrides. */
  @property({ type: Object })
  override accessor textStrings: Partial<FlatpickrTextStrings> =
    _defaultTextStrings;

  protected config: FlatpickrConfig = {
    mode: 'range',
    enableTime: false,
    noCalendar: false,
  };

  @query('input[data-end-input]')
  protected accessor _endInputEl!: HTMLInputElement;

  protected hasValue(): boolean {
    return Boolean(this._inputEl?.value) || this.value.some((d) => d !== null);
  }

  protected updateFormValue(): void {
    if (this._internals && this._inputEl) {
      const val = this.value
        .filter(Boolean)
        .map((d) => (d as Date).toISOString())
        .join(',');
      this._internals.setFormValue(val);
      this._inputEl.setAttribute('value', val);
    }
  }

  protected async getComponentFlatpickrOptions(): Promise<
    Partial<BaseOptions>
  > {
    const opts = await this.getBaseFlatpickrOptions();
    opts.mode = 'range';
    opts.closeOnSelect = this.closeOnSelection;
    opts.showMonths = this.showSingleMonth ? 1 : 2;
    if (this.defaultDate) opts.defaultDate = this.defaultDate;

    if (this.rangeEditMode !== DateRangeEditableMode.BOTH) {
      return applyDateRangeEditingRestrictions(
        opts,
        this.rangeEditMode,
        this._initialValue,
        {
          lockedStartDate: this._textStrings.lockedStartDate,
          lockedEndDate: this._textStrings.lockedEndDate,
          dateLocked: this._textStrings.dateLocked,
          dateNotAvailable: this._textStrings.dateNotAvailable,
          dateInSelectedRange: this._textStrings.dateInSelectedRange,
        }
      );
    }

    return opts;
  }

  protected setInitialDates(instance?: flatpickr.Instance): void {
    const dates = instance?.selectedDates ?? [];
    this.value = [dates[0] ?? null, dates[1] ?? null];
    if (!this._initialValueSet) {
      this._initialValue = [...this.value];
      this._initialValueSet = true;
    }
  }

  protected clearValue(): Promise<void> {
    return Promise.resolve().then(() => {
      this.value = [null, null];
    });
  }

  protected resetValue(): void {
    this.value = [null, null];
  }

  protected async handleDateChange(
    selectedDates: Date[],
    dateStr: string
  ): Promise<void> {
    if (selectedDates.length === 2) {
      this.value = [selectedDates[0], selectedDates[1]];
      this.flatpickrInstance?.setDate(selectedDates, false);
      const iso = selectedDates.map((d) => d.toISOString());
      emitValue(this, 'on-change', { dates: iso, dateString: dateStr });
      this._validate(true, false);

      if (this.closeOnSelection) {
        this.flatpickrInstance?.close();
      }
    }
  }

  protected emitChangeEvent(source?: string): void {}

  protected getAriaLabel(): string {
    return 'Date range picker';
  }

  protected getPickerIcon(): string {
    return calendarIcon;
  }

  protected getPickerClasses(): Record<string, boolean> {
    return {
      'date-range-picker': true,
      'date-range-picker__enable-time': this._enableTime,
      'date-range-picker__disabled': this.disabled,
      'date-range-picker__single-month': this.showSingleMonth,
      'date-range-picker__multi-input': this.multiInput,
      'date-range-picker__multi-input--with-time':
        this.multiInput && this._enableTime,
    };
  }

  public override async initializeFlatpickr() {
    injectFlatpickrStyles(ShidokaFlatpickrTheme.toString());
    if (this.multiInput) {
      await initializeMultiAnchorFlatpickr({
        inputEl: this._inputEl,
        endinputEl: this._endInputEl,
        getFlatpickrOptions: () => this.getComponentFlatpickrOptions(),
        setCalendarAttributes,
        setInitialDates: (inst) => this.setInitialDates(inst),
      });
    } else {
      await super.initializeFlatpickr();
    }
  }

  override render(): TemplateResult {
    const anchorId =
      this.name || `date-range-${Math.random().toString(36).slice(2)}`;
    const placeholder = getPlaceholder(this.dateFormat, true);
    const showClear = this.hasValue() && !this.readonly && !this.disabled;

    if (this.multiInput) {
      return this.renderMultiInputStructure(anchorId, placeholder, showClear);
    }

    return this.renderBaseStructure(anchorId, placeholder, showClear);
  }

  protected renderMultiInputStructure(
    anchorId: string,
    placeholder: string,
    showClear: boolean
  ): TemplateResult {
    const fmt = (d: Date) => flatpickr.formatDate(d, this.dateFormat);

    const startId = `${anchorId}-start`;
    const endId = `${anchorId}-end`;

    return html`
      <div id="${anchorId}" class="${classMap(this.getPickerClasses())}">
        <div class="input-group">
          <label class="input-label" for="${startId}">
            ${this._textStrings.startLabel}
          </label>
          <div class="input-wrapper">
            <input
              id="${startId}"
              data-start-input
              class="date-range-picker__input"
              placeholder="${placeholder}"
              .value=${this.value[0] ? fmt(this.value[0]!) : ''}
              ?disabled=${this.disabled}
              ?readonly=${this.readonly}
              @click=${() => this.flatpickrInstance?.open()}
            />
            ${this.value[0] && showClear
              ? html` <kyn-button
                  ?disabled=${this.dateRangePickerDisabled}
                  class="clear-button"
                  kind="ghost"
                  size="small"
                  description=${this._textStrings.clearAll}
                  @click=${this._handleClearStart}
                >
                  <span style="display:flex;" slot="icon">
                    ${unsafeSVG(clearIcon)}
                  </span>
                </kyn-button>`
              : html` <span
                  class="input-icon"
                  aria-hidden="true"
                  @click=${() => this.flatpickrInstance?.open()}
                >
                  ${unsafeSVG(calendarIcon)}
                </span>`}
          </div>
        </div>

        <div class="input-group">
          <label class="input-label" for="${endId}">
            ${this._textStrings.endLabel}
          </label>
          <div class="input-wrapper">
            <input
              id="${endId}"
              data-end-input
              class="date-range-picker__input"
              placeholder="${placeholder}"
              .value=${this.value[1] ? fmt(this.value[1]!) : ''}
              ?disabled=${this.disabled}
              ?readonly=${this.readonly}
              @click=${() => this.flatpickrInstance?.open()}
            />
            ${this.value[1] && showClear
              ? html` <kyn-button
                  ?disabled=${this.dateRangePickerDisabled}
                  class="clear-button"
                  kind="ghost"
                  size="small"
                  description=${this._textStrings.clearAll}
                  @click=${this._handleClearEnd}
                >
                  <span style="display:flex;" slot="icon">
                    ${unsafeSVG(clearIcon)}
                  </span>
                </kyn-button>`
              : html` <span
                  class="input-icon"
                  aria-hidden="true"
                  @click=${() => this.flatpickrInstance?.open()}
                >
                  ${unsafeSVG(calendarIcon)}
                </span>`}
          </div>
        </div>

        <slot name="tooltip"></slot>
      </div>
    `;
  }

  private _handleClearStart(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this._isClearing = true;
    this.value = [null, this.value[1]];
    emitValue(this, 'on-change', {
      dates: this.value.map((d) => d?.toISOString()),
      source: 'clear-start',
    });
    this._validate(true, false);
    this._isClearing = false;
  }

  private _handleClearEnd(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this._isClearing = true;
    this.value = [this.value[0], null];
    emitValue(this, 'on-change', {
      dates: this.value.map((d) => d?.toISOString()),
      source: 'clear-end',
    });
    this._validate(true, false);
    this._isClearing = false;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-date-range-picker': DateRangePicker;
  }
}
