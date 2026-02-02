import { html } from 'lit';
import './index';

export default {
  title: 'AI/Components/ChatOnboardContent',
  component: 'kyn-chat-onboard-content',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/9Q2XfTSxfzTXfNe2Bi8KDS/Component-Viewer?node-id=7-300058&p=f&m=dev',
    },
  },
};

export const Default = {
  render: () => {
    return html` <kyn-chat-onboard-content></kyn-chat-onboard-content> `;
  },
};
