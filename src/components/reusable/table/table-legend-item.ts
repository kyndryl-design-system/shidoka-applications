import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

import styles from './table-legend-item.scss';

/**
 * Table Legend Item
 *
 * @slot unnamed - Default slot for icon and text.
 */
@customElement('kyn-table-legend-item')
export class TableLegendItem extends LitElement {
  static override styles = [styles];

  override render() {
    return html` <div class="legend-item"><slot></slot></div> `;
  }
}

// Define the custom element in the global namespace
declare global {
  interface HTMLElementTagNameMap {
    'kyn-table-legend-item': TableLegendItem;
  }
}
