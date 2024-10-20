import { html } from 'lit';
import './index';
import { action } from '@storybook/addon-actions';

import '@kyndryl-design-system/shidoka-foundation/components/button';
import '@kyndryl-design-system/shidoka-foundation/components/icon';
import '../textInput';

export default {
  title: 'Components/Modal',
  component: 'kyn-modal',
  argTypes: {
    size: {
      options: ['auto', 'md', 'lg'],
      control: { type: 'select' },
    },
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/uwR7B1xbaRXA5spwPvzzFO/Florence-Release?type=design&node-id=2252%3A2&mode=design&t=E0KHOCJHSb38i6RZ-1',
    },
  },
};

const args = {
  open: false,
  size: 'auto',
  titleText: 'Modal Title',
  labelText: '',
  okText: 'OK',
  cancelText: 'Cancel',
  closeText: 'Close',
  destructive: false,
  okDisabled: false,
  hideFooter: false,
  showSecondaryButton: true,
  secondaryButtonText: 'Secondary',
  secondaryDisabled: false,
  hideCancelButton: false,
};

export const Modal = {
  args,
  render: (args) => {
    return html`
      <kyn-modal
        ?open=${args.open}
        size=${args.size}
        titleText=${args.titleText}
        labelText=${args.labelText}
        okText=${args.okText}
        cancelText=${args.cancelText}
        closeText=${args.closeText}
        ?destructive=${args.destructive}
        ?okDisabled=${args.okDisabled}
        ?hideFooter=${args.hideFooter}
        @on-close=${(e) => action(e.type)(e)}
      >
        <kd-button slot="anchor"> Open Modal </kd-button>

        Basic Modal example.
      </kyn-modal>
    `;
  },
};

export const ActionButtons = {
  args,
  render: (args) => {
    return html`
      <kyn-modal
        ?open=${args.open}
        size=${args.size}
        titleText=${args.titleText}
        labelText=${args.labelText}
        okText=${args.okText}
        cancelText=${args.cancelText}
        closeText=${args.closeText}
        ?destructive=${args.destructive}
        ?okDisabled=${args.okDisabled}
        ?hideFooter=${args.hideFooter}
        ?showSecondaryButton=${args.showSecondaryButton}
        secondaryButtonText=${args.secondaryButtonText}
        ?secondaryDisabled=${args.secondaryDisabled}
        ?hideCancelButton=${args.hideCancelButton}
        @on-close=${(e) => action(e.type)(e)}
      >
        <kd-button slot="anchor"> Open Modal </kd-button>

        Basic Modal with All Buttons.
      </kyn-modal>
    `;
  },
};

// export const CustomActions = {
//   args,
//   render: (args) => {
//     return html`
//       <kyn-modal
//         ?open=${args.open}
//         size=${args.size}
//         titleText=${args.titleText}
//         labelText=${args.labelText}
//         okText=${args.okText}
//         cancelText=${args.cancelText}
//         ?destructive=${args.destructive}
//         @on-close=${(e) => action(e.type)(e)}
//       >
//         <span slot="anchor">Open Modal</span>

//         Modal with custom actions.

//         <kd-button
//           slot="actions"
//           size="small"
//           kind="tertiary"
//           description="Print"
//         >
//           <kd-icon slot="icon" .icon=${printIcon}></kd-icon>
//         </kd-button>
//         <kd-button
//           slot="actions"
//           size="small"
//           kind="tertiary"
//           description="Download"
//         >
//           <kd-icon slot="icon" .icon=${downloadIcon}></kd-icon>
//         </kd-button>
//       </kyn-modal>
//     `;
//   },
// };

export const BeforeClose = {
  args,
  render: (args) => {
    return html`
      <kyn-modal
        ?open=${args.open}
        size=${args.size}
        titleText=${args.titleText}
        labelText=${args.labelText}
        okText=${args.okText}
        closeText=${args.closeText}
        cancelText=${args.cancelText}
        ?destructive=${args.destructive}
        ?okDisabled=${args.okDisabled}
        .beforeClose=${(returnValue) => handleBeforeClose(returnValue)}
        @on-close=${(e) => action(e.type)(e)}
      >
        <kd-button slot="anchor"> Open Modal </kd-button>

        Modal with custom beforeClose handler function.
      </kyn-modal>
    `;
  },
};

const handleBeforeClose = (returnValue) => {
  if (returnValue === 'ok') {
    return confirm(`beforeClose handler triggered.`);
  } else {
    return true;
  }
};

export const WithForm = {
  args,
  render: (args) => {
    return html`
      <kyn-modal
        ?open=${args.open}
        size=${args.size}
        titleText=${args.titleText}
        labelText=${args.labelText}
        okText=${args.okText}
        cancelText=${args.cancelText}
        closeText=${args.closeText}
        ?destructive=${args.destructive}
        ?okDisabled=${args.okDisabled}
        ?hideFooter=${args.hideFooter}
        ?showSecondaryButton=${args.showSecondaryButton}
        secondaryButtonText=${args.secondaryButtonText}
        ?secondaryDisabled=${args.secondaryDisabled}
        ?hideCancelButton=${args.hideCancelButton}
        .beforeClose=${(returnValue) => handleBeforeCloseSubmit(returnValue)}
        @on-close=${(e) => action(e.type)(e)}
      >
        <kd-button slot="anchor"> Open Modal </kd-button>

        Modal with form validation.
        <br /><br />

        <form @submit=${(e) => handleSubmit(e)}>
          <kyn-text-input name="test" required>Required input</kyn-text-input>
        </form>
      </kyn-modal>
    `;
  },
};

const handleSubmit = (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  console.log(...formData);
};

const handleBeforeCloseSubmit = (returnValue) => {
  if (returnValue !== 'cancel') {
    const Form = document.querySelector('form');
    Form.requestSubmit(); // submit the form
    return Form.checkValidity(); // close dialog if form is valid
  } else {
    return true;
  }
};
