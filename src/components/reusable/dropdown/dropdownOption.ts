import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import DropdownOptionScss from './dropdownOption.scss';
import '@kyndryl-design-system/shidoka-foundation/components/icon';
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

  /** Internal text strings.
   * @internal
   */
  @state()
  selected = false;

  /** Option disabled state. */
  @property({ type: Boolean })
  disabled = false;

  /**
   * Option highlighted state for keyboard navigation, automatically derived.
   * @ignore
   */
  @state()
  highlighted = false;

  /** Multi-select state, derived from parent.
   * @ignore
   */
  @property({ type: Boolean })
  multiple = false;

  /**
   * Option text, automatically derived.
   * @ignore
   */
  @state()
  text: any = '';

  /** Determines whether the checkbox is in an indeterminate state. */
  @property({ type: Boolean, reflect: true })
  indeterminate = false;

  override render() {
    return html`
      <li
        role="option"
        ?highlighted=${this.highlighted}
        ?selected=${this.selected}
        ?disabled=${this.disabled}
        aria-disabled=${this.disabled}
        ?multiple=${this.multiple}
        title=${this.text}
        @click=${(e: any) => this.handleClick(e)}
        @blur=${(e: any) => this.handleBlur(e)}
      >
        <span>
          ${this.multiple
            ? html`
                <input
                  type="checkbox"
                  aria-hidden="true"
                  tabindex="-1"
                  @mousedown=${(e: any) => e.preventDefault()}
                  .checked=${this.selected}
                  ?checked=${this.selected}
                  ?disabled=${this.disabled}
                  .indeterminate=${this.indeterminate}
                />
              `
            : null}

          <slot @slotchange=${(e: any) => this.handleSlotChange(e)}></slot>
        </span>

        ${this.selected && !this.multiple
          ? html`<kd-icon .icon=${checkmarkIcon}></kd-icon>`
          : null}
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

    // update selected state
    if (this.multiple) {
      this.selected = !this.selected;
    } else {
      this.selected = true;
    }

    // emit selected value, bubble so it can be captured by the parent dropdown
    const event = new CustomEvent('on-click', {
      bubbles: true,
      composed: true,
      detail: {
        selected: this.selected,
        value: this.value,
        origEvent: e,
      },
    });
    this.dispatchEvent(event);
  }

  private handleBlur(e: any) {
    // emit blur event, bubble so it can be captured by the parent dropdown
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
    'kyn-dropdown-option': DropdownOption;
  }
}
