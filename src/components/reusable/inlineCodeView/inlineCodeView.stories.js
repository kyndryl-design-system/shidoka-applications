import { html } from 'lit';
import './index';

export default {
  title: 'Components/Code View - Inline',
  component: 'kyn-inline-code-view',
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
  argTypes: {
    ariaLabelAttr: {
      control: 'text',
    },
    inlineSnippetFontSize: {
      control: 'text',
    },
  },
};

const args = {
  ariaLabelAttr: 'Inline Code View Snippet',
  unnamed: `console.log("Hello, World!");`,
  inlineSnippetFontSize: '14px',
};

export const InlineCodeView = {
  args,
  render: (args) => {
    return html`
      <kyn-inline-code-view
        ariaLabelAttr=${args.ariaLabelAttr}
        style="--inline-snippet-font-size: ${args.inlineSnippetFontSize};"
      >
        ${args.unnamed}
      </kyn-inline-code-view>
    `;
  },
};
