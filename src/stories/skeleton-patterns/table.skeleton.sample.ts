import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

import '../../components/reusable/loaders/skeleton';
import '../../components/reusable/table';

/**  Sample Lit component to show table skeleton pattern. */
@customElement('table-skeleton-sample-component')
export class TableSkeletonComponent extends LitElement {
  override render() {
    return html`
      <div>
        <kyn-table-container aria-live="polite" aria-busy="true">
          <kyn-table>
            <kyn-thead>
              <kyn-tr>
                ${Array(7)
                  .fill(null)
                  .map(
                    (_, i) => html`
                      <kyn-th>
                        <span>${`Column ${i + 1}`}</span>
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
                      ${Array(7)
                        .fill(null)
                        .map(
                          () => html`
                            <kyn-td>
                              <kyn-skeleton
                                size="table-cell"
                                aria-hidden="true"
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
