import { html } from 'lit';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { classMap } from 'lit/directives/class-map.js';
import plusIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/add-simple.svg';
import chatHistoryIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/chat-history.svg';
import settingsIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/settings.svg';

import { action } from 'storybook/actions';
import { useArgs } from 'storybook/preview-api';

import '../../components/reusable/tabs';
import '../../components/reusable/modal';
import '../../components/ai/aiLaunchButton';
import '../../components/reusable/floatingContainer';

import { ChatMessages } from './chatMessages.stories.js';
import { Default as InputQuery } from './inputQuery.stories.js';
import { ChatHistory } from './chatHistory.stories.js';

export default {
  title: 'AI/Patterns/Chat',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/9Q2XfTSxfzTXfNe2Bi8KDS/Component-Viewer?node-id=7-300050&p=f&m=dev',
    },
  },
};

export const ChatModal = {
  args: {
    selectedTabId: 'chat',
  },
  render: () => {
    const [{ selectedTabId }, updateArgs] = useArgs();

    const emitChange = (tabId) => () => {
      updateArgs({ selectedTabId: tabId });
    };

    return html`
      <kyn-modal
        size="xl"
        titleText="Gen AI"
        aiConnected
        gradientBackground
        disableScroll
        ?hideFooter=${selectedTabId === 'history'}
        @on-close=${(e) => action(e.type)({ ...e, detail: e.detail })}
        @on-open=${(e) => action(e.type)({ ...e, detail: e.detail })}
      >
        <kyn-button-float-container slot="anchor">
          <kyn-ai-launch-btn
            @on-click=${() => action('on-click')()}
          ></kyn-ai-launch-btn>
        </kyn-button-float-container>
        <div
          slot="header-inline"
          style="margin-top: 1px; display: flex; gap: 8px; align-items: flex-start;"
        >
          <kyn-button
            kind="ghost-ai"
            size="small"
            class=${classMap({ selected: selectedTabId === 'chat' })}
            ?selected=${selectedTabId === 'chat'}
            @on-click=${emitChange('chat')}
            aria-pressed=${selectedTabId === 'chat'}
          >
            <span
              slot="icon"
              style="margin-right: 8px; display: flex; order: -1;"
              >${unsafeSVG(plusIcon)}</span
            >
            New Chat
          </kyn-button>

          <kyn-button
            kind="ghost-ai"
            size="small"
            class=${classMap({ selected: selectedTabId === 'history' })}
            ?selected=${selectedTabId === 'history'}
            @on-click=${emitChange('history')}
            aria-pressed=${selectedTabId === 'history'}
          >
            <span
              slot="icon"
              style="margin-right: 8px; display: flex; order: -1;"
              >${unsafeSVG(chatHistoryIcon)}</span
            >
            History
          </kyn-button>

          <kyn-button
            kind="ghost-ai"
            size="small"
            class=${classMap({ selected: selectedTabId === 'settings' })}
            ?selected=${selectedTabId === 'settings'}
            @on-click=${emitChange('settings')}
            aria-pressed=${selectedTabId === 'settings'}
          >
            <span
              slot="icon"
              style="margin-right: 8px; display: flex; order: -1;"
              >${unsafeSVG(settingsIcon)}</span
            >
            Settings
          </kyn-button>
        </div>

        <kyn-tabs
          style="height: 100%;"
          scrollablePanels
          tabStyle="line"
          aiConnected
          @on-change=${(e) =>
            updateArgs({ selectedTabId: e.detail.selectedTabId })}
        >
          <kyn-tab-panel tabId="chat" ?visible=${selectedTabId === 'chat'}>
            ${ChatMessages.render()}
          </kyn-tab-panel>
          <kyn-tab-panel
            tabId="history"
            ?visible=${selectedTabId === 'history'}
          >
            ${ChatHistory.render()}
          </kyn-tab-panel>
          <kyn-tab-panel
            tabId="settings"
            ?visible=${selectedTabId === 'settings'}
          >
            <div class="kd-type--body-02" style="padding: 16px;">
              Settings content
            </div>
          </kyn-tab-panel>
        </kyn-tabs>

        <div slot="footer">
          ${InputQuery.render(InputQuery.args)}
          <div class="disclaimer kd-type--ui-02">Optional text here</div>
        </div>
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
