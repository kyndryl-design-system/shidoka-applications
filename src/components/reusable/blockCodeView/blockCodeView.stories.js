import { html } from 'lit';
import { action } from '@storybook/addon-actions';
import './index';

import '@kyndryl-design-system/shidoka-foundation/components/button';

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
  title: 'Components/Code View - Block',
  component: 'kyn-block-code-view',
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
    copyOptionVisible: {
      control: { type: 'boolean' },
    },
  },
};

const args = {
  size: 'md',
  codeViewLabel: 'Block Code View',
  language: 'javascript',
  copyOptionVisible: true,
  copyButtonText: 'Copy',
  copyButtonDescriptionAttr: 'copy code button',
  copyButtonTitleAttr: 'Copy code',
  unnamed: `
    const greetUser = (name) => {
      console.log(\`Hello, \${name}!\`);
    }

    greetUser('World');
  `,
  exampleInlinetext: 'Inline example text',
};

const Template = (args) => {
  return html`
    <kyn-block-code-view
      size=${args.size}
      codeViewLabel=${args.codeViewLabel}
      copyButtonDescriptionAttr=${args.copyButtonDescriptionAttr}
      copyButtonTitleAttr=${args.copyButtonTitleAttr}
      nameAttr=${args.nameAttr}
      language=${args.language}
      ?copyOptionVisible=${args.copyOptionVisible}
      copyButtonText=${args.copyButtonText}
      @on-custom-copy=${(e) => action('on-custom-copy')(e.detail)}
    >
      ${removeLeadingWhitespace(args.unnamed)}
    </kyn-block-code-view>
  `;
};

export const DefaultView = Template.bind({});
DefaultView.args = {
  ...args,
};

DefaultView.argTypes = {
  snippetType: {
    control: { type: 'select', options: ['inline', 'block'] },
  },
  size: {
    control: { type: 'select', options: ['small', 'medium', 'large'] },
  },
  copyOptionVisible: {
    control: 'boolean',
  },
};

export const SingleLineView = Template.bind({});
SingleLineView.args = {
  ...args,
  codeViewLabel: 'Single Line Code Snippet',
  language: 'javascript',
  copyOptionVisible: true,
  copyButtonText: '',
  unnamed: `console.log("Hello, World!");`,
};

export const JavascriptExample = Template.bind({});
JavascriptExample.args = {
  ...args,
  language: 'javascript',
  codeViewLabel: 'Javascript Code Snippet',
  copyOptionVisible: true,
  copyButtonText: 'Copy',
  unnamed: `
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
  ...args,
  language: 'html',
  codeViewLabel: 'HTML Code Snippet',
  copyOptionVisible: true,
  copyButtonText: 'Copy',
  unnamed: `
    <div class="container">
      <h1>Welcome to my website</h1>
      <p>This is a paragraph of text.</p>
      <button class="btn">Click me!</button>
    </div>
  `,
};

export const CSSExample = Template.bind({});
CSSExample.args = {
  ...args,
  language: 'css',
  codeViewLabel: 'CSS Code Snippet',
  copyOptionVisible: true,
  copyButtonText: 'Copy',
  unnamed: `
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
