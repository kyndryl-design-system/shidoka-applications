import { LitElement, html, PropertyValues, unsafeCSS } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { FormMixin } from '../../../common/mixins/form-input';
import { langsArray } from '../../../common/flatpickrLangs';

import '../../reusable/button';

import {
  injectFlatpickrStyles,
  initializeSingleAnchorFlatpickr,
  getFlatpickrOptions,
  handleInputClick,
  handleInputFocus,
  setCalendarAttributes,
  loadLocale,
  emitValue,
  hideEmptyYear,
  getModalContainer,
  clearFlatpickrInput,
} from '../../../common/helpers/flatpickr';

import flatpickr from 'flatpickr';
import { BaseOptions } from 'flatpickr/dist/types/options';

import TimepickerStyles from './timepicker.scss?inline';
import ShidokaFlatpickrTheme from '../../../common/scss/shidoka-flatpickr-theme.scss?inline';

import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';

import errorIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/close-filled.svg';
import clockIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/24/time.svg';
import clearIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/close-simple.svg';

type SupportedLocale = (typeof langsArray)[number];

type TimePickerValue = string | Date | null;

const _defaultTextStrings = {
  requiredText: 'Required',
  clearAll: 'Clear',
  pleaseSelectDate: 'Please select a date',
  noTimeSelected: 'No time selected',
  pleaseSelectValidDate: 'Please select a valid date',

  lockedStartDate: 'Start date is locked',
  lockedEndDate: 'End date is locked',
  dateLocked: 'Date is locked',
  dateNotAvailable: 'Date is not available',
  dateInSelectedRange: 'Date is in selected range',
};

/**
 * Timepicker: uses Flatpickr library,time picker implementation  -- `https://flatpickr.js.org/examples/#time-picker`
 * @fires on-change - Emitted when the selected time changes. Event.detail has the shape:
 *   { time: string | null, source?: string }
 *   - time: formatted time string when a time is selected, or null when cleared.
 *   - source: 'clear' when the value was cleared; otherwise undefined.
 * @slot tooltip - Slot for tooltip.
 * @attr {string} [name=''] - The name of the input, used for form submission.
 * @attr {string} [value=''] - The value of the input.
 * @attr {string} [invalidText=''] - The custom validation message when the input is invalid.
 */
@customElement('kyn-time-picker')
export class TimePicker extends FormMixin(LitElement) {
  static override styles = [
    unsafeCSS(TimepickerStyles),
    unsafeCSS(ShidokaFlatpickrTheme),
  ];

  /** Label text. */
  @property({ type: String })
  accessor label = '';

  /** Sets desired locale and, if supported, dynamically loads language lib */
  @property({ type: String })
  accessor locale: SupportedLocale | string = 'en';

  /**
   * @deprecated Use `value` (Date or time string) to prefill the time instead.
   * Legacy: initial hour when `value` is unset.
   */
  @property({ type: Number, reflect: true })
  accessor defaultHour: number | null = null;

  /**
   * @deprecated Use `value` (Date or time string) to prefill the time instead.
   * Legacy: initial minute when `value` is unset.
   */
  @property({ type: Number, reflect: true })
  accessor defaultMinute: number | null = null;

  /**
   * @deprecated Use `value` (Date or time string) to prefill the time instead.
   * Legacy: initial seconds when `value` is unset.
   */
  @property({ type: Number, reflect: true })
  accessor defaultSeconds: number | null = null;

  /** Allows manual input of time string (when true, user can type a time) */
  @property({ type: Boolean })
  accessor allowManualInput = false;

  /**
   * Current time value for the component.
   *
   * - Uncontrolled: populated from `defaultHour` / `defaultMinute` / `defaultSeconds` and user selections.
   * - Controlled: can be set from the host (e.g. Vue `:value`) as a `Date` or time string.
   */
  override value: string | Date | null = null;

