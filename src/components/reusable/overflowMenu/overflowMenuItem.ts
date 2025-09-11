import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import SCSS from './overflowMenuItem.scss?inline';
import '../tooltip';

import arrowRightIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/chevron-right.svg';

/**
 * Overflow Menu.
 * @fires on-click - Captures the click event and emits the original event details.`detail:{ origEvent: PointerEvent }`
 * @slot unnamed - Slot for item text.
 */
@customElement('kyn-overflow-menu-item')
export class OverflowMenuItem extends LitElement {
  static override styles = unsafeCSS(SCSS);

  /** Makes the item a link. */
  @property({ type: String })
  accessor href: string | null = null;

  /** Sets the target for linked item (e.g. _blank). */
  @property({ type: String }) accessor target: string | null = null;

  /** Adds destructive styles. */
  @property({ type: Boolean })
  accessor destructive = false;

  /** Item disabled state. */
  @property({ type: Boolean })
  accessor disabled = false;

  /** Item description text for screen reader's */
  @property({ type: String })
  accessor description = '';

  /** Item contains a nested overflow */
  @property({ type: Boolean, reflect: true })
  accessor nested = false;

  /**
   * Has the menu items in the current oveflow menu.
   * @ignore
   */
  @state()
  accessor _menuItems: any;

  /**
   * Has the current oveflow menu.
   * @ignore
   */
  @state()
  accessor _menu: any;

  /**
   * Tracks if the item content is overflowing and needs a tooltip.
   * @ignore
   */
  @state()
  accessor isTruncated = false;

  /** Holds the text content for the title tooltip.
   * @ignore
   */
  @state()
  accessor tooltipText = '';

  /** Kind of the item, derived from parent.
   * @ignore
   */
  @state()
  accessor kind: 'ai' | 'default' = 'default';

  private _actionableElement: HTMLElement | null = null;
  private _menuClassObserver: MutationObserver | null = null;
  private _hoverHandlersAttached = false;
  private _boundRequestOpen: (e?: Event) => void = () => {};
  private _boundHandleResize: () => void = () => {};

  override render() {
    const classes = {
      'overflow-menu-item': true,
      'menu-item': true,
      'ai-connected': this.kind === 'ai',
      destructive: this.destructive,
      nested: this.nested,
    };

    const itemText = this.isTruncated ? this.tooltipText : '';
    const nestedIcon = this.nested
      ? html`<span class="menu-item-inner-el nested-icon"
          >${unsafeSVG(arrowRightIcon)}</span
        >`
      : null;

    const hasHref = !!this.href?.trim();
    const renderAsLink = hasHref && !this.disabled;

    if (renderAsLink) {
      const rel = this.target === '_blank' ? 'noopener noreferrer' : null;
      return html`
        <a
          class=${classMap(classes)}
          href=${this.href!}
          role="menuitem"
          aria-haspopup=${this.nested ? 'menu' : 'false'}
          aria-disabled="false"
          tabindex="0"
          title=${itemText}
          target=${this.target ?? ''}
          rel=${rel ?? ''}
          @click=${(e: Event) => this.handleClick(e)}
          @keydown=${(e: KeyboardEvent) => this.handleKeyDown(e)}
        >
          <span class="menu-item-inner-el text"><slot></slot></span>
          ${nestedIcon}
          ${this.destructive
            ? html`<span class="sr-only">${this.description}</span>`
            : null}
          ${this.nested
            ? html`<slot name="submenu" hidden aria-hidden="true"></slot>`
            : null}
        </a>
      `;
    }

    return html`
      <button
        class=${classMap(classes)}
        role="menuitem"
        aria-haspopup=${this.nested ? 'menu' : 'false'}
        aria-disabled=${this.disabled ? 'true' : 'false'}
        ?disabled=${this.disabled}
        tabindex=${this.disabled ? -1 : 0}
        title=${itemText}
        @click=${(e: Event) => this.handleClick(e)}
        @keydown=${(e: KeyboardEvent) => this.handleKeyDown(e)}
      >
        <span class="menu-item-inner-el text"><slot></slot></span>
        ${nestedIcon}
        ${this.destructive
          ? html`<span class="sr-only">${this.description}</span>`
          : null}
        ${this.nested
          ? html`<slot name="submenu" hidden aria-hidden="true"></slot>`
          : null}
      </button>
    `;
  }

