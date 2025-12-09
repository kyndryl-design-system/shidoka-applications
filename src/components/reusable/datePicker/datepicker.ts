import { html, LitElement, PropertyValues, unsafeCSS } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { FormMixin } from '../../../common/mixins/form-input';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { langsArray } from '../../../common/flatpickrLangs';
import {
  injectFlatpickrStyles,
  initializeSingleAnchorFlatpickr,
  getFlatpickrOptions,
  getPlaceholder,
  handleInputClick,
  handleInputFocus,
  updateEnableTime,
  setCalendarAttributes,
  loadLocale,
  emitValue,
  hideEmptyYear,
  getModalContainer,
  clearFlatpickrInput,
} from '../../../common/helpers/flatpickr';
import '../../reusable/button';

import flatpickr from 'flatpickr';
import { BaseOptions } from 'flatpickr/dist/types/options';

import DatePickerStyles from './datepicker.scss?inline';
import ShidokaFlatpickrTheme from '../../../common/scss/shidoka-flatpickr-theme.scss?inline';

import errorIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/close-filled.svg';
import calendarIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/24/calendar.svg';
import clearIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/close-simple.svg';

type SupportedLocale = (typeof langsArray)[number];

const _defaultTextStrings = {
  requiredText: 'Required',
  clearAll: 'Clear',
  pleaseSelectDate: 'Please select a date',
  noDateSelected: 'No date selected',
  pleaseSelectValidDate: 'Please select a valid date',
  invalidDateFormat: 'Invalid date format provided',
  errorProcessing: 'Error processing date',

  lockedStartDate: 'Start date is locked',
  lockedEndDate: 'End date is locked',
  dateLocked: 'Date is locked',
  dateNotAvailable: 'Date is not available',
  dateInSelectedRange: 'Date is in selected range',
};

/**
 * Datepicker: uses Flatpickr's datetime picker library -- `https://flatpickr.js.org`
 * @fires on-change - Emitted when the selected date(s) change. Event.detail has the shape:
 *   { dates: string | string[] | null | [], dateString?: string, source?: string }
 *   - dates: ISO string for single selection, or array of ISO strings for multiple selections.
 *            An empty array or null indicates the value was cleared.
 *   - dateString: the display string from the input (may be empty when cleared)
 *   - source: 'clear' when the value was cleared; otherwise may be 'date-selection' or undefined.
 * @slot tooltip - Slot for tooltip.
 * @attr {string} [name=''] - The name of the input, used for form submission.
 * @attr {string} [invalidText=''] - The custom validation message when the input is invalid.
 */
@customElement('kyn-date-picker')
export class DatePicker extends FormMixin(LitElement) {
  static override styles = [
    unsafeCSS(DatePickerStyles),
    unsafeCSS(ShidokaFlatpickrTheme),
  ];

  /** Label text. */
  @property({ type: String })
  accessor label = '';

  /* Sets desired locale and, if supported, dynamically loads language lib */
  @property({ type: String })
  accessor locale: SupportedLocale | string = 'en';

  /** Sets flatpickr value to define how the date will be displayed in the input box (ex: `Y-m-d H:i`). */
  @property({ type: String })
  accessor dateFormat = 'Y-m-d';

  /** Sets the initial selected date(s). For multiple mode, provide an array of date strings matching dateFormat. */
  @property({ type: Array })
  accessor defaultDate: string | string[] | null = null;

  /** Sets default error message. */
  @property({ type: String })
  accessor defaultErrorMessage = '';

  /** Sets datepicker form input value to required/required. */
  @property({ type: Boolean })
  accessor required = false;

  /** Input size. "sm", "md", or "lg". */
  @property({ type: String })
  accessor size = 'md';

  /**
   * Current date value for the component.
   *
   * - Uncontrolled: populated from `defaultDate` and user selections.
   * - Controlled: can be set from the host (e.g. Vue `:value`) as `Date` or `Date[]`.
   */
  override value: Date | Date[] | null = null;

  /** Sets validation warning messaging. */
  @property({ type: String })
  accessor warnText = '';

  /** Sets flatpickr options setting to disable specific dates. Accepts array of dates in Y-m-d format, timestamps, or Date objects. */
  @property({ type: Array })
  accessor disable: (string | number | Date)[] = [];

