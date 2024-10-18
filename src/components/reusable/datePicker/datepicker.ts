import { html, LitElement, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { FormMixin } from '../../../common/mixins/form-input';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import {
  isSupportedLocale,
  injectFlatpickrStyles,
  langsArray,
  initializeSingleAnchorFlatpickr,
  getFlatpickrOptions,
  getPlaceholder,
  preventFlatpickrOpen,
  handleInputClick,
  handleInputFocus,
} from '../../../common/helpers/flatpickr';

import flatpickr from 'flatpickr';
import { BaseOptions } from 'flatpickr/dist/types/options';
import { Locale } from 'flatpickr/dist/types/locale';
import { default as English } from 'flatpickr/dist/l10n/default.js';

import DatePickerStyles from './datepicker.scss';
import ShidokaFlatpickrTheme from '../../../common/scss/shidoka-flatpickr-theme.scss';

import '@kyndryl-design-system/shidoka-foundation/components/icon';
import errorIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/close-filled.svg';
import calendarIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/calendar.svg';

type SupportedLocale = (typeof langsArray)[number];

const _defaultTextStrings = {
  requiredText: 'Required',
};

/**
 * Datepicker: uses flatpickr datetime picker library -- `https://flatpickr.js.org`
 * @fires on-change - Captures the input event and emits the selected value and original event details.
 * @slot tooltip - Slot for tooltip.
 */
@customElement('kyn-date-picker')
export class DatePicker extends FormMixin(LitElement) {
  static override styles = [DatePickerStyles, ShidokaFlatpickrTheme];

  /** Sets datepicker attribute name (ex: `contact-form-date-picker`). */
  @property({ type: String })
  nameAttr = '';

  /** Label text. */
  @property({ type: String })
  label = '';

  /* Sets desired locale and, if supported, dynamically loads language lib */
  @property({ type: String })
  locale: SupportedLocale = 'en';

  /** Sets flatpickr dateFormat attr (ex: `Y-m-d H:i`). */
  @property({ type: String })
  dateFormat = 'Y-m-d';

  /** Sets default error message. */
  @property({ type: String })
  defaultErrorMessage = '';

  /** Sets datepicker form input value to required/required. */
  @property({ type: Boolean })
  required = false;

  /** Sets pre-selected date/time value. */
  @property({ type: String })
  override value: string | Date | Date[] | null = null;

  /** Sets validation warning messaging. */
  @property({ type: String })
  warnText = '';

  /** Sets validation error messaging. */
  @property({ type: String })
  override invalidText = '';

  /** Sets flatpickr alternative formatting value (ex: `F j, Y`). */
  @property({ type: String })
  altFormat = '';

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

  /** Sets 24 hour formatting true/false. */
  @property({ type: Boolean })
  twentyFourHourFormat = false;

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
   * @ignore
   */
  @state()
  private _anchorEl?: HTMLElement;

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

  override render() {
    const errorId = `${this.nameAttr}-error-message`;
    const warningId = `${this.nameAttr}-warning-message`;
    const anchorId = this.nameAttr
      ? `${this.nameAttr}-${Math.random().toString(36).slice(2, 11)}`
      : `date-picker-${Math.random().toString(36).slice(2, 11)}`;
    const descriptionId = this.nameAttr ?? '';
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
                title=${this._textStrings?.requiredText || 'Required'}
                role="img"
                aria-label=${this._textStrings?.requiredText || 'Required'}
                >*</abbr
              >`
            : null}
          ${this.label}
          <slot name="tooltip"></slot>
        </div>

        <div class="input-wrapper">
          <input
            class="input-custom"
            type="text"
            id=${anchorId}
            name=${this.nameAttr}
            placeholder=${placeholder}
            ?disabled=${this.datePickerDisabled}
            ?required=${this.required}
            aria-invalid=${this._isInvalid ? 'true' : 'false'}
            aria-labelledby=${`label-${anchorId}`}
            @click=${this.handleInputClickEvent}
            @focus=${this.handleInputFocusEvent}
          />
          <span class="icon">${unsafeSVG(calendarIcon)}</span>
        </div>

        ${this.caption
          ? html`<div
              id=${descriptionId}
              class="caption"
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
    if (this._isInvalid) {
      return html`<div
        id=${errorId}
        class="error error-text"
        role="alert"
        aria-label=${this.errorAriaLabel || 'Error message'}
        title=${this.errorTitle || 'Error'}
        @mousedown=${this.preventFlatpickrOpen}
        @click=${this.preventFlatpickrOpen}
      >
        <span class="error-icon">${unsafeSVG(errorIcon)}</span>${this
          .invalidText || this.defaultErrorMessage}
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

  override async firstUpdated(
    changedProperties: PropertyValues
  ): Promise<void> {
    super.firstUpdated(changedProperties);

    injectFlatpickrStyles(ShidokaFlatpickrTheme.toString());

    await this.updateComplete;
    this.setupAnchor();
  }

  override updated(changedProperties: PropertyValues): void {
    super.updated(changedProperties);
    if (
      changedProperties.has('dateFormat') ||
      changedProperties.has('invalidText') ||
      changedProperties.has('locale') ||
      changedProperties.has('mode') ||
      changedProperties.has('minDate') ||
      changedProperties.has('maxDate')
    ) {
      this.updateEnableTime();
      this.reinitializeFlatpickr();
    }

    if (changedProperties.has('invalidText')) {
      this._validate();
    }
  }

  private updateEnableTime() {
    this._enableTime = this.dateFormat.includes('H:');
  }

  private async reinitializeFlatpickr() {
    if (this.flatpickrInstance) {
      this.flatpickrInstance.destroy();
    }
    await this.initializeFlatpickr();
  }

  async initializeFlatpickr(): Promise<void> {
    if (!this._anchorEl) return;

    if (this.flatpickrInstance) {
      this.flatpickrInstance.destroy();
    }

    this.flatpickrInstance = await initializeSingleAnchorFlatpickr({
      anchorEl: this._anchorEl,
      getFlatpickrOptions: this.getComponentFlatpickrOptions.bind(this),
      setCalendarAttributes: this.setCalendarAttributes.bind(this),
      setInitialDates: this.setInitialDates.bind(this),
      appendToBody: false,
    });

    this._validate();
  }

  private setupAnchor() {
    const inputEl =
      this.shadowRoot?.querySelector<HTMLInputElement>('.input-custom');
    if (inputEl) {
      this._anchorEl = inputEl;
      this.initializeFlatpickr();
    } else {
      console.error('Internal input element not found');
    }
  }

  setCalendarAttributes(): void {
    if (!(this._anchorEl instanceof HTMLInputElement)) {
      return;
    }

    if (this.flatpickrInstance && this.flatpickrInstance.calendarContainer) {
      this.flatpickrInstance.calendarContainer.setAttribute(
        'role',
        'application'
      );
      this.flatpickrInstance.calendarContainer.setAttribute(
        'aria-label',
        'Calendar'
      );
    }
  }

  setInitialDates(): void {
    if (this.value && this.flatpickrInstance) {
      this.flatpickrInstance.setDate(this.value, true);
    }
  }

  async loadLocale(locale: string): Promise<Locale> {
    if (locale === 'en') return English;

    if (!isSupportedLocale(locale)) {
      console.error(`Locale ${locale} not supported. Falling back to English.`);
      return English;
    }

    try {
      const module = await import(`flatpickr/dist/l10n/${locale}.js`);
      const localeConfig =
        module[locale] || module.default[locale] || module.default;

      if (!localeConfig) {
        throw new Error('Locale configuration not found');
      }

      return localeConfig;
    } catch (error) {
      console.error(
        `Failed to load locale ${locale}. Falling back to English.`,
        error
      );
      return English;
    }
  }

  async getComponentFlatpickrOptions(): Promise<Partial<BaseOptions>> {
    return getFlatpickrOptions({
      locale: this.locale,
      dateFormat: this.dateFormat,
      enableTime: this._enableTime,
      twentyFourHourFormat: this.twentyFourHourFormat,
      altFormat: this.altFormat,
      startAnchorEl: this._anchorEl!,
      minDate: this.minDate,
      maxDate: this.maxDate,
      enable: this.enable,
      disable: this.disable,
      mode: this.mode,
      closeOnSelect: !(this.mode === 'multiple' || this._enableTime),
      onOpen: this.handleOpen.bind(this),
      onClose: this.handleClose.bind(this),
      onChange: this.handleDateChange.bind(this),
      loadLocale: this.loadLocale.bind(this),
    });
  }

  handleOpen(): void {
    console.log('Flatpickr opened.');
    if (!this._shouldFlatpickrOpen) {
      console.log('Closing Flatpickr due to non-trigger element interaction.');
      this.flatpickrInstance?.close();
      this._shouldFlatpickrOpen = true;
    }
  }

  async handleClose(): Promise<void> {
    this._hasInteracted = true;
    this._validate();
    await this.updateComplete;
  }

  async handleDateChange(
    selectedDates: Date[],
    dateStr: string
  ): Promise<void> {
    if (this.mode === 'multiple') {
      this.value = [...selectedDates];
    } else {
      this.value = dateStr;
    }

    const formattedDates = Array.isArray(this.value)
      ? this.value.map((date) => date.toISOString())
      : this.value;

    const customEvent = new CustomEvent('on-change', {
      detail: {
        dates: formattedDates,
        dateString: (this._anchorEl as HTMLInputElement)?.value || dateStr,
      },
      bubbles: true,
      composed: true,
    });

    this.dispatchEvent(customEvent);

    this._validate();
    await this.updateComplete;
  }

  private setShouldFlatpickrOpen = (value: boolean) => {
    this._shouldFlatpickrOpen = value;
  };

  private closeFlatpickr = () => {
    this.flatpickrInstance?.close();
  };

  private preventFlatpickrOpen = (event: Event) => {
    preventFlatpickrOpen(event, this.setShouldFlatpickrOpen);
  };

  private handleInputClickEvent = () => {
    handleInputClick(this.setShouldFlatpickrOpen);
  };

  private handleInputFocusEvent = () => {
    handleInputFocus(
      this._shouldFlatpickrOpen,
      this.closeFlatpickr,
      this.setShouldFlatpickrOpen
    );
  };

  private _validate(): void {
    const hasValidDate = this.value !== null && this.value !== '';

    this._isInvalid =
      !!this.invalidText ||
      (this.required && this._hasInteracted && !hasValidDate);

    this.requestUpdate();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();

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
