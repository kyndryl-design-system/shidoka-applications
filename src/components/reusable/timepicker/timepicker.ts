import { LitElement, html } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { classMap } from 'lit/directives/class-map.js';

import '@kyndryl-design-system/shidoka-foundation/components/icon';

import TimePickerScss from './timepicker.scss';

/**
 * Time picker.
 * @fires on-input - Captures the input event and emits the selected value and original event details.
 * @prop {string} minTime - Minimum Time in hh:mm format.
 * @prop {string} maxTime - Maximum Time hh:mm format.
 * @slot unnamed - Slot for label text.
 */

@customElement('kyn-time-picker')
export class TimePicker extends LitElement {
  static override styles = [TimePickerScss];

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

  /** Input size. "sm", "md", or "lg". */
  @property({ type: String })
  size = 'md';

  /** Optional text beneath the input. */
  @property({ type: String })
  caption = '';

  /** The value of the time input is always in 24-hour format that includes leading zeros: hh:mm,
   *  regardless of the input format, which is likely to be selected based on the user's locale (or by the user agent).
   *  If the time includes seconds (by step attribute), the format is always hh:mm:ss */
  @property({ type: String })
  value = '';

  /** Time input name. */
  @property({ type: String })
  name = '';

  /** Makes the input required. */
  @property({ type: Boolean })
  required = false;

  /** Input disabled state. */
  @property({ type: Boolean })
  disabled = false;

  /** Time input invalid text. */
  @property({ type: String })
  invalidText = '';

  /** Time input warn text. */
  @property({ type: String })
  warnText = '';

  /** Maximum time in hh:mm or hh:mm:ss format
   * only must always greater than minTime. */
  @property({ type: String })
  maxTime!: string;

  /** Minimum time in hh:mm or hh:mm:ss format
   *  only & must always lesser than maxTime. */
  @property({ type: String })
  minTime!: string;

  /** Specifies the granularity that the value must adhere to, or the special value any,
   * It takes value that equates to the number of seconds you want to increment by;
   * the default (60 sec.). If you specify a value of less than 60 sec., the time input will show a seconds input area alongside the hours and minutes */
  @property({ type: String })
  step!: string;

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
      <div class="time-picker" ?disabled=${this.disabled}>
        <label class="label-text" for=${this.name}>
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
            type="time"
            id=${this.name}
            name=${this.name}
            value=${this.value}
            step=${ifDefined(this.step)}
            ?required=${this.required}
            ?disabled=${this.disabled}
            ?invalid=${this.isInvalid}
            min=${ifDefined(this.minTime)}
            max=${ifDefined(this.maxTime)}
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
      </div>
    `;
  }

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

  override updated(changedProps: any) {
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
      //set form data value
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
    'kyn-time-picker': TimePicker;
  }
}
