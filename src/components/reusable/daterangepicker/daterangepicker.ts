import { html, LitElement, PropertyValues, unsafeCSS } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { FormMixin } from '../../../common/mixins/form-input';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { langsArray } from '../../../common/flatpickrLangs';
import { DateRangeEditableMode } from '../../../common/helpers/flatpickr';
import {
  injectFlatpickrStyles,
  initializeSingleAnchorFlatpickr,
  getFlatpickrOptions,
  getPlaceholder,
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

import DateRangePickerStyles from './daterangepicker.scss?inline';
import ShidokaFlatpickrTheme from '../../../common/scss/shidoka-flatpickr-theme.scss?inline';

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

/**
 * Date Range Picker: uses Flatpickr library, range picker implementation -- `https://flatpickr.js.org/examples/#range-calendar`
 * @fires on-change - Emitted when the selected date range changes. Event.detail has the shape:
 *   { dates: string[] | (Date | null)[] | null, dateString?: string, source?: string }
 *   - dates: array of ISO strings for selected dates (length 1 or 2), or an array containing Date/null values,
 *            or null/empty when cleared.
 *   - dateString: the display string from the input (may be empty when cleared)
 *   - source: 'clear' when the value was cleared; otherwise may be 'date-selection' or undefined.
 * @slot tooltip - Slot for tooltip.
 * @attr {string} [name=''] - The name of the input, used for form submission.
 * @attr {string} [invalidText=''] - The custom validation message when the input is invalid.
 */
@customElement('kyn-date-range-picker')
export class DateRangePicker extends FormMixin(LitElement) {
  static override styles = [
    unsafeCSS(DateRangePickerStyles),
    unsafeCSS(ShidokaFlatpickrTheme),
  ];

  /** Label text. */
  @property({ type: String })
  accessor label = '';

  /** Sets and dynamically imports specific l10n calendar localization. */
  @property({ type: String })
  accessor locale: SupportedLocale | string = 'en';

  /** Sets flatpickr value to define how the date will be displayed in the input box (ex: `Y-m-d H:i`). */
  @property({ type: String })
  accessor dateFormat = 'Y-m-d';

  /** Sets the initial selected date(s). For range mode, provide an array of date strings matching dateFormat (e.g. ["2024-01-01", "2024-01-07"]). */
  @property({ type: Array })
  accessor defaultDate: string[] | null = null;

  /** Controls which parts of the date range are editable. */
  @property({ type: String })
  accessor rangeEditMode: DateRangeEditableMode = DateRangeEditableMode.BOTH;

  /** Sets default error message. */
  @property({ type: String })
  accessor defaultErrorMessage = '';

  /**
   * Current date range value for the component.
   *
   * - Uncontrolled: populated from `defaultDate` and user selections.
   * - Controlled: can be set from the host (e.g. Vue `:value`) as a tuple
   *   `[startDate, endDate]`, where each entry is a `Date` or `null`.
   *
   * When both `defaultDate` and `value` are provided, `value` takes precedence.
   */
  override value: [Date | null, Date | null] = [null, null];

  /** Sets validation warning messaging. */
  @property({ type: String })
  accessor warnText = '';

  /** Sets flatpickr options setting to disable specific dates. Accepts array of dates in Y-m-d format, timestamps, or Date objects. */
  @property({ type: Array })
  accessor disable: (string | number | Date)[] = [];

  /** Internal storage for processed disable dates */
  @state()
  private accessor _processedDisableDates: (string | number | Date)[] = [];

  /** Sets flatpickr options setting to enable specific dates. */
  @property({ type: Array })
  accessor enable: (string | number | Date)[] = [];

  /** Sets caption to be displayed under primary date picker elements. */
  @property({ type: String })
  accessor caption = '';

  /** Sets date range picker form input value to required. */
  @property({ type: Boolean })
  accessor required = false;

  /** Input size. "sm", "md", or "lg". */
  @property({ type: String })
  accessor size = 'md';

  /** Sets entire date range picker form element to enabled/disabled. */
  @property({ type: Boolean })
  accessor dateRangePickerDisabled = false;

  /** Sets entire date range picker form element to readonly. */
  @property({ type: Boolean })
  accessor readonly = false;

  /** Sets 24-hour formatting true/false.
   * Defaults to 12H for all `en-` locales and 24H for all other locales.
   */
  @property({ type: Boolean })
  accessor twentyFourHourFormat: boolean | null = null;

  /** Sets lower boundary of date range picker date selection. */
  @property({ type: String })
  accessor minDate: string | number | Date = '';

  /** Allows manual input of date/time string that matches dateFormat when true. */
  @property({ type: Boolean })
  accessor allowManualInput = false;

  /** Sets upper boundary of date range picker date selection. */
  @property({ type: String })
  accessor maxDate: string | number | Date = '';

  /** Sets aria label attribute for error message. */
  @property({ type: String })
  accessor errorAriaLabel = '';

  /** Sets title attribute for error message. */
  @property({ type: String })
  accessor errorTitle = '';

  /** Sets aria label attribute for warning message. */
  @property({ type: String })
  accessor warningAriaLabel = '';

  /** Sets title attribute for warning message. */
  @property({ type: String })
  accessor warningTitle = '';

  /** Sets whether the Flatpickr calendar UI should use static positioning. */
  @property({ type: Boolean })
  accessor staticPosition = false;

  /** Sets flatpickr enableTime value based on detected dateFormat.
   * @internal
   */
  @state()
  private accessor _enableTime = false;

  /** Flatpickr instantiation.
   * @internal
   */
  @state()
  private accessor flatpickrInstance: Instance | undefined;

  /**
   * Queries the input DOM element.
   * @internal
   */
  @query('input')
  private accessor _inputEl: HTMLInputElement | null = null;

  /**
   * Sets whether user has interacted with datepicker for error handling.
   * @internal
   */
  @state()
  private accessor _hasInteracted = false;

  /** Customizable text strings. */
  @property({ type: Object })
  accessor textStrings = _defaultTextStrings;

  /** Internal text strings.
   * @internal
   */
  @state()
  accessor _textStrings = { ..._defaultTextStrings };

  /** Tracks if we're in a clear operation to prevent duplicate events
   * @internal
   */
  @state()
  private accessor _isClearing = false;

  /** Control flag to prevent Flatpickr from opening when clicking caption, error, label, or warning elements.
   * @internal
   */
  @state()
  private accessor _shouldFlatpickrOpen = false;

  /** Track if we initially had a defaultDate when the component was first connected
   * @internal
   */
  @state()
  private accessor _hasInitialDefaultDate = false;

  /** Track initialization state
   * @internal
   */
  private _initialized = false;

  /** Track destroyed state
   * @internal
   */
  private _isDestroyed = false;

  /** Stable anchor id for accessibility (generate once per instance)
   * @internal
   */
  private _anchorId: string | null = null;

  /** Store submit event listener reference for cleanup
   * @internal
   */
  private _submitListener: ((e: SubmitEvent) => void) | null = null;

  private debounce<T extends (...args: unknown[]) => unknown>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: number | null = null;

    return (...args: Parameters<T>) => {
      if (timeout !== null) {
        window.clearTimeout(timeout);
      }

      timeout = window.setTimeout(() => {
        void func(...args);
        timeout = null;
      }, wait);
    };
  }

  private debouncedUpdate = this.debounce(async () => {
    if (!this.flatpickrInstance || this._isDestroyed) return;
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
    if (this.flatpickrInstance && !this._isDestroyed) {
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

  private generateRandomId(prefix: string): string {
    return `${prefix}-${Math.random().toString(36).slice(2, 11)}`;
  }

  override connectedCallback() {
    super.connectedCallback();
    this.addEventListener('change', this._onChange);
    this.addEventListener('reset', this._handleFormReset);
    window.addEventListener('resize', this.handleResize);

    if (this._internals.form) {
      this._submitListener = (e: SubmitEvent) => {
        this._validate(true, true);
        if (!this._internals.checkValidity()) {
          e.preventDefault();
        }
      };
      this._internals.form.addEventListener('submit', this._submitListener);
    }

    if (
      (!this.value ||
        (Array.isArray(this.value) &&
          this.value.every((date) => date === null))) &&
      this.defaultDate
    ) {
      this._hasInitialDefaultDate = true;
      if (Array.isArray(this.defaultDate) && this.defaultDate.length === 1) {
        this._hasInteracted = true;
      }
    }
  }

  override disconnectedCallback() {
    this._isDestroyed = true;
    super.disconnectedCallback();
    this.removeEventListener('change', this._onChange);
    this.removeEventListener('reset', this._handleFormReset);
    window.removeEventListener('resize', this.handleResize);

    if (this._internals.form && this._submitListener) {
      this._internals.form.removeEventListener('submit', this._submitListener);
      this._submitListener = null;
    }

    this.flatpickrInstance?.destroy();
    this.flatpickrInstance = undefined;
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
    if (!this._internals || !this._inputEl) return;

    const [start, end] = this.value;

    if (start instanceof Date && end instanceof Date) {
      const formattedValue = [start.toISOString(), end.toISOString()].join(',');
      this._internals.setFormValue(formattedValue);

      if (this.name) {
        this._inputEl.setAttribute('value', formattedValue);
      }
    } else {
      this._internals.setFormValue('');
      if (this.name) {
        this._inputEl.removeAttribute('value');
      }
    }
  }

  override render() {
    const anchorId =
      this._anchorId ??
      (this._anchorId = this.name
        ? this.generateRandomId(this.name)
        : this.generateRandomId('date-range-picker'));

    const errorId = `${anchorId}-error-message`;
    const warningId = `${anchorId}-warning-message`;
    const descriptionId = this.caption ? `${anchorId}-caption` : undefined;
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
          role="button"
          aria-disabled=${this.dateRangePickerDisabled ? 'true' : 'false'}
          @mousedown=${this.onSuppressLabelInteraction}
          @click=${this.onSuppressLabelInteraction}
          @keydown=${(e: KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              this.onSuppressLabelInteraction(e);
            }
          }}
          tabindex=${ifDefined(
            this.dateRangePickerDisabled || this.readonly ? undefined : '0'
          )}
          ?readonly=${this.readonly}
          id=${`label-${anchorId}`}
        >
          ${this.required
            ? html`<abbr
                class="required"
                title=${this._textStrings.requiredText}
                role="img"
                aria-label=${this._textStrings.requiredText}
              >
                *
              </abbr>`
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
            ?readonly=${!this.dateRangePickerDisabled && this.readonly}
            ?required=${this.required}
            ?invalid=${this._isInvalid}
            aria-invalid=${this._isInvalid ? 'true' : 'false'}
            aria-labelledby=${`label-${anchorId}`}
            autocomplete="off"
            @click=${this.handleInputClickEvent}
            @focus=${this.handleInputFocusEvent}
          />
          ${showClearButton
            ? html`<kyn-button
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
              </kyn-button>`
            : html`<span
                class="input-icon ${this.dateRangePickerDisabled
                  ? 'is-disabled'
                  : ''}"
                aria-hidden="true"
                @click=${this.handleInputClickEvent}
              >
                ${unsafeSVG(calendarIcon)}
              </span>`}
        </div>

        <div
          id=${`${anchorId}-announcer`}
          class="sr-only"
          aria-live="polite"
        ></div>
        ${this.caption
          ? html`<div
              id=${ifDefined(descriptionId)}
              class="caption"
              role="button"
              aria-disabled=${this.dateRangePickerDisabled ? 'true' : 'false'}
              @mousedown=${this.onSuppressLabelInteraction}
              @click=${this.onSuppressLabelInteraction}
              @keydown=${(e: KeyboardEvent) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  this.onSuppressLabelInteraction(e);
                }
              }}
              tabindex=${ifDefined(
                this.dateRangePickerDisabled || this.readonly ? undefined : '0'
              )}
            >
              ${this.caption}
            </div>`
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
          @mousedown=${this.onSuppressLabelInteraction}
          @click=${this.onSuppressLabelInteraction}
          tabindex="0"
          @keydown=${(e: KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              this.onSuppressLabelInteraction(e);
            }
          }}
        >
          <span
            class="error-icon"
            role="img"
            aria-label=${this.errorAriaLabel || 'Error message icon'}
          >
            ${unsafeSVG(errorIcon)}
          </span>
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
          @mousedown=${this.onSuppressLabelInteraction}
          @click=${this.onSuppressLabelInteraction}
          tabindex="0"
          @keydown=${(e: KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              this.onSuppressLabelInteraction(e);
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

  private parseDateString(dateStr: string): Date | null {
    if (!dateStr || !dateStr.trim()) return null;
    dateStr = dateStr.trim();

    const dateFormat = this.dateFormat || 'Y-m-d';

    if (dateStr.includes('T')) {
      const date = new Date(dateStr);
      return isNaN(date.getTime()) ? null : date;
    }

    if (dateStr.includes(' ')) {
      const parts = dateStr.split(/\s+/);
      const datePart = parts[0];
      const timePart = parts[1] || '';
      let ampm = parts[2] ? parts[2].toUpperCase() : undefined;
      const dateTokens = datePart.split('-').map(Number);
      let year: number, month: number, day: number;

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

      let hours = 0;
      let minutes = 0;
      let seconds = 0;

      if (timePart) {
        const timeComponents = timePart.split(':');
        hours = parseInt(timeComponents[0], 10);

        if (timeComponents.length > 1) {
          if (timeComponents[1].includes(' ')) {
            const [mins, token] = timeComponents[1].split(' ');
            minutes = parseInt(mins, 10);
            ampm = token ? token.toUpperCase() : ampm;
          } else {
            minutes = parseInt(timeComponents[1], 10);
          }
        }

        if (timeComponents.length > 2) {
          seconds = parseInt(timeComponents[2], 10);
        }

        if (ampm) {
          if (ampm === 'PM' && hours < 12) {
            hours += 12;
          } else if (ampm === 'AM' && hours === 12) {
            hours = 0;
          }
        }
      }

      const date = new Date(year, month - 1, day, hours, minutes, seconds);
      return isNaN(date.getTime()) ? null : date;
    }

    const formats: { [key: string]: RegExp } = {
      'Y-m-d': /^\d{4}-\d{2}-\d{2}$/,
      'm-d-Y': /^\d{2}-\d{2}-\d{4}$/,
      'd-m-Y': /^\d{2}-\d{2}-\d{4}$/,
      'Y-m-d h:i K': /^\d{4}-\d{2}-\d{2}( \d{1,2}:\d{2} [AP]M)?$/,
    };
    const pattern = formats[dateFormat];
    if (!pattern || !pattern.test(dateStr)) return null;

    const datePart = dateStr.split(' ')[0];
    const dateTokens = datePart.split('-').map(Number);
    let year: number, month: number, day: number;

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
        (this.value.length === 2 &&
          this.value[0] === null &&
          this.value[1] === null);

      if (valueEmpty && this._hasInitialDefaultDate && this.defaultDate) {
        const processedDates = this.processDefaultDates(this.defaultDate);
        if (processedDates && processedDates.length > 0) {
          if (processedDates.length === 1) {
            this.value = [processedDates[0], null];
            this._hasInteracted = true;
          } else if (processedDates.length >= 2) {
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
      this._textStrings = { ..._defaultTextStrings, ...this.textStrings };

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
          const processedDate = this.processDefaultDates([this.defaultDate[1]]);
          if (processedDate.length === 1) {
            this.value = [null, processedDate[0]];
          }
        } else if (
          this.rangeEditMode === DateRangeEditableMode.END &&
          this.defaultDate[0] &&
          !this.defaultDate[1]
        ) {
          const processedDate = this.processDefaultDates([this.defaultDate[0]]);
          if (processedDate.length === 1) {
            this.value = [processedDate[0], null];
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
      if (newValue.every((v) => v === null)) {
        this._isClearing = true;
        this.flatpickrInstance.clear();
        this._isClearing = false;

        if (this._inputEl) {
          this._inputEl.value = '';
          this.updateFormValue();
        }

        // no dates selected
        this.updateSelectedDateRangeAria([]);
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

        const announcedDates =
          this.flatpickrInstance.selectedDates.length > 0
            ? this.flatpickrInstance.selectedDates
            : newValue.filter((d): d is Date => d instanceof Date);

        if (announcedDates.length > 0) {
          this.updateSelectedDateRangeAria(announcedDates);
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

    if (changedProperties.has('defaultDate')) {
      if (this.defaultDate && this.value.every((v) => v === null)) {
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
            const processedDate = this.processDefaultDates([
              this.defaultDate[1],
            ]);
            if (processedDate.length === 1) {
              this.value = [null, processedDate[0]];
            }
          } else if (
            this.rangeEditMode === DateRangeEditableMode.END &&
            this.defaultDate[0] &&
            !this.defaultDate[1]
          ) {
            const processedDate = this.processDefaultDates([
              this.defaultDate[0],
            ]);
            if (processedDate.length === 1) {
              this.value = [processedDate[0], null];
            }
          }
        }

        this.updateFormValue();
        this.requestUpdate();
      }

      if (this.flatpickrInstance) {
        this.flatpickrInstance.destroy();
        this.initializeFlatpickr().then(() => {
          if (this._inputEl && this.flatpickrInstance) {
            this._inputEl.value = this.flatpickrInstance.input.value;
            this.flatpickrInstance.redraw();
            this.updateFormValue();
          }
        });
      }
    }

    if (changedProperties.has('disable')) {
      if (Array.isArray(this.disable)) {
        this._processedDisableDates = this.disable.map((date) => {
          if (date instanceof Date) return date;
          if (typeof date === 'number') return new Date(date);
          if (typeof date === 'string') {
            const [year, month, day] = date.split('-').map(Number);
            if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
              return new Date(year, month - 1, day);
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

    if (changedProperties.has('allowManualInput')) {
      this.syncAllowInput();
    }
  }

  private syncAllowInput(): void {
    if (!this.flatpickrInstance) return;
    this.flatpickrInstance.set('allowInput', this.allowManualInput);
    if (!this.readonly && this._inputEl) {
      this._inputEl.readOnly = !this.allowManualInput;
    }
  }

  private async setupAnchor() {
    if (!this._inputEl) {
      return;
    }

    try {
      await this.initializeFlatpickr();
    } catch (error) {
      console.error('Error setting up flatpickr:', error);
    }
  }

  private normalizeToDate(value: string | number | Date | ''): Date | null {
    if (!value) return null;

    if (value instanceof Date) {
      return isNaN(value.getTime()) ? null : value;
    }

    if (typeof value === 'number') {
      const d = new Date(value);
      return isNaN(d.getTime()) ? null : d;
    }

    if (typeof value === 'string') {
      return this.parseDateString(value);
    }

    return null;
  }

  private processDefaultDates(
    defaultDate: string | string[] | Date | Date[] | null
  ): Date[] {
    if (!defaultDate) return [];

    const rawValues = Array.isArray(defaultDate) ? defaultDate : [defaultDate];

    const parsed = rawValues.map((d) => {
      if (d instanceof Date) return d;
      if (typeof d === 'string') return this.parseDateString(d);
      return null;
    });

    const validDates = parsed.filter(
      (date): date is Date => date instanceof Date && !isNaN(date.getTime())
    );

    if (validDates.length === 2 && validDates[1] < validDates[0]) {
      console.error(
        'Invalid date range: End date cannot be earlier than start date'
      );
      this.invalidText = this._textStrings.invalidDateRange;
      return [validDates[0]];
    }

    const min = this.normalizeToDate(this.minDate);
    const max = this.normalizeToDate(this.maxDate);

    const inRange = validDates.filter((d) => {
      return (!min || d >= min) && (!max || d <= max);
    });

    if (inRange.length !== validDates.length) {
      console.error('Invalid date(s) provided in defaultDate', inRange);
      this.invalidText = this._textStrings.pleaseSelectValidDate;
      this.defaultDate = null;
    }

    return inRange;
  }

  private async _clearInput(
    options: { reinitFlatpickr?: boolean } = { reinitFlatpickr: true }
  ) {
    if (this.rangeEditMode === DateRangeEditableMode.NONE) {
      return;
    }

    const newValue: [Date | null, Date | null] = [null, null];
    const preservedDateExists = false;

    this.value = newValue;
    this.defaultDate = null;

    if (preservedDateExists) {
      if (this.flatpickrInstance) {
        this.flatpickrInstance.clear();

        const datesToSet = newValue.filter(
          (date): date is Date => date !== null
        );
        if (datesToSet.length > 0) {
          this.flatpickrInstance.setDate(datesToSet, true);
        }
      }

      this.updateFormValue();
    } else {
      await clearFlatpickrInput(
        this.flatpickrInstance,
        this._inputEl ?? undefined,
        () => {
          this.updateFormValue();
        }
      );
    }

    this.updateSelectedDateRangeAria([]);

    emitValue(this, 'on-change', {
      dates: this.value,
      dateObjects: this.value,
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
    if (this._isDestroyed) {
      return;
    }

    if (!this._inputEl || !this._inputEl.isConnected) {
      console.warn(
        'Cannot initialize Flatpickr: input element not available or not connected to DOM'
      );
      return;
    }

    if (!this.dateFormat) {
      console.warn('Date format not set, using default Y-m-d');
      this.dateFormat = 'Y-m-d';
    }

    try {
      this.flatpickrInstance?.destroy();
      this.flatpickrInstance = await initializeSingleAnchorFlatpickr({
        inputEl: this._inputEl,
        getFlatpickrOptions: () => this.getComponentFlatpickrOptions(),
        setCalendarAttributes: (instance) => {
          try {
            if (!instance?.calendarContainer) {
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
        setInitialDates: () => this.setInitialDates(),
      });

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
    if (!this.dateFormat) {
      this.dateFormat = 'Y-m-d';
    }

    if (!this._inputEl) {
      return {};
    }

    const container = getModalContainer(this);

    let effectiveDefaultDate: Date[] | undefined;

    const [start, end] = this.value ?? [null, null];

    if (start instanceof Date || end instanceof Date) {
      const dates: Date[] = [];
      if (start instanceof Date) dates.push(start);
      if (end instanceof Date) dates.push(end);
      if (dates.length > 0) {
        effectiveDefaultDate = dates;
      }
    } else if (Array.isArray(this.defaultDate) && this.defaultDate.length > 0) {
      const processed = this.processDefaultDates(this.defaultDate);
      if (processed.length > 0) {
        effectiveDefaultDate = processed.slice(0, 2);
      }
    }

    const options = await getFlatpickrOptions({
      locale: this.locale || 'en',
      dateFormat: this.dateFormat,
      defaultDate: effectiveDefaultDate,
      enableTime: this._enableTime,
      twentyFourHourFormat: this.twentyFourHourFormat ?? undefined,
      inputEl: this._inputEl,
      minDate: this.minDate,
      maxDate: this.maxDate,
      enable: this.enable,
      disable: this._processedDisableDates,
      mode: 'range',
      closeOnSelect: false,
      allowInput: this.allowManualInput,
      loadLocale,
      onOpen: this.handleOpen.bind(this),
      onClose: this.handleClose.bind(this),
      onChange: this.handleDateChange.bind(this),
      appendTo: container,
      noCalendar: false,
      static: this.staticPosition,
    });

    const origOnOpen = options.onOpen;
    options.onOpen = (selectedDates, dateStr, instance) => {
      if (typeof origOnOpen === 'function') {
        origOnOpen(selectedDates, dateStr, instance);
      } else if (Array.isArray(origOnOpen)) {
        origOnOpen.forEach((fn) => fn(selectedDates, dateStr, instance));
      }

      setTimeout(() => {
        const firstDay = instance.calendarContainer.querySelector<HTMLElement>(
          '.flatpickr-day:not(.flatpickr-disabled)'
        );
        if (firstDay) firstDay.focus();
      }, 0);
    };

    const origOnReady = options.onReady;
    options.onReady = (_sel, _str, instance) => {
      if (typeof origOnReady === 'function') {
        origOnReady(_sel, _str, instance);
      } else if (Array.isArray(origOnReady)) {
        origOnReady.forEach((fn) => fn(_sel, _str, instance));
      }

      const handler = (e: KeyboardEvent) => {
        if (e.key !== 'Enter') return;

        const target = e.target as HTMLElement & { dateObj?: Date };

        if (
          !target.classList.contains('flatpickr-day') ||
          target.classList.contains('flatpickr-disabled') ||
          !target.dateObj
        ) {
          return;
        }

        e.preventDefault();

        const sel = instance.selectedDates;

        if (sel.length === 0) {
          instance.setDate([target.dateObj], true);
        } else if (sel.length === 1) {
          instance.setDate([sel[0], target.dateObj], true);
          instance.close();
        }
      };

      instance.calendarContainer.addEventListener('keydown', handler);
    };

    if (this.rangeEditMode !== DateRangeEditableMode.BOTH) {
      return applyDateRangeEditingRestrictions(
        options,
        this.rangeEditMode,
        this.value,
        {
          lockedStartDate: this._textStrings.lockedStartDate,
          lockedEndDate: this._textStrings.lockedEndDate,
          dateLocked: this._textStrings.dateLocked,
          dateNotAvailable: this._textStrings.dateNotAvailable,
          dateInSelectedRange: this._textStrings.dateInSelectedRange,
        }
      );
    }

    return options;
  }

  public setInitialDates() {
    if (!this.flatpickrInstance) return;

    try {
      if (!this.dateFormat) {
        this.dateFormat = 'Y-m-d';
      }

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

  public async handleDateChange(selectedDates: Date[], dateStr: string) {
    this._hasInteracted = true;

    if (this._isClearing) return;

    if (selectedDates.length === 0) {
      this.value = [null, null];
      if (this._inputEl) {
        this._inputEl.value = '';
        this.updateFormValue();
      }
      emitValue(this, 'on-change', {
        dates: this.value,
        dateObjects: this.value,
        dateString: this._inputEl?.value,
        source: 'clear',
      });
    } else if (selectedDates.length === 1) {
      this.value = [selectedDates[0], null];

      if (this._inputEl) {
        this._inputEl.value = dateStr;
        this.updateFormValue();
      }

      emitValue(this, 'on-change', {
        dates: [selectedDates[0].toISOString()],
        dateObjects: [selectedDates[0], null],
        dateString: dateStr,
        source: 'date-selection',
      });
    } else {
      this.value = [selectedDates[0], selectedDates[1]];
      const iso = selectedDates.map((d) => d.toISOString());
      const display = this.flatpickrInstance!.input.value;
      if (this._inputEl) {
        this._inputEl.value = display;
        this.updateFormValue();
      }
      emitValue(this, 'on-change', {
        dates: iso,
        dateObjects: selectedDates,
        dateString: display,
        source: 'date-selection',
      });
    }

    this.updateSelectedDateRangeAria(selectedDates);
    this._validate(true, false);
  }

  private updateSelectedDateRangeAria(selectedDates: Date[]) {
    if (!this._inputEl) return;
    const announcer = this.shadowRoot?.getElementById(
      `${this._inputEl.id}-announcer`
    );

    if (!announcer) return;

    let announcement = '';

    if (selectedDates.length === 0) {
      announcement = this._textStrings.noDateSelected;
    } else if (selectedDates.length === 1) {
      announcement = this._textStrings.startDateSelected.replace(
        '{0}',
        selectedDates[0].toLocaleDateString(this.locale)
      );
    } else {
      announcement = this._textStrings.dateRangeSelected
        .replace('{0}', selectedDates[0].toLocaleDateString(this.locale))
        .replace('{1}', selectedDates[1].toLocaleDateString(this.locale));
    }

    announcer.textContent = announcement;
  }

  private setShouldFlatpickrOpen(value: boolean) {
    this._shouldFlatpickrOpen = value;
  }

  private closeFlatpickr() {
    this.flatpickrInstance?.close();
  }

  private onSuppressLabelInteraction(event: Event) {
    event.stopPropagation();
    this.setShouldFlatpickrOpen(false);
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
    if (!this._inputEl || !(this._inputEl instanceof HTMLInputElement)) return;

    if (this.dateRangePickerDisabled) {
      this._internals.setValidity({}, '', this._inputEl);
      this._isInvalid = false;
      this._internalValidationMsg = '';
      return;
    }

    if (interacted) {
      this._hasInteracted = true;
    }

    const shouldShowValidationErrors =
      this._hasInteracted || report || !!this.invalidText;

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

    this._isInvalid = !isValid && shouldShowValidationErrors;
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

    this.updateSelectedDateRangeAria([]);
  }

  public getValue(): [Date | null, Date | null] {
    if (this.flatpickrInstance) {
      const selected = this.flatpickrInstance.selectedDates;

      const start = selected[0] ?? null;
      const end = selected[1] ?? null;

      return [start, end];
    }

    return this.value;
  }

  public setValue(newValue: [Date | null, Date | null]): void {
    const isClear =
      !newValue ||
      (Array.isArray(newValue) && newValue.every((d) => d === null));

    this._isClearing = isClear;

    try {
      if (this.flatpickrInstance) {
        if (isClear) {
          this.flatpickrInstance.clear();
        } else {
          const datesToSet = newValue.filter(
            (d): d is Date => d instanceof Date
          );
          this.flatpickrInstance.setDate(datesToSet, true);
        }

        const selected = this.flatpickrInstance.selectedDates;
        const start = selected[0] ?? null;
        const end = selected[1] ?? null;

        this.value = [start, end];

        if (this._inputEl) {
          if (isClear) {
            this._inputEl.value = '';
          } else {
            this._inputEl.value = this.flatpickrInstance.input.value;
          }
          this.updateFormValue();
        }

        if (isClear) {
          this.updateSelectedDateRangeAria([]);
        } else {
          this.updateSelectedDateRangeAria(selected);
        }
      } else {
        this.value = newValue;
      }

      this.requestUpdate('value');
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
