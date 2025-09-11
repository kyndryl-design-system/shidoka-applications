import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { resolveParentWidth } from '../../../common/helpers/overflowMenu.utils';

import './overflowMenuItem';
import './overflowSubMenu';

import SCSS from './overflowMenu.scss?inline';
import overflowIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/overflow.svg';
import arrowLeft from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/arrow-left.svg';

const _defaultTextStrings = { backButtonAriaLabel: 'Back to parent menu' };

/**
 * Overflow Menu.
 * @slot unnamed - Slot for overflow menu items.
 * @fires on-toggle - Capture the open/close event and emits the new state.`detail:{ open: boolean }`
 */
@customElement('kyn-overflow-menu')
export class OverflowMenu extends LitElement {
  static override styles = unsafeCSS(SCSS);

  /** Menu open state. */
  @property({ type: Boolean })
  accessor open = false;

  /** Menu kind. */
  @property({ type: String })
  accessor kind: 'ai' | 'default' = 'default';

  /** Anchors the menu to the right of the button. */
  @property({ type: Boolean, reflect: true })
  accessor anchorRight = false;

  /** 3 dots vertical orientation. */
  @property({ type: Boolean })
  accessor verticalDots = false;

  /** Text for the mobile nested back button. */
  @property({ type: String })
  accessor backButtonText = 'Back';

  /** Use fixed instead of absolute position. Useful when placed within elements with overflow scroll. */
  @property({ type: Boolean })
  accessor fixed = false;

  /** Button assistive text.. */
  @property({ type: String })
  accessor assistiveText = 'Toggle Menu';

  /** Internal text strings.
   * @internal
   */
  @state()
  private accessor _textStrings = _defaultTextStrings;

  /** Button element
   * @internal
   */
  @query('.btn')
  accessor _btnEl!: HTMLButtonElement;

  /** Menu element
   * @internal
   */
  @query('.menu')
  accessor _menuEl!: HTMLDivElement;

  /**
   * Open drawer upwards.
   * @ignore
   */
  @state()
  accessor _openUpwards = false;

  /**
   * Explicit nested width.
   * - number/'px'/'rem'/'%'/... => fixed width (e.g., '280', '22rem', '60%')
   * - 'match-parent' => mirror the parent menu's *computed* pixel width
   * - 'auto'/null => intrinsic/content width (or CSS var fallback)
   */
  @property({ type: String, reflect: true })
  accessor nestedWidth: string | null = 'match-parent';

  /** Explicit parent width. Examples: 280, '280px', '22rem', 'auto'. */
  @property({ type: String, reflect: true })
  accessor width: string | null = null;

  /** Aligns submenu left or right relative to parent menu.
   * @internal
   */
  @state()
  accessor _submenuAlign: 'left' | 'right' = 'right';

  /** Whether the submenu is overlayed (detached, mobile) from parent menu.
   * @internal
   */
  @state()
  accessor _submenuOverlay = false;

  /** Whether the mobile nested menu is open.
   * @internal
   */
  @state()
  accessor _mobileNestedOpen = false;

  @query('kyn-overflow-submenu') private accessor _desktop!: any;

  private _onDocClick = (e: Event) => this.handleClickOut(e);
  private _onDocKeydown = (e: KeyboardEvent) => this.handleEscapePress(e);

  // mobile-only
  private _suppressDocClick = false;
  private _submenuRenderer: (() => unknown) | null = null;
  private _mobileStack: Array<{
    renderer: () => unknown;
    anchor: HTMLElement;
  }> = [];

