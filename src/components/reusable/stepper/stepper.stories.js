import { html } from 'lit';
import { action } from '@storybook/addon-actions';
import { ifDefined } from 'lit/directives/if-defined.js';

import './index';
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
      url: 'https://www.figma.com/design/9Q2XfTSxfzTXfNe2Bi8KDS/Component-Viewer?node-id=0-1&p=f&m=dev',
    },
  },
};

const steps = [
  {
    stepName: 'Step 1',
    stepTitle: 'Completed',
    stepState: 'completed',
    stepLink: 'javascript:void(0)',
    disabled: false,
  },
  {
    stepName: 'Step 2',
    stepTitle: 'Excluded',
    stepState: 'excluded',
    stepLink: 'javascript:void(0)',
    disabled: false,
  },
  {
    stepName: 'Step 3',
    stepTitle: 'Destructive',
    stepState: 'destructive',
    stepLink: 'javascript:void(0)',
    disabled: false,
  },
  {
    stepName: 'Step 4',
    stepTitle: 'Active',
    stepState: 'active',
    stepLink: 'javascript:void(0)',
    disabled: false,
  },
  {
    stepName: 'Step 5',
    stepTitle: 'Disabled',
    stepState: 'pending',
    disabled: true,
  },
  {
    stepName: 'Step 6',
    stepTitle: 'Warning',
    stepState: 'warning',
    disabled: false,
  },
  {
    stepName: 'Step 7',
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
    stepName: 'Request Accepted',
    stepTitle: 'Monday June 26, 2023 2:10:25 PM',
    disabled: false,
  },
  {
    stepName: 'Draft',
    stepTitle: 'Monday June 26, 2023 4:05:25 PM',
    disabled: false,
  },
  {
    stepName: 'Response Received',
    stepTitle: 'Monday June 26, 2023 6:05:25 PM',
    disabled: false,
  },
  {
    stepName: 'Generating Contract',
    stepTitle: 'Tuesday June 27, 2023 6:05:25 PM',
    disabled: false,
  },
  {
    stepName: 'Contract Ready for Review',
    stepTitle: 'Tuesday June 27, 2023 7:05:25 PM',
    disabled: false,
  },
];

// Example of how to pass stepState prop. to <kyn-stepper-item> & usage of currentIndex to navigate.
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
            stepLink=${ifDefined(step.stepLink)}
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
          stepLink="javascript:void(0)"
          stepState="completed"
        ></kyn-stepper-item>
        <kyn-stepper-item
          stepName="Step 2"
          stepTitle="Excluded"
          stepLink="javascript:void(0)"
          stepState="excluded"
        >
        </kyn-stepper-item>
        <kyn-stepper-item
          stepName="Step 3"
          stepTitle="Destructive"
          stepLink="javascript:void(0)"
          stepState="destructive"
        >
          <kyn-tooltip slot="tooltip" anchorPosition="start" direction="top">
            Tooltip example
          </kyn-tooltip>
        </kyn-stepper-item>
        <kyn-stepper-item
          stepName="Step 4"
          stepTitle="Active"
          stepLink="javascript:void(0)"
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
          stepTitle="Warning"
          stepState="warning"
        ></kyn-stepper-item>
        <kyn-stepper-item
          stepName="Step 7"
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
          stepTitle="Completed"
          stepState="completed"
          stepLink="javascript:void(0)"
        ></kyn-stepper-item>
        <kyn-stepper-item
          stepName="Step 2"
          stepTitle="Completed"
          stepState="completed"
          stepLink="javascript:void(0)"
        ></kyn-stepper-item>
        <kyn-stepper-item
          stepName="Step 3"
          stepTitle="Completed"
          stepState="completed"
          stepLink="javascript:void(0)"
        >
          <kyn-stepper-item-child
            slot="child"
            childTitle="Nested Step Title"
            childState="completed"
            childLink="javascript:void(0)"
            childSubTitle="Optional subtitle"
            @on-child-click=${(e) => action(e.type)(e)}
          >
          </kyn-stepper-item-child>
          <kyn-stepper-item-child
            slot="child"
            childTitle="Nested Step Title"
            childState="completed"
            childLink="javascript:void(0)"
            @on-child-click=${(e) => action(e.type)(e)}
          ></kyn-stepper-item-child>
        </kyn-stepper-item>
        <kyn-stepper-item
          stepName="Step 4"
          stepTitle="Active"
          stepState="active"
          stepLink="javascript:void(0)"
        >
          <kyn-stepper-item-child
            slot="child"
            childTitle="Nested Step Title"
            childState="active"
            childLink="javascript:void(0)"
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
          stepName="Step 5"
          stepTitle="Pending"
          stepState="pending"
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

export const StatusStepper = {
  args: { currentIndex: 2 },
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
