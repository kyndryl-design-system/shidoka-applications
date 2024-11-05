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

export const CardPattern = {
  render: () => {
    return html`
      <div class="card-pattern">
        <kyn-card>
          <kyn-skeleton size="large"></kyn-skeleton>
          <kyn-skeleton size="title"></kyn-skeleton>
          <kyn-skeleton size="subtitle"></kyn-skeleton>
          <div class="card-body">
            <kyn-skeleton size="small"></kyn-skeleton>
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
                <kyn-th><kyn-skeleton size="table-cell"></kyn-skeleton></kyn-th>

                <kyn-th><kyn-skeleton size="table-cell"></kyn-skeleton></kyn-th>

                <kyn-th><kyn-skeleton size="table-cell"></kyn-skeleton></kyn-th>

                <kyn-th><kyn-skeleton size="table-cell"></kyn-skeleton></kyn-th>

                <kyn-th><kyn-skeleton size="table-cell"></kyn-skeleton></kyn-th>

                <kyn-th><kyn-skeleton size="table-cell"></kyn-skeleton></kyn-th>

                <kyn-th><kyn-skeleton size="table-cell"></kyn-skeleton></kyn-th>
              </kyn-tr>
            </kyn-thead>

            <kyn-tbody>
              ${[1, 2, 3, 4, 5].map(
                () => html`
                  <kyn-tr>
                    <kyn-td
                      ><kyn-skeleton size="table-cell"></kyn-skeleton
                    ></kyn-td>

                    <kyn-td
                      ><kyn-skeleton size="table-cell"></kyn-skeleton
                    ></kyn-td>

                    <kyn-td
                      ><kyn-skeleton size="table-cell"></kyn-skeleton
                    ></kyn-td>

                    <kyn-td
                      ><kyn-skeleton size="table-cell"></kyn-skeleton
                    ></kyn-td>

                    <kyn-td
                      ><kyn-skeleton size="table-cell"></kyn-skeleton
                    ></kyn-td>

                    <kyn-td
                      ><kyn-skeleton size="table-cell"></kyn-skeleton
                    ></kyn-td>

                    <kyn-td
                      ><kyn-skeleton size="table-cell"></kyn-skeleton
                    ></kyn-td>
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
