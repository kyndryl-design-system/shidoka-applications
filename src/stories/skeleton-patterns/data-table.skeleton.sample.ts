import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

import '../../components/reusable/loaders/skeleton';
import '../../components/reusable/table';

import dataTableStyles from '../../components/reusable/table/data-table.scss';

/**  Sample Lit component to show table skeleton pattern. */
@customElement('table-skeleton-sample-component')
export class TableSkeletonComponent extends LitElement {
  static override styles = [dataTableStyles];

  private columnNames = [
    'ID',
    'First Name',
    'Last Name',
    'Birthday',
    'Age',
    'Full Name',
    'Value',
  ];

  override render() {
    return html`
      <div>
        <kyn-table-toolbar tableTitle=${'Skeleton Table Example'}>
        </kyn-table-toolbar>
        <kyn-table-container aria-live="polite" aria-busy="true">
          <kyn-table>
            <kyn-thead>
              <kyn-tr>
                ${this.columnNames.map(
                  (columnName) => html`
                    <kyn-th>
                      <span>${columnName}</span>
                    </kyn-th>
                  `
                )}
              </kyn-tr>
            </kyn-thead>

            <kyn-tbody>
              ${Array(5)
                .fill(null)
                .map(
                  () => html`
                    <kyn-tr>
                      ${this.columnNames.map(
                        () => html`
                          <kyn-td>
                            <kyn-skeleton
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
}

declare global {
  interface HTMLElementTagNameMap {
    'table-skeleton-sample-component': TableSkeletonComponent;
  }
}
