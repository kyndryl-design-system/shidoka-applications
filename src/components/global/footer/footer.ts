import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import { debounce } from '../../../common/helpers/helpers';
import logo from '../../../assets/svg/bridge-logo-large.svg';
import FooterScss from './footer.scss';

@customElement('kyn-footer')
export class Footer extends LitElement {
  static override styles = FooterScss;

  @property({ type: Number })
  breakpoint = 672;
  
  /** URL for the footer logo link. Should target the application home page. */
  @property({ type: String })
  rootUrl = '/';
  
  @property({ type: Number})
  cprYear = '2023'

  /**
   * determines the screen breakpoint
   * @ignore
   */
  @state()
  breakpointHit = false;

  override render() {
    const classes = {
      footer: true,
      'breakpoint-hit': this.breakpointHit
    };

    return html`
    <footer class="${classMap(classes)}">
    <div class="footer-links"><slot></slot></div>
    <div class="footer-cpr">
        <a
          href="${this.rootUrl}"
          class="logo-link ${this.breakpointHit ? 'breakpoint-hit' : ''}"
          @click="${(e: Event) => this.handleRootLinkClick(e)}"
        >
          <slot name="logo"> ${unsafeHTML(logo)} </slot>
        </a>
        <span class="copyright ${this.breakpointHit ? 'breakpoint-hit' : ''}">
          Copyright &copy; ${this.cprYear} Kyndryl Inc. All rights reserved
        </span>
      </div>
    </footer>`
  }

  override connectedCallback() {
    super.connectedCallback();

    this.testBreakpoint();
    window?.addEventListener(
      'resize',
      debounce(() => {
        this.testBreakpoint();
      })
    );
  }

  override disconnectedCallback() {
    window?.removeEventListener(
      'resize',
      debounce(() => {
        this.testBreakpoint();
      })
    );

    super.disconnectedCallback();
  }

  private testBreakpoint() {
    if (window?.innerWidth <= this.breakpoint) {
      this.breakpointHit = true;
    } else {
      this.breakpointHit = false;
    }
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