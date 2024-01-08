import { html } from 'lit';
import './index';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Components/Modal',
  component: 'kyn-modal',
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
};

const args = {
  open: false,
  titleText: 'Modal Title',
  okText: 'OK',
  cancelText: 'Cancel',
};

export const Modal = {
  args,
  render: (args) => {
    return html`
      <kyn-modal
        ?open=${args.open}
        titleText=${args.titleText}
        okText=${args.okText}
        cancelText=${args.cancelText}
        @on-close=${(e) => action(e.type)(e)}
      >
        <span slot="anchor">Open Modal</span>

        Basic Modal example.
      </kyn-modal>
    `;
  },
};

export const BeforeClose = {
  args,
  render: (args) => {
    return html`
      <kyn-modal
        ?open=${args.open}
        titleText=${args.titleText}
        okText=${args.okText}
        cancelText=${args.cancelText}
        .beforeClose=${(returnValue) => handleBeforeClose(returnValue)}
        @on-close=${(e) => action(e.type)(e)}
      >
        <span slot="anchor">Open Modal</span>

        Modal with custom beforeClose handler function.
      </kyn-modal>
    `;
  },
};

const handleBeforeClose = (returnValue) => {
  if (returnValue === 'ok') {
    return confirm(`Are you sure?`);
  } else {
    return true;
  }
};
