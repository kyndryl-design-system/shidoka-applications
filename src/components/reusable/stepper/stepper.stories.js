import { html } from 'lit';
import { action } from '@storybook/addon-actions';

import './index';
import './story-helpers/stepper-story';
import '../tooltip';

export default {
  title: 'Components/Stepper',
  component: 'kyn-stepper',
  subcomponents: {
    StepperItem: 'kyn-stepper-item',
    StepperItemChild: 'kyn-stepper-item-child',
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
    a11y: {
      disable: true,
    },
  },
};

const steps = [
  {
    stepName: 'Step 1',
    stepTitle: 'Completed',
    stepState: 'completed',
    disabled: false,
  },
  {
    stepName: 'Step 2',
    stepTitle: 'Excluded',
    stepState: 'excluded',
    disabled: false,
  },
  {
    stepName: 'Step 2',
    stepTitle: 'Destructive',
    stepState: 'destructive',
    disabled: false,
  },
  {
    stepName: 'Step 3',
    stepTitle: 'Active',
    stepState: 'active',
    disabled: false,
  },
  {
    stepName: 'Step 4',
    stepTitle: 'Disabled',
    stepState: 'pending',
    disabled: true,
  },
  {
    stepName: 'Step 5',
    stepTitle: 'Pending',
    stepState: 'pending',
    disabled: false,
  },
];

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

// Example of how to pass stepState prop. to <kyn-stepper-item>
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
    return html` <kyn-stepper
      stepperType=${args.stepperType}
      stepperSize=${args.stepperSize}
      @on-click=${(e) => action(e.type)(e)}
    >
      ${steps.map(
        (step) => html`
          <kyn-stepper-item
            stepName=${step.stepName}
            stepTitle=${step.stepTitle}
            stepState=${step.stepState}
            ?disabled=${step.disabled}
          >
          </kyn-stepper-item>
        `
      )}
    </kyn-stepper>`;
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
        @on-click=${(e) => action(e.type)(e)}
      >
        <kyn-stepper-item
          stepName="Step 1"
          stepTitle="Completed"
          stepState="completed"
        ></kyn-stepper-item>
        <kyn-stepper-item
          stepName="Step 2"
          stepTitle="Excluded"
          stepState="excluded"
        >
        </kyn-stepper-item>
        <kyn-stepper-item
          stepName="Step 3"
          stepTitle="Destructive"
          stepState="destructive"
        >
          <kyn-tooltip slot="tooltip" anchorPosition="start" direction="top">
            Tooltip example
          </kyn-tooltip>
        </kyn-stepper-item>
        <kyn-stepper-item
          stepName="Step 4"
          stepTitle="Active"
          stepState="active"
        >
        </kyn-stepper-item>
        <kyn-stepper-item
          stepName="Step 5"
          stepTitle="Disabled"
          stepState="pending"
          disabled
        ></kyn-stepper-item>
        <kyn-stepper-item
          stepName="Step 6"
          stepTitle="Pending"
          stepState="pending"
        ></kyn-stepper-item>
      </kyn-stepper>
    `;
  },
};

export const NestedSteps = {
  args,
  render: (args) => {
    return html`
      <h4>Note: Nested steps are only for vertical & procedure stepper.</h4>
      <br />
      <kyn-stepper
        stepperType="procedure"
        stepperSize=${args.stepperSize}
        ?vertical=${true}
        @on-click=${(e) => action(e.type)(e)}
      >
        <kyn-stepper-item
          stepName="Step 1"
          stepTitle="Step Title"
          stepState="completed"
        ></kyn-stepper-item>
        <kyn-stepper-item
          stepName="Step 2"
          stepTitle="Step Title"
          stepState="completed"
        ></kyn-stepper-item>
        <kyn-stepper-item
          stepName="Step 3"
          stepTitle="Step Title"
          stepState="active"
        >
          <kyn-stepper-item-child
            slot="child"
            childTitle="Nested Step Title"
            childSubTitle="Optional subtitle"
            @on-child-click=${(e) => action(e.type)(e)}
          >
          </kyn-stepper-item-child>
          <kyn-stepper-item-child
            slot="child"
            childTitle="Nested Step Title"
            @on-child-click=${(e) => action(e.type)(e)}
          ></kyn-stepper-item-child>
        </kyn-stepper-item>
        <kyn-stepper-item
          stepName="Step 4"
          stepTitle="Step Title"
          stepState="pending"
        >
        </kyn-stepper-item>
        <kyn-stepper-item
          stepName="Step 5"
          stepTitle="Step Title"
          stepState="pending"
        ></kyn-stepper-item>
      </kyn-stepper>
    `;
  },
};

export const StatusStepper = {
  args: { currentIndex: 0 },
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
            >
            </kyn-stepper-item>
          `
        )}
      </kyn-stepper>
    `;
  },
};
