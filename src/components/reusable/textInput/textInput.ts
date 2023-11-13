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
import TextInputScss from './textInput.scss';

import '@kyndryl-design-system/shidoka-foundation/components/icon';
import clearIcon from '@carbon/icons/es/close/24';
import errorIcon from '@carbon/icons/es/warning--filled/24';

/**
 * Text input.
 * @fires on-input - Captures the input event and emits the selected value and original event details.
 * @prop {string} pattern - RegEx pattern to validate.
 * @prop {number} minLength - Minimum number of characters.
 * @prop {number} maxLength - Maximum number of characters.
 * @slot unnamed - Slot for label text.
 * @slot icon - Slot for contextual icon.
 */
@customElement('kyn-text-input')
export class TextInput extends LitElement {
  static override styles = TextInputScss;

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

  /** Input type, limited to options that are "text like". */
  @property({ type: String })
  type = 'text';

  /** Input size. "sm", "md", or "lg". */
  @property({ type: String })
  size = 'md';

  /** Optional text beneath the input. */
  @property({ type: String })
  caption = '';

  /** Input value. */
  @property({ type: String })
  value = '';

  /** Input placeholder. */
  @property({ type: String })
  placeholder = '';

  /** Input name. */
  @property({ type: String })
  name = '';

  /** Makes the input required. */
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
  pattern = null;

  /** Maximum number of characters. */
  @property({ type: Number })
  maxLength = null;

  /** Minimum number of characters. */
  @property({ type: Number })
  minLength = null;

  /** Place icon on the right. */
  @property({ type: Boolean })
  iconRight = false;

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
      <div class="text-input" ?disabled=${this.disabled}>
        <label class="label-text" for=${this.name}>
          ${this.required ? html`<span class="required">*</span>` : null}
          <slot></slot>
        </label>

        <div
          class="${classMap({
            'input-wrapper': true,
            'icon--left': this.iconSlotted && !this.iconRight,
            'icon--right': this.iconSlotted && this.iconRight,
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
            placeholder=${this.placeholder}
            ?required=${this.required}
            ?disabled=${this.disabled}
            ?invalid=${this.isInvalid}
            pattern=${ifDefined(this.pattern)}
            minlength=${ifDefined(this.minLength)}
            maxlength=${ifDefined(this.maxLength)}
            @input=${(e: any) => this.handleInput(e)}
          />

          ${this.isInvalid
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
        ${this.isInvalid
          ? html`
              <div class="error">
                ${this.invalidText || this.internalValidationMsg}
              </div>
            `
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
    if (changedProps.has('value')) {
      this.inputEl.value = this.value;
      // set form data value
      this.internals.setFormValue(this.value);

      // set validity
      if (this.required && (!this.value || this.value === '')) {
        // validate required
        this.internals.setValidity(
          { valueMissing: true },
          'This field is required.'
        );
        this.internalValidationMsg = this.internals.validationMessage;
      } else if (this.minLength && this.value.length < this.minLength) {
        // validate min
        this.internals.setValidity({ tooShort: true }, 'Too few characters.');
        this.internalValidationMsg = this.internals.validationMessage;
      } else if (this.maxLength && this.value.length > this.maxLength) {
        // validate max
        this.internals.setValidity({ tooLong: true }, 'Too many characters.');
        this.internalValidationMsg = this.internals.validationMessage;
      } else if (
        this.pattern &&
        this.pattern != '' &&
        !new RegExp(this.pattern).test(this.value)
      ) {
        // validate pattern
        this.internals.setValidity(
          { patternMismatch: true },
          'Does not match expected format.'
        );
        this.internalValidationMsg = this.internals.validationMessage;
      } else {
        // clear validation
        this.internals.setValidity({});
        this.internalValidationMsg = '';
        this.invalidText = '';
      }
    }
  }

  override firstUpdated() {
    this.determineIfSlotted();
  }

  private determineIfSlotted() {
    this.iconSlotted = this.iconSlot.length ? true : false;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-text-input': TextInput;
  }
}
