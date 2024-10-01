import { html, LitElement, PropertyValues } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { FormMixin } from '../../../common/mixins/form-input';
import { deepmerge } from 'deepmerge-ts';

import flatpickr from 'flatpickr';
import { BaseOptions } from 'flatpickr/dist/types/options';
import type { Instance } from 'flatpickr/dist/types/instance';
import rangePlugin from 'flatpickr/dist/plugins/rangePlugin';
import { default as English } from 'flatpickr/dist/l10n/default.js';
import l10n from 'flatpickr/dist/l10n/index';
// * temporary: will remove to replace with 100% shidoka theme styles once available
import 'flatpickr/dist/themes/light.css';

import DateRangePickerStyles from './daterangepicker.scss';

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
 * Date Range Picker: uses flatpickr datetime picker library -- `https://flatpickr.js.org/examples/#range-calendar`
 * @fires on-change - Captures the input event and emits the selected value and original event details.
 * @slot start-label - Slot for start date label text.
 * @slot end-label - Slot for end date label text.
 */
@customElement('kyn-date-range-picker')
export class DateRangePicker extends FormMixin(LitElement) {
  static override styles = [DateRangePickerStyles];
  /** Sets date range picker attribute name (ex: `contact-form-date-range-picker`). */
  @property({ type: String })
  nameAttr = '';

  /** Sets flatpickr dateFormat attr (ex: `Y-m-d H:i`). */
  @property({ type: String })
  dateFormat:
    | ''
    | 'Y-m-d'
    | 'm-d-Y'
    | 'd-m-Y'
    | 'Y-m-d H:i'
    | 'Y-m-d H:i:s'
    | 'm-d-Y H:i:s'
    | 'd-m-Y H:i:s' = '';

  /** Sets date range picker container size. */
  @property({ type: String })
  size: 'sm' | 'md' | 'lg' = 'md';

  /** Sets pre-selected date/time value. */
  @property({ type: Array })
  override value: [number | null, number | null] = [null, null];

  /** Sets date warning text. */
  @property({ type: String })
  warnText = '';

  /** Sets validation messaging. */
  @property({ type: String })
  override invalidText = '';

  /** Sets flatpickr alternative formatting value (ex: `F j, Y`). */
  @property({ type: String })
  altFormat = '';

  /** Sets mode to range. */
  @property({ type: String })
  mode = 'range';

  /** Sets flatpcikr options setting to disable specific dates. */
  @property({ type: Array })
  disable: (string | number | Date)[] = [];

  /** Sets flatpcikr options setting to enable specific dates. */
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
  private flatpickrInstance?: Instance;

  /**
   * Queries the start date <input> DOM element.
   * @internal
   */
  @query('#date-range-picker-start')
  private startDateInputEl!: HTMLInputElement;

  /**
   * Queries the end date <input> DOM element.
   * @internal
   */
  @query('input.end-date')
  private endDateInputEl!: HTMLInputElement;

  /**
   * Sets delay to facilitate dle smooth date value changes.
   * @internal
   */
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

