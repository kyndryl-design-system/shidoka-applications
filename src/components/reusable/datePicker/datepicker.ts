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
 * @prop {string} pattern - RegEx pattern to validate.
 * @prop {number} min - Minimum date.
 * @prop {number} max - Maximum date.
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

  /** Input disabled state. */
  @property({ type: Boolean })
  disabled = false;

  /** Input invalid text. */
  @property({ type: String })
  invalidText = '';

  /** RegEx pattern to validate. */
  @property({ type: String })
  pattern = '\\d{1,2}\\/\\d{1,2}\\/\\d{4}';

  /** Maximum limit of date. */
  @property({ type: String })
  max = '';

  /** Minimum limit of date. */
  @property({ type: String })
  min = '';

  /** Date format default(dd/mm/yyyy) */
  @property({ type: String })
  dateFormat = 'dd/mm/yyyy';

  /** Date picker type. Default single */
  @property({ type: String})
  datePickerType = 'single'

  /**
   * Queries the <input> DOM element.
   * @ignore
   */
  @query('input')
  inputEl!: HTMLInputElement;

  /**
   * Evaluates if an icon is slotted.
   * @ignore
   */
  @state()
  iconSlotted = false;

  /**
   * Queries any slotted icons.
   * @ignore
   */
  @queryAssignedElements({ slot: 'icon' })
  iconSlot!: Array<HTMLElement>;

  override render() {
    return html`
      <label class="label-text" for=${this.name} ?disabled=${this.disabled}>
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
          datePickerType=${this.datePickerType}
          type=${this.type}
          id=${this.name}
          name=${this.name}
          value=${this.value}
          dateFormat=${this.dateFormat}
          ?required=${this.required}
          ?disabled=${this.disabled}
          ?invalid=${this.invalidText !== ''}
          pattern=${ifDefined(this.pattern)}
          ?min=${ifDefined(this.min)}
          ?max=${ifDefined(this.max)}
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

  private handleClear() {
    this.value = '';
    this.inputEl.value = '';
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
        } else if (this.min !== this.value) {
          this.internals.setValidity({ tooShort: true }, 'Too can not select below min date.');
          this.invalidText = this.internals.validationMessage;
        } else if (this.max !== this.value) {
          this.internals.setValidity({ tooLong: true }, 'You can not select beyond max date.');
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