  override render() {
    const buttonClasses = {
      btn: true,
      open: this.open,
      horizontal: !this.verticalDots,
      ['ai-connected']: this.kind === 'ai',
    };

    const menuClasses = {
      menu: true,
      open: this.open,
      fixed: this.fixed,
      upwards: this._openUpwards,
      ['ai-connected']: this.kind === 'ai',
      [`submenu-${this._submenuAlign}`]: true,
      overlay: this._submenuOverlay,
      'nested-mobile': this._mobileNestedOpen,
    };

    return html`
      <div class="overflow-menu">
        <button
          class=${classMap(buttonClasses)}
          @click=${this.toggleMenu}
          aria-expanded=${this.open}
          aria-haspopup="menu"
          title=${this.assistiveText}
          aria-label=${this.assistiveText}
          @keydown=${(e: KeyboardEvent) => this.handleKeyDown(e)}
        >
          <span>${unsafeSVG(overflowIcon)}</span>
        </button>

        <div class=${classMap(menuClasses)} role="menu">
          <div class="menu-main" ?hidden=${this._mobileNestedOpen}>
            <slot></slot>
          </div>

          <div
            class="nested-mobile-container"
            ?hidden=${!this._mobileNestedOpen}
          >
            <kyn-overflow-menu-item
              class="nested-back-btn"
              aria-label=${this._textStrings.backButtonAriaLabel}
              style="border-bottom:1px solid var(--kd-color-border-card-default);"
              @click=${this._onBackFromMobileSubmenu}
            >
              <span style="margin-right:4px;vertical-align:text-top">
                ${unsafeSVG(arrowLeft)}
              </span>
              ${this.backButtonText}
            </kyn-overflow-menu-item>

            <div class="nested-mobile-content">
              ${this._submenuRenderer ? this._submenuRenderer() : null}
            </div>
          </div>

          <kyn-overflow-submenu
            .container=${this.shadowRoot?.querySelector(
              '.overflow-menu'
            ) as HTMLElement | null}
            .anchorRight=${this.anchorRight}
            .nestedWidth=${this.nestedWidth}
            .kind=${this.kind}
          ></kyn-overflow-submenu>
        </div>
      </div>
    `;
  }

  override firstUpdated() {
    const container = this.shadowRoot?.querySelector(
      '.overflow-menu'
    ) as HTMLElement | null;
    if (this._desktop && container) this._desktop.container = container;
  }

  private _emitToggleEvent() {
    this.dispatchEvent(
      new CustomEvent('on-toggle', { detail: { open: this.open } })
    );
  }

  private _onViewportChange = () => {
    this._positionMenu();
    this._desktop?.reposition?.();
  };

  private _openSubmenuForItem(host: HTMLElement) {
    // Desktop
    if (window.innerWidth >= 767) {
      const provided =
        (host.querySelector('[slot="submenu"]') as
          | HTMLElement
          | HTMLTemplateElement
          | null) ?? null;
      if (!provided || !this._desktop) return;
      this._desktop.container =
        this.shadowRoot?.querySelector('.overflow-menu');
      this._desktop.openFor(host, provided);
      return;
    }

    // Mobile
    const provided =
      (host.querySelector('[slot="submenu"]') as
        | HTMLElement
        | HTMLTemplateElement
        | null) ?? null;
    if (!provided) return;
    const renderer = () =>
      provided instanceof HTMLTemplateElement
        ? provided.content.cloneNode(true)
        : Array.from(provided.childNodes).map((n) => n.cloneNode(true));
    this._mobileNestedOpen = true;
    this._mobileStack.push({ renderer, anchor: host });
    this._submenuRenderer = renderer;
    host.setAttribute('aria-expanded', 'true');

    const content = this.shadowRoot?.querySelector(
      '.nested-mobile-content'
    ) as HTMLElement | null;
    if (content && !content.dataset.bound) {
      content.dataset.bound = '1';
      content.addEventListener(
        'click',
        (evt) => {
          const t = (evt.composedPath?.() ?? []).find(
            (n) =>
              n instanceof HTMLElement &&
              n.tagName.toLowerCase() === 'kyn-overflow-menu-item'
          ) as HTMLElement | undefined;
          if (!t || !t.hasAttribute('nested')) return;
          evt.preventDefault();
          evt.stopPropagation();
          this._openSubmenuForItem(t);
        },
        { capture: true }
      );
    }
  }

  private _onBackFromMobileSubmenu = (ev: Event) => {
    this._suppressDocClick = true;
    requestAnimationFrame(() => (this._suppressDocClick = false));

    const popped = this._mobileStack.pop();
    if (popped?.anchor) popped.anchor.removeAttribute('aria-expanded');

    if (this._mobileStack.length === 0) {
      this._mobileNestedOpen = false;
      this._submenuRenderer = null;
      this.open = true;
      this._emitToggleEvent();
      (
        this._firstFocusableIn(
          this._menuEl.querySelector('.menu-main') as HTMLElement
        ) ?? this._btnEl
      )?.focus();
    } else {
      const top = this._mobileStack[this._mobileStack.length - 1];
      this._submenuRenderer = top.renderer;
      top.anchor.setAttribute('aria-expanded', 'true');
    }

    ev.stopPropagation();
    ev.preventDefault();
  };

  private toggleMenu() {
    this.open = !this.open;
    this._emitToggleEvent();
  }

