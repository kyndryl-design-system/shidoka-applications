import { html } from 'lit';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import { action } from '@storybook/addon-actions';
import chatHistoryIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/chat-history.svg';
import deleteIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/24/delete.svg';
import aiResponse from '@kyndryl-design-system/shidoka-foundation/assets/svg/ai/response.svg';
// import aiResponse from '@kyndryl-design-system/shidoka-foundation/assets/svg/ai/indicator.svg';
import searchIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/search.svg';
import sendIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/send.svg';

import '@kyndryl-design-system/shidoka-foundation/css/typography.css';
import chevronDownIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/chevron-down.svg';

import '../components/reusable/tabs';
import '../components/reusable/avatar';
import '../components/reusable/pagetitle';
import '../components/reusable/breadcrumbs';
import '../components/reusable/link';
import '../components/reusable/card';
import '../components/reusable/button';
import '../components/reusable/textInput';
import '../components/reusable/modal';
import '../components/reusable/textArea';
import '../components/reusable/inlineConfirm';

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
        labelText=""
        okText=""
        cancelText=""
        closeText="Close"
        ?destructive=${false}
        ?okDisabled=${false}
        ?showSecondaryButton=${false}
        secondaryButtonText=""
        ?secondaryDisabled=${true}
        ?hideFooter=${false}
        ?hideCancelButton=${false}
        aiConnected
        ?disableScroll=${false}
        @on-close=${(e) => action(e.type)(e)}
        @on-open=${(e) => action(e.type)(e)}
      >
        <kyn-button slot="anchor" kind="primary-ai"> Open Modal </kyn-button>
        <span class="content">
          <kyn-tabs
            style="height: 300px;"
            scrollablePanels
            tabStyle="line"
            aiConnected
            @on-change=${(e) => action(e.type)(e)}
          >
            <kyn-tab slot="tabs" id="history" selected>
              <span class="icon">${unsafeSVG(chatHistoryIcon)}</span>
              History
            </kyn-tab>
            <kyn-tab-panel tabId="history" visible>
              <kyn-page-title
                type="tertiary"
                headline=""
                pagetitle="Chat History"
                subtitle=""
                aiConnected
              >
              </kyn-page-title>
              <div class="chat-history-container">
                <kyn-text-input
                  style="width:100%;"
                  type="text"
                  size="md"
                  name="textInput"
                  value=""
                  placeholder="Search..."
                  invalidtext=""
                  label=""
                  ?hideLabel=${true}
                  @on-input=${(e) => action(e.type)(e)}
                  ><span
                    slot="icon"
                    role="img"
                    aria-label="Search"
                    title="Search"
                    style="display: flex; align-items: center;"
                    >${unsafeSVG(searchIcon)}</span
                  >
                </kyn-text-input>
                <div class="chat_content">
                  ${chatResponse.map((items) => {
                    return html`
                      <div class="chat-items">
                        <div class="chat-section">
                          <label class="chat-date kd-type--ui-02">
                            ${items.date}
                          </label>
                          ${items.message.map((item) => {
                            return html`
                              <kyn-card style="width:100%">
                                <div class="chat-container">
                                  <div class="chat-wrapper">
                                    ${item.msgText}
                                  </div>
                                  <kyn-inline-confirm
                                    ?destructive=${true}
                                    .anchorText=${'Delete'}
                                    .confirmText=${'Confirm'}
                                    .cancelText=${'Cancel'}
                                    @on-confirm=${(e) => action('on-confirm')()}
                                  >
                                    ${unsafeSVG(deleteIcon)}
                                    <span slot="confirmIcon"
                                      >${unsafeSVG(deleteIcon)}</span
                                    >
                                  </kyn-inline-confirm>
                                </div>
                              </kyn-card>
                            `;
                          })}
                        </div>
                      </div>
                    `;
                  })}
                </div>
              </div>
            </kyn-tab-panel>
          </kyn-tabs>
        </span>
        <kyn-link
          slot="footer"
          id="test"
          standalone=""
          href=""
          target="_self"
          kind="ai"
          shade="auto"
          @on-click=${(e) => action(e.type)(e)}
          >Show older
          <span style="display:flex;" slot="icon"
            >${unsafeSVG(chevronDownIcon)}</span
          >
        </kyn-link>
      </kyn-modal>
      <style>
        kyn-card::part(card-wrapper) {
          outline: 1px solid var(--kd-color-border-level-secondary);
          background: var(--kd-color-background-container-ai-subtle);
        }
        .chat-history-container {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          align-self: stretch;
          margin-top: 24px;
        }
        .chat-history-container > :first-child {
          margin-bottom: 32px;
        }

        .chat_content {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 24px;
          align-self: stretch;
        }

        .chat-items {
          align-self: stretch;
        }
        .chat-section {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;
          align-self: stretch;
        }
        .chat-container {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .chat-wrapper {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          flex: 1 0 0;
        }
        .chat-date {
          color: var(--kd-color-text-forms-label-primary);
          font-weight: 500;
        }
        .header {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
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
        labelText=""
        okText=""
        cancelText=""
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
        <span class="content">
          <kyn-tabs
            style="height: 300px;"
            scrollablePanels
            tabStyle="line"
            aiConnected
            @on-change=${(e) => action(e.type)(e)}
          >
            <kyn-tab slot="tabs" id="history" selected>
              <span class="icon">${unsafeSVG(chatHistoryIcon)}</span>
              History
            </kyn-tab>
            <kyn-tab-panel tabId="history" visible>
              <kyn-page-title
                type="tertiary"
                headline=""
                pagetitle="Chat History"
                subtitle=""
                aiConnected
              >
              </kyn-page-title>
              <kyn-link
                id="test"
                href=""
                target="_self"
                kind="ai"
                shade="auto"
                ?standalone=${true}
                @on-click=${(e) => action(e.type)(e)}
              >
                Back
              </kyn-link>
              <div class="query-container">
                <div class="query-item kd-type--body-01">
                  What are the benefits of adopting Hybrid IT Modernization?
                </div>
                <div class="response-wrapper">
                  <div class="response-title">
                    <span><kyn-avatar initials="A"></kyn-avatar></span>
                    <span>Add Prompt Component here...</span>
                  </div>
                </div>
                <div class="response-wrapper">
                  <div class="response-title">
                    <span> ${unsafeHTML(aiResponse)} </span>
                    <span
                      >The benefits of adopting Hybrid IT Modernization:</span
                    >
                  </div>
                  <div class="response-list kd-type--body-02">
                    ${AIResponse.map((items) => {
                      return html`
                        <div style="font-weight:500">${items.title}</div>
                        <ol type="a">
                          ${items.message.map((item) => {
                            return html`<li>${item.msgText}</li>`;
                          })}
                        </ol>
                      `;
                    })}
                  </div>
                </div>
              </div>
            </kyn-tab-panel>
          </kyn-tabs>
        </span>
        <div class="chat_input" slot="footer">
          <div class="input-query-container">
            <kyn-text-area
              class="input-text-area"
              rows="2"
              placeholder="Type your message..."
              maxRowsVisible="3"
              aiConnected
            ></kyn-text-area>
            <kyn-button
              class="input-send-button"
              kind="primary-ai"
              description="send button"
            >
              <span slot="icon">${unsafeSVG(sendIcon)}</span>
            </kyn-button>
          </div>
          <div class="disclaimer kd-type--ui-02">
            Kai may occasionally generate incorrect or misleading information.
          </div>
        </div>
      </kyn-modal>
      <style>
        kyn-tab-panel > * {
          margin-bottom: 8px;
        }
        .query-container {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 24px;
          align-self: stretch;
        }
        .query-item {
          display: flex;
          padding: 16px 0px;
          align-items: center;
          gap: 8px;
          align-self: stretch;
          color: var(--kd-color-text-level-primary);
        }
        .user-query {
          display: flex;
          gap: 16px;
        }
        .response-wrapper {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 16px;
          align-self: stretch;
        }
        .response-title {
          display: flex;
          gap: 16px;
          align-items: anchor-center;
        }
        .response-list {
          display: flex;
          flex-direction: column;
          padding-left: 52px;
          color: var(--kd-color-text-level-primary);
        }
        ol > li {
          margin-bottom: 15px;
        }
        .chat_input {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 4px;
          align-self: stretch;

          .input-query-container {
            width: 100%;
            display: flex;
            align-items: center;
            background-color: var(--kd-color-background-container-ai-level-2);
            border-radius: 8px;
            .input-text-area {
              width: 100%;
              padding: 2px 0px 10px 10px;
              margin-right: 10px;
            }
            .input-send-button {
              margin-right: 10px;
            }
          }
          .disclaimer {
            padding: 0px 16px;
            gap: 16px;
            color: var(--kd-color-text-level-secondary);
          }
        }
      </style>
    `;
  },
};
