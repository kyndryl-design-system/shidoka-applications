import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { LitElement, html } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import SCSS from './overflowMenu.scss';
import overflowIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/overflow.svg';

/**
 * Overflow Menu.
 * @slot unnamed - Slot for overflow menu items.
 * @fires on-toggle - Capture the open/close event and emits the new state.
 */
@customElement('kyn-overflow-menu')
export class OverflowMenu extends LitElement {
  static override styles = SCSS;

  /** Menu open state. */
  @property({ type: Boolean })
  open = false;

  /** Anchors the menu to the right of the button. */
  @property({ type: Boolean })
  anchorRight = false;

  /** 3 dots vertical orientation. */
  @property({ type: Boolean })
  verticalDots = false;

  /** Use fixed instead of absolute position. Useful when placed within elements with overflow scroll. */
  @property({ type: Boolean })
  fixed = false;

  /** Button assistive text.. */
  @property({ type: String })
  assistiveText = 'Toggle Menu';

  /** Button element
   * @internal
   */
  @query('.btn')
  _btnEl!: any;

  /** Menu element
   * @internal
   */
  @query('.menu')
  _menuEl!: any;

  /**
   * Open drawer upwards.
   * @ignore
   */
  @state()
  _openUpwards = false;

  override render() {
    const buttonClasses = {
      btn: true,
      open: this.open,
      horizontal: !this.verticalDots,
    };

    const menuClasses = {
      menu: true,
      open: this.open,
      right: this.anchorRight,
      fixed: this.fixed,
      upwards: this._openUpwards,
    };

    return html`
      <div class="overflow-menu">
        <button
          class=${classMap(buttonClasses)}
          @click=${this.toggleMenu}
          aria-controls="menu"
          aria-expanded=${this.open}
          title=${this.assistiveText}
          aria-label=${this.assistiveText}
          @keydown=${(e: any) => this.handleKeyDown(e)}
        >
          <span>${unsafeSVG(overflowIcon)}</span>
        </button>

        <div id="menu" class=${classMap(menuClasses)}>
          <slot></slot>
        </div>
      </div>
    `;
  }

  private _emitToggleEvent() {
    const event = new CustomEvent('on-toggle', {
      detail: {
        open: this.open,
      },
    });
    this.dispatchEvent(event);
  }

  private toggleMenu() {
    this.open = !this.open;
    this._emitToggleEvent();
  }

  private _positionMenu() {
    if (this.open) {
      if (this.fixed) {
        const BtnBounds = this._btnEl.getBoundingClientRect();
        const Top = BtnBounds.top + BtnBounds.height;
        const MenuHeight =
          this.querySelectorAll('kyn-overflow-menu-item').length * 48;

        if (this._openUpwards) {
          this._menuEl.style.top = BtnBounds.top - MenuHeight - 18 + 'px';
          this._menuEl.style.bottom = 'initial';
        } else {
          this._menuEl.style.top = Top + 'px';
          this._menuEl.style.bottom = 'initial';
        }

        if (this.fixed) {
          if (this.anchorRight) {
            this._menuEl.style.left = 'initial';
            this._menuEl.style.right =
              window.innerWidth - BtnBounds.right + 'px';
          } else {
            this._menuEl.style.right = 'initial';
            this._menuEl.style.left = BtnBounds.left + 'px';
          }
        }
      } else {
        this._menuEl.style.top = 'initial';
      }
    }
  }

  override updated(changedProps: any) {
    if (changedProps.has('open')) {
      if (this.open) {
        // open dropdown upwards if closer to bottom of viewport
        if (
          this._btnEl.getBoundingClientRect().top >
          window.innerHeight * 0.6
        ) {
          this._openUpwards = true;
        } else {
          this._openUpwards = false;
        }
      }

      this._positionMenu();
    }
  }

  private handleClickOut(e: Event) {
    if (!e.composedPath().includes(this)) {
      this.open = false;
      this._emitToggleEvent();
    }
  }

  private handleEscapePress(e: any) {
    const ESCAPE_KEY_CODE = 27;
    if (e.keyCode === ESCAPE_KEY_CODE) {
      this.open = false;
      this._emitToggleEvent();
      this._btnEl.focus();
    }
  }

  private handleKeyDown(e: any) {
    const TAB_KEY_CODE = 9;
    const ENTER_KEY_CODE = 13;
    const SPACEBAR_KEY_CODE = 32;
    const DOWN_ARROW_KEY_CODE = 40;

    if (e.keyCode !== TAB_KEY_CODE) {
      e.preventDefault();
    }

    if (e.keyCode === ENTER_KEY_CODE || e.keyCode === SPACEBAR_KEY_CODE) {
      this.toggleMenu();
    }

    const menuItems: any = this.getMenuItems();

    if (menuItems.length > 0 && e.keyCode === DOWN_ARROW_KEY_CODE) {
      const firstItemIndex = menuItems.findIndex(
        (item: any) => !item.hasAttribute('disabled')
      );
      menuItems[firstItemIndex].shadowRoot?.querySelector('button')
        ? menuItems[firstItemIndex].shadowRoot?.querySelector('button')?.focus()
        : menuItems[firstItemIndex].shadowRoot?.querySelector('a')?.focus();
    }
  }

  getMenuItems() {
    return Array.from(
      this.querySelectorAll('kyn-overflow-menu-item') || []
    ).filter((item: any) => !item.hasAttribute('disabled'));
  }

  getMenu() {
    return this.shadowRoot?.querySelector('.overflow-menu');
  }

  override connectedCallback() {
    super.connectedCallback();

    document.addEventListener('click', (e) => this.handleClickOut(e));
    document.addEventListener('keydown', (e) => {
      this.handleEscapePress(e);
    });
  }

  override disconnectedCallback() {
    document.removeEventListener('click', (e) => this.handleClickOut(e));
    document.removeEventListener('keydown', (e) => {
      this.handleEscapePress(e);
    });

    super.disconnectedCallback();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-overflow-menu': OverflowMenu;
  }
}
