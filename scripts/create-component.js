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
import { customElement, property } from 'lit/decorators.js';

import styles from './${camelCase}.scss?inline';

/**
 * \`kyn-${kebabCase}\` Web Component.
 * ${componentName} component description.
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

  override render() {
    return html\`<div class="container">\${this.label}</div>\`;
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
  const scssContent = `.container {
  display: flex;
  flex-direction: column;
}
`;
  fs.writeFileSync(path.join(componentDir, `${camelCase}.scss`), scssContent);
  console.log(`✓ Created ${camelCase}.scss`);

  // 4. Create component.stories.js
  const storiesContent = `import { html } from 'lit';
import './index';

export default {
  title: '${pascalCase}',
  component: 'kyn-${kebabCase}',
  argTypes: {
    label: { control: 'text' },
  },
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
};

const args = {
  label: '${componentName}',
};

export const Default = {
  args,
  render: (args) => {
    return html\` <kyn-${kebabCase} label=\${args.label}></kyn-${kebabCase}> \`;
  },
};
`;
  fs.writeFileSync(
    path.join(componentDir, `${camelCase}.stories.js`),
    storiesContent
  );
  console.log(`✓ Created ${camelCase}.stories.js`);

  console.log(`\n✓ Component "${camelCase}" created successfully!`);
  console.log(`📁 Location: src/components/${folderType}/${camelCase}/`);
}

// Start the script
createComponent().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
