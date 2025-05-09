import { html } from 'lit';
import './index';
import { action } from '@storybook/addon-actions';

import '../button';
import '../textInput';

export default {
  title: 'Components/Modal',
  component: 'kyn-modal',
  argTypes: {
    size: {
      options: ['auto', 'md', 'lg', 'xl'],
      control: { type: 'select' },
    },
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/qyPEUQckxj8LUgesi1OEES/Component-Library-2.0?node-id=7726-259473&p=f&m=dev',
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
  aiConnected: false,
  disableScroll: false,
};

export const Modal = {
  args: {
    ...args,
    showSecondaryButton: false,
  },
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
        ?showSecondaryButton=${args.showSecondaryButton}
        secondaryButtonText=${args.secondaryButtonText}
        ?secondaryDisabled=${args.secondaryDisabled}
        ?hideFooter=${args.hideFooter}
        ?hideCancelButton=${args.hideCancelButton}
        ?aiConnected=${args.aiConnected}
        ?disableScroll=${args.disableScroll}
        @on-close=${(e) => action(e.type)(e)}
        @on-open=${(e) => action(e.type)(e)}
      >
        <kyn-button
          slot="anchor"
          kind=${args.aiConnected ? 'primary-ai' : 'primary'}
        >
          Open Modal
        </kyn-button>

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
        ?aiConnected=${args.aiConnected}
        ?disableScroll=${args.disableScroll}
        @on-close=${(e) => action(e.type)(e)}
        @on-open=${(e) => action(e.type)(e)}
      >
        <kyn-button
          slot="anchor"
          kind=${args.aiConnected ? 'primary-ai' : 'primary'}
        >
          Open Modal
        </kyn-button>

        Basic Modal with All Buttons.
      </kyn-modal>
    `;
  },
};

export const BeforeClose = {
  args: { ...args, showSecondaryButton: false },
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
        ?hideCancelButton=${args.hideCancelButton}
        ?hideFooter=${args.hideFooter}
        ?showSecondaryButton=${args.showSecondaryButton}
        secondaryButtonText=${args.secondaryButtonText}
        ?secondaryDisabled=${args.secondaryDisabled}
        ?aiConnected=${args.aiConnected}
        ?disableScroll=${args.disableScroll}
        .beforeClose=${(returnValue) => handleBeforeClose(returnValue)}
        @on-close=${(e) => action(e.type)(e)}
        @on-open=${(e) => action(e.type)(e)}
      >
        <kyn-button
          slot="anchor"
          kind=${args.aiConnected ? 'primary-ai' : 'primary'}
        >
          Open Modal
        </kyn-button>

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
        ?aiConnected=${args.aiConnected}
        ?disableScroll=${args.disableScroll}
        .beforeClose=${(returnValue) => handleBeforeCloseSubmit(returnValue)}
        @on-close=${(e) => action(e.type)(e)}
        @on-open=${(e) => action(e.type)(e)}
      >
        <kyn-button
          slot="anchor"
          kind=${args.aiConnected ? 'primary-ai' : 'primary'}
        >
          Open Modal
        </kyn-button>

        Modal with form validation.
        <br /><br />

        <form @submit=${(e) => handleSubmit(e)}>
          <kyn-text-input
            name="test"
            label="Required input"
            required
          ></kyn-text-input>
        </form>
      </kyn-modal>
    `;
  },
};

export const AIConnected = {
  args: { ...args, showSecondaryButton: false, aiConnected: true },
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
        ?showSecondaryButton=${args.showSecondaryButton}
        secondaryButtonText=${args.secondaryButtonText}
        ?secondaryDisabled=${args.secondaryDisabled}
        ?hideFooter=${args.hideFooter}
        ?hideCancelButton=${args.hideCancelButton}
        ?aiConnected=${args.aiConnected}
        ?disableScroll=${args.disableScroll}
        @on-close=${(e) => action(e.type)(e)}
        @on-open=${(e) => action(e.type)(e)}
      >
        <kyn-button
          slot="anchor"
          kind=${args.aiConnected ? 'primary-ai' : 'primary'}
        >
          Open Modal
        </kyn-button>
        Basic Modal example.
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
