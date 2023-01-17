import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
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

    document
      .querySelector('kyn-header')!
      .addEventListener('on-menu-toggle', (e: any = {}) => {
        this.menuOpen = e.detail;
      });
  }

  private testBreakpoint = () => {
    const nav = document.querySelector('kyn-header');
    this.breakpointHit = nav!.breakpointHit;
  };
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-header-nav': HeaderNav;
  }
}
