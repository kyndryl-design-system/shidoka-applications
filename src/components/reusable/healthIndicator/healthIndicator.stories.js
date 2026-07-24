import { html } from 'lit';
import { createOptionsArray } from '../../../common/helpers/helpers';
import './index';
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
      style="max-width: 84px;"
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
