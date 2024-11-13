import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import '../loaders/skeleton';
import '../pagination/pagination.skeleton';
import '.';

import styles from './table.scss';

/**
 * `kyn-table-skeleton` Web Component.
 * A skeleton loading state for the table component that mirrors its structure.
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

      kyn-thead kyn-tr {
        background-color: var(--kd-color-background-ui-soft);
      }

      :host {
        display: block;
        width: 100%;
      }

      .pagination-skeleton-wrapper {
        margin-top: 24px;
        display: flex;
        width: 100%;
        justify-content: flex-end;
      }
    `,
  ];

  /** Number of skeleton rows to display. */
  @property({ type: Number })
  rows = 5;

  /** Shows/hides pagination skeleton. */
  @property({ type: Boolean })
  showPagination = false;

  /** Shows/hides checkbox column. */
  @property({ type: Boolean })
  checkboxSelection = false;

  /** Sets dense mode value. */
  @property({ type: Boolean })
  dense = false;

  /** Sets striped rows value. */
  @property({ type: Boolean })
  striped = false;

  /** Show/hide table header. */
  @property({ type: Boolean })
  hideTableHeader = false;

  /** Sticky header. */
  @property({ type: Boolean })
  stickyHeader = false;

  /** Sets title to display in the table toolbar. */
  @property({ type: String })
  tableTitle = '';

  /** Sets subtitle to display in the table toolbar. */
  @property({ type: String })
  tableSubtitle = '';

  override render() {
    return html`
      <div>
        ${this.tableTitle || this.tableSubtitle
          ? html`<kyn-table-toolbar
              tableTitle=${this.tableTitle}
              tableSubtitle=${this.tableSubtitle}
            ></kyn-table-toolbar>`
          : html`<div class="skeleton-title-wrapper">
              ${!this.hideTableHeader && !this.tableTitle
                ? html`<kyn-skeleton
                    class="skeleton-title"
                    elementType="title"
                  ></kyn-skeleton>`
                : null}
              ${!this.hideTableHeader && !this.tableSubtitle
                ? html`<kyn-skeleton
                    class="skeleton-subtitle"
                    elementType="subtitle"
                  ></kyn-skeleton>`
                : null}
            </div>`}
        <kyn-table-container>
          <kyn-table
            role="table"
            ?dense=${this.dense}
            ?striped=${this.striped}
            ?stickyHeader=${this.stickyHeader}
            ?checkboxSelection=${this.checkboxSelection}
          >
            <kyn-thead role="rowgroup">
              <kyn-tr role="row" disabled>
                ${Array(7)
                  .fill(null)
                  .map(
                    (_) =>
                      html`<kyn-th role="columnheader">
                        ${this.renderSkeletonCell()}
                      </kyn-th>`
                  )}
              </kyn-tr>
            </kyn-thead>

            <kyn-tbody role="rowgroup">
              ${Array(this.rows)
                .fill(null)
                .map(
                  (_) => html`
                    <kyn-tr role="row" disabled>
                      ${Array(7)
                        .fill(null)
                        .map(
                          (_) =>
                            html`<kyn-td role="cell">
                              ${this.renderSkeletonCell()}
                            </kyn-td>`
                        )}
                    </kyn-tr>
                  `
                )}
            </kyn-tbody>
          </kyn-table>
        </kyn-table-container>
        ${this.showPagination
          ? html`
              <div class="pagination-skeleton-wrapper">
                <kyn-pagination-skeleton></kyn-pagination-skeleton>
              </div>
            `
          : null}
      </div>
    `;
  }

  private renderSkeletonCell() {
    return html`
      <kyn-skeleton
        class="varying-width"
        style="--width: ${this.getRandomWidth()}"
        elementType="table-cell"
      ></kyn-skeleton>
    `;
  }

  private getRandomWidth() {
    const widths = ['45%', '60%', '75%', '85%', '90%', '95%'];
    return widths[Math.floor(Math.random() * widths.length)];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-table-skeleton': TableSkeleton;
  }
}
