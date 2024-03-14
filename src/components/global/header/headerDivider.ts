import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import HeaderDividerScss from './headerDivider.scss';

/**
 * Header divider
 */
@customElement('kyn-header-divider')
export class HeaderDivider extends LitElement {
  static override styles = HeaderDividerScss;

  override render() {
    return html` <hr /> `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-header-divider': HeaderDivider;
  }
}
