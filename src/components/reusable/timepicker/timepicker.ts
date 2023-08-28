import { LitElement, html } from 'lit';
import {
  customElement,
  property,
  state,
  query,
} from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { classMap } from 'lit/directives/class-map.js';

import '@kyndryl-design-system/foundation/components/icon';
import errorIcon from '@carbon/icons/es/warning--filled/24';
import clearIcon from '@carbon/icons/es/close/24';

import TimePickerScss from './timepicker.scss';

/**
 * Time picker.
 * @fires on-input - Captures the input event and emits the selected value and original event details.
 * @prop {string} pattern - RegEx pattern to validate.
 * @prop {number} minTime - Minimum Time.
 * @prop {number} maxTime - Maximum Time.
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

  /** Input type, limited to "time". */
  @property({ type: String })
  type = 'time';

  /** Input size. "sm", "md", or "lg". */
  @property({ type: String })
  size = 'md';

  /** Optional text beneath the input. */
  @property({ type: String })
  caption = '';

  /** Time input value. */
  @property({ type: String })
  value = '';

  /** Time input placeholder. */
  @property({ type: String })
  placeholder = '-- :-- --';

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

  /** Maximum time. */
  @property({ type: String })
  maxTime = '';

  /** Minimum time. */
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
      <div class="text-input" ?disabled=${this.disabled}>
        <label class="label-text" for=${this.name}>
          ${this.required ? html`<span class="required">*</span>` : null}
          <slot></slot>
        </label>

        <div
          class="${classMap({
            'input-wrapper': true,
          })}"
        >
          <span class="context-icon">
            <slot name="icon"></slot>
          </span>

          <input
            class="${classMap({
              'size--sm': this.size === 'sm',
              'size--lg': this.size === 'lg',
            })}"
            type=${this.type}
            id=${this.name}
            name=${this.name}
            value=${this.value}
            step=${ifDefined(this.step)}
            placeholder=${this.placeholder}
            ?required=${this.required}
            ?disabled=${this.disabled}
            ?invalid=${this.invalidText !== ''}
            min=${ifDefined(this.minTime)}
            max=${ifDefined(this.maxTime)}
            @input=${(e: any) => this.handleInput(e)}
          />

          ${this.invalidText !== ''
            ? html` <kd-icon class="error-icon" .icon=${errorIcon}></kd-icon> `
            : null}
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
      </div>
    `;
  }

  private handleInput(e: any) {
    this.value = e.target.value;
    console.log(`I m called first: ${this.value}`);
    
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
    //super.update(changedProps);
    console.log("i m called update");
    
    console.log(changedProps);

    // if (changedProps.has('value')) {
    //   this.inputEl.value = this.value;
    //   // set form data value
    //   this.internals.setFormValue(this.value);
    //   this.internals.setValidity({});
    //   this.invalidText = '';
    //   // set validity
    //   if (this.required) {
    //     if (!this.value || this.value === '') {
    //       this.internals.setValidity(
    //         { valueMissing: true },
    //         'This field is required.'
    //       );
    //       this.invalidText = this.internals.validationMessage;
    //     } else if (this.minTime !== '' && (this.minTime !== this.value)) {
    //       this.internals.setValidity(
    //         { tooShort: true },
    //         `Minimum time must be ${this.minTime} or later.`
    //       );
    //       this.invalidText = this.internals.validationMessage;
    //     } else if (this.maxTime !== '' && (this.maxTime !== this.value)) {
    //       this.internals.setValidity(
    //         { tooLong: true },
    //         'Entered time is not maximum.'
    //       );
    //       this.invalidText = this.internals.validationMessage;
    //     } else {
    //       this.internals.setValidity({});
    //       this.invalidText = '';
    //     }
    //   }
    // }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-time-picker': TimePicker;
  }
}
