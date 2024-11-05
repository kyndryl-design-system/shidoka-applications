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
      <div class="card-pattern">
        <kyn-card>
          <kyn-skeleton size="large"></kyn-skeleton>
          <kyn-skeleton size="title"></kyn-skeleton>
          <kyn-skeleton size="subtitle"></kyn-skeleton>
          <div class="card-body">
            <kyn-skeleton size="body-text"></kyn-skeleton>
          </div>
        </kyn-card>
      </div>
    `;
  },
};

export const CardPatternWithLogo = {
  render: () => {
    return html`
      <div class="card-pattern">
        <kyn-card>
          <kyn-skeleton size="card-logo"></kyn-skeleton>
          <kyn-skeleton size="title"></kyn-skeleton>
          <kyn-skeleton size="subtitle"></kyn-skeleton>
          <div class="card-body">
            <kyn-skeleton size="body-text"></kyn-skeleton>
          </div>
        </kyn-card>
      </div>
    `;
  },
};

export const TablePattern = {
  render: () => {
    return html`
      <div style="padding: 0px;">
        <kyn-table-container>
          <kyn-table>
            <kyn-thead>
              <kyn-tr>
                ${Array(7)
                  .fill(null)
                  .map(
                    () => html`
                      <kyn-th
                        ><kyn-skeleton size="table-cell"></kyn-skeleton
                      ></kyn-th>
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
                            <kyn-td
                              ><kyn-skeleton size="table-cell"></kyn-skeleton
                            ></kyn-td>
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
  },
};

export const Block = {
  render: () => {
    return html` <kyn-skeleton size="large"></kyn-skeleton> `;
  },
};

export const Inline = {
  render: () => {
    return html` <kyn-skeleton inline size="medium"></kyn-skeleton> `;
  },
};
