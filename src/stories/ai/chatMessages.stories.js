import { html } from 'lit';
import { UserInput, AIResponse } from './response.stories.js';
import { Default as infoCard } from './infoCard.stories.js';

export default {
  title: 'AI/Patterns/Chat',
};

const args = {
  open: false,
  size: 'auto',
  titleText: 'GenAi',
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

export const ChatMessages = {
  args: { ...args, showSecondaryButton: false, aiConnected: true },
  render: (args) => {
    return html`
      <div class="main-div">
        ${infoCard.render(infoCard.args)} ${UserInput.render(UserInput.args)}
        ${infoCard.render(infoCard.args)} ${AIResponse.render(AIResponse.args)}
      </div>

      <style>
        .main-div > * {
          margin-bottom: 1.5rem; /* Adjust the margin as needed */
        }
      </style>
    `;
  },
};
