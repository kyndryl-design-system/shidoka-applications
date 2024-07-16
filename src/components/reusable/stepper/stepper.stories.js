import { html } from 'lit-html';
import './index';

export default {
  title: 'Components/Stepper',
  component: 'kyn-stepper-final',
  subcomponents: {
    StepperItem: 'kyn-stepper-item',
  },
  argTypes: {
    size: {
      options: ['large', 'small'],
      control: { type: 'select' },
    },
    vertical: {
      control: {
        type: 'boolean',
      },
    },
  },
};

const args = {
  vertical: true,
  size: 'large',
};

// export const Default = () => html` <kyn-stepper></kyn-stepper> `;

// export const Horizontal = () => html`
//   <stepper-component .steps=${steps} .vertical=${false}></stepper-component>
// `;

// export const Vertical = () => html`
//   <stepper-component .steps=${steps} .vertical=${true}></stepper-component>
// `;

// export const Demo = () =>
//   html`<stepper-variant progress=${30}></stepper-variant>`;

export const Horizontal = {
  args: { ...args, vertical: false },
  render: () => {
    return html`<kyn-stepper-final size=${args.size}
      ><kyn-stepper-item
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
    </kyn-stepper-final>`;
  },
};

export const Vertical = {
  args,
  render: (args) => {
    return html` <kyn-stepper-final ?vertical=${args.vertical} size=${args.size}
      ><kyn-stepper-item
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
    </kyn-stepper-final>`;
  },
};
