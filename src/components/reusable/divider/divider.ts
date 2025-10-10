import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import DividerScss from './divider.scss?inline';

/**
 * Divider Component.
 */
@customElement('kyn-divider')
export class Divider extends LitElement {
  static override styles = unsafeCSS(DividerScss);

  /** Vertical orientation. <br><i>Note:</i> Vertical divider will span the full height of its container. */
  @property({ type: Boolean, reflect: true })
  accessor vertical = false;

  override render() {
    return html`
      <div
        role="separator"
        class="divider ${this.vertical ? 'vertical' : 'horizontal'}"
      ></div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-divider': Divider;
  }
}
