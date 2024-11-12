import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import '../loaders/skeleton';
import '.';

import dataTableStyles from './data-table.scss';
import { css } from 'lit';

/**
 * `kyn-table-skeleton` Web Component.
 * A skeleton loading state for the table component that mirrors its structure and features.
 */
@customElement('kyn-table-skeleton')
export class TableSkeleton extends LitElement {
  static override styles = [
    dataTableStyles,
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

      .kyn-th {
        display: flex;
        align-items: center;
      }

      .kyn-th kyn-skeleton {
        display: block;
        height: 1.2rem;
      }
    `,
  ];

  /** Number of rows to display in the skeleton */
  @property({ type: Number })
  rows = 5;

  /**
   * Array of column labels for screen reader accessibility.
   */
  @property({ type: Array })
  columnLabels: string[] = [];

  /** Title to display in the table toolbar */
  @property({ type: String })
  tableTitle = 'Loading...';

  /** Whether the table is in dense mode */
  @property({ type: Boolean })
  dense = false;

  /** Whether the table has striped rows */
  @property({ type: Boolean })
  striped = false;

  /** Whether the table header is sticky */
  @property({ type: Boolean })
  stickyHeader = false;

  /** Whether the table has checkbox selection */
  @property({ type: Boolean })
  checkboxSelection = false;

  override render() {
    return html`
      <div>
        <kyn-table-toolbar tableTitle=${this.tableTitle}> </kyn-table-toolbar>
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
          >
            <kyn-thead>
              <kyn-tr>
                ${this.checkboxSelection
                  ? html`
                      <kyn-th>
                        <span class="visually-hidden">Select all rows</span>
                        <kyn-skeleton elementType="checkbox"></kyn-skeleton>
                      </kyn-th>
                    `
                  : ''}
                ${Array(this.columns)
                  .fill(null)
                  .map(
                    (_, index) => html`
                      <kyn-th>
                        <span class="visually-hidden"
                          >${this.getColumnLabel(index)}</span
                        >
                        <kyn-skeleton
                          class="varying-width"
                          style="--width: ${this.getRandomWidth()}"
                          elementType="table-cell"
                        ></kyn-skeleton>
                      </kyn-th>
                    `
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
                        ? html`
                            <kyn-td>
                              <span class="visually-hidden"
                                >Select row ${rowIndex + 1}</span
                              >
                              <kyn-skeleton
                                elementType="checkbox"
                              ></kyn-skeleton>
                            </kyn-td>
                          `
                        : ''}
                      ${Array(this.columns)
                        .fill(null)
                        .map(
                          (_, colIndex) => html`
                            <kyn-td>
                              <span class="visually-hidden"
                                >Loading data for
                                ${this.getColumnLabel(colIndex)}</span
                              >
                              <kyn-skeleton
                                class="varying-width"
                                style="--width: ${this.getRandomWidth()}"
                                elementType="table-cell"
                              ></kyn-skeleton>
                            </kyn-td>
                          `
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

  private getRandomWidth() {
    // Generate random widths for more realistic appearance
    const widths = ['60%', '75%', '85%', '90%'];
    return widths[Math.floor(Math.random() * widths.length)];
  }

  private getColumnLabel(index: number) {
    return this.columnLabels[index] || `Column ${index + 1}`;
  }

  private get columns() {
    return this.columnLabels.length || 7;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-table-skeleton': TableSkeleton;
  }
}
