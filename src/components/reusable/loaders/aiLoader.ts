import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import './spinner';

/**
 * AI Loader (pure CSS/SVG).
 */
@customElement('kyn-ai-loader')
export class AiLoaderWrapper extends LitElement {
  /** Size for AI loader. */
  @property({ type: String })
  accessor size: 'default' | 'mini' = 'default';

  override render() {
    return html`<kyn-spinner variant="ai" .size=${this.size}></kyn-spinner>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-ai-loader': AiLoaderWrapper;
  }
}
