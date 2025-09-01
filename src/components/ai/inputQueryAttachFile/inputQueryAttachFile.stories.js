import { html } from 'lit';
import './index';
import './inputQueryAttachFileSample';

export default {
  title: 'AI /Components/AI Input Query Attach File',
  component: 'kyn-input-query-attach-file',
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
};

export const InputQueryAttachFile = {
  render: () => {
    return html`<sample-attach-file></sample-attach-file> `;
  },
};
