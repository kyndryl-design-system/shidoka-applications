import { html, LitElement, PropertyValues, unsafeCSS } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { FormMixin } from '../../../common/mixins/form-input';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { langsArray } from '../../../common/flatpickrLangs';
import { DateRangeEditableMode } from '../../../common/helpers/flatpickr';
import {
  injectFlatpickrStyles,
  initializeSingleAnchorFlatpickr,
  initializeMultiAnchorFlatpickr,
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
import flatpickr from 'flatpickr';
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
  startLabel: 'Start Date',
  endLabel: 'End Date',
};

/**
 * Date Range Picker: uses Flatpickr library, range picker implementation -- `https://flatpickr.js.org/examples/#range-calendar`
 * @fires on-change - Captures the input event and emits the selected value and original event details.
 * @slot tooltip - Slot for tooltip.
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

  /** Controls which parts of the date range are editable.
   * Possible values:
   * - "both" (default): Both start and end dates can be edited
   * - "start": Only the start date can be edited, end date is locked once set
   * - "end": Only the end date can be edited, start date is locked once set
   * - "none": Neither date can be edited once set (similar to readonly)
   */
  @property({ type: String })
  accessor rangeEditMode: DateRangeEditableMode = DateRangeEditableMode.BOTH;

  /** Sets default error message. */
  @property({ type: String })
  accessor defaultErrorMessage = '';

  /**
   * Sets the date/time value for the component.
   *
   * For controlled usage patterns, this property allows parent components to directly control the selected date.
   * When used together with defaultDate, value takes precedence if both are provided.
   *
   * In uncontrolled usage, this is populated automatically based on defaultDate and user selections.
   * @internal
   */
  override value: [Date | null, Date | null] = [null, null];

  /** Sets validation warning messaging. */
  @property({ type: String })
  accessor warnText = '';

  /** Sets flatpickr options setting to disable specific dates. Accepts array of dates in Y-m-d format, timestamps, or Date objects. */
  @property({ type: Array })
  accessor disable: (string | number | Date)[] = [];

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

  /** Enables multi-input mode with separate start and end date inputs. */
  @property({ type: Boolean })
  accessor multiInput = false;

  /** Show only one month in the calendar instead of two. Defaults to false (2 months). */
  @property({ type: Boolean })
  accessor showSingleMonth = false;

  /** Determines whether the calendar UI should close when date range is selected. */
  @property({ type: Boolean })
  accessor closeOnSelection = false;

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
  private accessor _inputEl: HTMLInputElement | any;

  /**
   * Queries the end input DOM element for multi-input mode.
   * @internal
   */
  @query('input[data-end-input]')
  private accessor _endInputEl: HTMLInputElement | any;

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

  /** Store submit event listener reference for cleanup
   * @internal
   */
  private _submitListener: ((e: Event) => void) | null = null;

  private debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: number | null = null;

    return (...args: Parameters<T>) => {
      if (timeout !== null) {
        window.clearTimeout(timeout);
      }

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
    const descriptionId = this.name ?? '';

    const showClearButton =
      this.hasValue() &&
      !this.readonly &&
      this.rangeEditMode !== DateRangeEditableMode.START &&
      this.rangeEditMode !== DateRangeEditableMode.END &&
      this.rangeEditMode !== DateRangeEditableMode.NONE;

    if (this.multiInput) {
      return this.renderMultiInput(
        errorId,
        warningId,
        anchorId,
        descriptionId,
        showClearButton
      );
    } else {
      return this.renderSingleInput(
        errorId,
        warningId,
        anchorId,
        descriptionId,
        showClearButton
      );
    }
  }

  private renderSingleInput(
    errorId: string,
    warningId: string,
    anchorId: string,
    descriptionId: string,
    showClearButton: boolean
  ) {
    const placeholder = getPlaceholder(this.dateFormat, true);
    const hasFixedDates =
      this.rangeEditMode !== DateRangeEditableMode.BOTH &&
      (this.value[0] !== null || this.value[1] !== null);
    const isInputDisabled = this.dateRangePickerDisabled;
    const isInputReadonly = this.readonly || hasFixedDates;

    return html`
      <div class=${classMap(this.getDateRangePickerClasses())}>
        <div
          class="label-text"
          @mousedown=${this.preventFlatpickrOpen}
          @click=${this.preventFlatpickrOpen}
          aria-disabled=${this.dateRangePickerDisabled ? 'true' : 'false'}
          id=${`label-${anchorId}`}
        >
          ${this.required
            ? html`<abbr
                class="required"
                title=${this._textStrings.requiredText}
                role="img"
                aria-label=${this._textStrings.requiredText}
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
              'is-readonly': isInputReadonly,
            })}"
            type="text"
            id=${anchorId}
            name=${this.name}
            placeholder=${placeholder}
            ?disabled=${isInputDisabled}
            ?readonly=${isInputReadonly}
            ?required=${this.required}
            ?invalid=${this._isInvalid}
            aria-invalid=${this._isInvalid ? 'true' : 'false'}
            aria-labelledby=${`label-${anchorId}`}
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
                <span style="display:flex;" slot="icon"
                  >${unsafeSVG(clearIcon)}</span
                >
              </kyn-button>`
            : html`<span
                class="input-icon ${this.dateRangePickerDisabled
                  ? 'is-disabled'
                  : ''}"
                aria-hidden="true"
                @click=${this.handleInputClickEvent}
                >${unsafeSVG(calendarIcon)}</span
              >`}
        </div>

        ${this.caption
          ? html`<div
              id=${descriptionId}
              class="caption"
              aria-disabled=${this.dateRangePickerDisabled ? 'true' : 'false'}
              @mousedown=${this.preventFlatpickrOpen}
              @click=${this.preventFlatpickrOpen}
            >
              ${this.caption}
            </div>`
          : ''}
        ${this.renderValidationMessage(errorId, warningId)}
      </div>
    `;
  }

  private renderMultiInput(
    errorId: string,
    warningId: string,
    anchorId: string,
    descriptionId: string,
    showClearButton: boolean
  ) {
    const startPlaceholder = getPlaceholder(this.dateFormat, false);
    const endPlaceholder = getPlaceholder(this.dateFormat, false);
    const startId = `${anchorId}-start`;
    const endId = `${anchorId}-end`;

    const hasStartDate = this.value[0] !== null;
    const hasEndDate = this.value[1] !== null;

    const isStartInputDisabled = this.dateRangePickerDisabled;
    const isEndInputDisabled = this.dateRangePickerDisabled;

    const hasStartFixedDates =
      (this.rangeEditMode === DateRangeEditableMode.END ||
        this.rangeEditMode === DateRangeEditableMode.NONE) &&
      this.value[0] !== null;
    const hasEndFixedDates =
      (this.rangeEditMode === DateRangeEditableMode.START ||
        this.rangeEditMode === DateRangeEditableMode.NONE) &&
      this.value[1] !== null;

    const isStartInputReadonly = this.readonly || hasStartFixedDates;
    const isEndInputReadonly = this.readonly || hasEndFixedDates;

    const showStartClear =
      hasStartDate &&
      !this.readonly &&
      this.rangeEditMode !== DateRangeEditableMode.END &&
      this.rangeEditMode !== DateRangeEditableMode.NONE;

    const showEndClear =
      hasEndDate &&
      !this.readonly &&
      this.rangeEditMode !== DateRangeEditableMode.START &&
      this.rangeEditMode !== DateRangeEditableMode.NONE;

    return html`
      <div class=${classMap(this.getDateRangePickerClasses())}>
        ${this.label
          ? html`<div
              class="label-text"
              @mousedown=${this.preventFlatpickrOpen}
              @click=${this.preventFlatpickrOpen}
              aria-disabled=${this.dateRangePickerDisabled ? 'true' : 'false'}
              id=${`label-${anchorId}`}
            >
              ${this.required
                ? html`<abbr
                    class="required"
                    title=${this._textStrings.requiredText}
                    role="img"
                    aria-label=${this._textStrings.requiredText}
                    >*</abbr
                  >`
                : null}
              ${this.label}
              <slot name="tooltip"></slot>
            </div>`
          : null}

        <div class="multi-input-wrapper">
          <div class="input-group">
            <label
              class="input-label"
              for=${startId}
              @mousedown=${this.preventFlatpickrOpen}
              @click=${this.preventFlatpickrOpen}
            >
              ${this._textStrings.startLabel}
            </label>
            <div class="input-wrapper">
              <input
                class="${classMap({
                  [`size--${this.size}`]: true,
                  'input-custom': true,
                  'is-readonly': isStartInputReadonly,
                })}"
                type="text"
                id=${startId}
                name=${this.name ? `${this.name}-start` : 'start'}
                placeholder=${startPlaceholder}
                ?disabled=${isStartInputDisabled}
                ?readonly=${isStartInputReadonly}
                ?required=${this.required}
                ?invalid=${this._isInvalid}
                aria-invalid=${this._isInvalid ? 'true' : 'false'}
                aria-labelledby=${`label-${anchorId}`}
                @click=${this.handleInputClickEvent}
                @focus=${this.handleInputFocusEvent}
                @keydown=${hasStartFixedDates
                  ? this.preventAllTextInteraction
                  : undefined}
                @keyup=${hasStartFixedDates
                  ? this.preventAllTextInteraction
                  : undefined}
                @input=${hasStartFixedDates
                  ? this.preventAllTextInteraction
                  : undefined}
                @mousedown=${hasStartFixedDates
                  ? this.preventTextSelection
                  : undefined}
                @mouseup=${hasStartFixedDates
                  ? this.preventTextSelection
                  : undefined}
              />
              ${showStartClear && showClearButton
                ? html`<kyn-button
                    ?disabled=${this.dateRangePickerDisabled}
                    class="clear-button"
                    kind="ghost"
                    size="small"
                    description="Clear start date"
                    @click=${this._handleClearStart}
                  >
                    <span style="display:flex;" slot="icon"
                      >${unsafeSVG(clearIcon)}</span
                    >
                  </kyn-button>`
                : html`<span
                    class="input-icon ${this.dateRangePickerDisabled
                      ? 'is-disabled'
                      : ''}"
                    aria-hidden="true"
                    @click=${this.handleInputClickEvent}
                    >${unsafeSVG(calendarIcon)}</span
                  >`}
            </div>
          </div>

          <div class="input-group">
            <label
              class="input-label"
              for=${endId}
              @mousedown=${this.preventFlatpickrOpen}
              @click=${this.preventFlatpickrOpen}
            >
              ${this._textStrings.endLabel}
            </label>
            <div class="input-wrapper">
              <input
                class="${classMap({
                  [`size--${this.size}`]: true,
                  'input-custom': true,
                  'is-readonly': isEndInputReadonly,
                })}"
                type="text"
                id=${endId}
                name=${this.name ? `${this.name}-end` : 'end'}
                placeholder=${endPlaceholder}
                data-end-input
                ?disabled=${isEndInputDisabled}
                ?readonly=${isEndInputReadonly}
                ?required=${this.required}
                ?invalid=${this._isInvalid}
                aria-invalid=${this._isInvalid ? 'true' : 'false'}
                aria-labelledby=${`label-${anchorId}`}
                @click=${this.handleEndInputClickEvent}
                @focus=${this.handleEndInputFocusEvent}
                @keydown=${hasEndFixedDates
                  ? this.preventAllTextInteraction
                  : undefined}
                @keyup=${hasEndFixedDates
                  ? this.preventAllTextInteraction
                  : undefined}
                @input=${hasEndFixedDates
                  ? this.preventAllTextInteraction
                  : undefined}
                @mousedown=${hasEndFixedDates
                  ? this.preventTextSelection
                  : undefined}
                @mouseup=${hasEndFixedDates
                  ? this.preventTextSelection
                  : undefined}
              />
              ${showEndClear && showClearButton
                ? html`<kyn-button
                    ?disabled=${this.dateRangePickerDisabled}
                    class="clear-button"
                    kind="ghost"
                    size="small"
                    description="Clear end date"
                    @click=${this._handleClearEnd}
                  >
                    <span style="display:flex;" slot="icon"
                      >${unsafeSVG(clearIcon)}</span
                    >
                  </kyn-button>`
                : html`<span
                    class="input-icon ${this.dateRangePickerDisabled
                      ? 'is-disabled'
                      : ''}"
                    aria-hidden="true"
                    @click=${this.handleEndInputClickEvent}
                    >${unsafeSVG(calendarIcon)}</span
                  >`}
            </div>
          </div>
        </div>

        ${this.caption
          ? html`<div
              id=${descriptionId}
              class="caption"
              aria-disabled=${this.dateRangePickerDisabled ? 'true' : 'false'}
              @mousedown=${this.preventFlatpickrOpen}
              @click=${this.preventFlatpickrOpen}
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
      'date-range-picker__single-month': this.showSingleMonth,
      'date-range-picker__multi-month': !this.showSingleMonth,
      'date-range-picker__multi-input': this.multiInput,
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

      if (parsedDates.length === 2 && parsedDates[1] < parsedDates[0]) {
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

      let hours = 0,
        minutes = 0,
        seconds = 0;
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
        (Array.isArray(this.value) &&
          this.value.length === 2 &&
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
      this._textStrings = { ..._defaultTextStrings, ...this.textStrings };

      if (
        this.flatpickrInstance &&
        this.rangeEditMode !== DateRangeEditableMode.BOTH
      ) {
        this.updateFlatpickrOptions();
      }
    }

    if (
      changedProperties.has('multiInput') ||
      changedProperties.has('showSingleMonth') ||
      changedProperties.has('closeOnSelection')
    ) {
      if (this.flatpickrInstance) {
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
      return;
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

    if (changedProperties.has('defaultDate')) {
      if (
        this.defaultDate &&
        (!this.value || this.value.every((v) => v === null))
      ) {
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
    if (!this._inputEl) {
      return;
    }

    try {
      await this.initializeFlatpickr();
    } catch (error) {
      console.error('Error setting up flatpickr:', error);
    }
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
      await clearFlatpickrInput(this.flatpickrInstance, this._inputEl, () => {
        this.updateFormValue();
      });
    }

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

  private async _handleClearStart(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this._isClearing = true;
    try {
      const newValue: [Date | null, Date | null] = [null, this.value[1]];
      this.value = newValue;

      if (this.flatpickrInstance) {
        if (this.value[1]) {
          this.flatpickrInstance.setDate([this.value[1]], true);
        } else {
          this.flatpickrInstance.clear();
        }
        this.updateFormValue();
      }

      emitValue(this, 'on-change', {
        dates: this.value,
        dateString: this._inputEl?.value,
        source: 'clear-start',
      });

      this._validate(true, false);
      await this.updateComplete;
    } finally {
      this._isClearing = false;
    }
  }

  private async _handleClearEnd(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this._isClearing = true;
    try {
      const newValue: [Date | null, Date | null] = [this.value[0], null];
      this.value = newValue;

      if (this.flatpickrInstance) {
        if (this.value[0]) {
          this.flatpickrInstance.setDate([this.value[0]], true);
        } else {
          this.flatpickrInstance.clear();
        }
        this.updateFormValue();
      }

      emitValue(this, 'on-change', {
        dates: this.value,
        dateString: this._inputEl?.value,
        source: 'clear-end',
      });

      this._validate(true, false);
      await this.updateComplete;
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

      if (this.multiInput && this._endInputEl) {
        this.flatpickrInstance = await initializeMultiAnchorFlatpickr({
          inputEl: this._inputEl,
          endinputEl: this._endInputEl,
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

              if (this.showSingleMonth) {
                instance.calendarContainer.classList.add(
                  'date-range-picker__single-month'
                );
              } else {
                instance.calendarContainer.classList.remove(
                  'date-range-picker__single-month'
                );
              }
            } catch (error) {
              console.warn('Error setting calendar attributes:', error);
            }
          },
          setInitialDates: () => this.setInitialDates(),
        });
      } else {
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

              if (this.showSingleMonth) {
                instance.calendarContainer.classList.add(
                  'date-range-picker__single-month'
                );
              } else {
                instance.calendarContainer.classList.remove(
                  'date-range-picker__single-month'
                );
              }
            } catch (error) {
              console.warn('Error setting calendar attributes:', error);
            }
          },
          setInitialDates: () => this.setInitialDates(),
        });
      }

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

  private normalizeDisable(
    raw: (string | number | Date | Function)[]
  ): (Date | Function)[] {
    return raw
      .map((d) => {
        if (typeof d === 'function') return d;
        if (d instanceof Date) return d;
        if (typeof d === 'number') return new Date(d);
        if (typeof d === 'string') {
          const parsed = flatpickr.parseDate(d, this.dateFormat);
          return parsed && !isNaN(parsed.getTime()) ? parsed : null;
        }
        return null;
      })
      .filter((d): d is Date | Function => d !== null);
  }

  public async getComponentFlatpickrOptions(): Promise<Partial<BaseOptions>> {
    if (!this.dateFormat) {
      this.dateFormat = 'Y-m-d';
    }

    const container = getModalContainer(this);
    const options = await getFlatpickrOptions({
      locale: this.locale || 'en',
      dateFormat: this.dateFormat,
      defaultDate: this.defaultDate ?? undefined,
      enableTime: this._enableTime,
      twentyFourHourFormat: this.twentyFourHourFormat ?? undefined,
      inputEl: this._inputEl!,
      minDate: this.minDate,
      maxDate: this.maxDate,
      enable: this.enable,
      disable: this.normalizeDisable(this.disable),
      mode: 'range',
      closeOnSelect: this.closeOnSelection,
      loadLocale,
      onOpen: this.handleOpen.bind(this),
      onClose: this.handleClose.bind(this),
      onChange: this.handleDateChange.bind(this),
      appendTo: container,
      noCalendar: false,
      static: this.staticPosition,
      showMonths: this.showSingleMonth ? 1 : 2,
    });

    const origOnOpen = options.onOpen;
    options.onOpen = (selectedDates, dateStr, instance) => {
      if (typeof origOnOpen === 'function') {
        origOnOpen(selectedDates, dateStr, instance);
      } else if (Array.isArray(origOnOpen)) {
        origOnOpen.forEach((fn) => fn(selectedDates, dateStr, instance));
      }
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
        const target = e.target as HTMLElement & { dateObj: Date };
        if (
          !target.classList.contains('flatpickr-day') ||
          target.classList.contains('flatpickr-disabled')
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

      const calendarDays = instance.calendarContainer.querySelectorAll(
        '.flatpickr-day:not(.flatpickr-disabled)'
      );
      calendarDays.forEach((day: Element) => {
        const dayElement = day as HTMLElement;
        if (!dayElement.hasAttribute('tabindex')) {
          dayElement.setAttribute('tabindex', '-1');
        }
      });

      const navButtons = instance.calendarContainer.querySelectorAll(
        '.flatpickr-prev-month, .flatpickr-next-month'
      );
      navButtons.forEach((button: Element) => {
        const buttonElement = button as HTMLElement;
        if (!buttonElement.hasAttribute('tabindex')) {
          buttonElement.setAttribute('tabindex', '0');
        }
      });
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
          this.flatpickrInstance.setDate(validDates, false);
          this.flatpickrInstance.redraw();
          this.value = validDates as [Date, Date];
          this._inputEl!.value = this.flatpickrInstance.input.value;
          this.updateFormValue();
        } else if (validDates.length === 1) {
          this.flatpickrInstance.setDate([validDates[0]], false);
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
          this.flatpickrInstance.setDate(validDates, false);
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
      emitValue(this, 'on-change', { dates: this.value, source: 'clear' });
    } else if (selectedDates.length === 1) {
      this.value = [selectedDates[0], null];

      if (this._inputEl) {
        this._inputEl.value = dateStr;
        this.updateFormValue();
      }

      emitValue(this, 'on-change', {
        dates: [selectedDates[0].toISOString()],
        dateString: dateStr,
        source: 'date-selection',
      });
    } else {
      this.value = [selectedDates[0], selectedDates[1]];
      const iso = selectedDates.map((d) => d.toISOString());
      const display = this.flatpickrInstance!.input.value;
      emitValue(this, 'on-change', {
        dates: iso,
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

  private preventFlatpickrOpen(event: Event) {
    preventFlatpickrOpen(event, this.setShouldFlatpickrOpen.bind(this));
  }

  private preventTextSelection(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    return false;
  }

  private preventAllTextInteraction(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    if (event.type === 'input' && event.target instanceof HTMLInputElement) {
      const input = event.target;
      if (this.flatpickrInstance) {
        input.value = this.flatpickrInstance.input.value;
      }
    }

    return false;
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

  private handleEndInputClickEvent() {
    this.handleInputClickEvent();
  }

  private handleEndInputFocusEvent() {
    this.handleInputFocusEvent();
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
  }

  public getValue(): [Date | null, Date | null] {
    return this.value;
  }

  public setValue(newValue: [Date | null, Date | null]): void {
    this.value = newValue;
    this.requestUpdate();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-date-range-picker': DateRangePicker;
  }
}
