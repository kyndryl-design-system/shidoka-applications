import { html, LitElement, PropertyValues } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { FormMixin } from '../../../common/mixins/form-input';
import { deepmerge } from 'deepmerge-ts';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';

import flatpickr from 'flatpickr';
import { BaseOptions } from 'flatpickr/dist/types/options';
import type { Instance } from 'flatpickr/dist/types/instance';
import { default as English } from 'flatpickr/dist/l10n/default.js';
import l10n from 'flatpickr/dist/l10n/index';
// * temporary: will remove to replace with 100% shidoka theme styles once available
import 'flatpickr/dist/themes/light.css';

import DatePickerStyles from './datepicker.scss';

import '@kyndryl-design-system/shidoka-foundation/components/icon';
import calendarIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/calendar.svg';

const _defaultTextStrings = {
  requiredText: 'Required',
};

// * temporary: from carbon locale implementation
l10n.en.weekdays.shorthand.forEach((_day: string, index: number) => {
  const currentDay = l10n.en.weekdays.shorthand;
  if (currentDay[index] === 'Thu' || currentDay[index] === 'Th') {
    currentDay[index] = 'Th';
  } else {
    currentDay[index] = currentDay[index].charAt(0);
  }
});

/**
 * Datepicker: uses flatpickr datetime picker library -- `https://flatpickr.js.org`
 * @fires on-change - Captures the input event and emits the selected value and original event details.
 * @slot unnamed - Slot for label text.
 */
@customElement('kyn-date-picker')
export class DatePicker extends FormMixin(LitElement) {
  static override styles = [DatePickerStyles];
  /** Sets datepicker attribute name (ex: `contact-form-date-picker`). */
  @property({ type: String })
  nameAttr = '';

  /** Sets flatpickr dateFormat attr (ex: `Y-m-d H:i`). */
  @property({ type: String })
  dateFormat = '';

  /** Sets datepicker container size. */
  @property({ type: String })
  size: 'sm' | 'md' | 'lg' = 'md';

  /** Sets pre-selected date/time value. */
  @property({ type: Number })
  override value: number | null = null;

  /** Sets date warning text. */
  @property({ type: String })
  warnText = '';

  /** Sets validation messaging. */
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
   * Queries the <input> DOM element.
   * @ignore
   */
  @query('input')
  private inputEl!: HTMLInputElement;

  override render() {
    const inputId = this.nameAttr || 'date-picker-input';
    const errorId = 'error-message';
    const warningId = 'warning-message';
    const descriptionId = 'date-picker-description';

    return html`
      <div class=${classMap(this.getDatepickerClasses())}>
        <label
          class="label-text"
          for=${inputId}
          ?disabled=${this.datePickerDisabled}
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
            placeholder=${this._enableTime
              ? 'Select date and time'
              : 'Select date'}
            ?disabled=${this.datePickerDisabled}
            .value=${this.value ? new Date(this.value).toLocaleString() : ''}
            aria-required=${this.required ? 'true' : 'false'}
            aria-invalid=${this._isInvalid ? 'true' : 'false'}
            aria-describedby=${this._isInvalid
              ? errorId
              : this.warnText
              ? warningId
              : descriptionId}
            @change=${this.handleDateChange}
          />
          <span class="icon">${unsafeSVG(calendarIcon)}</span>
        </div>

        ${this.caption
          ? html`<div id=${descriptionId} class="caption">${this.caption}</div>`
          : ''}
        ${this._isInvalid
          ? html`<div id=${errorId} class="error" role="alert">
              ${this.invalidText || this._internalValidationMsg}
            </div>`
          : this.warnText
          ? html`<div id=${warningId} class="warn" role="alert">
              ${this.warnText}
            </div>`
          : ''}
      </div>
    `;
  }

  getDatepickerClasses() {
    return {
      'date-picker': true,
      'date-time-picker': this.dateFormat.includes('H:'),
      [`date-picker__size--${this.size}`]: true,
      'date-picker__disabled': this.datePickerDisabled,
    };
  }

