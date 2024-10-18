import { html, LitElement, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { FormMixin } from '../../../common/mixins/form-input';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import {
  langsArray,
  isSupportedLocale,
  injectFlatpickrStyles,
  initializeSingleAnchorFlatpickr,
  getFlatpickrOptions,
  preventFlatpickrOpen,
  handleInputClick,
  handleInputFocus,
} from '../../../common/helpers/flatpickr';

import flatpickr from 'flatpickr';
import { BaseOptions } from 'flatpickr/dist/types/options';
import { Locale } from 'flatpickr/dist/types/locale';
import { default as English } from 'flatpickr/dist/l10n/default.js';

import TimepickerStyles from './timepicker.scss';
import ShidokaFlatpickrTheme from '../../../common/scss/shidoka-flatpickr-theme.scss';

import '@kyndryl-design-system/shidoka-foundation/components/icon';
import errorIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/close-filled.svg';
import clockIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/time.svg';

type SupportedLocale = (typeof langsArray)[number];

const _defaultTextStrings = {
  requiredText: 'Required',
};

/**
 * Timepicker: uses flatpickr datetime picker library, timepicker implementation -- `https://flatpickr.js.org/examples/#time-picker`
 * @fires on-change - Captures the input event and emits the selected value and original event details.
 * @slot tooltip - Slot for tooltip.
 */
@customElement('kyn-time-picker')
export class TimePicker extends FormMixin(LitElement) {
  static override styles = [TimepickerStyles, ShidokaFlatpickrTheme];

  /** Sets timepicker attribute name (ex: `contact-form-time-picker`). */
  @property({ type: String })
  nameAttr = '';

  /** Label text. */
  @property({ type: String })
  label = '';

  /** Sets desired locale and, if supported, dynamically loads language lib */
  @property({ type: String })
  locale: SupportedLocale = 'en';

  /** Sets pre-selected date/time value. */
  @property({ type: Number })
  override value: number | null = null;

  /** Sets default time value. */
  @property({ type: String })
  defaultDate = '';

  /** Sets default error message. */
  @property({ type: String })
  defaultErrorMessage = '';

  /** Sets validation warning messaging. */
  @property({ type: String })
  warnText = '';

  /** Sets validation error messaging. */
  @property({ type: String })
  override invalidText = '';

  /** Sets caption to be displayed under primary date picker elements. */
  @property({ type: String })
  caption = '';

  /** Sets datepicker form input value to required/required. */
  @property({ type: Boolean })
  required = false;

  /** Sets entire datepicker form element to enabled/disabled. */
  @property({ type: Boolean })
  timepickerDisabled = false;

  /** Sets 24 hour formatting true/false. */
  @property({ type: Boolean })
  twentyFourHourFormat = false;

  /** Sets lower boundary of datepicker date selection. */
  @property({ type: String })
  minTime: string | number | Date = '';

  /** Sets upper boundary of datepicker date selection. */
  @property({ type: String })
  maxTime: string | number | Date = '';

  /**
   * Sets whether user has interacted with timepicker for error handling.
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

  /** Control flag to determine if Flatpickr should open
   * @internal
   */
  private _shouldFlatpickrOpen = true;

  override render() {
    const errorId = `${this.nameAttr}-error-message`;
    const warningId = `${this.nameAttr}-warning-message`;
    const anchorId = this.nameAttr
      ? `${this.nameAttr}-${Math.random().toString(36).slice(2, 11)}`
      : `time-picker-${Math.random().toString(36).slice(2, 11)}`;
    const descriptionId = this.nameAttr ?? '';
    const placeholder = 'hh:mm';

    return html`
      <div class=${classMap(this.getTimepickerClasses())}>
        <!-- Use <div> for label to prevent default label behavior -->
        <div
          class="label-text"
          @mousedown=${this.preventFlatpickrOpen}
          @click=${this.preventFlatpickrOpen}
          ?disabled=${this.timepickerDisabled}
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
            ?disabled=${this.timepickerDisabled}
            ?required=${this.required}
            aria-invalid=${this._isInvalid ? 'true' : 'false'}
            aria-labelledby=${`label-${anchorId}`}
            @click=${this.handleInputClickEvent}
            @focus=${this.handleInputFocusEvent}
          />
          <span class="icon">${unsafeSVG(clockIcon)}</span>
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
        @mousedown=${this.preventFlatpickrOpen}
        @click=${this.preventFlatpickrOpen}
      >
        ${this.warnText}
      </div>`;
    }

    return null;
  }

  getTimepickerClasses() {
    return {
      'time-picker': true,
      'time-picker__disabled': this.timepickerDisabled,
    };
  }

  override async firstUpdated(changedProperties: PropertyValues) {
    super.firstUpdated(changedProperties);
    injectFlatpickrStyles(ShidokaFlatpickrTheme.toString());
    await this.updateComplete;
    this.setupAnchor();
  }

  override async updated(changedProperties: PropertyValues) {
    await super.updated(changedProperties);
    if (
      changedProperties.has('defaultDate') ||
      changedProperties.has('invalidText') ||
      changedProperties.has('minTime') ||
      changedProperties.has('maxTime')
    ) {
      if (this.flatpickrInstance) {
        await this.updateFlatpickrOptions();
      } else {
        this.initializeFlatpickr();
      }
    }

    if (changedProperties.has('invalidText')) {
      this._validate();
    }
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

  async initializeFlatpickr(): Promise<void> {
    if (!this._anchorEl) return;
    if (this.flatpickrInstance) this.flatpickrInstance.destroy();

    this.flatpickrInstance = await initializeSingleAnchorFlatpickr({
      anchorEl: this._anchorEl,
      getFlatpickrOptions: this.getComponentFlatpickrOptions.bind(this),
      setCalendarAttributes: this.setCalendarAttributes.bind(this),
      setInitialDates: undefined,
      appendToBody: false,
    });
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
    this.setCalendarAttributes();
    this._validate();
  }

  setCalendarAttributes(): void {
    if (this.flatpickrInstance?.calendarContainer) {
      this.flatpickrInstance.calendarContainer.setAttribute(
        'role',
        'application'
      );
      this.flatpickrInstance.calendarContainer.setAttribute(
        'aria-label',
        'time-picker-container'
      );
    }
  }

  async loadLocale(locale: string): Promise<Partial<Locale>> {
    if (locale === 'en') return English;
    if (!isSupportedLocale(locale)) {
      console.warn(`Unsupported locale: ${locale}. Falling back to English.`);
      return English;
    }

    try {
      const module = await import(`flatpickr/dist/l10n/${locale}.js`);
      const localeConfig =
        module[locale] || module.default[locale] || module.default;
      if (!localeConfig) throw new Error('Locale configuration not found');
      return localeConfig;
    } catch (error) {
      console.warn(
        `Failed to load locale ${locale}. Falling back to English.`,
        error
      );
      return English;
    }
  }

  async getComponentFlatpickrOptions(): Promise<Partial<BaseOptions>> {
    return getFlatpickrOptions({
      locale: this.locale,
      enableTime: true,
      twentyFourHourFormat: this.twentyFourHourFormat,
      startAnchorEl: this._anchorEl!,
      allowInput: true,
      dateFormat: !this.twentyFourHourFormat ? 'h:i K' : 'H:i',
      minTime: this.minTime,
      maxTime: this.maxTime,
      defaultDate: this.defaultDate,
      loadLocale: this.loadLocale.bind(this),
      mode: 'time',
      noCalendar: true,
      onChange: this.handleTimeChange.bind(this),
      onClose: this.handleClose.bind(this),
      onOpen: this.handleOpen.bind(this),
    });
  }

  handleOpen(): void {
    // future: custom logic of onOpen
  }

  async handleClose(): Promise<void> {
    this._hasInteracted = true;
    this._validate();
    await this.updateComplete;
  }

  async handleTimeChange(
    selectedDates: Date[],
    dateStr: string
  ): Promise<void> {
    this._hasInteracted = true;

    if (selectedDates.length > 0) {
      this.value = selectedDates[0].getTime();
      this.emitValue(dateStr);
    } else {
      this.value = null;
      this.emitValue('');
    }

    this._validate();
    await this.updateComplete;
  }

  private emitValue(timeStr: string): void {
    this.dispatchEvent(
      new CustomEvent('on-change', {
        detail: { time: timeStr },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _validate(): void {
    const hasValidTime = this.value !== null;

    this._isInvalid =
      !!this.invalidText ||
      (this.required && this._hasInteracted && !hasValidTime);

    this.requestUpdate();
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
    'kyn-time-picker': TimePicker;
  }
}
