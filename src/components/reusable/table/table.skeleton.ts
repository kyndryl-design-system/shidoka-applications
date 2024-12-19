import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import '../loaders/skeleton';
import '../pagination/pagination.skeleton';
import '.';

import styles from './table.scss';
import '../globalFilter/globalFilter.skeleton.sample';

/**
 * `kyn-table-skeleton` Web Component.
 * A skeleton loading state for the table component that mirrors its structure.
 */
@customElement('kyn-table-skeleton')
export class TableSkeleton extends LitElement {
  static override styles = [
    styles,
    css`
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
        background-color: var(--kd-color-background-container-soft);
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

  /** Sets dense mode value. */
  @property({ type: Boolean })
  dense = false;

  /** Sets striped rows value. */
  @property({ type: Boolean })
  striped = false;

  /** Show/hide table header. */
  @property({ type: Boolean })
  hideTableTitles = false;

  /** Fixed layout boolean. */
  @property({ type: Boolean })
  fixedLayout = false;

  /** Sets title to display in the table toolbar. */
  @property({ type: String })
  tableTitle = '';

  /** Sets subtitle to display in the table toolbar. */
  @property({ type: String })
  tableSubtitle = '';

  /** Shows/hides golbal filter skeleton. */
  @property({ type: Boolean })
  showGlobalFilter = false;

  override render() {
    return html`
      <div>
        ${!this.hideTableTitles
          ? html`
              ${this.tableTitle || this.tableSubtitle
                ? html`<kyn-table-toolbar
                    tableTitle=${this.tableTitle}
                    tableSubtitle=${this.tableSubtitle}
                  ></kyn-table-toolbar>`
                : html`<div class="skeleton-title-wrapper">
                    <kyn-skeleton
                      class="skeleton-title"
                      width="122px"
                    ></kyn-skeleton>
                    <kyn-skeleton
                      class="skeleton-subtitle"
                      width="61px"
                    ></kyn-skeleton>
                  </div>`}
            `
          : null}
        ${this.showGlobalFilter
          ? html` <sample-filter-skeleton-component></sample-filter-skeleton-component>`
          : null}
        <kyn-table-container>
          <kyn-table
            role="table"
            ?dense=${this.dense}
            ?striped=${this.striped}
            ?fixedLayout=${this.fixedLayout}
          >
            <kyn-thead role="rowgroup">
              <kyn-tr role="row" disabled>
                ${Array(5)
                  .fill(null)
                  .map(
                    (_, index) =>
                      html`<kyn-th role="columnheader">
                        <span class="visually-hidden"
                          >Loading column ${index + 1}</span
                        >
                        ${this.renderSkeletonCell('thead')}
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
                      ${Array(5)
                        .fill(null)
                        .map(
                          (_) =>
                            html`<kyn-td role="cell">
                              ${this.renderSkeletonCell('tbody')}
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

  private renderSkeletonCell(type: 'thead' | 'tbody') {
    const width = type === 'thead' ? '192px' : '114px';
    const shade = type === 'thead' ? 'dark' : '';
    return html`
      <kyn-skeleton width=${width} height="16px" shade=${shade}></kyn-skeleton>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-table-skeleton': TableSkeleton;
  }
}
