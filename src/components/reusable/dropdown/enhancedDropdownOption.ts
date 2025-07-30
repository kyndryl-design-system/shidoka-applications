import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import '../checkbox';
import '../button';

import checkIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/check.svg';
import clearIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/close-simple.svg';

import EnhancedDropdownOptionScss from './enhancedDropdownOption.scss?inline';

/**
 * Enhanced Dropdown option with rich content support.
 * @fires on-click - Emits the option details to the parent dropdown. `detail:{ selected: boolean, value: string, origEvent: PointerEvent }`
 * @fires on-remove-option - Emits the option that is removed.
 * @slot icon - Slot for option icon. Icon size should be 16px only.
 * @slot title - Slot for option title text.
 * @slot tag - Slot for inline tag appended to title.
 * @slot description - Slot for option description text.
 * @slot optionType - Slot for option type label.
 * @slot unnamed - Fallback slot for simple text content.
 */
@customElement('kyn-enhanced-dropdown-option')
export class EnhancedDropdownOption extends LitElement {
  static override styles = unsafeCSS(EnhancedDropdownOptionScss);

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

  /**
   * Title text for display purposes, automatically derived.
   * @ignore
   */
  @state()
  accessor displayText: any = '';

  /**
   * Whether the icon slot has content.
   * @ignore
   */
  @state()
  accessor hasIcon = false;

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
        class="enhanced-option"
        ?highlighted=${this.highlighted}
        ?selected=${this.selected}
        ?disabled=${this.disabled}
        aria-disabled=${this.disabled}
        ?multiple=${this.multiple}
        title=${this.text}
        @pointerup=${(e: any) => this.handleClick(e)}
        @blur=${(e: any) => this.handleBlur(e)}
      >
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
            `
          : null}

        <div class="content">
          ${this.hasIcon
            ? html`
                <div class="icon-container">
                  <slot
                    name="icon"
                    @slotchange=${this.handleIconSlotChange}
                  ></slot>
                </div>
              `
            : html`
                <div style="display: none;">
                  <slot
                    name="icon"
                    @slotchange=${this.handleIconSlotChange}
                  ></slot>
                </div>
              `}

          <div class="text-content">
            <div class="title">
              <div class="title-content">
                <slot
                  name="title"
                  @slotchange=${(e: any) => this.handleTitleSlotChange(e)}
                >
                  <slot
                    @slotchange=${(e: any) => this.handleSlotChange(e)}
                  ></slot>
                </slot>
                <div class="tag-container">
                  <slot name="tag"></slot>
                </div>
              </div>
            </div>

            <div class="description-container">
              <slot name="description"></slot>
            </div>

            <div class="option-type-container">
              <slot name="optionType"></slot>
            </div>
          </div>
        </div>

        <div class="status-icons">
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
      </div>
    `;
  }

  override firstUpdated() {
    const iconSlot = this.shadowRoot?.querySelector(
      'slot[name="icon"]'
    ) as HTMLSlotElement;
    if (iconSlot) {
      const nodes = iconSlot.assignedNodes({ flatten: true });
      this.hasIcon = nodes.length > 0;
    }
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
    const nodes = e.target.assignedNodes({ flatten: true });
    let text = '';

    for (let i = 0; i < nodes.length; i++) {
      text += nodes[i].textContent.trim();
    }

    this.text = text;
  }

  private handleTitleSlotChange(e: any) {
    const nodes = e.target.assignedNodes({ flatten: true });
    let titleText = '';

    for (let i = 0; i < nodes.length; i++) {
      titleText += nodes[i].textContent.trim();
    }

    this.displayText = titleText;
  }

  private handleIconSlotChange = (e: Event) => {
    const slot = e.target as HTMLSlotElement;
    const nodes = slot.assignedNodes({ flatten: true });
    this.hasIcon = nodes.length > 0;
  };

  private handleClick(e: Event) {
    if (this.disabled) {
      return;
    }

    if (this.multiple) {
      this.selected = !this.selected;
    } else {
      this.selected = true;
    }

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
    'kyn-enhanced-dropdown-option': EnhancedDropdownOption;
  }
}
