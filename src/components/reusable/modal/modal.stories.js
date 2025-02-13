import { html } from 'lit';
import './index';
import { action } from '@storybook/addon-actions';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import userAvatarIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/user.svg';
import sendIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/send.svg';

import '../button';
import '../textInput';
import '../textArea';
import '../tabs';
import '../avatar';

export default {
  title: 'Components/Modal',
  component: 'kyn-modal',
  argTypes: {
    size: {
      options: ['auto', 'md', 'lg', 'xl'],
      control: { type: 'select' },
    },
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/uwR7B1xbaRXA5spwPvzzFO/Florence-Release?type=design&node-id=2252%3A2&mode=design&t=E0KHOCJHSb38i6RZ-1',
    },
  },
};

const args = {
  open: false,
  size: 'auto',
  titleText: 'Modal Title',
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
};

export const Modal = {
  args: {
    ...args,
    showSecondaryButton: false,
  },
  render: (args) => {
    return html`
      <kyn-modal
        ?open=${args.open}
        size=${args.size}
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
        @on-close=${(e) => action(e.type)(e)}
        @on-open=${(e) => action(e.type)(e)}
      >
        <kyn-button slot="anchor" ?aiConnected=${args.aiConnected}>
          Open Modal
        </kyn-button>

        Basic Modal example.
      </kyn-modal>
    `;
  },
};

export const ActionButtons = {
  args,
  render: (args) => {
    return html`
      <kyn-modal
        ?open=${args.open}
        size=${args.size}
        titleText=${args.titleText}
        labelText=${args.labelText}
        okText=${args.okText}
        cancelText=${args.cancelText}
        closeText=${args.closeText}
        ?destructive=${args.destructive}
        ?okDisabled=${args.okDisabled}
        ?hideFooter=${args.hideFooter}
        ?showSecondaryButton=${args.showSecondaryButton}
        secondaryButtonText=${args.secondaryButtonText}
        ?secondaryDisabled=${args.secondaryDisabled}
        ?hideCancelButton=${args.hideCancelButton}
        @on-close=${(e) => action(e.type)(e)}
        @on-open=${(e) => action(e.type)(e)}
      >
        <kyn-button slot="anchor" ?aiConnected=${args.aiConnected}>
          Open Modal
        </kyn-button>

        Basic Modal with All Buttons.
      </kyn-modal>
    `;
  },
};

export const BeforeClose = {
  args: { ...args, showSecondaryButton: false },
  render: (args) => {
    return html`
      <kyn-modal
        ?open=${args.open}
        size=${args.size}
        titleText=${args.titleText}
        labelText=${args.labelText}
        okText=${args.okText}
        closeText=${args.closeText}
        cancelText=${args.cancelText}
        ?destructive=${args.destructive}
        ?okDisabled=${args.okDisabled}
        ?hideCancelButton=${args.hideCancelButton}
        ?hideFooter=${args.hideFooter}
        ?showSecondaryButton=${args.showSecondaryButton}
        secondaryButtonText=${args.secondaryButtonText}
        ?secondaryDisabled=${args.secondaryDisabled}
        .beforeClose=${(returnValue) => handleBeforeClose(returnValue)}
        @on-close=${(e) => action(e.type)(e)}
        @on-open=${(e) => action(e.type)(e)}
      >
        <kyn-button slot="anchor"> Open Modal </kyn-button>

        Modal with custom beforeClose handler function.
      </kyn-modal>
    `;
  },
};

const handleBeforeClose = (returnValue) => {
  if (returnValue === 'ok') {
    return confirm(`beforeClose handler triggered.`);
  } else {
    return true;
  }
};

export const WithForm = {
  args,
  render: (args) => {
    return html`
      <kyn-modal
        ?open=${args.open}
        size=${args.size}
        titleText=${args.titleText}
        labelText=${args.labelText}
        okText=${args.okText}
        cancelText=${args.cancelText}
        closeText=${args.closeText}
        ?destructive=${args.destructive}
        ?okDisabled=${args.okDisabled}
        ?hideFooter=${args.hideFooter}
        ?showSecondaryButton=${args.showSecondaryButton}
        secondaryButtonText=${args.secondaryButtonText}
        ?secondaryDisabled=${args.secondaryDisabled}
        ?hideCancelButton=${args.hideCancelButton}
        .beforeClose=${(returnValue) => handleBeforeCloseSubmit(returnValue)}
        @on-close=${(e) => action(e.type)(e)}
        @on-open=${(e) => action(e.type)(e)}
      >
        <kyn-button slot="anchor"> Open Modal </kyn-button>

        Modal with form validation.
        <br /><br />

        <form @submit=${(e) => handleSubmit(e)}>
          <kyn-text-input
            name="test"
            label="Required input"
            required
          ></kyn-text-input>
        </form>
      </kyn-modal>
    `;
  },
};

export const AIConnected = {
  args: { ...args, showSecondaryButton: false },
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
        aiConnected
        disableScroll
        @on-close=${(e) => action(e.type)(e)}
        @on-open=${(e) => action(e.type)(e)}
      >
        <kyn-button slot="anchor"> Open Modal </kyn-button>
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
              </div></kyn-tab-panel
            >
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

const handleSubmit = (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  console.log(...formData);
};

const handleBeforeCloseSubmit = (returnValue) => {
  if (returnValue !== 'cancel') {
    const Form = document.querySelector('form');
    Form.requestSubmit(); // submit the form
    return Form.checkValidity(); // close dialog if form is valid
  } else {
    return true;
  }
};
