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

const statusSteps = [
  {
    stepName: 'Processing Request',
    stepTitle: 'Monday June 26, 2023 2:05:25 PM',
    disabled: false,
  },
  {
    stepName: 'Processing Request',
    stepTitle: 'Monday June 26, 2023 3:05:25 PM',
    disabled: false,
  },
  {
    stepName: 'Draft',
    stepTitle: 'Monday June 26, 2023 4:05:25 PM',
    disabled: false,
  },
  {
    stepName: 'Request Received',
    stepTitle: 'Monday June 26, 2023 6:05:25 PM',
    disabled: false,
  },
  {
    stepName: 'Generating Contract',
    stepTitle: 'Tuesday June 26, 2023 6:05:25 PM',
    disabled: false,
  },
  {
    stepName: 'Contract Ready for Review',
    stepTitle: 'Tuesday June 26, 2023 7:05:25 PM',
    disabled: false,
  },
];

const returnStepState = (currentIndex, index, disabled) => {
  if (!disabled) {
    return currentIndex > index
      ? 'completed'
      : currentIndex === index
      ? 'active'
      : 'pending';
  }
  return '';
};

const args = {
  stepperType: 'procedure',
  stepperSize: 'large',
  currentIndex: 0,
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
  args,
  render: (args) => {
    return html`
      <kyn-stepper
        stepperType="status"
        stepperSize="small"
        currentIndex=${args.currentIndex}
        ?vertical=${true}
      >
        ${statusSteps.map(
          (step, index) => html`
            <kyn-stepper-item
              stepName=${step.stepName}
              stepTitle=${step.stepTitle}
              stepState=${returnStepState(
                args.currentIndex,
                index,
                step.disabled
              )}
              ?disabled=${step.disabled}
            ></kyn-stepper-item>
          `
        )}
      </kyn-stepper>
    `;
  },
};
