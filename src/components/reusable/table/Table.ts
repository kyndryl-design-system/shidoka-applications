import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

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

  @property({ type: Boolean })
  selectAll = false;

  // toggleSelectAll(event: Event) {
  //   const checked = (event.target as HTMLInputElement).checked;
  //   this.rows.forEach((row) => (row.selected = checked)); // Assuming rows is your data array
  //   this.requestUpdate();
  //   // Maybe propagate an event upwards for other components or application to know
  //   this.dispatchEvent(
  //     new CustomEvent('selection-changed', { detail: this.rows })
  //   );
  // }

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
