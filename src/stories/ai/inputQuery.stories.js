import { html } from 'lit';
import { action } from 'storybook/actions';
import '../../components/reusable/textArea';
import '../../components/reusable/button';
import sendIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/send.svg';
import stopIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/control-stop-filled.svg';
import analyticsIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/analytics.svg';
import customerEngagementIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/customer-engagement.svg';
import databaseIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/database.svg';
import flowDataIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/flow-data.svg';
import plusIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/add-simple.svg';
import downIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/chevron-down.svg';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import '../../components/reusable/notification';
import '../../components/reusable/dropdown';
import '../../components/reusable/tag';

export default {
  title: 'AI/Patterns/Input Query',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/9Q2XfTSxfzTXfNe2Bi8KDS/Component-Viewer?node-id=7-300057&p=f&m=dev',
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

      ${sharedStyles}
    `;
  },
};

export const Footer = {
  args: {
    floating: true,
    firstDropDownValue: 'Option 1',
    secondDropDownValue: 'Option 1',
    firstDropDownIcon: databaseIcon,
    secondDropDownIcon: customerEngagementIcon,
  },
  parameters: {
    controls: { include: ['floating'] },
  },
  render: (args) => {
    return html`
      <form
        class="ai-input-query query-footer ${args.floating ? 'floating' : ''}"
        @submit=${(e) => {
          e.preventDefault();
          action('submit')(e);
          const formData = new FormData(e.target);
          console.log(...formData);
        }}
      >
        <div class="message-content">
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
        </div>
        <div class="footer-content">
          <kyn-button
            kind="tertiary"
            size="small"
            iconPosition="right"
            description="Additional"
          >
            ${unsafeSVG(plusIcon)}
          </kyn-button>
          <kyn-dropdown
            ?hideLabel=${true}
            value=${args.firstDropDownValue}
            kind="ai"
            menuMinWidth="280px"
            @on-change=${(e) => action(e.type)({ ...e, detail: e.detail })}
          >
            <kyn-button
              slot="anchor"
              class="dropdown-anchor-button"
              kind="tertiary"
              size="small"
              iconPosition="right"
            >
              <span style="display:inline-flex;margin-right: 8px;">
                ${unsafeSVG(args.firstDropDownIcon)}
              </span>
              ${args.firstDropDownValue}
              <span slot="icon">${unsafeSVG(downIcon)}</span>
            </kyn-button>
            <kyn-enhanced-dropdown-option value="Option 1">
              <span slot="icon">${unsafeSVG(databaseIcon)}</span>
              <span slot="title">Option 1</span>
              <span slot="description">Description for the Option 1</span>
            </kyn-enhanced-dropdown-option>
            <kyn-enhanced-dropdown-option value="Option 2">
              <span slot="icon">${unsafeSVG(analyticsIcon)}</span>
              <span slot="title">Option 2</span>
              <kyn-tag
                slot="tag"
                label="New chat"
                tagSize="sm"
                tagColor="ai"
              ></kyn-tag>
              <span slot="description">Description for the Option 2</span>
            </kyn-enhanced-dropdown-option>
          </kyn-dropdown>
          <kyn-dropdown
            ?hideLabel=${true}
            value=${args.secondDropDownValue}
            kind="ai"
            menuMinWidth="280px"
            @on-change=${(e) => action(e.type)({ ...e, detail: e.detail })}
          >
            <kyn-button
              slot="anchor"
              class="dropdown-anchor-button"
              kind="tertiary"
              size="small"
              iconPosition="right"
            >
              <span style="display:inline-flex;margin-right: 8px;">
                ${unsafeSVG(args.secondDropDownIcon)}
              </span>
              ${args.secondDropDownValue}
              <span slot="icon">${unsafeSVG(downIcon)}</span>
            </kyn-button>
            <kyn-enhanced-dropdown-option value="Option 1">
              <span slot="icon">${unsafeSVG(flowDataIcon)}</span>
              <span slot="title">Option 1</span>
              <span slot="description">Description for the Option 1</span>
            </kyn-enhanced-dropdown-option>
            <kyn-enhanced-dropdown-option value="Option 2">
              <span slot="icon">${unsafeSVG(customerEngagementIcon)}</span>
              <span slot="title">Option 2</span>
              <kyn-tag
                slot="tag"
                label="New chat"
                tagSize="sm"
                tagColor="ai"
              ></kyn-tag>
              <span slot="description">Description for the Option 2</span>
            </kyn-enhanced-dropdown-option>
          </kyn-dropdown>
        </div>
      </form>

      ${sharedStyles}
      <style>
        .query-footer {
          margin-top: auto;
          display: flex;
          flex-direction: column;
          align-items: stretch;
        }
        .message-content {
          display: flex;
          gap: 10px;
          align-items: center;
        }
        .footer-content {
          display: flex;
          padding: 0 2px;
          flex-direction: row;
          align-items: flex-start;
          gap: 10px;
          flex-wrap: wrap;
          align-self: stretch;
        }
      </style>
    `;
  },
};

const sharedStyles = html`
  <style>
    .ai-input-query {
      margin-top: auto;
      display: flex;
      gap: 10px;
      padding: 10px;
      align-items: center;
      background-color: var(--kd-color-background-container-ai-level-2);
      border-radius: 8px;
      border-color: var(--kd-color-border-forms-default);
    }

    .ai-input-query.floating {
      box-shadow: var(--kd-elevation-level-3-ai);
    }

    .ai-input-query kyn-text-area {
      flex-grow: 1;
    }
  </style>
`;
