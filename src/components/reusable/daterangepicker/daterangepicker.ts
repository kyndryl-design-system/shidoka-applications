import { html, LitElement, PropertyValues } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { FormMixin } from '../../../common/mixins/form-input';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import {
  isSupportedLocale,
  langsArray,
  injectFlatpickrStyles,
  initializeMultiAnchorFlatpickr,
  getFlatpickrOptions,
} from '../../../common/helpers/flatpickr';

import { BaseOptions } from 'flatpickr/dist/types/options';
import type { Instance } from 'flatpickr/dist/types/instance';
import { Locale } from 'flatpickr/dist/types/locale';
import { default as English } from 'flatpickr/dist/l10n/default.js';

import DateRangePickerStyles from './daterangepicker.scss';
import ShidokaFlatpickrTheme from '../../../common/scss/shidoka-flatpickr-theme.scss';

import '@kyndryl-design-system/shidoka-foundation/components/icon';
import '@kyndryl-design-system/shidoka-foundation/components/button';
import errorIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/close-filled.svg';

type SupportedLocale = (typeof langsArray)[number];

/**
 * Date Range Picker component: uses flatpickr library, range picker implementation -- `https://flatpickr.js.org/examples/#range-calendar`
 * @fires on-change - Captures the input event and emits the selected value and original event details.
 * @slot start-label - Slot for start date label text.
 * @slot end-label - Slot for end date label text.
 * @slot start-icon - Slot for start anchor helper icon.
 * @slot end-icon - Slot for end anchor helper icon.
 * @slot start-anchor - Slotted start input anchor.
 * @slot end-anchor - Slotted end input anchor.
 */
@customElement('kyn-date-range-picker')
export class DateRangePicker extends FormMixin(LitElement) {
  static override styles = [DateRangePickerStyles, ShidokaFlatpickrTheme];

  /** Sets date range picker attribute name (ex: `contact-form-date-range-picker`). */
  @property({ type: String })
  nameAttr = '';

  /** Sets and dynamically imports specific l10n calendar localization. */
  @property({ type: String })
  locale: SupportedLocale = 'en';

  /** Sets flatpickr dateFormat attr (ex: `Y-m-d H:i`). */
  @property({ type: String })
  dateFormat = 'Y-m-d';

  /** Sets date range to have start and end date inputs. */
  @property({ type: Boolean })
  multipleInputs = false;

  /** Sets pre-selected date/time value. */
  @property({ type: Array })
  override value: [number | null, number | null] = [null, null];

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

  /** Sets caption to be displayed under primary date picker elements. */
  @property({ type: String })
  caption = '';

  /** Sets date range picker form input value to required/required. */
  @property({ type: Boolean })
  required = false;

  /** Sets entire date range picker form element to enabled/disabled. */
  @property({ type: Boolean })
  dateRangePickerDisabled = false;

  /** Sets 24 hour formatting true/false. */
  @property({ type: Boolean })
  twentyFourHourFormat = false;

  /** Sets lower boundary of date range picker date selection. */
  @property({ type: String })
  minDate: string | number | Date = '';

  /** Sets upper boundary of date range picker date selection. */
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
  private flatpickrInstance?: Instance;

  /**
   * Queries the start date (default) anchor DOM element.
   * @internal
   */
  @state()
  private _startAnchorEl?: HTMLElement;

  /**
   * Queries the end date anchor DOM element.
   * @internal
   */
  @state()
  private _endAnchorEl?: HTMLElement;

  /**
   * Queries the start-anchor slotted DOM element.
   * @internal
   */
  @query('slot[name="start-anchor"]')
  private startAnchorSlot!: HTMLSlotElement;

  /**
   * Queries the end-anchor slotted DOM element.
   * @internal
   */
  @query('slot[name="end-anchor"]')
  private endAnchorSlot!: HTMLSlotElement;

