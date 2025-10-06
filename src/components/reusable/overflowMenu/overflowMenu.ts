import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

import './overflowMenuItem';

import SCSS from './overflowMenu.scss?inline';

import overflowIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/overflow.svg';
import backIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/arrow-left.svg';

/**
 * Overflow Menu.
 * @slot unnamed - Slot for overflow menu items.
 * @fires on-toggle - Capture the open/close event and emits the new state.`detail:{ open: boolean }`
 * @prop {'ai'|'default'|string} kind
 */
@customElement('kyn-overflow-menu')
export class OverflowMenu extends LitElement {
  static override styles = unsafeCSS(SCSS);

  /** Menu open state. */
  @property({ type: Boolean })
  accessor open = false;

  /** Menu kind.
   *  @prop {'ai'|'default'|string} kind
   **/
  @property({ type: String })
  accessor kind: 'ai' | 'default' | (string & {}) = 'default';

  /** Anchors the menu to the right of the button. */
  @property({ type: Boolean })
  accessor anchorRight = false;

  /** Text displayed in nested menu back button. */
  @property({ type: String })
  accessor backButtonText = '';

  /** 3 dots vertical orientation. */
  @property({ type: Boolean })
  accessor verticalDots = false;

  /** Use fixed instead of absolute position. Useful when placed within elements with overflow scroll. */
  @property({ type: Boolean })
  accessor fixed = false;

  /** Button assistive text.. */
  @property({ type: String })
  accessor assistiveText = 'Toggle Menu';

  /** Button element
   * @internal
   */
  @query('.btn')
  accessor _btnEl!: any;

  /** Menu element
   * @internal
   */
  @query('.menu')
  accessor _menuEl!: any;

  /**
   * Open drawer upwards.
   * @ignore
   */
  @state()
  accessor _openUpwards = false;

  /**
   * History of previous menus for back navigation.
   * Each entry is either 'root' (slot) or a string of HTML for a submenu.
   * @ignore
   */
  @state()
  accessor _menuHistory: string[] = [];

  /**
   * Current submenu HTML when viewing a submenu. Null when viewing root slot.
   * @ignore
   */
  @state()
  accessor _currentMenuHtml: string | null = null;

  private _onDocClick = (e: Event) => this.handleClickOut(e);
  private _onDocKeydown = (e: KeyboardEvent) => this.handleEscapePress(e);
  private _onItemClick = () => {
    this.open = false;
    this._menuHistory = [];
    this._currentMenuHtml = null;
    this._emitToggleEvent();
    this._btnEl?.focus();
  };

  private _onOpenSubmenu = (e: Event) =>
    this.handleOpenSubmenu(e as CustomEvent);

