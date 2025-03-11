import { html, LitElement, PropertyValues } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { FormMixin } from '../../../common/mixins/form-input';
import { langsArray } from '../../../common/flatpickrLangs';

import '../../reusable/button';

import {
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
  getModalContainer,
} from '../../../common/helpers/flatpickr';

import flatpickr from 'flatpickr';
import { BaseOptions } from 'flatpickr/dist/types/options';

import TimepickerStyles from './timepicker.scss';
import ShidokaFlatpickrTheme from '../../../common/scss/shidoka-flatpickr-theme.scss';

import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';

import errorIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/close-filled.svg';
import clockIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/24/time.svg';
import clearIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/close-simple.svg';

type SupportedLocale = (typeof langsArray)[number];

const _defaultTextStrings = {
  requiredText: 'Required',
  clearAll: 'Clear',
  pleaseSelectDate: 'Please select a date',
  noTimeSelected: 'No time selected',
  pleaseSelectValidDate: 'Please select a valid date',
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
  locale: SupportedLocale | string = 'en';

  /** Sets date/time value. */
  @property({ type: Object })
  override value: Date | null = null;

  /** Sets the initial selected date(s). For multiple mode, provide an array of date strings matching dateFormat. */
  @property({ type: Array })
  defaultDate: string | string[] | null = null;

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

  /** Sets whether the Flatpickr calendar UI should use static positioning. */
  @property({ type: Boolean })
  staticPosition = false;

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

  /** Tracks if we're in a clear operation to prevent duplicate events
   * @internal
   */
  @state()
  private _isClearing = false;

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

  /** Track initialization state
   * @internal
   */
  private _initialized = false;

  private debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: number | null = null;

    return (...args: Parameters<T>) => {
      if (timeout !== null) {
        window.clearTimeout(timeout);
      }

      timeout = window.setTimeout(() => {
        func.apply(this, args);
        timeout = null;
      }, wait);
    };
  }

  private debouncedUpdate = this.debounce(async () => {
    if (!this.flatpickrInstance) return;
    try {
      await this.initializeFlatpickr();
    } catch (error) {
      console.error('Error in debounced update:', error);
    }
  }, 100);

  private generateRandomId(prefix: string): string {
    return `${prefix}-${Math.random().toString(36).slice(2, 11)}`;
  }

  override connectedCallback() {
    super.connectedCallback();
    this.addEventListener('change', this._onChange);
    this.addEventListener('reset', this._handleFormReset);
  }

  private hasValue(): boolean {
    if (this._inputEl?.value) return true;
    if (this.value !== null) return true;
    if (this.defaultDate) return true;
    if (this.defaultHour !== null || this.defaultMinute !== null) return true;
    return false;
  }

  override render() {
    const errorId = `${this.name}-error-message`;
    const warningId = `${this.name}-warning-message`;
    const anchorId = this.name
      ? this.generateRandomId(this.name)
      : this.generateRandomId('time-picker');
    const descriptionId = this.name ?? '';
    const placeholder = '—— : ——';
    return html`
      <div class=${classMap(this.getTimepickerClasses())}>
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
            ?disabled=${this.timepickerDisabled}
            ?required=${this.required}
            ?invalid=${this._isInvalid}
            aria-invalid=${this._isInvalid}
            aria-labelledby=${`label-${anchorId}`}
            @click=${this.handleInputClickEvent}
            @focus=${this.handleInputFocusEvent}
          />
          ${this.hasValue()
            ? html`
                <kyn-button
                  ?disabled=${this.timepickerDisabled}
                  class="clear-button"
                  kind="ghost"
                  size="small"
                  description=${this._textStrings.clearAll}
                  @click=${this._handleClear}
                >
                  <span style="display:flex;" slot="icon">
                    ${unsafeSVG(clearIcon)}
                  </span>
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
          aria-label=${this.errorAriaLabel || 'Error message icon'}
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

  override async updated(changedProperties: PropertyValues) {
    await super.updated(changedProperties);

    if (
      changedProperties.has('defaultHour') ||
      changedProperties.has('defaultMinute') ||
      changedProperties.has('defaultDate')
    ) {
      if (this.flatpickrInstance && !this._isClearing) {
        await this.debouncedUpdate();
      }
    } else if (
      changedProperties.has('invalidText') ||
      changedProperties.has('minTime') ||
      changedProperties.has('maxTime')
    ) {
      if (this.flatpickrInstance && !this._isClearing) {
        await this.debouncedUpdate();
      }
    } else if (changedProperties.has('twentyFourHourFormat')) {
      if (this.flatpickrInstance && !this._isClearing) {
        await this.debouncedUpdate();
      }
    }
    if (changedProperties.has('value') && !this._isClearing) {
      let newValue = this.value;

      if (typeof newValue === 'string') {
        try {
          const strValue = newValue as string;
          if (strValue.trim() !== '') {
            this._hasInteracted = true;

            if (/\d{1,2}:\d{2}/.test(strValue)) {
              const [hours, minutes] = strValue.split(':').map(Number);
              if (!isNaN(hours) && !isNaN(minutes)) {
                const date = new Date();
                date.setHours(hours, minutes, 0, 0);
                this.value = date;
                newValue = this.value;

                if (this.flatpickrInstance) {
                  this.flatpickrInstance.setDate(newValue, true);
                }
              }
            } else if (/\d{4}-\d{2}-\d{2}/.test(strValue)) {
              this.value = new Date(strValue);
              newValue = this.value;

              if (this.flatpickrInstance) {
                this.flatpickrInstance.setDate(newValue, true);
              }
            }
          }
        } catch (e) {
          console.warn('Error parsing time string:', e);
        }
      }

      if (newValue === null && this.flatpickrInstance) {
        this._isClearing = true;
        try {
          this.flatpickrInstance.clear();
          if (this._inputEl) {
            this._inputEl.value = '';
          }
        } finally {
          this._isClearing = false;
        }
      }
      this.requestUpdate();
    }
    if (
      changedProperties.has('timepickerDisabled') &&
      this.timepickerDisabled &&
      this.flatpickrInstance
    ) {
      this.flatpickrInstance.close();
    }
  }

  private async _handleClear(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this._isClearing = true;
    try {
      this.value = null;
      if (this.flatpickrInstance) {
        this.flatpickrInstance.clear();
        if (this._inputEl) {
          this._inputEl.value = '';
          this._inputEl.setAttribute(
            'aria-label',
            this._textStrings.noTimeSelected
          );
        }
      }
      emitValue(this, 'on-change', {
        time: this.value,
        source: 'clear',
      });
      this._validate(true, false);
      await this.updateComplete;
      await this.initializeFlatpickr();
      this.requestUpdate();
    } finally {
      this._isClearing = false;
    }
  }

  private async setupAnchor() {
    if (!this._inputEl) {
      console.warn('Input element not found during setup');
      return;
    }

    try {
      await this.initializeFlatpickr();
    } catch (error) {
      console.error('Error setting up flatpickr:', error);
    }
  }

  private _isDestroyed = false;

  async initializeFlatpickr(): Promise<void> {
    if (this._isDestroyed) {
      return;
    }

    if (!this._inputEl || !this._inputEl.isConnected) {
      console.warn(
        'Cannot initialize Flatpickr: input element not available or not connected to DOM'
      );
      return;
    }

    const inputEl = this._inputEl;
    try {
      if (this.flatpickrInstance) {
        this.flatpickrInstance.destroy();
        this.flatpickrInstance = undefined;
        await new Promise((resolve) => setTimeout(resolve, 0));
      }

      if (this._isDestroyed || !inputEl.isConnected) {
        return;
      }

      await new Promise((resolve) => requestAnimationFrame(resolve));

      if (this._isDestroyed || !inputEl.isConnected) {
        return;
      }

      this.flatpickrInstance = await initializeSingleAnchorFlatpickr({
        inputEl: this._inputEl,
        getFlatpickrOptions: async () => {
          const options = await this.getComponentFlatpickrOptions();
          if (options.noCalendar === false) {
            console.warn('Time picker requires noCalendar option to be true');
            options.noCalendar = true;
          }
          return options;
        },
        setCalendarAttributes: (instance) => {
          try {
            const container = getModalContainer(this);
            const modalDetected = container !== document.body;
            setCalendarAttributes(instance, modalDetected);
            if (instance.calendarContainer) {
              instance.calendarContainer.setAttribute(
                'aria-label',
                'Time picker'
              );
            }
          } catch (error) {
            console.warn('Error setting calendar attributes:', error);
          }
        },
        setInitialDates: this.setInitialDates.bind(this),
      });

      if (!this.flatpickrInstance) {
        throw new Error('Failed to initialize Flatpickr instance');
      }

      hideEmptyYear();
      this._validate(false, false);
    } catch (error) {
      console.error('Error initializing Flatpickr:', error);

      if (error instanceof Error) {
        console.error('Error details:', error.message);
      }
    }
  }

  async updateFlatpickrOptions(): Promise<void> {
    if (!this.flatpickrInstance) {
      console.warn('Cannot update options: Flatpickr instance not available');
      return;
    }
    await this.debouncedUpdate();
  }

  async getComponentFlatpickrOptions(): Promise<Partial<BaseOptions>> {
    const container = getModalContainer(this);
    const effectiveDateFormat = this.twentyFourHourFormat ? 'H:i' : 'h:i K';
    return getFlatpickrOptions({
      locale: this.locale,
      enableTime: true,
      twentyFourHourFormat: this.twentyFourHourFormat ?? undefined,
      inputEl: this._inputEl!,
      allowInput: true,
      dateFormat: effectiveDateFormat,
      minTime: this.minTime,
      maxTime: this.maxTime,
      loadLocale,
      mode: 'time',
      noCalendar: true,
      onChange: this.handleTimeChange.bind(this),
      onClose: this.handleClose.bind(this),
      onOpen: this.handleOpen.bind(this),
      appendTo: container,
      static: this.staticPosition,
      defaultDate: this.defaultDate ?? undefined,
      defaultHour: this.defaultHour ?? undefined,
      defaultMinute: this.defaultMinute ?? undefined,
    });
  }

  setInitialDates(instance: flatpickr.Instance): void {
    try {
      if (this._hasInteracted || this.value) return;
      if (this.defaultDate != null) {
        if (typeof this.defaultDate === 'string') {
          const dateStr = this.defaultDate.trim();
          if (dateStr.includes(':') && !dateStr.includes('-')) {
            const parts = dateStr.split(':').map(Number);
            if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
              const newDate = new Date();
              newDate.setHours(parts[0], parts[1], 0, 0);
              instance.setDate(newDate, false);
              return;
            }
          } else if (/\d{4}-\d{2}-\d{2}/.test(dateStr)) {
            try {
              const newDate = new Date(dateStr);
              if (!isNaN(newDate.getTime())) {
                instance.setDate(newDate, false);
                return;
              }
            } catch (e) {
              console.warn('Error parsing date string:', e);
            }
          }
        } else if (this.defaultDate instanceof Date) {
          instance.setDate(this.defaultDate, false);
          return;
        }
      }
      if (this.defaultHour !== null || this.defaultMinute !== null) {
        const newDate = new Date();
        if (this.defaultHour !== null) {
          newDate.setHours(this.defaultHour);
        }
        if (this.defaultMinute !== null) {
          newDate.setMinutes(this.defaultMinute);
        }
        newDate.setSeconds(0);
        newDate.setMilliseconds(0);
        instance.setDate(newDate, false);
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

  async handleClose(): Promise<void> {
    this._hasInteracted = true;
    this._validate(true, false);
    await this.updateComplete;
  }

  async handleTimeChange(
    selectedDates: Date[],
    dateStr: string
  ): Promise<void> {
    if (this._isClearing) return;
    try {
      if (selectedDates.length > 0) {
        if (!this._hasInteracted) {
          this._hasInteracted = true;
        }
        const selectedTime = selectedDates[0];
        const newDate = new Date();
        newDate.setHours(selectedTime.getHours());
        newDate.setMinutes(selectedTime.getMinutes());
        newDate.setSeconds(0);
        newDate.setMilliseconds(0);
        this.value = newDate;
        emitValue(this, 'on-change', {
          time: dateStr,
          source: undefined,
        });
      } else {
        this.value = null;
        emitValue(this, 'on-change', {
          time: this.value,
          source: 'clear',
        });
      }
      this._validate(true, false);
      await this.updateComplete;
      this.requestUpdate();
    } catch (error) {
      console.warn('Error handling time change:', error);
    }
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
      validationMessage =
        this.defaultErrorMessage || this._textStrings.pleaseSelectDate;
    }
    if (this.invalidText) {
      validity = { ...validity, customError: true };
      validationMessage = this.invalidText;
    }
    const isValid = !validity.valueMissing && !validity.customError;
    if (!isValid && !validationMessage) {
      validationMessage = this._textStrings.pleaseSelectValidDate;
    }
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
    this._isDestroyed = true;
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
