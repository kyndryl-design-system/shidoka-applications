import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
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
  accessor href = '';

  /** Adds destructive styles. */
  @property({ type: Boolean })
  accessor destructive = false;

  /** Item disabled state. */
  @property({ type: Boolean })
  accessor disabled = false;

  /**
   * Menu anchorRight state, inherited from the parent.
   * @internal
   */
  @state()
  accessor anchorRight = false;

  override render() {
    const classes = {
      'overflow-menu-item': true,
      destructive: this.destructive,
      right: this.anchorRight,
    };

    if (this.href !== '') {
      return html`
        <a
          class=${classMap(classes)}
          href=${this.href}
          ?disabled=${this.disabled}
          @click=${(e: Event) => this.handleClick(e)}
        >
          <slot></slot>
        </a>
      `;
    } else {
      return html`
        <button
          class=${classMap(classes)}
          ?disabled=${this.disabled}
          @click=${(e: Event) => this.handleClick(e)}
        >
          <slot></slot>
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
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-overflow-menu-item': OverflowMenuItem;
  }
}
