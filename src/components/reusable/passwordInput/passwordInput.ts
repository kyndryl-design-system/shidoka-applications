import { LitElement, html } from 'lit';
import { customElement, state, property } from 'lit/decorators.js';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import '../textInput/textInput';

import lockIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/lock.svg';
import unlockIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/unlock.svg';

import styles from './passwordInput.scss';

/**
 * Password input component.
 *
 * @fires on-input - Captures the input event and emits the value.
 * @slot unnamed - Slot for the password input field.
 * @slot tooltip - Slot for tooltip that appears next to the label.
 */
@customElement('kyn-password-input')
export class PasswordInput extends LitElement {
  static override styles = [styles];

  /** Input label text */
  @property({ type: String })
  label = 'Password';

  /** Input name attribute */
  @property({ type: String })
  name = 'password-example';

  /** Input placeholder text */
  @property({ type: String })
  placeholder = 'Enter password';

  /** Input value */
  @property({ type: String })
  value = '';

  /** Whether the input is disabled */
  @property({ type: Boolean })
  disabled = false;

  /** Whether the input is required */
  @property({ type: Boolean })
  required = false;

  /** Whether the input has an error */
  @property({ type: Boolean })
  invalid = false;

  /** Error message text */
  @property({ type: String })
  invalidText = '';

  /** Helper text for the input */
  @property({ type: String })
  helperText = '';

  /** RegEx pattern to validate */
  @property({ type: String })
  pattern = '';

  /** Minimum number of characters */
  @property({ type: Number })
  minLength?: number;

  /** Maximum number of characters */
  @property({ type: Number })
  maxLength?: number;

  /** Internal state for password visibility */
  @state()
  private passwordVisible = false;

  override render() {
    return html`
      <div class="input-wrapper">
        <kyn-text-input
          label="${this.label}"
          name="${this.name}"
          .value="${this.value}"
          placeholder="${this.placeholder}"
          type="${this.passwordVisible ? 'text' : 'password'}"
          ?disabled="${this.disabled}"
          ?required="${this.required}"
          ?invalid="${this.invalid}"
          invalidText="${this.invalidText}"
          helperText="${this.helperText}"
          iconRight
          pattern="${this._shouldEnableValidation() ? this.pattern : ''}"
          minLength="${ifDefined(
            this._shouldEnableValidation() ? this.minLength : undefined
          )}"
          maxLength="${ifDefined(this.maxLength)}"
          @on-input="${this._handleInput}"
        >
          <div
            slot="icon"
            class="visibility-toggle ${this.disabled ? 'disabled' : ''}"
            @click="${this.disabled ? null : this._togglePasswordVisibility}"
          >
            ${this.passwordVisible
              ? html`<span class="icon-container"
                  >${unsafeSVG(unlockIcon)}</span
                >`
              : html`<span class="icon-container"
                  >${unsafeSVG(lockIcon)}</span
                >`}
          </div>
          <slot name="tooltip" slot="tooltip"></slot>
        </kyn-text-input>
      </div>
    `;
  }

  private _handleInput(e: CustomEvent) {
    this.value = e.detail.value;

    const event = new CustomEvent('on-input', {
      detail: { value: this.value, name: this.name },
    });
    this.dispatchEvent(event);
  }

  private _togglePasswordVisibility(e: MouseEvent) {
    e.stopPropagation();
    this.passwordVisible = !this.passwordVisible;
  }

  private _shouldEnableValidation(): boolean {
    return !!(
      this.pattern ||
      this.minLength ||
      this.maxLength ||
      this.required
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-password-input': PasswordInput;
  }
}
