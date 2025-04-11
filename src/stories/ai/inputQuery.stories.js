import { html } from 'lit';
import { action } from '@storybook/addon-actions';
import '../../components/reusable/textArea';
import '../../components/reusable/button';
import sendIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/send.svg';
import stopIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/control-stop-filled.svg';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { User, Skeleton } from './response.stories.js';
import '../../components/reusable/notification';
import updateIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/update.svg';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import aiResponse from '@kyndryl-design-system/shidoka-foundation/assets/svg/ai/indicator.svg';

export default {
  title: 'AI/Patterns/Input Query',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/qyPEUQckxj8LUgesi1OEES/Component-Library-2.0?node-id=26094-200279&t=ZNgmsCAVJz1EMzfR-0',
    },
  },
};

export const Default = {
  args: {
    floating: false,
  },
  render: (args) => {
    return html`
      <form
        class="ai-input-query ${args.floating ? 'floating' : ''}"
        @submit=${(e) => {
          e.preventDefault();
          action('submit')(e);
          const formData = new FormData(e.target);
          console.log(...formData);
        }}
      >
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
      </form>

      ${sharedStyles}
    `;
  },
};

export const Thinking = {
  args: {
    floating: false,
  },
  render: (args) => {
    return html`
      <div class="storybook-container">
        <div class="main-div">${User.render()} ${Skeleton.render()}</div>
        <form
          class="ai-input-query ${args.floating ? 'floating' : ''}"
          @submit=${(e) => {
            e.preventDefault();
            action('submit')(e);
            const formData = new FormData(e.target);
            console.log(...formData);
          }}
        >
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
            <span slot="icon">${unsafeSVG(stopIcon)}</span>
          </kyn-button>
        </form>
      </div>

      ${sharedStyles}
    `;
  },
};

export const QueryAborted = {
  args: {
    floating: false,
  },
  render: (args) => {
    return html`
      <div class="storybook-container">
        <div class="main-div">
          ${User.render()}

          <div class="response_wrapper kd-spacing--margin-bottom-12">
            <div class="response_icon">${unsafeHTML(aiResponse)}</div>
            <div class="response_item kd-type--body-02">
              <div>
                As buyers become more knowledgable about their needs and
                options, it's crucial for us, as their trusted IT services
                partner, to understand their wants, challenges and expectations
              </div>
              <div class="abort-notification">
                <kyn-notification
                  notificationTitle="The operation was aborted"
                  assistiveNotificationTypeText="Error toast"
                  notificationRole="alert"
                  type="toast"
                  tagStatus="error"
                  ?hideCloseButton=${true}
                  @on-close=${(e) => action(e.type)(e)}
                  timeout=${0}
                >
                </kyn-notification>
                <kyn-button kind="outline-ai" iconPosition="left" size="large">
                  <span slot="icon">${unsafeSVG(updateIcon)}</span>
                  Regenerate</kyn-button
                >
              </div>
            </div>
          </div>
        </div>

        <form
          class="ai-input-query ${args.floating ? 'floating' : ''}"
          @submit=${(e) => {
            e.preventDefault();
            action('submit')(e);
            const formData = new FormData(e.target);
            console.log(...formData);
          }}
        >
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
        </form>
      </div>

      <style>
        .response_item {
          display: flex;
          gap: var(--kd-spacing-16);
          flex-direction: column;
        }
        .abort-notification {
          display: flex;
          gap: 10px;
          kyn-notification {
            width: fit-content;
          }
        }
        .response_icon {
          svg {
            width: 24px;
            height: 24px;
          }
        }
      </style>
      ${sharedStyles}
    `;
  },
};

const sharedStyles = html`
  <style>
    .storybook-container {
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
    }

    .main-div {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-bottom: 16px;
    }

    .ai-input-query {
      margin-top: auto;
      display: flex;
      gap: 10px;
      padding: 10px;
      align-items: center;

      background-color: var(--kd-color-background-container-ai-level-2);
      border-radius: 8px;
    }

    .ai-input-query.floating {
      box-shadow: var(--kd-elevation-level-3-ai);
    }

    .ai-input-query kyn-text-area {
      flex-grow: 1;
    }
  </style>
`;
