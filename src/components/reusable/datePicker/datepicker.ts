import { LitElement, html, PropertyValues } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { classMap } from 'lit/directives/class-map.js';
import { DATE_PICKER_TYPES } from './defs';
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

  static override shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

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

  /**
   * Queries the <input> DOM element.
   * @ignore
   */
  @query('input')
  inputEl!: HTMLInputElement;

  /**
   * Internal validation message.
   * @ignore
   */
  @state()
  internalValidationMsg = '';

  /**
   * isInvalid when internalValidationMsg or invalidText is non-empty.
   * @ignore
   */
  @state()
  isInvalid = false;

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
          ?invalid=${this.isInvalid}
          min=${ifDefined(this.minDate)}
          max=${ifDefined(this.maxDate)}
          step=${ifDefined(this.step)}
          @input=${(e: any) => this.handleInput(e)}
        />
      </div>
      ${this.caption !== ''
        ? html` <div class="caption">${this.caption}</div> `
        : null}
      ${this.isInvalid
        ? html`
            <div class="error">
              ${this.invalidText || this.internalValidationMsg}
            </div>
          `
        : null}
      ${this.warnText !== '' && !this.isInvalid
        ? html`<div class="warn">${this.warnText}</div>`
        : null}
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
    if (
      changedProps.has('invalidText') ||
      changedProps.has('internalValidationMsg')
    ) {
      //check if any (internal / external )error msg. present then isInvalid is true
      this.isInvalid =
        this.invalidText !== '' || this.internalValidationMsg !== ''
          ? true
          : false;
    }

    if (
      changedProps.has('invalidText') &&
      changedProps.get('invalidText') !== undefined
    ) {
      this._validate(false, true);
    }

    if (changedProps.has('value')) {
      // this.inputEl.value = this.value;
      // set form data value
      // this.internals.setFormValue(this.value);

      this._validate(false, false);
    }
  }

  private _validate(interacted: Boolean, report: Boolean) {
    // get validity state from inputEl, combine customError flag if invalidText is provided
    const Validity =
      this.invalidText !== ''
        ? { ...this.inputEl.validity, customError: true }
        : this.inputEl.validity;
    // set validationMessage to invalidText if present, otherwise use inputEl validationMessage
    const ValidationMessage =
      this.invalidText !== ''
        ? this.invalidText
        : this.inputEl.validationMessage;

    // set validity on custom element, anchor to inputEl
    this.internals.setValidity(Validity, ValidationMessage, this.inputEl);

    // set internal validation message if value was changed by user input
    if (interacted) {
      this.internalValidationMsg = this.internals.validationMessage;
    }

    // focus the form field to show validity
    if (report) {
      this.internals.reportValidity();
    }
  }

  private _handleFormdata(e: any) {
    e.formData.append(this.name, this.value);
  }

  private _handleInvalid() {
    this.internalValidationMsg = this.internals.validationMessage;
  }

  override connectedCallback(): void {
    super.connectedCallback();

    if (this.internals.form) {
      this.internals.form.addEventListener('formdata', (e) =>
        this._handleFormdata(e)
      );

      this.addEventListener('invalid', () => {
        this._handleInvalid();
      });
    }
  }

  override disconnectedCallback(): void {
    if (this.internals.form) {
      this.internals.form.removeEventListener('formdata', (e) =>
        this._handleFormdata(e)
      );

      this.removeEventListener('invalid', () => {
        this._handleInvalid();
      });
    }

    super.disconnectedCallback();
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'kyn-date-picker': DatePicker;
  }
}
