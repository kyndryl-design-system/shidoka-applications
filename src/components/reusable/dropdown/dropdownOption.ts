import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import '../checkbox';
import '../button';

import checkIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/check.svg';
import clearIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/close-simple.svg';

import DropdownOptionScss from './dropdownOption.scss?inline';

/**
 * Dropdown option.
 * @fires on-click - Emits the option details to the parent dropdown. `detail:{ selected: boolean, value: string, origEvent: PointerEvent }`
 * @fires on-remove-option - Emits the option that is removed. `detail:{ value: string }`
 * @slot unnamed - Slot for option text.
 * @slot icon - Slot for option icon. Icon size should be 16px only.
 */
@customElement('kyn-dropdown-option')
export class DropdownOption extends LitElement {
  static override styles = unsafeCSS(DropdownOptionScss);

  /** Option value. */
  @property({ type: String })
  accessor value = '';

  /** Internal text strings.
   * @internal
   */
  @property({ type: Boolean })
  accessor selected = false;

  /** Option disabled state. */
  @property({ type: Boolean })
  accessor disabled = false;

  /** Allow Add Option state, derived from parent. */
  @property({ type: Boolean })
  accessor allowAddOption = false;

  /**
   * Option highlighted state for keyboard navigation, automatically derived.
   * @ignore
   */
  @state()
  accessor highlighted = false;

  /** Multi-select state, derived from parent.
   * @ignore
   */
  @property({ type: Boolean })
  accessor multiple = false;

  /** Removable option. */
  @property({ type: Boolean })
  accessor removable = false;

  /**
   * Option text, automatically derived.
   * @ignore
   */
  @state()
  accessor text: any = '';

  /** Determines whether the checkbox is in an indeterminate state. */
  @property({ type: Boolean, reflect: true })
  accessor indeterminate = false;

  @property({ type: String, reflect: true })
  override accessor role = 'option';

  @property({ type: String, reflect: true, attribute: 'aria-selected' })
  override accessor ariaSelected = 'option';

  override render() {
    return html`
      <div
        class="option menu-item"
        ?highlighted=${this.highlighted}
        ?selected=${this.selected}
        ?disabled=${this.disabled}
        aria-disabled=${this.disabled}
        ?multiple=${this.multiple}
        title=${this.text}
        @pointerup=${(e: any) => this.handleClick(e)}
        @blur=${(e: any) => this.handleBlur(e)}
      >
        <span class="text">
          ${this.multiple
            ? html`
                <kyn-checkbox
                  type="checkbox"
                  value=${this.value}
                  .checked=${this.selected}
                  ?checked=${this.selected}
                  ?disabled=${this.disabled}
                  notFocusable
                  .indeterminate=${this.indeterminate}
                >
                </kyn-checkbox>

                <slot
                  @slotchange=${(e: any) => this.handleSlotChange(e)}
                ></slot>
              `
            : html`
                <slot
                  @slotchange=${(e: any) => this.handleSlotChange(e)}
                ></slot>
              `}
        </span>

        <span class="icon"><slot name="icon" style="display:flex"></slot></span>
        ${this.selected && !this.multiple
          ? html` <span class="check-icon">${unsafeSVG(checkIcon)}</span> `
          : this.allowAddOption && this.removable
          ? html`
              <kyn-button
                class="remove-option"
                kind="ghost"
                size="small"
                aria-label="Delete ${this.value}"
                description="Delete ${this.value}"
                ?disabled=${this.disabled}
                @click=${(e: Event) => this.handleRemoveClick(e)}
                @mousedown=${(e: Event) => e.stopPropagation()}
                @keydown=${(e: KeyboardEvent) => e.stopPropagation()}
                @focus=${(e: KeyboardEvent) => e.stopPropagation()}
              >
                <span slot="icon" class="clear-icon">
                  ${unsafeSVG(clearIcon)}
                </span>
              </kyn-button>
            `
          : null}
      </div>
    `;
  }

  override willUpdate(changedProps: any) {
    if (changedProps.has('selected')) {
      this.ariaSelected = this.selected.toString();
    }
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
