import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import ToggleButtonScss from './toggleButton.scss';

/**
 * Toggle Button.
 * @fires on-change - Captures the change event and emits the selected value and original event details.
 * @slot unnamed - Slot for label text.
 */
@customElement('kyn-toggle-button')
export class ToggleButton extends LitElement {
  static override styles = ToggleButtonScss;

  /** Checkbox checked state. */
  @property({ type: Boolean })
  checked = false;

  /** Checked state text. */
  @property({ type: String })
  checkedText = 'On';

  /** Unchecked state text. */
  @property({ type: String })
  uncheckedText = 'Off';

  /** Option to use small size. */
  @property({ type: Boolean })
  small = false;

  /** Checkbox disabled state. */
  @property({ type: Boolean })
  disabled = false;

  override render() {
    return html`
      <div class="wrapper" ?disabled=${this.disabled}>
        <label ?disabled=${this.disabled}>
          <span class="label-text">
            <slot></slot>
          </span>

          <input
            class="${this.small ? 'size--sm' : ''}"
            type="checkbox"
            .checked=${this.checked}
            ?checked=${this.checked}
            ?disabled=${this.disabled}
            @change=${(e: any) => this.handleChange(e)}
          />
        </label>

        <span class="status-text">
          ${this.checked ? this.checkedText : this.uncheckedText}
        </span>
      </div>
    `;
  }

  private handleChange(e: any) {
    this.checked = e.target.checked;
    // emit selected value, bubble so it can be captured by the checkbox group
    const event = new CustomEvent('on-change', {
      detail: {
        checked: e.target.checked,
        origEvent: e,
      },
    });
    this.dispatchEvent(event);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-toggle-button': ToggleButton;
  }
}
