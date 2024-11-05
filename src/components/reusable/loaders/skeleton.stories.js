import { html } from 'lit';
import './index';
import '../card/index';
import '../table/index';

export default {
  title: 'Components/Loaders/Skeleton',
  component: 'kyn-skeleton',
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
};

export const CardPattern = {
  render: () => {
    return html`
      <div class="card-pattern" aria-live="polite" aria-busy="true">
        <kyn-card>
          <kyn-skeleton size="large" aria-hidden="true"></kyn-skeleton>
          <kyn-skeleton size="title" aria-hidden="true"></kyn-skeleton>
          <kyn-skeleton size="subtitle" aria-hidden="true"></kyn-skeleton>
          <div class="card-body">
            <kyn-skeleton size="body-text" aria-hidden="true"></kyn-skeleton>
          </div>
        </kyn-card>
      </div>
    `;
  },
};

export const CardPatternWithLogo = {
  render: () => {
    return html`
      <div class="card-pattern" aria-live="polite" aria-busy="true">
        <kyn-card>
          <kyn-skeleton size="card-logo" aria-hidden="true"></kyn-skeleton>
          <kyn-skeleton size="title" aria-hidden="true"></kyn-skeleton>
          <kyn-skeleton size="subtitle" aria-hidden="true"></kyn-skeleton>
          <div class="card-body">
            <kyn-skeleton size="body-text" aria-hidden="true"></kyn-skeleton>
          </div>
        </kyn-card>
      </div>
    `;
  },
};

export const TablePattern = {
  render: () => {
    return html`
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
    `;
  },
};

export const Block = {
  render: () => {
    return html`
      <kyn-skeleton size="large" aria-hidden="true"></kyn-skeleton>
    `;
  },
};

export const Inline = {
  render: () => {
    return html`
      <kyn-skeleton inline size="medium" aria-hidden="true"></kyn-skeleton>
    `;
  },
};
