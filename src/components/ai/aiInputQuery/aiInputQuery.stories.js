import { html } from 'lit';
import { action } from 'storybook/actions';
import '../../reusable/textArea';
import '../../reusable/button';
import '../../reusable/dropdown';
import '../../reusable/tag';
import './index';

import sendIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/send.svg';
import stopIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/control-stop-filled.svg';
import analyticsIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/analytics.svg';
import customerEngagementIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/customer-engagement.svg';
import databaseIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/database.svg';
import flowDataIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/flow-data.svg';
import plusIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/add-simple.svg';
import downIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/chevron-down.svg';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';

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
  args: { floating: false },
  render: (args) => {
    return html`
      <kyn-ai-input-query ?floating=${args.floating}>
        <kyn-text-area
          slot="textarea"
          name="ai-query"
          rows="2"
          placeholder="Type your message..."
          maxRowsVisible="3"
          label="AI Prompt Query"
          hideLabel
          aiConnected
          hideBorder
          notResizeable
          @on-input=${(e) => action('on-input')(e.detail)}
        ></kyn-text-area>

        <kyn-button
          slot="action"
          type="submit"
          kind="primary-ai"
          description="Submit"
          @click=${action('submit')}
        >
          <span slot="icon">${unsafeSVG(sendIcon)}</span>
        </kyn-button>
      </kyn-ai-input-query>
    `;
  },
};

export const Thinking = {
  args: { floating: false },
  render: (args) => {
    return html`
      <kyn-ai-input-query ?floating=${args.floating}>
        <kyn-text-area
          slot="textarea"
          name="ai-query"
          rows="2"
          placeholder="Type your message..."
          maxRowsVisible="3"
          label="AI Prompt Query"
          hideLabel
          aiConnected
          hideBorder
          notResizeable
          @on-input=${(e) => action('on-input')(e.detail)}
        ></kyn-text-area>

        <kyn-button
          slot="action"
          type="button"
          kind="primary-ai"
          description="Stop"
          @click=${action('stop')}
        >
          <span slot="icon">${unsafeSVG(stopIcon)}</span>
        </kyn-button>
      </kyn-ai-input-query>
    `;
  },
};

export const Footer = {
  args: {
    floating: false,
    firstDropDownValue: 'Option 1',
    secondDropDownValue: 'Option 1',
    firstDropDownIcon: databaseIcon,
    secondDropDownIcon: customerEngagementIcon,
  },
  parameters: { controls: { include: ['floating'] } },
  render: (args) => {
    return html`
      <kyn-ai-input-query ?floating=${args.floating}>
        <kyn-text-area
          slot="textarea"
          name="ai-query"
          rows="2"
          placeholder="Type your message..."
          maxRowsVisible="3"
          label="AI Prompt Query"
          hideLabel
          aiConnected
          hideBorder
          notResizeable
          @on-input=${(e) => action('on-input')(e.detail)}
        ></kyn-text-area>

        <div slot="footer" class="footer-content">
          <input
            id="ai-file-input"
            type="file"
            name="ai-attachments"
            style="display:none;"
            @change=${(e) => action('files-selected')(e)}
          />

          <kyn-button
            type="button"
            kind="tertiary"
            size="small"
            iconPosition="right"
            description="Additional"
            @click=${() => document.getElementById('ai-file-input')?.click()}
          >
            <span slot="icon">${unsafeSVG(plusIcon)}</span>
          </kyn-button>

          <kyn-dropdown
            ?hideLabel=${true}
            .value=${args.firstDropDownValue}
            kind="ai"
            menuMinWidth="280px"
            @on-change=${(e) => action(e.type)({ ...e, detail: e.detail })}
          >
            <kyn-button
              slot="anchor"
              type="button"
              class="dropdown-anchor-button"
              kind="tertiary"
              size="small"
            >
              <div
                style="display:flex;align-items:center;justify-content:space-between;width:100%;"
              >
                <div style="display:flex;align-items:center;gap:8px;">
                  <span style="display:inline-flex;"
                    >${unsafeSVG(args.firstDropDownIcon)}</span
                  >
                  <span>${args.firstDropDownValue}</span>
                </div>
                <span
                  style="display:inline-flex;align-items:center;height:100%;margin-left:8px;"
                >
                  ${unsafeSVG(downIcon)}
                </span>
              </div>
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
            .value=${args.secondDropDownValue}
            kind="ai"
            menuMinWidth="280px"
            @on-change=${(e) => action(e.type)({ ...e, detail: e.detail })}
          >
            <kyn-button
              slot="anchor"
              type="button"
              class="dropdown-anchor-button"
              kind="tertiary"
              size="small"
            >
              <div
                style="display:flex;align-items:center;justify-content:space-between;width:100%;"
              >
                <div style="display:flex;align-items:center;gap:8px;">
                  <span style="display:inline-flex;"
                    >${unsafeSVG(args.secondDropDownIcon)}</span
                  >
                  <span>${args.secondDropDownValue}</span>
                </div>
                <span
                  style="display:inline-flex;align-items:center;height:100%;margin-left:8px;"
                >
                  ${unsafeSVG(downIcon)}
                </span>
              </div>
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

        <kyn-button
          slot="action"
          type="submit"
          kind="primary-ai"
          description="Submit"
          @click=${action('submit')}
        >
          <span slot="icon">${unsafeSVG(sendIcon)}</span>
        </kyn-button>
      </kyn-ai-input-query>
    `;
  },
};
