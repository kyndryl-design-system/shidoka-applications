import { LitElement, html, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';

import styles from './table-legend.scss?inline';

/**
 * Table Legend
 *
 * @slot unnamed - Default slot for Legend Items.
 */
@customElement('kyn-table-legend')
export class TableLegend extends LitElement {
  static override styles = unsafeCSS(styles);

  override render() {
    return html` <div class="table-legend"><slot></slot></div> `;
  }
}

// Define the custom element in the global namespace
declare global {
  interface HTMLElementTagNameMap {
    'kyn-table-legend': TableLegend;
  }
}
