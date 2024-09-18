import { html } from 'lit';
import './index';

export default {
  title: 'Components/Progress Bar',
  component: 'kyn-progress-bar',
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
  argTypes: {
    value: { control: 'number' },
    max: { control: 'number' },
    label: { control: 'text' },
    status: {
      control: 'select',
      options: ['active', 'success', 'error'],
    },
    animationSpeed: {
      control: 'select',
      options: ['slow', 'normal', 'fast'],
    },
    simulate: { control: 'boolean' },
  },
};

const Template = (args) => html`
  <kyn-progress-bar
    .value=${args.value}
    .max=${args.max}
    .label=${args.label}
    .helperText=${args.helperText}
    .status=${args.status}
    .animationSpeed=${args.animationSpeed}
    .simulate=${args.simulate}
    .unit=${args.unit}
  ></kyn-progress-bar>
`;

export const Default = Template.bind({});
Default.args = {
  status: 'active',
  value: 65,
  max: 100,
  label: 'Default Progress Bar',
  helperText: '',
  animationSpeed: 'normal',
  simulate: false,
  unit: '%',
};

export const Indeterminate = Template.bind({});
Indeterminate.args = {
  ...Default.args,
  status: 'active',
  label: 'Indeterminate Progress Bar',
  value: null,
};

export const Simulated = Template.bind({});
Simulated.args = {
  status: 'active',
  max: 728,
  label: 'Simulated Progress Bar (units -- MB)',
  animationSpeed: 'normal',
  simulate: true,
  unit: 'MB',
};

export const Error = Template.bind({});
Error.args = {
  ...Default.args,
  label: 'Error Progress Bar',
  helperText: 'Error: Operation failed.',
  value: 100,
  status: 'error',
};
