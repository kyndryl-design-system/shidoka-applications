import { html } from 'lit';
import { action } from '@storybook/addon-actions';
import './index';

import '@kyndryl-design-system/shidoka-foundation/components/button';

const defaultTemplateCodes = {
  DEFAULT: `
    const greetUser = (name) => {
      console.log(\`Hello, \${name}!\`);
    }

    greetUser('World');
  `,
  SINGLE_LINE: `console.log("Hello, World!");`,
  JAVASCRIPT: `
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
  HTML: `
    <div class="container">
      <h1>Welcome to my website</h1>
      <p>This is a paragraph of text.</p>
      <button class="btn">Click me!</button>
    </div>
  `,
  CSS: `
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
  ariaLabelAttr: '',
  copyOptionVisible: true,
  copyButtonText: 'Copy',
  copyButtonDescriptionAttr: 'copy code button',
  copyButtonTitleAttr: 'Copy code',
  unnamed: defaultTemplateCodes.DEFAULT,
};

const Template = (args) => {
  const ariaLabelAttr =
    args.ariaLabelAttr || `Block ${args.language} code snippet`;

  return html`
    <kyn-block-code-view
      size=${args.size}
      codeViewLabel=${args.codeViewLabel}
      copyButtonDescriptionAttr=${args.copyButtonDescriptionAttr}
      copyButtonTitleAttr=${args.copyButtonTitleAttr}
      nameAttr=${args.nameAttr}
      ariaLabelAttr=${ariaLabelAttr}
      language=${args.language}
      ?copyOptionVisible=${args.copyOptionVisible}
      copyButtonText=${args.copyButtonText}
      @on-custom-copy=${(e) => action('on-custom-copy')(e.detail)}
    >
      ${args.unnamed}
    </kyn-block-code-view>
  `;
};

export const DefaultBlockView = Template.bind({});
DefaultBlockView.args = {
  ...args,
};

export const SingleLineView = Template.bind({});
SingleLineView.args = {
  ...args,
  codeViewLabel: 'Single Line Code Snippet',
  language: 'javascript',
  copyOptionVisible: true,
  copyButtonText: '',
  unnamed: defaultTemplateCodes.SINGLE_LINE,
};

export const JavascriptExample = Template.bind({});
JavascriptExample.args = {
  ...args,
  language: 'javascript',
  codeViewLabel: 'Javascript Code Snippet',
  copyOptionVisible: true,
  copyButtonText: 'Copy',
  unnamed: defaultTemplateCodes.JAVASCRIPT,
};

export const HTMLExample = Template.bind({});
HTMLExample.args = {
  ...args,
  language: 'html',
  codeViewLabel: 'HTML Code Snippet',
  copyOptionVisible: true,
  copyButtonText: 'Copy',
  unnamed: defaultTemplateCodes.HTML,
};

export const CSSExample = Template.bind({});
CSSExample.args = {
  ...args,
  language: 'css',
  codeViewLabel: 'CSS Code Snippet',
  copyOptionVisible: true,
  copyButtonText: 'Copy',
  unnamed: defaultTemplateCodes.CSS,
};
