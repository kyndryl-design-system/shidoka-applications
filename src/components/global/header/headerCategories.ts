import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import Styles from './headerCategories.scss?inline';

export interface HeaderCategoryLinkType {
  label: string;
}

export interface HeaderCategoryType {
  id: string;
  heading: string;
  links: HeaderCategoryLinkType[];
}

/**
 * Header categories wrapper for mega menu
 * @slot unnamed - Slot for header category elements.
 */
@customElement('kyn-header-categories')
export class HeaderCategories extends LitElement {
  static override styles = unsafeCSS(Styles);

  /**
   * Visual mode for mega menu categories.
   * Used for styling differences between root and detail views.
   */
  @property({ type: String, reflect: true })
  accessor view: 'root' | 'detail' = 'root';

  override render() {
    return html`
      <div class="header-categories" data-view=${this.view}>
        <div class="header-categories__inner">
          <slot></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-header-categories': HeaderCategories;
  }
}
