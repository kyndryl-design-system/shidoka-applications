import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { debounce } from '../../../common/helpers/helpers';
import HeaderScss from './header.scss';
import '../../reusable/icon';
import '../../reusable/button';
import menuIcon from '@carbon/icons/es/menu/24';

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

  /** App subtitle text. */
  @property({ type: String })
  appSubtitle = '';

  /** Use K logo instead of full Kyndryl logo. */
  @property({ type: Boolean })
  smallLogo = false;

  /** The breakpoint (in px) to convert to flyout menu for small screens. */
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
    return html`
      <header class="header">
        ${!this.breakpointHit
          ? html`
              <button
                class="menu-button interactive"
                @click=${() => this.toggleMenu()}
              >
                <kyn-icon .icon=${menuIcon}></kyn-icon>
              </button>
            `
          : null}

        <a
          href="${this.rootUrl}"
          class="logo-link interactive"
          @click="${(e: Event) => this.handleRootLinkClick(e)}"
        >
          <slot name="logo">
            ${this.smallLogo
              ? html`
                  <svg
                    class="logo-small"
                    xmlns="http://www.w3.org/2000/svg"
                    xml:space="preserve"
                    style="enable-background:new 0 0 512 512"
                    viewBox="0 0 512 512"
                  >
                    <title>Kyndryl</title>
                    <path
                      d="M130.7 249.9V21.4l49.1 1.1.4 146.9c.2 80.7.7 147.4 1 148.3.3.9 4.1-2.7 8.5-8 7.7-9.4 60.3-71.8 86.2-102 7.1-8.4 16.5-19.4 20.7-24.6l7.7-9.4h29.8c16.4 0 29.8.4 29.8.9 0 .8-25.4 30.4-28.5 33.1-.5.5-7.3 8.2-15 17-32 36.8-36.2 41.6-44.8 51-13.5 14.7-39.9 46-39.9 47.3 0 .6 10.6 1.3 23.5 1.6l23.5.5 23.8 34.9c13.1 19.2 31.5 46.2 40.8 59.8 9.4 13.8 22.2 32.5 28.4 41.7l11.4 16.5h-57.9L299 432.8c-16.6-24.9-39.4-59.3-50.5-76L228.2 326l-47.3-.1v152h-49.6l-.6-228z"
                      style="fill:#fb4425"
                    />
                  </svg>
                `
              : html`
                  <svg
                    class="logo"
                    viewBox="0 0 394 131"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <title>Kyndryl</title>
                    <path
                      d="M111-252c.092-.159.89-2.55 1.78-5.31 2.09-6.54 8.4-25.8 8.7-26.6.206-.541-.357-.614-4.77-.614h-5l-1.16-3.57c-1.27-3.92-7.29-22.8-9.72-30.4-.842-2.66-1.77-5.53-2.07-6.38-1.4-4.05-7.85-24.5-7.85-24.9 0-.312 1.57-.404 5.44-.318 5.42.12 5.44.123 5.73 1.09.161.531 1.16 3.75 2.22 7.15 1.06 3.4 3.33 10.7 5.04 16.2 1.71 5.53 3.52 11.4 4.03 12.9.508 1.59 2.32 7.42 4.03 12.9 4.28 13.9 4.27 13.8 4.61 13.5.167-.178.943-2.41 1.72-4.96.782-2.55 2.89-9.33 4.68-15.1 1.79-5.74 3.86-12.4 4.59-14.9s2.34-7.66 3.58-11.6c1.24-3.93 2.96-9.45 3.83-12.3l1.59-5.12h5.36c4.38 0 5.36.1 5.36.551 0 .303-1.28 4.52-2.85 9.37-1.56 4.85-4.17 13-5.79 18.1-1.62 5.1-3.18 9.97-3.47 10.8-.288.85-2.1 6.5-4.03 12.6-1.93 6.06-4.17 13.1-4.99 15.7l-3.45 10.8c-1.08 3.4-2.2 6.88-2.49 7.73-.287.85-1.33 4.11-2.32 7.25l-1.8 5.7h-5.36c-2.95 0-5.28-.13-5.19-.29zm252 .064c0-.292 9.53-29.4 10-30.6.791-1.94.698-1.98-4.51-2.1l-4.87-.108-3.03-9.47c-1.67-5.21-4.59-14.3-6.49-20.3-4.23-13.2-11.1-34.6-11.4-35.3-.136-.372 1.1-.483 5.41-.483 5.46 0 5.59.02 5.83.87.135.478.821 2.7 1.52 4.93 1.66 5.26 2.83 9.04 4.79 15.5.879 2.87 1.75 5.65 1.93 6.18.185.531 1.06 3.31 1.93 6.18.878 2.87 2.01 6.5 2.51 8.07.501 1.57 2.24 7.22 3.87 12.6 1.63 5.34 3.02 9.78 3.08 9.87.066.089.218.062.339-.06.189-.19 5.27-16.4 13.6-43.6 1.28-4.14 2.47-7.97 2.66-8.5.184-.53 1.06-3.31 1.94-6.18.884-2.87 1.8-5.35 2.04-5.5.528-.347 10.6-.394 10.6-.05 0 .297-3.85 12.6-5.39 17.1-.605 1.81-2.16 6.68-3.46 10.8-1.3 4.14-2.68 8.49-3.08 9.66-.394 1.17-2.29 7.08-4.22 13.1-1.93 6.06-4.17 13.1-4.99 15.7-2.66 8.32-4.89 15.3-7.54 23.7l-2.61 8.2-5.28.01c-2.9.005-5.28-.092-5.28-.216zm-116-31.7c-8.95-1.68-16.2-7.88-19.7-16.9-2.13-5.43-2.84-9.5-2.89-16.5-.042-6.63.39-9.77 2.06-15.1 2.34-7.38 7.39-13.6 13.4-16.6 4.43-2.18 7.39-2.87 12.3-2.87 7.14-.006 12.4 1.88 16.1 5.78 1.89 1.97 3.89 5.59 4.34 7.85 1.17 5.91 1.36 2.89 1.36-21.5v-23.8l10.4.112v98.5h-10.4v-7.54c0-4.67-.143-7.54-.377-7.54-.207 0-.479.478-.603 1.06-.504 2.37-1.45 5.01-2.34 6.54-3.98 6.84-13.8 10.3-23.7 8.44zm14.1-9.27c7.04-1.5 11.4-5.63 12.5-12 .52-2.86.548-21.6.036-24.8-.528-3.25-2.38-6.84-4.37-8.48-4.88-4.03-13.1-5.45-19.9-3.44-9.3 2.74-14.3 12.3-13.6 26.3.446 9.59 3.63 16.4 9.4 20.1 3.95 2.54 10.3 3.44 16 2.25zm-228-41v-49.3l10.6.241.09 31.7c.048 17.4.142 31.8.208 32 .066.2.89-.574 1.83-1.72 1.67-2.03 13-15.5 18.6-22 1.54-1.81 3.56-4.19 4.47-5.31l1.67-2.02 6.43-.007c3.54-.004 6.43.083 6.43.194 0 .17-5.49 6.56-6.14 7.14-.118.106-1.57 1.76-3.23 3.67-6.9 7.95-7.8 8.98-9.66 11-2.91 3.18-8.61 9.92-8.61 10.2 0 .126 2.29.277 5.08.336l5.08.108 5.14 7.54c2.82 4.14 6.79 9.97 8.8 12.9 2.02 2.98 4.78 7.02 6.13 8.99l2.46 3.57-12.5-.001-6.51-9.76c-3.58-5.37-8.51-12.8-10.9-16.4l-4.43-6.66-10.2-.021v32.8h-10.7zm128 16.8-.001-32.8c0-.159 2.33-.338 5.18-.397l5.18-.108v7.55c0 4.68.143 7.55.377 7.55.207 0 .474-.478.593-1.06 1.19-5.84 3.85-9.98 8.05-12.5 3.06-1.86 4.8-2.31 9.66-2.53 3.72-.165 5.24-.066 7.48.488 8.14 2.01 13.6 7.76 15.7 16.5.712 2.99.759 4.62.761 26.5l.003 23.3h-10.3l-.16-22.7c-.132-18.8-.26-23-.738-24.6-2.14-7.16-6.92-10.4-15.5-10.4-7.89-.026-12.5 2.91-14.8 9.44-.896 2.51-.897 2.53-1.02 25.4l-.12 22.9h-10.3zm138-.398v-32.9l10.2.216.192 7.25c.111 4.19.346 7.25.559 7.26.202.008.579-1.04.84-2.32 1.03-5.1 4.34-9.3 9.11-11.6 4.58-2.19 8.41-2.68 13.4-1.72l1.06.203v5.42c0 4.86-.065 5.4-.629 5.18-1.57-.606-8.09-.988-10.9-.637-4.49.571-6.77 1.47-9.05 3.57-2.29 2.1-3.41 4.37-4.01 8.07-.243 1.51-.402 10.8-.404 23.6l-.003 21.2h-10.4zm114-16.3.098-49.2h10.4l.195 98.4h-10.8z"
                      transform="translate(-32.1 383)"
                    ></path>
                  </svg>
                `}
          </slot>

          <span class="title">
            <span class="title__main">${this.appTitle} -</span>
            ${this.appSubtitle}
          </span>
        </a>

        <slot></slot>
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

  private testBreakpoint = () => {
    if (window.innerWidth >= this.breakpoint) {
      this.breakpointHit = true;
    } else {
      this.breakpointHit = false;
    }
  };

  private handleRootLinkClick(e: Event) {
    const event = new CustomEvent('on-root-link-click', {
      detail: { origEvent: e },
    });
    this.dispatchEvent(event);
  }

  private toggleMenu = () => {
    this.menuOpen = !this.menuOpen;

    const event = new CustomEvent('on-menu-toggle', {
      detail: this.menuOpen,
    });
    this.dispatchEvent(event);
  };
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-header': Header;
  }
}
