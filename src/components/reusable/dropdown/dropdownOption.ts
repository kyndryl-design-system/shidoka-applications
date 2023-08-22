import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import DropdownOptionScss from './dropdownOption.scss';

import '@kyndryl-design-system/foundation/components/icon';
import checkmarkIcon from '@carbon/icons/es/checkmark/20';

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

  /**
   * Option highlighted state for keyboard navigation, automatically derived.
   * @ignore
   */
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
        ${this.selected
          ? html`<kd-icon .icon=${checkmarkIcon}></kd-icon>`
          : null}
      </li>
    `;
  }

  private handleClick(e: Event) {
    if (this.disabled) {
      return false;
    }

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
