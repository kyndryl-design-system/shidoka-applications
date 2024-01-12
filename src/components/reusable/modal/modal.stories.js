import { html } from 'lit';
import './index';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Components/Modal',
  component: 'kyn-modal',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/6AovH7Iay9Y7BkpoL5975s/Applications-Specs-for-Devs?node-id=1287%3A171858&mode=dev',
    },
  },
};

const args = {
  open: false,
  titleText: 'Modal Title',
  labelText: '',
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
        labelText=${args.labelText}
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
