import { html } from 'lit';
import { action } from '@storybook/addon-actions';
import './index';

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
    maxHeight: {
      control: {
        type: 'number',
        min: 250,
      },
    },
    darkTheme: {
      options: ['light', 'dark', 'darker'],
      control: { type: 'select' },
    },
  },
};

const args = {
  darkTheme: 'darker',
  languages: [],
  size: 'md',
  maxHeight: null,
  codeViewLabel: 'Block Code View',
  copyOptionVisible: true,
  codeViewExpandable: true,
  copyButtonText: 'Copy',
  ariaLabelAttr: '',
  copyButtonDescriptionAttr: 'Copy code button',
  copyButtonTitleAttr: 'copy-code-button',
  codeSnippet: defaultTemplateCodes.DEFAULT,
};

const Template = (args) => {
  const ariaLabelAttr =
    args.ariaLabelAttr || `Block ${args.language} code snippet`;
  const maxHeight = args.maxHeight === null ? null : Number(args.maxHeight);

  return html`
    <kyn-block-code-view
      darkTheme=${args.darkTheme}
      .languages=${args.languages}
      size=${args.size}
      .maxHeight=${maxHeight}
      codeViewLabel=${args.codeViewLabel}
      ?copyOptionVisible=${args.copyOptionVisible}
      ?codeViewExpandable=${args.codeViewExpandable}
      copyButtonText=${args.copyButtonText}
      ariaLabelAttr=${ariaLabelAttr}
      copyButtonDescriptionAttr=${args.copyButtonDescriptionAttr}
      copyButtonTitleAttr=${args.copyButtonTitleAttr}
      codeSnippet=${args.codeSnippet}
      @on-custom-copy=${(e) => action('on-custom-copy')(e.detail)}
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
  codeViewLabel: 'Swift Code Snippet',
  copyButtonText: '',
  codeSnippet: defaultTemplateCodes.SWIFT,
};

export const BashExample = Template.bind({});
BashExample.args = {
  ...args,
  languages: ['bash'],
  codeViewLabel: 'Bash Code Snippet (manually configured language name)',
  copyButtonText: '',
  codeSnippet: defaultTemplateCodes.BASH,
};
