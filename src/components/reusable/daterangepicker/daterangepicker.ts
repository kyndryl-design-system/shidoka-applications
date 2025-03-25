import { html, LitElement, PropertyValues } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { FormMixin } from '../../../common/mixins/form-input';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { langsArray } from '../../../common/flatpickrLangs';
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
  dateRangeSelected: 'Selected date range: {0} to {1}',
};

/**
 * Date Range Picker: uses Flatpickr library, range picker implementation -- `https://flatpickr.js.org/examples/#range-calendar`
 * @fires on-change - Captures the input event and emits the selected value and original event details.
 * @slot tooltip - Slot for tooltip.
 */
@customElement('kyn-date-range-picker')
export class DateRangePicker extends FormMixin(LitElement) {
  static override styles = [DateRangePickerStyles, ShidokaFlatpickrTheme];

  /** Label text. */
  @property({ type: String })
  label = '';

  /** Sets and dynamically imports specific l10n calendar localization. */
  @property({ type: String })
  locale: SupportedLocale | string = 'en';

  /** Sets flatpickr value to define how the date will be displayed in the input box (ex: `Y-m-d H:i`). */
  @property({ type: String })
  dateFormat = 'Y-m-d';

  /** Sets the initial selected date(s). For range mode, provide an array of date strings matching dateFormat (e.g. ["2024-01-01", "2024-01-07"]). */
  @property({ type: Array })
  defaultDate: string[] | null = null;

  /** Sets default error message. */
  @property({ type: String })
  defaultErrorMessage = '';

  /** Sets date/time range value. */
  @property({ type: Array })
  override value: [Date | null, Date | null] = [null, null];

  /** Sets validation warning messaging. */
  @property({ type: String })
  warnText = '';

  /** Sets flatpickr options setting to disable specific dates. Accepts array of dates in Y-m-d format, timestamps, or Date objects. */
  @property({ type: Array })
  disable: (string | number | Date)[] = [];

  /** Internal storage for processed disable dates */
  @state()
  private _processedDisableDates: (string | number | Date)[] = [];

  /** Sets flatpickr options setting to enable specific dates. */
  @property({ type: Array })
  enable: (string | number | Date)[] = [];

  /** Sets caption to be displayed under primary date picker elements. */
  @property({ type: String })
  caption = '';

  /** Sets date range picker form input value to required. */
  @property({ type: Boolean })
  required = false;

  /** Input size. "sm", "md", or "lg". */
  @property({ type: String })
  size = 'md';

  /** Sets entire date range picker form element to enabled/disabled. */
  @property({ type: Boolean })
  dateRangePickerDisabled = false;

  /** Sets entire date range picker form element to readonly. */
  @property({ type: Boolean })
  readonly = false;

  /** Sets 24-hour formatting true/false.
   * Defaults to 12H for all `en-` locales and 24H for all other locales.
   */
  @property({ type: Boolean })
  twentyFourHourFormat: boolean | null = null;

  /** Sets lower boundary of date range picker date selection. */
  @property({ type: String })
  minDate: string | number | Date = '';

  /** Sets upper boundary of date range picker date selection. */
  @property({ type: String })
  maxDate: string | number | Date = '';

  /** Sets aria label attribute for error message. */
  @property({ type: String })
  errorAriaLabel = '';

  /** Sets title attribute for error message. */
  @property({ type: String })
  errorTitle = '';

  /** Sets aria label attribute for warning message. */
  @property({ type: String })
  warningAriaLabel = '';

  /** Sets title attribute for warning message. */
  @property({ type: String })
  warningTitle = '';

  /** Sets whether the Flatpickr calendar UI should use static positioning. */
  @property({ type: Boolean })
  staticPosition = false;

  /** Sets flatpickr enableTime value based on detected dateFormat.
   * @internal
   */
  @state()
  private _enableTime = false;

  /** Flatpickr instantiation.
   * @internal
   */
  @state()
  private flatpickrInstance?: Instance;

  /**
   * Queries the input DOM element.
   * @internal
   */
  @query('input')
  private _inputEl?: HTMLInputElement;

  /**
   * Sets whether user has interacted with datepicker for error handling.
   * @internal
   */
  @state()
  private _hasInteracted = false;

  /** Customizable text strings. */
  @property({ type: Object })
  textStrings = _defaultTextStrings;

