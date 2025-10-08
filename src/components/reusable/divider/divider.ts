import { LitElement, html, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import DividerScss from './divider.scss?inline';

/**
 * Divider Component.
 */
@customElement('kyn-divider')
export class Divider extends LitElement {
  static override styles = unsafeCSS(DividerScss);

  override render() {
    return html` <div role="separator" class="divider vertical"></div> `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-divider': Divider;
  }
}
