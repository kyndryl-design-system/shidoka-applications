import { html } from 'lit';
import './index';

export default {
  title: 'Components/SnackbarNotification',
  component: 'kyn-snackbar',
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

export const KynSnackbar = {
  args: {
    message: 'Default snackbar notification message.',
    snackbarVisible: false,
  },
  render: (args) => {
    const toggleSnackbar = (e, snackbarId) => {
      const snackbar = e.target
        .getRootNode()
        .querySelector(`kyn-snackbar[snackbarId="${snackbarId}"]`);
      if (snackbar) {
        snackbar.snackbarVisible = !snackbar.snackbarVisible;
        snackbar.dispatchEvent(
          new CustomEvent('visibility-changed', {
            detail: { visible: snackbar.snackbarVisible },
            bubbles: true,
            composed: true,
          })
        );
      }
    };

    return html`
      <div style="margin-bottom: 3rem;">
        <p>
          Wrap your
          <code
            style="background-color: rgba(0,0,0,0.6); padding: 0.5rem; color: white;"
            >kyn-snackbar</code
          >
          component inside
          <code
            style="background-color: rgba(0,0,0,0.6); padding: 0.5rem; color: white;"
            >kyn-snackbar-container</code
          >
        </p>
      </div>

      <kyn-snackbar-container>
        <kd-button
          slot="anchor"
          kind="primary-app"
          class="slot-action-button"
          style="margin-right: 2rem;"
          @click=${(e) => toggleSnackbar(e, 'snackbar1')}
          >Open Snackbar 1</kd-button
        >

        <kd-button
          slot="anchor"
          kind="primary-app"
          class="slot-action-button"
          @click=${(e) => toggleSnackbar(e, 'snackbar2')}
          >Open Snackbar 2</kd-button
        >

        <kyn-snackbar
          snackbarId="snackbar1"
          message=${args.message}
          ?snackbarVisible=${args.snackbarVisible}
        ></kyn-snackbar>

        <kyn-snackbar
          snackbarId="snackbar2"
          message="Snackbar notication 2"
          ?snackbarVisible=${args.snackbarVisible}
        ></kyn-snackbar>
      </kyn-snackbar-container>
    `;
  },
};
