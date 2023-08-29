import { LitElement, html } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { classMap } from 'lit/directives/class-map.js';

import '@kyndryl-design-system/foundation/components/icon';
import clearIcon from '@carbon/icons/es/close/24';

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

  /** Maximum time in hh:mm format. */
  @property({ type: String })
  maxTime = '';

  /** Minimum time. in hh:mm format */
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
            ?invalid=${this.invalidText !== ''}
            min=${ifDefined(this.minTime)}
            max=${ifDefined(this.maxTime)}
            @input=${(e: any) => this.handleInput(e)}
          />

          ${this.value !== ''
            ? html`
                <button class="clear" @click=${() => this.handleClear()}>
                  <kd-icon .icon=${clearIcon}></kd-icon>
                </button>
              `
            : null}
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

  private handleClear() {
    this.value = '';
    this.inputEl.value = '';
  }

  override updated(changedProps: any) {
    if (changedProps.has('value')) {
      this.inputEl.value = this.value;
      //set form data value
      this.internals.setFormValue(this.value);
      this.invalidText = '';

      // set validity
      if (this.required) {
        if (!this.value || this.value === '') {
          this.internals.setValidity(
            { valueMissing: true },
            'This field is required.'
          );
          this.invalidText = this.internals.validationMessage;
        } else {
          this.internals.setValidity({});
          this.invalidText = '';
        }
      }
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-time-picker': TimePicker;
  }
}