  /** Internal text strings.
   * @internal
   */
  @state()
  _textStrings = _defaultTextStrings;

  /** Tracks if we're in a clear operation to prevent duplicate events
   * @internal
   */
  @state()
  private _isClearing = false;

  /** Control flag to prevent Flatpickr from opening when clicking caption, error, label, or warning elements.
   * @internal
   */
  @state()
  private _shouldFlatpickrOpen = false;

  /** Track if we initially had a defaultDate when the component was first connected
   * @internal
   */
  @state()
  private _hasInitialDefaultDate = false;

  /** Track initialization state
   * @internal
   */
  private _initialized = false;

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
      console.error('Error in debounced update:', error);
    }
  }, 100);

  private handleResize = this.debounce(async () => {
    if (this.flatpickrInstance) {
      try {
        await this.initializeFlatpickr();
      } catch (error) {
        console.error('Error handling resize:', error);
      }
    }
  }, 250);

  override connectedCallback() {
    super.connectedCallback();
    this.addEventListener('change', this._onChange);
    this.addEventListener('reset', this._handleFormReset);
    window.addEventListener('resize', this.handleResize);

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
      this._internals.setFormValue(this._inputEl.value);
    }
  }

  override render() {
    const errorId = `${this.name}-error-message`;
    const warningId = `${this.name}-warning-message`;
    const anchorId = this.name
      ? `${this.name}-${Math.random().toString(36).slice(2, 11)}`
      : `date-range-picker-${Math.random().toString(36).slice(2, 11)}`;
    const descriptionId = this.name ?? '';
    const placeholder = getPlaceholder(this.dateFormat, true);

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
          ${this.hasValue() && !this.readonly
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
            : html`<span class="input-icon">${unsafeSVG(calendarIcon)}</span>`}
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
          aria-label=${this.errorAriaLabel || 'Error message icon'}
          role="button"
          >${unsafeSVG(errorIcon)}</span
        >
        ${this.invalidText ||
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
      >
        ${this.warnText}
      </div>`;
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
      return defaultDate
        .map((date) => {
          if (date instanceof Date) return date;
          if (typeof date === 'string') return this.parseDateString(date);
          return null;
        })
        .filter((date): date is Date => date !== null);
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

    if (dateStr.includes('T')) {
      const date = new Date(dateStr);
      return isNaN(date.getTime()) ? null : date;
    }

    const formats: { [key: string]: RegExp } = {
      'Y-m-d': /^\d{4}-\d{2}-\d{2}$/,
      'Y-m-d h:i K': /^\d{4}-\d{2}-\d{2}( \d{1,2}:\d{2} [AP]M)?$/,
    };

    const pattern = formats[this.dateFormat];
    if (!pattern || !pattern.test(dateStr)) return null;

    const [datePart] = dateStr.split(' ');
    const [year, month, day] = datePart.split('-').map(Number);

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
            this._internals.setFormValue(this.value);
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
    if (changedProperties.has('dateRangePickerDisabled')) {
      if (this.dateRangePickerDisabled) {
        this.flatpickrInstance?.close();
        return;
      } else if (this.value[0] && this.value[1]) {
        this.setInitialDates();
      }
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

    if (
      changedProperties.has('defaultDate') &&
      this.flatpickrInstance &&
      !this._isClearing
    ) {
      if (Array.isArray(this.defaultDate) && this.defaultDate.length === 1) {
        this._hasInteracted = true;
      }

      this.initializeFlatpickr();

      this._validate(true, false);
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
        console.warn('Disable prop must be an array');
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
      if (changedProperties.has('dateFormat')) {
        this.updateFlatpickrOptions();
      } else {
        this.updateFlatpickrOptions();
      }
    }
  }

  private async setupAnchor() {
    if (!this._inputEl) {
      console.warn('Input element not found during setup');
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
    this.value = [null, null];
    this.defaultDate = null;
    this.flatpickrInstance?.clear();
    if (this._inputEl) {
      this._inputEl.value = '';
      this.updateFormValue();
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

  public async updateFlatpickrOptions() {
    if (!this.flatpickrInstance) {
      console.warn('Cannot update options: Flatpickr instance not available');
      return;
    }
    await this.debouncedUpdate();
  }

  public async getComponentFlatpickrOptions(): Promise<Partial<BaseOptions>> {
    const container = getModalContainer(this);
    const options = await getFlatpickrOptions({
      locale: this.locale,
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
    return options;
  }

  public setInitialDates() {
    if (!this.flatpickrInstance) {
      console.warn(
        'Cannot set initial dates: Flatpickr instance not available'
      );
      return;
    }
    try {
      const hasValidValue =
        Array.isArray(this.value) &&
        this.value.length === 2 &&
        (this.value[0] !== null || this.value[1] !== null);

      if (!hasValidValue && this.defaultDate) {
        const validDates = this.processDefaultDates(this.defaultDate);

        if (validDates.length === 2) {
          this.flatpickrInstance.setDate(validDates, true);
          this.value = validDates as [Date, Date];
          if (this._inputEl) {
            this._inputEl.value = this.flatpickrInstance.input.value;
            this.updateFormValue();
          }
        } else if (validDates.length === 1) {
          this.flatpickrInstance.setDate([validDates[0]], true);
          this.value = [validDates[0], null];
          this._hasInteracted = true;
          if (this._inputEl) {
            this._inputEl.value = this.flatpickrInstance.input.value;
            this.updateFormValue();
          }
          this._validate(true, false);
        } else {
          console.warn(
            'Invalid or incomplete date range provided in defaultDate'
          );
        }
      } else if (Array.isArray(this.value) && this.value.length === 2) {
        const validDates = (this.value as (string | Date)[])
          .map((date) => {
            if (typeof date === 'string') {
              const trimmed = date.trim();
              const parsed = new Date(trimmed);
              return isNaN(parsed.getTime()) ? null : parsed;
            }
            if (date instanceof Date && !isNaN(date.getTime())) {
              return date;
            }
            console.warn('Invalid date in value array:', date);
            return null;
          })
          .filter((date): date is Date => date !== null);

        if (validDates.length === 2) {
          this.flatpickrInstance.setDate(validDates, true);
          if (this._inputEl) {
            this._inputEl.value = this.flatpickrInstance.input.value;
            this.updateFormValue();
          }
        } else {
          console.warn('Invalid or incomplete date range provided in value');
        }
      }
    } catch (error) {
      console.warn('Error setting initial dates:', error);
      if (error instanceof Error) {
        console.warn('Error details:', error.message);
      }
    }
  }

  public handleOpen() {
    if (this.readonly) {
      this.flatpickrInstance?.close();
      return;
    }
    if (!this._shouldFlatpickrOpen) {
      this.flatpickrInstance?.close();
      this._shouldFlatpickrOpen = true;
    }
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
        const formattedDates = selectedDates.map((date) => date.toISOString());
        const dateStringFinal =
          this.flatpickrInstance?.input.value || formattedDates.join(' to ');
        emitValue(this, 'on-change', {
          dates: formattedDates,
          dateString: dateStringFinal,
          source: 'date-selection',
        });
      }
    }

    this.updateSelectedDateRangeAria(selectedDates);
    this._validate(true, false);
    await this.updateComplete;
    if (this._inputEl && this.flatpickrInstance) {
      this._inputEl.value = this.flatpickrInstance.input.value;
      this.updateFormValue();
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
      const [startDate, endDate] = selectedDates;
      ariaLabel = this._textStrings.dateRangeSelected
        .replace('{0}', startDate.toLocaleDateString(this.locale))
        .replace('{1}', endDate.toLocaleDateString(this.locale));
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
    handleInputClick(this.setShouldFlatpickrOpen.bind(this));
  }

  private handleInputFocusEvent() {
    handleInputFocus(
      this._shouldFlatpickrOpen,
      this.closeFlatpickr.bind(this),
      this.setShouldFlatpickrOpen.bind(this)
    );
  }

  private _validate(interacted: boolean, report: boolean) {
    if (!this._inputEl || !(this._inputEl instanceof HTMLInputElement)) return;
    if (interacted) this._hasInteracted = true;
    const selectedCount = [this.value[0], this.value[1]].filter(
      (d) => d !== null
    ).length;
    const isRequired = this.required;
    let validity = this._inputEl.validity;
    let validationMessage = this._inputEl.validationMessage;

    if (selectedCount === 1) {
      validity = { ...validity, customError: true };
      validationMessage = this._textStrings.pleaseSelectBothDates;
      this._hasInteracted = true;
    } else if (isRequired && selectedCount === 0) {
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
    this._isInvalid =
      !isValid && (this._hasInteracted || this.invalidText !== '');
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
