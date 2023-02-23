import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { querySelectorDeep } from 'query-selector-shadow-dom';
import { debounce } from '../../../common/helpers/helpers';
import HeaderNavScss from './headerNav.scss';

/**
 * Container for header navigation links.
 * @slot unnamed - This element has a slot.
 */
@customElement('kyn-header-nav')
export class HeaderNav extends LitElement {
  static override styles = HeaderNavScss;

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
      'header-nav': true,
      'header-nav--inline': this.breakpointHit,
      'header-nav--flyout': !this.breakpointHit,
      'header-nav--open': this.menuOpen,
      'breakpoint-hit': this.breakpointHit,
    };

    return html` <div class=${classMap(classes)}><slot></slot></div> `;
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

    const header = querySelectorDeep('kyn-header');
    if (header) {
      header.addEventListener('on-menu-toggle', (e: any = {}) => {
        this.menuOpen = e.detail;
      });
    }
  }

  override disconnectedCallback() {
    const header = querySelectorDeep('kyn-header');
    if (header) {
      header.addEventListener('on-menu-toggle', (e: any = {}) => {
        this.menuOpen = e.detail;
      });
    }

    window.removeEventListener(
      'resize',
      debounce(() => {
        this.testBreakpoint();
      })
    );

    super.disconnectedCallback();
  }

  private testBreakpoint() {
    const nav = querySelectorDeep('kyn-header');
    if (nav) {
      this.breakpointHit = nav!.breakpointHit;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-header-nav': HeaderNav;
  }
}
