import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import { html, css, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { action } from '@storybook/addon-actions';
import Styles from './modal.chathistory.sample.scss';
import chatHistoryIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/chat-history.svg';
import chatIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/chat.svg';
import deleteIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/24/delete.svg';
import aiResponse from '@kyndryl-design-system/shidoka-foundation/assets/svg/ai/response.svg';
import searchIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/search.svg';
import '@kyndryl-design-system/shidoka-foundation/css/typography.css';
import chevronDownIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/chevron-down.svg';
import sendIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/send.svg';
import { repeat } from 'lit/directives/repeat.js';

import '../tabs';
import '../avatar';
import '../pagetitle';
import '../breadcrumbs';
import '../link';
import '../card';
import '../button';
import '../textInput';
import '../modal';
import '../textArea';

@customElement('sample-chathistory-component')
export class SampleChatHistoryComponent extends LitElement {
  static override styles = Styles;

  @state()
  toggleTrash = false;

  @state()
  toggleChatHistory = false;

  @state()
  chatHistoryMsgText = '';

  /** Dummy chatHistoryData */
  @state()
  private chatHistoryData = [
    {
      id: 1,
      date: 'Today, Feb 21 2025',
      message: [
        {
          msgId: 11,
          msgText: 'What are the benefits of adopting Hybrid IT Modernization?',
          showTrashIcon: true,
          showDelete: false,
        },
        {
          msgId: 12,
          msgText: 'I need more info as for Contract Lifecycle Management?',
          showTrashIcon: true,
          showDelete: false,
        },
        {
          msgId: 13,
          msgText:
            ' What are the purpose, vision, and approach of the knowledge library?',
          showTrashIcon: true,
          showDelete: false,
        },
      ],
    },
    {
      id: 2,
      date: 'Today, Feb 20 2025',
      message: [
        {
          msgId: 21,
          msgText:
            'Can you explain how I can report a concern anonymously through the Kyndyrl',
          showTrashIcon: true,
          showDelete: false,
        },
      ],
    },
    {
      id: 3,
      date: 'Today, Feb 19 2025',
      message: [
        {
          msgId: 31,
          msgText:
            'Can you explain how I can report a concern anonymously through the Kyndyrl',
          showTrashIcon: true,
          showDelete: false,
        },
      ],
    },
  ];

  /** Backup Dummy chatHistoryData */
  @state()
  private chatHistoryData_backUp = [
    {
      id: 1,
      date: 'Today, Feb 21 2025',
      message: [
        {
          msgId: 11,
          msgText: 'What are the benefits of adopting Hybrid IT Modernization?',
          showTrashIcon: true,
          showDelete: false,
        },
        {
          msgId: 12,
          msgText: 'I need more info as for Contract Lifecycle Management?',
          showTrashIcon: true,
          showDelete: false,
        },
        {
          msgId: 13,
          msgText:
            ' What are the purpose, vision, and approach of the knowledge library?',
          showTrashIcon: true,
          showDelete: false,
        },
      ],
    },
    {
      id: 2,
      date: 'Today, Feb 20 2025',
      message: [
        {
          msgId: 21,
          msgText:
            'Can you explain how I can report a concern anonymously through the Kyndyrl',
          showTrashIcon: true,
          showDelete: false,
        },
      ],
    },
    {
      id: 3,
      date: 'Today, Feb 19 2025',
      message: [
        {
          msgId: 31,
          msgText:
            'Can you explain how I can report a concern anonymously through the Kyndyrl',
          showTrashIcon: true,
          showDelete: false,
        },
      ],
    },
  ];

  private toggleBack() {
    this.toggleChatHistory = !this.toggleChatHistory;
  }

  override render() {
    return html`
      <kyn-modal
        ?open=${false}
        size="xl"
        titleText="Gen AI"
        labelText=""
        okText="OK"
        cancelText="Cancel"
        closeText="Close"
        ?destructive=${false}
        ?okDisabled=${false}
        ?showSecondaryButton=${false}
        secondaryButtonText=${false}
        ?secondaryDisabled=${false}
        ?hideFooter=${false}
        ?hideCancelButton=${false}
        aiConnected
        ?disableScroll=${true}
        @on-close=${(e: any) => action(e.type)(e)}
        @on-open=${(e: any) => action(e.type)(e)}
      >
        <kyn-button slot="anchor" kind="primary-ai"> Open Model </kyn-button>
        <span class="content">
          <kyn-tabs
            style="height: 300px;"
            scrollablePanels
            tabStyle="line"
            aiConnected
            @on-change=${(e: any) => action(e.type)(e)}
          >
            <kyn-tab slot="tabs" id="history" selected>
              <span class="icon">${unsafeSVG(chatHistoryIcon)}</span>
              History
            </kyn-tab>
            <kyn-tab slot="tabs" id="chat">
              <span class="icon">${unsafeSVG(chatIcon)}</span>
              Chat
            </kyn-tab>
            <kyn-tab-panel tabId="history" visible>
              <kyn-page-title
                type="secondary"
                headline="Chat History"
                pagetitle=""
                subtitle=""
              >
              </kyn-page-title>
              ${this.toggleChatHistory
                ? html`
                    <kyn-link
                      id="test"
                      href=""
                      target="_self"
                      kind="ai"
                      shade="auto"
                      ?standalone=${true}
                      @on-click=${(e: Event) => this._handleLinkClick(e)}
                    >
                      Back
                    </kyn-link>
                    <div class="query-container">
                      <div class="query-item kd-type--body-02">
                        ${this.chatHistoryMsgText}
                      </div>
                      <div
                        class="response-wrapper"
                        style="align-items: anchor-center;"
                      >
                        <kyn-avatar initials="A"></kyn-avatar>
                        <span>
                          I know that they rely on legacy systems, which have
                          become cumbersome and costly to maintain and there is
                          an urgent need to improve this. I want to learn about
                          the Hybrid IT Modernization.
                        </span>
                      </div>
                      <div class="response-wrapper">
                        <span> ${unsafeHTML(aiResponse)} </span>
                        <span>
                          The benefits of adopting Hybrid IT Modernization:
                          <ol>
                            <li>
                              Cost Efficiency: Hybrid IT allows organizations to
                              combine on-premises infrastructure with cloud
                              solutions, optimizing costs by only utilizing
                              cloud services for what is needed. It helps avoid
                              over-provisioning and can scale as needed without
                              large upfront investments.
                            </li>
                            <li>
                              Flexibility and Scalability: Organizations can
                              leverage the flexibility of the cloud for specific
                              workloads while maintaining critical systems
                              on-premises. This provides the ability to scale
                              resources up or down as business needs change,
                              ensuring better alignment with demand.
                            </li>
                            <li>
                              Improved Agility: By modernizing IT infrastructure
                              with a hybrid approach, businesses can more
                              quickly respond to market changes and customer
                              needs. They can experiment with new technologies
                              or software without disrupting core operations.
                            </li>
                          </ol>
                        </span>
                      </div>
                      <div
                        class="response-wrapper"
                        style="
          align-items: anchor-center;"
                      >
                        <kyn-avatar initials="A"></kyn-avatar>
                        <span>Add Prompt Component here</span>
                      </div>
                    </div>
                  `
                : html`
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
                        @on-input=${(e: Event) => this._handleSearch(e)}
                        ><span
                          slot="icon"
                          role="img"
                          aria-label="Search"
                          title="Search"
                          style="display: flex; align-items: center;"
                          >${unsafeSVG(searchIcon)}</span
                        ></kyn-text-input
                      >
                      <div class="chat-items">
                        ${repeat(
                          this.chatHistoryData,
                          (chat: any) =>
                            html`
                              <div class="chat-section">
                                <div class="chat-date">${chat.date}</div>
                                ${repeat(
                                  chat.message,
                                  (message: any) =>
                                    html`
                                      <kyn-card style="width:100%">
                                        <div class="chat-container">
                                          <div class="chat-wrapper">
                                            <kyn-link
                                              id="test"
                                              href=""
                                              target="_self"
                                              kind="primary"
                                              shade="auto"
                                              standalone
                                              @on-click=${(e: Event) =>
                                                this._handleQuery(
                                                  e,
                                                  message.msgText
                                                )}
                                            >
                                              ${message.msgText}
                                            </kyn-link>
                                          </div>
                                          ${message.showTrashIcon
                                            ? html` <span style="display:flex;"
                                                ><kyn-button
                                                  iconposition="center"
                                                  kind="ghost"
                                                  type="button"
                                                  size="small"
                                                  description="Delete"
                                                  .value=${message.msgId}
                                                  @on-click=${(e: any) =>
                                                    this._handleTrashedClick(e)}
                                                >
                                                  <span
                                                    style="display:flex;"
                                                    slot="icon"
                                                    >${unsafeSVG(
                                                      deleteIcon
                                                    )}</span
                                                  >
                                                </kyn-button>
                                              </span>`
                                            : html`
                                                <span
                                                  style="display:flex;gap:16px"
                                                  class=${!message.showTrashIcon
                                                    ? 'slide-in'
                                                    : 'slide-out'}
                                                >
                                                  <kyn-button
                                                    iconposition="center"
                                                    kind="outline-destructive"
                                                    type="button"
                                                    size="small"
                                                    description="Delete"
                                                    .value=${message.msgId}
                                                    @on-click=${(e: any) =>
                                                      this._handleDelete(e)}
                                                  >
                                                    Delete
                                                  </kyn-button>
                                                  <kyn-button
                                                    iconposition="center"
                                                    kind="ghost"
                                                    type="button"
                                                    size="small"
                                                    description="Cancel"
                                                    .value=${message.msgId}
                                                    @on-click=${(e: any) =>
                                                      this._handleCancel(e)}
                                                  >
                                                    Cancel
                                                  </kyn-button>
                                                </span>
                                              `}
                                        </div>
                                      </kyn-card>
                                    `
                                )}
                              </div>
                            `
                        )}
                      </div>

                      <kyn-link
                        id="test"
                        standalone=""
                        href=""
                        target="_self"
                        kind="ai"
                        shade="auto"
                        @on-click=${() => this._loadShowOlder(1)}
                        >Show older
                        <span style="display:flex;" slot="icon"
                          >${unsafeSVG(chevronDownIcon)}</span
                        >
                      </kyn-link>
                    </div>
                  `}
            </kyn-tab-panel>
            <kyn-tab-panel tabId="chat">Tab 2 Content</kyn-tab-panel>
          </kyn-tabs>
        </span>
        <div class="input-query-container" slot="footer">
          <kyn-text-area
            class="input-text-area"
            rows="2"
            placeholder="Type your message..."
            maxRowsVisible="3"
            ?aiConnected=${true}
            ?notResizeable=${!this.toggleChatHistory}
            ?disabled=${!this.toggleChatHistory}
          ></kyn-text-area>
          <kyn-button
            class="input-send-button"
            kind="primary-ai"
            description="send button"
            ?disabled=${!this.toggleChatHistory}
          >
            <span slot="icon">${unsafeSVG(sendIcon)}</span>
          </kyn-button>
        </div>
      </kyn-modal>
    `;
  }

  private _handleTrashedClick(e: any) {
    e.preventDefault();
    e.stopPropagation();
    const updatedChatHistoryData = this.updatedChatHistory(
      e.target.value,
      'trash'
    );
    this.chatHistoryData = updatedChatHistoryData as any;
  }

  private updatedChatHistory(msgId: number, action: string) {
    return this.chatHistoryData.map((entry) => {
      const updatedMessages = entry.message.map((msg) => {
        if (msg.msgId === msgId) {
          return {
            ...msg,
            showTrashIcon: action === 'trash' ? false : true,
          };
        }
        return msg;
      });
      return {
        ...entry,
        message: updatedMessages,
      };
    });
  }

  private _handleQuery(e: any, msgText: string) {
    this.chatHistoryMsgText = msgText;
    e.preventDefault();
    e.stopPropagation();
    this.toggleBack();
  }

  private _handleCancel(e: any) {
    e.preventDefault();
    e.stopPropagation();
    const updatedChatHistoryData = this.updatedChatHistory(
      e.target.value,
      'cancel'
    );
    this.chatHistoryData = updatedChatHistoryData as any;
  }

  private _handleLinkClick(e: any) {
    action(e.type)(e);
    e.preventDefault();
    e.stopPropagation();
    this.toggleBack();
  }

  private _handleDelete(e: any) {
    const msgIdToRemove = e.target.value;
    const updatedChatHistoryData = this.chatHistoryData
      .map((item) => {
        return {
          ...item,
          message: item.message.filter((msg) => msg.msgId !== msgIdToRemove),
        };
      })
      .filter((item) => item.message.length > 0);
    this.chatHistoryData = updatedChatHistoryData as any;
  }

  private _handleSearch(e: any) {
    const filteredData2 = this.searchText(e.detail.value);
    this.chatHistoryData = filteredData2 as any;
  }

  private searchText(searchText: string) {
    if (searchText === '') {
      return this.chatHistoryData_backUp;
    }
    return this.chatHistoryData
      .map((entry) => {
        const filteredMessages = entry?.message?.filter((msg) =>
          msg.msgText.toLowerCase().includes(searchText)
        );

        if (filteredMessages.length > 0) {
          return {
            ...entry,
            message: filteredMessages,
          };
        }
      })
      .filter(Boolean);
  }

  private _loadShowOlder(incrementBy: number) {
    const newDate = this.decrementDate('Today, Feb 19 2025', incrementBy);
    const oldChat = {
      id: 4 + incrementBy,
      date: newDate,
      message: [
        {
          msgId: 41 + incrementBy,
          msgText:
            'Can you explain how I can report a concern anonymously through the Kyndyrl',
          showTrashIcon: true,
          showDelete: false,
        },
      ],
    };
    let dateExists = false;
    this.chatHistoryData.forEach((entry) => {
      if (entry.date === oldChat.date) {
        dateExists = true;
        oldChat.message.forEach((oldChatItem) => {
          if (!entry.message.some((msg) => msg.msgId === oldChatItem.msgId)) {
            entry.message.push(oldChatItem);
          }
        });
      }
    });

    if (!dateExists) {
      this.chatHistoryData.push(oldChat);
    }
    this.requestUpdate();
  }

  private decrementDate(startDateStr: string, decrementBy: number) {
    const startDate = new Date(startDateStr);

    startDate.setDate(startDate.getDate() - decrementBy);

    // Format the date as 'Today, Feb 19 2025'
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    const newDateStr = `Today, ${startDate.toLocaleDateString(
      'en-US',
      options
    )}`;

    return newDateStr;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sample-chathistory-component': SampleChatHistoryComponent;
  }
}
