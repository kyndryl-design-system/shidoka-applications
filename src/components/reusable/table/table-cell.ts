import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import styles from './table-cell.scss';

import { SORT_DIRECTION, TABLE_CELL_ALIGN } from './defs';

/**
 * `kyn-td` Web Component.
 *
 * Represents a table cell (data cell) within Shidoka's design system tables.
 * Allows customization of alignment and can reflect the sort direction when
 * used within sortable columns.
 *
 * @slot unnamed - The content slot for adding table data inside the cell.
 */
@customElement('kyn-td')
export class TableCell extends LitElement {
  static override styles = [styles];

  /** Determines the text alignment of the table cell's content. */
  @property({ type: String, reflect: true })
  align: TABLE_CELL_ALIGN = TABLE_CELL_ALIGN.LEFT;

  /** Reflects the sort direction when used within sortable columns. */
  @property({ type: String })
  sortDirection: SORT_DIRECTION = SORT_DIRECTION.ASC;

  override render() {
    return html`
      <div class="slot-wrapper">
        <slot></slot>
      </div>
    `;
  }
}

// Define the custom element in the global namespace
declare global {
  interface HTMLElementTagNameMap {
    'kyn-td': TableCell;
  }
}
