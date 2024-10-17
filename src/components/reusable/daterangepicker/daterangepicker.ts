import { html, LitElement, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { FormMixin } from '../../../common/mixins/form-input';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import {
  isSupportedLocale,
  langsArray,
  injectFlatpickrStyles,
  initializeMultiAnchorFlatpickr,
  getFlatpickrOptions,
  getPlaceholder,
} from '../../../common/helpers/flatpickr';

import { BaseOptions } from 'flatpickr/dist/types/options';
import type { Instance } from 'flatpickr/dist/types/instance';
import { Locale } from 'flatpickr/dist/types/locale';
import { default as English } from 'flatpickr/dist/l10n/default.js';

import DateRangePickerStyles from './daterangepicker.scss';
import ShidokaFlatpickrTheme from '../../../common/scss/shidoka-flatpickr-theme.scss';

import '@kyndryl-design-system/shidoka-foundation/components/icon';
import errorIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/close-filled.svg';
import calendarIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/calendar.svg';

type SupportedLocale = (typeof langsArray)[number];

const _defaultTextStrings = {
  requiredText: 'Required',
  subtract: 'Subtract',
  add: 'Add',
};

/**
 * Date Range Picker component: uses flatpickr library, range picker implementation -- `https://flatpickr.js.org/examples/#range-calendar`
 * @fires on-change - Captures the input event and emits the selected value and original event details.
 * @slot tooltip - Slot for tooltip.
 */
@customElement('kyn-date-range-picker')
export class DateRangePicker extends FormMixin(LitElement) {
  static override styles = [DateRangePickerStyles, ShidokaFlatpickrTheme];

  /** Sets date range picker attribute name (ex: `contact-form-date-range-picker`). */
  @property({ type: String })
  nameAttr = '';

  /** Label text. */
  @property({ type: String })
  label = '';

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
  private _startAnchorEl?: HTMLInputElement;

  /**
   * Queries the end date anchor DOM element.
   * @internal
   */
  @state()
  private _endAnchorEl?: HTMLInputElement;

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

  override render() {
    const errorId = `${this.nameAttr}-error-message`;
    const warningId = `${this.nameAttr}-warning-message`;
    const anchorId = this.nameAttr
      ? `${this.nameAttr}-${Math.random().toString(36).slice(2, 11)}`
      : `date-range-picker-${Math.random().toString(36).slice(2, 11)}`;
    const descriptionId = this.nameAttr ?? '';

    const placeholder = getPlaceholder(this.dateFormat, true);

    return html`
      <div class=${classMap(this.getDateRangePickerClasses())}>
        <label
          class="label-text"
          for=${anchorId}
          ?disabled=${this.dateRangePickerDisabled}
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
        </label>

        <div class="input-wrapper">
          <input
            class="input-custom"
            type="text"
            id=${anchorId}
            name=${this.nameAttr}
            placeholder=${placeholder}
            ?disabled=${this.dateRangePickerDisabled}
            ?required=${this.required}
            aria-invalid=${this._isInvalid ? 'true' : 'false'}
          />
          <span class="icon">${unsafeSVG(calendarIcon)}</span>
        </div>

        ${this.caption
          ? html`<div id=${descriptionId} class="caption">${this.caption}</div>`
          : ''}
        ${this.renderValidationMessage(errorId, warningId)}
      </div>
    `;
  }

  private renderValidationMessage(errorId: string, warningId: string) {
    if (this._isInvalid) {
      return html`<div id=${errorId} class="error error-text" role="alert">
        <span class="error-icon">${unsafeSVG(errorIcon)}</span>${this
          .invalidText || 'Both start and end dates are required'}
      </div>`;
    }

    if (this.warnText) {
      return html`<div id=${warningId} class="warn warn-text" role="alert">
        ${this.warnText}
      </div>`;
    }

    return null;
  }

  getDateRangePickerClasses() {
    return {
      'date-range-picker': true,
      'date-range-picker__enable-time': this._enableTime,
      'date-range-picker__multi-input': this.multipleInputs,
      'date-range-picker__disabled': this.dateRangePickerDisabled,
    };
  }

  override async firstUpdated(changedProperties: PropertyValues) {
    super.firstUpdated(changedProperties);
    injectFlatpickrStyles(ShidokaFlatpickrTheme.toString());

    await this.updateComplete;
    this.setupAnchors();
  }

  override updated(changedProperties: PropertyValues) {
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

    if (changedProperties.has('invalidText')) {
      this._validate();
    }
  }

  private updateEnableTime() {
    this._enableTime = this.dateFormat.includes('H:');
  }

  private async reinitializeFlatpickr() {
    this.flatpickrInstance?.destroy();
    await this.initializeFlatpickr();
  }

  private async setupAnchors() {
    this._startAnchorEl = this.shadowRoot?.querySelector(
      '.input-custom'
    ) as HTMLInputElement;

    if (this._startAnchorEl) {
      await this.initializeFlatpickr();
    }
  }

  private async initializeFlatpickr() {
    if (!this._startAnchorEl) return;

    this.flatpickrInstance = await initializeMultiAnchorFlatpickr({
      startAnchorEl: this._startAnchorEl,
      endAnchorEl: this._endAnchorEl,
      getFlatpickrOptions: this.getComponentFlatpickrOptions.bind(this),
      setCalendarAttributes: this.setCalendarAttributes.bind(this),
    });
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
      altFormat: this.altFormat,
      enableTime: this._enableTime,
      twentyFourHourFormat: this.twentyFourHourFormat,
      multipleInputs: false,
      mode: 'range',
      startAnchorEl: this._startAnchorEl!,
      endAnchorEl: this._endAnchorEl,
      minDate: this.minDate,
      maxDate: this.maxDate,
      enable: this.enable,
      disable: this.disable,
      loadLocale: this.loadLocale.bind(this),
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

    if (currentDates && currentDates.length === 2) {
      this.flatpickrInstance.setDate(currentDates, false);
    }

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

  /**
   * Redraw component on viewport resize.
   * @internal
   */
  private _handleResize = () => {
    this.updateShowMonths();
    this.flatpickrInstance?.destroy();
    this.initializeFlatpickr();
  };

  private updateShowMonths() {
    const isWideScreen = window.innerWidth >= 767;
    this.flatpickrInstance?.set('showMonths', isWideScreen ? 2 : 1);
  }

  handleOpen(): void {
    /// future: custom logic of onOpen
  }

  async handleDateChange(selectedDates: Date[]): Promise<void> {
    this._hasInteracted = true;

    this.value =
      selectedDates.length === 2
        ? [selectedDates[0].getTime(), selectedDates[1].getTime()]
        : [selectedDates[0]?.getTime() || null, null];

    const formattedDates = selectedDates.map((date) => date.toISOString());
    const dateString =
      (this._startAnchorEl as HTMLInputElement)?.value ||
      formattedDates.join(' to ');

    const customEvent = new CustomEvent('on-change', {
      detail: {
        dates: formattedDates,
        dateString,
      },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(customEvent);

    this.updateSelectedDateRangeAria(selectedDates);
    this._validate();
    await this.updateComplete;
  }

  async handleClose() {
    this._hasInteracted = true;
    this._validate();
    await this.updateComplete;
  }

  updateSelectedDateRangeAria(selectedDates: Date[]) {
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

  private _validate(): void {
    const hasValidStart = this.value[0] !== null;
    const hasValidEnd = this.value[1] !== null;

    this._isInvalid =
      !!this.invalidText ||
      (this.required &&
        this._hasInteracted &&
        (!hasValidStart || !hasValidEnd));

    this.requestUpdate();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.flatpickrInstance?.destroy();
    window.removeEventListener('resize', this._handleResize);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-date-range-picker': DateRangePicker;
  }
}
