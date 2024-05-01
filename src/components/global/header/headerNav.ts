import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import HeaderNavScss from './headerNav.scss';

import menuIcon from '@carbon/icons/es/menu/24';
import closeIcon from '@carbon/icons/es/close/24';

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

  /** Timeout function to delay flyout open.
   * @internal
   */
  _enterTimer: any;

  /** Timeout function to delay flyout close.
   * @internal
   */
  @state()
  _leaveTimer: any;

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
          @pointerenter=${(e: PointerEvent) => this._handlePointerEnter(e)}
          @pointerleave=${(e: PointerEvent) => this._handlePointerLeave(e)}
        >
          ${this.menuOpen
            ? html` <kd-icon .icon=${closeIcon}></kd-icon> `
            : html` <kd-icon .icon=${menuIcon}></kd-icon> `}
        </button>

        <div
          class="menu__content left"
          @pointerenter=${(e: PointerEvent) => this._handlePointerEnter(e)}
          @pointerleave=${(e: PointerEvent) => this._handlePointerLeave(e)}
        >
          <slot></slot>
        </div>
      </div>
      <div class="overlay" @click=${this._handleOverlayClick}></div>
    `;
  }

  private _handlePointerEnter(e: PointerEvent) {
    if (e.pointerType === 'mouse') {
      clearTimeout(this._leaveTimer);

      this._enterTimer = setTimeout(() => {
        this.menuOpen = true;
      }, 150);
    }
  }

  private _handlePointerLeave(e: PointerEvent) {
    if (e.pointerType === 'mouse' && e.relatedTarget !== null) {
      clearTimeout(this._enterTimer);

      this._leaveTimer = setTimeout(() => {
        this.menuOpen = false;
      }, 150);
    }
  }

  private _toggleMenuOpen() {
    clearTimeout(this._enterTimer);
    clearTimeout(this._leaveTimer);
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
