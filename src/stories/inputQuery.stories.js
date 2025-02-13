import { html } from 'lit';
import '../components/reusable/textArea';
import '../components/reusable/button';
import sendIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/send.svg';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';

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
  render: () => {
    return html`
      <div class="input-query-container">
        <kyn-text-area
          class="input-text-area"
          rows="2"
          placeholder="Type your message..."
          maxRowsVisible="3"
          ?aiConnected=${true}
        ></kyn-text-area>
        <kyn-button kind="primary-ai" description="send button">
          <span slot="icon">${unsafeSVG(sendIcon)}</span>
        </kyn-button>
      </div>

      <style>
        .input-query-container {
          width: 724px;
          display: flex;
          align-items: center;
          gap: 10px;

          background-color: var(--kd-color-background-container-ai-default);
          box-shadow: 0px 0px 24px 0px var(--kd-color-border-dropshadow-ai);
          border-radius: 8px;

          .input-text-area {
            width: 654px;
            padding: 2px 0px 10px 10px;
          }
        }
      </style>
    `;
  },
};
