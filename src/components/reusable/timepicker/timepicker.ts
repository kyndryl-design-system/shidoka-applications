import { html, LitElement, PropertyValues } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { FormMixin } from '../../../common/mixins/form-input';

import '../../reusable/button';

import {
  langsArray,
  injectFlatpickrStyles,
  initializeSingleAnchorFlatpickr,
  getFlatpickrOptions,
  preventFlatpickrOpen,
  handleInputClick,
  handleInputFocus,
  setCalendarAttributes,
  loadLocale,
  emitValue,
  hideEmptyYear,
} from '../../../common/helpers/flatpickr';

import flatpickr from 'flatpickr';
import { BaseOptions } from 'flatpickr/dist/types/options';

import TimepickerStyles from './timepicker.scss';
import ShidokaFlatpickrTheme from '../../../common/scss/shidoka-flatpickr-theme.scss';

import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';

import errorIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/close-filled.svg';
import clockIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/24/time.svg';
import clearIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/close-simple.svg';

type SupportedLocale = (typeof langsArray)[number];

const _defaultTextStrings = {
  requiredText: 'Required',
  clearAll: 'Clear',
};

/**
 * Timepicker: uses Flatpickr library,time picker implementation  -- `https://flatpickr.js.org/examples/#time-picker`
 * @fires on-change - Captures the input event and emits the selected value and original event details.
 * @slot tooltip - Slot for tooltip.
 */
@customElement('kyn-time-picker')
export class TimePicker extends FormMixin(LitElement) {
  static override styles = [TimepickerStyles, ShidokaFlatpickrTheme];

  /** Label text. */
  @property({ type: String })
  label = '';

  /** Sets desired locale and, if supported, dynamically loads language lib */
  @property({ type: String })
  locale: SupportedLocale = 'en';

  /** Sets date/time value. */
  @property({ type: Object })
  override value: Date | null = null;

  /** Sets default time value. */
  @property({ type: String })
  defaultDate = '';

  /** Sets initial value of the hour element. */
  @property({ type: Number })
  defaultHour: number | null = null;

  /** Sets initial value of the minute element. */
  @property({ type: Number })
  defaultMinute: number | null = null;

  /** Sets default error message. */
  @property({ type: String })
  defaultErrorMessage = '';

  /** Sets validation warning messaging. */
  @property({ type: String })
  warnText = '';

  /** Sets caption to be displayed under primary date picker elements. */
  @property({ type: String })
  caption = '';

  /** Sets datepicker form input value to required/required. */
  @property({ type: Boolean })
  required = false;

  /** Input size. "sm", "md", or "lg". */
  @property({ type: String })
  size = 'md';

  /** Sets entire datepicker form element to enabled/disabled. */
  @property({ type: Boolean })
  timepickerDisabled = false;

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
  minTime: string | number | Date = '';

  /** Sets upper boundary of datepicker date selection. */
  @property({ type: String })
  maxTime: string | number | Date = '';

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
  @query('input.input-custom')
  private _inputEl?: HTMLInputElement;

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
      : `time-picker-${Math.random().toString(36).slice(2, 11)}`;
    const descriptionId = this.name ?? '';
    const placeholder = '—— : ——';

