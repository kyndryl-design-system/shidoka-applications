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
      options: ['active', 'finished', 'success', 'error'],
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
  ></kyn-progress-bar>
`;

export const Default = Template.bind({});
Default.args = {
  status: 'active',
  value: 50,
  max: 100,
  label: 'Default Progress Bar',
  helperText: '',
  animationSpeed: 'normal',
  simulate: false,
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
  label: 'Simulated Progress Bar',
  animationSpeed: 'normal',
  simulate: true,
};

export const Success = Template.bind({});
Success.args = {
  ...Default.args,
  label: 'Success Progress Bar',
  helperText: 'Operation completed successfully.',
  value: 100,
  status: 'success',
};

export const Error = Template.bind({});
Error.args = {
  ...Default.args,
  label: 'Error Progress Bar',
  helperText: 'Error: Operation failed.',
  value: 75,
  status: 'error',
};
