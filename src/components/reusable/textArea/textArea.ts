import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import TextAreaScss from './textArea.scss';

import '@kyndryl-design-system/foundation/components/icon';
import errorIcon from '@carbon/icons/es/warning--filled/24';

/**
 * Text area.
 * @fires on-input - Captures the input event and emits the selected value and original event details.
 * @prop {number} minLength - Minimum number of characters.
 * @prop {number} maxLength - Maximum number of characters.
 * @slot unnamed - Slot for label text.
 */
@customElement('kyn-text-area')
export class TextArea extends LitElement {
  static override styles = TextAreaScss;

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

  /** Maximum number of characters. */
  @property({ type: Number })
  maxLength = null;

  /** Minimum number of characters. */
  @property({ type: Number })
  minLength = null;

  override render() {
    return html`
      <label class="label-text" for=${this.name} ?disabled=${this.disabled}>
        ${this.required ? html`<span class="required">*</span>` : null}
        <slot></slot>
      </label>

      <div class="input-wrapper">
        <textarea
          id=${this.name}
          name=${this.name}
          placeholder=${this.placeholder}
          ?required=${this.required}
          ?disabled=${this.disabled}
          ?invalid=${this.invalidText !== ''}
          minlength=${ifDefined(this.minLength)}
          maxlength=${ifDefined(this.maxLength)}
          @input=${(e: any) => this.handleInput(e)}
        >
${this.value}</textarea
        >

        ${this.invalidText !== ''
          ? html` <kd-icon class="error-icon" .icon=${errorIcon}></kd-icon> `
          : null}
        ${this.maxLength
          ? html`
              <div class="count">${this.value.length}/${this.maxLength}</div>
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

  override updated(changedProps: any) {
    if (changedProps.has('value')) {
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
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-text-area': TextArea;
  }
}