  /** Internal storage for processed disable dates */
  @state()
  private accessor _processedDisableDates: (string | number | Date)[] = [];

  /** Sets flatpickr options setting to enable specific dates. */
  @property({ type: Array })
  accessor enable: (string | number | Date)[] = [];

  /** Sets flatpickr mode to select single (default), multiple dates. */
  @property({ type: String })
  accessor mode: 'single' | 'multiple' = 'single';

  /** Sets caption to be displayed under primary date picker elements. */
  @property({ type: String })
  accessor caption = '';

  /** Sets entire datepicker form element to enabled/disabled. */
  @property({ type: Boolean })
  accessor datePickerDisabled = false;

  /** Sets entire datepicker form element to readonly. */
  @property({ type: Boolean })
  accessor readonly = false;

  /** Sets 24 hour formatting true/false.
   * Defaults to 12H for all `en-*` locales and 24H for all other locales.
   */
  @property({ type: Boolean })
  accessor twentyFourHourFormat: boolean | null = null;

  /** Sets lower boundary of datepicker date selection. */
  @property({ type: String })
  accessor minDate: string | number | Date = '';

  /** Sets upper boundary of datepicker date selection. */
  @property({ type: String })
  accessor maxDate: string | number | Date = '';

  /** Allows manual input of date/time string that matches dateFormat when true. */
  @property({ type: Boolean })
  accessor allowManualInput = false;

  /** Sets aria label attribute for error message. */
  @property({ type: String })
  accessor errorAriaLabel = '';

  /** Sets title attribute for error message. */
  @property({ type: String })
  accessor errorTitle = '';

  /** Sets aria label attribute for warning message. */
  @property({ type: String })
  accessor warningAriaLabel = '';

  /** Sets title attribute for warning message. */
  @property({ type: String })
  accessor warningTitle = '';

  /** Sets whether the Flatpickr calendar UI should use static positioning. */
  @property({ type: Boolean })
  accessor staticPosition = false;

  /** Sets flatpickr enableTime value based on detected dateFormat.
   * @internal
   */
  @state()
  private accessor _enableTime = false;

  /**
   * Sets whether user has interacted with datepicker for error handling.
   * @internal
   */
  @state()
  private accessor _hasInteracted = false;

  /** Flatpickr instantiation.
   * @internal
   */
  @state()
  private accessor flatpickrInstance: flatpickr.Instance | undefined;

  /**
   * Queries the anchor DOM element.
   * @internal
   */
  @query('input')
  private accessor _inputEl: HTMLInputElement | null = null;

  /** Tracks if we're in a clear operation to prevent duplicate events
   * @internal
   */
  @state()
  private accessor _isClearing = false;

  private _anchorId: string | null = null;

  /** Customizable text strings. */
  @property({ type: Object })
  accessor textStrings = _defaultTextStrings;

  /** Internal text strings.
   * @internal
   */
  @state()
  accessor _textStrings = { ..._defaultTextStrings };

  /** Control flag to prevent Flatpickr from opening when clicking caption, error, label, or warning elements.
   * @internal
   */
  @state()
  private accessor _shouldFlatpickrOpen = false;

  /** Track if we initially had a defaultDate when the component was first connected */
  @state()
  private accessor _hasInitialDefaultDate = false;

  /** Track initialization state
   * @internal
   */
  private _initialized = false;

  /** Track destroyed state
   * @internal
   */
  private _isDestroyed = false;

  /** Store submit event listener reference for cleanup
   * @internal
   */
  private _submitListener: ((e: SubmitEvent) => void) | null = null;

  private debounce<T extends (...args: unknown[]) => unknown>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: number | null = null;

