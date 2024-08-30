import { html } from 'lit';
import './index';

export default {
  title: 'Components/Toast',
  component: 'kyn-toast-wb',
  argTypes: {
    toastStatus: {
      options: ['default', 'success', 'warning', 'error'],
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
  showToast: false,
  toastStatus: 'default',
  toasterTitle: 'Toaster Title',
  toasterBody: 'Toaster Body',
  toastLifespan: 5000,
  timestampVisible: false,
};

export const KynToastWb = {
  args,
  render: (args) => {
    return html`
      <kyn-toast-wb
        toastStatus=${args.toastStatus}
        toasterTitle=${args.toasterTitle}
        toastLifespan=${args.toastLifespan}
        ?showToast=${args.showToast}
        ?timestampVisible=${args.timestampVisible}
      >
        <slot>${args.toasterBody}</slot>
        <kd-button slot="anchor" kind="primary-app"
          >${args.showToast ? 'Hide' : 'Show'} Toast</kd-button
        >
      </kyn-toast-wb>
    `;
  },
};
