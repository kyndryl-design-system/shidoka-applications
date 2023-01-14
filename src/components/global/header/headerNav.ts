import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import HeaderNavScss from './headerNav.scss';

/**
 * Container for header navigation links.
 * @slot unnamed - This element has a slot.
 */
@customElement('kyn-header-nav')
export class HeaderNav extends LitElement {
  static override styles = HeaderNavScss;

  override render() {
    return html` <div class="header-nav"><slot></slot></div> `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-header-nav': HeaderNav;
  }
}
