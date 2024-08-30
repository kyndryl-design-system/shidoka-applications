import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import SnackbarStyles from './kyn-snackbar.scss';

import '@kyndryl-design-system/shidoka-foundation/components/link';
import '@kyndryl-design-system/shidoka-foundation/components/icon';

import closeIcon from '@carbon/icons/es/close/24';

/**
 *  Snackbar component.
 * @slot unnamed - Slot for the snackbar message content.
 */
@customElement('kyn-snackbar')
export class KynSnackbar extends LitElement {
  static override styles = [SnackbarStyles];

  /**
   * Message to be displayed in snackbar notification.
   */
  @property({ type: String })
  message = '';

  /**
   * Snackbar notification visibility status.
   */
  @property({ type: Boolean })
  snackbarVisible = false;

  /**
   * Unique id to isolate snackbar notification for toggling open/close
   */
  @property({ type: String })
  snackbarId = '';

  override render() {
    return html` ${this.snackbarVisible ? this._renderSnackbar() : null} `;
  }

  private _renderSnackbar() {
    return html`
      <div class="snackbar">
        <slot></slot>
        <div class="right-aligned-controls">
          <button id="undo">UNDO</button>
          <button
            id="x-out"
            @click=${() => this._toggleSnackbar()}
            @keydown=${(e: KeyboardEvent) => {
              if (e.key === 'Enter') {
                this._toggleSnackbar();
              }
            }}
          >
            <kd-icon .icon=${closeIcon}></kd-icon>
          </button>
        </div>
      </div>
    `;
  }

  private _toggleSnackbar() {
    this.snackbarVisible = !this.snackbarVisible;
    this.dispatchEvent(
      new CustomEvent('visibility-changed', {
        detail: { visible: this.snackbarVisible },
        bubbles: true,
        composed: true,
      })
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-snackbar': KynSnackbar;
  }
}
