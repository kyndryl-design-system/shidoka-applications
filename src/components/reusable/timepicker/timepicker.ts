import { LitElement, html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { classMap } from 'lit/directives/class-map.js';
import { FormMixin } from '../../../common/mixins/form-input';
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
export class TimePicker extends FormMixin(LitElement) {
  static override styles = [TimePickerScss];

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
  override value = '';

  /** Makes the input required. */
  @property({ type: Boolean })
  required = false;

  /** Input disabled state. */
  @property({ type: Boolean })
  disabled = false;

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

  /** Customizable text strings. */
  @property({ type: Object })
  textStrings = {
    requiredText: 'Required',
  };

  /**
   * Queries the <input> DOM element.
   * @ignore
   */
  @query('input')
  _inputEl!: HTMLInputElement;

  override render() {
    return html`
      <div class="time-picker" ?disabled=${this.disabled}>
        <label class="label-text" for=${this.name}>
          ${this.required
            ? html`<abbr
                class="required"
                title=${this.textStrings.requiredText}
                aria-label=${this.textStrings.requiredText}
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
            type="time"
            id=${this.name}
            name=${this.name}
            value=${this.value}
            step=${ifDefined(this.step)}
            ?required=${this.required}
            ?disabled=${this.disabled}
            ?invalid=${this._isInvalid}
            aria-invalid=${this._isInvalid}
            aria-describedby=${this._isInvalid
              ? 'error'
              : this.warnText !== '' && !this._isInvalid
              ? 'warning'
              : ''}
            min=${ifDefined(this.minTime)}
            max=${ifDefined(this.maxTime)}
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
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-time-picker': TimePicker;
  }
}