    return (...args: Parameters<T>) => {
      if (timeout !== null) {
        window.clearTimeout(timeout);
      }
      timeout = window.setTimeout(() => {
        void func(...args);
        timeout = null;
      }, wait);
    };
  }

  private debouncedUpdate = this.debounce(async () => {
    if (!this.flatpickrInstance || this._isDestroyed) return;
    try {
      await this.initializeFlatpickr();
    } catch (error) {
      /* … */
    }
  }, 100);

  private generateRandomId(prefix: string): string {
    return `${prefix}-${Math.random().toString(36).slice(2, 11)}`;
  }

  override connectedCallback() {
    super.connectedCallback();
    this.addEventListener('change', this._onChange);
    this.addEventListener('reset', this._handleFormReset);

    if (!this.value && this.defaultDate) {
      this._hasInitialDefaultDate = true;
    }

    if (this._internals.form) {
      this._submitListener = (e: SubmitEvent) => {
        this._validate(true, true);

        if (this.required && !this.hasValue()) {
          e.preventDefault();
        }
      };
      this._internals.form.addEventListener('submit', this._submitListener);
    }
  }

  override disconnectedCallback() {
    this._isDestroyed = true;
    super.disconnectedCallback();
    this.removeEventListener('change', this._onChange);
    this.removeEventListener('reset', this._handleFormReset);

    if (this._internals.form && this._submitListener) {
      this._internals.form.removeEventListener('submit', this._submitListener);
      this._submitListener = null;
    }

    if (this.flatpickrInstance) {
      const __handlers = (this.flatpickrInstance as any).__anchorClickHandlers;
      if (Array.isArray(__handlers)) {
        __handlers.forEach((h: { el: HTMLElement; fn: EventListener }) => {
          try {
            h.el.removeEventListener('click', h.fn as EventListener);
          } catch (e) {
            // ignore cleanup errors
          }
        });
      }

      this.flatpickrInstance.destroy();
      this.flatpickrInstance = undefined;
    }
  }

  private hasValue(): boolean {
    if (this._inputEl?.value) return true;
    if (this.value) {
      if (Array.isArray(this.value)) {
        return (
          this.value.length > 0 && !this.value.every((date) => date === null)
        );
      }
      return true;
    }
    if (this.defaultDate) {
      if (Array.isArray(this.defaultDate)) {
        return (
          this.defaultDate.length > 0 &&
          !this.defaultDate.every((date) => !date || date === '')
        );
      }
      return !!this.defaultDate;
    }
    return false;
  }

  private updateFormValue(): void {
    if (this._internals && this._inputEl) {
      this._internals.setFormValue(this._inputEl.value);
    }
  }

  override render() {
    const errorId = `${this.name}-error-message`;
    const warningId = `${this.name}-warning-message`;
    const anchorId =
      this._anchorId ??
      (this._anchorId = this.name
        ? this.generateRandomId(this.name)
        : this.generateRandomId('date-picker'));
    const descriptionId = this.name ?? '';
    const placeholder = getPlaceholder(this.dateFormat);

    return html`
      <div class=${classMap(this.getDatepickerClasses())}>
        <div
          class="label-text"
          aria-disabled=${this.datePickerDisabled ? 'true' : 'false'}
          @mousedown=${this.onSuppressLabelInteraction}
          @click=${this.onSuppressLabelInteraction}
          @keydown=${(e: KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              this.onSuppressLabelInteraction(e);
            }
          }}
          ?readonly=${this.readonly}
          ?disabled=${this.datePickerDisabled}
          id=${`label-${anchorId}`}
        >
          ${this.required
            ? html`<abbr
                class="required"
                title=${this._textStrings?.requiredText}
                role="img"
                aria-label=${this._textStrings?.requiredText}
              >
                *
              </abbr>`
            : null}
          ${this.label}
          <slot name="tooltip"></slot>
        </div>

        <div class="input-wrapper">
          <input
            class="${classMap({
              [`size--${this.size}`]: true,
              'input-custom': true,
              'is-readonly': this.readonly,
            })}"
            type="text"
            id=${anchorId}
            name=${this.name}
            placeholder=${placeholder}
            ?disabled=${this.datePickerDisabled}
            ?readonly=${!this.datePickerDisabled && this.readonly}
            ?required=${this.required}
            ?invalid=${this._isInvalid}
            aria-invalid=${this._isInvalid ? 'true' : 'false'}
            aria-labelledby=${`label-${anchorId}`}
            autocomplete="off"
            @click=${this.handleInputClickEvent}
            @focus=${this.handleInputFocusEvent}
          />
          ${this.hasValue() && !this.readonly
            ? html`
                <kyn-button
                  ?disabled=${this.datePickerDisabled}
                  class="clear-button"
                  kind="ghost"
                  size="small"
                  description=${this._textStrings.clearAll}
                  @click=${this._handleClear}
                >
                  <span style="display:flex" slot="icon">
                    ${unsafeSVG(clearIcon)}
                  </span>
                </kyn-button>
              `
            : html`<span
                class="input-icon ${this.datePickerDisabled
                  ? 'is-disabled'
                  : ''}"
                aria-hidden="true"
                @click=${this.handleInputClickEvent}
              >
                ${unsafeSVG(calendarIcon)}
              </span>`}
        </div>

        ${this.caption
          ? html`<div
              id=${descriptionId}
              class="caption"
              aria-disabled=${this.datePickerDisabled ? 'true' : 'false'}
              @mousedown=${this.onSuppressLabelInteraction}
              @click=${this.onSuppressLabelInteraction}
              @keydown=${(e: KeyboardEvent) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  this.onSuppressLabelInteraction(e);
                }
              }}
            >
              ${this.caption}
            </div>`
          : ''}
        ${this.renderValidationMessage(errorId, warningId)}
      </div>
    `;
  }

  private renderValidationMessage(errorId: string, warningId: string) {
    if (this.datePickerDisabled) return null;

    if (this.invalidText || (this._isInvalid && this._hasInteracted)) {
      return html`<div
        id=${errorId}
        class="error error-text"
        role="alert"
        title=${this.errorTitle || 'Error'}
        @mousedown=${this.onSuppressLabelInteraction}
      >
        <span
          class="error-icon"
          role="img"
          aria-label=${this.errorAriaLabel || 'Error message icon'}
        >
          ${unsafeSVG(errorIcon)}
        </span>
        ${this.invalidText ||
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
        @mousedown=${this.onSuppressLabelInteraction}
        @click=${this.onSuppressLabelInteraction}
        tabindex="0"
        @keydown=${(e: KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.onSuppressLabelInteraction(e);
          }
        }}
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

  override async firstUpdated(changedProperties: PropertyValues) {
    super.firstUpdated(changedProperties);
    if (!this._initialized) {
      injectFlatpickrStyles(ShidokaFlatpickrTheme.toString());
      this._initialized = true;
      await this.updateComplete;
      this.setupAnchor();

      if (this._hasInitialDefaultDate && this.defaultDate) {
        const processedDates = this.processDefaultDates(this.defaultDate);
        if (processedDates && processedDates.length > 0) {
          if (this.mode === 'multiple') {
            this.value = [...processedDates];
          } else {
            this.value = processedDates[0];
          }
        }
      }
    }
  }

  private processDefaultDates(
    defaultDate: string | string[] | Date | Date[] | null
  ): Date[] {
    if (!defaultDate) return [];

    const values = Array.isArray(defaultDate) ? defaultDate : [defaultDate];

    const nonEmptyValues = values.filter(
      (v) =>
        v !== null &&
        v !== undefined &&
        v !== '' &&
        !(typeof v === 'string' && v.trim() === '')
    );

    if (nonEmptyValues.length === 0) return [];

    const parsed = nonEmptyValues.map((d) => {
      if (d instanceof Date) return d;
      if (typeof d === 'string') return this.parseDateString(d);
      return null;
    });

    const valid = parsed.filter(
      (d): d is Date => d instanceof Date && !isNaN(d.getTime())
    );

    if (valid.length !== parsed.length) {
      console.error('Invalid date(s) provided in defaultDate', {
        defaultDate,
        parsed,
        valid,
      });
      this.invalidText = this._textStrings.pleaseSelectValidDate;
      this.defaultDate = null;
    }

    return valid;
  }

  override updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    if (changedProperties.has('textStrings')) {
      this._textStrings = { ..._defaultTextStrings, ...this.textStrings };
    }

    if (changedProperties.has('value') && !this._isClearing) {
      const val = this.value;
      const isNull = val === null || (Array.isArray(val) && val.length === 0);

      if (isNull && this.flatpickrInstance) {
        this._isClearing = true;
        try {
          this.flatpickrInstance.clear();
          if (this._inputEl) {
            this._inputEl.value = '';
          }
        } finally {
          this._isClearing = false;
        }
      } else if (this.flatpickrInstance && val != null) {
        const dates: Date[] = Array.isArray(val)
          ? val.filter((d): d is Date => d instanceof Date)
          : val instanceof Date
          ? [val]
          : [];

        if (dates.length > 0) {
          this.flatpickrInstance.setDate(dates, false);
        }
      }

      if (this._inputEl) {
        this.updateFormValue();
      }

      this.requestUpdate();
    }

    if (changedProperties.has('defaultDate') && !this._isClearing) {
      const processedDates = this.processDefaultDates(this.defaultDate);

      const hasExplicitValue =
        this.value !== null &&
        (!Array.isArray(this.value) || this.value.length > 0);

      if (
        !hasExplicitValue &&
        processedDates.length > 0 &&
        this.flatpickrInstance
      ) {
        this.value =
          this.mode === 'multiple' ? [...processedDates] : processedDates[0];

        this.flatpickrInstance.setDate(processedDates, true);

        if (this._inputEl) {
          this.updateFormValue();
        }
      }
    }

    if (changedProperties.has('disable')) {
      if (Array.isArray(this.disable)) {
        this._processedDisableDates = this.disable.map((date) => {
          if (date instanceof Date) return date;
          if (typeof date === 'number') return new Date(date);
          if (typeof date === 'string') {
            const [y, m, d] = date.split('-').map(Number);
            return !isNaN(y) && !isNaN(m) && !isNaN(d)
              ? new Date(y, m - 1, d)
              : date;
          }
          return date;
        });
      } else {
        this._processedDisableDates = [];
      }
      if (this.flatpickrInstance) {
        this.debouncedUpdate();
      }
    }

    if (
      changedProperties.has('dateFormat') ||
      changedProperties.has('minDate') ||
      changedProperties.has('maxDate') ||
      changedProperties.has('locale') ||
      changedProperties.has('twentyFourHourFormat')
    ) {
      this._enableTime = updateEnableTime(this.dateFormat);
      if (this.flatpickrInstance && this._initialized && !this._isClearing) {
        this.debouncedUpdate();
      }
    }

    if (
      (changedProperties.has('datePickerDisabled') &&
        this.datePickerDisabled) ||
      (changedProperties.has('readonly') && this.readonly)
    ) {
      this.flatpickrInstance?.close();
    }

    if (changedProperties.has('allowManualInput')) {
      this.syncAllowInput();
    }
  }

  private syncAllowInput(): void {
    if (!this.flatpickrInstance) return;
    this.flatpickrInstance.set('allowInput', this.allowManualInput);
    if (!this.readonly && this._inputEl) {
      this._inputEl.readOnly = !this.allowManualInput;
    }
  }

  private async setupAnchor() {
    if (!this._inputEl) {
      return;
    }

    try {
      await this.initializeFlatpickr();
    } catch (error) {
      console.error('Error setting up flatpickr:', error);
    }
  }

  private async _handleClear(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    if (!this.flatpickrInstance) {
      console.warn('Cannot clear: Flatpickr instance not available');
      return;
    }

    this._isClearing = true;

    try {
      this.value = this.mode === 'multiple' ? [] : null;
      this.defaultDate = null;

      await clearFlatpickrInput(
        this.flatpickrInstance,
        this._inputEl ?? undefined,
        () => {
          this.updateFormValue();
        }
      );

      emitValue(this, 'on-change', {
        dates: this.value,
        dateString: this._inputEl?.value,
        source: 'clear',
      });

      this._validate(true, false);
      await this.updateComplete;
      await this.initializeFlatpickr();
      this.requestUpdate();
    } catch (error) {
      console.error('Error clearing datepicker:', error);
    } finally {
      this._isClearing = false;
    }
  }

  async initializeFlatpickr() {
    if (this._isDestroyed) return;

    if (!this._inputEl || !this._inputEl.isConnected) {
      console.warn(
        'Cannot initialize Flatpickr: input element not available or not connected to DOM'
      );
      return;
    }

    try {
      if (this.flatpickrInstance) {
        const __handlers = (this.flatpickrInstance as any)
          .__anchorClickHandlers;
        if (Array.isArray(__handlers)) {
          __handlers.forEach((h: { el: HTMLElement; fn: EventListener }) => {
            try {
              h.el.removeEventListener('click', h.fn as EventListener);
            } catch (e) {
              // ignore cleanup errors
            }
          });
        }

        this.flatpickrInstance.destroy();
        this.flatpickrInstance = undefined;
      }

      this.flatpickrInstance = await initializeSingleAnchorFlatpickr({
        inputEl: this._inputEl,
        getFlatpickrOptions: () => this.getComponentFlatpickrOptions(),
        setCalendarAttributes: (instance) => {
          try {
            const container = getModalContainer(this);
            const isInModal = container !== document.body;

            setCalendarAttributes(instance, isInModal);

            if (instance.calendarContainer) {
              if (isInModal) {
                instance.calendarContainer.classList.add('container-modal');
                instance.calendarContainer.classList.remove(
                  'container-default'
                );
              }
              instance.calendarContainer.setAttribute(
                'aria-label',
                'Date picker'
              );
            }
          } catch (error) {
            console.error('Error setting calendar attributes:', error);
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

  async updateFlatpickrOptions() {
    if (!this.flatpickrInstance) {
      console.warn('Cannot update options: Flatpickr instance not available');
      return;
    }
    await this.debouncedUpdate();
  }

  private parseDateString(dateStr: string): Date | null {
    if (!dateStr.trim()) return null;

    // try ISO / native parsing first
    if (dateStr.includes('T')) {
      try {
        const date = new Date(dateStr);
        if (!isNaN(date.getTime())) return date;
      } catch (e) {
        console.warn('Error parsing ISO date string:', e);
      }
    }

    const dtMatch =
      /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?$/.exec(dateStr);
    if (dtMatch) {
      const y = Number(dtMatch[1]);
      const mo = Number(dtMatch[2]);
      const da = Number(dtMatch[3]);
      const hh = Number(dtMatch[4]);
      const mm = Number(dtMatch[5]);
      const ss = dtMatch[6] !== undefined ? Number(dtMatch[6]) : 0;
      const dt = new Date(y, mo - 1, da, hh, mm, ss);
      return isNaN(dt.getTime()) ? null : dt;
    }

    const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
    if (dateMatch) {
      const y = Number(dateMatch[1]);
      const mo = Number(dateMatch[2]);
      const da = Number(dateMatch[3]);
      const dt = new Date(y, mo - 1, da);
      return isNaN(dt.getTime()) ? null : dt;
    }

    // fallback: try parsing using flatpickr with the component's dateFormat
    try {
      const parsed = (flatpickr as any).parseDate(dateStr, this.dateFormat);
      return parsed instanceof Date && !isNaN(parsed.getTime()) ? parsed : null;
    } catch (e) {
      return null;
    }
  }

  private resolveYearFromConfig(
    value: Date | string | number | undefined
  ): number | null {
    if (!value) return null;

    if (value instanceof Date) {
      return value.getFullYear();
    }

    if (typeof value === 'number') {
      const d = new Date(value);
      return isNaN(d.getTime()) ? null : d.getFullYear();
    }

    if (typeof value === 'string') {
      const d = this.parseDateString(value);
      return d ? d.getFullYear() : null;
    }

    return null;
  }

  setInitialDates() {
    if (!this.flatpickrInstance) {
      return;
    }

    try {
      const dateToSet =
        this.value && (!Array.isArray(this.value) || this.value.length > 0)
          ? this.value
          : this.defaultDate;

      if (!dateToSet) return;

      if (Array.isArray(dateToSet)) {
        const validDates = dateToSet
          .map((date) => {
            if (date instanceof Date) return date;
            if (typeof date === 'string') return this.parseDateString(date);
            return null;
          })
          .filter(
            (date): date is Date => date !== null && !isNaN(date.getTime())
          );

        if (validDates.length > 0) {
          this.flatpickrInstance.setDate(validDates, true);

          if (
            this.value === null ||
            (Array.isArray(this.value) && this.value.length === 0)
          ) {
            this.value =
              this.mode === 'multiple' ? [...validDates] : validDates[0];
          }
        }
      } else if (typeof dateToSet === 'string') {
        const parsedDate = this.parseDateString(dateToSet);
        if (parsedDate) {
          this.flatpickrInstance.setDate(parsedDate, true);

          if (this.value === null) {
            this.value = parsedDate;
          }
        }
      } else if (dateToSet instanceof Date) {
        this.flatpickrInstance.setDate(dateToSet, true);

        if (this.value === null) {
          this.value = dateToSet;
        }
      }
    } catch (error) {
      console.warn('Error setting initial dates:', error);
    }
  }

  async getComponentFlatpickrOptions(): Promise<Partial<BaseOptions>> {
    if (!this._inputEl) {
      return {};
    }

    const container = getModalContainer(this);

    let effectiveDefaultDate: string | Date | string[] | Date[] | undefined;

    if (this.value && (!Array.isArray(this.value) || this.value.length > 0)) {
      // value takes precedence
      if (Array.isArray(this.value)) {
        effectiveDefaultDate = this.value;
      } else if (this.value instanceof Date) {
        effectiveDefaultDate = this.value;
      }
    } else if (this.defaultDate) {
      const processedDates = this.processDefaultDates(this.defaultDate);

      if (processedDates.length > 0) {
        effectiveDefaultDate =
          this.mode === 'multiple' ? processedDates : processedDates[0];
      }
    }

    const options = await getFlatpickrOptions({
      locale: this.locale,
      dateFormat: this.dateFormat,
      defaultDate: effectiveDefaultDate,
      enableTime: this._enableTime,
      twentyFourHourFormat: this.twentyFourHourFormat ?? undefined,
      inputEl: this._inputEl,
      minDate: this.minDate,
      maxDate: this.maxDate,
      enable: this.enable,
      disable: this._processedDisableDates,
      mode: this.mode,
      allowInput: this.allowManualInput,
      closeOnSelect: !(this.mode === 'multiple' || this._enableTime),
      loadLocale,
      onOpen: this.handleOpen.bind(this),
      onClose: this.handleClose.bind(this),
      onChange: this.handleDateChange.bind(this),
      appendTo: container,
      noCalendar: false,
      static: this.staticPosition,
    });

    if (this.mode === 'multiple') {
      options.closeOnSelect = false;
    }

    return options;
  }

  async handleOpen() {
    if (this.readonly) {
      this.flatpickrInstance?.close();
      return;
    }

    if (!this._shouldFlatpickrOpen) {
      this.flatpickrInstance?.close();
      this._shouldFlatpickrOpen = true;
      return;
    }

    this.flatpickrInstance?.open();
    this._shouldFlatpickrOpen = false;

    const instance = this.flatpickrInstance;
    const cfg = instance?.config;
    if (cfg && instance?.calendarContainer) {
      const minY = this.resolveYearFromConfig(
        cfg.minDate as Date | string | number | undefined
      );
      const maxY = this.resolveYearFromConfig(
        cfg.maxDate as Date | string | number | undefined
      );

      if (minY !== null && maxY !== null) {
        instance.calendarContainer.classList.toggle(
          'single-year',
          minY === maxY
        );
      }
    }

    hideEmptyYear();
  }

  async handleClose() {
    this._validate(false, false);
    await this.updateComplete;

    if (!this.value && !this.defaultDate) {
      this._hasInteracted = true;
    }
  }

  async handleDateChange(selectedDates: Date[], dateStr: string) {
    if (this._isClearing) return;

    this._hasInteracted = true;

    try {
      const invalidDates = selectedDates.filter((date) =>
        isNaN(date.getTime())
      );
      if (invalidDates.length > 0) {
        this.invalidText = this._textStrings.invalidDateFormat;
        this._validate(true, false);
        return;
      }

      if (this.mode === 'multiple') {
        this.value = selectedDates.length > 0 ? [...selectedDates] : [];
      } else {
        this.value = selectedDates.length > 0 ? selectedDates[0] : null;
      }

      let formattedDates: string | string[] | null | [];
      const isMultiple = this.mode === 'multiple';

      if (isMultiple) {
        formattedDates = selectedDates.map((date) => date.toISOString());
      } else if (selectedDates.length > 0) {
        formattedDates = selectedDates[0].toISOString();
      } else {
        formattedDates = isMultiple ? [] : null;
      }

      const dateObjects = isMultiple
        ? selectedDates.map((d) => (d instanceof Date ? d : new Date(d)))
        : selectedDates.length > 0
        ? (selectedDates[0] as Date)
        : null;

      emitValue(this, 'on-change', {
        dates: formattedDates,
        dateObjects,
        dateString: this._inputEl?.value || dateStr,
        source: selectedDates.length === 0 ? 'clear' : undefined,
      });

      if (this.invalidText) {
        this.invalidText = '';
      }

      this._validate(true, false);
      await this.updateComplete;
      this.requestUpdate();
    } catch (error) {
      console.error('Error handling date change:', error);
      this.invalidText = this._textStrings.errorProcessing;
      this._validate(true, false);
    }
  }

  private setShouldFlatpickrOpen(value: boolean) {
    this._shouldFlatpickrOpen = value;
  }

  private closeFlatpickr() {
    this.flatpickrInstance?.close();
  }

  private onSuppressLabelInteraction(event: Event) {
    event.stopPropagation();
    this.setShouldFlatpickrOpen(false);
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

  private _validate(interacted: boolean, report: boolean) {
    if (!this._inputEl || !(this._inputEl instanceof HTMLInputElement)) return;

    if (this.datePickerDisabled) {
      this._internals.setValidity({}, '', this._inputEl);
      this._isInvalid = false;
      this._internalValidationMsg = '';
      return;
    }

    if (interacted) {
      this._hasInteracted = true;
    }

    const hasValidDefaultValue =
      this.defaultDate !== null &&
      ((typeof this.defaultDate === 'string' &&
        this.defaultDate.trim() !== '') ||
        (Array.isArray(this.defaultDate) &&
          this.defaultDate.length > 0 &&
          this.defaultDate.some((date) => date && date !== '')));

    const isEmpty = !this._inputEl.value.trim() && !hasValidDefaultValue;
    const isRequired = this.required;

    let validity = this._inputEl.validity;
    let validationMessage = this._inputEl.validationMessage;

    if (
      !this._hasInteracted &&
      !interacted &&
      this._enableTime &&
      !(isRequired && isEmpty)
    ) {
      this._internals.setValidity({}, '', this._inputEl);
      this._isInvalid = false;
      this._internalValidationMsg = '';
      return;
    }

    if (isRequired && isEmpty) {
      validity = { ...validity, valueMissing: true };
      validationMessage =
        this.defaultErrorMessage || this._textStrings.pleaseSelectDate;

      this._internals.setValidity(validity, validationMessage, this._inputEl);

      this._isInvalid = this._hasInteracted || interacted;
      this._internalValidationMsg = validationMessage;

      if (report) {
        this._internals.reportValidity();
      }

      this.requestUpdate();
      return;
    }

    if (this.mode === 'multiple' && this._inputEl.value.trim() !== '') {
      if (this.invalidText) {
        this.invalidText = '';
      }
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
      !isValid &&
      (this._hasInteracted || this.invalidText !== '' || interacted);
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

  public getValue(): Date | Date[] | null {
    if (this.flatpickrInstance) {
      const selected = this.flatpickrInstance.selectedDates;

      if (this.mode === 'multiple') {
        return selected.length > 0 ? [...selected] : null;
      }

      return selected[0] ?? null;
    }

    return this.value;
  }

  public setValue(newValue: Date | Date[] | null): void {
    const isClear =
      newValue === null || (Array.isArray(newValue) && newValue.length === 0);

    this._isClearing = isClear;

    try {
      if (this.flatpickrInstance) {
        if (isClear) {
          this.flatpickrInstance.clear();
        } else {
          const dates = Array.isArray(newValue) ? newValue : [newValue];
          this.flatpickrInstance.setDate(dates, true);
        }

        const selected = this.flatpickrInstance.selectedDates;
        if (this.mode === 'multiple') {
          this.value = selected.length > 0 ? [...selected] : null;
        } else {
          this.value = selected[0] ?? null;
        }

        if (this._inputEl) {
          this.updateFormValue();
        }
      } else {
        this.value = newValue;
      }

      this.requestUpdate('value');
    } finally {
      this._isClearing = false;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-date-picker': DatePicker;
  }
}
