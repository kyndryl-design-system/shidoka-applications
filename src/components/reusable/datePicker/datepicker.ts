import { html, LitElement, PropertyValues } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { ref, createRef } from 'lit/directives/ref.js';
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
  updateEnableTime,
  loadLocale,
  emitValue,
  hideEmptyYear,
  getModalContainer,
  clearFlatpickrInput,
  setupAdvancedKeyboardNavigation,
} from '../../../common/helpers/flatpickr';
import '../../reusable/button';
import flatpickr from 'flatpickr';
import type { Options as FlatpickrOptions } from 'flatpickr/dist/types/options';

import DatePickerStyles from './datepicker.scss';
import ShidokaFlatpickrTheme from '../../../common/scss/shidoka-flatpickr-theme.scss';

import errorIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/close-filled.svg';
import calendarIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/24/calendar.svg';
import clearIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/close-simple.svg';
import {
  applyCalendarA11y,
  makeFirstDayTabbable,
  makeNavFocusable,
} from '../../../common/helpers/calendarA11y';

type SupportedLocale = (typeof langsArray)[number];

const _defaultTextStrings = {
  requiredText: 'Required',
  clearAll: 'Clear',
  pleaseSelectDate: 'Please select a date',
  noDateSelected: 'No date selected',
  pleaseSelectValidDate: 'Please select a valid date',
  invalidDateFormat: 'Invalid date format provided',
  errorProcessing: 'Error processing date',
  calendarOpened:
    'Calendar opened. Use arrow keys to navigate dates, Enter or Space to select, and Escape to close. Use Page Up/Down or Alt+Arrow Up/Down to navigate months, Home and End to navigate years.',
  dateSelected: 'Date selected: {0}',
  yearNavigationInstructions: 'Press Home or End to navigate years',
  monthNavigationInstructions:
    'Press Page Up/Down or Alt+Arrow Up/Down to navigate months',
  dateInputInstructions: 'You can also type a date directly in the format {0}',

  lockedStartDate: 'Start date is locked',
  lockedEndDate: 'End date is locked',
  dateLocked: 'Date is locked',
  dateNotAvailable: 'Date is not available',
  dateInSelectedRange: 'Date is in selected range',
};

/**
 * Datepicker: uses Flatpickr's datetime picker library -- `https://flatpickr.js.org`
 * @fires on-change - Captures the input event and emits the selected value and original event details.
 * @slot tooltip - Slot for tooltip.
 */
@customElement('kyn-date-picker')
export class DatePicker extends FormMixin(LitElement) {
  static override styles = [DatePickerStyles, ShidokaFlatpickrTheme];

  /** Label text. */
  @property({ type: String })
  label = '';

  /* Sets desired locale and, if supported, dynamically loads language lib */
  @property({ type: String })
  locale: SupportedLocale | string = 'en';

  /** Sets flatpickr value to define how the date will be displayed in the input box (ex: `Y-m-d H:i`). */
  @property({ type: String })
  dateFormat = 'Y-m-d';

  /** Sets the initial selected date(s). For multiple mode, provide an array of date strings matching dateFormat. */
  @property({ type: Array })
  defaultDate: string | string[] | null = null;

  /** Sets default error message. */
  @property({ type: String })
  defaultErrorMessage = '';

  /** Sets datepicker form input value to required/required. */
  @property({ type: Boolean })
  required = false;

  /** Input size. "sm", "md", or "lg". */
  @property({ type: String })
  size = 'md';

  /**
   * Sets the date/time value for the component.
   *
   * For controlled usage patterns, this property allows parent components to directly control the selected date.
   * When used together with defaultDate, value takes precedence if both are provided.
   *
   * In uncontrolled usage, this is populated automatically based on defaultDate and user selections.
   * @internal
   */
  @state()
  override value: Date | Date[] | null = null;

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

  /** Sets flatpickr mode to select single (default), multiple dates. */
  @property({ type: String })
  mode: 'single' | 'multiple' = 'single';

