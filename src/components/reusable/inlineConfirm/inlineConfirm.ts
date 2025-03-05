import { LitElement, html, property, customElement, state } from 'lit-element';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { classMap } from 'lit/directives/class-map.js';
import styles from './inlineConfirm.scss';
import '../button';

import closeIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/close-simple.svg';
import checkIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/check.svg';

/**
 * InlineConfirm component.
 * @slot unnamed - Slot for anchor button icon.
 * @slot confirmIcon - Slot for confirm icon button, will be a check icon by default if none provided.
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

    setTimeout(() => {
      const focusEl: any = this._isOpen
        ? this.shadowRoot?.querySelector('.cancel-btn')
        : this.shadowRoot?.querySelector('.anchor');

      focusEl.focus();
    }, 10);
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
          aria-controls="confirmation"
          aria-expanded=${this._isOpen}
          @on-click=${this._handleToggle}
        >
          <slot slot="icon"></slot>
        </kyn-button>

        <div id="confirmation">
          <kyn-button
            class="cancel-btn"
            kind="tertiary"
            size="small"
            description=${this.cancelText}
            @on-click=${this._handleToggle}
          >
            <span slot="icon">${unsafeSVG(closeIcon)}</span>
          </kyn-button>

          <kyn-button
            class="confirm-btn"
            kind=${this.destructive ? 'secondary-destructive' : 'primary'}
            size="small"
            description=${this.confirmText}
            @on-click=${this._handleConfirm}
          >
            <slot slot="icon" name="confirmIcon">${unsafeSVG(checkIcon)}</slot>
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
