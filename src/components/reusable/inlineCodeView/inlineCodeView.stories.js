import { html } from 'lit';
import './index';

export default {
  title: 'Components/Code View/Inline',
  component: 'kyn-inline-code-view',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/AIX4LLzoDHnFCXzQCiPHJk/Vienna?node-id=4001-43433&node-type=canvas&t=s5gOlFYjWDtlW9CH-0',
    },
  },
  argTypes: {
    darkTheme: {
      options: ['light', 'dark', 'default'],
      control: { type: 'select' },
    },
  },
};

const args = {
  darkTheme: 'default',
  snippetFontSize: 14,
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
