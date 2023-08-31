import { LitElement, html } from 'lit';
import {
  customElement,
  property,
  state,
  query,
  queryAssignedElements,
} from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { classMap } from 'lit/directives/class-map.js';
import DatePickerScss from './datepicker.scss';
import clearIcon from '@carbon/icons/es/close/24';
import errorIcon from '@carbon/icons/es/warning--filled/24';

/**
 * Datepicker.
 * @fires on-input - Captures the input event and emits the selected value and original event details.
 * @prop {number} minDate - Minimum date.
 * @prop {number} maxDate - Maximum date.
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

  /** Input type, limited to "date". */
  @property({ type: String })
  type = 'date';

  /** Datepicker size. "sm", "md", or "lg". */
  @property({ type: String })
  size = 'md';

  /** Optional text beneath the input. */
  @property({ type: String })
  caption = '';

  /** Datepicker value. */
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
  @property({type: String})
  warnText = '';

  /** Maximum limit of date. */
  @property({ type: String })
  maxDate = '';

  /** Minimum limit of date. */
  @property({ type: String })
  minDate = '';

  /** Date picker type. Default single */
  @property({ type: String })
  datePickerType = 'single';

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
          type=${this.type}
          id=${this.name}
          name=${this.name}
          value=${this.value}
          ?required=${this.required}
          ?disabled=${this.disabled}
          ?invalid=${this.invalidText !== ''}
          min=${ifDefined(this.minDate)}
          max=${ifDefined(this.maxDate)}
          @input=${(e: any) => this.handleInput(e)}
        />
      </div>

      ${this.caption !== ''
        ? html` <div class="caption">${this.caption}</div> `
        : null}
      ${this.invalidText !== ''
        ? html` <div class="error">${this.invalidText}</div> `
        : null}
      ${this.warnText !== ''  && this.invalidText === ''
        ? html`<div class="warn">${this.warnText}</div>`
        : null}
    `;
  }

  private handleInput(e: any) {
    console.log(e.target.value);
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
    if (changedProps.has('value')) {
      this.inputEl.value = this.value;
      // set form data value
      this.internals.setFormValue(this.value);

      // set validity
      if (this.required) {
        if (!this.value || this.value === '') {
          this.internals.setValidity(
            { valueMissing: true },
            'This field is required.'
          );
          this.invalidText = this.internals.validationMessage;
        } else if (this.minDate !== this.value) {
          this.internals.setValidity(
            { tooShort: true },
            'Too can not select below min date.'
          );
          this.invalidText = this.internals.validationMessage;
        } else if (this.maxDate !== this.value) {
          this.internals.setValidity(
            { tooLong: true },
            'You can not select beyond max date.'
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
    'kyn-date-picker': DatePicker;
  }
}
