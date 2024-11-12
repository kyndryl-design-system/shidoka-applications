import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

import '../loaders/skeleton';
import '.';

import dataTableStyles from './data-table.scss';

/**  Sample Lit component to show table skeleton pattern. */
@customElement('kyn-table-skeleton')
export class TableSkeleton extends LitElement {
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
    'kyn-table-skeleton': TableSkeleton;
  }
}
