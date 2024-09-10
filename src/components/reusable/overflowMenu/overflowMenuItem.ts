import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import SCSS from './overflowMenuItem.scss';

/**
 * Overflow Menu.
 * @fires on-click - Captures the click event and emits the original event details.
 * @slot unnamed - Slot for item text.
 */
@customElement('kyn-overflow-menu-item')
export class OverflowMenuItem extends LitElement {
  static override styles = SCSS;

  /** Makes the item a link. */
  @property({ type: String })
  href = '';

  /** Adds destructive styles. */
  @property({ type: Boolean })
  destructive = false;

  /** Item disabled state. */
  @property({ type: Boolean })
  disabled = false;

  override render() {
    const classes = {
      'overflow-menu-item': true,
      destructive: this.destructive,
    };

    if (this.href !== '') {
      return html`
        <a
          class=${classMap(classes)}
          href=${this.href}
          ?disabled=${this.disabled}
          @keydown=${(e: Event) => this.handleMenuItemInteraction(e)}
          @pointerdown=${(e: Event) => this.handleMenuItemInteraction(e)}
        >
          <slot></slot>
        </a>
      `;
    } else {
      return html`
        <button
          class=${classMap(classes)}
          ?disabled=${this.disabled}
          @keydown=${(e: Event) => this.handleMenuItemInteraction(e)}
          @pointerdown=${(e: Event) => this.handleMenuItemInteraction(e)}
        >
          <slot></slot>
        </button>
      `;
    }
  }

  private handleMenuItemInteraction(e: any) {
    const ENTER_KEY_CODE = 13;
    const SPACE_KEY_CODE = 32;

    if(e.type === 'keydown') {
      if (e.keyCode === ENTER_KEY_CODE || e.keyCode === SPACE_KEY_CODE) {
        this.handleClick(e);
      }
    } else {
      this.handleClick(e);
    }
  }

  private handleClick(e: Event) {
    const event = new CustomEvent('on-click', {
      detail: { origEvent: e },
    });
    this.dispatchEvent(event);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-overflow-menu-item': OverflowMenuItem;
  }
}
