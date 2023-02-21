import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import { debounce } from '../../../common/helpers/helpers';
import HeaderScss from './header.scss';
import '../../reusable/icon/icon';
import '../../reusable/button/button';
import './headerFlyout';
import logo from '../../../assets/svg/bridge-logo-large.svg';
import overflowIcon from '@carbon/icons/es/overflow-menu--vertical/24';

/**
 * The global Header component.
 * @fires on-menu-toggle - Captures the menu toggle click event and emits the menu open state in the detail.
 * @fires on-root-link-click - Captures the logo link click event and emits the original event details.
 * @slot unnamed - The default slot for all empty space right of the logo/title.
 */
@customElement('kyn-header')
export class Header extends LitElement {
  static override styles = HeaderScss;

  /** URL for the header logo link. Should target the application home page. */
  @property({ type: String })
  rootUrl = '/';

  /** App title text next to logo.  Hidden on smaller screens. */
  @property({ type: String })
  appTitle = '';

  /** The breakpoint (in px) to convert the nav to a flyout menu for small screens. */
  @property({ type: Number })
  breakpoint = 672;

  /**
   * Determines if menu should be a flyout or inline depending on screen size.
   * @ignore
   */
  @state()
  breakpointHit = false;

  /** Small screen header nav visibility.
   * @ignore
   */
  @state()
  menuOpen = false;

  override render() {
    const classes = {
      header: true,
      'breakpoint-hit': this.breakpointHit,
    };

    return html`
      <header class="${classMap(classes)}">
        <a
          href="${this.rootUrl}"
          class="logo-link interactive"
          @click="${(e: Event) => this.handleRootLinkClick(e)}"
        >
          <slot name="logo"> ${unsafeHTML(logo)} </slot>

          <span class="title">${this.appTitle}</span>
        </a>

        <div class="header__right">
          <slot></slot>

          ${!this.breakpointHit
            ? html`
                <div class="menu">
                  <button
                    class="menu-button interactive"
                    @click=${() => this.toggleNavMenu()}
                  >
                    <kyn-icon .icon=${overflowIcon}></kyn-icon>
                  </button>
                </div>
              `
            : null}
        </div>
      </header>
    `;
  }

  override connectedCallback() {
    super.connectedCallback();

    this.testBreakpoint();
    window.addEventListener(
      'resize',
      debounce(() => {
        this.testBreakpoint();
      })
    );
  }

  override disconnectedCallback() {
    window.removeEventListener(
      'resize',
      debounce(() => {
        this.testBreakpoint();
      })
    );

    super.disconnectedCallback();
  }

  private testBreakpoint() {
    if (window.innerWidth >= this.breakpoint) {
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

  private toggleNavMenu() {
    this.menuOpen = !this.menuOpen;

    const event = new CustomEvent('on-menu-toggle', {
      detail: this.menuOpen,
    });
    this.dispatchEvent(event);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-header': Header;
  }
}
