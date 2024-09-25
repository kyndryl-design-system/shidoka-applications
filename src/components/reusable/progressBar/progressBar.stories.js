import { html } from 'lit';
import './index';

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
    status: {
      control: 'select',
      options: ['indeterminate', 'active', 'success', 'error'],
    },
  },
};

const Template = (args) => html`
  <kyn-progress-bar
    .showInlineLoadStatus=${args.showInlineLoadStatus}
    .status=${args.status}
    .value=${args.value}
    .max=${args.max}
    .label=${args.label}
    .informationalTooltipText=${args.informationalTooltipText}
    .helperText=${args.helperText}
    .unit=${args.unit}
  ></kyn-progress-bar>
`;

export const Default = Template.bind({});
Default.args = {
  showInlineLoadStatus: false,
  status: 'active',
  value: 65,
  max: 100,
  label: 'Default Progress Bar (Fixed % Value)',
  informationalTooltipText: 'Example tooltip text.',
  helperText: '',
  unit: '%',
};

export const Indeterminate = Template.bind({});
Indeterminate.args = {
  ...Default.args,
  status: 'indeterminate',
  value: null,
  label: 'Indeterminate Progress Bar',
};

export const SimulatedSuccess = Template.bind({});
SimulatedSuccess.args = {
  showInlineLoadStatus: true,
  status: 'active',
  value: null,
  max: 728,
  label: 'Simulated Successful Progression (MB)',
  informationalTooltipText: '',
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
