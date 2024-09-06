import { html } from 'lit';
import { action } from '@storybook/addon-actions';
import './index';

import '@kyndryl-design-system/shidoka-foundation/components/button';

const CODE_VIEW_TYPES = {
  INLINE: 'inline',
  BLOCK: 'block',
};

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
    copyOptionVisible: {
      control: { type: 'boolean' },
    },
  },
};

const Template = (args) => {
  if (args.snippetType === CODE_VIEW_TYPES.INLINE) {
    return html`
      <kyn-code-view
        title=${args.title}
        snippetType=${args.snippetType}
        language=${args.language}
        ?copyOptionVisible=${false}
        copyButtonText=${''}
        @on-custom-copy=${(e) => action('on-custom-copy')(e.detail)}
      >
        <span slot="inline-example">${args.exampleInlinetext}</span>
        <pre><code>${removeLeadingWhitespace(args.code)}</code></pre>
      </kyn-code-view>
    `;
  } else {
    return html`
      <kyn-code-view
        size=${args.size}
        title=${args.title}
        snippetType=${args.snippetType}
        language=${args.language}
        ?copyOptionVisible=${args.copyOptionVisible}
        copyButtonText=${args.copyButtonText}
        @on-custom-copy=${(e) => action('on-custom-copy')(e.detail)}
      >
        <pre><code>${removeLeadingWhitespace(args.code)}</code></pre>
      </kyn-code-view>
    `;
  }
};

export const BlockCodeView = Template.bind({});
BlockCodeView.args = {
  snippetType: 'block',
  size: 'md',
  title: 'Block Code View',
  language: 'javascript',
  copyOptionVisible: true,
  copyButtonText: 'Copy',
  code: `
    const greetUser = (name) => {
      console.log(\`Hello, \${name}!\`);
    }

    greetUser('World');
  `,
  exampleInlinetext: 'Inline example text',
};

BlockCodeView.argTypes = {
  snippetType: {
    control: { type: 'select', options: ['inline', 'block'] },
  },
  size: {
    control: { type: 'select', options: ['small', 'medium', 'large'] },
  },
  language: {
    control: { type: 'select', options: ['javascript', 'html', 'css'] },
  },
  copyOptionVisible: {
    control: 'boolean',
  },
};

export const InlineCodeView = Template.bind({});
InlineCodeView.args = {
  snippetType: CODE_VIEW_TYPES.INLINE,
  title: 'Inline Code Snippet',
  language: 'javascript',
  exampleInlinetext: 'Example inline text:',
  code: `console.log("Hello, World!");`,
};

export const SingleLineView = Template.bind({});
SingleLineView.args = {
  size: 'md',
  snippetType: CODE_VIEW_TYPES.BLOCK,
  title: 'Single Line Code Snippet',
  language: 'javascript',
  copyOptionVisible: true,
  copyButtonText: '',
  code: `console.log("Hello, World!");`,
};

export const JavascriptExample = Template.bind({});
JavascriptExample.args = {
  size: 'md',
  snippetType: CODE_VIEW_TYPES.BLOCK,
  language: 'javascript',
  title: 'Javascript Code Snippet',
  copyOptionVisible: true,
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

export const HTMLExample = Template.bind({});
HTMLExample.args = {
  size: 'md',
  snippetType: CODE_VIEW_TYPES.BLOCK,
  language: 'html',
  title: 'HTML Code Snippet',
  copyOptionVisible: true,
  copyButtonText: 'Copy',
  code: `
    <div class="container">
      <h1>Welcome to my website</h1>
      <p>This is a paragraph of text.</p>
      <button class="btn">Click me!</button>
    </div>
  `,
};

export const CSSExample = Template.bind({});
CSSExample.args = {
  size: 'md',
  snippetType: CODE_VIEW_TYPES.BLOCK,
  language: 'css',
  title: 'CSS Code Snippet',
  copyOptionVisible: true,
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
