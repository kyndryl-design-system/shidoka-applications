import { html, LitElement, PropertyValues } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { FormMixin } from '../../../common/mixins/form-input';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import {
  injectFlatpickrStyles,
  langsArray,
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
} from '../../../common/helpers/flatpickr';
import '../../reusable/button';

import flatpickr from 'flatpickr';
import { BaseOptions } from 'flatpickr/dist/types/options';

import DatePickerStyles from './datepicker.scss';
import ShidokaFlatpickrTheme from '../../../common/scss/shidoka-flatpickr-theme.scss';

import errorIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/close-filled.svg';
import calendarIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/24/calendar.svg';
import clearIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/close-simple.svg';

type SupportedLocale = (typeof langsArray)[number];

const _defaultTextStrings = {
  requiredText: 'Required',
  clearAll: 'Clear',
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
  locale: SupportedLocale = 'en';

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

  /** Sets pre-selected date/time value. */
  @property({ type: Array })
  override value: Date | Date[] | null = null;

  /** Sets validation warning messaging. */
  @property({ type: String })
  warnText = '';

  /** Sets flatpickr options setting to disable specific dates. */
  @property({ type: Array })
  disable: (string | number | Date)[] = [];

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

  /** Input read only state. */
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

  override connectedCallback() {
    super.connectedCallback();
    this.addEventListener('change', this._onChange);
    this.addEventListener('reset', this._handleFormReset);
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
          ?disabled=${this.datePickerDisabled || this.readonly}
          ?readonly=${this.readonly}
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
            ?disabled=${this.datePickerDisabled || this.readonly}
            ?readonly=${this.readonly}
            ?required=${this.required}
            ?invalid=${this._isInvalid}
            aria-invalid=${this._isInvalid ? 'true' : 'false'}
            aria-labelledby=${`label-${anchorId}`}
            @click=${this.handleInputClickEvent}
            @focus=${this.handleInputFocusEvent}
          />
          ${this._inputEl?.value ||
          (this.value &&
            Array.isArray(this.value) &&
            this.value.length > 0 &&
            !this.value.every((date) => date === null)) ||
          (this.defaultDate &&
            Array.isArray(this.defaultDate) &&
            this.defaultDate.length > 0 &&
            !this.defaultDate.every((date) => date === null || date === ''))
            ? html`
                <kyn-button
                  ?disabled=${this.datePickerDisabled || this.readonly}
                  ?readonly=${this.readonly}
                  class="clear-button"
                  ghost
                  kind="tertiary"
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
      'date-picker__read-only': this.readonly,
    };
  }

  private _initialized = false;

  override async firstUpdated(changedProperties: PropertyValues) {
    super.firstUpdated(changedProperties);
    if (!this._initialized) {
      injectFlatpickrStyles(ShidokaFlatpickrTheme.toString());
      this._initialized = true;
      await this.updateComplete;
      this.setupAnchor();
    }
  }

  override updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);
    if (
      changedProperties.has('dateFormat') ||
      changedProperties.has('defaultDate') ||
      changedProperties.has('minDate') ||
      changedProperties.has('maxDate') ||
      changedProperties.has('locale') ||
      changedProperties.has('twentyFourHourFormat')
    ) {
      this._enableTime = updateEnableTime(this.dateFormat);
      if (this.flatpickrInstance && this._initialized) {
        this.updateFlatpickrOptions();
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

  private async reinitializeFlatpickr() {
    if (this._initialized && this.flatpickrInstance) {
      this.flatpickrInstance.destroy();
      await this.initializeFlatpickr();
    }
  }

  private async setupAnchor() {
    if (this._inputEl) {
      await this.initializeFlatpickr();
    }
  }

  private _handleClear(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    this.value = this.mode === 'multiple' ? [] : null;
    this.defaultDate = this.mode === 'multiple' ? [] : null;

    if (this.flatpickrInstance) {
      this.flatpickrInstance.clear();
    }
    if (this._inputEl) {
      this._inputEl.value = '';
    }

    this.reinitializeFlatpickr();

    this._validate(true, false);
    this.requestUpdate();
  }

  async initializeFlatpickr(): Promise<void> {
    if (!this._inputEl) return;
    if (this.flatpickrInstance) this.flatpickrInstance.destroy();

    this.flatpickrInstance = await initializeSingleAnchorFlatpickr({
      inputEl: this._inputEl,
      getFlatpickrOptions: this.getComponentFlatpickrOptions.bind(this),
      setCalendarAttributes: (instance) => {
        if (instance && instance.calendarContainer) {
          setCalendarAttributes(instance);
          instance.calendarContainer.setAttribute('aria-label', 'Date picker');
        } else {
          console.warn('Calendar container not available...');
        }
      },
      setInitialDates: this.setInitialDates.bind(this),
      appendToBody: false,
    });

    hideEmptyYear();
    this._validate(false, false);
  }

  async updateFlatpickrOptions(): Promise<void> {
    if (!this.flatpickrInstance) return;

    const newOptions = await this.getComponentFlatpickrOptions();
    Object.keys(newOptions).forEach((key) => {
      if (key in this.flatpickrInstance!.config) {
        this.flatpickrInstance!.set(
          key as keyof BaseOptions,
          newOptions[key as keyof BaseOptions]
        );
      }
    });

    this.flatpickrInstance.redraw();

    hideEmptyYear();

    setTimeout(() => {
      if (this.flatpickrInstance && this.flatpickrInstance.calendarContainer) {
        setCalendarAttributes(this.flatpickrInstance);
        this.flatpickrInstance.calendarContainer.setAttribute(
          'aria-label',
          'Date picker'
        );
      } else {
        console.warn('Calendar container not available...');
      }
    }, 0);
  }

  setInitialDates(): void {
    if (!this.flatpickrInstance) return;

    try {
      if (this.defaultDate) {
        if (Array.isArray(this.defaultDate)) {
          const validDates = this.defaultDate
            .filter((date) => date && date !== '')
            .map((date) => {
              const parsed = new Date(date);
              return isNaN(parsed.getTime()) ? null : parsed;
            })
            .filter((date): date is Date => date !== null);

          if (validDates.length > 0) {
            this.value = this.mode === 'multiple' ? validDates : validDates[0];
            this.flatpickrInstance.setDate(validDates, false);
          }
        } else {
          const parsed = new Date(this.defaultDate);
          if (!isNaN(parsed.getTime())) {
            this.value = parsed;
            this.flatpickrInstance.setDate([parsed], false);
          }
        }
      } else if (this.value) {
        const dates = Array.isArray(this.value) ? this.value : [this.value];
        const validDates = dates.filter(
          (date): date is Date => date instanceof Date && !isNaN(date.getTime())
        );

        if (validDates.length > 0) {
          this.flatpickrInstance.setDate(validDates, false);
        }
      }
    } catch (error) {
      console.warn('Error setting initial dates:', error);
    }
  }

  async getComponentFlatpickrOptions(): Promise<Partial<BaseOptions>> {
    return getFlatpickrOptions({
      locale: this.locale,
      dateFormat: this.dateFormat,
      defaultDate: this.defaultDate ?? undefined,
      enableTime: this._enableTime,
      twentyFourHourFormat: this.twentyFourHourFormat ?? undefined,
      inputEl: this._inputEl!,
      minDate: this.minDate,
      maxDate: this.maxDate,
      enable: this.enable,
      disable: this.disable,
      mode: this.mode,
      closeOnSelect: !(this.mode === 'multiple' || this._enableTime),
      loadLocale,
      onOpen: this.handleOpen.bind(this),
      onClose: this.handleClose.bind(this),
      onChange: this.handleDateChange.bind(this),
    });
  }

  handleOpen(): void {
    if (!this._shouldFlatpickrOpen) {
      this.flatpickrInstance?.close();
      this._shouldFlatpickrOpen = true;
    }
  }

  async handleClose(): Promise<void> {
    this._hasInteracted = true;
    this._validate(true, false);
    await this.updateComplete;
  }

  async handleDateChange(
    selectedDates: Date[],
    dateStr: string
  ): Promise<void> {
    this._hasInteracted = true;

    if (this.mode === 'multiple') {
      this.value = selectedDates.length > 0 ? [...selectedDates] : null;
    } else {
      this.value = selectedDates.length > 0 ? selectedDates[0] : null;
    }

    let formattedDates;
    if (Array.isArray(this.value)) {
      formattedDates = this.value.map((date) => date.toISOString());
    } else if (this.value instanceof Date) {
      formattedDates = this.value.toISOString();
    } else {
      formattedDates = null;
    }

    emitValue(this, 'on-change', {
      dates: formattedDates,
      dateString: (this._inputEl as HTMLInputElement)?.value || dateStr,
    });

    this._validate(true, false);
    await this.updateComplete;
  }

  private setShouldFlatpickrOpen(value: boolean): void {
    this._shouldFlatpickrOpen = value;
  }

  private closeFlatpickr(): void {
    this.flatpickrInstance?.close();
  }

  private preventFlatpickrOpen(event: Event): void {
    preventFlatpickrOpen(event, this.setShouldFlatpickrOpen.bind(this));
  }

  private handleInputClickEvent(): void {
    handleInputClick(this.setShouldFlatpickrOpen.bind(this));
  }

  private handleInputFocusEvent(): void {
    handleInputFocus(
      this._shouldFlatpickrOpen,
      this.closeFlatpickr.bind(this),
      this.setShouldFlatpickrOpen.bind(this)
    );
  }

  private _validate(interacted: boolean, report: boolean): void {
    if (!this._inputEl || !(this._inputEl instanceof HTMLInputElement)) {
      return;
    }

    if (interacted) {
      this._hasInteracted = true;
    }

    const isEmpty = !this._inputEl.value.trim();
    const isRequired = this.required;

    let validity = this._inputEl.validity;
    let validationMessage = this._inputEl.validationMessage;

    if (isRequired && isEmpty) {
      validity = { ...validity, valueMissing: true };
      validationMessage = this.defaultErrorMessage;
    }

    if (this.invalidText) {
      validity = { ...validity, customError: true };
      validationMessage = this.invalidText;
    }

    const isValid = !validity.valueMissing && !validity.customError;

    this._internals.setValidity(validity, validationMessage, this._inputEl);
    this._isInvalid =
      !isValid && (this._hasInteracted || this.invalidText !== '');
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
    this._validate(false, false);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('change', this._onChange);
    this.removeEventListener('reset', this._handleFormReset);

    if (this.flatpickrInstance) {
      this.flatpickrInstance.destroy();
      this.flatpickrInstance = undefined;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-date-picker': DatePicker;
  }
}
