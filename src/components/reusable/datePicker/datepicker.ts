import { html, LitElement, PropertyValues } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { FormMixin } from '../../../common/mixins/form-input';
import { deepmerge } from 'deepmerge-ts';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import {
  isSupportedLocale,
  injectFlatpickrStyles,
  langsArray,
} from '../../../common/helpers/flatpickr';

import flatpickr from 'flatpickr';
import { BaseOptions } from 'flatpickr/dist/types/options';
import { Locale } from 'flatpickr/dist/types/locale';
import { default as English } from 'flatpickr/dist/l10n/default.js';

import DatePickerStyles from './datepicker.scss';
import ShidokaDatePickerTheme from '../../../common/scss/shidoka-flatpickr-theme.scss';

import '@kyndryl-design-system/shidoka-foundation/components/icon';
import '@kyndryl-design-system/shidoka-foundation/components/button';
import errorIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/close-filled.svg';
import { Instance } from 'flatpickr/dist/types/instance';

const _defaultTextStrings = {
  requiredText: 'Required',
};

type SupportedLocale = (typeof langsArray)[number];

/**
 * Datepicker: uses flatpickr datetime picker library -- `https://flatpickr.js.org`
 * @fires on-change - Captures the input event and emits the selected value and original event details.
 * @slot unnamed - Slotted anchor.
 * @slot label - Slotted input label.
 * @slot icon - Slotted anchor helper icon.
 */
@customElement('kyn-date-picker')
export class DatePicker extends FormMixin(LitElement) {
  static override styles = [DatePickerStyles, ShidokaDatePickerTheme];

  /** Sets datepicker attribute name (ex: `contact-form-date-picker`). */
  @property({ type: String })
  nameAttr = '';

  /* Sets desired locale and, if supported, dynamically loads language lib */
  @property({ type: String })
  locale: SupportedLocale = 'en';

  /** Sets flatpickr dateFormat attr (ex: `Y-m-d H:i`). */
  @property({ type: String })
  dateFormat = '';

  /** Sets pre-selected date/time value. */
  @property({ type: String })
  override value: string | Date | Date[] = '';

  /** Sets validation warning messaging. */
  @property({ type: String })
  warnText = '';

  /** Sets validation error messaging. */
  @property({ type: String })
  override invalidText = '';

  /** Sets flatpickr alternative formatting value (ex: `F j, Y`). */
  @property({ type: String })
  altFormat = '';

  /** Sets flatpcikr options setting to disable specific dates. */
  @property({ type: Array })
  disable: (string | number | Date)[] = [];

  /** Sets flatpcikr options setting to enable specific dates. */
  @property({ type: Array })
  enable: (string | number | Date)[] = [];

  /** Sets flatpickr mode to select single (default), multiple dates. */
  @property({ type: String })
  mode: 'single' | 'multiple' = 'single';

  /** Sets caption to be displayed under primary date picker elements. */
  @property({ type: String })
  caption = '';

  /** Sets datepicker form input value to required/required. */
  @property({ type: Boolean })
  required = false;

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

  /** Customizable text strings. */
  @property({ type: Object })
  textStrings = _defaultTextStrings;

  /** Internal text strings.
   * @internal
   */
  @state()
  _textStrings = _defaultTextStrings;

  /** Detects whether time format includes time values.
   * @internal
   */
  @state()
  _enableTime = false;

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

  /**
   * Queries the anchor slotted DOM element.
   * @internal
   */
  @query('slot[name="anchor"]')
  private anchorSlot!: HTMLSlotElement;

  override render() {
    const errorId = 'error-message';
    const warningId = 'warning-message';
    const descriptionId = 'date-picker-description';

    return html`
      <div class=${classMap(this.getDatepickerClasses())}>
        <slot name="label"></slot>
        <div class="anchor-wrapper">
          <slot name="anchor"></slot>
          <slot name="icon" class="icon"></slot>
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
      </div>
    `;
  }

  getDatepickerClasses() {
    return {
      'date-picker': true,
      [`date-picker__time-variation-${this._enableTime}`]: true,
      [`date-picker__multiple-select-${this.mode === 'multiple'}`]: true,
      'date-picker__disabled': this.datePickerDisabled,
    };
  }

  override async firstUpdated(
    changedProperties: PropertyValues
  ): Promise<void> {
    super.firstUpdated(changedProperties);
    this._enableTime = this.dateFormat.includes('H:');

    injectFlatpickrStyles(ShidokaDatePickerTheme.toString());

    await this.updateComplete;
    this.setupAnchor();
  }