  /** Sets default error message. */
  @property({ type: String })
  accessor defaultErrorMessage = '';

  /** Sets validation warning messaging. */
  @property({ type: String })
  accessor warnText = '';

  /** Sets caption to be displayed under primary time picker elements. */
  @property({ type: String })
  accessor caption = '';

  /** Sets timepicker form input value to required. */
  @property({ type: Boolean })
  accessor required = false;

  /** Input size. "sm", "md", or "lg". */
  @property({ type: String })
  accessor size = 'md';

  /** Sets entire timepicker form element to enabled/disabled. */
  @property({ type: Boolean })
  accessor timepickerDisabled = false;

  /** Sets entire timepicker form element to readonly. */
  @property({ type: Boolean })
  accessor readonly = false;

  /** Sets 24-hour formatting true/false. */
  @property({ type: Boolean })
  accessor twentyFourHourFormat: boolean | null = null;

  /** Enable seconds in the timepicker UI. */
  @property({ type: Boolean })
  accessor enableSeconds = false;

  /** Sets lower boundary of time selection. */
  @property({ type: String })
  accessor minTime: string | number | Date = '';

  /** Sets upper boundary of time selection. */
  @property({ type: String })
  accessor maxTime: string | number | Date = '';

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

  /**
   * Sets whether user has interacted with timepicker for error handling.
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
   * @ignore
   */
  @query('input.input-custom')
  private accessor _inputEl: HTMLInputElement | null = null;

  /** Tracks if we're in a clear operation to prevent duplicate events
   * @internal
   */
  @state()
  private accessor _isClearing = false;

  /** Tracks if user has explicitly cleared the input despite having defaults
   * @internal
   */
  @state()
  private accessor _userHasCleared = false;

  /** Customizable text strings. */
  @property({ type: Object })
  accessor textStrings = _defaultTextStrings;

  /** Internal text strings.
   * @internal
   */
  @state()
  accessor _textStrings = { ..._defaultTextStrings };

  /** Control flag to determine if Flatpickr should open
   * @internal
   */
  private _shouldFlatpickrOpen = true;

  /** Track whether change originated from Flatpickr to avoid feedback loops.
   * @internal
   */
  private _isFromFlatpickr = false;

  /** Track whether Flatpickr styles and instance have been initialized.
   * @internal
   */
  private _initialized = false;

  /** Track destroyed state so we don't re-initialize after disconnect.
   * @internal
   */
  private _isDestroyed = false;

  /** Track visibility polling timeout ID. */
  private _visibilityPollTimeoutId: number | null = null;

  /** Track when legacy/default values are being applied to avoid feedback loops.
   * @internal
   */
  private _applyingDefaults = false;

  /** Internal ID used to associate the input with its calendar container.
   * @internal
   */
  private _anchorId: string | null = null;

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

  /** Debounced re-initialization helper used when configuration changes.
   * @internal
   */
  private debouncedUpdate = this.debounce(async () => {
    if (!this.flatpickrInstance || this._isDestroyed) return;

    if ((this.flatpickrInstance as any).isOpen) return;

    try {
      await this.initializeFlatpickr();
    } catch (error) {
      console.error('Error in debounced update:', error);
    }
  }, 100);

  private generateRandomId(prefix: string): string {
    return `${prefix}-${Math.random().toString(36).slice(2, 11)}`;
  }

