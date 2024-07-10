import { html } from 'lit-html';
import './index';

export default {
  title: 'Components/HorizontalStepper',
};

const steps = [
  { title: 'Step 1', description: 'Description 1', status: 'completed' },
  { title: 'Step 2', description: 'Description 2', status: 'completed' },
  { title: 'Step 3', description: 'Description 3', status: 'in-progress' },
  { title: 'Step 4', description: 'Description 4', status: 'pending' },
  { title: 'Step 5', description: 'Description 5', status: 'pending' },
  { title: 'Step 6', description: 'Description 6', status: 'disabled' },
  { title: 'Step 7', description: 'Description 7', status: 'pending' },
];

export const Default = () => html` <kyn-stepper></kyn-stepper> `;

// export const Horizontal = () => html`
//   <stepper-component .steps=${steps} .vertical=${false}></stepper-component>
// `;

// export const Vertical = () => html`
//   <stepper-component .steps=${steps} .vertical=${true}></stepper-component>
// `;

export const Demo = () =>
  html`<stepper-variant progress=${30}></stepper-variant>`;

export const Horizontal = () => {
  return html`<kyn-stepper-final
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
};

export const Vertical = () => {
  return html`<kyn-stepper-final vertical
    ><kyn-stepper-item
      stepName="Step 1"
      stepTitle="Step Title"
      vertical
    ></kyn-stepper-item>
    <kyn-stepper-item
      stepName="Step 2"
      stepTitle="Step Title"
      vertical
    ></kyn-stepper-item>
    <kyn-stepper-item
      stepName="Step 3"
      stepTitle="Step Title"
      vertical
    ></kyn-stepper-item>
    <kyn-stepper-item
      stepName="Step 4"
      stepTitle="Step Title"
      vertical
    ></kyn-stepper-item>
  </kyn-stepper-final>`;
};
