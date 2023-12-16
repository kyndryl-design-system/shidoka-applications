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
  maxTime = '';

  /** Minimum time in hh:mm or hh:mm:ss format
   *  only & must always lesser than maxTime. */
  @property({ type: String })
  minTime = '';

  /** Specifies the granularity that the value must adhere to, or the special value any,
   * It takes value that equates to the number of seconds you want to increment by;
   * the default (60 sec.). If you specify a value of less than 60 sec., the time input will show a seconds input area alongside the hours and minutes */
  @property({ type: String })
  step = '';

  /**
   * Queries the <input> DOM element.
   * @ignore
   */
  @query('input')
  inputEl!: HTMLInputElement;

  /**
   * Queries the <input> DOM element.
   * @ignore
   */
  regexPatternWithSec = /^\d{2}:\d{2}:\d{2}$/; // hh:mm:ss
  /**
   * Queries the <input> DOM element.
   * @ignore
   */
  regexPatternWithoutSec = /^\d{2}:\d{2}$/; // hh:mm

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

    if (changedProps.get('value') !== undefined && changedProps.has('value')) {
      this.inputEl.value = this.value;
      //set form data value
      // this.internals.setFormValue(this.value);
      this.internals.setValidity({});
      this.internalValidationMsg = '';

      // set validity
      if (this.required && (!this.value || this.value === '')) {
        // validate required
        this.internals.setValidity(
          { valueMissing: true },
          'This field is required.'
        );
        this.internalValidationMsg = this.internals.validationMessage;
        return;
      }
      // validate min
      if (this.value !== '' && this.minTime !== '') {
        this.validateMinTime();
      }
      // validate max
      if (this.value !== '' && this.maxTime !== '') {
        this.validateMaxTime();
      }
    }
  }

  private validateMinTime() {
    if (
      this.regexPatternWithoutSec.test(this.minTime) ||
      this.regexPatternWithSec.test(this.minTime)
    ) {
      const enteredTimeInSeconds = this.timeToSeconds(this.value);
      const minTimeinSeconds = this.timeToSeconds(this.minTime);
      if (enteredTimeInSeconds < minTimeinSeconds) {
        this.internals.setValidity(
          { rangeUnderflow: true },
          'Please enter valid time within the min range.'
        );
        this.internalValidationMsg = this.internals.validationMessage;
      }
    } else {
      this.internals.setValidity(
        { patternMismatch: true },
        'Please enter valid min time.'
      );
      this.internalValidationMsg = this.internals.validationMessage;
    }
  }

  private validateMaxTime() {
    if (
      this.regexPatternWithoutSec.test(this.maxTime) ||
      this.regexPatternWithSec.test(this.maxTime)
    ) {
      const enteredTimeInSeconds = this.timeToSeconds(this.value);
      const maxTimeinSeconds = this.timeToSeconds(this.maxTime);
      if (enteredTimeInSeconds > maxTimeinSeconds) {
        this.internals.setValidity(
          { rangeOverflow: true },
          'Please enter valid time within the max range.'
        );
        this.internalValidationMsg = this.internals.validationMessage;
      }
    } else {
      this.internals.setValidity(
        { patternMismatch: true },
        'Please enter valid max time.'
      );
      this.internalValidationMsg = this.internals.validationMessage;
    }
  }

  private timeToSeconds(timeString: String) {
    const [hours, minutes, seconds] = timeString.split(':');
    const setSeconds = seconds ? parseInt(seconds, 10) : 0;
    const totalTime =
      parseInt(hours, 10) * 3600 + parseInt(minutes, 10) * 60 + setSeconds;
    return totalTime;
  }

  private _handleFormdata(e: any) {
    e.formData.append(this.name, this.value);
  }

  override connectedCallback(): void {
    super.connectedCallback();

    if (this.internals.form) {
      this.internals.form.addEventListener('formdata', (e) =>
        this._handleFormdata(e)
      );
    }
  }

  override disconnectedCallback(): void {
    if (this.internals.form) {
      this.internals.form.removeEventListener('formdata', (e) =>
        this._handleFormdata(e)
      );
    }

    super.disconnectedCallback();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-time-picker': TimePicker;
  }
}
