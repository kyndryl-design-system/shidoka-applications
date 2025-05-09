import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import '../checkbox';
import '../button';

import checkIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/check.svg';
import clearIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/close-simple.svg';

import DropdownOptionScss from './dropdownOption.scss';

/**
 * Dropdown option.
 * @fires on-click - Emits the option details to the parent dropdown.
 * @fires on-remove-option - Emits the option that is removed.
 * @slot unnamed - Slot for option text.
 * @slot icon - Slot for option icon. Icon size should be 16px only.
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

  /** Allow Add Option state, derived from parent. */
  @property({ type: Boolean })
  allowAddOption = false;

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

  /** Removable option. */
  @property({ type: Boolean })
  removable = false;

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
        aria-selected=${this.selected}
        ?disabled=${this.disabled}
        aria-disabled=${this.disabled}
        ?multiple=${this.multiple}
        title=${this.value}
        @click=${(e: any) => this.handleClick(e)}
        @blur=${(e: any) => this.handleBlur(e)}
      >
        <slot name="icon"></slot>
        <span>
          ${this.multiple
            ? html`
                <kyn-checkbox
                  type="checkbox"
                  value=${this.value}
                  aria-hidden="true"
                  tabindex="-1"
                  @pointerdown=${(e: any) => e.preventDefault()}
                  @pointerup=${(e: any) => e.preventDefault()}
                  .checked=${this.selected}
                  ?checked=${this.selected}
                  ?disabled=${this.disabled}
                  visiblyHidden
                  .indeterminate=${this.indeterminate}
                ></kyn-checkbox>
              `
            : null}

          <slot @slotchange=${(e: any) => this.handleSlotChange(e)}></slot>
        </span>

        ${this.selected && !this.multiple
          ? html`<span class="check-icon">${unsafeSVG(checkIcon)}</span>`
          : this.allowAddOption && this.removable
          ? html`<kyn-button
              class="remove-option"
              kind="ghost"
              size="small"
              tabindex="0"
              aria-label="Delete  ${this.value}"
              description="Delete ${this.value}"
              ?disabled=${this.disabled}
              @click=${(e: Event) => this.handleRemoveClick(e)}
              @mousedown=${(e: Event) => e.stopPropagation()}
              @keydown=${(e: KeyboardEvent) => e.stopPropagation()}
              @focus=${(e: KeyboardEvent) => e.stopPropagation()}
            >
              <span slot="icon" class="clear-icon"
                >${unsafeSVG(clearIcon)}</span
              >
            </kyn-button>`
          : null}
      </li>
    `;
  }

  private handleRemoveClick(e: Event) {
    e.stopPropagation();
    const event = new CustomEvent('on-remove-option', {
      bubbles: true,
      composed: true,
      detail: {
        value: this.value,
      },
    });
    this.dispatchEvent(event);
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
