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

  /** Accessible label for screen readers. */
  @property({ type: String })
  override accessor ariaLabel: string = 'Loading AI results';

  override render() {
    return html`
      <kyn-spinner
        variant="ai"
        .size=${this.size}
        role="status"
        aria-label=${this.ariaLabel}
      ></kyn-spinner>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-ai-loader': AiLoaderWrapper;
  }
}
