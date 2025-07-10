import { html, LitElement, PropertyValues, TemplateResult } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { FormMixin } from '../mixins/form-input';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { langsArray } from '../flatpickrLangs';
import {
  initializeSingleAnchorFlatpickr,
  getFlatpickrOptions,
  preventFlatpickrOpen,
  handleInputClick,
  handleInputFocus,
  setCalendarAttributes,
  loadLocale,
  hideEmptyYear,
  getModalContainer,
  clearFlatpickrInput,
  updateEnableTime,
  emitValue,
} from '../helpers/flatpickr';
import '../../components/reusable/button';

import flatpickr from 'flatpickr';
import { BaseOptions } from 'flatpickr/dist/types/options';

import errorIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/close-filled.svg';
import clearIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/close-simple.svg';

type SupportedLocale = (typeof langsArray)[number];

export interface FlatpickrTextStrings {
  requiredText: string;
  clearAll: string;
  pleaseSelectDate: string;
  noDateSelected: string;
  pleaseSelectValidDate: string;
  invalidDateFormat?: string;
  errorProcessing?: string;
  pleaseSelectBothDates?: string;
  noTimeSelected?: string;
  startDateSelected?: string;
  invalidDateRange?: string;
  dateRangeSelected?: string;
  lockedStartDate?: string;
  lockedEndDate?: string;
  dateLocked?: string;
  dateNotAvailable?: string;
  dateInSelectedRange?: string;
  timepickerPlaceholder?: string;
  startLabel?: string;
  endLabel?: string;
}

export const defaultTextStrings: FlatpickrTextStrings = {
  requiredText: 'Required',
  clearAll: 'Clear',
  pleaseSelectDate: 'Please select a date',
  noDateSelected: 'No date selected',
  pleaseSelectValidDate: 'Please select a valid date',
  invalidDateFormat: 'Invalid date format provided',
  errorProcessing: 'Error processing date',
  pleaseSelectBothDates: 'Please select a start and end date.',
  noTimeSelected: 'No time selected',
  startDateSelected: 'Start date selected: {0}. Please select end date.',
  invalidDateRange:
    'Invalid date range: End date cannot be earlier than start date',
  dateRangeSelected: 'Selected date range: {0} to {1}',
  lockedStartDate: 'Start date is locked',
  lockedEndDate: 'End date is locked',
  dateLocked: 'Date is locked',
  dateNotAvailable: 'Date is not available',
  dateInSelectedRange: 'Date is in selected range',
  timepickerPlaceholder: '—— : ——',
  startLabel: 'Start Date',
  endLabel: 'End Date',
};

export interface FlatpickrConfig {
  mode: 'single' | 'multiple' | 'range' | 'time';
  enableTime?: boolean;
  noCalendar?: boolean;
  isDateRange?: boolean;
}

export abstract class FlatpickrBase extends FormMixin(LitElement) {
  /** Label text. */
  @property({ type: String })
  accessor label = '';

  /** Sets desired locale and, if supported, dynamically loads language lib */
  @property({ type: String })
  accessor locale: SupportedLocale | string = 'en';

  /** Sets flatpickr value to define how the date will be displayed in the input box (ex: `Y-m-d H:i`). */
  @property({ type: String })
  accessor dateFormat = 'Y-m-d';

  /** Sets default error message. */
  @property({ type: String })
  accessor defaultErrorMessage = '';

  /** Sets validation warning messaging. */
  @property({ type: String })
  accessor warnText = '';

  /** Sets flatpickr options setting to disable specific dates. Accepts array of dates in Y-m-d format, timestamps, or Date objects. */
  @property({ type: Array })
  accessor disable: (string | number | Date)[] = [];

  /** Sets flatpickr options setting to enable specific dates. */
  @property({ type: Array })
  accessor enable: (string | number | Date)[] = [];

  /** Sets caption to be displayed under primary picker elements. */
  @property({ type: String })
  accessor caption = '';

  /** Sets form input value to required. */
  @property({ type: Boolean })
  accessor required = false;

  /** Show only one month in the calendar instead of two. */
  @property({ type: Boolean })
  accessor showSingleMonth = false;

  /** Enables multi-input mode with separate start/end inputs. */
  @property({ type: Boolean })
  accessor multiInput = false;

  /** Initial selected dates for uncontrolled usage. */
  @property({ type: Array })
  accessor defaultDate: string | string[] | null = null;

  /** Input size. "sm", "md", or "lg". */
  @property({ type: String })
  accessor size = 'md';

  /** Sets entire form element to enabled/disabled. */
  @property({ type: Boolean })
  accessor disabled = false;

