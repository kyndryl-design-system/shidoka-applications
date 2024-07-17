import { html } from 'lit';
import './index';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Components/Stepper',
  component: 'kyn-stepper',
  subcomponents: {
    StepperItem: 'kyn-stepper-item',
  },
  argTypes: {
    size: {
      options: ['large', 'small'],
      control: { type: 'select' },
    },
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/ssZ3MSPHNv0qhIvdiY3rXi/Dubrovnik-Release?node-id=772-11352&m=dev',
    },
  },
};

const args = {
  size: 'large',
  vertical: false,
};

export const Horizontal = {
  args,
  render: (args) => {
    return html`<kyn-stepper-final size=${args.size}></kyn-stepper-final>`;
  },
};
