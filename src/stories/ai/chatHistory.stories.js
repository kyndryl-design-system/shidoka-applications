import { html } from 'lit';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { action } from '@storybook/addon-actions';
import chatHistoryIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/chat-history.svg';

import '@kyndryl-design-system/shidoka-foundation/css/typography.css';
import chevronDownIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/chevron-down.svg';
import { InlineConfirm } from '../../components/reusable/inlineConfirm/inlineConfirm.stories.js';
import { Default as InputQueryStory } from './inputQuery.stories.js';
import { WithOtherContent as ResponseStory } from './response.stories.js';

import '../../components/reusable/tabs';
import '../../components/reusable/pagetitle';
import '../../components/reusable/link';
import '../../components/reusable/card';
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

const chatResponse = [
  {
    date: 'Today, 25 Feb 10 2025',
    message: [
      {
        msgText: 'What are the benefits of adopting Hybrid IT Modernization?',
      },
      {
        msgText: 'I need more info as for Contract Lifecycle Management?',
      },
      {
        msgText:
          'What are the purpose, vision, and approach of the knowledge library?',
      },
    ],
  },
  {
    date: 'Wednesday, 01 Jan 2025',
    message: [
      {
        msgText:
          'What are the common challenges in contract negotiations, and how can they be resolved?',
      },
    ],
  },
];

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
        ?disableScroll=${false}
        @on-close=${(e) => action(e.type)(e)}
        @on-open=${(e) => action(e.type)(e)}
      >
        <kyn-button slot="anchor" kind="primary-ai"> Open Modal </kyn-button>
        <kyn-tabs
          ?scrollablePanels=${false}
          tabStyle="line"
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
                  ${chatResponse.map((items) => {
                    return html`
                      <div class="chat-section">
                        <label class="chat-date kd-type--ui-02">
                          ${items.date}
                        </label>
                        ${items.message.map((item) => {
                          return html`
                            <kyn-card style="width:100%">
                              <div class="chat-items">
                                <div class="chat_item">${item.msgText}</div>
                                ${InlineConfirm.render({
                                  destructive: true,
                                  anchorText: 'Delete',
                                  confirmText: 'Confirm',
                                  cancelText: 'Cancel',
                                })}
                              </div>
                            </kyn-card>
                          `;
                        })}
                      </div>
                    `;
                  })}
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
        kyn-card::part(card-wrapper) {
          outline: 1px solid var(--kd-color-border-level-secondary);
          background: var(--kd-color-background-container-ai-subtle);
        }
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
        .chat-date {
          color: var(--kd-color-text-forms-label-primary);
          font-weight: 500;
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

export const WithOtherContent = {
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
        ?disableScroll=${false}
        @on-close=${(e) => action(e.type)(e)}
        @on-open=${(e) => action(e.type)(e)}
      >
        <kyn-button slot="anchor" kind="primary-ai"> Open Modal </kyn-button>
        <kyn-tabs
          ?scrollablePanels=${false}
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
              ${ResponseStory.render()}
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