  /**
   * Parses a time string (e.g. "14:30" or "14:30:45") or Date/number into a Date object
   * anchored to today, or returns null if invalid.
   */
  private parseTimeString(time: string | number | Date): Date | null {
    if (time instanceof Date) return time;
    if (typeof time === 'number') {
      const d = new Date(time);
      return Number.isNaN(d.getTime()) ? null : d;
    }
    if (typeof time === 'string') {
      const str = time.trim();

      // Accept formats like '14:30', '2:30 PM', '02:30:45', etc.
      const ampmMatch = /^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*([ap]m)?$/i.exec(
        str
      );
      if (!ampmMatch) return null;

      let hours = Number(ampmMatch[1]);
      const minutes = Number(ampmMatch[2]);
      const seconds = ampmMatch[3] !== undefined ? Number(ampmMatch[3]) : 0;
      const ampm = ampmMatch[4];

      if (
        Number.isNaN(hours) ||
        Number.isNaN(minutes) ||
        Number.isNaN(seconds)
      ) {
        return null;
      }

      if (ampm) {
        const a = ampm.toLowerCase();
        if (a === 'pm' && hours < 12) hours += 12;
        if (a === 'am' && hours === 12) hours = 0;
      }

      if (
        hours < 0 ||
        hours > 23 ||
        minutes < 0 ||
        minutes > 59 ||
        seconds < 0 ||
        seconds > 59
      ) {
        return null;
      }

      const d = new Date();
      d.setHours(hours, minutes, seconds, 0);
      return d;
    }
    return null;
  }

  private _timesEqual(a: Date | null | undefined, b: Date | null | undefined) {
    if (!a && !b) return true;
    if (!a || !b) return false;
    return (
      a.getHours() === b.getHours() &&
      a.getMinutes() === b.getMinutes() &&
      a.getSeconds() === b.getSeconds()
    );
  }

