import { html } from 'lit';
import './index';
import { action } from '@storybook/addon-actions';

import '@kyndryl-design-system/shidoka-foundation/components/button';
import '@kyndryl-design-system/shidoka-foundation/components/icon';

import printIcon from '@carbon/icons/es/printer/20';
import downloadIcon from '@carbon/icons/es/download/20';

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
      url: 'https://www.figma.com/file/6AovH7Iay9Y7BkpoL5975s/Applications-Specs-for-Devs?node-id=1287%3A171858&mode=dev',
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
  destructive: false,
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
        ?destructive=${args.destructive}
        @on-close=${(e) => action(e.type)(e)}
      >
        <span slot="anchor">Open Modal</span>

        Basic Modal example.
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
        cancelText=${args.cancelText}
        ?destructive=${args.destructive}
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
    return confirm(`beforeClose handler triggered.`);
  } else {
    return true;
  }
};
