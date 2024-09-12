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
    darkTheme: {
      options: ['light', 'dark', 'darker'],
      control: { type: 'select' },
    },
  },
};

const args = {
  snippetFontSize: 14,
  darkTheme: 'darker',
  unnamed: `console.log("Hello, World!");`,
};

export const InlineCodeView = {
  args,
  render: (args) => {
    return html`
      <kyn-inline-code-view
        darkTheme=${args.darkTheme}
        snippetFontSize=${args.snippetFontSize}
      >
        ${args.unnamed}
      </kyn-inline-code-view>
    `;
  },
};
