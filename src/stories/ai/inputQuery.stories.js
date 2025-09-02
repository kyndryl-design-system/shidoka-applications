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
import downIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/chevron-down.svg';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import '../../components/reusable/notification';
import '../../components/reusable/dropdown';
import '../../components/reusable/tag';
import '../../components/ai/inputQuery';
import '../../components/ai/inputQuery/inputQueryAttachFile.sample';

export default {
  title: 'AI/Patterns/Input Query',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/9Q2XfTSxfzTXfNe2Bi8KDS/Component-Viewer?node-id=7-300057&p=f&m=dev',
    },
  },
};

export const AttachFile = {
  render: () => {
    return html`<div>
        <sample-attach-file></sample-attach-file> <br /><br />
      </div>
      <a
        href="https://github.com/kyndryl-design-system/shidoka-applications/blob/main/src/components/ai/inputQueryAttachFile/inputQueryAttachFile.sample.ts"
        target="_blank"
        rel="noopener"
      >
        See the full example component code here.
      </a>`;
  },
};

export const Thinking = {
  args: {
    floating: false,
  },
  render: (args) => {
    return html`
      <form
        @submit=${(e) => {
          e.preventDefault();
          action('submit')(e);
          const formData = new FormData(e.target);
          console.log(...formData);
        }}
      >
        <kyn-input-query
          name="attach-file"
          placeholder="Type your message..."
          .floating=${args.floating}
          @on-input=${(e) => action(e.type)({ ...e, detail: e.detail })}
        >
          <kyn-button
            type="submit"
            name="test"
            kind="primary-ai"
            description="Submit"
            @on-change=${(e) => action(e.type)({ ...e, detail: e.detail })}
          >
            <span slot="icon">${unsafeSVG(stopIcon)}</span>
          </kyn-button>
        </kyn-input-query>
      </form>
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
  parameters: {
    controls: { disable: true },
  },
  render: (args) => {
    return html`
      <form
        @submit=${(e) => {
          e.preventDefault();
          action('submit')(e);
          const formData = new FormData(e.target);
          console.log(...formData);
        }}
      >
        <kyn-input-query
          name="attach-file"
          placeholder="Type your message..."
          .floating=${args.floating}
          @on-input=${(e) => action(e.type)({ ...e, detail: e.detail })}
        >
          <kyn-button
            type="submit"
            name="test"
            kind="primary-ai"
            description="Submit"
            @on-change=${(e) => action(e.type)({ ...e, detail: e.detail })}
          >
            <span slot="icon">${unsafeSVG(sendIcon)}</span>
          </kyn-button>
          <kyn-dropdown
            slot="footer"
            ?hideLabel=${true}
            value=${args.firstDropDownValue}
            kind="ai"
            menuMinWidth="280px"
            @on-change=${(e) => action(e.type)({ ...e, detail: e.detail })}
          >
            <kyn-button
              slot="anchor"
              class="dropdown-anchor-button"
              kind="secondary-ai"
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
            slot="footer"
            ?hideLabel=${true}
            value=${args.secondDropDownValue}
            kind="ai"
            menuMinWidth="280px"
            @on-change=${(e) => action(e.type)({ ...e, detail: e.detail })}
          >
            <kyn-button
              slot="anchor"
              class="dropdown-anchor-button"
              kind="secondary-ai"
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
        </kyn-input-query>
      </form>
    `;
  },
};