  private _positionMenu() {
    if (!this.open) return;
    this._applyParentWidth();

    if (this.fixed) {
      const btnBounds = this._btnEl.getBoundingClientRect();
      const menuRect = this._menuEl.getBoundingClientRect();

      if (this._openUpwards) {
        this._menuEl.style.top = `${btnBounds.top - menuRect.height - 18}px`;
        this._menuEl.style.bottom = 'initial';
      } else {
        this._menuEl.style.top = `${btnBounds.bottom}px`;
        this._menuEl.style.bottom = 'initial';
      }

      if (this.anchorRight) {
        this._menuEl.style.left = 'initial';
        this._menuEl.style.right = window.innerWidth - btnBounds.right + 'px';
      } else {
        this._menuEl.style.right = 'initial';
        this._menuEl.style.left = `${btnBounds.left}px`;
      }
    } else {
      this._menuEl.style.top = 'initial';
    }
  }

  private _applyParentWidth() {
    const w = resolveParentWidth(this, this.width);
    if (w) this._menuEl.style.width = w;
    else this._menuEl.style.removeProperty('width');
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
    if (changedProps.has('width') || changedProps.has('nestedWidth')) {
      if (this.open) {
        this._applyParentWidth();
        this._desktop?.reposition?.();
      }
    }
    if (changedProps.has('open')) {
      if (this.open) {
        this._openUpwards =
          this._btnEl.getBoundingClientRect().top > window.innerHeight * 0.6;
        this._applyParentWidth();
      } else {
        this._closeSubmenu();
      }
      this._positionMenu();
      this._desktop?.reposition?.();
    }
  }

  private handleClickOut(e: Event) {
    if (this._suppressDocClick) {
      this._suppressDocClick = false;
      return;
    }
    const path = e.composedPath() as EventTarget[];

    const clickedOutsideThis = !path.includes(this);
    const clickedInsideDesktop = path.some(
      (n) => n instanceof Node && this._desktop?.containsNode?.(n)
    );
    const mobileContainer = this.shadowRoot?.querySelector(
      '.nested-mobile-container'
    ) as HTMLElement | null;
    const clickedInsideMobile =
      !!mobileContainer &&
      path.some((n) => n instanceof Node && mobileContainer.contains(n));

    if (clickedOutsideThis && !clickedInsideDesktop && !clickedInsideMobile) {
      this.open = false;
      this._emitToggleEvent();
      this._closeSubmenu();
    }
  }

  private handleEscapePress(e: KeyboardEvent) {
    if (e.key !== 'Escape' && e.key !== 'ArrowLeft') return;

    const active = (this.getRootNode() as Document | ShadowRoot)
      .activeElement as Node | null;
    const focusInDesktop = this._desktop?.containsNode?.(active ?? null);
    const mobileContainer = this.shadowRoot?.querySelector(
      '.nested-mobile-container'
    ) as HTMLElement | null;
    const focusInMobile =
      !!mobileContainer && !!active && mobileContainer.contains(active);

    if (focusInDesktop || e.key === 'ArrowLeft') {
      this._desktop?.closeDeepest?.();
      const anchor = this._desktop?.topAnchor?.() ?? this._btnEl;
      anchor?.focus?.();
      return;
    }

    if (focusInMobile && this._mobileStack.length > 0) {
      this._onBackFromMobileSubmenu(new Event('click'));
      return;
    }

    if (!this.open) return;
    this.open = false;
    this._emitToggleEvent();
    this._btnEl.focus();
  }

  private handleKeyDown(e: KeyboardEvent) {
    const k = e.key;
    if (k !== 'Enter' && k !== ' ' && k !== 'ArrowDown' && k !== 'ArrowUp')
      return;

    e.preventDefault();
    e.stopPropagation();

    const focusFirst = () =>
      this._firstFocusableIn(this._menuEl as HTMLElement)?.focus();
    const focusLast = () => {
      const items = this._getFocusableItems(this._menuEl);
      items[items.length - 1]?.focus();
    };

    if (k === 'Enter' || k === ' ') {
      this.toggleMenu();
      if (this.open) requestAnimationFrame(focusFirst);
      return;
    }

    if (!this.open) {
      this.open = true;
      this._emitToggleEvent();
      requestAnimationFrame(k === 'ArrowUp' ? focusLast : focusFirst);
    } else {
      (k === 'ArrowUp' ? focusLast : focusFirst)();
    }
  }

  private _onAnyMenuItemSelected = () => {
    this.open = false;
    this._emitToggleEvent();
    this._closeSubmenu();
    this._btnEl?.focus();
  };

  private _onOverflowItemEvent = (
    e: CustomEvent<{ nested?: boolean; host?: HTMLElement; origEvent?: Event }>
  ) => {
    const { nested, host } = e.detail || {};
    if (!host) return;

    if (nested || host.querySelector('[slot="submenu"]')) {
      e.stopPropagation();
      e.preventDefault?.();
      this._openSubmenuForItem(host);
      return;
    }

    this._onAnyMenuItemSelected();
  };

