import { html } from 'lit';
import { createOptionsArray } from '../../../common/helpers/helpers';
import './index';
import {
  HEALTH_INDICATOR_STATUS,
  HEALTH_INDICATOR_STATUS_LABELS,
} from './defs';

export default {
  title: 'Components/Feedback & Status/Health Indicator',
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
      healthIndicatorId="health-indicator-default"
      style="max-width: 280px;"
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
      <div style="display: grid; gap: var(--kd-spacing-24); max-width: 280px;">
        ${statuses.map(
          (status) => html`
            <kyn-health-indicator
              status=${status}
              label=${HEALTH_INDICATOR_STATUS_LABELS[status]}
            ></kyn-health-indicator>
          `
        )}
      </div>
    `;
  },
};

export const DesignReference = {
  parameters: {
    controls: { disable: true },
  },
  render: () => html`
    <div
      style="
        display: grid;
        grid-template-columns: repeat(2, minmax(220px, 280px));
        gap: var(--kd-spacing-48);
        align-items: start;
      "
    >
      <div style="display: grid; gap: var(--kd-spacing-24);">
        <kyn-health-indicator
          status="healthy"
          label="Label"
        ></kyn-health-indicator>
        <kyn-health-indicator
          status="warning"
          label="Label"
        ></kyn-health-indicator>
        <kyn-health-indicator
          status="at-risk"
          label="Label"
        ></kyn-health-indicator>
        <kyn-health-indicator
          status="critical"
          label="Label"
        ></kyn-health-indicator>
      </div>
      <div style="display: grid; gap: var(--kd-spacing-24);">
        <kyn-health-indicator
          status="healthy"
          label="Healthy"
        ></kyn-health-indicator>
        <kyn-health-indicator
          status="warning"
          label="Warning"
        ></kyn-health-indicator>
        <kyn-health-indicator
          status="at-risk"
          label="At Risk"
        ></kyn-health-indicator>
        <kyn-health-indicator
          status="critical"
          label="Critical"
        ></kyn-health-indicator>
      </div>
    </div>
  `,
};
