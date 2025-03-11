import { html } from 'lit';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import chatIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/chat.svg';
import chatHistoryIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/chat-history.svg';
import { action } from '@storybook/addon-actions';

import '../../components/reusable/button';
import '../../components/reusable/tabs';
import '../../components/reusable/modal';
import '../../components/ai/aiLaunchButton';
import '../../components/reusable/floatingContainer';

import { ChatMessages } from './chatMessages.stories.js';
import { Default as InputQuery } from './inputQuery.stories.js';
import { ChatHistory } from './chatHistory.stories.js';

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

export const ChatModal = {
  args: {
    ...args,
    ...ChatMessages.args,
    showSecondaryButton: false,
    aiConnected: true,
  },
  render: (args) => {
    return html`
      <kyn-modal
        ?open=${args.open}
        size="xl"
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
        ?hideCancelButton=${args.hideCancelButton}
        ?aiConnected=${args.aiConnected}
        ?disableScroll=${args.disableScroll}
        @on-close=${(e) => action(e.type)(e)}
        @on-open=${(e) => action(e.type)(e)}
      >
        <kyn-button-float-container slot="anchor">
          <kyn-ai-launch-btn
            @on-click=${() => action('on-click')()}
          ></kyn-ai-launch-btn>
        </kyn-button-float-container>
        <span class="content">
          <kyn-tabs
            style="height: 300px;"
            scrollablePanels
            tabStyle="line"
            aiConnected
            @on-change=${(e) => action(e.type)(e)}
          >
            <kyn-tab slot="tabs" id="chat" selected>
              <span class="icon">${unsafeSVG(chatIcon)}</span>
              Chat
            </kyn-tab>
            <kyn-tab slot="tabs" id="history">
              <span class="icon">${unsafeSVG(chatHistoryIcon)}</span>
              History
            </kyn-tab>

            <kyn-tab-panel tabId="chat" visible>
              ${ChatMessages.render(ChatMessages.args)}
            </kyn-tab-panel>
            <kyn-tab-panel tabId="history">
              ${ChatHistory.render(ChatHistory.args)}
            </kyn-tab-panel>
          </kyn-tabs>
        </span>

        <div class="input-query-container" slot="footer">
          ${InputQuery.render(InputQuery.args)}
          <div class="disclaimer kd-type--ui-02">
            Kai may occasionally generate incorrect or misleading information.
          </div>
        </div>
      </kyn-modal>
      <style>
        .input-query-container > * {
          width: 100%;
        }
        .disclaimer {
          padding: var(--kd-spacing-0) var(--kd-spacing-16);
          color: var(--kd-color-text-level-secondary);
        }
      </style>
    `;
  },
};
