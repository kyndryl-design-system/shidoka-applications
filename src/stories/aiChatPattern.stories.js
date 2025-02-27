import { html } from 'lit';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import aiResponse from '@kyndryl-design-system/shidoka-foundation/assets/svg/ai/response.svg';
import userAvatarIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/user.svg';
import sendIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/send.svg';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import policeIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/24/police.svg';
import deleteIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/24/delete.svg';
import { action } from '@storybook/addon-actions';

import '../components/reusable/card';
import '../components/reusable/button';
import '../components/reusable/textArea';
import '../components/reusable/tabs';
import '../components/reusable/avatar';
import '../components/reusable/modal';

export default {
  title: 'AI/Patterns/AI Chat Pattern',
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

export const AIChatPattern = {
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
            <kyn-tab slot="tabs" id="chat" selected>
              <span class="icon">${unsafeSVG(userAvatarIcon)}</span>
              Chat
            </kyn-tab>
            <kyn-tab slot="tabs" id="history">
              <span class="icon">${unsafeSVG(userAvatarIcon)}</span>
              History
            </kyn-tab>
            <kyn-tab slot="tabs" id="settings">
              <span class="icon">${unsafeSVG(userAvatarIcon)}</span>
              Settings
            </kyn-tab>

            <kyn-tab-panel tabId="chat" visible>
              <kyn-card type="normal" aiConnected>
                <div class="info-card-container">
                  <div class="info-card-leftIcon">${unsafeSVG(policeIcon)}</div>
                  <div class="info-card-content-wrapper">
                    <div class="info-card-title-text kd-type--ui-04">
                      Kai may occasionally generate incorrect or misleading
                      information.
                    </div>
                    <div class="info-card-sub-text kd-type--ui-02">
                      Kai may occasionally generate incorrect or misleading
                      information.
                    </div>
                  </div>
                  <div class="info-card-rightIcon">
                    <kyn-button
                      iconposition="center"
                      kind="ghost"
                      type="button"
                      size="small"
                      description="Button Description"
                      @on-click=${(e) => action(e.type)(e)}
                    >
                      <span style="display:flex;" slot="icon"
                        >${unsafeSVG(deleteIcon)}</span
                      >
                    </kyn-button>
                  </div>
                </div>
              </kyn-card>

              <div class="response-wrapper">
                <kyn-avatar initials="A"></kyn-avatar>

                <span class="response-msg">
                  The benefits of adopting Hybrid IT Modernization:
                  <ol>
                    <li>
                      Cost Efficiency: Hybrid IT allows organizations to combine
                      on-premises infrastructure with cloud solutions,
                      optimizing costs by only utilizing cloud services for what
                      is needed. It helps avoid over-provisioning and can scale
                      as needed without large upfront investments.
                    </li>
                    <li>
                      Flexibility and Scalability: Organizations can leverage
                      the flexibility of the cloud for specific workloads while
                      maintaining critical systems on-premises. This provides
                      the ability to scale resources up or down as business
                      needs change, ensuring better alignment with demand.
                    </li>
                    <li>
                      Improved Agility: By modernizing IT infrastructure with a
                      hybrid approach, businesses can more quickly respond to
                      market changes and customer needs. They can experiment
                      with new technologies or software without disrupting core
                      operations.
                    </li>
                  </ol>
                </span>
              </div>
              <kyn-card type="normal" aiConnected>
                <div class="info-card-container">
                  <div class="info-card-leftIcon">${unsafeSVG(policeIcon)}</div>
                  <div class="info-card-content-wrapper">
                    <div class="info-card-title-text kd-type--ui-04">
                      Kai may occasionally generate incorrect or misleading
                      information.
                    </div>
                    <div class="info-card-sub-text kd-type--ui-02">
                      Kai may occasionally generate incorrect or misleading
                      information.
                    </div>
                  </div>
                  <div class="info-card-rightIcon">
                    <kyn-button
                      iconposition="center"
                      kind="ghost"
                      type="button"
                      size="small"
                      description="Button Description"
                      @on-click=${(e) => action(e.type)(e)}
                    >
                      <span style="display:flex;" slot="icon"
                        >${unsafeSVG(deleteIcon)}</span
                      >
                    </kyn-button>
                  </div>
                </div>
              </kyn-card>
              <div class="response-wrapper">
                <span> ${unsafeHTML(aiResponse)} </span>
                <span class="response-msg">
                  The benefits of adopting Hybrid IT Modernization:
                  <ol>
                    <li>
                      Cost Efficiency: Hybrid IT allows organizations to combine
                      on-premises infrastructure with cloud solutions,
                      optimizing costs by only utilizing cloud services for what
                      is needed. It helps avoid over-provisioning and can scale
                      as needed without large upfront investments.
                    </li>
                    <li>
                      Flexibility and Scalability: Organizations can leverage
                      the flexibility of the cloud for specific workloads while
                      maintaining critical systems on-premises. This provides
                      the ability to scale resources up or down as business
                      needs change, ensuring better alignment with demand.
                    </li>
                    <li>
                      Improved Agility: By modernizing IT infrastructure with a
                      hybrid approach, businesses can more quickly respond to
                      market changes and customer needs. They can experiment
                      with new technologies or software without disrupting core
                      operations.
                    </li>
                  </ol>
                </span>
              </div>
            </kyn-tab-panel>
            <kyn-tab-panel tabId="history">Tab 2 Content</kyn-tab-panel>
            <kyn-tab-panel tabId="settings">Tab 3 Content</kyn-tab-panel>
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
          margin-bottom: 1.5rem; /* Adjust the margin as needed */
        }
        kyn-card {
          width: 100%;
        }
        .info-card-container {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .info-card-content-wrapper {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          flex: 1 0 0;
        }

        .info-card-title-text {
          color: var(--kd-color-text-title-ai-tertiary);
        }

        .info-card-sub-text {
          color: var(--kd-color-text-level-primary);
        }
        .info-card-rightIcon,
        .info-card-leftIcon {
          display: flex;
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