  /** Sets entire form element to readonly. */
  @property({ type: Boolean })
  accessor readonly = false;

  /** Sets 24 hour formatting true/false.
   * Defaults to 12H for all `en-*` locales and 24H for all other locales.
   */
  @property({ type: Boolean })
  accessor twentyFourHourFormat: boolean | null = null;

  /** Sets lower boundary of date selection. */
  @property({ type: String })
  accessor minDate: string | number | Date = '';

  /** Sets upper boundary of date selection. */
  @property({ type: String })
  accessor maxDate: string | number | Date = '';

  /** Sets lower boundary of time selection. */
  @property({ type: String })
  accessor minTime: string | number | Date = '';

  /** Sets upper boundary of time selection. */
  @property({ type: String })
  accessor maxTime: string | number | Date = '';

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

  /** Customizable text strings. */
  @property({ type: Object })
  accessor textStrings: Partial<FlatpickrTextStrings> = {};

  /** Internal text strings. */
  @state()
  accessor _textStrings: FlatpickrTextStrings = { ...defaultTextStrings };

  /** Sets flatpickr enableTime value based on detected dateFormat. */
  @state()
  protected accessor _enableTime = false;

  /** Sets whether user has interacted with picker for error handling. */
  @state()
  protected accessor _hasInteracted = false;

  /** Flatpickr instantiation. */
  @state()
  protected accessor flatpickrInstance: flatpickr.Instance | undefined;

  /** Queries the input DOM element. */
  @query('input')
  protected accessor _inputEl: HTMLInputElement | any;

  /** Tracks if we're in a clear operation to prevent duplicate events */
  @state()
  protected accessor _isClearing = false;

  /** Control flag to prevent Flatpickr from opening when clicking caption, error, label, or warning elements. */
  @state()
  protected accessor _shouldFlatpickrOpen = false;

  /** Track initialization state */
  protected _initialized = false;

  /** Track destroyed state */
  protected _isDestroyed = false;

  /** Store submit event listener reference for cleanup */
  protected _submitListener: ((e: Event) => void) | null = null;

  /** Internal storage for processed disable dates */
  @state()
  protected accessor _processedDisableDates: (string | number | Date)[] = [];

  /** Configuration for picker type */
  protected abstract config: FlatpickrConfig;

