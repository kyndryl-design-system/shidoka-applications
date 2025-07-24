import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import HeaderPanelLinkScss from './headerPanelLink.scss?inline';

/**
 * Header fly-out panel link.
 * @fires on-click - Captures the click event and emits the original event details. `detail:{ origEvent: Event }`
 * @slot unnamed - Slot for link text/content.
 */
@customElement('kyn-header-panel-link')
export class HeaderPanelLink extends LitElement {
  static override styles = unsafeCSS(HeaderPanelLinkScss);

  /** Link url. */
  @property({ type: String })
  accessor href = '';

  /** Defines a target attribute for where to load the URL. Possible options include "_self" (default), "_blank", "_parent", "_top" */
  @property({ type: String })
  accessor target = '_self' as const;

  /** Defines a relationship between a linked resource and the document. An empty string (default) means no particular relationship */
  @property({ type: String })
  accessor rel = '';

  override render() {
    return html`
      <a
        target=${this.target}
        rel=${this.rel}
        href=${this.href}
        @click=${(e: Event) => this.handleClick(e)}
      >
        <slot></slot>
      </a>
    `;
  }

  private handleClick(e: Event) {
    const event = new CustomEvent('on-click', {
      detail: { origEvent: e },
    });
    this.dispatchEvent(event);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-header-panel-link': HeaderPanelLink;
  }
}
