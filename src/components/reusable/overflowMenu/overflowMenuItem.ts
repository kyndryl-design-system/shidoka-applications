import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import SCSS from './overflowMenuItem.scss?inline';
import '../tooltip';

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

  override render() {
    const classes = {
      'overflow-menu-item': true,
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
          @keydown=${(e: Event) => this.handleKeyDown(e)}
          title=${itemText}
        >
          <slot></slot>
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
          @keydown=${(e: Event) => this.handleKeyDown(e)}
          title=${itemText}
        >
          <slot></slot>
          ${this.destructive
            ? html`<span class="sr-only">${this.description}</span>`
            : null}
        </button>
      `;
    }
  }

  private handleClick(e: Event) {
    const event = new CustomEvent('on-click', {
      detail: { origEvent: e },
    });
    this.dispatchEvent(event);
  }

  private handleKeyDown(e: any) {
    const DOWN_ARROW_KEY_CODE = 40;
    const UP_ARROW_KEY_CODE = 38;

    const menuItemsLength = this._menuItems.length;

    const activeEl = document.activeElement;
    const activeIndex = this._menuItems.indexOf(activeEl);

    switch (e.keyCode) {
      case DOWN_ARROW_KEY_CODE: {
        if (activeIndex < menuItemsLength - 1) {
          const nextItem = this._menuItems[activeIndex + 1];
          if (nextItem) {
            nextItem.shadowRoot?.querySelector('button')
              ? nextItem.shadowRoot?.querySelector('button')?.focus()
              : nextItem.shadowRoot?.querySelector('a')?.focus();
          }
        }
        return;
      }
      case UP_ARROW_KEY_CODE: {
        if (activeIndex > 0) {
          const prevItem = this._menuItems[activeIndex - 1];
          if (prevItem) {
            prevItem.shadowRoot?.querySelector('button')
              ? prevItem.shadowRoot?.querySelector('button')?.focus()
              : prevItem.shadowRoot?.querySelector('a')?.focus();
          }
        } else if (activeIndex === 0) {
          this._menu?.querySelector('button')?.focus();
        }
        return;
      }
      default: {
        return;
      }
    }
  }

  override firstUpdated() {
    // Access the parent component
    const parent = this.closest('kyn-overflow-menu');
    if (parent) {
      this._menuItems = parent.getMenuItems();
      this._menu = parent.getMenu();
    }
    this.checkOverflow();
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
