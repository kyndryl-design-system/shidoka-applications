import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import SplitButtonOptionScss from './splitButtonOption.scss';

/**
 * Split button option.
 * @fires on-action-click - Emits the option details to the parent split button.
 * @slot unnamed - Slot for option text.
 */

@customElement('kyn-splitbutton-option')
export class SplitButtonOption extends LitElement {
  static override styles = SplitButtonOptionScss;

  /** Split button option value. */
  @property({ type: String })
  value = '';

  /** Split button option selected state. */
  @property({ type: Boolean, reflect: true })
  selected = false;

  /** Split button menu option disabled state. */
  @property({ type: Boolean })
  disabled = false;

  /**
   * Option highlighted state for keyboard navigation, automatically derived.
   * @ignore
   */
  @state()
  highlighted = false;

  /**
   * Option text, automatically derived.
   * @ignore
   */
  @state()
  text: any = '';

  override render() {
    return html`
      <li
        role="option"
        ?highlighted=${this.highlighted}
        ?selected=${this.selected}
        ?disabled=${this.disabled}
        aria-disabled=${this.disabled}
        title=${this.text}
        @click=${(e: any) => this.handleClick(e)}
        @blur=${(e: any) => this.handleBlur(e)}
      >
        <span>
          <slot @slotchange=${(e: any) => this.handleSlotChange(e)}></slot>
        </span>
      </li>
    `;
  }

  private handleSlotChange(e: any) {
    // set text prop from slotted text, for ease of access
    const nodes = e.target.assignedNodes({ flatten: true });
    let text = '';

    for (let i = 0; i < nodes.length; i++) {
      text += nodes[i].textContent.trim();
    }

    this.text = text;
  }

  private handleClick(e: Event) {
    // prevent click if disabled
    if (this.disabled) {
      return;
    }
    // emit selected value, bubble so it can be captured by the parent element
    const event = new CustomEvent('on-action-click', {
      bubbles: true,
      composed: true,
      detail: {
        value: this.value,
        text: this.text,
        origEvent: e,
      },
    });
    this.dispatchEvent(event);
  }

  private handleBlur(e: any) {
    // emit blur event, bubble so it can be captured by split button component ( parent )
    const event = new CustomEvent('on-blur', {
      bubbles: true,
      composed: true,
      detail: {
        origEvent: e,
      },
    });
    this.dispatchEvent(event);
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'kyn-splitbutton-option': SplitButtonOption;
  }
}
