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
  static override styles = [
    unsafeCSS(DateRangePickerStyles),
    unsafeCSS(ShidokaFlatpickrTheme),
  ];

  private _initialValueSet = false;
  private _initialValue: [Date | null, Date | null] = [null, null];

  /** Label text. */
  @property({ type: String })
  override accessor label = '';

  /** Locale setting. */
  @property({ type: String })
  override accessor locale: (typeof langsArray)[number] | string = 'en';

  /** Date format for input/display. */
  @property({ type: String })
  override accessor dateFormat = 'Y-m-d';

  /** Editable parts of the date range. */
  @property({ type: String })
  accessor rangeEditMode: DateRangeEditableMode = DateRangeEditableMode.BOTH;

  /** Default error message. */
  @property({ type: String })
  override accessor defaultErrorMessage = '';

  /** Controlled value for the date range. */
  override value: [Date | null, Date | null] = [null, null];

  /** Validation warning messaging. */
  @property({ type: String })
  override accessor warnText = '';

  /** Dates to disable. */
  @property({ type: Array })
  override accessor disable: (string | number | Date)[] = [];

  /** Dates to enable. */
  @property({ type: Array })
  override accessor enable: (string | number | Date)[] = [];

  /** Caption displayed under the picker. */
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
  @property({ type: String })
  override accessor errorAriaLabel = '';

  /** Title for error. */
  @property({ type: String })
  override accessor errorTitle = '';

  /** Aria-label for warning. */
  @property({ type: String })
  override accessor warningAriaLabel = '';

  /** Title for warning. */
  @property({ type: String })
  override accessor warningTitle = '';

  /** Static calendar positioning. */
  @property({ type: Boolean })
  override accessor staticPosition = false;

  /** Close on selection. */
  @property({ type: Boolean })
  accessor closeOnSelection = false;

  /** Multi-input toggle. */
  @property({ type: Boolean, reflect: true })
  override accessor multiInput = false;

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

  private _validateAndFilterDefaultDates(): {
    validDates: string[];
    hasErrors: boolean;
    errorMessage: string;
  } {
    const result = {
      validDates: [] as string[],
      hasErrors: false,
      errorMessage: '',
    };

    if (!this.defaultDate || !Array.isArray(this.defaultDate)) {
      return result;
    }

    const errors: string[] = [];
    const validDates: string[] = [];

    this.defaultDate.forEach((dateStr, index) => {
      if (!dateStr) return;

      let isValid = true;
      let parsedDate: Date | null = null;

      if (typeof dateStr === 'string') {
        switch (this.dateFormat) {
          case 'Y-m-d': {
            const [year, month, day] = dateStr.split('-').map(Number);
            if (
              isNaN(year) ||
              isNaN(month) ||
              isNaN(day) ||
              month < 1 ||
              month > 12 ||
              day < 1 ||
              day > 31
            ) {
              isValid = false;
              errors.push(
                `Invalid ${
                  index === 0 ? 'start' : 'end'
                } date format: ${dateStr}`
              );
            } else {
              parsedDate = new Date(year, month - 1, day);
              if (
                parsedDate.getFullYear() !== year ||
                parsedDate.getMonth() !== month - 1 ||
                parsedDate.getDate() !== day
              ) {
                isValid = false;
                errors.push(
                  `Invalid ${index === 0 ? 'start' : 'end'} date: ${dateStr}`
                );
              }
            }
            break;
          }
          default:
            parsedDate =
              flatpickr.parseDate(dateStr, this.dateFormat) ||
              new Date(dateStr);
            if (!parsedDate || isNaN(parsedDate.getTime())) {
              isValid = false;
              errors.push(
                `Invalid ${index === 0 ? 'start' : 'end'} date: ${dateStr}`
              );
            }
            break;
        }
      }

      if (isValid && parsedDate) {
        let minDateObj: Date | null = null;
        let maxDateObj: Date | null = null;

        if (this.minDate) {
          if (typeof this.minDate === 'string') {
            minDateObj =
              flatpickr.parseDate(this.minDate, this.dateFormat) ||
              new Date(this.minDate);
          } else if (this.minDate instanceof Date) {
            minDateObj = this.minDate;
          }
        }

        if (this.maxDate) {
          if (typeof this.maxDate === 'string') {
            maxDateObj =
              flatpickr.parseDate(this.maxDate, this.dateFormat) ||
              new Date(this.maxDate);
          } else if (this.maxDate instanceof Date) {
            maxDateObj = this.maxDate;
          }
        }

        const dateType = index === 0 ? 'start' : 'end';

        if (minDateObj && parsedDate.getTime() < minDateObj.getTime()) {
          isValid = false;
          errors.push(
            `${
              dateType.charAt(0).toUpperCase() + dateType.slice(1)
            } date is before minimum allowed date (${this.minDate}).`
          );
        }

        if (maxDateObj && parsedDate.getTime() > maxDateObj.getTime()) {
          isValid = false;
          errors.push(
            `${
              dateType.charAt(0).toUpperCase() + dateType.slice(1)
            } date is after maximum allowed date (${this.maxDate}).`
          );
        }
      }

      if (isValid) {
        validDates.push(dateStr);
      }
    });

    if (validDates.length === 2) {
      const startDate = flatpickr.parseDate(validDates[0], this.dateFormat);
      const endDate = flatpickr.parseDate(validDates[1], this.dateFormat);

      if (startDate && endDate && startDate.getTime() > endDate.getTime()) {
        errors.push('Start date cannot be after end date');
        result.hasErrors = true;
        validDates.length = 0;
      }
    }

    result.validDates = validDates;
    result.hasErrors = errors.length > 0;
    result.errorMessage = errors.join('. ');

    return result;
  }

  override updated(changedProperties: Map<string, unknown>) {
    super.updated(changedProperties);

    if (changedProperties.has('dateRangePickerDisabled')) {
      this.disabled = this.dateRangePickerDisabled;
    }

    if (changedProperties.has('showSingleMonth')) {
      if (this.flatpickrInstance && this._initialized && !this._isClearing) {
        this.debouncedUpdate();
      }
    }
  }

  override async firstUpdated(changedProps: PropertyValues): Promise<void> {
    await super.firstUpdated(changedProps);
    injectFlatpickrStyles(ShidokaFlatpickrTheme.toString());
    await this.initializeFlatpickr();
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

    const isWideScreen = window.innerWidth >= 767;
    if (!isWideScreen) {
      opts.showMonths = 1;
    } else {
      opts.showMonths = this.showSingleMonth ? 1 : 2;
    }

    const originalOnOpen = opts.onOpen;
    opts.onOpen = (selectedDates, dateStr, instance) => {
      this._checkAndUpdateForViewportChange();

      if (this.multiInput) {
        return;
      }

      if (originalOnOpen) {
        if (typeof originalOnOpen === 'function') {
          originalOnOpen(selectedDates, dateStr, instance);
        } else if (Array.isArray(originalOnOpen)) {
          originalOnOpen.forEach((hook) =>
            hook(selectedDates, dateStr, instance)
          );
        }
      }
    };

    if (this.defaultDate) {
      const validatedDates = this._validateAndFilterDefaultDates();
      if (validatedDates.validDates.length > 0) {
        opts.defaultDate = validatedDates.validDates;
      }

      if (validatedDates.hasErrors) {
        this._hasInteracted = true;
        this.invalidText = validatedDates.errorMessage;
      }
    }

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

  private async _checkAndUpdateForViewportChange(): Promise<void> {
    if (!this.flatpickrInstance || this._isClearing) {
      return;
    }

    const isWideScreen = window.innerWidth >= 767;
    const currentShowMonths = this.flatpickrInstance.config.showMonths || 1;

    let expectedShowMonths = 1;
    if (!isWideScreen) {
      expectedShowMonths = 1;
    } else {
      expectedShowMonths = this.showSingleMonth ? 1 : 2;
    }

    if (currentShowMonths !== expectedShowMonths) {
      try {
        const currentDates = this.flatpickrInstance.selectedDates;

        this.flatpickrInstance.destroy();
        this.flatpickrInstance = undefined;

        await this.initializeFlatpickr();

        if (currentDates.length > 0) {
          this.value = [currentDates[0] || null, currentDates[1] || null];
          this.requestUpdate();
        }
      } catch (error) {
        console.error('Error updating calendar for viewport change:', error);
      }
    }
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
      this.invalidText = '';

      emitValue(this, 'on-change', { dates: iso, dateString: dateStr });
      this._validate(true, false);

      if (this.closeOnSelection) {
        this.flatpickrInstance?.close();
      }
    }
  }

  protected override async _handleClear(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    if (!this.flatpickrInstance) {
      console.warn('Cannot clear: Flatpickr instance not available');
      return;
    }

    this._isClearing = true;

    try {
      await this.clearValue();
      this.flatpickrInstance.clear();
      this.invalidText = '';
      this.emitChangeEvent();
      this._validate(true, false);
      this.requestUpdate();
    } catch (error) {
      console.error('Error clearing picker:', error);
    } finally {
      this._isClearing = false;
    }
  }

  protected emitChangeEvent(): void {}

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
      this.flatpickrInstance = await initializeMultiAnchorFlatpickr({
        inputEl: this._inputEl,
        endinputEl: this._endInputEl,
        getFlatpickrOptions: () => this.getComponentFlatpickrOptions(),
        setCalendarAttributes: (instance) => {
          const isWideScreen = window.innerWidth >= 767;
          const shouldShowSingleMonth = !isWideScreen || this.showSingleMonth;

          if (shouldShowSingleMonth && instance.calendarContainer) {
            instance.calendarContainer.classList.add(
              'flatpickr-calendar-single-month'
            );
          }
          setCalendarAttributes(instance, false);
        },
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
              : html` <span class="input-icon" aria-hidden="true">
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
              : html` <span class="input-icon" aria-hidden="true">
                  ${unsafeSVG(calendarIcon)}
                </span>`}
          </div>
        </div>

        <slot name="tooltip"></slot>
      </div>
    `;
  }

  private async _handleClearStart(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    if (!this.flatpickrInstance) {
      console.warn('Cannot clear start: Flatpickr instance not available');
      return;
    }

    this._isClearing = true;

    try {
      this.value = [null, this.value[1]];

      if (this.value[1]) {
        this.flatpickrInstance.setDate([this.value[1]], false);
      } else {
        this.flatpickrInstance.clear();
      }

      this.updateFormValue();
      this.invalidText = '';

      emitValue(this, 'on-change', {
        dates: this.value.map((d) => d?.toISOString() || null),
        dateString: this.value[1]
          ? flatpickr.formatDate(this.value[1], this.dateFormat)
          : '',
        source: 'clear-start',
      });

      this._validate(true, false);
      this.requestUpdate();
    } catch (error) {
      console.error('Error clearing start date:', error);
    } finally {
      this._isClearing = false;
    }
  }

  private async _handleClearEnd(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    if (!this.flatpickrInstance) {
      console.warn('Cannot clear end: Flatpickr instance not available');
      return;
    }

    this._isClearing = true;

    try {
      this.value = [this.value[0], null];

      if (this.value[0]) {
        this.flatpickrInstance.setDate([this.value[0]], false);
      } else {
        this.flatpickrInstance.clear();
      }

      this.updateFormValue();
      this.invalidText = '';

      emitValue(this, 'on-change', {
        dates: this.value.map((d) => d?.toISOString() || null),
        dateString: this.value[0]
          ? flatpickr.formatDate(this.value[0], this.dateFormat)
          : '',
        source: 'clear-end',
      });

      this._validate(true, false);
      this.requestUpdate();
    } catch (error) {
      console.error('Error clearing end date:', error);
    } finally {
      this._isClearing = false;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-date-range-picker': DateRangePicker;
  }
}