  override render() {
    const errorId = 'error-message';
    const warningId = 'warning-message';
    const captionId = 'date-range-picker-caption';

    return html`
      <div class=${classMap(this.getDateRangePickerClasses())}>
        <div class="date-inputs">
          <div class="date-input">
            <slot name="start-label"></slot>
            <div class="anchor-wrapper">
              <slot name="start-anchor"></slot>
              <slot name="start-icon" class="icon"></slot>
            </div>
          </div>
          ${this.multipleInputs
            ? html`
                <div class="date-range-separator">—</div>
                <div class="date-input">
                  <slot name="end-label"></slot>
                  <div class="anchor-wrapper">
                    <slot name="end-anchor"></slot>
                    <slot name="end-icon" class="icon"></slot>
                  </div>
                </div>
              `
            : ''}
        </div>
        ${this.caption
          ? html`<div id=${captionId} class="caption options-text">
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

  getDateRangePickerClasses() {
    return {
      'date-range-picker': true,
      'date-range-picker__enable-time': this._enableTime,
      'date-range-picker__multi-input': this.multipleInputs,
      'date-range-picker__disabled': this.dateRangePickerDisabled,
    };
  }

  override async firstUpdated(
    changedProperties: PropertyValues
  ): Promise<void> {
    super.firstUpdated(changedProperties);
    injectFlatpickrStyles(ShidokaFlatpickrTheme.toString());
    await this.updateComplete;
    this.setupAnchors();
    this.updateShowMonths();
    window.addEventListener('resize', this.handleResize);
  }

  override updated(changedProperties: PropertyValues): void {
    super.updated(changedProperties);
    if (
      changedProperties.has('dateFormat') ||
      changedProperties.has('minDate') ||
      changedProperties.has('maxDate') ||
      changedProperties.has('locale')
    ) {
      this.updateEnableTime();
      this.reinitializeFlatpickr();
    }
  }

  private updateEnableTime() {
    this._enableTime = this.dateFormat.includes('H:');
  }

  private async reinitializeFlatpickr() {
    this.flatpickrInstance?.destroy();
    await this.initializeFlatpickr();
  }

  async initializeFlatpickr(): Promise<void> {
    if (!this._startAnchorEl) return;

    this.flatpickrInstance?.destroy();
    this.flatpickrInstance = await initializeMultiAnchorFlatpickr({
      startAnchorEl: this._startAnchorEl,
      endAnchorEl: this._endAnchorEl,
      getFlatpickrOptions: this.getComponentFlatpickrOptions.bind(this),
      setCalendarAttributes: this.setCalendarAttributes.bind(this),
      setInitialDates: this.setInitialDates.bind(this),
      appendToBody: false,
    });

    this.requestUpdate();
  }

  private setupAnchors() {
    this._startAnchorEl = this.startAnchorSlot
      .assignedNodes()
      .find((node): node is HTMLElement => node instanceof HTMLElement);

    if (this.multipleInputs) {
      this._endAnchorEl = this.endAnchorSlot
        .assignedNodes()
        .find((node): node is HTMLElement => node instanceof HTMLElement);
    }

    if (this._startAnchorEl) {
      this.initializeFlatpickr();
    } else {
      console.error('Start anchor element not found in the slotted content');
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
      multipleInputs: this.multipleInputs,
      endAnchorEl: this._endAnchorEl,
      startAnchorEl: this._startAnchorEl!,
      minDate: this.minDate,
      maxDate: this.maxDate,
      enable: this.enable,
      disable: this.disable,
      handleDateChange: this.handleDateChange.bind(this),
      loadLocale: this.loadLocale.bind(this),
      mode: 'range',
    });
  }

  async updateFlatpickrOptions(): Promise<void> {
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

    if (currentDates && currentDates.length === 2) {
      this.flatpickrInstance.setDate(currentDates, false);
    }

    this.setCalendarAttributes();
    this.requestUpdate();
  }

  setCalendarAttributes(): void {
    if (this.flatpickrInstance?.calendarContainer) {
      this.flatpickrInstance.calendarContainer.setAttribute(
        'role',
        'application'
      );
      this.flatpickrInstance.calendarContainer.setAttribute(
        'aria-label',
        'Date range calendar'
      );

      this._startAnchorEl?.setAttribute('aria-label', 'Start date');
      this._endAnchorEl?.setAttribute('aria-label', 'End date');
    }
  }

  setInitialDates(): void {
    if (
      Array.isArray(this.value) &&
      this.value.length === 2 &&
      this.value[0] !== null &&
      this.value[1] !== null
    ) {
      this.flatpickrInstance!.setDate(
        [new Date(this.value[0]), new Date(this.value[1])],
        false
      );
    }
  }

  private handleResize = () => {
    this.updateShowMonths();
    this.flatpickrInstance?.destroy();
    this.initializeFlatpickr();
  };

  private updateShowMonths() {
    const isWideScreen = window.innerWidth >= 767;
    this.flatpickrInstance?.set('showMonths', isWideScreen ? 2 : 1);
  }

  handleDateChange(selectedDates: Date[], dateStr: string): void {
    this.value =
      selectedDates.length === 2
        ? [selectedDates[0].getTime(), selectedDates[1].getTime()]
        : [null, null];
    this.requestUpdate('value');

    const updateInputValue = (
      anchorEl: HTMLElement | undefined,
      date: Date | undefined
    ) => {
      if (anchorEl) {
        const input = anchorEl.querySelector('input');
        if (input) {
          input.value = date ? date.toLocaleDateString() : '';
        }
      }
    };

    updateInputValue(this._startAnchorEl, selectedDates[0]);
    updateInputValue(this._endAnchorEl, selectedDates[1]);

    this.dispatchEvent(
      new CustomEvent('on-change', {
        detail: { dates: selectedDates, dateString: dateStr },
        bubbles: true,
        composed: true,
      })
    );

    this._validate();
    this.updateSelectedDateRangeAria(selectedDates);
  }

  updateSelectedDateRangeAria(selectedDates: Date[]): void {
    if (selectedDates.length === 2) {
      const [startDate, endDate] = selectedDates;
      this._startAnchorEl?.setAttribute(
        'aria-label',
        `Selected start date: ${startDate.toLocaleDateString()}`
      );
      this._endAnchorEl?.setAttribute(
        'aria-label',
        `Selected end date: ${endDate.toLocaleDateString()}`
      );
    } else {
      this._startAnchorEl?.setAttribute('aria-label', 'Start date');
      this._endAnchorEl?.setAttribute('aria-label', 'End date');
    }
  }

  _validate(): boolean {
    this._isInvalid = this.required && (!this.value[0] || !this.value[1]);
    this._internalValidationMsg = this._isInvalid
      ? 'Both start and end dates are required'
      : '';
    return !this._isInvalid;
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.flatpickrInstance?.destroy();
    window.removeEventListener('resize', this.handleResize);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-date-range-picker': DateRangePicker;
  }
}