  override render() {
    const buttonClasses = {
      btn: true,
      open: this.open,
      horizontal: !this.verticalDots,
      'ai-connected': this.kind === 'ai',
    };

    const menuClasses = {
      menu: true,
      open: this.open,
      right: this.anchorRight,
      fixed: this.fixed,
      upwards: this._openUpwards,
      'ai-connected': this.kind === 'ai',
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
          ${this._menuHistory.length > 0
            ? html`
                <kyn-overflow-menu-item
                  .kind=${this.kind}
                  class="menu-item-inner-el submenu-back-item"
                  @on-click=${(e: Event) => {
                    e.stopPropagation();
                    this.goBack();
                  }}
                >
                  <span class="back-button-icon">${unsafeSVG(backIcon)}</span>
                  <span class="back-button-txt">${this.backButtonText}</span>
                </kyn-overflow-menu-item>
                <div class="submenu-contents">
                  ${unsafeHTML(this._currentMenuHtml || '')}
                </div>
              `
            : html`<slot></slot>`}
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

  override updated(changedProps: Map<string, unknown>) {
    if (changedProps.has('kind')) {
      this.dispatchEvent(
        new CustomEvent('kind-changed', {
          detail: this.kind,
          bubbles: true,
          composed: true,
        })
      );
    }

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
      } else {
        this._menuHistory = [];
        this._currentMenuHtml = null;
        this._openUpwards = false;
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

    document.addEventListener('click', this._onDocClick);
    document.addEventListener('keydown', this._onDocKeydown);
    this.addEventListener('on-click', this._onItemClick);
    this.addEventListener('open-submenu', this._onOpenSubmenu);
  }

  override disconnectedCallback() {
    document.removeEventListener('click', this._onDocClick);
    document.removeEventListener('keydown', this._onDocKeydown);
    this.removeEventListener('on-click', this._onItemClick);
    this.removeEventListener('open-submenu', this._onOpenSubmenu);

    super.disconnectedCallback();
  }

  private handleOpenSubmenu(e: CustomEvent) {
    e.stopPropagation();
    const submenuHtml = (e.detail && e.detail.html) || '';

    if (this._currentMenuHtml === null) {
      this._menuHistory = [...this._menuHistory, 'root'];
    } else {
      this._menuHistory = [...this._menuHistory, this._currentMenuHtml];
    }

    this._currentMenuHtml = submenuHtml;

    requestAnimationFrame(() => {
      const contents = this._menuEl?.querySelector('.submenu-contents');
      const items = contents
        ? Array.from(contents.querySelectorAll('kyn-overflow-menu-item'))
        : [];

      items.forEach((it: any) => {
        try {
          it.kind = this.kind;
        } catch (err) {
          /* no op */
        }
      });

      if (
        typeof (customElements as any) !== 'undefined' &&
        (customElements as any).whenDefined
      ) {
        (customElements as any)
          .whenDefined('kyn-overflow-menu-item')
          .then(() => {
            setTimeout(() => {
              const upgradedItems = contents
                ? Array.from(
                    contents.querySelectorAll('kyn-overflow-menu-item')
                  )
                : [];
              upgradedItems.forEach((it: any) => {
                try {
                  it.kind = this.kind;
                } catch (err) {
                  /* no op */
                }
              });
            }, 0);
          })
          .catch(() => {
            /* no op */
          });
      }
      this._menuEl?.querySelector('button, a')?.focus();
    });
  }

  private goBack() {
    const last = this._menuHistory.pop();

    this._menuHistory = [...this._menuHistory];
    if (last === 'root') {
      this._currentMenuHtml = null;

      requestAnimationFrame(() => {
        const menuItems: any = this.getMenuItems();

        menuItems.forEach((it: any) => {
          try {
            it.kind = this.kind;
          } catch (err) {
            /* no op */
          }
        });

        if (menuItems.length > 0) {
          menuItems[0].shadowRoot?.querySelector('button')
            ? menuItems[0].shadowRoot?.querySelector('button')?.focus()
            : menuItems[0].shadowRoot?.querySelector('a')?.focus();
        } else {
          this._btnEl?.focus();
        }
      });
    } else {
      this._currentMenuHtml = last || null;
      requestAnimationFrame(() => {
        const contents = this._menuEl?.querySelector('.submenu-contents');
        const items = contents
          ? Array.from(contents.querySelectorAll('kyn-overflow-menu-item'))
          : [];

        items.forEach((it: any) => {
          try {
            it.kind = this.kind;
          } catch (err) {
            /* no op */
          }
        });

        if (
          typeof (customElements as any) !== 'undefined' &&
          (customElements as any).whenDefined
        ) {
          (customElements as any)
            .whenDefined('kyn-overflow-menu-item')
            .then(() => {
              setTimeout(() => {
                const upgradedItems = contents
                  ? Array.from(
                      contents.querySelectorAll('kyn-overflow-menu-item')
                    )
                  : [];
                upgradedItems.forEach((it: any) => {
                  try {
                    it.kind = this.kind;
                  } catch (err) {
                    /* no op */
                  }
                });
              }, 0);
            })
            .catch(() => {
              /* no op */
            });
        }

        this._menuEl?.querySelector('button, a')?.focus();
      });
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-overflow-menu': OverflowMenu;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-overflow-menu': OverflowMenu;
  }
}