  protected debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: number | null = null;
    return (...args: Parameters<T>) => {
      if (timeout) window.clearTimeout(timeout);
      timeout = window.setTimeout(() => {
        func(...args);
        timeout = null;
      }, wait);
    };
  }

  protected debouncedUpdate = this.debounce(async () => {
    if (this.flatpickrInstance) await this.initializeFlatpickr();
  }, 100);

  override connectedCallback() {
    super.connectedCallback();
    this.addEventListener('change', this._onChange);
    this.addEventListener('reset', this._handleFormReset);

    if (this._internals.form) {
      this._submitListener = (e: Event) => {
        this._validate(true, true);
        if (!this._internals.checkValidity()) {
          e.preventDefault();
        }
      };
      this._internals.form.addEventListener('submit', this._submitListener);
    }
  }

  override disconnectedCallback() {
    this._isDestroyed = true;
    super.disconnectedCallback();
    this.removeEventListener('change', this._onChange);
    this.removeEventListener('reset', this._handleFormReset);

    if (this._internals.form && this._submitListener) {
      this._internals.form.removeEventListener('submit', this._submitListener);
      this._submitListener = null;
    }

    if (this.flatpickrInstance) {
      this.flatpickrInstance.destroy();
      this.flatpickrInstance = undefined;
    }
  }

  protected abstract hasValue(): boolean;
  protected abstract updateFormValue(): void;
  protected abstract getComponentFlatpickrOptions(): Promise<
    Partial<BaseOptions>
  >;
  protected abstract setInitialDates(instance?: flatpickr.Instance): void;
  protected abstract handleDateChange(
    selectedDates: Date[],
    dateStr: string
  ): Promise<void>;
  protected abstract getPickerIcon(): string;
  protected abstract getPickerClasses(): Record<string, boolean>;
  protected abstract clearValue(): Promise<void>;
  protected abstract emitChangeEvent(source?: string): void;
  protected abstract resetValue(): void;
  protected abstract getAriaLabel(): string;

  override async firstUpdated(changedProperties: PropertyValues) {
    super.firstUpdated(changedProperties);
    if (!this._initialized) {
      this._initialized = true;
      await this.updateComplete;
      this.setupAnchor();
    }
  }

  override updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    if (changedProperties.has('textStrings')) {
      this._textStrings = { ...defaultTextStrings, ...this.textStrings };
    }

    if (changedProperties.has('disable')) {
      if (Array.isArray(this.disable)) {
        this._processedDisableDates = this.disable.map((date) => {
          if (date instanceof Date) return date;
          if (typeof date === 'number') return new Date(date);
          if (typeof date === 'string') {
            const [y, m, d] = date.split('-').map(Number);
            return !isNaN(y) && !isNaN(m) && !isNaN(d)
              ? new Date(y, m - 1, d)
              : date;
          }
          return date;
        });
      } else {
        this._processedDisableDates = [];
      }
      this.flatpickrInstance && this.debouncedUpdate();
    }

    if (
      changedProperties.has('dateFormat') ||
      changedProperties.has('minDate') ||
      changedProperties.has('maxDate') ||
      changedProperties.has('locale') ||
      changedProperties.has('twentyFourHourFormat')
    ) {
      this._enableTime =
        this.config.enableTime || updateEnableTime(this.dateFormat);
      if (this.flatpickrInstance && this._initialized && !this._isClearing) {
        this.debouncedUpdate();
      }
    }

    if (
      (changedProperties.has('disabled') && this.disabled) ||
      (changedProperties.has('readonly') && this.readonly)
    ) {
      this.flatpickrInstance?.close();
    }
  }

  protected generateRandomId(prefix: string): string {
    return `${prefix}-${Math.random().toString(36).slice(2, 11)}`;
  }

  protected renderBaseStructure(
    anchorId: string,
    placeholder: string,
    showClearButton = true
  ): TemplateResult {
    const errorId = `${this.name}-error-message`;
    const warningId = `${this.name}-warning-message`;
    const descId = this.name ?? '';

    return html`
      <div class=${classMap(this.getPickerClasses())}>
        <div
          class="label-text"
          @mousedown=${this.preventFlatpickrOpen}
          @click=${this.preventFlatpickrOpen}
          ?disabled=${this.disabled}
          id=${`label-${anchorId}`}
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
            ?disabled=${this.disabled}
            ?readonly=${this.readonly}
            ?required=${this.required}
            ?invalid=${this._isInvalid}
            aria-invalid=${this._isInvalid ? 'true' : 'false'}
            aria-labelledby=${`label-${anchorId}`}
            @click=${this.handleInputClickEvent}
            @focus=${this.handleInputFocusEvent}
          />

          ${showClearButton && this.hasValue()
            ? html`
                <kyn-button
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
                  class="input-icon ${this.disabled ? 'is-disabled' : ''}"
                  aria-hidden="true"
                  @click=${this.handleInputClickEvent}
                >
                  ${unsafeSVG(this.getPickerIcon())}
                </span>
              `}
        </div>

        ${this.caption
          ? html`<div
              id=${descId}
              class="caption"
              aria-disabled=${this.disabled}
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

  protected renderValidationMessage(
    errorId: string,
    warningId: string
  ): TemplateResult | null {
    if (this.disabled) return null;

    if (this.invalidText || (this._isInvalid && this._hasInteracted)) {
      return html`<div
        id=${errorId}
        class="error error-text"
        role="alert"
        title=${this.errorTitle || 'Error'}
        @mousedown=${this.preventFlatpickrOpen}
        @click=${this.preventFlatpickrOpen}
      >
        <span
          class="error-icon"
          role="img"
          aria-label=${this.errorAriaLabel || 'Error message icon'}
          >${unsafeSVG(errorIcon)}</span
        >${this.invalidText ||
        this._internalValidationMsg ||
        this.defaultErrorMessage}
      </div>`;
    }

    if (this.warnText) {
      return html`<div
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
      </div>`;
    }

    return null;
  }

  protected async setupAnchor() {
    if (!this._inputEl) {
      return;
    }

    try {
      await this.initializeFlatpickr();
    } catch (error) {
      console.error('Error setting up flatpickr:', error);
    }
  }

  protected async _handleClear(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    if (!this.flatpickrInstance) {
      console.warn('Cannot clear: Flatpickr instance not available');
      return;
    }

    this._isClearing = true;

    try {
      await this.clearValue();

      await clearFlatpickrInput(this.flatpickrInstance, this._inputEl, () => {
        this.updateFormValue();
      });

      this.emitChangeEvent('clear');
      this._validate(true, false);
      await this.updateComplete;
      await this.initializeFlatpickr();
      this.requestUpdate();
    } catch (error) {
      console.error('Error clearing picker:', error);
    } finally {
      this._isClearing = false;
    }
  }

  async initializeFlatpickr() {
    if (this._isDestroyed) {
      return;
    }

    if (!this._inputEl || !this._inputEl.isConnected) {
      console.warn(
        'Cannot initialize Flatpickr: input element not available or not connected to DOM'
      );
      return;
    }

    try {
      if (this.flatpickrInstance) {
        this.flatpickrInstance.destroy();
      }

      this.flatpickrInstance = await initializeSingleAnchorFlatpickr({
        inputEl: this._inputEl,
        getFlatpickrOptions: () => this.getComponentFlatpickrOptions(),
        setCalendarAttributes: (instance) => {
          try {
            const container = getModalContainer(this);
            const isInModal = container !== document.body;

            if (instance.calendarContainer && isInModal) {
              instance.calendarContainer.classList.add('container-modal');
              instance.calendarContainer.classList.remove('container-default');
            }

            setCalendarAttributes(instance, isInModal);

            if (instance.calendarContainer) {
              instance.calendarContainer.setAttribute(
                'aria-label',
                this.getAriaLabel()
              );
            }
          } catch (error) {
            console.error('Error setting calendar attributes:', error);
          }
        },
        setInitialDates: this.setInitialDates.bind(this),
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

  async updateFlatpickrOptions() {
    if (!this.flatpickrInstance) {
      console.warn('Cannot update options: Flatpickr instance not available');
      return;
    }
    await this.debouncedUpdate();
  }

  async handleOpen() {
    if (this.readonly) {
      this.flatpickrInstance?.close();
      return;
    }

    if (!this._shouldFlatpickrOpen) {
      this.flatpickrInstance?.close();
      this._shouldFlatpickrOpen = true;
      return;
    }

    this.flatpickrInstance?.open();
    this._shouldFlatpickrOpen = false;

    const cfg = this.flatpickrInstance!.config;
    if (cfg.minDate && cfg.maxDate) {
      const minY = new Date(cfg.minDate as any).getFullYear();
      const maxY = new Date(cfg.maxDate as any).getFullYear();
      const currentY = new Date().getFullYear();
      this.flatpickrInstance!.calendarContainer.classList.toggle(
        'single-year',
        minY === maxY && minY === currentY
      );
    }

    hideEmptyYear();
  }

  async handleClose() {
    this._validate(false, false);
    await this.updateComplete;

    if (!this.hasValue()) {
      this._hasInteracted = true;
    }
  }

  protected _validate(interacted: boolean, report: boolean) {
    if (!this._inputEl || !(this._inputEl instanceof HTMLInputElement)) return;

    if (this.disabled) {
      this._internals.setValidity({}, '', this._inputEl);
      this._isInvalid = false;
      this._internalValidationMsg = '';
      return;
    }

    if (interacted) {
      this._hasInteracted = true;
    }

    const isEmpty = !this._inputEl.value.trim() && !this.hasValue();
    const isRequired = this.required;

    let validity = this._inputEl.validity;
    let validationMessage = this._inputEl.validationMessage;

    if (isRequired && isEmpty) {
      validity = { ...validity, valueMissing: true };
      validationMessage =
        this.defaultErrorMessage || this._textStrings.pleaseSelectDate;
    }

    if (this.invalidText) {
      validity = { ...validity, customError: true };
      validationMessage = this.invalidText;
    }

    this._internals.setValidity(validity, validationMessage, this._inputEl);

    const isValid =
      !this.invalidText &&
      (!this._hasInteracted || !isEmpty || (isEmpty && !isRequired));

    this._isInvalid = !isValid && (this._hasInteracted || interacted);
    this._internalValidationMsg = validationMessage;

    if (report) {
      this._internals.reportValidity();
    }

    this.requestUpdate();
  }

  protected _onChange() {
    this._validate(true, false);
  }

  protected _handleFormReset() {
    this.resetValue();
    if (this.flatpickrInstance) {
      this.flatpickrInstance.clear();
    }
    this._hasInteracted = false;
  }

  protected setShouldFlatpickrOpen(value: boolean) {
    this._shouldFlatpickrOpen = value;
  }

  protected closeFlatpickr() {
    this.flatpickrInstance?.close();
  }

  protected preventFlatpickrOpen(event: Event) {
    preventFlatpickrOpen(event, this.setShouldFlatpickrOpen.bind(this));
  }

  protected handleInputClickEvent() {
    handleInputClick(this.setShouldFlatpickrOpen.bind(this));
  }

  protected handleInputFocusEvent() {
    handleInputFocus(
      this._shouldFlatpickrOpen,
      this.closeFlatpickr.bind(this),
      this.setShouldFlatpickrOpen.bind(this)
    );
  }

  protected async _clearDateAt(index: 0 | 1, source: string): Promise<void> {
    if (!this.flatpickrInstance) return;

    this._isClearing = true;
    try {
      const newValue: [Date | null, Date | null] = [
        this.value[0] ?? null,
        this.value[1] ?? null,
      ];
      newValue[index] = null;
      this.value = newValue;

      const other = this.value[index === 0 ? 1 : 0];
      if (other) {
        this.flatpickrInstance.setDate([other], false);
      } else {
        this.flatpickrInstance.clear();
      }

      this.updateFormValue();
      this.invalidText = '';

      emitValue(this, 'on-change', {
        dates: this.value.map((d: Date | null) => d?.toISOString() || null),
        dateString: other ? flatpickr.formatDate(other, this.dateFormat) : '',
        source,
      });

      this._validate(true, false);
      this.requestUpdate();
    } finally {
      this._isClearing = false;
    }
  }

  protected _validateAndFilterDefaultDates(
    defaultDates: string[],
    format: string,
    minDate?: string | number | Date,
    maxDate?: string | number | Date
  ): {
    validDates: string[];
    hasErrors: boolean;
    errorMessage: string;
  } {
    const result = {
      validDates: [] as string[],
      hasErrors: false,
      errorMessage: '',
    };

    const errors: string[] = [];
    const validDates: string[] = [];

    defaultDates.forEach((dateStr, index) => {
      if (!dateStr) return;

      const parsedDate =
        flatpickr.parseDate(dateStr, format) || new Date(dateStr);
      const label = index === 0 ? 'Start' : 'End';

      if (!parsedDate || isNaN(parsedDate.getTime())) {
        errors.push(`Invalid ${label.toLowerCase()} date: ${dateStr}`);
        return;
      }

      if (minDate) {
        const min =
          flatpickr.parseDate(minDate as any, format) || new Date(minDate);
        if (parsedDate.getTime() < min.getTime()) {
          errors.push(
            `${label} date is before minimum allowed date (${minDate})`
          );
          return;
        }
      }

      if (maxDate) {
        const max =
          flatpickr.parseDate(maxDate as any, format) || new Date(maxDate);
        if (parsedDate.getTime() > max.getTime()) {
          errors.push(
            `${label} date is after maximum allowed date (${maxDate})`
          );
          return;
        }
      }

      validDates.push(dateStr);
    });

    if (validDates.length === 2) {
      const [start, end] = validDates.map((d) =>
        flatpickr.parseDate(d, format)
      );
      if (start && end && start.getTime() > end.getTime()) {
        errors.push('Start date cannot be after end date');
        validDates.length = 0;
      }
    }

    result.validDates = validDates;
    result.hasErrors = errors.length > 0;
    result.errorMessage = errors.join('. ');

    return result;
  }

  protected async _checkAndUpdateForViewportChange(): Promise<void> {
    if (!this.flatpickrInstance || this._isClearing) return;

    const isWideScreen = window.innerWidth >= 767;
    const currentShowMonths = this.flatpickrInstance.config.showMonths || 1;
    const expected = isWideScreen && !this.showSingleMonth ? 2 : 1;

    if (currentShowMonths !== expected) {
      const currentDates = this.flatpickrInstance.selectedDates;
      this.flatpickrInstance.destroy();
      this.flatpickrInstance = undefined;

      await this.initializeFlatpickr();

      if (currentDates.length) {
        (this as any).value = [...currentDates];
        this.requestUpdate();
      }
    }
  }

  protected async getBaseFlatpickrOptions(): Promise<Partial<BaseOptions>> {
    const container = getModalContainer(this);
    const currentMode = (this as any).mode || this.config.mode;
    return getFlatpickrOptions({
      locale: this.locale,
      dateFormat: this.dateFormat,
      enableTime: this._enableTime,
      twentyFourHourFormat: this.twentyFourHourFormat ?? undefined,
      inputEl: this._inputEl!,
      minDate: this.minDate,
      maxDate: this.maxDate,
      minTime: this.minTime,
      maxTime: this.maxTime,
      enable: this.enable,
      disable: this._processedDisableDates,
      mode: currentMode,
      closeOnSelect: !(currentMode === 'multiple' || this._enableTime),
      loadLocale,
      onOpen: this.handleOpen.bind(this),
      onClose: this.handleClose.bind(this),
      onChange: this.handleDateChange.bind(this),
      appendTo: container,
      noCalendar: this.config.noCalendar || false,
      static: this.staticPosition,
    });
  }
}
