import { html } from 'lit';
import { action } from '@storybook/addon-actions';
import './blockCodeView/index';
import './inlineCodeView/index';

import '@kyndryl-design-system/shidoka-foundation/components/button';

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
  title: 'Components/Code View',
  parameters: {
    docs: {
      description: {
        component:
          'The following documentation combines both `Block` and `Inline` code view components. Inline Code View displays code snippets inline within HTML content. Block Code View displays `<code>` snippets as standalone single-/multi-line block elements, utilizing highlight.js (`https://highlightjs.org/`) for syntax highlighting.',
      },
    },
    design: {
      type: 'figma',
      url: '',
    },
  },
};

export const BlockCodeView = {
  title: 'Components/Code View/Block',
  component: 'kyn-block-code-view',
  argTypes: {
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
      options: ['light', 'dark'],
      control: { type: 'select' },
    },
  },
  args: {
    darkTheme: 'dark',
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
  },
  render: (args) => {
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
  },
};

export const InlineCodeView = {
  title: 'Components/Code View/Inline',
  component: 'kyn-inline-code-view',
  argTypes: {
    darkTheme: {
      options: ['light', 'dark'],
      control: { type: 'select' },
    },
  },
  args: {
    darkTheme: 'dark',
    snippetFontSize: 14,
    unnamed: `console.log("Hello, World!");`,
  },
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

export const BlockSingleLineView = {
  ...BlockCodeView,
  args: {
    ...BlockCodeView.args,
    language: '',
    codeViewLabel: 'Single Line Code Snippet',
    copyButtonText: '',
    codeSnippet: defaultTemplateCodes.SINGLE_LINE,
  },
};

export const BlockJavascriptExample = {
  ...BlockCodeView,
  args: {
    ...BlockCodeView.args,
    language: '',
    codeViewLabel: 'Javascript Code Snippet',
    codeViewExpandable: true,
    copyButtonText: 'Copy',
    codeSnippet: defaultTemplateCodes.JAVASCRIPT,
  },
};

export const BlockHTMLExample = {
  ...BlockCodeView,
  args: {
    ...BlockCodeView.args,
    language: '',
    codeViewLabel: 'HTML Code Snippet',
    copyButtonText: '',
    codeSnippet: defaultTemplateCodes.HTML,
  },
};

export const BlockCSSExample = {
  ...BlockCodeView,
  args: {
    ...BlockCodeView.args,
    language: '',
    codeViewLabel: 'CSS Code Snippet',
    copyButtonText: 'Copy',
    codeSnippet: defaultTemplateCodes.CSS,
  },
};

export const BlockSwiftExample = {
  ...BlockCodeView,
  args: {
    ...BlockCodeView.args,
    language: 'swift',
    codeViewLabel: 'Swift Code Snippet (manually configured language name)',
    copyButtonText: '',
    codeSnippet: defaultTemplateCodes.SWIFT,
  },
};

export const BlockBashExample = {
  ...BlockCodeView,
  args: {
    ...BlockCodeView.args,
    language: 'bash',
    codeViewLabel: 'Bash Code Snippet (manually configured language name)',
    copyButtonText: '',
    codeSnippet: defaultTemplateCodes.BASH,
  },
};