  /** Sets caption to be displayed under primary date picker elements. */
  @property({ type: String })
  caption = '';

  /** Sets entire datepicker form element to enabled/disabled. */
  @property({ type: Boolean })
  datePickerDisabled = false;

  /** Sets entire datepicker form element to readonly. */
  @property({ type: Boolean })
  readonly = false;

  /** Sets 24 hour formatting true/false.
   * Defaults to 12H for all `en-*` locales and 24H for all other locales.
   */
  @property({ type: Boolean })
  twentyFourHourFormat: boolean | null = null;

  /** Sets lower boundary of datepicker date selection. */
  @property({ type: String })
  minDate: string | number | Date = '';

  /** Sets upper boundary of datepicker date selection. */
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

  /**
   * Sets whether user has interacted with datepicker for error handling.
   * @internal
   */
  @state()
  private _hasInteracted = false;

  /** Flatpickr instantiation.
   * @internal
   */
  @state()
  private flatpickrInstance?: flatpickr.Instance;

  /**
   * Queries the anchor DOM element.
   * @internal
   */
  @query('input')
  private _inputEl?: HTMLInputElement;

  /** Tracks if we're in a clear operation to prevent duplicate events
   * @internal
   */
  @state()
  private _isClearing = false;

  /** Customizable text strings. */
  @property({ type: Object })
  textStrings = _defaultTextStrings;

  /** Internal text strings.
   * @internal
   */
  @state()
  _textStrings = { ..._defaultTextStrings };

  /** Control flag to prevent Flatpickr from opening when clicking caption, error, label, or warning elements.
   * @internal
   */
  @state()
  private _shouldFlatpickrOpen = false;

  /** Track if we initially had a defaultDate when the component was first connected */
  @state()
  private _hasInitialDefaultDate = false;

  /** Track initialization state
   * @internal
   */
  private _initialized = false;

  /** Track destroyed state
   * @internal
   */
  private _isDestroyed = false;

