import { html } from 'lit';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { action } from '@storybook/addon-actions';
import chatHistoryIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/chat-history.svg';

import '@kyndryl-design-system/shidoka-foundation/css/typography.css';
import chevronDownIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/chevron-down.svg';
import { Default as InputQueryStory } from './inputQuery.stories.js';
import { UserInput, AIResponse } from './response.stories.js';
import { WithRightIconAndDescription } from './infoCard.stories.js';

import '../../components/reusable/floatingContainer';
import '../../components/ai/aiLaunchButton';
import '../../components/reusable/tabs';
import '../../components/reusable/pagetitle';
import '../../components/reusable/link';
import '../../components/reusable/button';
import '../../components/reusable/modal';
import '../../components/reusable/search';

export default {
  title: 'AI/Patterns/Chat History',
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
};

export const Default = {
  render: () => {
    return html`
      <kyn-modal
        ?open=${false}
        size="xl"
        titleText="GenAi"
        closeText="Close"
        ?destructive=${false}
        ?okDisabled=${false}
        ?showSecondaryButton=${false}
        secondaryButtonText=""
        ?secondaryDisabled=${true}
        ?hideFooter=${true}
        ?hideCancelButton=${false}
        aiConnected
        disableScroll
        @on-close=${(e) => action(e.type)(e)}
        @on-open=${(e) => action(e.type)(e)}
      >
        <kyn-button-float-container slot="anchor">
          <kyn-ai-launch-btn
            @on-click=${() => action('on-click')()}
          ></kyn-ai-launch-btn>
        </kyn-button-float-container>
        <kyn-tabs
          style="height: 450px;"
          tabStyle="line"
          scrollablePanels
          aiConnected
          @on-change=${(e) => action(e.type)(e)}
        >
          <kyn-tab slot="tabs" id="history" selected>
            <span class="icon">${unsafeSVG(chatHistoryIcon)}</span>
            Chat History
          </kyn-tab>
          <kyn-tab-panel tabId="history" visible>
            <div class="chat_list">
              <kyn-page-title
                type="tertiary"
                pagetitle="Chat History"
                aiConnected
              >
              </kyn-page-title>

              <div class="chat_content">
                <kyn-search
                  style="width:100%;"
                  name="search"
                  label="Search..."
                  size="md"
                  @on-input=${(e) => action(e.type)(e)}
                ></kyn-search>
                <div class="chat_content_items">
                  <div class="chat-section">
                    <label class="kd-type--ui-02 kd-type--weight-medium"
                      >Today, 25 Feb 10 2025</label
                    >
                    ${WithRightIconAndDescription.render()}
                  </div>
                </div>
              </div>
              <kyn-link
                standalone
                kind="ai"
                @on-click=${(e) => action(e.type)(e)}
                >Show older
                <span style="display:flex;" slot="icon"
                  >${unsafeSVG(chevronDownIcon)}</span
                >
              </kyn-link>
            </div>
          </kyn-tab-panel>
        </kyn-tabs>
      </kyn-modal>
      <style>
        .chat_list {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .chat_content {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }
        .chat_content_items {
          display: flex;
          flex-direction: column;
          gap: 24px;
          align-self: stretch;
        }
        .chat-section {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .chat-items {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .chat_item {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          flex: 1 0 0;
        }
      </style>
    `;
  },
};

export const HistoricalChat = {
  render: () => {
    return html`
      <kyn-modal
        ?open=${false}
        size="xl"
        titleText="GenAi"
        closeText="Close"
        ?destructive=${false}
        ?okDisabled=${false}
        ?showSecondaryButton=${false}
        secondaryButtonText="Secondary"
        ?secondaryDisabled=${false}
        ?hideFooter=${false}
        ?hideCancelButton=${false}
        aiConnected
        disableScroll
        @on-close=${(e) => action(e.type)(e)}
        @on-open=${(e) => action(e.type)(e)}
      >
        <kyn-button-float-container slot="anchor">
          <kyn-ai-launch-btn
            @on-click=${() => action('on-click')()}
          ></kyn-ai-launch-btn>
        </kyn-button-float-container>
        <kyn-tabs
          style="height: 400px;"
          scrollablePanels
          tabStyle="line"
          aiConnected
          @on-change=${(e) => action(e.type)(e)}
        >
          <kyn-tab slot="tabs" id="history" selected>
            <span class="icon">${unsafeSVG(chatHistoryIcon)}</span>
            Chat History
          </kyn-tab>
          <kyn-tab-panel tabId="history" visible>
            <kyn-page-title
              style="margin-bottom: 4px"
              type="tertiary"
              pagetitle="Chat History"
              aiConnected
            >
            </kyn-page-title>
            <div class="chat_details">
              <kyn-link
                kind="ai"
                standalone
                @on-click=${(e) => action(e.type)(e)}
              >
                Back
              </kyn-link>
              <kyn-page-title
                type="tertiary"
                pagetitle="What are the benefits of adopting Hybrid IT Modernization?"
                aiConnected
              >
              </kyn-page-title>
              ${UserInput.render()} ${AIResponse.render()}
            </div>
          </kyn-tab-panel>
        </kyn-tabs>
        <div class="chat_input" slot="footer">
          <div style="width:100%">
            ${InputQueryStory.render({ floating: false })}
          </div>
          <div class="disclaimer kd-type--ui-02">
            Kai may occasionally generate incorrect or misleading information.
          </div>
        </div>
      </kyn-modal>
      <style>
        .chat_details {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 24px;
        }
        .chat_input {
          display: flex;
          flex-direction: column;
          gap: 4px;
          .disclaimer {
            padding: 0px 16px;
            color: var(--kd-color-text-level-secondary);
          }
        }
      </style>
    `;
  },
};
