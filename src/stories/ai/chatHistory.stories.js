import { html } from 'lit';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { action } from 'storybook/actions';
import chevronDownIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/chevron-down.svg';
import { WithRightIconAndDescription } from '../infoCard/infoCard.stories.js';
import { ChatMessages } from './chatMessages.stories.js';

import '../../components/reusable/pagetitle';
import '../../components/reusable/search';

export default {
  title: 'AI/Patterns/Chat',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/9Q2XfTSxfzTXfNe2Bi8KDS/Component-Viewer?node-id=7-300051&p=f&m=dev',
    },
  },
};

export const ChatHistory = {
  render: () => {
    return html`
      <div class="chat_list">
        <kyn-page-title type="tertiary" pagetitle="Chat History">
        </kyn-page-title>

        <div class="chat_content">
          <kyn-search
            style="width:100%;"
            name="search"
            label="Search..."
            size="md"
            @on-input=${(e) => action(e.type)({ ...e, detail: e.detail })}
          ></kyn-search>
          <div class="chat-section">
            <p class="kd-type--ui-02 kd-type--weight-medium"></p>
              Day, Date & Time Stamp
            </p>
            ${Array.from({ length: 3 }, () => {
              return html` ${WithRightIconAndDescription.render()} `;
            })}
          </div>
        </div>
        <kyn-link
          standalone
          kind="ai"
          @on-click=${(e) => action(e.type)({ ...e, detail: e.detail })}
          >Show older
          <span style="display:flex;" slot="icon"
            >${unsafeSVG(chevronDownIcon)}</span
          >
        </kyn-link>
      </div>

      <style>
        .chat_list {
          display: flex;
          flex-direction: column;
          gap: var(--kd-spacing-24);
        }
        .chat_content {
          display: flex;
          flex-direction: column;
          gap: var(--kd-spacing-32);
        }
        .chat-section {
          display: flex;
          flex-direction: column;
          gap: var(--kd-spacing-8);
        }
      </style>
    `;
  },
};

export const ChatHistoryDetails = {
  render: () => {
    return html`
      <kyn-page-title
        style="margin-bottom: 4px"
        type="tertiary"
        pagetitle="Chat History"
      >
      </kyn-page-title>
      <div class="chat_details">
        <kyn-link
          kind="ai"
          standalone
          @on-click=${(e) => action(e.type)({ ...e, detail: e.detail })}
        >
          Back
        </kyn-link>
        <kyn-page-title type="tertiary" pagetitle="Page Title">
        </kyn-page-title>
        <div style="width:100%">${ChatMessages.render()}</div>
      </div>
      <style>
        .chat_details {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: var(--kd-spacing-24);
        }
      </style>
    `;
  },
};
