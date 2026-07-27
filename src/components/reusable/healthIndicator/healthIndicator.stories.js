import { html } from 'lit';
import { createOptionsArray } from '../../../common/helpers/helpers';
import './index';
import '../table';
import {
  HEALTH_INDICATOR_STATUS,
  HEALTH_INDICATOR_STATUS_LABELS,
} from './defs';

export default {
  title: 'Components/Indicators & Labels/Health Indicator',
  component: 'kyn-health-indicator',
  tags: ['new'],
  argTypes: {
    status: {
      options: createOptionsArray(HEALTH_INDICATOR_STATUS),
      control: { type: 'select' },
    },
    label: {
      control: { type: 'text' },
    },
    value: {
      control: { type: 'number' },
    },
    hideLabel: {
      control: { type: 'boolean' },
    },
  },
};

const args = {
  status: HEALTH_INDICATOR_STATUS.HEALTHY,
  label: 'Label',
  value: null,
  hideLabel: false,
};

export const Default = {
  args,
  render: (args) => html`
    <kyn-health-indicator
      status=${args.status}
      label=${args.label}
      .value=${args.value}
      ?hideLabel=${args.hideLabel}
    ></kyn-health-indicator>
  `,
};

export const Gallery = {
  parameters: {
    controls: { disable: true },
  },
  render: () => {
    const statuses = createOptionsArray(HEALTH_INDICATOR_STATUS);

    return html`
      <div
        style="
          display: grid;
          grid-template-columns: repeat(2, minmax(84px, max-content));
          gap: var(--kd-spacing-48);
          align-items: start;
        "
      >
        <div style="display: grid; gap: var(--kd-spacing-24);">
          ${statuses.map(
            (status) => html`
              <kyn-health-indicator
                status=${status}
                label="Label"
              ></kyn-health-indicator>
            `
          )}
        </div>
        <div style="display: grid; gap: var(--kd-spacing-24);">
          ${statuses.map(
            (status) => html`
              <kyn-health-indicator
                status=${status}
                label=${HEALTH_INDICATOR_STATUS_LABELS[status]}
              ></kyn-health-indicator>
            `
          )}
        </div>
      </div>
    `;
  },
};

export const InTable = {
  parameters: {
    controls: { disable: true },
  },
  render: () => {
    const rows = [
      {
        id: 'svc-1',
        service: 'Billing API',
        status: HEALTH_INDICATOR_STATUS.HEALTHY,
        value: 100,
      },
      {
        id: 'svc-2',
        service: 'Notifications',
        status: HEALTH_INDICATOR_STATUS.WARNING,
        value: 72,
      },
      {
        id: 'svc-3',
        service: 'Search',
        status: HEALTH_INDICATOR_STATUS.ERROR,
        value: 46,
      },
      {
        id: 'svc-4',
        service: 'Identity',
        status: HEALTH_INDICATOR_STATUS.CRITICAL,
        value: 26,
      },
    ];

    return html`
      <kyn-table-toolbar
        .tableTitle=${'Service Health'}
        tableSubtitle=${'Health Indicator inside data table cells'}
      ></kyn-table-toolbar>

      <kyn-table-container>
        <kyn-table>
          <kyn-thead>
            <kyn-header-tr>
              <kyn-th>Service</kyn-th>
              <kyn-th>Health</kyn-th>
            </kyn-header-tr>
          </kyn-thead>
          <kyn-tbody>
            ${rows.map(
              (row) => html`
                <kyn-tr .rowId=${row.id} key="row-${row.id}">
                  <kyn-td>${row.service}</kyn-td>
                  <kyn-td>
                    <kyn-health-indicator
                      status=${row.status}
                      label=${HEALTH_INDICATOR_STATUS_LABELS[row.status]}
                      .value=${row.value}
                      ?hideLabel=${true}
                      style="--kyn-health-indicator-width: 100%;"
                    ></kyn-health-indicator>
                  </kyn-td>
                </kyn-tr>
              `
            )}
          </kyn-tbody>
        </kyn-table>
      </kyn-table-container>
    `;
  },
};
