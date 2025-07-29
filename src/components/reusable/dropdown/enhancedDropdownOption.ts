import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import '../button';
import '../checkbox';
import '../tag';

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

  /** Option selected state. */
  @property({ type: Boolean })
  accessor selected = false;

  /** Option disabled state. */
  @property({ type: Boolean })
  accessor disabled = false;

  /** Allow Add Option state, derived from parent. */
  @property({ type: Boolean })
  accessor allowAddOption = false;

  /** Multi-select state, derived from parent.
   * @ignore
   */
  @property({ type: Boolean })
  accessor multiple = false;

  /** Removable option. */
  @property({ type: Boolean })
  accessor removable = false;

  /** Determines whether the checkbox is in an indeterminate state. */
  @property({ type: Boolean, reflect: true })
  accessor indeterminate = false;

  /**
   * The ARIA role of this element.
   */
  @property({ type: String, reflect: true })
  override accessor role = 'option';

  /**
   * Indicates whether this option is selected.
   */
  @property({ type: String, reflect: true, attribute: 'aria-selected' })
  override accessor ariaSelected = 'false';

  /**
   * Option highlighted state for keyboard navigation, automatically derived.
   * @ignore
   */
  @state()
  accessor highlighted = false;

  /**
   * Option text, automatically derived from title or fallback content.
   * @ignore
   */
  @state()
  accessor text: any = '';

  /** Track if icon slot has content
   * @internal
   */
  @state()
  accessor hasIcon = false;

  /** Track if title slot has content
   * @internal
   */
  @state()
  accessor hasTitle = false;

  /** Track if description slot has content */
  @state()
  accessor hasDescription = false;

  /** Track if tag slot has content
   * @internal
   */
  @state()
  accessor hasTag = false;

  /** Track if optionType slot has content
   * @internal
   */
  @state()
  accessor hasOptionType = false;

  override render() {
    return html`
      <div
        class="enhanced-option"
        ?highlighted=${this.highlighted}
        ?selected=${this.selected}
        ?disabled=${this.disabled}
        title=${this.text}
        role="option"
        aria-selected=${this.selected}
        @pointerup=${this.handleClick}
        @blur=${this.handleBlur}
      >
        ${this.multiple
          ? html`<kyn-checkbox
              .checked=${this.selected}
              .indeterminate=${this.indeterminate}
              ?disabled=${this.disabled}
              notFocusable
            ></kyn-checkbox>`
          : null}

        <div class="icon-container" ?hidden=${!this.hasIcon}>
          <slot name="icon" @slotchange=${this.updateIconState}></slot>
        </div>

        <div class="text-content">
          <div class="title-container">
            <slot
              name="title"
              class="kd-type--weight-regular"
              @slotchange=${this.updateTitleState}
            ></slot>
            <slot @slotchange=${this.updateFallbackState}></slot>
            <span class="tag-container">
              <slot name="tag" @slotchange=${this.updateTagState}></slot>
            </span>
          </div>

          <div
            class="description-container kd-type--weight-regular"
            ?hidden=${!this.hasDescription}
          >
            <slot
              name="description"
              @slotchange=${this.updateDescriptionState}
            ></slot>
          </div>

          <div
            class="option-type-container kd-type-weight-medium"
            ?hidden=${!this.hasOptionType}
          >
            <slot
              name="optionType"
              @slotchange=${this.updateOptionTypeState}
            ></slot>
          </div>
        </div>

        <div class="status-icons">
          ${!this.multiple && this.selected
            ? html`<span class="check-icon">${unsafeSVG(checkIcon)}</span>`
            : null}
          ${this.removable && this.allowAddOption
            ? html`<kyn-button
                class="remove-option"
                kind="ghost"
                size="small"
                aria-label="Remove ${this.value}"
                @click=${this.handleRemoveClick}
              >
                ${unsafeSVG(clearIcon)}
              </kyn-button>`
            : null}
        </div>
      </div>
    `;
  }

  private updateIconState(e: any) {
    this.hasIcon = !!e.target.assignedNodes().length;
  }

  private updateTitleState(e: any) {
    const text = e.target
      .assignedNodes()
      .map((n: any) => n.textContent?.trim())
      .join('');
    this.hasTitle = !!text;
    if (text) this.text = text;
  }

  private updateFallbackState(e: any) {
    if (!this.hasTitle) {
      const text = e.target
        .assignedNodes()
        .map((n: any) => n.textContent?.trim())
        .join('');
      this.text = text;
    }
  }

  private updateTagState(e: any) {
    this.hasTag = !!e.target.assignedNodes().length;
  }

  private updateDescriptionState(e: any) {
    this.hasDescription = !!e.target.assignedNodes().length;
  }

  private updateOptionTypeState(e: any) {
    this.hasOptionType = !!e.target.assignedNodes().length;
  }

  private handleClick(e: PointerEvent) {
    if (this.disabled) return;
    this.selected = this.multiple ? !this.selected : true;
    this.dispatchEvent(
      new CustomEvent('on-click', {
        detail: { selected: this.selected, value: this.value, origEvent: e },
        bubbles: true,
        composed: true,
      })
    );
  }

  private handleBlur(e: FocusEvent) {
    this.dispatchEvent(
      new CustomEvent('on-blur', {
        detail: { origEvent: e },
        bubbles: true,
        composed: true,
      })
    );
  }

  private handleRemoveClick(e: MouseEvent) {
    e.stopPropagation();
    this.dispatchEvent(
      new CustomEvent('on-remove-option', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      })
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-enhanced-dropdown-option': EnhancedDropdownOption;
  }
}
