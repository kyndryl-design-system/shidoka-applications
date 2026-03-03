// Script to create a new web component with boilerplate files i.e. index.ts, component.ts, component.scss and component.stories.js
// Usage: Run `npm run create:component` at the root level and follow the prompts.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';
import process from 'node:process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const validFolders = ['ai', 'global', 'reusable'];

// Function to prompt questions
function askQuestion(rl, question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

// Create component
async function createComponent() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    let componentName = await askQuestion(
      rl,
      '📝 Enter component name (e.g., myButton): '
    );

    if (!componentName) {
      console.error('❌ Error: Component name is required!');
      rl.close();
      process.exit(1);
    }

    // If component name is all uppercase, convert to lowercase
    if (componentName === componentName.toUpperCase()) {
      componentName = componentName.toLowerCase();
    }

    console.log('\n📁 Select folder type:');
    validFolders.forEach((folder) => {
      console.log(`   - ${folder}`);
    });

    let selectedFolder = await askQuestion(
      rl,
      '\nEnter folder type (ai, global, reusable): '
    );
    selectedFolder = selectedFolder.toLowerCase().trim();

    if (!validFolders.includes(selectedFolder)) {
      console.error(
        `❌ Error: Invalid folder type "${selectedFolder}". Valid options: ${validFolders.join(
          ', '
        )}`
      );
      rl.close();
      process.exit(1);
    }

    const folderType = selectedFolder;
    console.log(`\n📂 Selected folder: ${folderType}`);

    rl.close();

    await generateComponent(componentName, folderType);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

async function generateComponent(componentName, folderType) {
  // Validate inputs
  if (!componentName || !folderType) {
    console.error(
      '❌ Error: Invalid parameters - componentName and folderType are required!'
    );
    process.exit(1);
  }

  // Convert component name to different formats
  const camelCase =
    componentName.charAt(0).toLowerCase() + componentName.slice(1);
  const kebabCase = camelCase.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  const pascalCase =
    componentName.charAt(0).toUpperCase() + componentName.slice(1);
  const componentDir = path.join(
    __dirname,
    `../src/components/${folderType}`,
    camelCase
  );

  console.log(`\n📍 Component path: ${componentDir}`);
  console.log(`   Folder Type: ${folderType}`);
  console.log(`   Component Name: ${camelCase}`);

  // Check if directory already exists
  if (fs.existsSync(componentDir)) {
    console.error(`❌ Error: Directory ${camelCase} already exists!`);
    process.exit(1);
  }

  // Create directory
  fs.mkdirSync(componentDir, { recursive: true });
  console.log(`✓ Created folder: src/components/${folderType}/${camelCase}`);

  // 1. Create index.ts
  const indexContent = `export { ${pascalCase} } from './${camelCase}';
`;
  fs.writeFileSync(path.join(componentDir, 'index.ts'), indexContent);
  console.log(`✓ Created index.ts`);

  // 2. Create component.ts
  const componentContent = `import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property,state, query } from 'lit/decorators.js';

import styles from './${camelCase}.scss?inline';

/**
 * \`kyn-${kebabCase}\` Web Component.
 * ${componentName} component description.
 * @fires on-click - Captures the click event and emits a custom event.
 * @slot unnamed - Slot for child components.
 */
@customElement('kyn-${kebabCase}')
export class ${pascalCase} extends LitElement {
  static override styles = unsafeCSS(styles);

  /**
   * The label text displayed in the component.
   * @type {string}
   */
  @property({ type: String })
  accessor label = '';

  /** exposed reactive boolean property */
  @property({ type: Boolean })
  accessor booleanProp = false; // booleans must always default to false

  /** exposed reactive array property */
  @property({ type: Array })
  accessor arrayProp = [];

  /** internal reactive property
   * @internal
   */
  @state()
  accessor _internalProp = 'Internal Prop'; // use an underscore to signify internal variables/methods

  /** .component element reference. does not get updated until after Lit update lifecycle completes
   * @internal
   */
  @query('.component')
  accessor _component!: HTMLElement;

  override render() {
    return html\`<div class="container">
    <label class="label-text" for="label">\${this.label}</label>
        \${this._internalProp}
        <div class="slot-container"><slot></slot></div>
        <button class="btn-content" @click=\${(e: any) => this._handleClick(e)}>Button</button>
    </div>\`;
  }

  /** click event handler */
  private _handleClick(e: Event) {
    const Event = new CustomEvent('on-click', {
      detail: {
        origEvent: e,
      },
    });
    this.dispatchEvent(Event);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-${kebabCase}': ${pascalCase};
  }
}
`;
  fs.writeFileSync(
    path.join(componentDir, `${camelCase}.ts`),
    componentContent
  );
  console.log(`✓ Created ${camelCase}.ts`);

  // 3. Create component.scss
  const scssContent = `@use '../../../common/scss/global.scss';
@use '@kyndryl-design-system/shidoka-foundation/scss/mixins/typography.scss';

:host {
  /* web components are display: inline; by default */
  display: block;
}
.container {
  .label-text {
    @include typography.type-ui-02;
    color: var(--kd-color-text-forms-label-primary);
    font-weight: var(--kd-font-weight-medium);
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0;
    margin-bottom: 8px;
    cursor: default;
  }

  .slot-container {
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--kd-color-background-container-subtle);
    border: 1px dashed var(--kd-color-utility-variant-border);
    height: 140px;
    border-radius: 4px;
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .btn-content {
    width: 160px;
    height: 32px;
    background-color: var(--kd-color-background-button-primary-state-default);
    color: var(--kd-color-text-button-dark-primary);
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
}
`;
  fs.writeFileSync(path.join(componentDir, `${camelCase}.scss`), scssContent);
  console.log(`✓ Created ${camelCase}.scss`);

  // 4. Create component.stories.js
  const storiesContent = `import { html } from 'lit';
import './index';
import { action } from 'storybook/actions';

export default {
  title: '${pascalCase}', // modify as needed to fit into Storybook hierarchy e.g. 'Components/${pascalCase}'
  component: 'kyn-${kebabCase}',
  parameters: {
    design: {
      type: 'figma',
      url: '', // figma reference link
    },
  },
};

const args = {
  unnamed: 'Slot content!', // slot content
  label: 'Label', // string prop
  booleanProp: false, // boolean prop
  arrayProp: [], // an array prop
};

export const Default = {
  args,
  render: (args) => {
    return html\` <kyn-${kebabCase} label=\${args.label} ?booleanProp=\${args.booleanProp}
        .arrayProp=\${args.arrayProp}
        @on-click=\${action('on-click')}>\${args.unnamed}</kyn-${kebabCase}> \`;
  },
};
`;
  fs.writeFileSync(
    path.join(componentDir, `${camelCase}.stories.js`),
    storiesContent
  );
  console.log(`✓ Created ${camelCase}.stories.js`);

  // 5. Update root index.ts to export the new component
  const rootIndexPath = path.join(__dirname, '../src/index.ts');
  const exportStatement = `export { ${pascalCase} } from './components/${folderType}/${camelCase}';\n`;

  try {
    // Read current index.ts content
    const indexContent = fs.readFileSync(rootIndexPath, 'utf-8');

    // Check if export already exists
    if (
      indexContent.includes(`from './components/${folderType}/${camelCase}'`)
    ) {
      console.log(`⚠️  Export already exists in src/index.ts`);
    } else {
      // Append export to file
      fs.appendFileSync(rootIndexPath, exportStatement);
      console.log(`✓ Added export to src/index.ts`);
    }
  } catch (error) {
    console.warn(`⚠️  Could not update src/index.ts: ${error.message}`);
  }

  console.log(`\n✓ Component "${camelCase}" created successfully!`);
  console.log(`📁 Location: src/components/${folderType}/${camelCase}/`);
}

// Start the script
createComponent().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
