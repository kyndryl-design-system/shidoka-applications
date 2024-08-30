import { html } from 'lit';
import './index';

import '@kyndryl-design-system/shidoka-foundation/components/button';

export default {
  title: 'Components/TextHeavyModal',
  component: 'kyn-modal-wb',
  argTypes: {
    size: {
      options: ['auto', 'sm', 'md', 'lg'],
      control: { type: 'select' },
    },
  },
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
};

const args = {
  open: false,
  size: 'md',
  modalTitle: 'Modal 1',
  subheader: 'Subheader content',
  modalBody:
    'This is the modal lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin cursus, purus vitae egestas mollis, augue augue interdum quam, sit amet volutpat justo magna quis justo. Aliquam dapibus mi a arcu consequat, sed placerat metus bibendum. Suspendisse pretium nibh Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin cursus, purus vitae egestas mollis, augue augue interdum quam, sit amet volutpat justo magna quis justo. Aliquam dapibus mi a arcu consequat, sed placerat metus bibendum. Suspendisse pretium nibh Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin cursus, purus vitae egestas mollis, augue augue interdum quam, sit amet volutpat justo magna quis justo. Aliquam dapibus mi a arcu consequat, sed placerat metus bibendum. Suspendisse pretium nibh Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin cursus, purus vitae egestas mollis, augue augue interdum quam, sit amet volutpat justo magna quis justo. Aliquam dapibus mi a arcu consequat, sed placerat metus bibendum. Suspendisse pretium nibh',
  subheaderHref: 'https://www.example.com',
  destructive: false,
  timestampVisible: false,
  primaryButtonText: 'Ok',
  secondaryButtonText: 'Cancel',
};

export const KynModalWb = {
  args,
  render: (args) => {
    return html`
      <kyn-modal-wb
        ?open=${args.open}
        size=${args.size}
        modalTitle=${args.modalTitle}
        subheader=${args.subheader}
        subheaderHref=${args.subheaderHref}
        ?destructive=${args.destructive}
        ?timestampVisible=${args.timestampVisible}
        primaryButtonText=${args.primaryButtonText}
        secondaryButtonText=${args.secondaryButtonText}
      >
        <kd-button slot="anchor">Open Modal</kd-button>
        <slot>${args.modalBody}</slot>
      </kyn-modal-wb>
    `;
  },
};
