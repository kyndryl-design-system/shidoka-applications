import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import HeaderCategoryScss from './headerCategory.scss?inline';

/**
 * Header link category
 * @slot unnamed - Slot for links.
 * @slot icon - Slot for icon.
 * @slot more - Slot for "More" link (not indented).
 */
@customElement('kyn-header-category')
export class HeaderCategory extends LitElement {
  static override styles = unsafeCSS(HeaderCategoryScss);

  /** Category text. */
  @property({ type: String })
  accessor heading = '';

  /** Add left padding when icon is not provided to align text with links that do have icons. */
  @property({ type: Boolean })
  accessor leftPadding = false;

  /** Show bottom border/divider. Set to true to force show, false to force hide. By default, dividers are automatically shown when followed by another category. */
  @property({ type: Boolean })
  accessor showDivider = false;

  /** Disable automatic divider detection (default: true for backwards compatibility).
   * When true, only shows divider if showDivider is explicitly set.
   * When false, dividers auto-detect based on sibling categories.
   */
  @property({ type: Boolean })
  accessor noAutoDivider = true;

  /** Indent links to align with heading text when icon is present.
   * Default: false for backwards compatibility.
   * Set to true when using icon slot and you want links to align with heading text.
   */
  @property({ type: Boolean })
  accessor indentLinks = false;

  /** @internal */
  @state()
  private accessor _hasIcon = false;

  /** @internal */
  @state()
  private accessor _hasNextCategorySibling = false;

  private _handleIconSlotChange(e: Event) {
    const slot = e.target as HTMLSlotElement;
    const assignedNodes = slot.assignedNodes({ flatten: true });
    this._hasIcon = assignedNodes.length > 0;
  }

  private _checkForNextCategorySibling() {
    // Check if there's a next sibling that's also a kyn-header-category
    let nextSibling = this.nextElementSibling;
    while (nextSibling) {
      if (nextSibling.tagName === 'KYN-HEADER-CATEGORY') {
        this._hasNextCategorySibling = true;
        return;
      }
      // Skip text nodes and comments, but stop if we hit another element type
      if (nextSibling.nodeType === Node.ELEMENT_NODE) {
        break;
      }
      nextSibling = nextSibling.nextElementSibling;
    }
    this._hasNextCategorySibling = false;
  }

  override connectedCallback() {
    super.connectedCallback();
    this._checkForNextCategorySibling();
  }

  override render() {
    // Indent links when explicitly requested via indentLinks prop (opt-in)
    const shouldIndentLinks = this.indentLinks;
    // Add heading padding when leftPadding is set AND there's no icon (for alignment with other categories that have icons)
    const indentHeading = this.leftPadding && !this._hasIcon;

    // Show divider if explicitly set, or if auto-detection finds a next category sibling
    const shouldShowDivider =
      this.showDivider || (!this.noAutoDivider && this._hasNextCategorySibling);

    // Hide heading when there's no text and no icon
    const hideHeading = !this.heading && !this._hasIcon;

    return html`
      <div class="category ${shouldShowDivider ? 'divider' : ''}">
        <div
          class="heading ${indentHeading ? 'left-padding' : ''} ${hideHeading
            ? 'empty'
            : ''}"
        >
          <slot name="icon" @slotchange=${this._handleIconSlotChange}></slot>
          ${this.heading}
        </div>
        <div class="category__links ${shouldIndentLinks ? 'left-padding' : ''}">
          <slot></slot>
        </div>
        <slot name="more"></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-header-category': HeaderCategory;
  }
}
