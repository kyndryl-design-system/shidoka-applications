import { LitElement, html, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import Styles from './headerCategories.scss?inline';

/**
 * Header categories wrapper for mega menu
 * @slot unnamed - Slot for header category elements.
 */
@customElement('kyn-header-categories')
export class HeaderCategories extends LitElement {
  static override styles = unsafeCSS(Styles);

  override render() {
    return html`
      <div class="header-categories">
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-header-categories': HeaderCategories;
  }
}
