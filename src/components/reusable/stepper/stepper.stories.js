import { html } from 'lit';
import { action } from '@storybook/addon-actions';

import './index';
import './story-helpers/stepper-story';

export default {
  title: 'Components/Stepper',
  component: 'kyn-stepper',
  subcomponents: {
    StepperItem: 'kyn-stepper-item',
  },
  argTypes: {
    stepperType: {
      options: ['procedure', 'status'],
      control: { type: 'select' },
    },
    stepperSize: {
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

// const calculateProgress = (currentStep, totalSteps) => {
//   return (currentStep / totalSteps) * 100;
// };

const args = {
  stepperType: 'procedure',
  stepperSize: 'large',
};

export const Horizontal = {
  args,
  render: (args) => {
    return html` <story-stepper
      stepperType=${args.stepperType}
      stepperSize=${args.stepperSize}
    ></story-stepper>`;
  },
};

export const Vertical = {
  args,
  render: (args) => {
    return html`
      <story-stepper
        stepperType=${args.stepperType}
        stepperSize=${args.stepperSize}
        ?vertical=${true}
      ></story-stepper>
    `;
  },
};

export const StatusStepper = {
  render: () => {
    return html`
      <story-stepper
        stepperType="status"
        stepperSize="small"
        ?vertical=${true}
      ></story-stepper>
    `;
  },
};
