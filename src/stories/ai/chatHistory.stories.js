import { html } from 'lit';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import { action } from '@storybook/addon-actions';
import chatHistoryIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/chat-history.svg';
import aiIndicatorIcon from '@kyndryl-design-system/shidoka-foundation/assets/svg/ai/indicator.svg';

import '@kyndryl-design-system/shidoka-foundation/css/typography.css';
import chevronDownIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/chevron-down.svg';
import { InlineConfirm as InlineConfirmStory } from '../../components/reusable/inlineConfirm/inlineConfirm.stories.js';
import { Default as InputQueryStory } from './inputQuery.stories.js';

import '../../components/reusable/tabs';
import '../../components/reusable/avatar';
import '../../components/reusable/pagetitle';
import '../../components/reusable/link';
import '../../components/reusable/card';
import '../../components/reusable/button';
import '../../components/reusable/modal';
import '../../components/reusable/search';
import '../../components/reusable/card';

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

const AIResponse = [
  {
    title: '1. Cost Efficiency',
    message: [
      {
        msgText:
          'Reduces capital expenses (CapEx) by shifting to operational expenses (OpEx) through cloud-based services.',
      },
      {
        msgText:
          'Lowers maintenance costs for legacy systems while still leveraging existing investments.',
      },
    ],
  },
  {
    title: '2. Flexibility & Scalability',
    message: [
      {
        msgText:
          'Combines on-premises, private cloud, and public cloud environments, allowing organizations to scale resources up or down as needed.',
      },
      {
        msgText:
          'Supports dynamic workloads by optimizing resource allocation based on demand.',
      },
    ],
  },
  {
    title: '3. Enhanced Security & Compliance',
    message: [
      {
        msgText:
          'Enables data segmentation, keeping sensitive workloads on-prem while leveraging cloud security for other applications.',
      },
      {
        msgText:
          'Supports regulatory compliance by ensuring data is stored and processed according to legal requirements.',
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
                                ${InlineConfirmStory.render({
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
              <div class="chat_content">
                <div class="chat_items">
                  <div class="chat_title">
                    <span
                      ><kyn-avatar initials="A" aiConnected></kyn-avatar
                    ></span>
                    <span>
                      <kyn-card
                        role="article"
                        aria-label="Card"
                        aiConnected
                        style="width:100%"
                      >
                        <div>
                          I know that they rely on legacy systems, which have
                          become cumbersome and costly to maintain and there is
                          an urgent need to improve this. I want to learn about
                          the Hybrid IT Modernization.
                        </div>
                      </kyn-card>
                    </span>
                  </div>
                </div>
                <div class="chat_items">
                  <span class="chat_icon">
                    ${unsafeHTML(aiIndicatorIcon)}
                  </span>
                  <span class="chat_item kd-type--body-02">
                    <div>The benefits of adopting Hybrid IT Modernization:</div>
                    ${AIResponse.map((items) => {
                      return html`
                        <div style="font-weight:500">${items.title}</div>
                        <ol
                          style="margin:0"
                          class="kd-spacing--list-item"
                          type="a"
                        >
                          ${items.message.map((item) => {
                            return html`<li>${item.msgText}</li>`;
                          })}
                        </ol>
                      `;
                    })}
                  </span>
                </div>
                <div class="chat_items">
                  <div class="chat_title">
                    <span><kyn-avatar initials="A"></kyn-avatar></span>
                    <span
                      ><kyn-card
                        role="article"
                        aria-label="Card"
                        aiConnected
                        style="width:100%"
                      >
                        <div>
                          How do we prioritize which applications to modernize
                          first?
                        </div>
                      </kyn-card></span
                    >
                  </div>
                </div>
              </div>
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
        kyn-card::part(card-wrapper) {
          padding: 13px 18px;
          border-radius: 0px 4px 4px 4px;
          background: var(--kd-color-background-card-background);
        }
        .chat_details {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 24px;
        }
        .chat_content {
          display: flex;
          gap: 16px;
          flex-direction: column;
        }
        .chat_items {
          display: flex;
          gap: 16px;
          color: var(--kd-color-text-level-primary);
        }
        .chat_title {
          display: flex;
          gap: 16px;
        }
        .chat_icon {
          svg {
            width: 20px;
            height: 20px;
          }
        }
        .chat_item {
          display: flex;
          flex-direction: column;
          gap: 16px;
          color: var(--kd-color-text-level-primary);
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
