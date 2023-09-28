import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

import styles from './table.scss';

/**
 * `kyn-table` Web Component.
 *
 * This component provides a generic table structure with a slot to allow customization.
 * You can use this component to wrap around table rows and cells for a consistent style.
 *
 * @slot unnamed - The primary content slot for rows, headers, and cells.
 */
@customElement('kyn-table')
export class Table extends LitElement {
  static override styles = [styles];

  override render() {
    return html` <slot></slot> `;
  }
}

// Define the custom element in the global namespace
declare global {
  interface HTMLElementTagNameMap {
    'kyn-table': Table;
  }
}
