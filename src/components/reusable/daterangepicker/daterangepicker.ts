import { html, LitElement, PropertyValues } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { FormMixin } from '../../../common/mixins/form-input';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { langsArray } from '../../../common/flatpickrLangs';
import { DateRangeEditableMode } from '../../../common/helpers/flatpickr';
import {
  injectFlatpickrStyles,
  initializeSingleAnchorFlatpickr,
  getFlatpickrOptions,
  getPlaceholder,
  preventFlatpickrOpen,
  handleInputClick,
  handleInputFocus,
  setCalendarAttributes,
  loadLocale,
  emitValue,
  updateEnableTime,
  hideEmptyYear,
  getModalContainer,
  applyDateRangeEditingRestrictions,
  clearFlatpickrInput,
} from '../../../common/helpers/flatpickr';
import '../../reusable/button';

import { BaseOptions } from 'flatpickr/dist/types/options';
import type { Instance } from 'flatpickr/dist/types/instance';

import DateRangePickerStyles from './daterangepicker.scss';
import ShidokaFlatpickrTheme from '../../../common/scss/shidoka-flatpickr-theme.scss';

import errorIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/close-filled.svg';
import calendarIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/24/calendar.svg';
import clearIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/close-simple.svg';

type SupportedLocale = (typeof langsArray)[number];

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

@customElement('kyn-date-range-picker')
export class DateRangePicker extends FormMixin(LitElement) {
  static override styles = [DateRangePickerStyles, ShidokaFlatpickrTheme];

  /** Label text. */
  @property({ type: String }) label = '';

  /** Locale code. */
  @property({ type: String }) locale: SupportedLocale | string = 'en';

  /** Format for display (e.g., `Y-m-d`). */
  @property({ type: String }) dateFormat = 'Y-m-d';

  /** Initial value as an array of two strings (start/end). */
  @property({ type: Array }) defaultDate: string[] | null = null;

  /** Which side of range is editable. */
  @property({ type: String })
  rangeEditMode: DateRangeEditableMode = DateRangeEditableMode.BOTH;

  /** Default error text. */
  @property({ type: String }) defaultErrorMessage = '';

  /** Controlled value as [Date|null, Date|null]. */
  @state() override value: [Date | null, Date | null] = [null, null];

  /** Warning text. */
  @property({ type: String }) warnText = '';

  /** Disable specific dates (array of strings/number/Date). */
  @property({ type: Array }) disable: (string | number | Date)[] = [];

  @state() private _processedDisableDates: (string | number | Date)[] = [];

  /** Enable specific dates. */
  @property({ type: Array }) enable: (string | number | Date)[] = [];

  /** Caption text below input. */
  @property({ type: String }) caption = '';

  /** Required flag. */
  @property({ type: Boolean }) required = false;

  /** Input size: "sm" | "md" | "lg". */
  @property({ type: String }) size = 'md';

  /** Disabled state. */
  @property({ type: Boolean }) dateRangePickerDisabled = false;

  /** Readonly state. */
  @property({ type: Boolean }) readonly = false;

  /** Force 24‑hour time. */
  @property({ type: Boolean }) twentyFourHourFormat: boolean | null = null;

  /** Minimum selectable date. */
  @property({ type: String }) minDate: string | number | Date = '';

  /** Maximum selectable date. */
  @property({ type: String }) maxDate: string | number | Date = '';

  /** Aria label for error. */
  @property({ type: String }) errorAriaLabel = '';

  /** Title for error. */
  @property({ type: String }) errorTitle = '';

  /** Aria label for warning. */
  @property({ type: String }) warningAriaLabel = '';

  /** Title for warning. */
  @property({ type: String }) warningTitle = '';

  /** Static positioning for calendar. */
  @property({ type: Boolean }) staticPosition = false;

  @state() private _enableTime = false;
  @state() private flatpickrInstance?: Instance;
  @query('input') private _inputEl?: HTMLInputElement;
  @state() private _hasInteracted = false;
  @property({ type: Object }) textStrings = _defaultTextStrings;
  @state() _textStrings = { ..._defaultTextStrings };
  @state() private _isClearing = false;
  @state() private _shouldFlatpickrOpen = false;
  @state() private _hasInitialDefaultDate = false;

  private _initialized = false;
  private _submitListener: ((e: Event) => void) | null = null;

