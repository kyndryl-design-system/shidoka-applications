import { html, LitElement, PropertyValues } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { FormMixin } from '../../../common/mixins/form-input';
import { deepmerge } from 'deepmerge-ts';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import {
  langsArray,
  isSupportedLocale,
  injectFlatpickrStyles,
  initializeFlatpickr,
} from '../../../common/helpers/flatpickr';

import flatpickr from 'flatpickr';
import { BaseOptions } from 'flatpickr/dist/types/options';
import { Locale } from 'flatpickr/dist/types/locale';
import type { Instance } from 'flatpickr/dist/types/instance';
import { default as English } from 'flatpickr/dist/l10n/default.js';

import TimepickerStyles from './timepicker.scss';
import ShidokaDatePickerTheme from '../../../common/scss/date-picker-theme.scss';

import '@kyndryl-design-system/shidoka-foundation/components/icon';
import clockIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/time.svg';
import errorIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/close-filled.svg';

const _defaultTextStrings = {
  requiredText: 'Required',
};

type SupportedLocale = (typeof langsArray)[number];

/**
 * Timepicker: uses flatpickr datetime picker library, timepicker implementation -- `https://flatpickr.js.org/examples/#time-picker`
 * @fires on-change - Captures the input event and emits the selected value and original event details.
 * @slot unnamed - Slot for label text.
 */
@customElement('kyn-time-picker')
export class TimePicker extends FormMixin(LitElement) {
  static override styles = [TimepickerStyles, ShidokaDatePickerTheme];

  /** Sets timepicker attribute name (ex: `contact-form-time-picker`). */
  @property({ type: String })
  nameAttr = '';

  /* Sets desired locale and, if supported, dynamically loads language lib */
  @property({ type: String })
  locale: SupportedLocale = 'en';

  /** Sets datepicker container size. */
  @property({ type: String })
  size: 'sm' | 'md' | 'lg' = 'md';

  /** Sets pre-selected date/time value. */
  @property({ type: Number })
  override value: number | null = null;

  /** Sets default time value. */
  @property({ type: String })
  defaultDate = '';

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

  /** Customizable text strings. */
  @property({ type: Object })
  textStrings = _defaultTextStrings;

  /** Internal text strings.
   * @internal
   */
  @state()
  _textStrings = _defaultTextStrings;

  /** Flatpickr instantiation.
   * @internal
   */
  @state()
  private flatpickrInstance?: flatpickr.Instance;

  /**
   * Assists in handling rapid clicks/changes to time input.
   * @internal
   */
  private _debounceTimer: number | null = null;

  /**
   * Ensure correct displayed time format.
   * @internal
   */
  @state()
  private _displayValue = '';

  /**
   * Queries the <input> DOM element.
   * @ignore
   */
  @query('input')
  private inputEl!: HTMLInputElement;

  override render() {
    const inputId = this.nameAttr || 'time-picker-input';
    const errorId = 'error-message';
    const warningId = 'warning-message';
    const descriptionId = 'time-picker-description';

    return html`<div class=${classMap(this.getTimepickerClasses())}>
      <label
        class="label-text"
        for=${inputId}
        ?disabled=${this.timepickerDisabled}
      >
        ${this.required
          ? html`<abbr
              class="required"
              title=${this._textStrings.requiredText}
              aria-label=${this._textStrings.requiredText}
              >*</abbr
            >`
          : null}
        <slot></slot>
      </label>

      <div class="input-container">
        <input
          type="text"
          id=${inputId}
          placeholder=${this.getPlaceholder()}
          ?disabled=${this.timepickerDisabled}
          .value=${this._displayValue}
          aria-required=${this.required ? 'true' : 'false'}
          aria-invalid=${this._isInvalid ? 'true' : 'false'}
        />
        <span class="icon">${unsafeSVG(clockIcon)}</span>
      </div>

      ${this.caption
        ? html`<div id=${descriptionId} class="caption options-text">
            ${this.caption}
          </div>`
        : ''}
      ${this._isInvalid || this.invalidText
        ? html`<div id=${errorId} class="error error-text" role="alert">
            <span class="error-icon">${unsafeSVG(errorIcon)}</span>${this
              .invalidText || this._internalValidationMsg}
          </div>`
        : this.warnText
        ? html`<div id=${warningId} class="warn warn-text" role="alert">
            ${this.warnText}
          </div>`
        : ''}
    </div>`;
  }

  getTimepickerClasses() {
    return {
      'time-picker': true,
      [`time-picker__size--${this.size}`]: true,
      'time-picker__disabled': this.timepickerDisabled,
    };
  }

  getPlaceholder(): string {
    return this.twentyFourHourFormat ? '--:--' : '--:-- --';
  }

  override async firstUpdated(
    changedProperties: PropertyValues
  ): Promise<void> {
    super.firstUpdated(changedProperties);
    if (this.inputEl) {
      // allows for custom styles to be applied to flatpickr's appended calendar overlay
      injectFlatpickrStyles(ShidokaDatePickerTheme.toString());

      this.flatpickrInstance = await initializeFlatpickr({
        startDateInputEl: this.inputEl,
        getFlatpickrOptions: this.getFlatpickrOptions.bind(this),
        setCalendarAttributes: this.setCalendarAttributes.bind(this),
      });
    } else {
      console.error('Input element not found.');
    }
  }

