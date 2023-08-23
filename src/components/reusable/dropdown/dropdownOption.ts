import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
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
  @property({ type: Boolean, reflect: true })
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
  @state()
  multiple = false;

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
        ?multiple=${this.multiple}
        @click=${(e: any) => this.handleClick(e)}
      >
        <span>
          ${this.multiple
            ? html`
                <input
                  type="checkbox"
                  tabindex="-1"
                  @mousedown=${(e: any) => e.preventDefault()}
                  .checked=${this.selected}
                  ?checked=${this.selected}
                />
              `
            : null}

          <slot></slot>
        </span>

        ${this.selected && !this.multiple
          ? html`<kd-icon .icon=${checkmarkIcon}></kd-icon>`
          : null}
      </li>
    `;
  }

  private handleClick(e: Event) {
    console.log('ickl');
    if (this.disabled) {
      return;
    }

    this.selected = !this.selected;

    // emit selected value, bubble so it can be captured by the checkbox group
    const event = new CustomEvent('on-click', {
      bubbles: true,
      composed: true,
      detail: {
        selected: this.selected,
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
