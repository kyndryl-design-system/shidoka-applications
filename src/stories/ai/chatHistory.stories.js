import { html } from 'lit';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { action } from '@storybook/addon-actions';
import chevronDownIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/chevron-down.svg';
import { WithRightIconAndDescription } from './infoCard.stories.js';
import { ChatMessages } from './chatMessages.stories.js';

import '../../components/reusable/pagetitle';
import '../../components/reusable/search';

export default {
  title: 'AI/Patterns/Chat',
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
};

export const ChatHistory = {
  render: () => {
    return html`
      <div class="chat_list">
        <kyn-page-title type="tertiary" pagetitle="Chat History" aiConnected>
        </kyn-page-title>

        <div class="chat_content">
          <kyn-search
            style="width:100%;"
            name="search"
            label="Search..."
            size="md"
            @on-input=${(e) => action(e.type)(e)}
          ></kyn-search>
          <div class="chat-section">
            <label class="kd-type--ui-02 kd-type--weight-medium"
              >Day, Date & Time Stamp</label
            >
            ${Array.from({ length: 3 }, () => {
              return html` ${WithRightIconAndDescription.render()} `;
            })}
          </div>
        </div>
        <kyn-link standalone kind="ai" @on-click=${(e) => action(e.type)(e)}
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
        aiConnected
      >
      </kyn-page-title>
      <div class="chat_details">
        <kyn-link kind="ai" standalone @on-click=${(e) => action(e.type)(e)}>
          Back
        </kyn-link>
        <kyn-page-title type="tertiary" pagetitle="Page Title" aiConnected>
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
