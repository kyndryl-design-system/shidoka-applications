import { html } from 'lit';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import { action } from '@storybook/addon-actions';

import chatHistoryIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/chat-history.svg';
import chatIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/chat.svg';
import deleteIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/24/delete.svg';
import aiResponse from '@kyndryl-design-system/shidoka-foundation/assets/svg/ai/response.svg';
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

export default {
  title: 'AI/Patterns/ChatHistory',
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
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
  hideFooter: true,
  showSecondaryButton: true,
  secondaryButtonText: 'Secondary',
  secondaryDisabled: false,
  hideCancelButton: false,
  aiConnected: false,
  disableScroll: false,
};

const chatResponse = [
  {
    date: 'Today, 25 Feb 10 2025',
    message: [
      {
        msgText:
          'Tell me more about Kyndryl Application Management Services for SAP S...',
      },
    ],
  },
  {
    date: 'Friday, Jan 10 2025',
    message: [
      {
        msgText:
          'Can you explain how I can report a concern anonymously through the Kyndryl...',
      },
    ],
  },
  {
    date: 'Wednesday, 01 Jan 2025',
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
];

export const Default = {
  args: { ...args, showSecondaryButton: false, aiConnected: true },
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
        <kyn-button
          slot="anchor"
          kind=${args.aiConnected ? 'primary-ai' : 'primary'}
        >
          Open Modal
        </kyn-button>
        <span class="content">
          <kyn-tabs
            style="height: 300px;"
            scrollablePanels
            tabStyle="line"
            aiConnected
            @on-change=${(e) => action(e.type)(e)}
          >
            <kyn-tab slot="tabs" id="chat">
              <span class="icon">${unsafeSVG(chatIcon)}</span>
              Chat
            </kyn-tab>
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
                  caption="Optional text"
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
                                <div class="chat-wrapper">${item.msgText}</div>
                                <kyn-button
                                  iconposition="center"
                                  kind="ghost"
                                  type="button"
                                  size="small"
                                  description="Delete"
                                  @on-click=${(e) => action(e.type)(e)}
                                >
                                  <span style="display:flex;" slot="icon"
                                    >${unsafeSVG(deleteIcon)}</span
                                  >
                                </kyn-button>
                              </div>
                            </kyn-card>
                          `;
                        })}
                      </div>
                    </div>
                  `;
                })}
                <kyn-link
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
              </div>
            </kyn-tab-panel>
            <kyn-tab-panel tabId="history">Tab 2 Content</kyn-tab-panel>
          </kyn-tabs>
        </span>
      </kyn-modal>
      <style>
        kyn-tab-panel > * {
          margin-bottom: 1.5rem;
        }
        .chat-history-container {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 24px;
          align-self: stretch;
          margin-top: 24px;
        }
        .chat-items {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 16px;
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
  args: {
    ...args,
    hideFooter: false,
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
        <kyn-button
          slot="anchor"
          kind=${args.aiConnected ? 'primary-ai' : 'primary'}
        >
          Open Modal
        </kyn-button>
        <span class="content">
          <kyn-tabs
            style="height: 300px;"
            scrollablePanels
            tabStyle="line"
            aiConnected
            @on-change=${(e) => action(e.type)(e)}
          >
            <kyn-tab slot="tabs" id="chat">
              <span class="icon">${unsafeSVG(chatIcon)}</span>
              Chat
            </kyn-tab>
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
                <div
                  class="response-wrapper"
                  style="align-items: anchor-center;"
                >
                  <kyn-avatar initials="A"></kyn-avatar>
                  <span>
                    I know that they rely on legacy systems, which have become
                    cumbersome and costly to maintain and there is an urgent
                    need to improve this. I want to learn about the Hybrid IT
                    Modernization.
                  </span>
                </div>
                <div class="response-wrapper">
                  <span> ${unsafeHTML(aiResponse)} </span>
                  <span>
                    The benefits of adopting Hybrid IT Modernization:
                    <ol>
                      <li>
                        Cost Efficiency: Hybrid IT allows organizations to
                        combine on-premises infrastructure with cloud solutions,
                        optimizing costs by only utilizing cloud services for
                        what is needed. It helps avoid over-provisioning and can
                        scale as needed without large upfront investments.
                      </li>
                      <li>
                        Flexibility and Scalability: Organizations can leverage
                        the flexibility of the cloud for specific workloads
                        while maintaining critical systems on-premises. This
                        provides the ability to scale resources up or down as
                        business needs change, ensuring better alignment with
                        demand.
                      </li>
                      <li>
                        Improved Agility: By modernizing IT infrastructure with
                        a hybrid approach, businesses can more quickly respond
                        to market changes and customer needs. They can
                        experiment with new technologies or software without
                        disrupting core operations.
                      </li>
                    </ol>
                  </span>
                </div>
                <div
                  class="response-wrapper"
                  style="align-items: anchor-center;"
                >
                  <kyn-avatar initials="A"></kyn-avatar>
                  <span>Add Prompt Component here...</span>
                </div>
              </div>
            </kyn-tab-panel>
            <kyn-tab-panel tabId="history">Tab 2 Content</kyn-tab-panel>
          </kyn-tabs>
        </span>
        <div class="input-query-container" slot="footer">
          <kyn-text-area
            class="input-text-area"
            rows="2"
            placeholder="Type your message..."
            maxRowsVisible="3"
            ?aiConnected=${args.aiConnected}
          ></kyn-text-area>
          <kyn-button
            class="input-send-button"
            kind="primary-ai"
            description="send button"
          >
            <span slot="icon">${unsafeSVG(sendIcon)}</span>
          </kyn-button>
        </div>
      </kyn-modal>
      <style>
        kyn-tab-panel > * {
          margin-bottom: 1.5rem;
        }
        .query-container {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 32px;
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
        .response-wrapper {
          display: flex;
          gap: 20px;
        }
        ol {
          margin-left: -1rem;
        }

        .input-query-container {
          width: 100%;
          display: flex;
          align-items: center;
          background-color: var(--kd-color-background-container-ai-default);
          box-shadow: 0px 0px 24px 0px var(--kd-color-border-dropshadow-ai);
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
      </style>
    `;
  },
};