  /**
   * Reference to the live region element for screen reader announcements
   * @internal
   */
  private _screenReaderRef = createRef<HTMLDivElement>();

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
    } catch (e) {
      console.error(e);
    }
  }, 100);

  override connectedCallback() {
    super.connectedCallback();
    this.addEventListener('change', this._onChange);
    this.addEventListener('reset', this._handleFormReset);
    if (!this.value && this.defaultDate) this._hasInitialDefaultDate = true;
  }

  override disconnectedCallback() {
    this._isDestroyed = true;
    super.disconnectedCallback();
    this.removeEventListener('change', this._onChange);
    this.removeEventListener('reset', this._handleFormReset);
    if (this.flatpickrInstance) {
      this.flatpickrInstance.destroy();
      this.flatpickrInstance = undefined;
    }
  }

  private hasValue(): boolean {
    if (this._inputEl?.value) return true;
    if (this.value) {
      if (Array.isArray(this.value))
        return this.value.length > 0 && !this.value.every((d) => d === null);
      return true;
    }
    if (this.defaultDate) {
      if (Array.isArray(this.defaultDate))
        return (
          this.defaultDate.length > 0 &&
          !this.defaultDate.every((d) => !d || d === '')
        );
      return !!this.defaultDate;
    }
    return false;
  }

  private updateFormValue(): void {
    if (this._internals && this._inputEl)
      this._internals.setFormValue(this._inputEl.value);
  }

  override render() {
    const errorId = `${this.name}-error-message`;
    const warningId = `${this.name}-warning-message`;
    const anchorId = this.name
      ? `${this.name}-${Math.random().toString(36).slice(2)}`
      : `date-picker-${Math.random().toString(36).slice(2)}`;
    const placeholder = getPlaceholder(this.dateFormat);
    return html`
      <div
        ${ref(this._screenReaderRef)}
        class="sr-only label-text"
        aria-live="polite"
        aria-atomic="true"
      >
        ${this.value
          ? this._textStrings.dateSelected.replace(
              '{0}',
              Array.isArray(this.value)
                ? this.value[0].toLocaleDateString(this.locale)
                : this.value.toLocaleDateString(this.locale)
            )
          : this._textStrings.noDateSelected}
      </div>
      <div
        class=${classMap({
          'date-picker': true,
          'date-picker__enable-time': this._enableTime,
          'date-picker__multiple-select': this.mode === 'multiple',
          'date-picker__disabled': this.datePickerDisabled,
        })}
      >
        <div
          class="label-text"
          @mousedown=${this.preventFlatpickrOpen}
          @click=${this.preventFlatpickrOpen}
          ?disabled=${this.datePickerDisabled}
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
            : null}${this.label}<slot name="tooltip"></slot>
        </div>
        <div class="input-wrapper">
          <input
            class=${classMap({
              [`size--${this.size}`]: true,
              'input-custom': true,
              'is-readonly': this.readonly,
            })}
            type="text"
            id=${anchorId}
            name=${this.name}
            placeholder=${placeholder}
            ?disabled=${this.datePickerDisabled}
            ?readonly=${this.readonly}
            ?required=${this.required}
            ?invalid=${this._isInvalid}
            aria-invalid=${this._isInvalid}
            aria-labelledby=${`label-${anchorId}`}
            @click=${this.handleInputClickEvent}
            @focus=${this.handleInputFocusEvent}
            @keydown=${this.handleInputKeydown}
          />
          ${this.hasValue() && !this.readonly
            ? html`<kyn-button
                ?disabled=${this.datePickerDisabled}
                class="clear-button"
                kind="ghost"
                size="small"
                description=${this._textStrings.clearAll}
                @click=${this._handleClear}
                ><span slot="icon" style="display:flex;"
                  >${unsafeSVG(clearIcon)}</span
                ></kyn-button
              >`
            : html`<span
                class="input-icon ${this.datePickerDisabled
                  ? 'is-disabled'
                  : ''}"
                aria-hidden="true"
                @click=${this.handleInputClickEvent}
                >${unsafeSVG(calendarIcon)}</span
              >`}
        </div>
        ${this.caption
          ? html`<div
              class="caption"
              id=${anchorId}
              aria-disabled=${this.datePickerDisabled}
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
    if (this.datePickerDisabled) return null;
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
        {this.warnText}
      </div>`;
    }
    return null;
  }

  getDatepickerClasses() {
    return {
      'date-picker': true,
      'date-picker__enable-time': this._enableTime,
      'date-picker__multiple-select': this.mode === 'multiple',
      'date-picker__disabled': this.datePickerDisabled,
    };
  }

  override async firstUpdated(changedProperties: PropertyValues) {
    super.firstUpdated(changedProperties);
    if (!this._initialized) {
      injectFlatpickrStyles(ShidokaFlatpickrTheme.toString());
      this._initialized = true;
      await this.updateComplete;
      this.setupAnchor();
      if (this._hasInitialDefaultDate && this.defaultDate) {
        const processedDates = this.processDefaultDates(this.defaultDate);
        if (processedDates.length) {
          this.value =
            this.mode === 'multiple' ? [...processedDates] : processedDates[0];
        }
      }
    }
  }

  private processDefaultDates(
    defaultDate: string | string[] | Date | Date[] | null
  ): Date[] {
    if (!defaultDate) return [];

    const values = Array.isArray(defaultDate) ? defaultDate : [defaultDate];

    const parsed = values.map((d) => {
      if (d instanceof Date) return d;
      if (typeof d === 'string') return this.parseDateString(d);
      return null;
    });

    const valid = parsed.filter(
      (d): d is Date => d instanceof Date && !isNaN(d.getTime())
    );

    if (valid.length !== parsed.length) {
      console.error('Invalid date(s) provided in defaultDate');
      this.invalidText = this._textStrings.invalidDateFormat;
    }

    return valid;
  }

  override updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    if (changedProperties.has('textStrings')) {
      this._textStrings = { ..._defaultTextStrings, ...this.textStrings };
    }

    if (changedProperties.has('value') && !this._isClearing) {
      let newValue = this.value;

      if (typeof newValue === 'string') {
        try {
          const strValue = newValue as string;
          if (strValue.trim() !== '' && /\d{4}-\d{2}-\d{2}/.test(strValue)) {
            const [year, month, day] = strValue.split('-').map(Number);
            if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
              this.value = new Date(year, month - 1, day, 12);
              newValue = this.value;
              if (this.flatpickrInstance) {
                this.flatpickrInstance.setDate(newValue, true);
              }
            }
          }
        } catch (e) {
          console.warn('Error parsing date string:', e);
        }
      }

      const isNull =
        newValue === null || (Array.isArray(newValue) && newValue.length === 0);
      if (isNull && this.flatpickrInstance) {
        this._isClearing = true;
        try {
          this.flatpickrInstance.clear();
          if (this._inputEl) {
            this._inputEl.value = '';
          }
        } finally {
          this._isClearing = false;
        }
      }
      this.requestUpdate();
    }

    if (
      changedProperties.has('defaultDate') &&
      this.flatpickrInstance &&
      !this._isClearing
    ) {
      this.debouncedUpdate();
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
        this.debouncedUpdate();
      }
    }

    if (
      changedProperties.has('dateFormat') ||
      changedProperties.has('minDate') ||
      changedProperties.has('maxDate') ||
      changedProperties.has('locale') ||
      changedProperties.has('twentyFourHourFormat')
    ) {
      this._enableTime = updateEnableTime(this.dateFormat);
      if (this.flatpickrInstance && this._initialized && !this._isClearing) {
        if (changedProperties.has('dateFormat')) {
          this.debouncedUpdate();
        } else {
          this.debouncedUpdate();
        }
      }
    }

    if (
      (changedProperties.has('datePickerDisabled') &&
        this.datePickerDisabled) ||
      (changedProperties.has('readonly') && this.readonly)
    ) {
      if (this.flatpickrInstance) {
        this.flatpickrInstance.close();
      }
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

  private async _handleClear(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    if (!this.flatpickrInstance) {
      console.warn('Cannot clear: Flatpickr instance not available');
      return;
    }

    this._isClearing = true;

    try {
      this.value = this.mode === 'multiple' ? [] : null;
      this.defaultDate = null;

      await clearFlatpickrInput(this.flatpickrInstance, this._inputEl, () => {
        this.updateFormValue();
      });

      emitValue(this, 'on-change', {
        dates: this.value,
        dateString: (this._inputEl as HTMLInputElement)?.value,
        source: 'clear',
      });

      this._validate(true, false);
      await this.updateComplete;
      await this.initializeFlatpickr();
      this.requestUpdate();
    } catch (error) {
      console.error('Error clearing datepicker:', error);
    } finally {
      this._isClearing = false;
    }
  }

  async initializeFlatpickr() {
    if (this._isDestroyed) return;
    if (!this._inputEl || !this._inputEl.isConnected) {
      console.warn('Cannot initialize Flatpickr: input element not in DOM');
      return;
    }

    if (this.flatpickrInstance) {
      this.flatpickrInstance.destroy();
      this.flatpickrInstance = undefined;
    }

    try {
      this.flatpickrInstance = await initializeSingleAnchorFlatpickr({
        inputEl: this._inputEl,
        getFlatpickrOptions: () => this.getComponentFlatpickrOptions(),
        setInitialDates: this.setInitialDates.bind(this),
      });

      if (!this.flatpickrInstance) {
        throw new Error('Flatpickr init returned undefined');
      }

      hideEmptyYear();
      this._validate(false, false);
    } catch (err) {
      console.error('Error initializing Flatpickr:', err);
      if (err instanceof Error) console.error(err.message);
    }
  }

  async updateFlatpickrOptions() {
    if (!this.flatpickrInstance) {
      console.warn('Cannot update options: Flatpickr instance not available');
      return;
    }
    await this.debouncedUpdate();
  }

  private parseDateString(dateStr: string): Date | null {
    if (!dateStr.trim()) return null;

    const dtMatch = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})$/.exec(
      dateStr
    );
    if (dtMatch) {
      const [, y, mo, da, hh, mm] = dtMatch.map(Number);
      const dt = new Date(y, mo - 1, da, hh, mm);
      return isNaN(dt.getTime()) ? null : dt;
    }

    const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
    if (dateMatch) {
      const [, y, mo, da] = dateMatch.map(Number);
      const dt = new Date(y, mo - 1, da);
      return isNaN(dt.getTime()) ? null : dt;
    }

    return null;
  }

  setInitialDates() {
    if (!this.flatpickrInstance) {
      return;
    }

    try {
      const dateToSet = this.defaultDate || this.value;
      if (!dateToSet) return;

      if (Array.isArray(dateToSet)) {
        const validDates = dateToSet
          .map((date) => {
            if (date instanceof Date) return date;
            if (typeof date === 'string') return this.parseDateString(date);
            return null;
          })
          .filter((date): date is Date => date !== null);

        if (validDates.length > 0) {
          this.flatpickrInstance.setDate(validDates, true);

          if (
            this.value === null ||
            (Array.isArray(this.value) && this.value.length === 0)
          ) {
            if (this.mode === 'multiple') {
              this.value = [...validDates];
            } else {
              this.value = validDates[0];
            }
          }
        }
      } else if (typeof dateToSet === 'string') {
        const parsedDate = this.parseDateString(dateToSet);
        if (parsedDate) {
          this.flatpickrInstance.setDate(parsedDate, true);

          if (this.value === null) {
            this.value = parsedDate;
          }
        }
      } else if (dateToSet instanceof Date) {
        this.flatpickrInstance.setDate(dateToSet, true);

        if (this.value === null) {
          this.value = dateToSet;
        }
      }
    } catch (error) {
      console.warn('Error setting initial dates:', error);
    }
  }

  async getComponentFlatpickrOptions(): Promise<Partial<FlatpickrOptions>> {
    const container = getModalContainer(this);
    const base = await getFlatpickrOptions({
      locale: this.locale,
      dateFormat: this.dateFormat,
      defaultDate: this.defaultDate ?? undefined,
      enableTime: this._enableTime,
      twentyFourHourFormat: this.twentyFourHourFormat ?? undefined,
      inputEl: this._inputEl!,
      minDate: this.minDate,
      maxDate: this.maxDate,
      enable: this.enable,
      disable: this._processedDisableDates,
      mode: this.mode as 'single' | 'multiple',
      closeOnSelect: !(this.mode === 'multiple' || this._enableTime),
      loadLocale,
      onOpen: this.handleOpen.bind(this),
      onClose: this.handleClose.bind(this),
      onChange: this.handleDateChange.bind(this),
      appendTo: container,
      noCalendar: false,
      static: this.staticPosition,
    });

    return {
      ...base,
      allowInput: true,

      onReady: (_dates, _str, instance) => {
        applyCalendarA11y(instance, container !== document.body);
        setupAdvancedKeyboardNavigation(instance);
      },

      onMonthChange: (_dates, _str, instance) => {
        makeNavFocusable(instance.calendarContainer!);
        makeFirstDayTabbable(instance.calendarContainer!);

        const monthName = new Date(
          instance.currentYear,
          instance.currentMonth,
          1
        ).toLocaleString(this.locale, { month: 'long' });

        if (this._screenReaderRef.value) {
          this._screenReaderRef.value.textContent = `Month changed to ${monthName}. ${this._textStrings.monthNavigationInstructions}`;
        }
      },

      onYearChange: (_dates, _str, instance) => {
        const year = instance.currentYear;
        if (this._screenReaderRef.value) {
          this._screenReaderRef.value.textContent = `Year changed to ${year}. ${this._textStrings.yearNavigationInstructions}`;
        }
      },

      onChange: (selectedDates, dateStr) =>
        this.handleDateChange(selectedDates, dateStr),
    };
  }

  handleOpen() {
    if (this.readonly) {
      this.flatpickrInstance?.close();
      return;
    }
    if (!this._shouldFlatpickrOpen) {
      this.flatpickrInstance?.close();
      this._shouldFlatpickrOpen = true;
    }

    if (this._screenReaderRef.value) {
      this._screenReaderRef.value.textContent =
        this._textStrings.calendarOpened;
    }
  }

  async handleClose() {
    this._validate(false, false);
    await this.updateComplete;

    if (!this.value && !this.defaultDate) {
      this._hasInteracted = true;
    }
  }

  private async handleDateChange(selectedDates: Date[], dateStr: string) {
    const invalidDates = selectedDates.filter((d) => isNaN(d.getTime()));
    if (this._isClearing || invalidDates.length > 0) {
      if (invalidDates.length > 0)
        this.invalidText = this._textStrings.invalidDateFormat;
      this._validate(true, false);
      return;
    }

    this._hasInteracted = true;
    this.value =
      this.mode === 'multiple'
        ? selectedDates.length
          ? [...selectedDates]
          : []
        : selectedDates.length
        ? selectedDates[0]
        : null;

    const formattedDates =
      this.mode === 'multiple'
        ? selectedDates.map((d) => d.toISOString())
        : selectedDates.length
        ? selectedDates[0].toISOString()
        : null;

    emitValue(this, 'on-change', {
      dates: formattedDates,
      dateString: this._inputEl?.value || dateStr,
      source: selectedDates.length === 0 ? 'clear' : undefined,
    });

    this.invalidText = '';

    if (this._screenReaderRef.value) {
      if (!selectedDates.length) {
        this._screenReaderRef.value.textContent =
          this._textStrings.noDateSelected;
      } else if (this.mode === 'multiple') {
        const last = selectedDates[selectedDates.length - 1].toLocaleDateString(
          this.locale
        );
        this._screenReaderRef.value.textContent = `Selected ${selectedDates.length} dates. Last: ${last}.`;
      } else {
        const sel = selectedDates[0].toLocaleDateString(this.locale);
        this._screenReaderRef.value.textContent =
          this._textStrings.dateSelected.replace('{0}', sel);
      }
    }

    this._validate(true, false);
    await this.updateComplete;
    this.requestUpdate();
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
    this._screenReaderRef.value!.textContent =
      this._textStrings.dateInputInstructions.replace(
        '{0}',
        getPlaceholder(this.dateFormat)
      );
  }

  private handleInputKeydown(event: KeyboardEvent) {
    if (!this.flatpickrInstance || this.readonly || this.datePickerDisabled)
      return;

    const inst = this.flatpickrInstance;
    const isOpen = inst.isOpen;
    const { key, altKey, metaKey, ctrlKey } = event;

    if (!isOpen && (key === ' ' || key === 'Enter')) {
      event.preventDefault();
      inst.open();
      this._screenReaderRef.value!.textContent =
        this._textStrings.calendarOpened;
      return;
    }

    if (isOpen && (key === ' ' || key === 'Enter')) {
      event.preventDefault();
      const highlighted = inst.selectedDates[0] || inst.latestSelectedDateObj;
      if (!highlighted) return;

      inst.setDate(highlighted, true);

      if (this.mode !== 'multiple') {
        inst.close();
        this._screenReaderRef.value!.textContent =
          this._textStrings.dateSelected.replace(
            '{0}',
            highlighted.toLocaleDateString(this.locale)
          );
      } else {
        const sel = inst.selectedDates;
        const lastDate = sel[sel.length - 1].toLocaleDateString(this.locale);
        this._screenReaderRef.value!.textContent = `Selected ${sel.length} dates. Last: ${lastDate}.`;

        makeFirstDayTabbable(inst.calendarContainer!);
        const dayCell = inst.calendarContainer!.querySelector<HTMLElement>(
          '.flatpickr-day[tabindex="0"]'
        );
        dayCell?.focus();
      }
      return;
    }

    if (isOpen && key === 'Home') {
      event.preventDefault();
      const y = inst.currentYear - 1;
      inst.changeYear(y);
      return this._announceYearChange(y);
    }
    if (isOpen && key === 'End') {
      event.preventDefault();
      const y = inst.currentYear + 1;
      inst.changeYear(y);
      return this._announceYearChange(y);
    }

    const prevMonthKey =
      key === 'PageUp' || (key === 'ArrowUp' && (altKey || metaKey || ctrlKey));
    const nextMonthKey =
      key === 'PageDown' ||
      (key === 'ArrowDown' && (altKey || metaKey || ctrlKey));

    if (isOpen && prevMonthKey) {
      event.preventDefault();
      const m = inst.currentMonth;
      const y = inst.currentYear;
      inst.changeMonth(-1);
      return this._announceMonthChange(
        m === 0 ? 11 : m - 1,
        m === 0 ? y - 1 : y
      );
    }

    if (isOpen && nextMonthKey) {
      event.preventDefault();
      const m = inst.currentMonth;
      const y = inst.currentYear;
      inst.changeMonth(1);
      return this._announceMonthChange(
        m === 11 ? 0 : m + 1,
        m === 11 ? y + 1 : y
      );
    }
  }

  private _announceYearChange(year: number) {
    if (this._screenReaderRef.value) {
      this._screenReaderRef.value.textContent = `Year changed to ${year}. ${this._textStrings.yearNavigationInstructions}`;
    }
  }

  private _announceMonthChange(month: number, year: number) {
    if (this._screenReaderRef.value) {
      const date = new Date(year, month, 1);
      const monthName = date.toLocaleString(this.locale, { month: 'long' });
      this._screenReaderRef.value.textContent = `Month changed to ${monthName}. ${this._textStrings.monthNavigationInstructions}`;
    }
  }

  private _validate(interacted: boolean, report: boolean) {
    if (!this._inputEl) return;

    if (this.datePickerDisabled) {
      this._internals.setValidity({}, '', this._inputEl);
      this._isInvalid = false;
      this._internalValidationMsg = '';
      return;
    }

    if (interacted) this._hasInteracted = true;

    const hasDefault =
      this.defaultDate != null &&
      ((typeof this.defaultDate === 'string' &&
        this.defaultDate.trim() !== '') ||
        (Array.isArray(this.defaultDate) && this.defaultDate.some((d) => !!d)));
    const isEmpty = !this._inputEl.value.trim() && !hasDefault;
    const isRequired = this.required;

    let validity = this._inputEl.validity;
    let msg = this._inputEl.validationMessage;

    if (isRequired && isEmpty) {
      validity = { ...validity, valueMissing: true };
      msg = this.defaultErrorMessage || this._textStrings.pleaseSelectDate;
    }

    if (this.invalidText) {
      validity = { ...validity, customError: true };
      msg = this.invalidText;
    }

    const isValid = !validity.valueMissing && !validity.customError;
    if (!isValid && !msg) msg = this._textStrings.pleaseSelectValidDate;

    this._internals.setValidity(validity, msg, this._inputEl);
    this._isInvalid = !isValid && (this._hasInteracted || report);

    if (this._screenReaderRef.value && validity.customError) {
      this._screenReaderRef.value.textContent = msg;
    }

    if (report) this._internals.reportValidity();
    this.requestUpdate();
  }

  private _onChange() {
    this._validate(true, false);
  }

  private _handleFormReset() {
    this.value = null;
    if (this.flatpickrInstance) {
      this.flatpickrInstance.clear();
    }
    this._hasInteracted = false;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-date-picker': DatePicker;
  }
}
