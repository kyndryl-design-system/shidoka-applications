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
  updateEnableTime,
  setCalendarAttributes,
  loadLocale,
  emitValue,
  hideEmptyYear,
  getModalContainer,
} from '../../../common/helpers/flatpickr';
import '../../reusable/button';

import flatpickr from 'flatpickr';
import { BaseOptions } from 'flatpickr/dist/types/options';

import DatePickerStyles from './datepicker.scss';
import ShidokaFlatpickrTheme from '../../../common/scss/shidoka-flatpickr-theme.scss';

import errorIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/close-filled.svg';
import calendarIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/24/calendar.svg';
import clearIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/close-simple.svg';

type SupportedLocale = (typeof langsArray)[number];

const _defaultTextStrings = {
  requiredText: 'Required',
  clearAll: 'Clear',
  pleaseSelectDate: 'Please select a date',
  noDateSelected: 'No date selected',
  pleaseSelectValidDate: 'Please select a valid date',
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
   */
  @property({ type: Array })
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
  _textStrings = _defaultTextStrings;

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

  override connectedCallback() {
    super.connectedCallback();
    this.addEventListener('change', this._onChange);
    this.addEventListener('reset', this._handleFormReset);

    if (!this.value && this.defaultDate) {
      this._hasInitialDefaultDate = true;
    }
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
      if (Array.isArray(this.value)) {
        return (
          this.value.length > 0 && !this.value.every((date) => date === null)
        );
      }
      return true;
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

  override render() {
    const errorId = `${this.name}-error-message`;
    const warningId = `${this.name}-warning-message`;
    const anchorId = this.name
      ? `${this.name}-${Math.random().toString(36).slice(2, 11)}`
      : `date-picker-${Math.random().toString(36).slice(2, 11)}`;
    const descriptionId = this.name ?? '';
    const placeholder = getPlaceholder(this.dateFormat);

    return html`
      <div class=${classMap(this.getDatepickerClasses())}>
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
            })}"
            type="text"
            id=${anchorId}
            name=${this.name}
            placeholder=${placeholder}
            ?disabled=${this.datePickerDisabled}
            ?required=${this.required}
            ?invalid=${this._isInvalid}
            aria-invalid=${this._isInvalid ? 'true' : 'false'}
            aria-labelledby=${`label-${anchorId}`}
            @click=${this.handleInputClickEvent}
            @focus=${this.handleInputFocusEvent}
          />
          ${this.hasValue()
            ? html`
                <kyn-button
                  ?disabled=${this.datePickerDisabled}
                  class="clear-button"
                  kind="ghost"
                  size="small"
                  description=${this._textStrings.clearAll}
                  @click=${this._handleClear}
                >
                  <span style="display:flex;" slot="icon"
                    >${unsafeSVG(clearIcon)}</span
                  >
                </kyn-button>
              `
            : html`<span class="input-icon">${unsafeSVG(calendarIcon)}</span>`}
        </div>

        ${this.caption
          ? html`<div
              id=${descriptionId}
              class="caption"
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
          aria-label=${`${this.errorAriaLabel}` || 'Error message icon'}
          role="button"
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
      >
        ${this.warnText}
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
        if (processedDates && processedDates.length > 0) {
          if (this.mode === 'multiple') {
            this.value = [...processedDates];
          } else {
            this.value = processedDates[0];
          }
        }
      }
    }
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

  override updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

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
      changedProperties.has('datePickerDisabled') &&
      this.datePickerDisabled &&
      this.flatpickrInstance
    ) {
      this.flatpickrInstance.close();
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

      this.flatpickrInstance.clear();
      if (this._inputEl) {
        this._inputEl.value = '';
      }

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
            setCalendarAttributes(instance, container !== document.body);
            if (instance.calendarContainer) {
              instance.calendarContainer.setAttribute(
                'aria-label',
                'Date picker'
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

  async getComponentFlatpickrOptions(): Promise<Partial<BaseOptions>> {
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
      mode: this.mode,
      closeOnSelect: !(this.mode === 'multiple' || this._enableTime),
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

  handleOpen() {
    if (!this._shouldFlatpickrOpen) {
      this.flatpickrInstance?.close();
      this._shouldFlatpickrOpen = true;
    }
  }

  async handleClose() {
    this._validate(false, false);
    await this.updateComplete;

    if (!this.value && !this.defaultDate) {
      this._hasInteracted = true;
    }
  }

  async handleDateChange(selectedDates: Date[], dateStr: string) {
    if (this._isClearing) return;

    this._hasInteracted = true;

    try {
      if (this.mode === 'multiple') {
        this.value = selectedDates.length > 0 ? [...selectedDates] : [];
      } else {
        this.value = selectedDates.length > 0 ? selectedDates[0] : null;
      }

      let formattedDates;
      const isMultiple = this.mode === 'multiple';
      if (isMultiple) {
        formattedDates = selectedDates.map((date) => date.toISOString());
      } else if (selectedDates.length > 0) {
        formattedDates = selectedDates[0].toISOString();
      } else {
        formattedDates = isMultiple ? [] : null;
      }

      emitValue(this, 'on-change', {
        dates: formattedDates,
        dateString: (this._inputEl as HTMLInputElement)?.value || dateStr,
        source: selectedDates.length === 0 ? 'clear' : undefined,
      });

      this._validate(true, false);
      await this.updateComplete;
      this.requestUpdate();
    } catch (error) {
      console.warn('Error handling date change:', error);
    }
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

    // Don't apply validation when the component is disabled
    if (this.datePickerDisabled) {
      this._internals.setValidity({}, '', this._inputEl);
      this._isInvalid = false;
      this._internalValidationMsg = '';
      return;
    }

    if (interacted) {
      this._hasInteracted = true;
    }

    const hasValidDefaultValue =
      this.defaultDate !== null &&
      ((typeof this.defaultDate === 'string' &&
        this.defaultDate.trim() !== '') ||
        (Array.isArray(this.defaultDate) &&
          this.defaultDate.length > 0 &&
          this.defaultDate.some((date) => date && date !== '')));

    const isEmpty = !this._inputEl.value.trim() && !hasValidDefaultValue;
    const isRequired = this.required;

    let validity = this._inputEl.validity;
    let validationMessage = this._inputEl.validationMessage;

    if (
      !this._hasInteracted &&
      !interacted &&
      this._enableTime &&
      !(isRequired && isEmpty)
    ) {
      this._internals.setValidity({}, '', this._inputEl);
      this._isInvalid = false;
      this._internalValidationMsg = '';
      return;
    }

    if (isRequired && isEmpty) {
      validity = { ...validity, valueMissing: true };
      validationMessage =
        this.defaultErrorMessage || this._textStrings.pleaseSelectDate;

      this._internals.setValidity(validity, validationMessage, this._inputEl);

      this._isInvalid = this._hasInteracted || interacted;
      this._internalValidationMsg = validationMessage;

      if (report) {
        this._internals.reportValidity();
      }

      this.requestUpdate();
      return;
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
      !isValid &&
      (this._hasInteracted || this.invalidText !== '' || interacted);
    this._internalValidationMsg = validationMessage;

    if (report) {
      this._internals.reportValidity();
    }

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
