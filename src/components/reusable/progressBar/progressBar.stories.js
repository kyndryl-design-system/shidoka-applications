import { html } from 'lit';

import './index';
import '../tooltip';

import informationIcon from '@carbon/icons/es/information/16';

export default {
  title: 'Components/Progress Bar',
  component: 'kyn-progress-bar',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/AIX4LLzoDHnFCXzQCiPHJk/Vienna?node-id=4308-129&node-type=canvas&t=NIQViMjgDrgdLGdi-0',
    },
  },
  argTypes: {
    showInlineLoadStatus: { control: 'boolean' },
    value: { control: 'number' },
    max: { control: 'number' },
    showActiveHelperText: { control: 'boolean' },
    status: {
      control: 'select',
      options: ['active', 'success', 'error'],
    },
  },
};

const Template = (args) => html`
  <kyn-progress-bar
    .showInlineLoadStatus=${args.showInlineLoadStatus}
    .showActiveHelperText=${args.showActiveHelperText}
    .status=${args.status}
    .value=${args.value}
    .max=${args.max}
    .label=${args.label}
    .progressBarId=${args.progressBarId}
    .helperText=${args.helperText}
    .unit=${args.unit}
  >
    ${args.unnamed
      ? html`<kyn-tooltip slot="unnamed">
          <span slot="anchor"
            ><kd-icon .icon=${informationIcon}></kd-icon
          ></span>
          ${args.unnamed}
        </kyn-tooltip>`
      : ''}
  </kyn-progress-bar>
`;

export const Default = Template.bind({});
Default.args = {
  showInlineLoadStatus: false,
  showActiveHelperText: true,
  status: 'active',
  value: 65,
  max: 100,
  label: 'Default Progress Bar (Fixed % Value)',
  helperText: '',
  progressBarId: 'example-progress-bar',
  unit: '%',
  unnamed: 'Example tooltip content.',
};

export const Indeterminate = Template.bind({});
Indeterminate.args = {
  ...Default.args,
  value: null,
  max: null,
  helperText: '',
  label: 'Indeterminate Progress Bar',
};

export const SimulatedSuccess = Template.bind({});
SimulatedSuccess.args = {
  ...Default.args,
  showInlineLoadStatus: true,
  status: 'active',
  value: null,
  max: 650,
  label: 'Simulated Successful Progression (MB)',
  helperText: '',
  unit: 'MB',
};

export const Error = Template.bind({});
Error.args = {
  ...Default.args,
  showInlineLoadStatus: true,
  status: 'error',
  label: 'Error Progress Bar',
  helperText: 'Error: Operation failed.',
  value: 100,
};
