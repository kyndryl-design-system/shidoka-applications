import { html, LitElement, PropertyValues } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { FormMixin } from '../../../common/mixins/form-input';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import {
  isSupportedLocale,
  injectFlatpickrStyles,
  langsArray,
  initializeSingleAnchorFlatpickr,
  getFlatpickrOptions,
} from '../../../common/helpers/flatpickr';

import flatpickr from 'flatpickr';
import { BaseOptions } from 'flatpickr/dist/types/options';
import { Locale } from 'flatpickr/dist/types/locale';
import { default as English } from 'flatpickr/dist/l10n/default.js';

import DatePickerStyles from './datepicker.scss';
import ShidokaFlatpickrTheme from '../../../common/scss/shidoka-flatpickr-theme-2.scss';

import '@kyndryl-design-system/shidoka-foundation/components/icon';
import '@kyndryl-design-system/shidoka-foundation/components/button';
import errorIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/close-filled.svg';

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
  static override styles = [DatePickerStyles, ShidokaFlatpickrTheme];

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

  /** Sets flatpickr enableTime value based on detected dateFormat.
   * @internal
   */
  @state()
  private _enableTime = false;

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
      changedProperties.has('locale') ||
      changedProperties.has('mode') ||
      changedProperties.has('minDate') ||
      changedProperties.has('maxDate')
    ) {
      this.updateEnableTime();
      this.reinitializeFlatpickr();
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
    if (!this._anchorEl) {
      return;
    }

    if (this.flatpickrInstance) {
      this.flatpickrInstance.destroy();
    }

    this.flatpickrInstance = await initializeSingleAnchorFlatpickr({
      anchorEl: this._anchorEl,
      getFlatpickrOptions: this.getFlatpickrOptions.bind(this),
      setCalendarAttributes: this.setCalendarAttributes.bind(this),
      setInitialDates: this.setInitialDates.bind(this),
      appendToBody: false,
    });

    this.requestUpdate();
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

  async getFlatpickrOptions(): Promise<Partial<BaseOptions>> {
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
      handleDateChange: this.handleDateChange.bind(this),
      loadLocale: this.loadLocale.bind(this),
      mode: this.mode,
      closeOnSelect: !(this.mode === 'multiple' || this._enableTime),
      wrap: false,
    });
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
