import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import HeaderCategoryScss from './headerCategory.scss?inline';

/**
 * Header link category
 * @slot unnamed - Slot for links.
 * @slot icon - Slot for icon.
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

  override render() {
    return html`
      <div class="category ${this.showDivider ? 'divider' : ''}"">
        <div
          class="heading ${this.leftPadding ? 'left-padding' : ''}
        >
          <slot name="icon"></slot>
          ${this.heading}
        </div>
        <div class="category__links">
          <slot></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-header-category': HeaderCategory;
  }
}