  override firstUpdated() {
    const parent = this.closest('kyn-overflow-menu') as any;

    if (parent) {
      this._menuItems = parent.getMenuItems?.() ?? [];
      this._menu = parent.getMenu?.() ?? null;
      this.kind = parent.kind;

      parent.addEventListener('kind-changed', (e: Event) => {
        const ce = e as CustomEvent<'ai' | 'default'>;
        requestAnimationFrame(() => (this.kind = ce.detail));
      });
    } else {
      const container = this._getContainer();
      this._menuItems = this._getFocusableItemsIn(container);
      this._menu = container;
    }

    const menuParent = this.closest('.menu') as HTMLElement | null;
    if (menuParent && menuParent.classList.contains('ai-connected')) {
      this.kind = 'ai';
    }
    if (menuParent) {
      this._menuClassObserver = new MutationObserver(() => {
        const isAi = menuParent.classList.contains('ai-connected');
        requestAnimationFrame(() => (this.kind = isAi ? 'ai' : 'default'));
      });
      this._menuClassObserver.observe(menuParent, {
        attributes: true,
        attributeFilter: ['class'],
      });
    }

    if (!this.hasAttribute('nested')) {
      this.nested = !!this.querySelector('[slot="submenu"]');
    }

    this.checkOverflow();

    const actionable =
      (this.shadowRoot?.querySelector('button, a') as HTMLElement | null) ??
      (this.querySelector('button, a') as HTMLElement | null);

    if (actionable && this.nested && parent) {
      this._actionableElement = actionable;

      this._boundRequestOpen = () => {
        if (this.disabled) return;
        parent.dispatchEvent(
          new CustomEvent('on-click', {
            detail: { nested: true, host: this },
            bubbles: true,
            composed: true,
          })
        );
      };

      this._boundHandleResize = this._handleResize.bind(this);

      this._handleResize();
      window.addEventListener('resize', this._boundHandleResize, {
        passive: true,
      });
    }
  }

  private _attachHoverHandlers() {
    if (this._hoverHandlersAttached) return;
    const el = this._actionableElement;
    if (!el) return;

    el.addEventListener('focus', this._boundRequestOpen as EventListener, {
      passive: true,
    });
    el.addEventListener(
      'pointerover',
      this._boundRequestOpen as EventListener,
      {
        passive: true,
      }
    );

    this._hoverHandlersAttached = true;
  }

  private _detachHoverHandlers() {
    if (!this._hoverHandlersAttached) return;
    const el = this._actionableElement;
    if (!el) return;

    el.removeEventListener('focus', this._boundRequestOpen as EventListener);
    el.removeEventListener(
      'pointerover',
      this._boundRequestOpen as EventListener
    );

    this._hoverHandlersAttached = false;
  }

  private _handleResize() {
    if (window.innerWidth >= 767) {
      this._attachHoverHandlers();
    } else {
      this._detachHoverHandlers();
    }
  }

  override disconnectedCallback() {
    window.removeEventListener('resize', this._boundHandleResize);
    this._detachHoverHandlers();
    if (this._menuClassObserver) {
      this._menuClassObserver.disconnect();
      this._menuClassObserver = null;
    }
    super.disconnectedCallback();
  }

  private handleClick(e: Event) {
    if (this.disabled) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    this.dispatchEvent(
      new CustomEvent('on-click', {
        detail: { origEvent: e, nested: this.nested, host: this },
        bubbles: true,
        composed: true,
      })
    );
  }