    return html`
      <div class=${classMap(this.getTimepickerClasses())}>
        <div
          class="label-text"
          @mousedown=${this.preventFlatpickrOpen}
          @click=${this.preventFlatpickrOpen}
          ?disabled=${this.timepickerDisabled || this.readonly}
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
            ?disabled=${this.timepickerDisabled || this.readonly}
            ?readonly=${this.readonly}
            ?required=${this.required}
            ?invalid=${this._isInvalid}
            aria-invalid=${this._isInvalid}
            aria-labelledby=${`label-${anchorId}`}
            @click=${this.handleInputClickEvent}
            @focus=${this.handleInputFocusEvent}
          />
          ${this.value
            ? html`
                <kyn-button
                  ?disabled=${this.timepickerDisabled || this.readonly}
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
            : html`<span class="input-icon">${unsafeSVG(clockIcon)}</span>`}
        </div>

        ${this.caption
          ? html`<div
              id=${descriptionId}
              class="caption"
              aria-disabled=${this.timepickerDisabled}
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

  getTimepickerClasses() {
    return {
      'time-picker': true,
      'time-picker__disabled': this.timepickerDisabled,
      'time-picker__read-only': this.readonly,
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
      changedProperties.has('defaultHour') ||
      changedProperties.has('defaultMinute') ||
      changedProperties.has('invalidText') ||
      changedProperties.has('minTime') ||
      changedProperties.has('maxTime') ||
      changedProperties.has('twentyFourHourFormat')
    ) {
      if (this.flatpickrInstance) {
        this.updateFlatpickrOptions();
      } else {
        this.initializeFlatpickr();
      }
    }

    if (
      changedProperties.has('timepickerDisabled') &&
      this.timepickerDisabled &&
      this.flatpickrInstance
    ) {
      this.flatpickrInstance.close();
    }
  }

  private _handleClear(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.value = null;
    if (this.flatpickrInstance) {
      this.flatpickrInstance.clear();
    }
    this._validate(true, false);
  }

  private setupAnchor() {
    if (this._inputEl) {
      this.initializeFlatpickr();
    } else {
      console.error('Internal input element not found');
    }
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
          instance.calendarContainer.setAttribute('aria-label', 'Time picker');
        } else {
          console.warn('Calendar container not available...');
        }
      },
      setInitialDates: undefined,
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

    this.setInitialDates(this.flatpickrInstance);

    setTimeout(() => {
      if (this.flatpickrInstance && this.flatpickrInstance.calendarContainer) {
        setCalendarAttributes(this.flatpickrInstance);
        this.flatpickrInstance.calendarContainer.setAttribute(
          'aria-label',
          'Time picker'
        );
      } else {
        console.warn('Calendar container not available...');
      }
    }, 0);
  }

  async getComponentFlatpickrOptions(): Promise<Partial<BaseOptions>> {
    return getFlatpickrOptions({
      locale: this.locale,
      enableTime: true,
      twentyFourHourFormat: this.twentyFourHourFormat ?? undefined,
      inputEl: this._inputEl!,
      allowInput: true,
      dateFormat: !this.twentyFourHourFormat ? 'h:i K' : 'H:i',
      minTime: this.minTime,
      maxTime: this.maxTime,
      defaultDate: this.defaultDate ?? undefined,
      defaultHour: this.defaultHour ?? undefined,
      defaultMinute: this.defaultMinute ?? undefined,
      loadLocale,
      mode: 'time',
      noCalendar: true,
      onChange: this.handleTimeChange.bind(this),
      onClose: this.handleClose.bind(this),
      onOpen: this.handleOpen.bind(this),
    });
  }

  setInitialDates(instance: flatpickr.Instance): void {
    if (this.defaultDate) {
      instance.setDate(this.defaultDate, true);
    } else if (this.defaultHour !== null && this.defaultMinute !== null) {
      const now = new Date();
      now.setHours(this.defaultHour);
      now.setMinutes(this.defaultMinute);
      now.setSeconds(0);
      now.setMilliseconds(0);
      instance.setDate(now, true);
    } else {
      instance.clear();
    }

    if (this._inputEl) {
      this._inputEl.value = instance.input.value;
    }
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

  async handleTimeChange(
    selectedDates: Date[],
    dateStr: string
  ): Promise<void> {
    if (selectedDates.length > 0) {
      this.value = selectedDates[0];
      emitValue(this, 'on-change', { time: dateStr });
    } else {
      this.value = null;
      emitValue(this, 'on-change', { time: '' });
    }

    this._validate(true, false);
    await this.updateComplete;
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
    'kyn-time-picker': TimePicker;
  }
}
