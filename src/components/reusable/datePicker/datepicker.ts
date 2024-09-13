import { LitElement, html, PropertyValues } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { classMap } from 'lit/directives/class-map.js';
import { DATE_PICKER_TYPES } from './defs';
import { FormMixin } from '../../../common/mixins/form-input';
import DatePickerScss from './datepicker.scss';
import { deepmerge } from 'deepmerge-ts';

const _defaultTextStrings = {
  requiredText: 'Required',
};

/**
 * Datepicker.
 * @fires on-input - Captures the input event and emits the selected value and original event details.
 * @prop {string} minDate - Mimimum date in YYYY-MM-DD or YYYY-MM-DDThh:mm format. If the value isn't a possible date string in the format, then the element has no minimum date value.
 * @prop {string} maxDate - Maximum date in YYYY-MM-DD or YYYY-MM-DDThh:mm format. If the value isn't a possible date string in the format, then the element has no maximum date value
 * @slot unnamed - Slot for label text.
 */

@customElement('kyn-date-picker')
export class DatePicker extends FormMixin(LitElement) {
  static override styles = DatePickerScss;

  /** Datepicker size. "sm", "md", or "lg". */
  @property({ type: String })
  size = 'md';

  /** Optional text beneath the input. */
  @property({ type: String })
  caption = '';

  /** Datepicker value in YYYY-MM-DD or YYYY-MM-DDThh:mm format. */
  @property({ type: String })
  override value = '';

  /** Makes the date required. */
  @property({ type: Boolean })
  required = false;

  /** Date disabled state. */
  @property({ type: Boolean })
  disabled = false;

  /** Date warning text */
  @property({ type: String })
  warnText = '';

  /** Maximum date in YYYY-MM-DD or YYYY-MM-DDThh:mm format.
   * If the value isn't a possible date string in the format, then the element has no maximum date value
   */
  @property({ type: String })
  maxDate!: string;

  /** Minimum date in YYYY-MM-DD or YYYY-MM-DDThh:mm format,
   * If the value isn't a possible date string in the format, then the element has no minimum date value.
   */
  @property({ type: String })
  minDate!: string;

  /** Specifies the granularity that the value must adhere to, or the special value any,
   * For date inputs, the value of step is given in days; and is treated as a number of milliseconds equal to 86,400,000 times the step value.
   * The default value of step is 1, indicating 1 day.*/
  @property({ type: String })
  step!: string;

  /** Date picker types. Default 'single' */
  @property({ type: String })
  datePickerType: DATE_PICKER_TYPES = DATE_PICKER_TYPES.SINGLE;

  /** Customizable text strings. */
  @property({ type: Object })
  textStrings = _defaultTextStrings;

  /** Internal text strings.
   * @internal
   */
  @state()
  _textStrings = _defaultTextStrings;

  /**
   * Queries the <input> DOM element.
   * @ignore
   */
  @query('input')
  _inputEl!: HTMLInputElement;

  override render() {
    return html`
      <div class="date-picker" ?disabled=${this.disabled}>
        <label class="label-text" for=${this.name} ?disabled=${this.disabled}>
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
            ?invalid=${this._isInvalid}
            aria-invalid=${this._isInvalid}
            aria-describedby=${this._isInvalid
              ? 'error'
              : this.warnText !== '' && !this._isInvalid
              ? 'warning'
              : ''}
            min=${ifDefined(this.minDate)}
            max=${ifDefined(this.maxDate)}
            step=${ifDefined(this.step)}
            @input=${(e: any) => this.handleInput(e)}
          />
        </div>
        ${this.caption !== ''
          ? html` <div class="caption">${this.caption}</div> `
          : null}
        ${this._isInvalid
          ? html`
              <div id="error" class="error">
                ${this.invalidText || this._internalValidationMsg}
              </div>
            `
          : null}
        ${this.warnText !== '' && !this._isInvalid
          ? html`<div id="warning" class="warn">${this.warnText}</div>`
          : null}
      </div>
    `;
  }

  // calls when start date or value change
  private handleInput(e: any) {
    this.value = e.target.value;

    this._validate(true, false);

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
    // preserve FormMixin updated function
    this._onUpdated(changedProps);

    if (changedProps.has('value')) {
      // set value on input element
      this._inputEl.value = this.value;
    }
  }

  private _validate(interacted: Boolean, report: Boolean) {
    // get validity state from inputEl, combine customError flag if invalidText is provided
    const Validity =
      this.invalidText !== ''
        ? { ...this._inputEl.validity, customError: true }
        : this._inputEl.validity;
    // set validationMessage to invalidText if present, otherwise use inputEl validationMessage
    const ValidationMessage =
      this.invalidText !== ''
        ? this.invalidText
        : this._inputEl.validationMessage;

    // set validity on custom element, anchor to inputEl
    this._internals.setValidity(Validity, ValidationMessage, this._inputEl);

    // set internal validation message if value was changed by user input
    if (interacted) {
      this._internalValidationMsg = this._inputEl.validationMessage;
    }

    // focus the form field to show validity
    if (report) {
      this._internals.reportValidity();
    }
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
