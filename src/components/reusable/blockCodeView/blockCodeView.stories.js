import { html } from 'lit';
import { action } from '@storybook/addon-actions';
import './index';

import '../button';

const defaultTemplateCodes = {
  DEFAULT: `
    const greetUser = (name) => {
      console.log(\`Hello, \${name}!\`);
    }

    /* NOTE: Comment here */

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
  BASH: `npm install @kyndryl-design-system/shidoka-applications @kyndryl-design-system/shidoka-foundation -S`,
  SWIFT: `struct Person {
    let name: String
    var age: Int

    func introduce() -> String {
        return "Hello, I'm (name) and I'm (age) years old."
    }
}

let john = Person(name: "John Doe", age: 30)
print(john.introduce())`,
};

export default {
  title: 'Components/Code View/Block',
  component: 'kyn-block-code-view',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/AIX4LLzoDHnFCXzQCiPHJk/Vienna?node-id=4001-43433&node-type=canvas&t=s5gOlFYjWDtlW9CH-0',
    },
  },
  argTypes: {
    copyOptionVisible: {
      control: { type: 'boolean' },
    },
    maxHeight: {
      control: {
        type: 'number',
        min: 150,
      },
    },
    darkTheme: {
      options: ['light', 'dark', 'default'],
      control: { type: 'select' },
    },
  },
};

const args = {
  darkTheme: 'default',
  language: '',
  maxHeight: null,
  codeViewLabel: 'Block Code View',
  copyOptionVisible: true,
  codeViewExpandable: true,
  copyButtonText: 'Copy',
  copyButtonDescriptionAttr: 'Copy code button',
  textStrings: {
    collapsed: 'Collapsed',
    expanded: 'Expanded',
  },
  codeSnippet: defaultTemplateCodes.DEFAULT,
};

const Template = (args) => {
  const maxHeight = args.maxHeight === null ? null : Number(args.maxHeight);

  return html`
    <kyn-block-code-view
      darkTheme=${args.darkTheme}
      language=${args.language}
      .maxHeight=${maxHeight}
      codeViewLabel=${args.codeViewLabel}
      ?copyOptionVisible=${args.copyOptionVisible}
      ?codeViewExpandable=${args.codeViewExpandable}
      copyButtonText=${args.copyButtonText}
      copyButtonDescriptionAttr=${args.copyButtonDescriptionAttr}
      .textStrings=${args.textStrings}
      codeSnippet=${args.codeSnippet}
      @on-copy=${(e) => action('on-copy')(e.detail)}
    >
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
  copyButtonText: '',
  codeSnippet: defaultTemplateCodes.SINGLE_LINE,
};

export const JavascriptExample = Template.bind({});
JavascriptExample.args = {
  ...args,
  codeViewLabel: 'Javascript Code Snippet',
  codeViewExpandable: true,
  copyButtonText: 'Copy',
  codeSnippet: defaultTemplateCodes.JAVASCRIPT,
};

export const HTMLExample = Template.bind({});
HTMLExample.args = {
  ...args,
  codeViewLabel: 'HTML Code Snippet',
  copyButtonText: '',
  codeSnippet: defaultTemplateCodes.HTML,
};

export const CSSExample = Template.bind({});
CSSExample.args = {
  ...args,
  codeViewLabel: 'CSS Code Snippet',
  copyButtonText: 'Copy',
  codeSnippet: defaultTemplateCodes.CSS,
};

export const SwiftExample = Template.bind({});
SwiftExample.args = {
  ...args,
  language: 'swift',
  codeViewLabel: 'Swift Code Snippet (manually configured language name)',
  copyButtonText: '',
  codeSnippet: defaultTemplateCodes.SWIFT,
};

export const BashExample = Template.bind({});
BashExample.args = {
  ...args,
  language: 'bash',
  codeViewLabel: 'Bash Code Snippet (manually configured language name)',
  copyButtonText: '',
  codeSnippet: defaultTemplateCodes.BASH,
};
