import { html } from 'lit';
import './index';

export default {
  title: 'Components/TextHeavyModal',
  component: 'kyn-modal-wb',
  argTypes: {
    size: {
      options: ['auto', 'sm', 'md', 'lg'],
      control: { type: 'select' },
    },
    modalTitle: {
      control: { type: 'text' },
    },
    modalBody: {
      control: { type: 'text' },
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
  size: 'md',
  modalTitle: 'Modal title',
  subheader: 'Subheader content',
  modalBody:
    'This is the modal lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin cursus, purus vitae egestas mollis, augue augue interdum quam, sit amet volutpat justo magna quis justo. Aliquam dapibus mi a arcu consequat, sed placerat metus bibendum. Suspendisse pretium nibh Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin cursus, purus vitae egestas mollis, augue augue interdum quam, sit amet volutpat justo magna quis justo. Aliquam dapibus mi a arcu consequat, sed placerat metus bibendum. Suspendisse pretium nibh Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin cursus, purus vitae egestas mollis, augue augue interdum quam, sit amet volutpat justo magna quis justo. Aliquam dapibus mi a arcu consequat, sed placerat metus bibendum. Suspendisse pretium nibh Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin cursus, purus vitae egestas mollis, augue augue interdum quam, sit amet volutpat justo magna quis justo. Aliquam dapibus mi a arcu consequat, sed placerat metus bibendum. Suspendisse pretium nibh',
  subheaderHref: 'https://www.example.com',
  showModal: false,
  timestampVisible: false,
};

export const KynModalWb = {
  args,
  render: (args) => {
    return html`
      <kyn-modal-wb
        size=${args.size}
        modalTitle=${args.modalTitle}
        subheader=${args.subheader}
        modalBody=${args.modalBody}
        subheaderHref=${args.subheaderHref}
        ?showModal=${args.showModal}
        ?timestampVisible=${args.timestampVisible}
      >
        <kd-button slot="anchor">Open Modal</kd-button>
      </kyn-modal-wb>
    `;
  },
};
