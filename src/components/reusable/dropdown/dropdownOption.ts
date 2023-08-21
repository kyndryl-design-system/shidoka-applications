import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import DropdownOptionScss from './dropdownOption.scss';

/**
 * Dropdown option.
 * @fires on-click - Emits the option details to the parent dropdown.
 * @slot unnamed - Slot for option text.
 */
@customElement('kyn-dropdown-option')
export class DropdownOption extends LitElement {
  static override styles = DropdownOptionScss;

  /** Option value. */
  @property({ type: String })
  value = '';

  /** Option selected state. */
  @property({ type: Boolean })
  selected = false;

  /** Option highlighted state for keyboard navigation. */
  @property({ type: Boolean })
  highlighted = false;

  /** Option disabled state. */
  @property({ type: Boolean })
  disabled = false;

  /**
   * Option text, automatically derived.
   * @ignore
   */
  @property()
  text: any = '';

  override render() {
    return html`
      <li
        role="option"
        ?highlighted=${this.highlighted}
        ?selected=${this.selected}
        ?disabled=${this.disabled}
        @click=${(e: any) => this.handleClick(e)}
      >
        <slot></slot>
      </li>
    `;
  }

  private handleClick(e: Event) {
    // emit selected value, bubble so it can be captured by the checkbox group
    const event = new CustomEvent('on-click', {
      bubbles: true,
      composed: true,
      detail: {
        value: this.value,
        text: this.shadowRoot?.querySelector('slot')?.assignedNodes()[0]
          .textContent,
        origEvent: e,
      },
    });
    this.dispatchEvent(event);
  }

  override firstUpdated() {
    this.text = this.shadowRoot
      ?.querySelector('slot')
      ?.assignedNodes()[0].textContent;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-dropdown-option': DropdownOption;
  }
}
