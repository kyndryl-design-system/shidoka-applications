import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import SCSS from './overflowMenuItem.scss?inline';
import '../tooltip';
import chevronRightIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/chevron-right.svg';

/**
 * Overflow Menu Item.
 * @fires on-click - Captures the click event and emits the original event details.`detail:{ origEvent: PointerEvent }`
 * @slot unnamed - Slot for menu item text.
 * @slot submenu - Provide a nested submenu's markup here (light DOM). Presence auto-detects nesting.
 * @prop {'ai'|'default'|string} kind - Visual variant inherited from parent menu.
 */
@customElement('kyn-overflow-menu-item')
export class OverflowMenuItem extends LitElement {
  static override styles = unsafeCSS(SCSS);

  /** Makes the item a link. */
  @property({ type: String })
  accessor href = '';

  /** Adds destructive styles. */
  @property({ type: Boolean })
  accessor destructive = false;

  /** Item disabled state. */
  @property({ type: Boolean })
  accessor disabled = false;

  /** Item description text for screen readers. */
  @property({ type: String })
  accessor description = '';

  /**
   * Has the menu items in the current oveflow menu.
   * @ignore
   */
  @state()
  accessor _menuItems: HTMLElement[] = [];

  /**
   * Has the current oveflow menu.
   * @ignore
   */
  @state()
  accessor _menu: HTMLElement | null = null;

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
  @property({ type: String, reflect: true })
  accessor kind: 'ai' | 'default' | (string & {}) = 'default';

  /**
   * Timer id used to debounce opening of nested submenu on hover/focus.
   * @ignore
   */
  @state()
  accessor _submenuOpenTimer: number | undefined;

  private _mo: MutationObserver | null = null;

  /** True when a light-DOM submenu exists. */
  private get submenuEls(): HTMLElement[] {
    return Array.from(
      this.querySelectorAll<HTMLElement>(':scope > [slot="submenu"]')
    );
  }
  private get hasSubmenu(): boolean {
    return this.submenuEls.length > 0;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    // Observe for submenu add/remove or slot attr changes and re-render.
    this._mo = new MutationObserver(() => this.requestUpdate());
    this._mo.observe(this, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['slot'],
    });
  }

  override disconnectedCallback(): void {
    this._mo?.disconnect();
    this._mo = null;
    super.disconnectedCallback();
  }

  override render() {
    const classes = {
      'overflow-menu-item': true,
      'menu-item': true,
      ['ai-connected']: this.kind === 'ai',
      destructive: this.destructive,
    };

    const itemText = this.isTruncated ? this.tooltipText : '';

    if (this.href !== '') {
      return html`
        <a
          class=${classMap(classes)}
          href=${this.href}
          ?disabled=${this.disabled}
          @click=${(e: Event) => this.handleClick(e)}
          @keydown=${(e: KeyboardEvent) => this.handleKeyDown(e)}
          title=${itemText}
        >
          <span class="menu-item-inner-el text"><slot></slot></span>
          ${this.destructive
            ? html`<span class="sr-only">${this.description}</span>`
            : null}
          ${this.hasSubmenu
            ? html`<span
                class="menu-item-inner-el submenu-arrow"
                aria-hidden="true"
              >
                ${unsafeSVG(chevronRightIcon)}
              </span>`
            : null}
        </a>
      `;
    }

    return html`
      <button
        class=${classMap(classes)}
        ?disabled=${this.disabled}
        @click=${(e: Event) => this.handleClick(e)}
        @keydown=${(e: KeyboardEvent) => this.handleKeyDown(e)}
        title=${itemText}
      >
        <span class="menu-item-inner-el text"><slot></slot></span>
        ${this.destructive
          ? html`<span class="sr-only">${this.description}</span>`
          : null}
        ${this.hasSubmenu
          ? html`<span
              class="menu-item-inner-el submenu-arrow"
              aria-hidden="true"
            >
              ${unsafeSVG(chevronRightIcon)}
            </span>`
          : null}
      </button>
    `;
  }

  override firstUpdated() {
    const parent = this.closest('kyn-overflow-menu') as
      | (HTMLElement & {
          getMenuItems?: () => HTMLElement[];
          getMenu?: () => HTMLElement;
          kind?: string;
        })
      | null;

    if (parent) {
      this._menuItems = parent.getMenuItems ? parent.getMenuItems() : [];
      this._menu = parent.getMenu ? parent.getMenu() : null;
      if (typeof parent.kind === 'string') this.kind = parent.kind as any;

      parent.addEventListener('kind-changed', (e: Event) => {
        const customEvent = e as CustomEvent<'ai' | 'default' | (string & {})>;
        requestAnimationFrame(() => {
          this.kind = customEvent.detail;
        });
      });
    }

    this.checkOverflow();
  }

  private handleClick(e: Event) {
    const wrapper = this.querySelector<HTMLElement>(
      ':scope > [slot="submenu"]:not(kyn-overflow-menu-item)'
    );
    const directItems = Array.from(
      this.querySelectorAll<HTMLElement>(
        ':scope > kyn-overflow-menu-item[slot="submenu"]'
      )
    );

    if (this.hasSubmenu) {
      e.stopPropagation();
      const html =
        wrapper?.innerHTML ?? directItems.map((el) => el.outerHTML).join('');
      this.dispatchEvent(
        new CustomEvent('open-submenu', {
          detail: { html },
          bubbles: true,
          composed: true,
        })
      );
      return;
    }

    this.dispatchEvent(
      new CustomEvent('on-click', {
        detail: { origEvent: e },
        bubbles: true,
        composed: true,
      })
    );
  }

  private handleKeyDown(e: KeyboardEvent) {
    const DOWN = 40;
    const UP = 38;

    const items = this._menuItems;
    const activeEl = (this.getRootNode() as Document | ShadowRoot)
      .activeElement as Element | null;

    const idx = items.findIndex((item) => {
      if (item === activeEl) return true;
      const sr = (item as HTMLElement).shadowRoot;
      return !!(sr && activeEl && sr.contains(activeEl));
    });

    switch (e.keyCode) {
      case DOWN: {
        if (idx < items.length - 1 && idx >= 0) {
          const next = items[idx + 1];
          const btn =
            next.shadowRoot?.querySelector<HTMLButtonElement>('button');
          const anchor = next.shadowRoot?.querySelector<HTMLAnchorElement>('a');
          (btn ?? anchor)?.focus();
        }
        return;
      }
      case UP: {
        if (idx > 0) {
          const prev = items[idx - 1];
          const btn =
            prev.shadowRoot?.querySelector<HTMLButtonElement>('button');
          const anchor = prev.shadowRoot?.querySelector<HTMLAnchorElement>('a');
          (btn ?? anchor)?.focus();
        } else if (idx === 0) {
          this._menu?.querySelector<HTMLButtonElement>('button')?.focus();
        }
        return;
      }
      default:
        return;
    }
  }

  private checkOverflow() {
    const contentElement =
      this.shadowRoot?.querySelector<HTMLElement>('button, a');
    if (contentElement) {
      this.isTruncated =
        contentElement.scrollWidth > contentElement.offsetWidth;
      if (this.isTruncated) {
        this.tooltipText = (this.textContent ?? '').trim();
      }
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-overflow-menu-item': OverflowMenuItem;
  }
}
