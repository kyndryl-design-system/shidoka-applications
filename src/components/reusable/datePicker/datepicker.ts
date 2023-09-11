import { LitElement, html, PropertyValues } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { classMap } from 'lit/directives/class-map.js';
import {
  DATE_PICKER_TYPES,
  regexDateFormat,
  regexDateTimeFormat,
  regexDateTimeFormatSec,
} from './defs';
import DatePickerScss from './datepicker.scss';

/**
 * Datepicker.
 * @fires on-input - Captures the input event and emits the selected value and original event details.
 * @prop {string} minDate - Mimimum date in YYYY-MM-DD or YYYY-MM-DDThh:mm format. If the value isn't a possible date string in the format, then the element has no minimum date value.
 * @prop {string} maxDate - Maximum date in YYYY-MM-DD or YYYY-MM-DDThh:mm format. If the value isn't a possible date string in the format, then the element has no maximum date value
 * @slot unnamed - Slot for label text.
 */

@customElement('kyn-date-picker')
export class DatePicker extends LitElement {
  static override styles = DatePickerScss;

  /**
   * Associate the component with forms.
   * @ignore
   */
  static formAssociated = true;

  /**
   * Attached internals for form association.
   * @ignore
   */
  @state()
  internals = this.attachInternals();

  /** Datepicker size. "sm", "md", or "lg". */
  @property({ type: String })
  size = 'md';

  /** Optional text beneath the input. */
  @property({ type: String })
  caption = '';

  /** Datepicker value in YYYY-MM-DD or YYYY-MM-DDThh:mm format. */
  @property({ type: String })
  value = '';

  /** Datepicker name. */
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

  /** Maximum date in YYYY-MM-DD or YYYY-MM-DDThh:mm format.
   * If the value isn't a possible date string in the format, then the element has no maximum date value
  */
  @property({ type: String })
  maxDate = '';

  /** Minimum date in YYYY-MM-DD or YYYY-MM-DDThh:mm format,
   * If the value isn't a possible date string in the format, then the element has no minimum date value.
   */
  @property({ type: String })
  minDate = '';

  /** Specifies the granularity that the value must adhere to, or the special value any,
   * For date inputs, the value of step is given in days; and is treated as a number of milliseconds equal to 86,400,000 times the step value.
   * The default value of step is 1, indicating 1 day.*/
  @property({ type: String })
  step = '';

  /** Date picker types. Default 'single' */
  @property({ type: String })
  datePickerType: DATE_PICKER_TYPES = DATE_PICKER_TYPES.SINGLE;

  /**
   * Queries the <input> DOM element.
   * @ignore
   */
  @query('input')
  inputEl!: HTMLInputElement;

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

      <div
        class="${classMap({
          'input-wrapper': true,
        })}"
      >
        <input
          class="${classMap({
            'size--sm': this.size === 'sm',
            'size--lg': this.size === 'lg',
          })}"
          datePickerType=${this.datePickerType}
          type=${this.datePickerType === DATE_PICKER_TYPES.WITHITIME
            ? 'datetime-local'
            : 'date'}
          id=${this.name ? this.name : 'datepicker-1'}
          name=${this.name}
          value=${this.value}
          ?required=${this.required}
          ?disabled=${this.disabled}
          ?invalid=${this.invalidText !== ''}
          min=${ifDefined(this.minDate)}
          max=${ifDefined(this.maxDate)}
          step=${ifDefined(this.step)}
          @input=${(e: any) => this.handleInput(e)}
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

  // calls when start date or value change
  private handleInput(e: any) {
    this.value = e.target.value;
    // emit selected value
    const event = new CustomEvent('on-input', {
      detail: {
        value: e.target.value,
        origEvent: e,
      },
    });
    this.dispatchEvent(event);
  }

  override updated(changedProps: PropertyValues) {
    if (changedProps.has('value')) {
      this.inputEl.value = this.value;
      // set form data value
      this.internals.setFormValue(this.value);
      this.internals.setValidity({});
      this.invalidText = '';

      // set validity
      if (this.required && (!this.value || this.value === '')) {
        this.internals.setValidity(
          { valueMissing: true },
          'This field is required.'
        );
        this.invalidText = this.internals.validationMessage;
        return;
      }
      // validate min
      if (this.value !== '' && this.minDate !== '') {
        this.validateMinDate();
      }
      // validate max
      if (this.value !== '' && this.maxDate !== '') {
        this.validateMaxDate();
      }
    }
  }

  private validateMinDate(): void {
    if (
      regexDateFormat.test(this.minDate) ||
      regexDateTimeFormat.test(this.minDate) ||
      regexDateTimeFormatSec.test(this.minDate)
    ) {
      if (this.value < this.minDate) {
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

  private validateMaxDate(): void {
    if (
      regexDateFormat.test(this.maxDate) ||
      regexDateTimeFormat.test(this.maxDate) ||
      regexDateTimeFormatSec.test(this.maxDate)
    ) {
      if (this.value > this.maxDate) {
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
}
declare global {
  interface HTMLElementTagNameMap {
    'kyn-date-picker': DatePicker;
  }
}
