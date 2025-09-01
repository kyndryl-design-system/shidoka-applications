import { html } from 'lit';
import './index';
import './inputQueryAttachFile.sample';

export default {
  title: 'AI /Components/AI Input Query Attach File',
  component: 'kyn-input-query-attach-file',
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
    controls: { disable: true },
  },
};

export const InputQueryAttachFile = {
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
