import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import KynSnackbarWbContainerStyles from './kyn-snackbar-wb-container.scss';

import '@kyndryl-design-system/shidoka-foundation/components/button';

/**
 * Snackbar container component for snackbar notification.
 * @slot unnamed - Slot for <kyn-snackbar-wb> component.
 */
@customElement('kyn-snackbar-wb-container')
export class KynSnackbarWbContainer extends LitElement {
  static override styles = KynSnackbarWbContainerStyles;

  override render() {
    return html`
      <div class="anchor" @click=${this._toggleSnackbar}>
        <slot name="anchor"></slot>
      </div>
      <div class="snackbar-container">
        <slot></slot>
      </div>
    `;
  }

  private _toggleSnackbar() {
    const snackbars = this.querySelectorAll('kyn-snackbar-wb');
    snackbars.forEach((snackbar: any) => {
      snackbar.toggleSnackbar();
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-snackbar-wb-container': KynSnackbarWbContainer;
  }
}
