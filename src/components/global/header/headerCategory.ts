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

  /** Show bottom border/divider. */
  @property({ type: Boolean })
  accessor showDivider = false;

  /** @internal */
  @state()
  private accessor _hasIcon = false;

  private _handleIconSlotChange(e: Event) {
    const slot = e.target as HTMLSlotElement;
    const assignedNodes = slot.assignedNodes({ flatten: true });
    this._hasIcon = assignedNodes.length > 0;
  }

  override render() {
    // Indent links if there's an icon OR if leftPadding is explicitly set
    const indentLinks = this._hasIcon || this.leftPadding;
    // Only add heading padding if leftPadding is set AND there's no icon
    const indentHeading = this.leftPadding && !this._hasIcon;

    return html`
      <div class="category ${this.showDivider ? 'divider' : ''}">
        <div class="heading ${indentHeading ? 'left-padding' : ''}">
          <slot name="icon" @slotchange=${this._handleIconSlotChange}></slot>
          ${this.heading}
        </div>
        <div class="category__links ${indentLinks ? 'left-padding' : ''}">
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
