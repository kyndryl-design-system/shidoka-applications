import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import SnackbarStyles from './kyn-snackbar-wb.scss';

import '@kyndryl-design-system/shidoka-foundation/components/link';
import '@kyndryl-design-system/shidoka-foundation/components/icon';

import closeIcon from '@carbon/icons/es/close/24';

/**
 *  Snackbar component.
 */
@customElement('kyn-snackbar-wb')
export class KynSnackbarWb extends LitElement {
  static override styles = [SnackbarStyles];

  @property({ type: String })
  message = '';

  @property({ type: Boolean })
  snackbarVisible = false;

  override render() {
    return html` ${this.snackbarVisible ? this._renderSnackbar() : null} `;
  }

  private _renderSnackbar() {
    return html`
      <div class="snackbar">
        <span>${this.message}</span>
        <div class="right-aligned-controls">
          <button id="undo">UNDO</button>
          <button
            id="x-out"
            @click=${this.toggleSnackbar}
            @keydown=${(e: KeyboardEvent) => {
              if (e.key === 'Enter') {
                this.toggleSnackbar();
              }
            }}
          >
            <kd-icon .icon=${closeIcon}></kd-icon>
          </button>
        </div>
      </div>
    `;
  }

  toggleSnackbar() {
    this.snackbarVisible = !this.snackbarVisible;
    this.dispatchEvent(
      new CustomEvent('visibility-changed', {
        detail: { visible: this.snackbarVisible },
      })
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-snackbar-wb': KynSnackbarWb;
  }
}
