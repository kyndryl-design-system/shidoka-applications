import { LitElement, html, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { classMap } from 'lit/directives/class-map.js';

import DateRangePickerScss from './daterangepicker.scss';

/**
 * Date-Range picker
 * @fires on-input - Captures the input event and emits the selected values and original event details. (Only if startDate <= endDate)
 * @prop {string} minDate - Mimimum date in YYYY-MM-DD format. If the value isn't a possible date string in the format, then the element has no minimum date value.
 * @prop {string} maxDate - Maximum date in YYYY-MM-DD format. If the value isn't a possible date string in the format, then the element has no maximum date value.
 * @slot unnamed - Slot for label text.
 */
@customElement('kyn-date-range-picker')
export class DateRangePicker extends LitElement {
  static override styles = DateRangePickerScss;
  /**
   * Associate the component with forms.
   * @ignore
   */
  static formAssociated = true;

  /** Regex format for minDate / maxDate
   * @ignore
   */
  @state()
  regexDateFormat = /^\d{4}-\d{2}-\d{2}$/;

  /**
   * Attached internals for form association.
   * @ignore
   */
  @state()
  internals = this.attachInternals();

  /** Optional text beneath the input. */
  @property({ type: String })
  caption = '';

  /** Datepicker size. "sm", "md", or "lg". */
  @property({ type: String })
  size = 'md';

  /** Datepicker Start date in YYYY-MM-DD format. */
  @property({ type: String })
  startDate = '';

  /** Datepicker End date in YYYY-MM-DD format. */
  @property({ type: String })
  endDate = '';

  /** Datepicker name. Required prop. as there could many fields into single form*/
  @property({ type: String })
  name = '';

  /** Makes the date required. */
  @property({ type: Boolean })
  required = false;

  /** Date disabled state. */
  @property({ type: Boolean })
  disabled = false;

  /** Date invalid text. */
  @property({ type: String })
  invalidText = '';

  /** Date warning text */
  @property({ type: String })
  warnText = '';

  /** Maximum date in YYYY-MM-DD format.
   * If the value isn't a possible date string in the format, then the element has no maximum date value
   */
  @property({ type: String })
  maxDate = '';

  /** Minimum date in YYYY-MM-DD format,
   * If the value isn't a possible date string in the format, then the element has no minimum date value.
   */
  @property({ type: String })
  minDate = '';

  /** Specifies the granularity that the value must adhere to, or the special value any,
   * For date inputs, the value of step is given in days; and is treated as a number of milliseconds equal to 86,400,000 times the step value.
   * The default value of step is 1, indicating 1 day.*/
  @property({ type: String })
  step = '';

  override render() {
    return html`
      <label
        class="datepicker-label-text"
        for=${this.name}
        ?disabled=${this.disabled}
      >
        ${this.required ? html`<span class="required">*</span>` : null}
        <slot></slot>
      </label>

      <div class="input-wrapper">
        <input
          class="${classMap({
            'size--sm': this.size === 'sm',
            'size--lg': this.size === 'lg',
          })}"
          type="date"
          id="${this.name}-start"
          name="${this.name}-start"
          value=${this.startDate}
          ?required=${this.required}
          ?disabled=${this.disabled}
          ?invalid=${this.invalidText !== ''}
          min=${ifDefined(this.minDate)}
          max=${ifDefined(this.endDate ?? this.maxDate ?? '')}
          step=${ifDefined(this.step)}
          @input=${(e: any) => this.handleStartDate(e)}
        />
      </div>

      <span class="range-span">—</span>
      <div class="input-wrapper">
        <input
          class="${classMap({
            'size--sm': this.size === 'sm',
            'size--lg': this.size === 'lg',
          })}"
          type="date"
          id="${this.name}-end"
          name="${this.name}-end"
          value=${this.endDate}
          ?disabled=${this.disabled}
          ?invalid=${this.invalidText !== ''}
          min=${ifDefined(this.startDate ?? this.minDate ?? '')}
          max=${ifDefined(this.maxDate)}
          step=${ifDefined(this.step)}
          @input=${(e: any) => this.handleEndDate(e)}
        />
      </div>

      ${this.caption !== ''
        ? html` <div class="caption">${this.caption}</div> `
        : null}
      ${this.invalidText !== ''
        ? html` <div class="error">${this.invalidText}</div> `
        : null}
      ${this.warnText !== '' && this.invalidText === ''
        ? html`<div class="warn">${this.warnText}</div>`
        : null}
    `;
  }

  override updated(changedProps: PropertyValues) {
    if (changedProps.has('startDate')) {
      // set form data value
      this.internals.setFormValue(`${this.name}-start`, this.startDate);
      this.internals.setValidity({});
      this.invalidText = '';
      // set validity
      if (this.required && (!this.startDate || this.startDate === '')) {
        this.internals.setValidity(
          { valueMissing: true },
          'Both dates are required.'
        );
        this.invalidText = this.internals.validationMessage;
        return;
      }
      // validate min
      if (this.startDate !== '' && this.minDate !== '') {
        this.validateMinDate(this.startDate);
      }
      //validate max
      if (this.startDate !== '' && this.maxDate !== '') {
        this.validateMaxDate(this.startDate);
      }
      // validate start & end date
      if (this.startDate !== '' && this.endDate !== '') {
        this.validateStartEndDate();
      }
    }
    if (changedProps.has('endDate')) {
      this.internals.setFormValue(`${this.name}-end`, this.endDate);
      this.internals.setValidity({});
      this.invalidText = '';
      // set validity
      if (this.required && (!this.endDate || this.endDate === '')) {
        this.internals.setValidity(
          { valueMissing: true },
          'Both dates are required.'
        );
        this.invalidText = this.internals.validationMessage;
        return;
      }
      // validate min
      if (this.endDate !== '' && this.minDate !== '') {
        this.validateMinDate(this.endDate);
      }
      //validate max
      if (this.endDate !== '' && this.maxDate !== '') {
        this.validateMaxDate(this.endDate);
      }
      // validate start & end date
      if (this.startDate !== '' && this.endDate !== '') {
        this.validateStartEndDate();
      }
    }
  }
  // on-change start date
  private handleStartDate(e: any) {
    this.startDate = e.target.value;
    if (this.startDate !== '') {
      this.validateAndDispatchEvent();
    }
  }
  // on-change end date
  private handleEndDate(e: any) {
    this.endDate = e.target.value;
    if (this.endDate !== '') {
      this.validateAndDispatchEvent();
    }
  }
  // Note: dispatch (on-input) event only if both dates are valid (i.e. startDate <= endDate)
  private validateAndDispatchEvent() {
    if (this.startDate <= this.endDate) {
      // emit selected start & end date value
      const event = new CustomEvent('on-input', {
        detail: {
          startDate: this.startDate,
          endDate: this.endDate,
        },
      });
      this.dispatchEvent(event);
    }
  }
  // validate minDate with start & end date
  private validateMinDate(date: String): void {
    if (this.regexDateFormat.test(this.minDate)) {
      if (date < this.minDate) {
        this.internals.setValidity(
          { rangeUnderflow: true },
          'Please enter date as min date or later.'
        );
        this.invalidText = this.internals.validationMessage;
      }
    } else {
      this.internals.setValidity(
        { patternMismatch: true },
        'Please enter valid min date.'
      );
      this.invalidText = this.internals.validationMessage;
    }
  }
  // validate maxDate with start & end date
  private validateMaxDate(date: String): void {
    if (this.regexDateFormat.test(this.maxDate)) {
      if (date > this.maxDate) {
        this.internals.setValidity(
          { rangeOverflow: true },
          'Please enter date as max date or earlier.'
        );
        this.invalidText = this.internals.validationMessage;
      }
    } else {
      this.internals.setValidity(
        { patternMismatch: true },
        'Please enter valid max date.'
      );
      this.invalidText = this.internals.validationMessage;
    }
  }

  private validateStartEndDate(): void {
    if (this.startDate > this.endDate) {
      this.internals.setValidity(
        { patternMismatch: true },
        'State date must be before end date.'
      );
      this.invalidText = this.internals.validationMessage;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-date-range-picker': DateRangePicker;
  }
}
