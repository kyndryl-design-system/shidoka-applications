import { html } from 'lit';
import { action } from '@storybook/addon-actions';
import './index';

import '@kyndryl-design-system/shidoka-foundation/components/button';

const CODE_VIEW_TYPES = {
  INLINE: 'inline',
  BLOCK: 'block',
};

const createSelectOptions = (defs) => [null, ...Object.values(defs)];

const removeLeadingWhitespace = (code) => {
  if (!code) return '';
  const lines = code.split('\n');
  const minIndent = lines.reduce((min, line) => {
    const indent = line.match(/^\s*/)[0].length;
    return line.trim().length ? Math.min(min, indent) : min;
  }, Infinity);
  return lines
    .map((line) => line.slice(minIndent))
    .join('\n')
    .trim();
};

export default {
  title: 'Components/CodeView',
  component: 'kyn-code-view',
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
  argTypes: {
    size: {
      options: ['sm', 'md', 'lg', 'auto'],
      control: { type: 'select' },
    },
    language: {
      options: [
        'javascript',
        'html',
        'css',
        'scss',
        'json',
        'xml',
        'markdown',
        'svg',
        'yaml',
        'bash',
      ],
      control: { type: 'select' },
    },
    type: {
      options: createSelectOptions(CODE_VIEW_TYPES),
      control: { type: 'select', labels: { null: CODE_VIEW_TYPES.INLINE } },
      table: {
        defaultValue: { summary: CODE_VIEW_TYPES.INLINE },
      },
    },
    copyOptionVisible: {
      control: { type: 'boolean' },
    },
  },
};

const args = {
  title: 'Code View Title Here',
  language: 'javascript',
  type: CODE_VIEW_TYPES.INLINE,
  copyOptionVisible: true,
  copyButtonText: '',
  code: 'console.log("Hello, World!");',
};

const InlineTemplate = (args) => {
  return html`
    <kyn-code-view
      title=${args.title}
      type=${args.type}
      language=${args.language}
      ?copyOptionVisible=${false}
      copyButtonText=${''}
      @on-custom-copy=${(e) => action('on-custom-copy')(e.detail)}
    >
      <span slot="inline-example">${args.exampleInlinetext}</span>
      <pre><code>${removeLeadingWhitespace(args.code)}</code></pre>
    </kyn-code-view>
  `;
};

const BlockTemplate = (args) => {
  return html`
    <kyn-code-view
      size=${args.size}
      title=${args.title}
      type=${args.type}
      language=${args.language}
      ?copyOptionVisible=${args.copyOptionVisible}
      copyButtonText=${args.copyButtonText}
      @on-custom-copy=${(e) => action('on-custom-copy')(e.detail)}
    >
      <pre><code>${removeLeadingWhitespace(args.code)}</code></pre>
    </kyn-code-view>
  `;
};

export const InlineCodeView = InlineTemplate.bind({});
InlineCodeView.args = {
  ...args,
  title: 'Inline Code Snippet',
  exampleInlinetext: 'Example inline text:',
  type: CODE_VIEW_TYPES.INLINE,
};

export const BlockCodeView = BlockTemplate.bind({});
BlockCodeView.args = {
  size: 'md',
  ...args,
  type: CODE_VIEW_TYPES.BLOCK,
  title: 'Block Code Snippet',
  copyButtonText: 'Copy',
  code: `
    const greetUser = (name) => {
      console.log(\`Hello, \${name}!\`);
    }

    greetUser('World');
  `,
};

export const SingleLineView = BlockTemplate.bind({});
SingleLineView.args = {
  size: 'md',
  ...args,
  type: CODE_VIEW_TYPES.BLOCK,
  title: 'Single Line Code Snippet',
  copyButtonText: '',
  code: `console.log("Hello, World!");`,
};

export const JavascriptExample = BlockTemplate.bind({});
JavascriptExample.args = {
  size: 'md',
  ...args,
  language: 'javascript',
  title: 'Javascript Code Snippet',
  type: CODE_VIEW_TYPES.BLOCK,
  copyButtonText: 'Copy',
  code: `
    const addNumbers = (a, b) => {
      return a + b;
    };

    const multiplyNumbers = (a, b) => {
      return a * b;
    };

    const divideNumbers = (a, b) => {
      return a / b;
    };

    const subtractNumbers = (a, b) => {
      return a - b;
    };

    const squareNumber = (a) => {
      return a * a;
    };

    const findMaxNumber = (numbers) => {
      return Math.max(...numbers);
    };

    const findMinNumber = (numbers) => {
      return Math.min(...numbers);
    };

    const isEven = (number) => {
      return number % 2 === 0;
    };

    const isOdd = (number) => {
      return number % 2 !== 0;
    };

    const generateRandomNumber = () => {
      return Math.random();
    };
  `,
};

export const HTMLExample = BlockTemplate.bind({});
HTMLExample.args = {
  size: 'md',
  ...args,
  language: 'html',
  title: 'HTML Code Snippet',
  type: CODE_VIEW_TYPES.BLOCK,
  copyButtonText: 'Copy',
  code: `
    <div class="container">
      <h1>Welcome to my website</h1>
      <p>This is a paragraph of text.</p>
      <button class="btn">Click me!</button>
    </div>
  `,
};

export const CSSExample = BlockTemplate.bind({});
CSSExample.args = {
  size: 'md',
  ...args,
  language: 'css',
  title: 'CSS Code Snippet',
  type: CODE_VIEW_TYPES.BLOCK,
  copyButtonText: 'Copy',
  code: `
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .btn {
      background-color: #0056b3;
      color: white;
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .btn:hover {
      background-color: #003d7a;
      border: 1px solid white;
    }
  `,
};
