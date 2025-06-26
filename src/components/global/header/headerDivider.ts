import { LitElement, html, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import HeaderDividerScss from './headerDivider.scss?inline';

/**
 * Header divider
 */
@customElement('kyn-header-divider')
export class HeaderDivider extends LitElement {
  static override styles = unsafeCSS(HeaderDividerScss);

  override render() {
    return html` <hr /> `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-header-divider': HeaderDivider;
  }
}
