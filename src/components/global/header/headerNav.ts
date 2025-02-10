import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import HeaderNavScss from './headerNav.scss';

import menuIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/24/hamburger-menu.svg';
import closeIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/24/close-simple.svg';

/**
 * Container for header navigation links.
 * @slot unnamed - This element has a slot.
 */
@customElement('kyn-header-nav')
export class HeaderNav extends LitElement {
  static override styles = HeaderNavScss;

  /** Small screen header nav visibility.
   * @ignore
   */
  @state()
  menuOpen = false;

  /** Force correct slot */
  @property({ type: String, reflect: true })
  override slot = 'left';

  override render() {
    const classes = {
      'header-nav': true,
      menu: true,
      open: this.menuOpen,
    };

    return html`
      <div class=${classMap(classes)}>
        <button
          class="btn interactive"
          aria-label="Toggle Menu"
          title="Toggle Menu"
          @click=${() => this._toggleMenuOpen()}
        >
          ${this.menuOpen
            ? html` <span>${unsafeSVG(closeIcon)}</span> `
            : html` <span>${unsafeSVG(menuIcon)}</span> `}
        </button>

        <div class="menu__content left">
          <slot></slot>
        </div>
      </div>
      <div class="overlay" @click=${this._handleOverlayClick}></div>
    `;
  }

  private _toggleMenuOpen() {
    this.menuOpen = !this.menuOpen;
  }

  private _handleClickOut(e: Event) {
    if (!e.composedPath().includes(this)) {
      this.menuOpen = false;
    }
  }

  private _handleOverlayClick() {
    this.menuOpen = false;
  }

  override willUpdate(changedProps: any) {
    if (changedProps.has('menuOpen')) {
      const event = new CustomEvent('on-nav-toggle', {
        composed: true,
        bubbles: true,
        detail: { open: this.menuOpen },
      });
      this.dispatchEvent(event);
    }
  }

  override connectedCallback() {
    super.connectedCallback();

    document.addEventListener('click', (e) => this._handleClickOut(e));
  }

  override disconnectedCallback() {
    document.removeEventListener('click', (e) => this._handleClickOut(e));

    super.disconnectedCallback();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-header-nav': HeaderNav;
  }
}
