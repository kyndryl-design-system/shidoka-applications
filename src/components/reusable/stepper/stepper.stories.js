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

const args = {
  stepperSize: 'large',
  vertical: false,
  currentIndex: 0,
};

export const Horizontal = {
  args,
  render: (args) => {
    return html`<kyn-stepper
      stepperSize=${args.stepperSize}
      ?vertical=${args.vertical}
      currentIndex=${args.currentIndex}
    >
      <kyn-stepper-item
        stepName="Step 1"
        stepTitle="Step Title"
      ></kyn-stepper-item>
      <kyn-stepper-item
        stepName="Step 2"
        stepTitle="Step Title"
      ></kyn-stepper-item>
      <kyn-stepper-item
        stepName="Step 3"
        stepTitle="Step Title"
      ></kyn-stepper-item>
      <kyn-stepper-item
        stepName="Step 4"
        stepTitle="Step Title"
      ></kyn-stepper-item>
      <kyn-stepper-item
        stepName="Step 5"
        stepTitle="Step Title"
      ></kyn-stepper-item>
      <kyn-stepper-item
        stepName="Step 6"
        stepTitle="Step Title"
      ></kyn-stepper-item>
      <kyn-stepper-item
        stepName="Step 7"
        stepTitle="Step Title"
      ></kyn-stepper-item>
    </kyn-stepper>`;
  },
};

export const Vertical = {
  args: { ...args, vertical: true },
  render: (args) => {
    return html`
      <kyn-stepper
        stepperSize=${args.stepperSize}
        ?vertical=${args.vertical}
        currentIndex=${args.currentIndex}
      >
      </kyn-stepper>
    `;
  },
};
