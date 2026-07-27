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
