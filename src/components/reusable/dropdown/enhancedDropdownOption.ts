import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import '../button';
import '../tag';

import checkIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/check.svg';
import clearIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/close-simple.svg';

import EnhancedDropdownOptionScss from './enhancedDropdownOption.scss?inline';

/**
 * Enhanced Dropdown option with rich content support.
 * @fires on-click - Emits the option details to the parent dropdown.
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

  /** Option selected state. */
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
   * Option text, automatically derived from title or fallback content.
   * @ignore
   */
  @state()
  accessor text: any = '';

  /** Track if icon slot has content */
  @state()
  accessor hasIcon = false;

  /** Track if title slot has content */
  @state()
  accessor hasTitle = false;

  /** Track if description slot has content */
  @state()
  accessor hasDescription = false;

  /** Track if tag slot has content */
  @state()
  accessor hasTag = false;

  /** Track if optionType slot has content */
  @state()
  accessor hasOptionType = false;

  /** Determines whether the checkbox is in an indeterminate state. */
  @property({ type: Boolean, reflect: true })
  accessor indeterminate = false;

  @property({ type: String, reflect: true })
  override accessor role = 'option';

  @property({ type: String, reflect: true, attribute: 'aria-selected' })
  override accessor ariaSelected = 'false';

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
        <div class="content">
          ${this.hasIcon
            ? html`
                <div class="icon-container">
                  <slot
                    name="icon"
                    @slotchange=${(e: any) => this.handleIconSlotChange(e)}
                  ></slot>
                </div>
              `
            : html`
                <slot
                  name="icon"
                  @slotchange=${(e: any) => this.handleIconSlotChange(e)}
                  style="display: none;"
                ></slot>
              `}

          <div class="text-content">
            ${this.hasTitle || this.text
              ? html`
                  <div class="title">
                    <div class="title-content">
                      <slot
                        name="title"
                        @slotchange=${(e: any) => this.handleTitleSlotChange(e)}
                      ></slot>
                      <slot
                        @slotchange=${(e: any) =>
                          this.handleFallbackSlotChange(e)}
                      ></slot>
                      ${this.hasTag
                        ? html`
                            <div class="tag-container">
                              <slot
                                name="tag"
                                @slotchange=${(e: any) =>
                                  this.handleTagSlotChange(e)}
                              ></slot>
                            </div>
                          `
                        : html`
                            <slot
                              name="tag"
                              @slotchange=${(e: any) =>
                                this.handleTagSlotChange(e)}
                              style="display: none;"
                            ></slot>
                          `}
                    </div>
                  </div>
                `
              : html`
                  <slot
                    name="title"
                    @slotchange=${(e: any) => this.handleTitleSlotChange(e)}
                    style="display: none;"
                  ></slot>
                  <slot
                    @slotchange=${(e: any) => this.handleFallbackSlotChange(e)}
                    style="display: none;"
                  ></slot>
                  <slot
                    name="tag"
                    @slotchange=${(e: any) => this.handleTagSlotChange(e)}
                    style="display: none;"
                  ></slot>
                `}
            ${this.hasDescription
              ? html`
                  <div class="description">
                    <slot
                      name="description"
                      @slotchange=${(e: any) =>
                        this.handleDescriptionSlotChange(e)}
                    ></slot>
                  </div>
                `
              : html`
                  <slot
                    name="description"
                    @slotchange=${(e: any) =>
                      this.handleDescriptionSlotChange(e)}
                    style="display: none;"
                  ></slot>
                `}
            ${this.hasOptionType
              ? html`
                  <div class="option-type">
                    <slot
                      name="optionType"
                      @slotchange=${(e: any) =>
                        this.handleOptionTypeSlotChange(e)}
                    ></slot>
                  </div>
                `
              : html`
                  <slot
                    name="optionType"
                    @slotchange=${(e: any) =>
                      this.handleOptionTypeSlotChange(e)}
                    style="display: none;"
                  ></slot>
                `}
          </div>
        </div>

        <div class="status-icons">
          ${this.selected
            ? html` <span class="check-icon">${unsafeSVG(checkIcon)}</span> `
            : null}
          ${this.allowAddOption && this.removable
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

  override willUpdate(changedProps: any) {
    if (changedProps.has('selected')) {
      this.ariaSelected = this.selected.toString();
    }
  }

  private handleIconSlotChange(e: any) {
    const nodes = e.target.assignedNodes({ flatten: true });
    this.hasIcon =
      nodes.length > 0 &&
      nodes.some(
        (node: Node) =>
          node.nodeType === Node.ELEMENT_NODE ||
          (node.nodeType === Node.TEXT_NODE && node.textContent?.trim())
      );
  }

  private handleTitleSlotChange(e: any) {
    const nodes = e.target.assignedNodes({ flatten: true });
    let text = '';

    for (let i = 0; i < nodes.length; i++) {
      text += nodes[i].textContent?.trim() || '';
    }

    this.hasTitle = text.length > 0;
    if (text) {
      this.text = text;
    }
  }

  private handleDescriptionSlotChange(e: any) {
    const nodes = e.target.assignedNodes({ flatten: true });
    this.hasDescription =
      nodes.length > 0 &&
      nodes.some(
        (node: Node) =>
          node.nodeType === Node.ELEMENT_NODE ||
          (node.nodeType === Node.TEXT_NODE && node.textContent?.trim())
      );
  }

  private handleTagSlotChange(e: any) {
    const nodes = e.target.assignedNodes({ flatten: true });
    this.hasTag =
      nodes.length > 0 &&
      nodes.some(
        (node: Node) =>
          node.nodeType === Node.ELEMENT_NODE ||
          (node.nodeType === Node.TEXT_NODE && node.textContent?.trim())
      );
  }

  private handleOptionTypeSlotChange(e: any) {
    const nodes = e.target.assignedNodes({ flatten: true });
    this.hasOptionType =
      nodes.length > 0 &&
      nodes.some(
        (node: Node) =>
          node.nodeType === Node.ELEMENT_NODE ||
          (node.nodeType === Node.TEXT_NODE && node.textContent?.trim())
      );
  }

  private handleFallbackSlotChange(e: any) {
    const titleSlot = this.shadowRoot?.querySelector(
      'slot[name="title"]'
    ) as HTMLSlotElement;
    const titleNodes = titleSlot?.assignedNodes({ flatten: true }) || [];

    if (titleNodes.length === 0) {
      const nodes = e.target.assignedNodes({ flatten: true });
      let text = '';

      for (let i = 0; i < nodes.length; i++) {
        text += nodes[i].textContent?.trim() || '';
      }

      this.text = text;
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