  private debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: number | null = null;
    return (...args: Parameters<T>) => {
      if (timeout !== null) window.clearTimeout(timeout);
      timeout = window.setTimeout(() => {
        func.apply(this, args);
        timeout = null;
      }, wait);
    };
  }

  private debouncedUpdate = this.debounce(async () => {
    if (!this.flatpickrInstance) return;
    try {
      await this.initializeFlatpickr();
    } catch (error) {
      if (
        process.env.NODE_ENV === 'development' &&
        error instanceof Error &&
        !error.message.includes('calendarContainer') &&
        !error.message.includes('selectedDates')
      ) {
        console.warn('DateRangePicker update info:', error.message);
      }
    }
  }, 100);

  private handleResize = this.debounce(async () => {
    if (this.flatpickrInstance) {
      try {
        await this.initializeFlatpickr();
      } catch (error) {
        if (
          process.env.NODE_ENV === 'development' &&
          error instanceof Error &&
          !error.message.includes('calendarContainer') &&
          !error.message.includes('selectedDates')
        ) {
          console.debug('DateRangePicker resize info:', error.message);
        }
      }
    }
  }, 250);

  override connectedCallback() {
    super.connectedCallback();
    this.addEventListener('change', this._onChange);
    this.addEventListener('reset', this._handleFormReset);
    window.addEventListener('resize', this.handleResize);

    if (this._internals.form) {
      this._submitListener = (e: Event) => {
        this._validate(true, true);
        if (!this._internals.checkValidity()) e.preventDefault();
      };
      this._internals.form.addEventListener('submit', this._submitListener);
    }

    const noValue =
      !this.value ||
      (Array.isArray(this.value) && this.value.every((date) => date === null));

    if (noValue && this.defaultDate) {
      this._hasInitialDefaultDate = true;
      if (Array.isArray(this.defaultDate) && this.defaultDate.length === 1) {
        this._hasInteracted = true;
      }
    }
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('change', this._onChange);
    this.removeEventListener('reset', this._handleFormReset);
    window.removeEventListener('resize', this.handleResize);

    if (this._internals.form && this._submitListener) {
      this._internals.form.removeEventListener('submit', this._submitListener);
      this._submitListener = null;
    }

    this.flatpickrInstance?.destroy();
  }

  private hasValue(): boolean {
    if (this._inputEl?.value) return true;
    if (this.value && Array.isArray(this.value) && this.value.length === 2) {
      return this.value[0] !== null || this.value[1] !== null;
    }
    if (this.defaultDate) {
      if (Array.isArray(this.defaultDate)) {
        return (
          this.defaultDate.length > 0 &&
          !this.defaultDate.every((date) => !date || date === '')
        );
      }
      return !!this.defaultDate;
    }
    return false;
  }

  private updateFormValue() {
    if (this._internals && this._inputEl) {
      if (this.value[0] && this.value[1]) {
        const formattedValue = [
          this.value[0].toISOString(),
          this.value[1].toISOString(),
        ].join(',');
        this._internals.setFormValue(formattedValue);
        if (this.name) {
          this._inputEl.setAttribute('value', formattedValue);
        }
      } else {
        this._internals.setFormValue('');
      }
    }
  }

  override render() {
    const errorId = `${this.name}-error-message`;
    const warningId = `${this.name}-warning-message`;
    const anchorId = this.name
      ? `${this.name}-${Math.random().toString(36).slice(2, 11)}`
      : `date-range-picker-${Math.random().toString(36).slice(2, 11)}`;
    const placeholder = getPlaceholder(this.dateFormat, true);

    const showClearButton =
      this.hasValue() &&
      !this.readonly &&
      this.rangeEditMode !== DateRangeEditableMode.START &&
      this.rangeEditMode !== DateRangeEditableMode.END &&
      this.rangeEditMode !== DateRangeEditableMode.NONE;

    return html`
      <div class=${classMap(this.getDateRangePickerClasses())}>
        <div
          class="label-text"
          @mousedown=${this.preventFlatpickrOpen}
          @click=${this.preventFlatpickrOpen}
          aria-disabled=${this.dateRangePickerDisabled ? 'true' : 'false'}
          id=${`label-${anchorId}`}
          tabindex="0"
          @keydown=${(e: KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              this.preventFlatpickrOpen(e);
            }
          }}
        >
          ${this.required
            ? html`<abbr
                class="required"
                title=${this._textStrings?.requiredText}
                role="img"
                aria-label=${this._textStrings?.requiredText}
                >*</abbr
              >`
            : null}
          ${this.label}
          <slot name="tooltip"></slot>
        </div>

        <div class="input-wrapper">
          <input
            class="${classMap({
              [`size--${this.size}`]: true,
              'input-custom': true,
              'is-readonly': this.readonly,
            })}"
            type="text"
            id=${anchorId}
            name=${this.name}
            placeholder=${placeholder}
            ?disabled=${this.dateRangePickerDisabled}
            ?readonly=${this.readonly}
            ?required=${this.required}
            ?invalid=${this._isInvalid}
            aria-invalid=${this._isInvalid ? 'true' : 'false'}
            aria-labelledby=${`label-${anchorId}`}
            @click=${this.handleInputClickEvent}
            @focus=${this.handleInputFocusEvent}
          />
          ${showClearButton
            ? html`
                <kyn-button
                  ?disabled=${this.dateRangePickerDisabled}
                  class="clear-button"
                  kind="ghost"
                  size="small"
                  description=${this._textStrings.clearAll}
                  @click=${this._handleClear}
                >
                  <span style="display:flex;" slot="icon">
                    ${unsafeSVG(clearIcon)}
                  </span>
                </kyn-button>
              `
            : html`
                <span
                  class="input-icon
                  ${this.dateRangePickerDisabled ? 'is-disabled' : ''}"
                  aria-hidden="true"
                  @click=${this.handleInputClickEvent}
                  >${unsafeSVG(calendarIcon)}</span
                >
              `}
        </div>

        ${this.caption
          ? html`
              <div
                id=${`caption-${anchorId}`}
                class="caption"
                aria-disabled=${this.dateRangePickerDisabled ? 'true' : 'false'}
                @mousedown=${this.preventFlatpickrOpen}
                @click=${this.preventFlatpickrOpen}
              >
                ${this.caption}
              </div>
            `
          : ''}
        ${this.renderValidationMessage(errorId, warningId)}
      </div>
    `;
  }

  private renderValidationMessage(errorId: string, warningId: string) {
    if (this.dateRangePickerDisabled) return null;

    if (this.invalidText || (this._isInvalid && this._hasInteracted)) {
      return html`
        <div
          id=${errorId}
          class="error error-text"
          role="alert"
          title=${this.errorTitle || 'Error'}
          @mousedown=${this.preventFlatpickrOpen}
          @click=${this.preventFlatpickrOpen}
          tabindex="0"
          @keydown=${(e: KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              this.preventFlatpickrOpen(e);
            }
          }}
        >
          <span
            class="error-icon"
            aria-label=${this.errorAriaLabel || 'Error message icon'}
            >${unsafeSVG(errorIcon)}</span
          >
          ${this.invalidText ||
          this._internalValidationMsg ||
          this.defaultErrorMessage}
        </div>
      `;
    }

    if (this.warnText) {
      return html`
        <div
          id=${warningId}
          class="warn warn-text"
          role="alert"
          aria-label=${this.warningAriaLabel || 'Warning message'}
          title=${this.warningTitle || 'Warning'}
          @mousedown=${this.preventFlatpickrOpen}
          @click=${this.preventFlatpickrOpen}
          tabindex="0"
          @keydown=${(e: KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              this.preventFlatpickrOpen(e);
            }
          }}
        >
          ${this.warnText}
        </div>
      `;
    }

    return null;
  }

  private getDateRangePickerClasses() {
    return {
      'date-range-picker': true,
      'date-range-picker__enable-time': this._enableTime,
      'date-range-picker__disabled': this.dateRangePickerDisabled,
    };
  }

  private processDefaultDates(
    defaultDate: string | string[] | Date | Date[] | null
  ): Date[] {
    if (!defaultDate) return [];

    if (Array.isArray(defaultDate)) {
      const parsedDates = defaultDate
        .map((date) => {
          if (date instanceof Date) return date;
          if (typeof date === 'string') return this.parseDateString(date);
          return null;
        })
        .filter((date): date is Date => date !== null);

      if (
        parsedDates.length === 2 &&
        parsedDates[1].getTime() < parsedDates[0].getTime()
      ) {
        console.error(
          'Invalid date range: End date cannot be earlier than start date'
        );
        this.invalidText = this._textStrings.invalidDateRange;
        return [parsedDates[0]];
      }

      return parsedDates;
    } else if (typeof defaultDate === 'string') {
      const parsed = this.parseDateString(defaultDate);
      return parsed ? [parsed] : [];
    } else if (defaultDate instanceof Date) {
      return [defaultDate];
    }

    return [];
  }

  private parseDateString(dateStr: string): Date | null {
    if (!dateStr.trim()) return null;
    dateStr = dateStr.trim();
    const dateFormat = this.dateFormat || 'Y-m-d';

    if (dateStr.includes('T')) {
      const date = new Date(dateStr);
      return isNaN(date.getTime()) ? null : date;
    }

    if (dateStr.includes(' ')) {
      const [datePart, timePart, ampmToken] = dateStr.split(/\s+/);
      const dateTokens = datePart.split('-').map(Number);
      let year!: number, month!: number, day!: number;
      switch (dateFormat) {
        case 'Y-m-d':
          [year, month, day] = dateTokens;
          break;
        case 'm-d-Y':
          [month, day, year] = dateTokens;
          break;
        case 'd-m-Y':
          [day, month, year] = dateTokens;
          break;
        default:
          [year, month, day] = dateTokens;
      }
      if (!year || !month || !day) return null;

      let hours = 0,
        minutes = 0,
        seconds = 0;
      if (timePart) {
        const comps = timePart.split(':');
        hours = parseInt(comps[0], 10);
        if (comps.length > 1) minutes = parseInt(comps[1], 10);
        if (comps.length > 2) seconds = parseInt(comps[2], 10);
      }
      const ampm = ampmToken ? ampmToken.toUpperCase() : undefined;
      if (ampm) {
        if (ampm === 'PM' && hours < 12) hours += 12;
        if (ampm === 'AM' && hours === 12) hours = 0;
      }
      const date = new Date(year, month - 1, day, hours, minutes, seconds);
      return isNaN(date.getTime()) ? null : date;
    }

    // simple date-only
    const formats: Record<string, RegExp> = {
      'Y-m-d': /^\d{4}-\d{2}-\d{2}$/,
      'm-d-Y': /^\d{2}-\d{2}-\d{4}$/,
      'd-m-Y': /^\d{2}-\d{2}-\d{4}$/,
    };
    const pattern = formats[dateFormat];
    if (!pattern || !pattern.test(dateStr)) return null;
    const tokens = dateStr.split('-').map(Number);
    let year!: number, month!: number, day!: number;
    switch (dateFormat) {
      case 'Y-m-d':
        [year, month, day] = tokens;
        break;
      case 'm-d-Y':
        [month, day, year] = tokens;
        break;
      case 'd-m-Y':
        [day, month, year] = tokens;
        break;
      default:
        [year, month, day] = tokens;
    }
    const date = new Date(year, month - 1, day);
    return isNaN(date.getTime()) ? null : date;
  }

  override async firstUpdated(changedProperties: PropertyValues) {
    super.firstUpdated(changedProperties);
    if (!this._initialized) {
      injectFlatpickrStyles(ShidokaFlatpickrTheme.toString());
      this._initialized = true;

      this._enableTime = updateEnableTime(this.dateFormat);

      await this.updateComplete;
      this.setupAnchor();

      const valueEmpty =
        !this.value ||
        (Array.isArray(this.value) &&
          this.value[0] === null &&
          this.value[1] === null);

      if (valueEmpty && this._hasInitialDefaultDate && this.defaultDate) {
        const processedDates = this.processDefaultDates(this.defaultDate);
        if (processedDates.length > 0) {
          if (processedDates.length === 1) {
            this.value = [processedDates[0], null];
            this._hasInteracted = true;
          } else {
            this.value = [processedDates[0], processedDates[1]];
          }
          if (this.value[0] !== null || this.value[1] !== null) {
            this.updateFormValue();
          }
          this._validate(true, false);
        }
      }

      setTimeout(() => {
        if (Array.isArray(this.defaultDate) && this.defaultDate.length === 1) {
          this._hasInteracted = true;
          this._validate(true, false);
        } else if (
          Array.isArray(this.value) &&
          this.value.length === 2 &&
          ((this.value[0] !== null && this.value[1] === null) ||
            (this.value[0] === null && this.value[1] !== null))
        ) {
          this._hasInteracted = true;
          this._validate(true, false);
        }
      }, 0);
    }
  }

  override updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    if (changedProperties.has('textStrings')) {
      this._textStrings = {
        ..._defaultTextStrings,
        ...this.textStrings,
      };
      if (
        this.flatpickrInstance &&
        this.rangeEditMode !== DateRangeEditableMode.BOTH
      ) {
        this.updateFlatpickrOptions();
      }
    }

    if (
      (changedProperties.has('dateRangePickerDisabled') &&
        this.dateRangePickerDisabled) ||
      (changedProperties.has('readonly') && this.readonly)
    ) {
      if (this.dateRangePickerDisabled || this.readonly) {
        this.flatpickrInstance?.close();
        return;
      } else if (this.value[0] && this.value[1]) {
        this.setInitialDates();
      }
    }

    if (changedProperties.has('rangeEditMode') && this.flatpickrInstance) {
      if (Array.isArray(this.defaultDate) && this.defaultDate.length === 2) {
        if (
          this.rangeEditMode === DateRangeEditableMode.START &&
          !this.defaultDate[0] &&
          this.defaultDate[1]
        ) {
          const processed = this.processDefaultDates([this.defaultDate[1]]);
          if (processed.length === 1) {
            this.value = [null, processed[0]];
          }
        } else if (
          this.rangeEditMode === DateRangeEditableMode.END &&
          this.defaultDate[0] &&
          !this.defaultDate[1]
        ) {
          const processed = this.processDefaultDates([this.defaultDate[0]]);
          if (processed.length === 1) {
            this.value = [processed[0], null];
          }
        }
      }

      this.flatpickrInstance.destroy();
      setTimeout(() => {
        this.initializeFlatpickr().then(() => {
          if (this._inputEl && this.flatpickrInstance) {
            this._inputEl.value = this.flatpickrInstance.input.value;
            this.flatpickrInstance.redraw();
            this.updateFormValue();
          }
        });
      }, 0);
    }

    if (
      changedProperties.has('value') &&
      !this.dateRangePickerDisabled &&
      this.flatpickrInstance &&
      !this._isClearing
    ) {
      const newValue = this.value;
      if (Array.isArray(newValue) && newValue.every((v) => v === null)) {
        this._isClearing = true;
        this.flatpickrInstance.clear();
        this._isClearing = false;
        if (this._inputEl) {
          this._inputEl.value = '';
          this.updateFormValue();
        }
      } else {
        const currentDates = this.flatpickrInstance.selectedDates;
        if (
          currentDates.length !== 2 ||
          !currentDates[0] ||
          !currentDates[1] ||
          currentDates[0].getTime() !== newValue[0]?.getTime() ||
          currentDates[1].getTime() !== newValue[1]?.getTime()
        ) {
          this.setInitialDates();
        }
        if (
          (newValue[0] !== null && newValue[1] === null) ||
          (newValue[0] === null && newValue[1] !== null)
        ) {
          this._hasInteracted = true;
          this._validate(true, false);
        }
      }
    }

    if (changedProperties.has('defaultDate') && this.flatpickrInstance) {
      const dates = this.processDefaultDates(this.defaultDate);
      this.value =
        dates.length === 2
          ? ([dates[0], dates[1]] as [Date, Date])
          : dates.length === 1
          ? ([dates[0], null] as [Date, null])
          : ([null, null] as [null, null]);

      if (Array.isArray(this.defaultDate) && this.defaultDate.length === 2) {
        if (
          this.rangeEditMode === DateRangeEditableMode.START &&
          !this.defaultDate[0] &&
          this.defaultDate[1]
        ) {
          const processed = this.processDefaultDates([this.defaultDate[1]]);
          if (processed.length === 1) {
            this.value = [null, processed[0]];
          }
        } else if (
          this.rangeEditMode === DateRangeEditableMode.END &&
          this.defaultDate[0] &&
          !this.defaultDate[1]
        ) {
          const processed = this.processDefaultDates([this.defaultDate[0]]);
          if (processed.length === 1) {
            this.value = [processed[0], null];
          }
        }
      }

      this.flatpickrInstance.destroy();
      this.initializeFlatpickr().then(() => {
        if (this._inputEl && this.flatpickrInstance) {
          this._inputEl.value = this.flatpickrInstance.input.value;
          this.flatpickrInstance.redraw();
          this.updateFormValue();
        }
      });
    }

    if (changedProperties.has('disable')) {
      if (Array.isArray(this.disable)) {
        this._processedDisableDates = this.disable.map((date) => {
          if (date instanceof Date) return date;
          if (typeof date === 'number') return new Date(date);
          if (typeof date === 'string') {
            const [y, m, d] = date.split('-').map(Number);
            if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
              return new Date(y, m - 1, d);
            }
          }
          return date;
        });
      } else {
        this._processedDisableDates = [];
      }
      if (this.flatpickrInstance) {
        this.updateFlatpickrOptions();
      }
    }

    if (
      (changedProperties.has('dateFormat') ||
        changedProperties.has('minDate') ||
        changedProperties.has('maxDate') ||
        changedProperties.has('locale') ||
        changedProperties.has('twentyFourHourFormat')) &&
      this.flatpickrInstance &&
      !this._isClearing
    ) {
      this._enableTime = updateEnableTime(this.dateFormat);
      this.updateFlatpickrOptions();
    }
  }

  private async setupAnchor() {
    if (!this._inputEl) return;
    try {
      await this.initializeFlatpickr();
    } catch (error) {
      console.error('Error setting up Flatpickr:', error);
    }
  }

  private async _clearInput(
    options: { reinitFlatpickr?: boolean } = { reinitFlatpickr: true }
  ) {
    if (this.rangeEditMode === DateRangeEditableMode.NONE) return;

    this.value = [null, null];
    this.defaultDate = null;

    await clearFlatpickrInput(this.flatpickrInstance, this._inputEl, () => {
      this.updateFormValue();
    });

    emitValue(this, 'on-change', {
      dates: this.value,
      dateString: this._inputEl?.value,
      source: 'clear',
    });

    this._validate(true, false);
    await this.updateComplete;

    if (options.reinitFlatpickr) {
      await this.initializeFlatpickr();
      this.requestUpdate();
    }
  }

  private async _handleClear(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this._isClearing = true;
    try {
      await this._clearInput();
    } finally {
      this._isClearing = false;
    }
  }

  public async handleClose() {
    this._hasInteracted = true;
    this._validate(true, false);
    await this.updateComplete;
  }

  public async initializeFlatpickr() {
    if (!this._inputEl) {
      console.warn('Cannot initialize Flatpickr: input element not available');
      return;
    }
    if (!this.dateFormat) {
      console.warn('Date format not set, using default Y-m-d');
      this.dateFormat = 'Y-m-d';
    }

    try {
      this.flatpickrInstance?.destroy();

      const ctx: any = {
        inputEl: this._inputEl,
        getFlatpickrOptions: () => this.getComponentFlatpickrOptions(),

        setCalendarAttributes: (instance: Instance) => {
          try {
            if (!instance.calendarContainer) {
              throw new Error('Calendar container not available');
            }
            const container = getModalContainer(this);
            setCalendarAttributes(instance, container !== document.body);
            instance.calendarContainer.setAttribute(
              'aria-label',
              'Date range calendar'
            );
          } catch (error) {
            console.warn('Error setting calendar attributes:', error);
          }
        },

        setInitialDates: this.setInitialDates.bind(this),
      };

      this.flatpickrInstance = await initializeSingleAnchorFlatpickr(ctx);

      if (!this.flatpickrInstance) {
        throw new Error('Failed to initialize Flatpickr instance');
      }

      hideEmptyYear();
      this._validate(false, false);
    } catch (error) {
      console.error('Error initializing Flatpickr:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message);
      }
    }
  }

  public async updateFlatpickrOptions() {
    if (!this.flatpickrInstance) {
      console.warn('Cannot update options: Flatpickr instance not available');
      return;
    }
    await this.debouncedUpdate();
  }

  public async getComponentFlatpickrOptions(): Promise<Partial<BaseOptions>> {
    if (!this.dateFormat) this.dateFormat = 'Y-m-d';

    const container = getModalContainer(this);
    const options = await getFlatpickrOptions({
      locale: this.locale || 'en',
      dateFormat: this.dateFormat,
      defaultDate: this.defaultDate ? this.defaultDate : undefined,
      enableTime: this._enableTime,
      twentyFourHourFormat: this.twentyFourHourFormat ?? undefined,
      inputEl: this._inputEl!,
      minDate: this.minDate,
      maxDate: this.maxDate,
      enable: this.enable,
      disable: this._processedDisableDates,
      mode: 'range',
      closeOnSelect: !this._enableTime,
      loadLocale,
      onOpen: this.handleOpen.bind(this),
      onClose: this.handleClose.bind(this),
      onChange: this.handleDateChange.bind(this),
      appendTo: container,
      noCalendar: false,
      static: this.staticPosition,
    });

    if (this.rangeEditMode !== DateRangeEditableMode.BOTH) {
      const tooltipStrings = {
        lockedStartDate: this._textStrings.lockedStartDate,
        lockedEndDate: this._textStrings.lockedEndDate,
        dateLocked: this._textStrings.dateLocked,
        dateNotAvailable: this._textStrings.dateNotAvailable,
        dateInSelectedRange: this._textStrings.dateInSelectedRange,
      };

      let initialValue = this.value;
      if (this.defaultDate && Array.isArray(this.defaultDate)) {
        if (
          this.rangeEditMode === DateRangeEditableMode.START &&
          this.defaultDate.length === 2 &&
          !this.defaultDate[0] &&
          this.defaultDate[1]
        ) {
          const processed = this.processDefaultDates(this.defaultDate);
          if (processed.length === 1) {
            initialValue = [null, processed[0]];
          }
        } else if (
          this.rangeEditMode === DateRangeEditableMode.END &&
          this.defaultDate.length === 2 &&
          this.defaultDate[0] &&
          !this.defaultDate[1]
        ) {
          const processed = this.processDefaultDates(this.defaultDate);
          if (processed.length === 1) {
            initialValue = [processed[0], null];
          }
        }
      }

      return applyDateRangeEditingRestrictions(
        options,
        this.rangeEditMode,
        initialValue,
        tooltipStrings
      );
    }

    return options;
  }

  public setInitialDates() {
    if (!this.flatpickrInstance) return;
    if (!this.dateFormat) this.dateFormat = 'Y-m-d';

    try {
      const hasValidValue =
        Array.isArray(this.value) &&
        this.value.length === 2 &&
        (this.value[0] !== null || this.value[1] !== null);

      if (!hasValidValue && this.defaultDate) {
        const validDates = this.processDefaultDates(this.defaultDate);
        if (validDates.length === 2) {
          this.flatpickrInstance.setDate(validDates, true);
          this.flatpickrInstance.redraw();
          this.value = validDates as [Date, Date];
          this._inputEl!.value = this.flatpickrInstance.input.value;
          this.updateFormValue();
        } else if (validDates.length === 1) {
          this.flatpickrInstance.setDate([validDates[0]], true);
          this.flatpickrInstance.redraw();
          this.value = [validDates[0], null];
          this._inputEl!.value = this.flatpickrInstance.input.value;
          this.updateFormValue();
          this._validate(true, false);
        }
        return;
      }

      if (Array.isArray(this.value) && this.value.length === 2) {
        const validDates = (this.value as (string | Date)[])
          .map((d) => (d instanceof Date ? d : this.parseDateString(d)))
          .filter((d): d is Date => d !== null);

        if (validDates.length === 2) {
          this.flatpickrInstance.setDate(validDates, true);
          this.flatpickrInstance.redraw();
          this._inputEl!.value = this.flatpickrInstance.input.value;
          this.updateFormValue();
        }
      }
    } catch (e) {
      console.error('Error in setInitialDates:', (e as Error).message);
    }
  }

  public handleOpen() {
    if (this.readonly) {
      this.flatpickrInstance?.close();
      return;
    }

    this._shouldFlatpickrOpen = true;
    this._isInvalid = false;
    this.requestUpdate();
  }

  public async handleDateChange(selectedDates: Date[]) {
    this._hasInteracted = true;
    if (!this._isClearing) {
      if (selectedDates.length === 0) {
        this.value = [null, null];
        emitValue(this, 'on-change', {
          dates: this.value,
          source: 'clear',
        });
      } else if (selectedDates.length === 1) {
        this.value = [selectedDates[0], null];
        emitValue(this, 'on-change', {
          dates: [selectedDates[0].toISOString()],
          dateString:
            this.flatpickrInstance?.input.value ||
            selectedDates[0].toISOString(),
          source: 'date-selection',
        });
      } else {
        this.value = [selectedDates[0], selectedDates[1]];
        const formatted = selectedDates.map((d) => d.toISOString());
        const dateStringFinal =
          this.flatpickrInstance?.input.value || formatted.join(' to ');
        emitValue(this, 'on-change', {
          dates: formatted,
          dateString: dateStringFinal,
          source: 'date-selection',
        });
      }
    }

    this.updateSelectedDateRangeAria(selectedDates);
    this._validate(true, false);
    await this.updateComplete;

    if (this._inputEl && this.flatpickrInstance) {
      if (
        !this.flatpickrInstance.isOpen &&
        this.value[0] !== null &&
        this.value[1] === null
      ) {
        this._inputEl.value = '';
        this.value = [null, null];
        this.updateFormValue();
      } else {
        this._inputEl.value = this.flatpickrInstance.input.value;
        this.updateFormValue();
      }
    }
  }

  private updateSelectedDateRangeAria(selectedDates: Date[]) {
    if (!this._inputEl) return;
    let ariaLabel = this._textStrings.dateRange;
    if (selectedDates.length === 0) {
      ariaLabel = this._textStrings.noDateSelected;
    } else if (selectedDates.length === 1) {
      ariaLabel = this._textStrings.startDateSelected.replace(
        '{0}',
        selectedDates[0].toLocaleDateString(this.locale)
      );
    } else if (selectedDates.length === 2) {
      const [start, end] = selectedDates;
      ariaLabel = this._textStrings.dateRangeSelected
        .replace('{0}', start.toLocaleDateString(this.locale))
        .replace('{1}', end.toLocaleDateString(this.locale));
    }
    this._inputEl.setAttribute('aria-label', ariaLabel);
  }

  private setShouldFlatpickrOpen(value: boolean) {
    this._shouldFlatpickrOpen = value;
  }

  private closeFlatpickr() {
    this.flatpickrInstance?.close();
  }

  private preventFlatpickrOpen(event: Event) {
    preventFlatpickrOpen(event, this.setShouldFlatpickrOpen.bind(this));
  }

  private handleInputClickEvent() {
    try {
      this._shouldFlatpickrOpen = true;
      handleInputClick(this.setShouldFlatpickrOpen.bind(this));
      if (
        this.flatpickrInstance &&
        !this.flatpickrInstance.isOpen &&
        !this.readonly &&
        !this.dateRangePickerDisabled
      ) {
        setTimeout(() => {
          if (this.flatpickrInstance && !this.flatpickrInstance.isOpen) {
            this.flatpickrInstance.open();
          }
        }, 0);
      }
    } catch (e) {
      console.warn('Error handling input click event:', e);
    }
  }

  private handleInputFocusEvent() {
    try {
      this._shouldFlatpickrOpen = true;
      handleInputFocus(
        this._shouldFlatpickrOpen,
        this.closeFlatpickr.bind(this),
        this.setShouldFlatpickrOpen.bind(this)
      );
      if (
        this.flatpickrInstance &&
        !this.flatpickrInstance.isOpen &&
        !this.readonly &&
        !this.dateRangePickerDisabled
      ) {
        setTimeout(() => {
          if (this.flatpickrInstance && !this.flatpickrInstance.isOpen) {
            this.flatpickrInstance.open();
          }
        }, 0);
      }
    } catch (e) {
      console.warn('Error handling input focus event:', e);
    }
  }

  private _validate(interacted: boolean, report: boolean) {
    if (!this._inputEl) return;
    if (this.dateRangePickerDisabled) {
      this._internals.setValidity({}, '', this._inputEl);
      this._isInvalid = false;
      this._internalValidationMsg = '';
      return;
    }

    if (interacted) this._hasInteracted = true;
    const showErrors = this._hasInteracted || report || !!this.invalidText;
    const selectedCount = [this.value[0], this.value[1]].filter(
      (d) => d !== null
    ).length;

    let validity = this._inputEl.validity;
    let validationMessage = this._inputEl.validationMessage;

    if (this.flatpickrInstance?.isOpen) {
      validity = { ...validity, valueMissing: false, customError: false };
      validationMessage = '';
    } else if (selectedCount === 1) {
      validity = { ...validity, customError: true };
      validationMessage = this._textStrings.pleaseSelectBothDates;
    } else if (this.required && selectedCount === 0) {
      validity = { ...validity, valueMissing: true };
      validationMessage =
        this.defaultErrorMessage || this._textStrings.pleaseSelectDate;
    } else {
      validity = { ...validity, valueMissing: false, customError: false };
      validationMessage = '';
    }

    if (this.invalidText) {
      validity = { ...validity, customError: true };
      validationMessage = this.invalidText;
    }

    const isValid = !validity.valueMissing && !validity.customError;
    if (!isValid && !validationMessage) {
      validationMessage = this._textStrings.pleaseSelectValidDate;
    }

    this._internals.setValidity(validity, validationMessage, this._inputEl);
    this._isInvalid = !isValid && showErrors;
    this._internalValidationMsg = validationMessage;

    if (report) this._internals.reportValidity();
    this.requestUpdate();
  }

  private _onChange() {
    this._validate(true, false);
  }

  private _handleFormReset() {
    this.value = [null, null];
    this.flatpickrInstance?.clear();
    this._hasInteracted = false;
    this._validate(false, false);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-date-range-picker': DateRangePicker;
  }
}