  override render() {
    const startInputId = 'date-range-picker-start';
    const endInputId = 'date-range-picker-end';
    const errorId = 'error-message';
    const warningId = 'warning-message';
    const descriptionId = 'date-range-picker-description';

    return html`
      <div class=${classMap(this.getDateRangePickerClasses())}>
        <div class="date-inputs">
          <!-- Changed from multiple .date-input to a container -->
          <div class="date-input">
            <label
              class="label-text"
              for=${startInputId}
              ?disabled=${this.dateRangePickerDisabled}
            >
              ${this.required
                ? html`<abbr
                    class="required"
                    title=${this._textStrings.requiredText}
                    aria-label=${this._textStrings.requiredText}
                    >*</abbr
                  >`
                : null}
              <slot name="start-label">Start Date Label</slot>
            </label>

            ${this.renderInput(startInputId, 'start-date', false)}
          </div>

          <div class="date-input">
            <label
              class="label-text"
              for=${endInputId}
              ?disabled=${this.dateRangePickerDisabled}
            >
              ${this.required
                ? html`<abbr
                    class="required"
                    title=${this._textStrings.requiredText}
                    aria-label=${this._textStrings.requiredText}
                    >*</abbr
                  >`
                : null}
              <slot name="end-label">End Date Label</slot>
            </label>

            ${this.renderInput(endInputId, 'end-date', true)}
          </div>
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

  private renderInput(id: string, className: string, isEndDate: boolean) {
    return html`
      <input
        type="text"
        id=${id}
        class=${className}
        placeholder=${this.dateFormat.includes('H:')
          ? `${isEndDate ? 'End' : 'Start'} date and time`
          : `${isEndDate ? 'End' : 'Start'} date`}
        ?disabled=${this.dateRangePickerDisabled || isEndDate}
        .value=${this.getInputValue(isEndDate ? 1 : 0)}
        aria-required=${this.required ? 'true' : 'false'}
        aria-invalid=${this._isInvalid ? 'true' : 'false'}
        aria-describedby=${this._isInvalid
          ? 'error-message'
          : this.warnText
          ? 'warning-message'
          : 'date-range-picker-description'}
        tabindex=${isEndDate ? '-1' : '0'}
      />
    `;
  }

  getDateRangePickerClasses() {
    return {
      'date-range-picker': true,
      [`date-range-picker__size--${this.size}`]: true,
      'date-range-picker__disabled': this.dateRangePickerDisabled,
    };
  }

  getInputValue(index: number): string {
    return Array.isArray(this.value) && this.value[index] != null
      ? new Date(this.value[index]!).toLocaleString()
      : '';
  }

  override firstUpdated(changedProperties: PropertyValues): void {
    super.firstUpdated(changedProperties);
    this.initializeFlatpickr();
  }

  override updated(changedProperties: PropertyValues): void {
    super.updated(changedProperties);
    if (
      changedProperties.has('dateFormat') ||
      changedProperties.has('minDate') ||
      changedProperties.has('maxDate')
    ) {
      this.updateFlatpickrOptions();
    }
  }

  getFlatpickrOptions(): Partial<BaseOptions> {
    const options: Partial<BaseOptions> = {
      dateFormat: this.dateFormat,
      mode: 'range',
      enableTime: this.dateFormat.includes('H:'),
      allowInput: false,
      clickOpens: true,
      time_24hr: this.twentyFourHourFormat,
      weekNumbers: false,
      wrap: false,
      locale: English,
      altFormat: this.altFormat,
      plugins: [rangePlugin({ input: this.endDateInputEl })],
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

  initializeFlatpickr(): void {
    if (!this.startDateInputEl) {
      console.error('Start date input not found.');
      return;
    }

    try {
      this.flatpickrInstance = flatpickr(
        this.startDateInputEl,
        this.getFlatpickrOptions()
      ) as Instance;

      if (this.flatpickrInstance) {
        this.setCalendarAttributes();
        this.setInitialDates();
      } else {
        console.error('Unable to create flatpickr instance.');
      }
    } catch (error) {
      console.error('Error initializing Flatpickr:', error);
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
        'calendar-container'
      );
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

  updateFlatpickrOptions(): void {
    if (!this.flatpickrInstance) return;

    const currentDates = this.flatpickrInstance.selectedDates;
    this.flatpickrInstance.destroy();
    this.flatpickrInstance = flatpickr(
      this.startDateInputEl,
      this.getFlatpickrOptions()
    ) as Instance;

    if (currentDates && currentDates.length === 2) {
      this.flatpickrInstance.setDate(currentDates, false);
    }

    this.setCalendarAttributes();
    this.requestUpdate();
  }

  handleDateChange(selectedDates: Date[], dateStr: string): void {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.value =
        selectedDates.length === 2
          ? [selectedDates[0].getTime(), selectedDates[1].getTime()]
          : [null, null];
      this.emitValue(selectedDates, dateStr);
      this.requestUpdate('value');
      this._validate();
    }, 100);
  }

  private emitValue(selectedDates: Date[], dateStr: string): void {
    this.dispatchEvent(
      new CustomEvent('on-change', {
        detail: { dates: selectedDates, dateString: dateStr },
        bubbles: true,
        composed: true,
      })
    );
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
    if (this.flatpickrInstance) this.flatpickrInstance.destroy();
  }

  override willUpdate(changedProps: PropertyValues) {
    if (changedProps.has('textStrings') && !this._textStrings) {
      this._textStrings = deepmerge(_defaultTextStrings, this.textStrings);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-date-range-picker': DateRangePicker;
  }
}
