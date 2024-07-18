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

const steps = [
  { stepName: 'Step 1', stepTitle: 'Step Title', disabled: false },
  { stepName: 'Step 2', stepTitle: 'Step Title', disabled: false },
  { stepName: 'Step 3', stepTitle: 'Step Title', disabled: false },
  { stepName: 'Step 4', stepTitle: 'Step Title', disabled: false },
  { stepName: 'Step 5', stepTitle: 'Step Title', disabled: false },
];

const onNext = () => {
  if (args.currentIndex < steps.length - 1) {
    args.currentIndex += 1;
  }
};
const onPrev = () => {
  if (args.currentIndex > 0) {
    args.currentIndex -= 1;
  }
};

// const calculateProgress = (currentStep, totalSteps) => {
//   return (currentStep / totalSteps) * 100;
// };

// Example of how to pass stepState prop. to <kyn-stepper-item>//
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
    return html`<kyn-stepper
      stepperType=${args.stepperType}
      stepperSize=${args.stepperSize}
      currentIndex=${args.currentIndex}
    >
      ${steps.map(
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
    </kyn-stepper> `;
  },
};

export const Vertical = {
  args,
  render: (args) => {
    return html`
      <kyn-stepper
        stepperType=${args.stepperType}
        stepperSize=${args.stepperSize}
        ?vertical=${true}
        currentIndex=${args.currentIndex}
      >
        ${steps.map(
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
