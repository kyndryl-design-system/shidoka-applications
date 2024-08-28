import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import KynSnackbarContainerStyles from './kyn-snackbar-container.scss';

import '@kyndryl-design-system/shidoka-foundation/components/button';

/**
 * Snackbar container/wrapper for snackbar notification component.
 * @slot unnamed - Slot for <kyn-snackbar> component.
 * @slot anchor - Slot for <kd-button> to launch snackbar.
 */
@customElement('kyn-snackbar-container')
export class KynSnackbarContainer extends LitElement {
  static override styles = KynSnackbarContainerStyles;

  override render() {
    return html`
      <div class="anchor">
        <slot name="anchor"></slot>
      </div>
      <div class="snackbar-container">
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-snackbar-container': KynSnackbarContainer;
  }
}
