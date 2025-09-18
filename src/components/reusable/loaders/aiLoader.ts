import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import Styles from './aiLoader.scss?inline';

type LoaderSize = 'default' | 'mini';

/**
 * AI Loader (pure CSS/SVG).
 */
@customElement('kyn-ai-loader')
export class AiLoader extends LitElement {
  static override styles = unsafeCSS(Styles);

  /** Size for AI loader */
  @property({ type: String })
  accessor size: LoaderSize = 'default';

  override render() {
    const Classes = {
      wrapper: true,
      'ai-connected': true,
      [`size-${this.size}`]: true,
    };

    return html`
      <div class="${classMap(Classes)}">
        <div
          class="ai-spinner-svg"
          role="status"
          aria-live="polite"
          aria-label="Loading"
        >
          <svg viewBox="0 0 100 100" class="ai-svg" aria-hidden="true">
            <circle class="ai-track" cx="50" cy="50" r="44" />
            <circle class="ai-arc" cx="50" cy="50" r="44" />
          </svg>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-ai-loader': AiLoader;
  }
}
