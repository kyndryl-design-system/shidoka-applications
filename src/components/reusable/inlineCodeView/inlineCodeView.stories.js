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

export const InlineCodeView = {
  args: {
    ariaLabelAttr: 'Inline Code View Snippet',
    unnamed: `console.log("Hello, World!");`,
    inlineSnippetFontSize: '14px',
  },
  render: (args) => {
    return html`
      <kyn-inline-code-view
        ariaLabelAttr=${args.ariaLabelAttr}
        style="--inline-snippet-font-size: ${args.inlineSnippetFontSize};"
      >
        <code>${args.unnamed}</code>
      </kyn-inline-code-view>
    `;
  },
};

// potential multi-line variation for the future:
// export const MultiLineExample = {
//   args: {
//     ariaLabelAttr: 'Multi-line Inline Code View',
//     unnamed: `
//       function greet(name) {
//         console.log(\`Hello, \${name}!\`);
//       }

//       greet('World');
//     `,
//      inlineSnippetFontSize: '14px',
//   },
//   render: (args) => {
//     return html`
//       <kyn-inline-code-view
//        ariaLabelAttr=${args.ariaLabelAttr}
//        style="--inline-snippet-font-size: ${args.inlineSnippetFontSize};"
//        >
//         <code>${removeLeadingWhitespace(args.unnamed)}</code>
//       </kyn-inline-code-view>
//     `;
//   },
// };
