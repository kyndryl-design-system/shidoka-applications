import { html } from 'lit';
import { action } from 'storybook/actions';
import '../../components/reusable/textArea';
import '../../components/reusable/button';
import sendIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/send.svg';
import stopIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/control-stop-filled.svg';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import '../../components/reusable/notification';

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
    }

    .ai-input-query.floating {
      box-shadow: var(--kd-elevation-level-3-ai);
    }

    .ai-input-query kyn-text-area {
      flex-grow: 1;
    }
  </style>
`;
