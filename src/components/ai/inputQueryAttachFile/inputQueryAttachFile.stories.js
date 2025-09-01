import { html } from 'lit';
import './index';
import './inputQueryAttachFileSample';

export default {
  title: 'AI /Components/AI Input Query Attach File',
  component: 'kyn-input-query-attach-file',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/9Q2XfTSxfzTXfNe2Bi8KDS/Component-Viewer?node-id=4-420751&p=f&t=A5tcETiCf23sAgKK-0',
    },
  },
};

export const InputQueryAttachFile = {
  render: () => {
    return html`<sample-attach-file></sample-attach-file> `;
  },
};