  override firstUpdated(changedProperties: PropertyValues): void {
    super.firstUpdated(changedProperties);
    if (this.inputEl) {
      this.initializeFlatpickr();
    } else {
      console.error('Input element not found.');
    }
  }

  override updated(changedProperties: PropertyValues): void {
    super.updated(changedProperties);
    if (changedProperties.has('dateFormat')) {
      if (this.flatpickrInstance) {
        this.updateFlatpickrOptions();
      } else {
        this.initializeFlatpickr();
      }
    }
  }

  initializeFlatpickr(): void {
    if (!this.inputEl) {
      console.error('Input element not found.');
      return;
    }

    const options = this.getFlatpickrOptions();
    this.flatpickrInstance = flatpickr(this.inputEl, options) as Instance;

    if (this.flatpickrInstance) {
      if (this.flatpickrInstance.calendarContainer) {
        this.flatpickrInstance.calendarContainer.setAttribute(
          'role',
          'application'
        );
        this.flatpickrInstance.calendarContainer.setAttribute(
          'aria-label',
          'calendar-container'
        );
      }
    } else {
      console.error('Unable to create flatpickr instance');
    }
  }

  getFlatpickrOptions(): Partial<BaseOptions> {
    this._enableTime = this.dateFormat.includes('H:');

    const options: Partial<BaseOptions> = {
      dateFormat: this.dateFormat,
      mode: this.mode,
      enableTime: this._enableTime,
      allowInput: false,
      clickOpens: true,
      time_24hr: this.twentyFourHourFormat,
      weekNumbers: false,
      wrap: false,
      locale: English,
      altFormat: this.altFormat,
    };

    if (this.minDate) {
      options.minDate = this.minDate;
    }

    if (this.maxDate) {
      options.maxDate = this.maxDate;
    }

    if (this.enable.length > 0) {
      options.enable = this.enable;
    }

    if (this.disable.length > 0) {
      options.disable = this.disable;
    }

    return options;
  }

  updateFlatpickrOptions(): void {
    if (this.flatpickrInstance) {
      const currentDate = this.flatpickrInstance.selectedDates[0];

      this.flatpickrInstance.destroy();

      const newOptions = this.getFlatpickrOptions();
      this.flatpickrInstance = flatpickr(this.inputEl, newOptions) as Instance;

      if (currentDate) {
        this.flatpickrInstance.setDate(currentDate);
      }

      if (this.flatpickrInstance.calendarContainer) {
        this.flatpickrInstance.calendarContainer.setAttribute(
          'role',
          'application'
        );
        this.flatpickrInstance.calendarContainer.setAttribute(
          'aria-label',
          'calendar-container'
        );
      }

      this.requestUpdate();
    }
  }

  handleDateChange(selectedDates: Date[] | Event, dateStr?: string): void {
    let selectedDate: number | null = null;

    if (Array.isArray(selectedDates)) {
      if (selectedDates[0]) {
        if (this._enableTime) {
          selectedDate = selectedDates[0].getTime();
        } else {
          selectedDate = new Date(
            selectedDates[0].setHours(0, 0, 0, 0)
          ).getTime();
        }
      }
      this.emitValue(selectedDates, dateStr || '');
    } else {
      const target = selectedDates.target as HTMLInputElement;
      const parsedDate = Date.parse(target.value);
      if (!isNaN(parsedDate)) {
        selectedDate = parsedDate;
      }
      this.emitValue([new Date(selectedDate || 0)], target.value);
    }

    this.value = selectedDate;
    this.requestUpdate('value', '');
    this._validate();
  }

  private emitValue(selectedDates: Date[], dateStr: string): void {
    const event = new CustomEvent('on-change', {
      detail: { dates: selectedDates, dateString: dateStr },
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

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.flatpickrInstance?.destroy();
  }

  override willUpdate(changedProps: any) {
    if (changedProps.has('textStrings')) {
      this._textStrings = deepmerge(_defaultTextStrings, this.textStrings);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-date-picker': DatePicker;
  }
}
