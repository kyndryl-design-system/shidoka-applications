import { html, LitElement, PropertyValues } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { FormMixin } from '../../../common/mixins/form-input';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import {
  langsArray,
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
} from '../../../common/helpers/flatpickr';
import '../../reusable/button';

import { BaseOptions } from 'flatpickr/dist/types/options';
import type { Instance } from 'flatpickr/dist/types/instance';

import DateRangePickerStyles from './daterangepicker.scss';
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
  locale: SupportedLocale = 'en';

  /** Sets flatpickr value to define how the date will be displayed in the input box (ex: `Y-m-d H:i`). */
  @property({ type: String })
  dateFormat = 'Y-m-d';

  /** Sets the initial selected date(s). For range mode, provide an array of date strings matching dateFormat (e.g. ["2024-01-01", "2024-01-07"]). */
  @property({ type: Array })
  defaultDate: string | string[] | null = null;

  /** Sets default error message. */
  @property({ type: String })
  defaultErrorMessage = '';

  /** Sets date/time range value. */
  @property({ type: Array })
  override value: [Date | null, Date | null] = [null, null];

  /** Sets validation warning messaging. */
  @property({ type: String })
  warnText = '';

  /** Sets flatpickr options setting to disable specific dates. */
  @property({ type: Array })
  disable: (string | number | Date)[] = [];

  /** Sets flatpickr options setting to enable specific dates. */
  @property({ type: Array })
  enable: (string | number | Date)[] = [];

  /** Sets caption to be displayed under primary date picker elements. */
  @property({ type: String })
  caption = '';

  /** Sets date range picker form input value to required/required. */
  @property({ type: Boolean })
  required = false;

  /** Input size. "sm", "md", or "lg". */
  @property({ type: String })
  size = 'md';

  /** Sets entire date range picker form element to enabled/disabled. */
  @property({ type: Boolean })
  dateRangePickerDisabled = false;

  /** Input read only state. */
  @property({ type: Boolean })
  readonly = false;

  /** Sets 24 hour formatting true/false.
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

  /** Control flag to prevent Flatpickr from opening when clicking caption, error, label, or warning elements.
   * @internal
   */
  @state()
  private _shouldFlatpickrOpen = false;

  /** Track initialization state
   * @internal
   */
  private _initialized = false;

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
      : `date-range-picker-${Math.random().toString(36).slice(2, 11)}`;
    const descriptionId = this.name ?? '';

    const placeholder = getPlaceholder(this.dateFormat, true);

    return html`
      <div class=${classMap(this.getDateRangePickerClasses())}>
        <div
          class="label-text"
          @mousedown=${this.preventFlatpickrOpen}
          @click=${this.preventFlatpickrOpen}
          ?disabled=${this.dateRangePickerDisabled || this.readonly}
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
            ?disabled=${this.dateRangePickerDisabled || this.readonly}
            ?readonly=${this.readonly}
            ?required=${this.required}
            ?invalid=${this._isInvalid}
            aria-invalid=${this._isInvalid ? 'true' : 'false'}
            aria-labelledby=${`label-${anchorId}`}
            @click=${this.handleInputClickEvent}
            @focus=${this.handleInputFocusEvent}
          />
          ${(this.value &&
            Array.isArray(this.value) &&
            this.value.length === 2 &&
            this.value[0] !== null &&
            this.value[1] !== null) ||
          (this.defaultDate &&
            Array.isArray(this.defaultDate) &&
            this.defaultDate.length === 2 &&
            this.defaultDate[0] &&
            this.defaultDate[1] &&
            this.defaultDate[0] !== '' &&
            this.defaultDate[1] !== '')
            ? html`
                <kyn-button
                  ?disabled=${this.dateRangePickerDisabled || this.readonly}
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
              aria-disabled=${this.dateRangePickerDisabled}
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

  private _handleClear(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    if (this.flatpickrInstance) {
      this.flatpickrInstance.clear();
    }

    if (this._inputEl) {
      this._inputEl.value = '';
    }

    this.value = [null, null];
    this.defaultDate = [];

    this._validate(true, false);
    this.requestUpdate();
  }

  getDateRangePickerClasses() {
    return {
      'date-range-picker': true,
      'date-range-picker__enable-time': this._enableTime,
      'date-range-picker__disabled': this.dateRangePickerDisabled,
      'date-range-picker__read-only': this.readonly,
    };
  }

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
      changedProperties.has('minDate') ||
      changedProperties.has('defaultDate') ||
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
      changedProperties.has('dateRangePickerDisabled') &&
      this.dateRangePickerDisabled &&
      this.flatpickrInstance
    ) {
      this.flatpickrInstance.close();
    }
  }

  private async setupAnchor() {
    if (this._inputEl) {
      await this.initializeFlatpickr();
    }
  }

  private async initializeFlatpickr() {
    if (!this._inputEl) return;
    if (this.flatpickrInstance) this.flatpickrInstance.destroy();

    this.flatpickrInstance = await initializeSingleAnchorFlatpickr({
      inputEl: this._inputEl,
      getFlatpickrOptions: this.getComponentFlatpickrOptions.bind(this),
      setCalendarAttributes: (instance) => {
        if (instance && instance.calendarContainer) {
          setCalendarAttributes(instance);
          instance.calendarContainer.setAttribute(
            'aria-label',
            'Date range calendar'
          );
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

  async getComponentFlatpickrOptions(): Promise<Partial<BaseOptions>> {
    return getFlatpickrOptions({
      locale: this.locale,
      dateFormat: this.dateFormat,
      defaultDate: this.defaultDate ?? undefined,
      enableTime: this._enableTime,
      twentyFourHourFormat: this.twentyFourHourFormat ?? undefined,
      mode: 'range',
      allowInput: false,
      inputEl: this._inputEl!,
      minDate: this.minDate,
      maxDate: this.maxDate,
      enable: this.enable,
      disable: this.disable,
      loadLocale,
      onChange: this.handleDateChange.bind(this),
      onClose: this.handleClose.bind(this),
      onOpen: this.handleOpen.bind(this),
    });
  }

  async updateFlatpickrOptions() {
    if (!this.flatpickrInstance) return;

    const currentDates = this.flatpickrInstance.selectedDates;
    const newOptions = await this.getComponentFlatpickrOptions();

    Object.keys(newOptions).forEach((key) => {
      this.flatpickrInstance!.set(
        key as keyof BaseOptions,
        newOptions[key as keyof BaseOptions]
      );
    });

    this.flatpickrInstance.redraw();

    hideEmptyYear();

    if (currentDates && currentDates.length === 2) {
      this.flatpickrInstance.setDate(currentDates, false);
    }

    setTimeout(() => {
      if (this.flatpickrInstance && this.flatpickrInstance.calendarContainer) {
        setCalendarAttributes(this.flatpickrInstance);
        this.flatpickrInstance.calendarContainer.setAttribute(
          'aria-label',
          'Date range calendar'
        );
      } else {
        console.warn('Calendar container not available...');
      }
    }, 0);
  }

  setInitialDates(): void {
    if (!this.flatpickrInstance) return;

    try {
      if (Array.isArray(this.defaultDate)) {
        const validDates = this.defaultDate
          .filter((date) => date && date !== '')
          .map((date) => {
            const parsed = new Date(date);
            return isNaN(parsed.getTime()) ? null : parsed;
          })
          .filter((date): date is Date => date !== null);

        if (validDates.length === 2) {
          this.value = validDates as [Date, Date];
          this.flatpickrInstance.setDate(validDates, false);
        }
      } else if (Array.isArray(this.value) && this.value.length === 2) {
        const validDates = this.value
          .map((date) =>
            date instanceof Date && !isNaN(date.getTime()) ? date : null
          )
          .filter((date): date is Date => date !== null);

        if (validDates.length === 2) {
          this.flatpickrInstance.setDate(validDates, false);
        }
      }
    } catch (error) {
      console.warn('Error setting initial dates:', error);
    }
  }

  handleOpen(): void {
    if (!this._shouldFlatpickrOpen) {
      this.flatpickrInstance?.close();
      this._shouldFlatpickrOpen = true;
    }
  }

  async handleDateChange(selectedDates: Date[]): Promise<void> {
    this._hasInteracted = true;

    if (selectedDates.length === 0) {
      this.value = [null, null];
    } else if (selectedDates.length === 1) {
      this.value = [selectedDates[0], null];
    } else {
      this.value = [selectedDates[0], selectedDates[1]];
    }

    if (selectedDates.length === 2) {
      const formattedDates = selectedDates.map((date) => date.toISOString());
      const dateString = this._inputEl?.value || formattedDates.join(' to ');

      emitValue(this, 'on-change', {
        dates: formattedDates,
        dateString,
      });
    }

    this.updateSelectedDateRangeAria(selectedDates);
    this._validate(true, false);
    await this.updateComplete;
  }

  async handleClose() {
    this._hasInteracted = true;

    if (
      this.flatpickrInstance &&
      this.flatpickrInstance.selectedDates &&
      this.flatpickrInstance.selectedDates.length === 1
    ) {
      this.flatpickrInstance.clear();
      if (this._inputEl) {
        this._inputEl.value = '';
      }
      this.value = [null, null];
    }

    this._validate(true, false);
    await this.updateComplete;
  }

  updateSelectedDateRangeAria(selectedDates: Date[]) {
    if (selectedDates.length === 2) {
      const [startDate, endDate] = selectedDates;
      this._inputEl?.setAttribute(
        'aria-label',
        `Selected date range: ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`
      );
    } else {
      this._inputEl?.setAttribute('aria-label', 'Date range');
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

  private _validate(interacted: boolean, report: boolean): void {
    if (!this._inputEl || !(this._inputEl instanceof HTMLInputElement)) {
      return;
    }

    if (interacted) {
      this._hasInteracted = true;
    }

    const isEmpty =
      !this._inputEl.value.trim() || !this.value[0] || !this.value[1];
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
    this.value = [null, null];
    if (this.flatpickrInstance) {
      this.flatpickrInstance.clear();
    }
    this._hasInteracted = false;
    this._validate(false, false);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('change', this._onChange);
    this.removeEventListener('reset', this._handleFormReset);
    this.flatpickrInstance?.destroy();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-date-range-picker': DateRangePicker;
  }
}
