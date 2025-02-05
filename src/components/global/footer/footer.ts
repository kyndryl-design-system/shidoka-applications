import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import logo from '@kyndryl-design-system/shidoka-foundation/assets/svg/kyndryl-logo.svg';
import FooterScss from './footer.scss';

/**
 * The global Footer component.
 * @fires on-root-link-click - Captures the logo link click event and emits the original event.
 * @slot unnamed - Default slot, for links.
 * @slot logo - Slot for the logo, will overwrite the default logo.
 * @slot copyright - Slot for the copyright text.
 */
@customElement('kyn-footer')
export class Footer extends LitElement {
  static override styles = FooterScss;

  /** URL for the footer logo link. Should target the application home page. */
  @property({ type: String })
  rootUrl = '/';

  /** Sets aria label attribute for logo link. */
  @property({ type: String })
  logoAriaLabel = '';

  override render() {
    const classes = {
      footer: true,
    };

    return html`
      <footer class="${classMap(classes)}">
        <div>
          <div class="footer-links"><slot></slot></div>
          <div class="copyright"><slot name="copyright"></slot></div>
        </div>

        <div class="logo-container">
          <a
            href="${this.rootUrl}"
            class="logo-link"
            @click="${(e: Event) => this.handleRootLinkClick(e)}"
            aria-label=${this.logoAriaLabel}
          >
            <slot name="logo">${unsafeHTML(logo)}</slot>
          </a>
        </div>
      </footer>
    `;
  }

  private handleRootLinkClick(e: Event) {
    const event = new CustomEvent('on-root-link-click', {
      detail: { origEvent: e },
    });
    this.dispatchEvent(event);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-footer': Footer;
  }
}