  private setupAnchor() {
    const assignedNodes = this.anchorSlot.assignedNodes({ flatten: true });
    this._anchorEl = assignedNodes.find(
      (node): node is HTMLElement => node instanceof HTMLElement
    );

    if (this._anchorEl) {
      this.initializeFlatpickr();
    } else {
      console.error('Anchor element not found in the slotted content');
    }
  }

  override updated(changedProperties: PropertyValues): void {
    super.updated(changedProperties);
    if (
      changedProperties.has('dateFormat') ||
      changedProperties.has('locale') ||
      changedProperties.has('mode') ||
      changedProperties.has('minDate') ||
      changedProperties.has('maxDate')
    ) {
      this._enableTime = this.dateFormat.includes('H:');
      this.initializeFlatpickr();
    }
  }

  async initializeFlatpickr(): Promise<void> {
    if (!this._anchorEl) {
      console.error('Cannot initialize Flatpickr: _anchorEl is undefined');
      return;
    }

    const options = await this.getFlatpickrOptions();

    let hiddenInputElement: HTMLInputElement;

    if (this._anchorEl instanceof HTMLInputElement) {
      hiddenInputElement = this._anchorEl;
    } else {
      hiddenInputElement = document.createElement('input');
      hiddenInputElement.type = 'text';

      hiddenInputElement.style.visibility = 'hidden';
      hiddenInputElement.style.position = 'absolute';
      hiddenInputElement.style.left = '-9999px';
      hiddenInputElement.style.width = '0';
      hiddenInputElement.style.height = '0';

      this.appendChild(hiddenInputElement);
    }

    this.flatpickrInstance = flatpickr(hiddenInputElement, options) as Instance;

    if (this.flatpickrInstance) {
      this.setCalendarAttributes();
      this.setInitialDates();

      if (!(this._anchorEl instanceof HTMLInputElement)) {
        this._anchorEl.addEventListener('click', () => {
          this.flatpickrInstance?.open();
        });
      }
    } else {
      console.error('Failed to initialize Flatpickr');
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
      console.error(`Unable to load ${locale} -- falling back to English.`);
      return English;
    }

    try {
      const module = await import(`flatpickr/dist/l10n/${locale}.js`);

      let localeConfig: Locale;

      if (module[locale]) {
        localeConfig = module[locale];
      } else if (module.default && module.default[locale]) {
        localeConfig = module.default[locale];
      } else if (module.default && typeof module.default === 'object') {
        localeConfig = module.default;
      } else {
        throw new Error('Unable to find locale configuration');
      }

      return localeConfig;
    } catch (error) {
      console.error(
        `Unable to load ${locale} -- falling back to English.`,
        error
      );
      return English;
    }
  }

  async getFlatpickrOptions(): Promise<Partial<BaseOptions>> {
    this._enableTime = this.dateFormat.includes('H:');
    let localeOptions: Partial<Locale>;

    if (this.locale === 'en') {
      localeOptions = {
        weekdays: {
          shorthand: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
          longhand: [
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
          ],
        },
      };
    } else {
      localeOptions = await this.loadLocale(this.locale);
    }

    const options: Partial<BaseOptions> = {
      dateFormat: this.dateFormat,
      mode: this.mode,
      enableTime: this._enableTime,
      allowInput: false,
      clickOpens: true,
      time_24hr: this.twentyFourHourFormat,
      weekNumbers: false,
      wrap: false,
      monthSelectorType: 'static',
      altFormat: this.altFormat,
      onChange: this.handleDateChange.bind(this),
      closeOnSelect: !(this.mode === 'multiple' || this._enableTime),
      locale: localeOptions,
    };

    if (!(this._anchorEl instanceof HTMLInputElement)) {
      options.positionElement = this._anchorEl;
    }

    if (this.minDate) options.minDate = this.minDate;
    if (this.maxDate) options.maxDate = this.maxDate;
    if (this.enable.length > 0) options.enable = this.enable;
    if (this.disable.length > 0) options.disable = this.disable;

    return options;
  }

  handleDateChange(selectedDates: Date[], dateStr: string): void {
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
  }

  _validate(): boolean {
    if (this.mode === 'multiple' && Array.isArray(this.value)) {
      return this.value.every((date) => date instanceof Date);
    } else if (this.mode === 'single' && typeof this.value === 'string') {
      return Boolean(this.value);
    }
    return false;
  }

  override willUpdate(changedProps: PropertyValues) {
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

    const calendarElements = document.querySelectorAll('.flatpickr-calendar');
    calendarElements.forEach((calendar) => {
      calendar.remove();
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-date-picker': DatePicker;
  }
}
