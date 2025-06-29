import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit-html/directives/class-map.js';
import CheckboxScss from './checkbox.scss?inline';

/**
 * Checkbox.
 * @fires on-checkbox-change - Captures the change event and emits the selected value and original event details.
 * @slot unnamed - Slot for label text.
 */
@customElement('kyn-checkbox')
export class Checkbox extends LitElement {
  static override styles = unsafeCSS(CheckboxScss);

  /** @ignore */
  static override shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  /** Checkbox value. */
  @property({ type: String })
  accessor value = '';

  /**
   * Checkbox name, inherited from the parent group.
   * @ignore
   */
  @property({ type: String })
  accessor name = '';

  /**
   * Checkbox checked state, inherited from the parent group if value matches.
   * @internal
   */
  @property({ type: Boolean, reflect: true })
  accessor checked = false;

  /**
   * Makes the input required, inherited from the parent group.
   * @internal
   */
  @property({ type: Boolean })
  accessor required = false;

  /**
   * Checkbox disabled state, inherited from the parent group.
   */
  @property({ type: Boolean })
  accessor disabled = false;

  /**
   * Prevent checkbox from being focusable. Disables it functionally but not visually.
   */
  @property({ type: Boolean })
  accessor notFocusable = false;

  /**
   * Checkbox group invalid state, inherited from the parent group.
   * @internal
   */
  @property({ type: Boolean })
  accessor invalid = false;

  /**
   * Determines whether the label should be hidden from visual view but remain accessible
   * to screen readers for accessibility purposes.
   */
  @property({ type: Boolean })
  accessor visiblyHidden = false;

  /** Determines whether the checkbox is in an indeterminate state. */
  @property({ type: Boolean })
  accessor indeterminate = false;

  override render() {
    return html`
      <label
        ?disabled=${this.disabled}
        ?invalid=${this.invalid}
        class="${this.visiblyHidden ? 'label-hidden' : ''}"
      >
        <span class=${classMap({ 'sr-only': this.visiblyHidden })}>
          <slot></slot>
        </span>

        <input
          class=${this.disabled ? 'disabled' : ''}
          type="checkbox"
          name=${this.name}
          value=${this.value}
          .checked=${this.checked}
          ?checked=${this.checked}
          ?required=${this.required}
          ?disabled=${this.disabled || this.notFocusable}
          ?invalid=${this.invalid}
          @change=${(e: any) => this.handleChange(e)}
          .indeterminate=${this.indeterminate}
        />
      </label>
    `;
  }

  private handleChange(e: any) {
    // emit selected value, bubble so it can be captured by the checkbox group
    const event = new CustomEvent('on-checkbox-change', {
      bubbles: true,
      composed: true,
      detail: {
        checked: e.target.checked,
        value: e.target.value,
        origEvent: e,
      },
    });
    this.dispatchEvent(event);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-checkbox': Checkbox;
  }
}
