import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import CheckboxScss from './checkbox.scss';

/**
 * Checkbox.
 * @fires on-checkbox-change - Captures the change event and emits the selected value and original event details.
 * @slot unnamed - Slot for label text.
 */
@customElement('kyn-checkbox')
export class Checkbox extends LitElement {
  static override styles = CheckboxScss;

  /** Checkbox value. */
  @property({ type: String })
  value = '';

  /**
   * Checkbox name, inherited from the parent group.
   * @ignore
   */
  @property({ type: String })
  name = '';

  /**
   * Checkbox checked state, inherited from the parent group if value matches.
   */
  @property({ type: Boolean })
  checked = false;

  /**
   * Makes the input required, inherited from the parent group.
   * @ignore
   */
  @property({ type: Boolean })
  required = false;

  /**
   * Checkbox disabled state, inherited from the parent group.
   */
  @property({ type: Boolean })
  disabled = false;

  /**
   * Checkbox group invalid state, inherited from the parent group.
   * @ignore
   */
  @property({ type: Boolean })
  invalid = false;

  override render() {
    return html`
      <label ?disabled=${this.disabled} ?invalid=${this.invalid}>
        <span><slot></slot></span>
        <input
          type="checkbox"
          name=${this.name}
          value=${this.value}
          .checked=${this.checked}
          ?checked=${this.checked}
          ?required=${this.required}
          ?disabled=${this.disabled}
          ?invalid=${this.invalid}
          @change=${(e: any) => this.handleChange(e)}
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