  private _getFocusableItems(container: HTMLElement | null): HTMLElement[] {
    const scope: ParentNode =
      container ??
      (this.closest('.menu') as HTMLElement | null) ??
      ((this.getRootNode() as Document | ShadowRoot) || document);

    const node: ParentNode =
      scope instanceof ShadowRoot
        ? (scope.host.getRootNode() as Document | ShadowRoot) || document
        : scope;

    const hosts = Array.from(
      (node as Document | Element).querySelectorAll?.(
        'kyn-overflow-menu-item'
      ) ?? []
    ) as HTMLElement[];

    const inScope = (
      container ? hosts.filter((el) => container.contains(el)) : hosts
    ).filter((el) => !el.closest('[slot="submenu"]'));

    const enabled = inScope.filter((el) => !el.hasAttribute('disabled'));

    return enabled
      .map(
        (el) =>
          (el.shadowRoot?.querySelector('button, a') as HTMLElement | null) ??
          (el.querySelector('button, a') as HTMLElement | null) ??
          el
      )
      .filter((el): el is HTMLElement => !!el);
  }

  getMenuItems(): HTMLElement[] {
    return Array.from(
      this.querySelectorAll<HTMLElement>('kyn-overflow-menu-item') || []
    ).filter((item) => !item.hasAttribute('disabled'));
  }

  getMenu() {
    return this.shadowRoot?.querySelector('.overflow-menu');
  }

  private _onMenuClickCapture = (e: MouseEvent) => {
    const path = e.composedPath() as Array<EventTarget>;
    const inDesktop = path.some((n) =>
      this._desktop?.containsNode?.(n as Node)
    );
    if (inDesktop) return;

    if (this._suppressDocClick) {
      e.stopPropagation();
      e.preventDefault();
      return;
    }

    const host = path.find(
      (n) =>
        n instanceof HTMLElement &&
        n.tagName.toLowerCase() === 'kyn-overflow-menu-item'
    ) as HTMLElement | undefined;
    if (!host) return;

    const isNested =
      host.hasAttribute('nested') || !!host.querySelector('[slot="submenu"]');

    if (isNested) {
      e.preventDefault();
      e.stopPropagation();
      this._suppressDocClick = true;
      requestAnimationFrame(() => (this._suppressDocClick = false));
      this._openSubmenuForItem(host);
      return;
    }

    e.stopPropagation();
    this._onAnyMenuItemSelected();
  };

  private _onSubmenuItemSelected = () => {
    this.open = false;
    this._emitToggleEvent();
    this._closeSubmenu();
    this._btnEl?.focus();
  };

  override connectedCallback() {
    super.connectedCallback();
    document.addEventListener('click', this._onDocClick as EventListener);
    document.addEventListener('keydown', this._onDocKeydown as EventListener);

    this.addEventListener('click', this._onMenuClickCapture, true);
    this.addEventListener(
      'on-click',
      this._onOverflowItemEvent as EventListener
    );

    // use a named handler so we can remove it later
    this.addEventListener(
      'submenu-menu-item-selected',
      this._onSubmenuItemSelected as EventListener
    );

    window.addEventListener('resize', this._onViewportChange, {
      passive: true,
    });
    window.addEventListener('scroll', this._onViewportChange, {
      capture: true,
      passive: true,
    });
  }

  override disconnectedCallback() {
    document.removeEventListener('click', this._onDocClick as EventListener);
    document.removeEventListener(
      'keydown',
      this._onDocKeydown as EventListener
    );

    this.removeEventListener('click', this._onMenuClickCapture, true);
    this.removeEventListener(
      'on-click',
      this._onOverflowItemEvent as EventListener
    );
    this.removeEventListener(
      'submenu-menu-item-selected',
      this._onSubmenuItemSelected as EventListener
    );

    window.removeEventListener('resize', this._onViewportChange);
    window.removeEventListener('scroll', this._onViewportChange, true);

    super.disconnectedCallback();
  }

  private _closeSubmenu() {
    this._desktop?.closeAll?.();
    for (const lvl of this._mobileStack)
      lvl.anchor.removeAttribute('aria-expanded');
    this._mobileStack = [];
    this._mobileNestedOpen = false;
    this._submenuRenderer = null;
  }

  private _firstFocusableIn(container: HTMLElement): HTMLElement | null {
    return this._getFocusableItems(container)[0] ?? null;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-overflow-menu': OverflowMenu;
  }
}
