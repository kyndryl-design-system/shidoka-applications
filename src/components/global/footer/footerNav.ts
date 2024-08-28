import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import FooterNavScss from './footerNav.scss';

/**
 * DEPRECATED. Container for footer navigation links.
 * @slot unnamed - Slot for footer links.
 */
@customElement('kyn-footer-nav')
export class FooterNav extends LitElement {
  static override styles = FooterNavScss;

  override render() {
    return html`
      <div class="footer-nav">
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-footer-nav': FooterNav;
  }
}
