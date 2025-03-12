import { html } from 'lit';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import chatIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/chat.svg';
import chatHistoryIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/chat-history.svg';
import { action } from '@storybook/addon-actions';

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

export const ChatModal = {
  render: () => {
    let selectedTab = 'chat';

    const handleTabChange = (e) => {
      selectedTab = e.detail.selectedTabId;
      // document.querySelector('kyn-modal').hideFooter =
      //   selectedTab === 'history';
    };
    return html`
      <kyn-modal
        size="xl"
        titleText="Gen AI"
        aiConnected
        ?disableScroll=${true}
        ?hideFooter=${selectedTab === 'history'}
        @on-close=${(e) => action(e.type)(e)}
        @on-open=${(e) => action(e.type)(e)}
      >
        <kyn-button-float-container slot="anchor">
          <kyn-ai-launch-btn
            @on-click=${() => action('on-click')()}
          ></kyn-ai-launch-btn>
        </kyn-button-float-container>

        <kyn-tabs
          style="height: 100%;"
          scrollablePanels
          tabStyle="line"
          aiConnected
          @on-change=${handleTabChange}
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
            ${ChatMessages.render()}
          </kyn-tab-panel>
          <kyn-tab-panel tabId="history">
            ${ChatHistory.render()}
          </kyn-tab-panel>
        </kyn-tabs>

        ${selectedTab === 'chat'
          ? html`
              <div slot="footer">
                ${InputQuery.render(InputQuery.args)}
                <div class="disclaimer kd-type--ui-02">Optional text here</div>
              </div>
            `
          : ''}
      </kyn-modal>

      <style>
        .disclaimer {
          padding: var(--kd-spacing-4) var(--kd-spacing-16) var(--kd-spacing-0);
          color: var(--kd-color-text-level-secondary);
        }
      </style>
    `;
  },
};