  override async updated(changedProperties: PropertyValues): Promise<void> {
    await super.updated(changedProperties);

    if (
      changedProperties.has('dateFormat') ||
      changedProperties.has('defaultDate') ||
      changedProperties.has('maxTime') ||
      changedProperties.has('minTime') ||
      changedProperties.has('twentyFourHourFormat') ||
      changedProperties.has('locale')
    ) {
      if (this.flatpickrInstance) {
        await this.updateFlatpickrOptions();
      } else {
        this.flatpickrInstance = await initializeFlatpickr({
          startDateInputEl: this.inputEl,
          getFlatpickrOptions: this.getFlatpickrOptions.bind(this),
          setCalendarAttributes: this.setCalendarAttributes.bind(this),
        });
      }
    }
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

      const { amPM, hourAriaLabel, minuteAriaLabel } = localeConfig;
      return { amPM, hourAriaLabel, minuteAriaLabel };
    } catch (error) {
      console.warn(
        `Failed to load locale ${locale}. Falling back to English.`,
        error
      );
      return English;
    }
  }

  async getFlatpickrOptions(): Promise<Partial<BaseOptions>> {
    const options: Partial<BaseOptions> = {
      noCalendar: true,
      dateFormat: 'H:i',
      enableTime: true,
      allowInput: false,
      clickOpens: true,
      time_24hr: this.twentyFourHourFormat,
      wrap: false,
      locale: English,
      onChange: this.handleTimeInputChange.bind(this),
    };

    if (this.locale) {
      options.locale = await this.loadLocale(this.locale);
    }

    if (this.minTime) {
      options.minTime = this.minTime;
    }

    if (this.maxTime) {
      options.maxTime = this.maxTime;
    }

    if (this.defaultDate) {
      options.defaultDate = this.defaultDate;
    }

    return options;
  }

  async initializeFlatpickr(): Promise<void> {
    if (!this.inputEl) {
      console.error('Input element not found.');
      return;
    }

    try {
      const options = await this.getFlatpickrOptions();

      this.flatpickrInstance = flatpickr(this.inputEl, options) as Instance;

      if (this.flatpickrInstance) {
        if (this.flatpickrInstance.calendarContainer) {
          this.flatpickrInstance.calendarContainer.setAttribute(
            'role',
            'application'
          );
          this.flatpickrInstance.calendarContainer.setAttribute(
            'aria-label',
            'time-picker-container'
          );
        }
      } else {
        console.error('Unable to create flatpickr instance');
      }
    } catch (error) {
      console.error('Error initializing Flatpickr:', error);
    }
  }

  async updateFlatpickrOptions(): Promise<void> {
    if (this.flatpickrInstance) {
      const currentDate = this.flatpickrInstance.selectedDates[0];

      try {
        const newOptions = await this.getFlatpickrOptions();

        Object.keys(newOptions).forEach((key) => {
          if (key in this.flatpickrInstance!.config) {
            this.flatpickrInstance!.set(
              key as keyof BaseOptions,
              newOptions[key as keyof BaseOptions]
            );
          }
        });

        if (this.defaultDate) {
          const defaultDateObj = new Date(this.defaultDate);
          if (!isNaN(defaultDateObj.getTime())) {
            this.flatpickrInstance.setDate(defaultDateObj, false);
          }
        } else if (currentDate) {
          this.flatpickrInstance.setDate(currentDate, false);
        }

        if (this.flatpickrInstance.calendarContainer) {
          this.flatpickrInstance.calendarContainer.setAttribute(
            'role',
            'application'
          );
          this.flatpickrInstance.calendarContainer.setAttribute(
            'aria-label',
            'time-picker-container'
          );
        }

        this.requestUpdate();
      } catch (error) {
        console.error('Error updating Flatpickr options:', error);
      }
    }
  }

  handleTimeInputChange(_selectedDates: Date[], dateStr: string): void {
    const [hours, minutes] = dateStr.split(':').map(Number);

    const today = new Date();
    today.setHours(hours, minutes, 0, 0);

    const selectedTime = today.getTime();

    this.value = selectedTime;

    this._displayValue = dateStr;

    this.emitValue(dateStr);
    this.requestUpdate('value', '');
    this._validate();
  }

  private emitValue(timeStr: string): void {
    const event = new CustomEvent('on-change', {
      detail: { time: timeStr },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  _validate(): boolean {
    if (this.required && !this.value) {
      this._isInvalid = true;
      this._internalValidationMsg = 'This field is required';
      return false;
    }

    this._isInvalid = false;
    this._internalValidationMsg = '';
    return true;
  }

  override willUpdate(changedProps: any) {
    if (changedProps.has('textStrings')) {
      this._textStrings = deepmerge(_defaultTextStrings, this.textStrings);
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();

    if (this.flatpickrInstance) {
      this.flatpickrInstance.destroy();
      this.flatpickrInstance = undefined;
    }

    // prevents flatpickr calendar overlay from persisting on view change
    const calendarElements = document.querySelectorAll('.flatpickr-calendar');
    calendarElements.forEach((calendar) => {
      calendar.remove();
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-time-picker': TimePicker;
  }
}
