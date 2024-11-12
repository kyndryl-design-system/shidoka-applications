import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import '../loaders/skeleton';
import '.';

import styles from './table.scss';

/**
 * `kyn-table-skeleton` Web Component.
 * A skeleton loading state for the table component that mirrors its structure and features.
 */
@customElement('kyn-table-skeleton')
export class TableSkeleton extends LitElement {
  static override styles = [
    styles,
    css`
      .varying-width {
        --skeleton-width: var(--width, 100%);
      }

      .visually-hidden {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }

      .skeleton-title-wrapper {
        padding: 8px 0 16px;
      }

      .skeleton-title {
        margin-bottom: 8px;
      }

      .kyn-th {
        display: flex;
        align-items: center;
      }

      .kyn-th kyn-skeleton {
        display: block;
        height: 1rem;
      }

      :host {
        display: block;
        width: 100%;
      }

      :host([fixedLayout]) table {
        table-layout: fixed;
      }

      :host(:not([fixedLayout])) table {
        table-layout: auto;
      }

      .ellipsis .kyn-td {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    `,
  ];

  /** Sets the ARIA role for the table */
  @property({ type: String, reflect: true })
  override role = 'table';

  /** Sets number of rows to display in the skeleton */
  @property({ type: Number })
  rows = 5;

  /**
   * Sets array of column labels for screen reader accessibility.
   */
  @property({ type: Array })
  columnLabels: string[] = [];

  /** Sets title to display in the table toolbar */
  @property({ type: String })
  tableTitle = '';

  /** Sets subtitle to display in the table toolbar */
  @property({ type: String })
  tableSubtitle = '';

  /**
   * dense: Boolean indicating whether the table should be displayed
   * in dense mode.
   * @type {boolean}
   * @default false
   */
  @property({ type: Boolean })
  dense = false;

  /**
   * striped: Boolean indicating whether rows should have alternate
   * coloring.
   * @type {boolean}
   * @default false
   */
  @property({ type: Boolean })
  striped = false;

  /**
   * stickyHeader: Boolean indicating whether the table header
   * should be sticky.
   * @type {boolean}
   * @default false
   */
  @property({ type: Boolean })
  stickyHeader = false;

  /**
   * checkboxSelection: Boolean indicating whether rows should be
   * selectable using checkboxes.
   * @type {boolean}
   * @default false
   */
  @property({ type: Boolean })
  checkboxSelection = false;

  /**
   * ellipsis: Boolean indicating whether the table should truncate
   * text content with an ellipsis.
   * @type {boolean}
   * @default false
   */
  @property({ type: Boolean })
  ellipsis = false;

  /**
   * fixedLayout: Boolean indicating whether the table should have a fixed layout.
   * This will set the table's layout to fixed, which means the table and column widths
   * will be determined by the width of the columns and not by the content of the cells.
   * @type {boolean}
   * @default false
   */
  @property({ type: Boolean, reflect: true })
  fixedLayout = false;

  /**
   * Generates a random width for skeleton cells to create a more natural loading appearance.
   * @returns {string} A random width value as a percentage
   * @private
   */
  private getRandomWidth() {
    // Generate random widths for more realistic appearance
    // Using a wider range of values for more variety
    const widths = ['45%', '60%', '75%', '85%', '90%', '95%'];
    return widths[Math.floor(Math.random() * widths.length)];
  }

  /**
   * Gets the label for a column at the specified index.
   * Falls back to a generic label if no specific label is provided.
   * @param {number} index - The column index
   * @returns {string} The column label
   * @private
   */
  private getColumnLabel(index: number) {
    return this.columnLabels[index] || `Column ${index + 1}`;
  }

  /**
   * Gets the number of columns to display.
   * Uses the length of columnLabels if provided, otherwise defaults to 7.
   * @returns {number} The number of columns
   * @private
   */
  private get columns() {
    return this.columnLabels.length || 7;
  }

  /**
   * Renders a skeleton cell with appropriate accessibility attributes.
   * @param {number} colIndex - The column index
   * @param {string} type - The type of cell (header or data)
   * @returns {TemplateResult} The rendered cell
   * @private
   */
  private renderSkeletonCell(colIndex: number, type: 'header' | 'data') {
    return html`
      <span class="visually-hidden">
        ${type === 'header'
          ? this.getColumnLabel(colIndex)
          : `Loading data for ${this.getColumnLabel(colIndex)}`}
      </span>
      <kyn-skeleton
        class="varying-width"
        style="--width: ${this.getRandomWidth()}"
        elementType="table-cell"
      ></kyn-skeleton>
    `;
  }

  /**
   * Renders a skeleton checkbox cell with appropriate accessibility attributes.
   * @param {number} rowIndex - The row index (optional, for data cells)
   * @returns {TemplateResult} The rendered checkbox cell
   * @private
   */
  private renderCheckboxCell(rowIndex?: number) {
    return html`
      <span class="visually-hidden">
        ${rowIndex === undefined
          ? 'Select all rows'
          : `Select row ${rowIndex + 1}`}
      </span>
      <kyn-skeleton elementType="checkbox"></kyn-skeleton>
    `;
  }

  override render() {
    return html`
      <div class="${this.ellipsis ? 'ellipsis' : ''}">
        ${this.tableTitle || this.tableSubtitle
          ? html`<kyn-table-toolbar
              tableTitle=${this.tableTitle}
              tableSubtitle=${this.tableSubtitle}
            ></kyn-table-toolbar>`
          : html`<div class="skeleton-title-wrapper">
              ${!this.tableTitle
                ? html`<kyn-skeleton
                    class="skeleton-title"
                    elementType="title"
                  ></kyn-skeleton>`
                : null}
              ${!this.tableSubtitle
                ? html`<kyn-skeleton
                    class="skeleton-subtitle"
                    elementType="subtitle"
                  ></kyn-skeleton>`
                : null}
            </div>`}
        <kyn-table-container
          aria-label="Loading table content"
          aria-live="polite"
          aria-busy="true"
        >
          <kyn-table
            ?dense=${this.dense}
            ?striped=${this.striped}
            ?stickyHeader=${this.stickyHeader}
            ?checkboxSelection=${this.checkboxSelection}
            ?fixedLayout=${this.fixedLayout}
            ?ellipsis=${this.ellipsis}
          >
            <kyn-thead>
              <kyn-tr>
                ${this.checkboxSelection
                  ? html`<kyn-th>${this.renderCheckboxCell()}</kyn-th>`
                  : ''}
                ${Array(this.columns)
                  .fill(null)
                  .map(
                    (_, index) =>
                      html`<kyn-th
                        >${this.renderSkeletonCell(index, 'header')}</kyn-th
                      >`
                  )}
              </kyn-tr>
            </kyn-thead>

            <kyn-tbody>
              ${Array(this.rows)
                .fill(null)
                .map(
                  (_, rowIndex) => html`
                    <kyn-tr>
                      ${this.checkboxSelection
                        ? html`<kyn-td
                            >${this.renderCheckboxCell(rowIndex)}</kyn-td
                          >`
                        : ''}
                      ${Array(this.columns)
                        .fill(null)
                        .map(
                          (_, colIndex) =>
                            html`<kyn-td
                              >${this.renderSkeletonCell(
                                colIndex,
                                'data'
                              )}</kyn-td
                            >`
                        )}
                    </kyn-tr>
                  `
                )}
            </kyn-tbody>
          </kyn-table>
        </kyn-table-container>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-table-skeleton': TableSkeleton;
  }
}
