import { html } from 'lit';
import { createOptionsArray } from '../../../common/helpers/helpers';
import './index';
import { HEALTH_INDICATOR_STATUS } from './defs';

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
  value: undefined,
  hideLabel: false,
};

const statusPercentages = {
  [HEALTH_INDICATOR_STATUS.HEALTHY]: 100,
  [HEALTH_INDICATOR_STATUS.WARNING]: 72,
  [HEALTH_INDICATOR_STATUS.ERROR]: 46,
  [HEALTH_INDICATOR_STATUS.CRITICAL]: 26,
};

export const Default = {
  args,
  render: (args) => {
    const fallbackValue = statusPercentages[args.status] ?? 100;
    const resolvedValue = Number.isFinite(args.value)
      ? args.value
      : fallbackValue;

    return html`
      <kyn-health-indicator
        status=${args.status}
        label=${args.label}
        .value=${resolvedValue}
        ?hideLabel=${args.hideLabel}
        style="max-width: 84px;"
      ></kyn-health-indicator>
    `;
  },
};
