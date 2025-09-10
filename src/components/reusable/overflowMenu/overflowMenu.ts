import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import SCSS from './overflowMenu.scss?inline';
import overflowIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/overflow.svg';
import arrowLeft from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/arrow-left.svg';

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

  private _onDocClick = (e: Event) => this.handleClickOut(e);
  private _onDocKeydown = (e: KeyboardEvent) => this.handleEscapePress(e);

  private _nestedMenuEl: HTMLDivElement | null = null;
  private _nestedAnchor: HTMLElement | null = null;
  private _suppressDocClick = false;

  private _previousMenuContent: DocumentFragment | null = null;
  private _mainReplaced = false;

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
          aria-expanded=${this.open}
          aria-haspopup="menu"
          title=${this.assistiveText}
          aria-label=${this.assistiveText}
          @keydown=${(e: KeyboardEvent) => this.handleKeyDown(e)}
        >
          <span>${unsafeSVG(overflowIcon)}</span>
        </button>

        <div class=${classMap(menuClasses)} role="menu">
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

  private _onViewportChange = () => {
    this._positionMenu();
    this._repositionSubmenu();
  };

  private _onItemClick = (
    e: CustomEvent<{ nested?: boolean; host?: HTMLElement; origEvent?: Event }>
  ) => {
    const detail = e?.detail || {};

    if (detail.nested && detail.host) {
      const isClick =
        !!detail.origEvent && (detail.origEvent as Event).type === 'click';

      if (isClick) {
        this._suppressDocClick = true;
        requestAnimationFrame(() => {
          this._suppressDocClick = false;
        });

        if (this._nestedMenuEl && this._nestedAnchor === detail.host) {
          return;
        }

        this._openSubmenuForItem(detail.host);
        return;
      }

      this._suppressDocClick = true;
      requestAnimationFrame(() => {
        this._suppressDocClick = false;
      });

      if (this._nestedMenuEl && this._nestedAnchor === detail.host) {
        return;
      } else {
        this._openSubmenuForItem(detail.host);
        return;
      }
    }

    this._closeSubmenu();
    this.open = false;
    this._emitToggleEvent();
    this._btnEl?.focus();
  };

  private _openSubmenuForItem(host: HTMLElement) {
    this._closeSubmenu();

    const container = this.shadowRoot?.querySelector(
      '.overflow-menu'
    ) as HTMLDivElement | null;
    if (!container) return;
    if (getComputedStyle(container).position === 'static')
      container.style.position = 'relative';

    const parentMenuRect = this._menuEl.getBoundingClientRect();

    const provided =
      (host.querySelector('[slot="submenu"]') as
        | HTMLElement
        | HTMLTemplateElement
        | null) ?? null;
    if (!provided) return;

    const isMobileViewport = window.innerWidth < 767;

    if (isMobileViewport) {
      this._previousMenuContent = document.createDocumentFragment();
      while (this._menuEl.firstChild) {
        this._previousMenuContent.appendChild(this._menuEl.firstChild);
      }

      const backBtn = document.createElement('kyn-overflow-menu-item');
      backBtn.className = 'nested-back-btn';
      backBtn.innerHTML = `<span style="margin-right: 4px; vertical-align: sub;">${arrowLeft}</span> Back`;
      backBtn.setAttribute('aria-label', 'Back to parent menu');
      backBtn.style.borderBottom =
        '1px solid var(--kd-color-border-card-default)';

      backBtn.addEventListener('click', (ev: Event) => {
        this._suppressDocClick = true;
        requestAnimationFrame(() => (this._suppressDocClick = false));
        this._restoreMainMenu();

        const focusTarget =
          this._firstFocusableIn(this._menuEl as HTMLElement) ?? host;
        focusTarget?.focus();
        ev.stopPropagation();
        ev.preventDefault();
      });

      this._menuEl.appendChild(backBtn);

      if (provided instanceof HTMLTemplateElement) {
        this._menuEl.appendChild(provided.content.cloneNode(true));
      } else {
        const clones = Array.from(provided.childNodes).map((n) =>
          n.cloneNode(true)
        );
        this._menuEl.append(...clones);
      }

      this._mainReplaced = true;
      this._nestedMenuEl = null;
      this._nestedAnchor = host;
      host.setAttribute('aria-expanded', 'true');

      this._repositionSubmenu();
      requestAnimationFrame(() => {
        this._menuEl.classList.add('nested-mobile');
      });

      return;
    }

    const submenu = document.createElement('div');
    submenu.className = 'menu nested';
    submenu.style.position = 'absolute';
    submenu.style.background = 'var(--kd-color-background-container-default)';
    submenu.style.borderRadius = '4px';
    submenu.style.overflow = 'hidden';
    submenu.style.boxShadow = 'rgba(0, 0, 0, 0.1) 0px 2px 4px';
    submenu.style.margin = '8px 0';
    submenu.style.display = 'flex';
    submenu.style.flexDirection = 'column';
    submenu.style.zIndex = '30';
    submenu.setAttribute('role', 'menu');
    submenu.setAttribute('aria-orientation', 'vertical');

    const nestedW = this._resolveNestedWidth(parentMenuRect.width);
    if (nestedW) submenu.style.width = nestedW;

    if (provided instanceof HTMLTemplateElement) {
      submenu.appendChild(provided.content.cloneNode(true));
    } else {
      const clones = Array.from(provided.childNodes).map((n) =>
        n.cloneNode(true)
      );
      submenu.append(...clones);
    }

    submenu.addEventListener(
      'on-click',
      (e: Event) => {
        const ce = e as CustomEvent<{ nested?: boolean }>;
        if (ce.detail?.nested) return;
        requestAnimationFrame(() => {
          this._closeSubmenu();
          this.open = false;
          this._emitToggleEvent();
          this._btnEl?.focus();
        });
      },
      { capture: true }
    );

    container.appendChild(submenu);
    this._nestedMenuEl = submenu;
    this._nestedAnchor = host;
    host.setAttribute('aria-expanded', 'true');

    this._repositionSubmenu();

    requestAnimationFrame(() => {
      this._nestedMenuEl?.classList.add('open');
    });
  }

  private toggleMenu() {
    this.open = !this.open;
    this._emitToggleEvent();
  }

  //normalize width values
  private _toCssSize(v: string | number | null | undefined): string | null {
    if (v === null || v === undefined) return null;
    if (typeof v === 'number') return `${v}px`;
    const s = String(v).trim();
    if (!s || s === 'auto') return null;
    if (/^\d+(\.\d+)?(px|rem|em|ch|vw|vh|%|vmin|vmax)$/.test(s)) return s;
    if (/^\d+(\.\d+)?$/.test(s)) return `${s}px`;
    return s;
  }

  private _repositionSubmenu() {
    if (!this._nestedMenuEl || !this._nestedAnchor) return;

    const container = this.shadowRoot?.querySelector(
      '.overflow-menu'
    ) as HTMLDivElement | null;
    if (!container) return;

    const contRect = container.getBoundingClientRect();
    const hostRect = this._nestedAnchor.getBoundingClientRect();
    const parentMenuRect = this._menuEl.getBoundingClientRect();

    const nestedW = this._resolveNestedWidth(parentMenuRect.width);
    if (nestedW) this._nestedMenuEl.style.width = nestedW;
    else this._nestedMenuEl.style.removeProperty('width');

    const gap = 8;
    const top = Math.max(hostRect.top - contRect.top - 8, 0);

    const submenuWidth =
      this._nestedMenuEl.getBoundingClientRect().width ||
      parseFloat(nestedW || '0');

    let left = 0;
    let wouldOverflowRight = false;
    let wouldOverflowLeft = false;

    if (this.anchorRight) {
      const desiredLeftFromLeft =
        parentMenuRect.left - contRect.left - gap - submenuWidth;
      wouldOverflowLeft = desiredLeftFromLeft < 8;

      if (wouldOverflowLeft) {
        left = parentMenuRect.right - contRect.left + gap;
        this._nestedMenuEl.style.removeProperty('right');
        this._nestedMenuEl.classList.remove('right');
        this._nestedMenuEl.style.left = `${Math.max(left, 0)}px`;
      } else {
        this._nestedMenuEl.style.removeProperty('right');
        this._nestedMenuEl.style.left = `${desiredLeftFromLeft}px`;
        this._nestedMenuEl.classList.add('right');
      }
    } else {
      const desiredLeft = parentMenuRect.right - contRect.left + gap;
      wouldOverflowRight = desiredLeft + submenuWidth > window.innerWidth - 8;
      left = wouldOverflowRight
        ? parentMenuRect.left - contRect.left - gap - submenuWidth
        : desiredLeft;

      this._nestedMenuEl.style.removeProperty('right');
      this._nestedMenuEl.classList.remove('right');
    }

    const isNarrow = window.innerWidth < 767;

    const forceOverlay =
      isNarrow ||
      window.innerWidth <= 480 ||
      (wouldOverflowRight && !this.anchorRight) ||
      (wouldOverflowLeft && this.anchorRight);

    if (forceOverlay) {
      this._nestedMenuEl.classList.add('overlay');

      const overlayWidth = Math.max(parentMenuRect.width, submenuWidth);

      let overlayLeft: number;
      let overlayTop: number;

      if (isNarrow) {
        overlayLeft = parentMenuRect.left - contRect.left;
        overlayTop = parentMenuRect.top - contRect.top;
      } else {
        overlayLeft = this.anchorRight
          ? parentMenuRect.left - contRect.left - overlayWidth - gap
          : parentMenuRect.left - contRect.left;

        overlayTop = Math.max(hostRect.top - contRect.top - 8, 0);
      }

      this._nestedMenuEl.style.left = `${overlayLeft}px`;
      this._nestedMenuEl.style.top = `${overlayTop}px`;
      this._nestedMenuEl.style.width = `${overlayWidth}px`;
    } else {
      this._nestedMenuEl.classList.remove('overlay');

      this._nestedMenuEl.style.top = `${top}px`;
      this._nestedMenuEl.style.left = `${Math.max(left, 0)}px`;
    }
  }

  private _closeSubmenu() {
    if (this._nestedMenuEl) {
      try {
        this._nestedMenuEl.remove();
      } catch {
        /* no op */
      }
      this._nestedMenuEl = null;
    }

    if (this._mainReplaced) {
      this._restoreMainMenu();
    }

    if (this._nestedAnchor) {
      this._nestedAnchor.removeAttribute('aria-expanded');
      this._nestedAnchor = null;
    }
  }

  private _restoreMainMenu() {
    if (!this._mainReplaced) return;

    while (this._menuEl.firstChild) {
      this._menuEl.removeChild(this._menuEl.firstChild);
    }

    if (this._previousMenuContent) {
      this._menuEl.appendChild(this._previousMenuContent);
    }

    this._previousMenuContent = null;
    this._mainReplaced = false;

    this.open = true;
    this._emitToggleEvent();
  }

  private _resolveParentWidth(): string | null {
    const propW = this._toCssSize(this.width);
    if (propW) return propW;

    const varW =
      getComputedStyle(this)
        .getPropertyValue('--kyn-overflow-menu-width')
        ?.trim() || '';
    return varW || null;
  }

  private _resolveNestedWidth(parentPixelWidth: number): string | null {
    const nw = (this.nestedWidth ?? '').trim();
    if (nw === 'match-parent') return `${Math.max(parentPixelWidth, 0)}px`;

    const coerced = this._toCssSize(nw || null);
    if (coerced) return coerced;

    const varW =
      getComputedStyle(this)
        .getPropertyValue('--kyn-overflow-submenu-width')
        ?.trim() || '';
    return varW || null;
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

    this._repositionSubmenu();
  }

  private _applyParentWidth() {
    const w = this._resolveParentWidth();
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
        this._repositionSubmenu();
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
    if (e.key !== 'Escape' && e.key !== 'ArrowLeft') return;
    const focusInSub =
      !!this._nestedMenuEl &&
      !!this._nestedMenuEl.contains(
        (this.getRootNode() as Document | ShadowRoot).activeElement as Node
      );

    if (focusInSub || e.key === 'ArrowLeft') {
      if (this._nestedMenuEl) {
        this._closeSubmenu();
        const anchorActionable =
          this._nestedAnchor?.shadowRoot?.querySelector<HTMLElement>(
            'button, a'
          ) ??
          this._nestedAnchor?.querySelector<HTMLElement>('button, a') ??
          this._nestedAnchor;
        anchorActionable?.focus();
        return;
      }
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

    if (this._nestedMenuEl && path.includes(this._nestedMenuEl)) {
      return;
    }

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

    if (host.hasAttribute('nested')) {
      e.preventDefault();
      e.stopPropagation();
      this._suppressDocClick = true;
      requestAnimationFrame(() => (this._suppressDocClick = false));

      if (this._nestedMenuEl && this._nestedAnchor === host) {
        this._closeSubmenu();
      } else {
        this._openSubmenuForItem(host);
      }
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
      this._onItemClick as unknown as EventListener
    );

    window.removeEventListener('resize', this._onViewportChange);
    window.removeEventListener('scroll', this._onViewportChange, true);

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