  private handleKeyDown(e: KeyboardEvent) {
    const k = e.key;
    if (
      ![
        'ArrowDown',
        'ArrowUp',
        'Home',
        'End',
        'Enter',
        ' ',
        'ArrowRight',
        'ArrowLeft',
      ].includes(k)
    )
      return;

    e.preventDefault();
    e.stopPropagation();

    const container = this._getContainer();
    const items = this._getFocusableItemsIn(container);
    if (items.length === 0) return;

    const actionable =
      (this.shadowRoot?.querySelector('button, a') as HTMLElement | null) ??
      (this.querySelector('button, a') as HTMLElement | null) ??
      (this as unknown as HTMLElement);

    const i = items.findIndex(
      (el) => el === actionable || el.contains(actionable)
    );
    const last = items.length - 1;

    if (k === 'ArrowDown') return this._focus(items[i >= last ? 0 : i + 1]);
    if (k === 'ArrowUp') return this._focus(items[i <= 0 ? last : i - 1]);
    if (k === 'Home') return this._focus(items[0]);
    if (k === 'End') return this._focus(items[last]);

    if (k === 'ArrowRight' && this.nested) {
      this.dispatchEvent(
        new CustomEvent('on-click', {
          detail: { origEvent: e, nested: true, host: this },
          bubbles: true,
          composed: true,
        })
      );
      return;
    }
    if (k === 'ArrowLeft') {
      this.dispatchEvent(
        new CustomEvent('on-click', {
          detail: { origEvent: e, nested: false, host: this },
          bubbles: true,
          composed: true,
        })
      );
      return;
    }

    if ((k === 'Enter' || k === ' ') && this.nested) {
      this.dispatchEvent(
        new CustomEvent('on-click', {
          detail: { origEvent: e, nested: true, host: this },
          bubbles: true,
          composed: true,
        })
      );
      return;
    }
    if (k === 'Enter' || k === ' ') items[i]?.click();
  }

  private _getContainer(): HTMLElement | null {
    const hostAncestor = this.closest('.menu') as HTMLElement | null;
    if (hostAncestor) return hostAncestor;
    const rn = this.getRootNode();
    if (rn instanceof ShadowRoot) {
      const h = rn.host as HTMLElement;
      return h.closest('.menu');
    }
    return null;
  }

  private _getFocusableItemsIn(container: HTMLElement | null): HTMLElement[] {
    const scope: ParentNode = container ?? document;

    const hosts = Array.from(
      (scope as Document | Element).querySelectorAll?.(
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

  private _focus(el: HTMLElement) {
    el.focus();
  }

  private checkOverflow() {
    const contentElement = this.shadowRoot?.querySelector('button, a');
    if (contentElement instanceof HTMLElement) {
      this.isTruncated =
        contentElement.scrollWidth > contentElement.offsetWidth;
      if (this.isTruncated) {
        let text = '';

        const slot = this.shadowRoot?.querySelector(
          'slot:not([name])'
        ) as HTMLSlotElement | null;

        if (slot) {
          const nodes = slot.assignedNodes({ flatten: true });
          text = nodes
            .map((n) => {
              if (n.nodeType === Node.TEXT_NODE) return n.textContent ?? '';
              if (n instanceof HTMLElement) return n.textContent ?? '';
              return '';
            })
            .join('')
            .trim();
        } else {
          text = Array.from(this.childNodes)
            .filter((n) => {
              if (n.nodeType === Node.TEXT_NODE) return true;
              if (n instanceof HTMLElement) {
                return n.getAttribute('slot') !== 'submenu';
              }
              return false;
            })
            .map((n) => n.textContent ?? '')
            .join('')
            .trim();
        }

        this.tooltipText = text;
      } else {
        this.tooltipText = '';
      }
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-overflow-menu-item': OverflowMenuItem;
  }
}
