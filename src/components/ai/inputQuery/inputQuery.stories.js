import { html } from 'lit';
import { action } from 'storybook/actions';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import './index';
import './inputQueryAttachFile.sample';
import sendIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/send.svg';

export default {
  title: 'AI /Components/AI Input Query',
  component: 'kyn-input-query',
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
    placeholder: 'Type your message...',
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
          placeholder=${args.placeholder}
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
        </kyn-input-query>
      </form>
    `;
  },
};
