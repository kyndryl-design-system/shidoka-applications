import { html } from 'lit';
import { action } from '@storybook/addon-actions';
import '../../components/reusable/textArea';
import '../../components/reusable/button';
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

      <style>
        .ai-input-query {
          display: flex;
          gap: 10px;
          padding: 10px;
          align-items: center;

          background-color: var(--kd-color-background-container-ai-level-2);
          border-radius: 8px;

          &.floating {
            box-shadow: var(--kd-elevation-level-3-ai);
          }

          kyn-text-area {
            flex-grow: 1;
          }
        }
      </style>
    `;
  },
};
