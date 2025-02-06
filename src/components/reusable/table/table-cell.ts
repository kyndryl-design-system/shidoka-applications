import { html, LitElement, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ContextConsumer } from '@lit/context';
import { tableContext, TableContextType } from './table-context';

import styles from './table-cell.scss';

import { TABLE_CELL_ALIGN } from './defs';

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

  @property({ type: Boolean, reflect: true })
  dense = false;

  /** aria role.
   * @internal
   */
  @property({ type: String, reflect: true })
  override role = 'cell';

  /** Determines the text alignment of the table cell's content. */
  @property({ type: String, reflect: true })
  align: TABLE_CELL_ALIGN = TABLE_CELL_ALIGN.LEFT;

  /**
   * Sets a fixed width for the cell.
   * Accepts standard CSS width values (e.g., '150px', '50%').
   */
  @property({ type: String, reflect: true })
  width = '';

  /**
   * Sets a maximum width for the cell; contents exceeding this limit will be truncated with ellipsis.
   * Accepts standard CSS width values (e.g., '150px', '50%').
   */
  @property({ type: String, reflect: true })
  maxWidth = '';

  /**
   * Sets a minimum width for the cell;
   * Accepts standard CSS width values (e.g., '150px', '50%').
   * @type {string}
   */
  @property({ type: String, reflect: true })
  minWidth = '';

  /** Disables the cell. */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /** Dim the cell. */
  @property({ type: Boolean, reflect: true })
  dimmed = false;

  /**
   * Context consumer for the table context.
   * Updates the cell's dense properties when the context changes.
   * @private
   * @ignore
   * @type {ContextConsumer<TableContextType, TableCell>}
   */
  @state()
  // @ts-expect-error - This is a context consumer
  private _contextConsumer = new ContextConsumer(
    this,
    tableContext,
    (context) => {
      if (context) this.handleContextChange(context);
    },
    true
  );

  /**
   * Updates the cell's dense properties when the context changes.
   * @param {TableContextType} context - The updated context.
   */
  handleContextChange = ({ dense }: TableContextType) => {
    if (typeof dense == 'boolean') {
      this.dense = dense;
    }
  };

  override updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);
    if (this.maxWidth && changedProperties.has('maxWidth')) {
      this.style.setProperty('--kyn-td-max-width', this.maxWidth);
    }

    if (this.width && changedProperties.has('width')) {
      this.style.setProperty('--kyn-td-width', this.width);
    }

    if (this.minWidth && changedProperties.has('minWidth')) {
      this.style.setProperty('--kyn-td-min-width', this.minWidth);
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
