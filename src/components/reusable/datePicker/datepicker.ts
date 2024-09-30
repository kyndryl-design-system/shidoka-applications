import { html, LitElement, PropertyValues } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { FormMixin } from '../../../common/mixins/form-input';
import { deepmerge } from 'deepmerge-ts';

import flatpickr from 'flatpickr';
import { BaseOptions } from 'flatpickr/dist/types/options';
import type { Instance } from 'flatpickr/dist/types/instance';
import { default as English } from 'flatpickr/dist/l10n/default.js';
import l10n from 'flatpickr/dist/l10n/index';

// temporary: will remove to replace with 100% shidoka theme styles once available
import 'flatpickr/dist/themes/light.css';
import DatePickerStyles from './datepicker.scss';

const _defaultTextStrings = {
  requiredText: 'Required',
};

// temporary: from carbon locale implementation
l10n.en.weekdays.shorthand.forEach((_day: string, index: number) => {
  const currentDay = l10n.en.weekdays.shorthand;
  if (currentDay[index] === 'Thu' || currentDay[index] === 'Th') {
    currentDay[index] = 'Th';
  } else {
    currentDay[index] = currentDay[index].charAt(0);
  }
});

/**
 * Datepicker -- uses flatpickr datetime picker library ()`https://flatpickr.js.org/`)
 * @slot unnamed - Slot for label text.
 */
@customElement('kyn-date-picker')
export class DatePicker extends FormMixin(LitElement) {
  static override styles = [DatePickerStyles];
  /** Sets datepicker attribute name. */
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

  /** Sets flatpickr datepicker options */
  @property({ type: String })
  datePickerType: 'default' | 'date-time' = 'default';

  /** Sets date warning text */
  @property({ type: String })
  warnText = '';

  /** Sets validation messaging. */
  @property({ type: String })
  override invalidText = '';

  /** Sets flatpickr alternative formatting value (ex: `F j, Y`). */
  @property({ type: String })
  altFormat = '';

  /** Sets flatpcikr options setting to disable specific dates */
  @property({ type: Array })
  disable: any[] = [];

  /** Sets flatpcikr options setting to enable specific dates */
  @property({ type: Array })
  enable: any[] = [];

  /** Sets flatpickr mode to select single(default), multiple dates. */
  @property({ type: String })
  mode: 'single' | 'multiple' | 'range' = 'single';

  /** Sets caption to be displayed under primary date picker elements. */
  @property({ type: String })
  caption = '';

  /** Sets datepicker form input value to required/required. */
  @property({ type: Boolean })
  required = false;

  /** Sets entire datepicker form element to enabled/disabled. */
  @property({ type: Boolean })
  datePickerDisabled = false;

  /** Sets lower boundary of datepicker date selection. */
  @property({ type: String })
  minDate = '';

  /** Sets upper boundary of datepicker date selection. */
  @property({ type: String })
  maxDate = '';

  /** Sets granular step incrementing value. */
  @property({ type: Number })
  step = 1;

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
  private flatpickrInstance?: flatpickr.Instance;

  /**
   * Queries the <input> DOM element.
   * @ignore
   */
  @query('input')
  private inputEl!: HTMLInputElement;

  override render() {
    return html`
      <div class=${classMap(this.getDatepickerClasses())}>
        <label
          class="label-text"
          for=${this.name}
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

        <input
          type="text"
          placeholder=${this.datePickerType === 'date-time'
            ? 'Select date and time'
            : 'Select date'}
          ?disabled=${this.datePickerDisabled}
          .value=${this.value ? new Date(this.value).toLocaleString() : ''}
          @change=${this.handleChange}
        />

        ${this.caption ? html`<div class="caption">${this.caption}</div>` : ''}
        ${this._isInvalid
          ? html`<div id="error" class="error">
              ${this.invalidText || this._internalValidationMsg}
            </div>`
          : this.warnText
          ? html`<div id="warning" class="warn">${this.warnText}</div>`
          : ''}
      </div>
    `;
  }

  getDatepickerClasses() {
    return {
      'date-picker': true,
      [`date-picker--${this.datePickerType}`]: true,
      [`date-picker--${this.size}`]: true,
      'date-picker--disabled': this.datePickerDisabled,
    };
  }

  override firstUpdated(changedProperties: PropertyValues): void {
    super.firstUpdated(changedProperties);
    if (this.inputEl) {
      this.initializeFlatpickr();
    } else {
      console.error('Input element not found for flatpickr initialization.');
    }
  }

  override updated(changedProperties: PropertyValues): void {
    super.updated(changedProperties);
    if (this.flatpickrInstance) {
      this.updateFlatpickrOptions();
    }
  }

  initializeFlatpickr(): void {
    if (!this.inputEl) {
      console.error('Input element not found for Flatpickr initialization.');
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
      console.error('Flatpickr instance was not created.');
    }
  }

  getFlatpickrOptions(): Partial<BaseOptions> {
    const options: Partial<BaseOptions> = {
      dateFormat: this.dateFormat,
      mode: this.mode,
      enableTime: this.datePickerType === 'date-time',
      onChange: this.handleFlatpickrChange.bind(this),
      allowInput: false,
      clickOpens: true,
      time_24hr: false,
      weekNumbers: false,
      wrap: false,
      locale: English,
    };

    if (this.altFormat) {
      options.altFormat = this.altFormat;
    }

    if (this.minDate) {
      options.minDate = this.minDate;
    }

    if (this.maxDate) {
      options.maxDate = this.maxDate;
    }

    return options;
  }

  updateFlatpickrOptions(): void {
    if (this.flatpickrInstance) {
      this.flatpickrInstance.set(this.getFlatpickrOptions());
    }
  }

  handleFlatpickrChange(selectedDates: Date[], dateStr: string): void {
    console.log('Flatpickr onChange triggered:', { selectedDates, dateStr });

    let selectedDate: number | null = null;

    if (this.datePickerType === 'date-time') {
      selectedDate = selectedDates[0] ? selectedDates[0].getTime() : null;
    } else if (this.datePickerType === 'default') {
      selectedDate = selectedDates[0]
        ? new Date(selectedDates[0].setHours(0, 0, 0, 0)).getTime()
        : null;
    }

    this.value = selectedDate;
    this.requestUpdate('value', '');
    this._validate();

    this.dispatchEvent(
      new CustomEvent('date-changed', {
        detail: { dates: selectedDates, dateString: dateStr },
        bubbles: true,
        composed: true,
      })
    );
  }

  handleChange(e: Event): void {
    const target = e.target as HTMLInputElement;
    console.log('Input change event triggered:', target.value);

    const parsedDate = Date.parse(target.value);
    if (!isNaN(parsedDate)) {
      this.value = parsedDate;
    } else {
      this.value = null;
    }

    this.requestUpdate('value', '');
    this._validate();
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
