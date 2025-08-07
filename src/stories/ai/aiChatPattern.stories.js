import { html } from 'lit';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import chatIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/chat.svg';
import chatHistoryIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/chat-history.svg';
import analyticsIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/analytics.svg';
import customerEngagementIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/32/customer-engagement.svg';
import downIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/chevron-down.svg';
import sendIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/send.svg';
import { action } from 'storybook/actions';
import { useArgs } from 'storybook/preview-api';

import '../../components/reusable/tabs';
import '../../components/reusable/modal';
import '../../components/ai/aiLaunchButton';
import '../../components/reusable/floatingContainer';

import '../../components/reusable/textArea';
import '../../components/reusable/button';
import '../../components/reusable/dropdown';
import '../../components/reusable/tag';

import { ChatMessages } from './chatMessages.stories.js';
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
    value1: 'Option 1',
    value2: 'Option 2',
    selectedIcon: analyticsIcon,
  },
  parameters: {
    controls: { disable: true },
    a11y: { disable: true },
  },
  render: (args) => {
    const [{ selectedTabId }, updateArgs] = useArgs();

    const handleTabChange = (e) => {
      updateArgs({ selectedTabId: e.detail.selectedTabId });
    };

    const dropdownOptions = {
      'Option 1': {
        icon: analyticsIcon,
      },
      'Option 2': {
        icon: customerEngagementIcon,
      },
    };

    const handleChange = (e) => {
      let selectedValue = e.detail.value;
      const option = dropdownOptions[selectedValue];
      updateArgs({
        value1: selectedValue,
        selectedIcon: option.icon,
      });
      action(e.type)({ ...e, detail: e.detail });
    };

    const handleOtherDropdownChange = (e) => {
      let selectedValue = e.detail.value;
      updateArgs({
        value2: selectedValue,
      });
      action(e.type)({ ...e, detail: e.detail });
    };

    return html`
      <kyn-modal
        size="xl"
        titleText="Gen AI"
        aiConnected
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

        <kyn-tabs
          style="height: 100%;"
          scrollablePanels
          tabStyle="line"
          aiConnected
          @on-change=${handleTabChange}
        >
          <kyn-tab slot="tabs" id="chat" selected>
            ${unsafeSVG(chatIcon)} Chat
          </kyn-tab>
          <kyn-tab slot="tabs" id="history">
            ${unsafeSVG(chatHistoryIcon)} History
          </kyn-tab>

          <kyn-tab-panel tabId="chat" visible>
            ${ChatMessages.render()}
          </kyn-tab-panel>
          <kyn-tab-panel tabId="history">
            ${ChatHistory.render()}
          </kyn-tab-panel>
        </kyn-tabs>

        <div slot="footer">
          <form
            class="ai-input-query"
            @submit=${(e) => {
              e.preventDefault();
              action('submit')(e);
              const formData = new FormData(e.target);
              console.log(...formData);
            }}
          >
            <div class="input-row">
              <kyn-text-area
                name="ai-query"
                rows="2"
                placeholder="Type your message..."
                maxRowsVisible="3"
                label="AI Prompt Query"
                hideLabel
                aiConnected
                notResizeable
              ></kyn-text-area>

              <kyn-button type="submit" kind="primary-ai" description="Submit">
                <span slot="icon">${unsafeSVG(sendIcon)}</span>
              </kyn-button>
            </div>
            <div style="display: flex; gap: 10px; align-items: center;">
              <kyn-dropdown
                style="margin-right:-150px;"
                ?hideLabel=${true}
                value=${args.value1}
                openDirection="up"
                @on-change=${handleChange}
              >
                <kyn-button
                  slot="anchor"
                  class="dropdown-anchor-button"
                  kind="secondary-ai"
                  size="small"
                  iconPosition="right"
                >
                  <span style="display:inline-flex;margin-right: 8px;">
                    ${unsafeSVG(args.selectedIcon)}
                  </span>
                  ${args.value1}
                  <span slot="icon">${unsafeSVG(downIcon)}</span>
                </kyn-button>
                <kyn-enhanced-dropdown-option value="Option 1">
                  <span slot="icon">${unsafeSVG(analyticsIcon)}</span>
                  <span slot="title">Option 1</span>
                  <span slot="description">Description for the Option 1</span>
                </kyn-enhanced-dropdown-option>
                <kyn-enhanced-dropdown-option value="Option 2">
                  <span slot="icon">${unsafeSVG(customerEngagementIcon)}</span>
                  <span slot="title">Option 2</span>
                  <kyn-tag slot="tag" label="New chat" tagSize="sm"></kyn-tag>
                  <span slot="description">Description for the Option 2</span>
                </kyn-enhanced-dropdown-option>
              </kyn-dropdown>
              <kyn-dropdown
                ?hideLabel=${true}
                value=${args.value2}
                openDirection="up"
                @on-change=${handleOtherDropdownChange}
              >
                <kyn-button
                  slot="anchor"
                  class="dropdown-anchor-button"
                  kind="secondary-ai"
                  size="small"
                  iconPosition="right"
                >
                  ${args.value2}
                  <span slot="icon">${unsafeSVG(downIcon)}</span>
                </kyn-button>
                <kyn-enhanced-dropdown-option value="Option 1">
                  <span slot="title">Option 1</span>
                  <span slot="description">Description for the Option 1</span>
                </kyn-enhanced-dropdown-option>
                <kyn-enhanced-dropdown-option value="Option 2">
                  <span slot="title">Option 2</span>
                  <kyn-tag slot="tag" label="New chat" tagSize="sm"></kyn-tag>
                  <span slot="description">Description for the Option 2</span>
                </kyn-enhanced-dropdown-option>
              </kyn-dropdown>
            </div>
          </form>
          <div class="disclaimer kd-type--ui-02">Optional text here</div>
        </div>
      </kyn-modal>

      <style>
        kyn-dropdown {
          min-width: 300px;
        }
        .ai-input-query {
          margin-top: auto;
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 10px;
          background-color: var(--kd-color-background-container-ai-level-2);
          border-radius: 8px;
        }

        .ai-input-query.floating {
          box-shadow: var(--kd-elevation-level-3-ai);
        }

        .ai-input-query .input-row {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .ai-input-query kyn-text-area {
          flex-grow: 1;
        }
        .disclaimer {
          padding: var(--kd-spacing-4) var(--kd-spacing-16) var(--kd-spacing-0);
          color: var(--kd-color-text-level-secondary);
        }
      </style>
    `;
  },
};
