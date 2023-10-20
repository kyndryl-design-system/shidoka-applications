import { LitElement, html } from 'lit';
import {
  customElement,
  property,
  state,
  queryAssignedElements,
} from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import { debounce } from '../../../common/helpers/helpers';
import HeaderScss from './header.scss';
import '@kyndryl-design-system/shidoka-foundation/components/icon';
import logo from '@kyndryl-design-system/shidoka-foundation/assets/svg/kyndryl-logo.svg';
import overflowIcon from '@carbon/icons/es/overflow-menu--vertical/24';

/**
 * The global Header component.
 * @fires on-menu-toggle - Captures the menu toggle click event and emits the menu open state in the detail.
 * @fires on-root-link-click - Captures the logo link click event and emits the original event details.
 * @slot unnamed - The default slot for all empty space right of the logo/title.
 * @slot logo - Slot for the logo, will overwrite the default logo.
 * @slot left - Slot left of the logo, intended for a header panel.
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

  /** Adds a 1px shadow to the bottom of the header, for contrast with  white backgrounds. */
  @property({ type: Boolean })
  divider = false;

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

  /** Queries for slotted header-nav.
   * @internal
   */
  @queryAssignedElements({ selector: 'kyn-header-nav' })
  navEls!: any;

  /** Queries for all slotted elements.
   * @internal
   */
  @queryAssignedElements()
  assignedElements!: any;

  /** Queries for elements in left slot.
   * @internal
   */
  @queryAssignedElements({ slot: 'left' })
  leftEls!: any;

  override render() {
    const classes = {
      header: true,
      'breakpoint-hit': this.breakpointHit,
      divider: this.divider,
      'left-slotted': this.leftEls.length,
    };

    return html`
      <header class="${classMap(classes)}">
        <slot name="left"></slot>
        <a
          href="${this.rootUrl}"
          class="logo-link interactive"
          @click="${(e: Event) => this.handleRootLinkClick(e)}"
        >
          <slot name="logo"> ${unsafeHTML(logo)} </slot>

          <span class="title">${this.appTitle}</span>
        </a>

        <div class="header__right">
          <slot @slotchange=${this.handleSlotChange}></slot>

          ${!this.breakpointHit && this.navEls.length
            ? html`
                <div class="menu">
                  <button
                    class="menu-button interactive"
                    @click=${() => this.toggleNavMenu()}
                  >
                    <kd-icon .icon=${overflowIcon}></kd-icon>
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

  private handleSlotChange() {
    this.requestUpdate();
  }

  private testBreakpoint() {
    if (window?.innerWidth >= this.breakpoint) {
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
