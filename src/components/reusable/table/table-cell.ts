import { html, LitElement, PropertyValues } from 'lit';
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

  @property({ type: Boolean })
  accessor dense = false;

  /** Determines the text alignment of the table cell's content. */
  @property({ type: String, reflect: true })
  accessor align: TABLE_CELL_ALIGN = TABLE_CELL_ALIGN.LEFT;

  /** Reflects the sort direction when used within sortable columns. */
  @property({ type: String })
  accessor sortDirection: SORT_DIRECTION = SORT_DIRECTION.ASC;

  /**
   * Sets a fixed width for the cell.
   * Accepts standard CSS width values (e.g., '150px', '50%').
   */
  @property({ type: String })
  accessor width = '';

  /**
   * Sets a maximum width for the cell; contents exceeding this limit will be truncated with ellipsis.
   * Accepts standard CSS width values (e.g., '150px', '50%').
   */
  @property({ type: String })
  accessor maxWidth = '';

  /** Truncates the cell's contents with ellipsis. */
  @property({ type: Boolean })
  accessor ellipsis = false;

  override updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);
    if (this.maxWidth && changedProperties.has('maxWidth')) {
      this.style.setProperty('--kyn-td-max-width', this.maxWidth);
    }

    if (this.width && changedProperties.has('width')) {
      this.style.setProperty('--kyn-td-width', this.width);
    }
  }

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
