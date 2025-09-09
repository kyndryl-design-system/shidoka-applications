import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import SCSS from './overflowMenu.scss?inline';
import overflowIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/overflow.svg';

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
  @property({ type: Boolean })
  accessor anchorRight = false;

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

  private _onDocClick = (e: Event) => this.handleClickOut(e);
  private _onDocKeydown = (e: KeyboardEvent) => this.handleEscapePress(e);
  private _nestedMenuEl: HTMLDivElement | null = null;
  private _suppressDocClick = false;

  private _onItemClick = (
    e: CustomEvent<{ nested?: boolean; host?: HTMLElement }>
  ) => {
    const detail = e?.detail || {};
    if (detail.nested && detail.host) {
      this._suppressDocClick = true;
      this._openSubmenuForItem(detail.host);
      return;
    }

    this._closeSubmenu();
    this.open = false;
    this._emitToggleEvent();
    this._btnEl?.focus();
  };

  private _openSubmenuForItem(host: HTMLElement) {
    this._closeSubmenu();

    const hostRect = host.getBoundingClientRect();
    const parentMenuRect = this._menuEl.getBoundingClientRect();

    const submenu = document.createElement('div');
    submenu.className = 'menu open nested';
    submenu.style.position = 'fixed';
    submenu.style.background =
      'var(--kd-color-background-container-default, #ffffff)';
    submenu.style.borderRadius = '4px';
    submenu.style.overflow = 'hidden';
    submenu.style.boxShadow = 'rgba(0, 0, 0, 0.1) 0px 2px 4px';
    submenu.style.margin = '8px 0';
    submenu.style.display = 'flex';
    submenu.style.flexDirection = 'column';

    const topOffset = hostRect.top - 5;
    submenu.style.top = `${topOffset}px`;

    const gapBetweenMenus = 8;
    submenu.style.left = `${parentMenuRect.right + gapBetweenMenus}px`;

    submenu.style.width =
      this._menuEl.style.width || `${parentMenuRect.width}px`;
    submenu.style.zIndex = '30';

    const items = ['Sub Option 1', 'Sub Option 2', 'Sub Option 3'];
    items.forEach((text) => {
      const itemEl = document.createElement(
        'kyn-overflow-menu-item'
      ) as HTMLElement;
      itemEl.textContent = text;

      itemEl.addEventListener(
        'on-click',
        (ev: Event) => {
          ev.stopPropagation();
          this._closeSubmenu();
          this.open = false;
          this._emitToggleEvent();
          this._btnEl?.focus();
        },
        { once: true }
      );

      submenu.appendChild(itemEl);
    });

    document.body.appendChild(submenu);
    this._nestedMenuEl = submenu;

    const first = this._firstFocusableIn(submenu);
    first?.focus();
  }

  private _closeSubmenu() {
    if (this._nestedMenuEl) {
      try {
        this._nestedMenuEl.remove();
      } catch {
        /* ignore */
      }
      this._nestedMenuEl = null;
    }
  }

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
      right: this.anchorRight,
      fixed: this.fixed,
      upwards: this._openUpwards,
      ['ai-connected']: this.kind === 'ai',
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
          @keydown=${(e: KeyboardEvent) => this.handleKeyDown(e)}
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
        if (
          this._btnEl.getBoundingClientRect().top >
          window.innerHeight * 0.6
        ) {
          this._openUpwards = true;
        } else {
          this._openUpwards = false;
        }
      } else {
        this._closeSubmenu();
      }
      this._positionMenu();
    }
  }

  private handleClickOut(e: Event) {
    if (this._suppressDocClick) {
      this._suppressDocClick = false;
      return;
    }

    const path = e.composedPath();
    const clickedOutsideThis = !path.includes(this);
    const clickedInsideNested =
      this._nestedMenuEl && path.includes(this._nestedMenuEl);

    if (clickedOutsideThis && !clickedInsideNested) {
      this.open = false;
      this._emitToggleEvent();
      this._closeSubmenu();
    }
  }

  private handleEscapePress(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      this._closeSubmenu();
      this.open = false;
      this._emitToggleEvent();
      this._btnEl.focus();
    }
  }

  private handleKeyDown(e: KeyboardEvent) {
    const k = e.key;
    if (k !== 'Enter' && k !== ' ' && k !== 'ArrowDown') return;

    e.preventDefault();
    e.stopPropagation();

    const focusFirst = () => {
      const first = this._firstFocusableIn(this._menuEl as HTMLElement);
      first?.focus();
    };

    if (k === 'Enter' || k === ' ') {
      this.toggleMenu();
      if (this.open) requestAnimationFrame(focusFirst);
      return;
    }

    if (k === 'ArrowDown') {
      if (!this.open) {
        this.open = true;
        this._emitToggleEvent();
        requestAnimationFrame(focusFirst);
      } else {
        focusFirst();
      }
    }
  }

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

    const inScope = container
      ? hosts.filter((el) => container.contains(el))
      : hosts;
    const enabled = inScope.filter((el) => !el.hasAttribute('disabled'));

    const focusables = enabled
      .map(
        (el) =>
          (el.shadowRoot?.querySelector('button, a') as HTMLElement | null) ??
          (el.querySelector('button, a') as HTMLElement | null) ??
          el
      )
      .filter((el): el is HTMLElement => !!el);

    return focusables;
  }

  private onMenuKeydown = (e: KeyboardEvent) => {
    const k = e.key;

    if (k !== 'ArrowDown' && k !== 'ArrowUp' && k !== 'Home' && k !== 'End')
      return;

    e.preventDefault();
    e.stopPropagation();

    const container = e.currentTarget as HTMLElement | null;
    if (!container) return;

    let hosts: HTMLElement[] = [];
    const slot = container.querySelector('slot') as HTMLSlotElement | null;
    if (slot) {
      hosts = slot
        .assignedElements({ flatten: true })
        .filter(
          (el): el is HTMLElement =>
            el instanceof HTMLElement &&
            el.tagName.toLowerCase() === 'kyn-overflow-menu-item' &&
            !el.hasAttribute('disabled')
        );
    } else {
      hosts = Array.from(
        container.querySelectorAll<HTMLElement>('kyn-overflow-menu-item')
      ).filter((el) => !el.hasAttribute('disabled'));
    }

    const items: HTMLElement[] = hosts
      .map(
        (el) =>
          (el.shadowRoot?.querySelector('button, a') as HTMLElement | null) ??
          (el.querySelector('button, a') as HTMLElement | null) ??
          el
      )
      .filter((el): el is HTMLElement => !!el);

    if (items.length === 0) return;

    const rawActive =
      (container.getRootNode() as Document | ShadowRoot) instanceof ShadowRoot
        ? (container.getRootNode() as ShadowRoot).activeElement
        : document.activeElement;

    let i = items.findIndex((it) =>
      rawActive
        ? it === rawActive ||
          it.contains(rawActive) ||
          it.shadowRoot?.activeElement === rawActive
        : false
    );

    if (i < 0) {
      const activeHost =
        rawActive instanceof Element &&
        rawActive.getRootNode() instanceof ShadowRoot
          ? ((rawActive.getRootNode() as ShadowRoot).host as Element)
          : (rawActive as Element | null);

      i = hosts.findIndex(
        (h) => h === activeHost || (activeHost && h.contains(activeHost))
      );
    }

    if (i < 0) i = 0;

    const last = items.length - 1;

    if (k === 'ArrowDown') {
      items[i >= last ? 0 : i + 1].focus();
      return;
    }
    if (k === 'ArrowUp') {
      items[i <= 0 ? last : i - 1].focus();
      return;
    }
    if (k === 'Home') {
      items[0].focus();
      return;
    }
    if (k === 'End') {
      items[last].focus();
      return;
    }
  };

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
    const host = path.find(
      (n) =>
        n instanceof HTMLElement &&
        n.tagName.toLowerCase() === 'kyn-overflow-menu-item'
    ) as HTMLElement | undefined;
    if (!host) return;
    if (host.hasAttribute('nested')) {
      e.preventDefault();
      e.stopPropagation();
      this._suppressDocClick = true;
      this._openSubmenuForItem(host);
    }
  };

  override connectedCallback() {
    super.connectedCallback();
    document.addEventListener('click', this._onDocClick as EventListener);
    document.addEventListener('keydown', this._onDocKeydown as EventListener);
    this.addEventListener('click', this._onMenuClickCapture, true);
    this.addEventListener(
      'on-click',
      this._onItemClick as unknown as EventListener
    );
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
      this._onItemClick as unknown as EventListener
    );
    super.disconnectedCallback();
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
