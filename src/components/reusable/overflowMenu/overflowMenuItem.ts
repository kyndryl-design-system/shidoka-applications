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
  accessor href = '';

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
  @property({ type: Boolean })
  accessor nested = false;

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

  override render() {
    const classes = {
      'overflow-menu-item': true,
      'menu-item': true,
      [`ai-connected-${this.kind === 'ai'}`]: true,
      destructive: this.destructive,
      nested: this.nested,
    };

    const itemText = this.isTruncated ? this.tooltipText : '';
    const nestedIcon = this.nested
      ? html`<span class="menu-item-inner-el nested-icon"
          >${unsafeSVG(arrowRightIcon)}</span
        >`
      : null;

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
          ${nestedIcon}
          ${this.destructive
            ? html`<span class="sr-only">${this.description}</span>`
            : null}
        </a>
      `;
    } else {
      return html`
        <button
          class=${classMap(classes)}
          ?disabled=${this.disabled}
          @click=${(e: Event) => this.handleClick(e)}
          @keydown=${(e: KeyboardEvent) => this.handleKeyDown(e)}
          title=${itemText}
        >
          <span class="menu-item-inner-el text"><slot></slot></span>
          ${nestedIcon}
          ${this.destructive
            ? html`<span class="sr-only">${this.description}</span>`
            : null}
        </button>
      `;
    }
  }

  override firstUpdated() {
    const parent = this.closest('kyn-overflow-menu') as any;
    if (parent) {
      this._menuItems = parent.getMenuItems?.() ?? [];
      this._menu = parent.getMenu?.() ?? null;
      this.kind = parent.kind;

      parent.addEventListener('kind-changed', (e: Event) => {
        const ce = e as CustomEvent<'ai' | 'default'>;
        requestAnimationFrame(() => {
          this.kind = ce.detail;
        });
      });
    } else {
      const container = this._getContainer();
      this._menuItems = this._getFocusableItemsIn(container);
      this._menu = container;
    }
    this.checkOverflow();
  }

  private handleClick(e: Event) {
    const event = new CustomEvent('on-click', {
      detail: { origEvent: e, nested: this.nested, host: this },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  private handleKeyDown(e: KeyboardEvent) {
    const k = e.key;
    if (
      k !== 'ArrowDown' &&
      k !== 'ArrowUp' &&
      k !== 'Home' &&
      k !== 'End' &&
      k !== 'Enter' &&
      k !== ' '
    )
      return;

    e.preventDefault();
    e.stopPropagation();

    const container = this._getContainer();
    const items = this._getFocusableItemsIn(container);
    if (items.length === 0) return;

    const actionableForThis =
      (this.shadowRoot?.querySelector('button, a') as HTMLElement | null) ??
      (this.querySelector('button, a') as HTMLElement | null) ??
      (this as unknown as HTMLElement);

    const i = items.findIndex(
      (el) => el === actionableForThis || el.contains(actionableForThis)
    );
    const last = items.length - 1;

    if (k === 'ArrowDown') {
      this._focus(items[i >= last ? 0 : i + 1]);
      return;
    }
    if (k === 'ArrowUp') {
      this._focus(items[i <= 0 ? last : i - 1]);
      return;
    }
    if (k === 'Home') {
      this._focus(items[0]);
      return;
    }
    if (k === 'End') {
      this._focus(items[last]);
      return;
    }

    if (k === 'Enter' || k === ' ') {
      if (this.nested) {
        this.dispatchEvent(
          new CustomEvent('on-click', {
            detail: { origEvent: e, nested: true, host: this },
            bubbles: true,
            composed: true,
          })
        );
        return;
      }
      const target = items[i];
      target?.click();
    }
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

    const inScope = container
      ? hosts.filter((el) => container.contains(el))
      : hosts;
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

  private _activeIndex(items: HTMLElement[]): number {
    let ae: Element | null = document.activeElement as Element | null;

    let last: Element | null = null;
    while (ae && ae.shadowRoot && (ae.shadowRoot as ShadowRoot).activeElement) {
      if (ae === last) break;
      last = ae;
      ae = (ae.shadowRoot as ShadowRoot).activeElement as Element | null;
    }

    if (!ae) return 0;

    const idx = items.findIndex(
      (el) =>
        el === ae ||
        el.contains(ae) ||
        (!!el.shadowRoot && (el.shadowRoot as ShadowRoot).activeElement === ae)
    );

    return idx >= 0 ? idx : 0;
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
        text += this.textContent?.trim();
        this.tooltipText = text;
      }
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-overflow-menu-item': OverflowMenuItem;
  }
}
