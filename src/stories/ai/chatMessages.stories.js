import { html } from 'lit';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import aiIndicator from '@kyndryl-design-system/shidoka-foundation/assets/svg/ai/indicator.svg';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import policeIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/24/police.svg';
import deleteIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/24/delete.svg';
import { action } from '@storybook/addon-actions';

import '../../components/reusable/card';
import '../../components/reusable/button';
import '../../components/reusable/textArea';
import '../../components/reusable/tabs';
import '../../components/reusable/avatar';
import '../../components/reusable/modal';

export default {
  title: 'AI/Patterns/Chat',
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

export const ChatMessages = {
  args: { ...args, showSecondaryButton: false, aiConnected: true },
  render: (args) => {
    const infoCard = html`
      <kyn-card type="normal" aiConnected>
        <div class="info-card-container">
          <div class="info-card-leftIcon">${unsafeSVG(policeIcon)}</div>
          <div class="info-card-content-wrapper">
            <div class="info-card-title-text kd-type--ui-04">
              Kai may occasionally generate incorrect or misleading information.
            </div>
            <div class="info-card-sub-text kd-type--ui-02">
              Kai may occasionally generate incorrect or misleading information.
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
    `;

    const responseMessage = html`
      <span class="response-msg">
        The benefits of adopting Hybrid IT Modernization:
        <ol>
          <li>
            Cost Efficiency: Hybrid IT allows organizations to combine
            on-premises infrastructure with cloud solutions, optimizing costs by
            only utilizing cloud services for what is needed. It helps avoid
            over-provisioning and can scale as needed without large upfront
            investments.
          </li>
          <li>
            Flexibility and Scalability: Organizations can leverage the
            flexibility of the cloud for specific workloads while maintaining
            critical systems on-premises. This provides the ability to scale
            resources up or down as business needs change, ensuring better
            alignment with demand.
          </li>
          <li>
            Improved Agility: By modernizing IT infrastructure with a hybrid
            approach, businesses can more quickly respond to market changes and
            customer needs. They can experiment with new technologies or
            software without disrupting core operations.
          </li>
        </ol>
      </span>
    `;

    return html`
      <div class="main-div">
        ${infoCard}
        <div class="response-wrapper">
          <kyn-avatar initials="A"></kyn-avatar>
          ${responseMessage}
        </div>
        ${infoCard}
        <div class="response-wrapper">
          <span> ${unsafeHTML(aiIndicator)} </span>
          ${responseMessage}
        </div>
      </div>

      <style>
        .main-div > * {
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
