import { LitElement, html, property, customElement, state } from 'lit-element';
import { classMap } from 'lit/directives/class-map.js';
import styles from './inlineConfirm.scss';
import '../button';

/**
 * InlineConfirm component.
 * @slot unnamed - Slot for anchor button icon.
 * @fires on-confirm - Dispatched when the confirm button is clicked.
 */
@customElement('kyn-inline-confirm')
export class InlineConfirm extends LitElement {
  static override styles = styles;

  /**
   * Determines if the action is destructive.
   * @type {boolean}
   */
  @property({ type: Boolean })
  destructive = false;

  /**
   * Anchor button text.
   * @type {string}
   */
  @property({ type: String })
  anchorText = '';

  /**
   * Confirm button text.
   * @type {string}
   */
  @property({ type: String })
  confirmText = 'Confirm';

  /**
   * Cancel button text.
   * @type {string}
   */
  @property({ type: String })
  cancelText = 'Cancel';

  /**
   * Open to the right.
   * @type {boolean}
   */
  @property({ type: Boolean })
  openRight = false;

  /**
   * Confirmation open state.
   * @internal
   */
  @state()
  private _isOpen = false;

  private _handleToggle() {
    this._isOpen = !this._isOpen;
  }

  private _handleConfirm() {
    this._handleToggle();

    const event = new CustomEvent('on-confirm');
    this.dispatchEvent(event);
  }

  override render() {
    const Classes = {
      'inline-confirm': true,
      open: this._isOpen,
      'open-right': this.openRight,
    };

    return html`
      <div class="${classMap(Classes)}">
        <kyn-button
          class="anchor"
          kind="ghost"
          size="small"
          description=${this.anchorText}
          @on-click=${this._handleToggle}
        >
          <slot slot="icon"></slot>
        </kyn-button>

        <div class="confirmation">
          <kyn-button
            kind=${this.destructive ? 'outline-destructive' : 'outline'}
            size="small"
            @on-click=${this._handleConfirm}
          >
            ${this.confirmText}
          </kyn-button>

          <kyn-button kind="ghost" size="small" @on-click=${this._handleToggle}>
            ${this.cancelText}
          </kyn-button>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-inline-confirm': InlineConfirm;
  }
}
