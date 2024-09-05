import { html } from 'lit';
import { action } from '@storybook/addon-actions';
import './index';

import '@kyndryl-design-system/shidoka-foundation/components/button';

const CODE_VIEW_TYPES = {
  INLINE: 'inline',
  BLOCK: 'block',
};

const createSelectOptions = (defs) => [null, ...Object.values(defs)];

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
      options: ['javascript', 'html', 'css', 'scss', 'json', 'xml', 'markdown'],
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
  size: 'md',
  label: 'code view label',
  language: 'javascript',
  type: CODE_VIEW_TYPES.INLINE,
  copyOptionVisible: true,
  copyButtonText: ' ',
  code: 'console.log("Hello, World!");',
};

const Template = (args) => html`
  <kyn-code-view
    size=${args.size}
    title=${args.title}
    label=${args.label}
    type=${args.type}
    language=${args.language}
    ?copyOptionVisible=${args.copyOptionVisible}
    code=${args.code}
    copyButtonText=${args.copyButtonText}
    @on-custom-copy=${(e) => action('copy')(e.detail)}
  >
    <kd-button
      @click=${(e) => {
        e.target.dispatchEvent(
          new CustomEvent('on-custom-copy', {
            bubbles: true,
            composed: true,
            detail: { code: args.code },
          })
        );
      }}
    >
      ${args.copyButtonText}
    </kd-button>
  </kyn-code-view>
`;

export const InlineCodeView = Template.bind({});
InlineCodeView.args = {
  ...args,
  type: CODE_VIEW_TYPES.INLINE,
};

export const BlockCodeView = Template.bind({});
BlockCodeView.args = {
  ...args,
  type: CODE_VIEW_TYPES.BLOCK,
  copyButtonText: 'Copy',
  code: `const greetUser = (name) => {
  console.log(\`Hello, \${name}!\`);
}

greetUser('World');
  `.trim(),
};

export const JavascriptExample = Template.bind({});
JavascriptExample.args = {
  ...args,
  language: 'javascript',
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
  `.trim(),
};

export const HTMLExample = Template.bind({});
HTMLExample.args = {
  ...args,
  language: 'html',
  type: CODE_VIEW_TYPES.BLOCK,
  copyButtonText: 'Copy',
  code: `<div class="container">
  <h1>Welcome to my website</h1>
  <p>This is a paragraph of text.</p>
  <button class="btn">Click me!</button>
</div>
  `.trim(),
};

export const CSSExample = Template.bind({});
CSSExample.args = {
  ...args,
  language: 'css',
  type: CODE_VIEW_TYPES.BLOCK,
  copyButtonText: 'Copy',
  code: `.container {
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
  `.trim(),
};
