import { LitElement, html } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { classMap } from 'lit/directives/class-map.js';
import TextInputScss from './textInput.scss';

import '@kyndryl-design-system/foundation/components/icon';
import clearIcon from '@carbon/icons/es/close/24';
import errorIcon from '@carbon/icons/es/warning--filled/24';

/**
 * Text input.
 * @fires on-input - Captures the input event and emits the selected value and original event details.
 * @prop {string} pattern - RegEx pattern to validate.
 * @prop {number} minLength - Minimum number of characters.
 * @prop {number} maxLength - Maximum number of characters.
 * @slot unnamed - Slot for label text.
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

  /** Carbon icon to place on top of the input to give more context. */
  @property({ type: Object })
  icon = {};

  /** Place icon on the right. */
  @property({ type: Boolean })
  iconRight = false;

  /**
   * Queries the <input> DOM element.
   * @ignore
   */
  @query('input')
  inputEl!: HTMLInputElement;

  override render() {
    return html`
      <label class="label-text" for=${this.name} ?disabled=${this.disabled}>
        ${this.required ? html`<span class="required">*</span>` : null}
        <slot></slot>
      </label>

      <div
        class="${classMap({
          'input-wrapper': true,
          'icon--left': Object.keys(this.icon).length && !this.iconRight,
          'icon--right': Object.keys(this.icon).length && this.iconRight,
        })}"
      >
        ${Object.keys(this.icon).length
          ? html`<kd-icon class="context-icon" .icon=${this.icon}></kd-icon>`
          : null}
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
          ?invalid=${this.invalidText !== ''}
          pattern=${ifDefined(this.pattern)}
          minlength=${ifDefined(this.minLength)}
          maxlength=${ifDefined(this.maxLength)}
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
        } else if (this.minLength && this.value.length < this.minLength) {
          this.internals.setValidity({ tooShort: true }, 'Too few characters.');
          this.invalidText = this.internals.validationMessage;
        } else if (this.maxLength && this.value.length > this.maxLength) {
          this.internals.setValidity({ tooLong: true }, 'Too many characters.');
          this.invalidText = this.internals.validationMessage;
        } else {
          this.internals.setValidity({});
          this.invalidText = '';
        }
      }

      // validate pattern
      if (this.pattern) {
        const regex = new RegExp(this.pattern);

        if (!regex.test(this.value)) {
          this.internals.setValidity(
            { patternMismatch: true },
            'Value does not match pattern.'
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
    'kyn-text-input': TextInput;
  }
}