  private _incomingValueToDate(value: TimePickerValue): Date | null {
    if (value == null) return null;
    if (value instanceof Date) {
      return Number.isNaN(value.getTime()) ? null : value;
    }
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (!trimmed) return null;
      const parsed = /\d{4}-\d{2}-\d{2}/.test(trimmed)
        ? new Date(trimmed)
        : this.parseTimeString(trimmed);
      return parsed && !Number.isNaN(parsed.getTime()) ? parsed : null;
    }
    return null;
  }

  override connectedCallback() {
    super.connectedCallback();
    this.addEventListener('change', this._onChange);
    this.addEventListener('reset', this._handleFormReset);

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

  private hasValue(): boolean {
    return (
      Boolean(this.value) ||
      (!this._userHasCleared &&
        (this.defaultHour !== null || this.defaultMinute !== null))
    );
  }

  private updateFormValue() {
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
        : this.generateRandomId('time-picker'));
    const descriptionId = this.name ?? '';
    const placeholder = this.enableSeconds ? '—— : —— : ——' : '—— : ——';

    return html`
      <div class=${classMap(this.getTimepickerClasses())}>
        <div
          class="label-text"
          @mousedown=${this.onSuppressLabelInteraction}
          @click=${this.onSuppressLabelInteraction}
          ?disabled=${this.timepickerDisabled}
          ?readonly=${this.readonly}
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
            ?disabled=${this.timepickerDisabled}
            ?readonly=${!this.timepickerDisabled && this.readonly}
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
                  ?disabled=${this.timepickerDisabled}
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
                class="input-icon ${this.timepickerDisabled
                  ? 'is-disabled'
                  : ''}"
                aria-hidden="true"
                @click=${this.handleInputClickEvent}
              >
                ${unsafeSVG(clockIcon)}
              </span>`}
        </div>
        ${this.caption
          ? html`<div
              id=${descriptionId}
              class="caption"
              aria-disabled=${this.timepickerDisabled}
              @mousedown=${this.onSuppressLabelInteraction}
              @click=${this.onSuppressLabelInteraction}
            >
              ${this.caption}
            </div>`
          : ''}
        ${this.renderValidationMessage(errorId, warningId)}
      </div>
    `;
  }

  private renderValidationMessage(errorId: string, warningId: string) {
    if (this.timepickerDisabled) return null;

    if (this.invalidText || (this._isInvalid && this._hasInteracted)) {
      return html`<div
        id=${errorId}
        class="error error-text"
        role="alert"
        title=${this.errorTitle || 'Error'}
        @mousedown=${this.onSuppressLabelInteraction}
        @click=${this.onSuppressLabelInteraction}
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
      >
        ${this.warnText}
      </div>`;
    }

    return null;
  }

  private getRawValue(): TimePickerValue {
    return this.value as TimePickerValue;
  }

  getTimepickerClasses() {
    return {
      'time-picker': true,
      'time-picker__disabled': this.timepickerDisabled,
    };
  }

  private _padSecondsForInput(el?: HTMLInputElement | null) {
    const input = el ?? this._inputEl;
    const showSeconds = this.enableSeconds || this.defaultSeconds !== null;
    if (!input || !showSeconds) return;

    const val = (input.value || '').trim();
    if (!val) return;

    // match time with optional seconds and optional AM/PM
    const m = val.match(
      /^(.*?)(\d{1,2}):(\d{2})(?::(\d{1,2}))?(\s*[AP]M)?(.*)$/i
    );
    if (!m) return;

    const pre = m[1] || '';
    const hour = m[2];
    const min = m[3];
    const sec = m[4] !== undefined ? m[4].padStart(2, '0') : '00';
    const ampm = m[5] || '';
    const post = m[6] || '';

    const newVal = `${pre}${hour}:${min}:${sec}${ampm}${post}`.trim();
    if (newVal !== input.value) {
      input.value = newVal;
      try {
        this.updateFormValue();
      } catch (e) {
        // ignore
      }
    }
  }

  private async syncFlatpickrFromHostValue() {
    if (!this.flatpickrInstance) return;

    const raw = this.getRawValue();

    try {
      this.flatpickrInstance.redraw?.();

      if (raw && typeof raw !== 'string') {
        // treat as Date
        this.flatpickrInstance.setDate(raw, true);
        this._padSecondsForInput(this.flatpickrInstance.input ?? undefined);
      } else if (typeof raw === 'string' && raw.trim() !== '') {
        this.flatpickrInstance.setDate(raw, true);
        this._padSecondsForInput(this.flatpickrInstance.input ?? undefined);
      } else if (raw === null) {
        this.flatpickrInstance.clear();
        if (this._inputEl) {
          this._inputEl.value = '';
          this.updateFormValue();
        }
      }
    } catch (err) {
      console.warn('Error syncing flatpickr from host value:', err);
    }
  }

  override async firstUpdated(changedProperties: PropertyValues) {
    super.firstUpdated(changedProperties);

    if (!this._initialized) {
      injectFlatpickrStyles(ShidokaFlatpickrTheme.toString());
      this._initialized = true;
      await this.updateComplete;

      let wasVisible = this.isElementVisible();

      if (wasVisible) {
        await this.setupAnchor();
      }

      const pollVisibility = async () => {
        if (this._isDestroyed) return;

        const nowVisible = this.isElementVisible();

        if (!wasVisible && nowVisible) {
          if (!this.flatpickrInstance) {
            await this.setupAnchor();
          } else {
            await this.syncFlatpickrFromHostValue();
          }
        }

        wasVisible = nowVisible;

        if (!nowVisible) {
          this._visibilityPollTimeoutId = window.setTimeout(
            pollVisibility,
            250
          );
        }
      };

      if (!wasVisible) {
        this._visibilityPollTimeoutId = window.setTimeout(pollVisibility, 250);
      }
    }
  }

  private isElementVisible(): boolean {
    try {
      if (!this.isConnected) return false;
      const el = this as HTMLElement;
      const rects = el.getClientRects();
      if (!rects || rects.length === 0) return false;
      const style = window.getComputedStyle(el);
      if (
        style.display === 'none' ||
        style.visibility === 'hidden' ||
        style.opacity === '0'
      )
        return false;
      return true;
    } catch (e) {
      return false;
    }
  }

  override updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    if (this._applyingDefaults) return;

    if (changedProperties.has('textStrings')) {
      this._textStrings = { ..._defaultTextStrings, ...this.textStrings };
    }

    if (
      (changedProperties.has('defaultHour') ||
        changedProperties.has('defaultMinute') ||
        changedProperties.has('defaultSeconds') ||
        changedProperties.has('invalidText') ||
        changedProperties.has('minTime') ||
        changedProperties.has('maxTime') ||
        changedProperties.has('twentyFourHourFormat') ||
        changedProperties.has('enableSeconds')) &&
      this.flatpickrInstance &&
      !this._isClearing
    ) {
      this.debouncedUpdate();
    }

    if (
      changedProperties.has('value') &&
      !this._isClearing &&
      !this._isFromFlatpickr
    ) {
      const incoming = this.value;

      if (!this.flatpickrInstance) {
        return;
      }

      // Controlled-mode guard: if the host writes back the same time we already
      // have selected in Flatpickr, skip setDate() to avoid feedback-loop churn.
      const incomingDate = this._incomingValueToDate(incoming);
      const currentSelected = this.flatpickrInstance.selectedDates?.[0] ?? null;
      if (
        incomingDate &&
        currentSelected &&
        this._timesEqual(incomingDate, currentSelected)
      ) {
        // Still keep the visible input/form value in sync.
        if (this._inputEl && this.flatpickrInstance.input) {
          this._inputEl.value = this.flatpickrInstance.input.value;
          this._padSecondsForInput(this._inputEl);
          this.updateFormValue();
        }
        return;
      }

      const hadFocus =
        (this.renderRoot instanceof ShadowRoot
          ? this.renderRoot.activeElement
          : document.activeElement) === this._inputEl;

      this._isFromFlatpickr = true;
      try {
        if (
          incoming == null ||
          (typeof incoming === 'string' && incoming.trim() === '')
        ) {
          this._isClearing = true;
          try {
            this.flatpickrInstance.clear();
            if (this._inputEl) this._inputEl.value = '';
          } finally {
            this._isClearing = false;
          }
        } else if (incoming instanceof Date) {
          this.flatpickrInstance.setDate(incoming, true);
        } else if (typeof incoming === 'string') {
          const strValue = incoming.trim();
          const parsed = /\d{4}-\d{2}-\d{2}/.test(strValue)
            ? new Date(strValue)
            : this.parseTimeString(strValue);
          if (parsed && !Number.isNaN(parsed.getTime())) {
            this.flatpickrInstance.setDate(parsed, true);
          }
        }

        if (this._inputEl && this.flatpickrInstance.input) {
          this._inputEl.value = this.flatpickrInstance.input.value;
        }

        if (this._inputEl) {
          this._padSecondsForInput(this._inputEl);
          this.updateFormValue();
        }
      } finally {
        this._isFromFlatpickr = false;
      }

      if (hadFocus && (this.flatpickrInstance as any)?.isOpen) {
        queueMicrotask(() => this._inputEl?.focus({ preventScroll: true }));
      }
    }

    if (
      (changedProperties.has('timepickerDisabled') &&
        this.timepickerDisabled) ||
      (changedProperties.has('readonly') && this.readonly)
    ) {
      this.flatpickrInstance?.close();
    }
  }

  private async _handleClear(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this._isClearing = true;
    this._userHasCleared = true;

    try {
      this.value = null;

      await clearFlatpickrInput(
        this.flatpickrInstance,
        this._inputEl ?? undefined,
        () => {
          if (this._inputEl) {
            this._inputEl.setAttribute(
              'aria-label',
              this._textStrings.noTimeSelected
            );
            this.updateFormValue();
          }
        }
      );

      emitValue(this, 'on-change', {
        time: null,
        date: null,
        source: 'clear',
      });
      this._validate(true, false);

      queueMicrotask(() => {
        if (!(this.flatpickrInstance as any)?.isOpen) {
          void this.initializeFlatpickr();
        }
      });
    } finally {
      this._isClearing = false;
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

  private removeCalendarElement(id?: string) {
    try {
      const calId = id ?? this._anchorId;
      if (calId) {
        const node = document.querySelector(
          `[data-kyn-timepicker-id="${calId}"]`
        ) as HTMLElement | null;
        if (node && node.parentNode) node.parentNode.removeChild(node);
      }
    } catch (e) {
      // ignore
    }
  }

  async initializeFlatpickr() {
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

        try {
          this.removeCalendarElement();
        } catch (e) {
          // ignore
        }

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
        inputEl,
        getFlatpickrOptions: async () => {
          const options = await this.getComponentFlatpickrOptions();
          if (options.noCalendar === false) {
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
              const id =
                this._anchorId ??
                (this._anchorId = this.generateRandomId('time-picker'));
              try {
                (
                  instance.calendarContainer as HTMLElement
                ).dataset.kynTimepickerId = id;
              } catch (e) {
                // ignore
              }

              instance.calendarContainer.setAttribute(
                'aria-label',
                'Time picker'
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

  async getComponentFlatpickrOptions(): Promise<Partial<BaseOptions>> {
    if (!this._inputEl) {
      return {};
    }

    const container = getModalContainer(this);
    let effectiveDateFormat = '';

    let timeDefaultDate: Date | undefined;
    const raw = this.getRawValue();

    if (raw && typeof raw !== 'string') {
      timeDefaultDate = new Date(raw.getTime());
    } else if (typeof raw === 'string' && raw.trim() !== '') {
      const parsed = this.parseTimeString(raw);
      if (parsed) {
        timeDefaultDate = parsed;
      }
    }

    const showSeconds =
      this.enableSeconds ||
      (timeDefaultDate != null && timeDefaultDate.getSeconds() !== 0);

    effectiveDateFormat = this.twentyFourHourFormat
      ? showSeconds
        ? 'H:i:S'
        : 'H:i'
      : showSeconds
      ? 'h:i:S K'
      : 'h:i K';

    return getFlatpickrOptions({
      locale: this.locale,
      enableTime: true,
      twentyFourHourFormat: this.twentyFourHourFormat ?? undefined,
      inputEl: this._inputEl,
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
      onReady: (selectedDates, dateStr, instance) => {
        void selectedDates;
        void dateStr;

        setTimeout(
          () => this._padSecondsForInput(instance.input ?? undefined),
          0
        );
      },
      appendTo: container,
      static: this.staticPosition,
      defaultDate: timeDefaultDate,
    });
  }

  setInitialDates(instance: flatpickr.Instance) {
    try {
      const raw = this.getRawValue();

      if (raw && typeof raw !== 'string') {
        instance.setDate(raw, false);
      } else if (typeof raw === 'string' && raw.trim() !== '') {
        instance.setDate(raw, false);
      } else if (
        !this._userHasCleared &&
        (this.defaultHour !== null || this.defaultMinute !== null) &&
        (raw === null || raw === undefined)
      ) {
        const date = new Date();
        if (this.defaultHour !== null) date.setHours(this.defaultHour);
        if (this.defaultMinute !== null) date.setMinutes(this.defaultMinute);
        const showSeconds = this.enableSeconds || this.defaultSeconds !== null;
        const secondsToSet = showSeconds ? this.defaultSeconds ?? 0 : 0;
        date.setSeconds(secondsToSet);
        date.setMilliseconds(0);

        instance.setDate(date, false);
      }

      this._padSecondsForInput(instance.input ?? undefined);
    } catch (error) {
      console.error('Error setting initial time:', error);
    }
  }

  handleOpen() {
    if (this.readonly) {
      this.flatpickrInstance?.close();
      return;
    }
    if (!this._shouldFlatpickrOpen) {
      this.flatpickrInstance?.close();
      this._shouldFlatpickrOpen = true;
    }
  }

  /**
   * Returns the selected time as a Date (anchored to today) or null.
   */
  public getValue(): Date | null {
    if (this.flatpickrInstance?.selectedDates[0]) {
      return this.flatpickrInstance.selectedDates[0];
    }

    const raw = this.getRawValue();

    if (raw && typeof raw !== 'string') {
      return raw;
    }

    if (typeof raw === 'string' && raw.trim() !== '') {
      return this.parseTimeString(raw);
    }

    return null;
  }

  async handleClose() {
    this._hasInteracted = true;
    this._validate(true, false);
    await this.updateComplete;
  }

  async handleTimeChange(selectedDates: Date[], dateStr: string) {
    if (this._isClearing) return;

    this._hasInteracted = true;

    const hadFocus =
      (this.renderRoot instanceof ShadowRoot
        ? this.renderRoot.activeElement
        : document.activeElement) === this._inputEl;

    this._isFromFlatpickr = true;

    try {
      if (selectedDates.length > 0) {
        this._userHasCleared = false;

        const selectedTime = selectedDates[0];
        const newDate = new Date();
        newDate.setHours(selectedTime.getHours());
        newDate.setMinutes(selectedTime.getMinutes());
        newDate.setSeconds(selectedTime.getSeconds());
        newDate.setMilliseconds(0);

        this.value = newDate;

        emitValue(this, 'on-change', {
          time: dateStr || null,
          date: newDate,
        });
      } else {
        this._userHasCleared = true;
        this.value = null;

        emitValue(this, 'on-change', {
          time: null,
          date: null,
          source: 'clear',
        });
      }
    } finally {
      await this.updateComplete;
      this._isFromFlatpickr = false;
    }

    this._validate(true, false);

    if (this._inputEl) {
      this.updateFormValue();
      this._padSecondsForInput(this._inputEl);
    }

    if (hadFocus && (this.flatpickrInstance as any)?.isOpen) {
      requestAnimationFrame(() => {
        this._inputEl?.focus({ preventScroll: true });
      });
    }
  }

  private _validate(interacted: boolean, report: boolean) {
    if (!this._inputEl || !(this._inputEl instanceof HTMLInputElement)) {
      return;
    }

    if (this.timepickerDisabled) {
      this._internals.setValidity({}, '', this._inputEl);
      this._isInvalid = false;
      this._internalValidationMsg = '';
      return;
    }

    if (interacted) {
      this._hasInteracted = true;
    }

    const hasDefaultValue =
      !this._userHasCleared &&
      (this.defaultHour !== null || this.defaultMinute !== null);

    const isEmpty = !this._inputEl.value.trim() && !hasDefaultValue;
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
  }

  private _onChange() {
    this._validate(true, false);
  }

  private _handleFormReset() {
    this.value = null;
    this._userHasCleared = false;
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

  override disconnectedCallback() {
    this._isDestroyed = true;

    if (this._visibilityPollTimeoutId !== null) {
      window.clearTimeout(this._visibilityPollTimeoutId);
      this._visibilityPollTimeoutId = null;
    }

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

      try {
        this.removeCalendarElement();
      } catch (e) {
        // ignore
      }

      this.flatpickrInstance = undefined;
    }
  }

  public setValue(newValue: Date | null): void {
    this._isClearing = newValue === null;

    try {
      if (this.flatpickrInstance) {
        if (newValue) {
          this.flatpickrInstance.setDate(newValue, true);
        } else {
          this.flatpickrInstance.clear();
        }

        const fpVal = this.flatpickrInstance.input?.value ?? '';
        this.value = fpVal || null;

        if (this._inputEl) {
          this._inputEl.value = fpVal;
        }
      } else {
        this.value = newValue;
      }

      if (this._inputEl) {
        if (!this.flatpickrInstance) {
          this._inputEl.value =
            typeof this.value === 'string' ? this.value : '';
        }
        this.updateFormValue();
      }
    } finally {
      this._isClearing = false;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-time-picker': TimePicker;
  }
}
