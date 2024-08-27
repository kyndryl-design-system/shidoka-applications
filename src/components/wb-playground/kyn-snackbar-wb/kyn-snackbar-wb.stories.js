import { html } from 'lit';
import './index';

export default {
  title: 'Components/Snackbar',
  component: 'kyn-snackbar-wb',
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
  argTypes: {
    message: { control: 'text' },
    snackbarVisible: { control: 'boolean' },
  },
};

export const KynSnackbarWb = {
  args: {
    message: 'Note archived',
    snackbarVisible: false,
  },
  render: (args) => {
    return html`
      <div style="margin-bottom: 3rem;">
        <p>
          Wrap your
          <code
            style="background-color: rgba(0,0,0,0.6); padding: 0.5rem; color: white;"
            >kyn-snackbar-wb</code
          >
          component inside
          <code
            style="background-color: rgba(0,0,0,0.6); padding: 0.5rem; color: white;"
            >kyn-snackbar-wb-container</code
          >
        </p>
      </div>

      <kyn-snackbar-wb-container>
        <kd-button slot="anchor" kind="primary-app">Open Snackbar</kd-button>

        <kyn-snackbar-wb
          message=${args.message}
          ?snackbarVisible=${args.snackbarVisible}
        >
        </kyn-snackbar-wb>

        <kyn-snackbar-wb
          message="Another Item"
          ?snackbarVisible=${args.snackbarVisible}
        >
        </kyn-snackbar-wb>
      </kyn-snackbar-wb-container>
    `;
  },
};
