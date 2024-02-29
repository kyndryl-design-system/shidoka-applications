import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import HeaderNavScss from './headerNav.scss';

import menuIcon from '@carbon/icons/es/menu/24';

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
          <kd-icon .icon=${menuIcon}></kd-icon>
        </button>

        <div class="menu__content left">
          <slot></slot>
        </div>
      </div>
    `;
  }

  private _toggleMenuOpen() {
    this.menuOpen = !this.menuOpen;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-header-nav': HeaderNav;
  }
}
