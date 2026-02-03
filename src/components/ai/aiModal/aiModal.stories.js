import { html } from 'lit';
import './index';
import { action } from 'storybook/actions';
import './aimodal';
import '../../../components/reusable/button';
import '../../../components/reusable/textInput';

export default {
  title: 'AI/Components/Modal',
  component: 'kyn-modal-ai',
  argTypes: {
    size: {
      options: ['auto', 'md', 'lg', 'xl'],
      control: { type: 'select' },
    },
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/9Q2XfTSxfzTXfNe2Bi8KDS/Component-Viewer?node-id=1-546829&p=f&t=A5tcETiCf23sAgKK-0',
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
  gradientBackground: false,
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
      <kyn-modal-ai
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
        ?gradientBackground=${args.gradientBackground}
        ?hideCancelButton=${args.hideCancelButton}
        ?aiConnected=${args.aiConnected}
        ?disableScroll=${args.disableScroll}
        @on-close=${(e) => action(e.type)({ ...e, detail: e.detail })}
        @on-open=${(e) => action(e.type)({ ...e, detail: e.detail })}
      >
        <kyn-button
          slot="anchor"
          kind=${args.aiConnected ? 'primary-ai' : 'primary'}
        >
          Open Modal
        </kyn-button>

        Basic Modal example.
      </kyn-modal-ai>
    `;
  },
};
