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
      '\n📁 Enter folder type (ai, global, reusable): '
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

    // Ask if this is a subcomponent
    let isSubcomponent = await askQuestion(
      rl,
      '\n🔗 Is this a subcomponent? (yes/no): '
    );
    isSubcomponent = isSubcomponent.toLowerCase().trim();

    let parentComponent = '';
    if (isSubcomponent === 'yes' || isSubcomponent === 'y') {
      parentComponent = await askQuestion(
        rl,
        '👥 Enter parent component name (e.g., header for headerLink): '
      );

      if (!parentComponent) {
        console.error(
          '❌ Error: Parent component name is required for subcomponents!'
        );
        rl.close();
        process.exit(1);
      }

      parentComponent = parentComponent.toLowerCase().trim();
      console.log(`\n 👥  Parent component: ${parentComponent}`);
    }

    rl.close();

    await generateComponent(componentName, folderType, parentComponent);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

async function generateComponent(
  componentName,
  folderType,
  parentComponent = ''
) {
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

  // Determine the component directory
  let componentDir;
  if (parentComponent) {
    // Subcomponent: create inside parent component folder
    componentDir = path.join(
      __dirname,
      `../src/components/${folderType}/${parentComponent}`
    );

    // Check if parent component exists
    if (!fs.existsSync(componentDir)) {
      console.error(
        `❌ Error: Parent component folder "${parentComponent}" does not exist!`
      );
      process.exit(1);
    }
  } else {
    // Main component
    componentDir = path.join(
      __dirname,
      `../src/components/${folderType}`,
      camelCase
    );

    // Check if directory already exists
    if (fs.existsSync(componentDir)) {
      console.error(`❌ Error: Directory ${camelCase} already exists!`);
      process.exit(1);
    }

    // Create directory
    fs.mkdirSync(componentDir, { recursive: true });
    console.log(`✅ Created folder: src/components/${folderType}/${camelCase}`);
  }

  console.log(`\n📍 Component path: ${componentDir}`);
  console.log(` 📁  Folder Type: ${folderType}`);
  console.log(` 🏷️  Component Name: ${camelCase}`);
  if (parentComponent) {
    console.log(` 👥  Parent Component: ${parentComponent}`);
  }

  // 1. Create/Update index.ts
  const indexContent = `export { ${pascalCase} } from './${camelCase}';
`;

  if (parentComponent) {
    // For subcomponents, append to existing parent's index.ts
    const parentIndexPath = path.join(componentDir, 'index.ts');

    try {
      // Read current parent index.ts content
      const existingContent = fs.readFileSync(parentIndexPath, 'utf-8');

      // Check if export already exists
      if (existingContent.includes(`from './${camelCase}'`)) {
        console.log(`⚠️  Export already exists in parent index.ts`);
      } else {
        // Append new export to file
        fs.appendFileSync(parentIndexPath, indexContent);
        console.log(`✅ Added export to parent index.ts`);
      }
    } catch (error) {
      console.warn(`⚠️  Could not update parent index.ts: ${error.message}`);
    }
  } else {
    // For main components, create new index.ts
    fs.writeFileSync(path.join(componentDir, 'index.ts'), indexContent);
    console.log(`✅ Created index.ts`);
  }

  // 2. Create component.ts
  const componentContent = `import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property,state, query } from 'lit/decorators.js';

import styles from './${camelCase}.scss?inline';

/**
 * ${componentName} web component description.${
    parentComponent ? ' (Subcomponent of ' + parentComponent + ')' : ''
  }
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
  console.log(`✅ Created ${camelCase}.ts`);

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
  console.log(`✅ Created ${camelCase}.scss`);

  // 4. Create component.stories.js (only for main components, not subcomponents)
  if (!parentComponent) {
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
    console.log(`✅ Created ${camelCase}.stories.js`);
  } else {
    // For subcomponents, update parent's stories.js to add to subcomponents object
    const parentDirPath = path.join(
      __dirname,
      `../src/components/${folderType}/${parentComponent}`
    );

    // Try to find the stories file with different naming patterns
    let storiesPath = null;
    const possibleNames = [
      `${parentComponent}.stories.js`,
      `${parentComponent.charAt(0).toUpperCase()}${parentComponent.slice(
        1
      )}.stories.js`,
    ];

    // Also check for camelCase versions with prefixes (e.g., aiSourcesFeedback.stories.js)
    if (!storiesPath) {
      try {
        const files = fs.readdirSync(parentDirPath);
        const storiesFile = files.find((f) => f.endsWith('.stories.js'));
        if (storiesFile) {
          storiesPath = path.join(parentDirPath, storiesFile);
        }
      } catch (error) {
        // Directory might not exist or be readable
      }
    }

    // Fallback to checking specific paths
    if (!storiesPath) {
      for (const name of possibleNames) {
        const testPath = path.join(parentDirPath, name);
        if (fs.existsSync(testPath)) {
          storiesPath = testPath;
          break;
        }
      }
    }

    if (storiesPath && fs.existsSync(storiesPath)) {
      try {
        let storiesContent = fs.readFileSync(storiesPath, 'utf-8');

        // Check if subcomponent already exists in subcomponents object
        const subcomponentEntry = `'kyn-${kebabCase}': 'kyn-${kebabCase}',`;
        if (storiesContent.includes(`'kyn-${kebabCase}'`)) {
          console.log(`⚠️  Subcomponent already exists in parent stories.js`);
        } else {
          // Find the subcomponents object and add the new entry
          const subcomponentsPattern = /subcomponents:\s*\{([^}]*)\}/s;
          const match = storiesContent.match(subcomponentsPattern);

          if (match) {
            const subcomponentsContent = match[1];
            const updatedSubcomponents =
              subcomponentsContent.trimEnd() + `\n    ${subcomponentEntry}`;
            const updatedContent = storiesContent.replace(
              subcomponentsPattern,
              `subcomponents: {${updatedSubcomponents}\n  }`
            );

            fs.writeFileSync(storiesPath, updatedContent);
            console.log(`✅ Added subcomponent to parent stories.js`);
          } else {
            // subcomponents object doesn't exist, create it
            // Find the export default object and add subcomponents after component property
            const exportDefaultPattern =
              /(export\s+default\s*\{[^}]*component:\s*['"][^'"]+['"],?)([^}]*\})/s;
            const defaultMatch = storiesContent.match(exportDefaultPattern);

            if (defaultMatch) {
              const subcomponentsObj = `\n  subcomponents: {\n    ${subcomponentEntry}\n  },`;
              const updatedContent = storiesContent.replace(
                exportDefaultPattern,
                `$1${subcomponentsObj}$2`
              );

              fs.writeFileSync(storiesPath, updatedContent);
              console.log(
                `✅ Created subcomponents object and added subcomponent to parent stories.js`
              );
            } else {
              console.warn(
                `⚠️  Could not find export default in parent stories.js`
              );
            }
          }
        }
      } catch (error) {
        console.warn(
          `⚠️  Could not update parent stories.js: ${error.message}`
        );
      }
    } else {
      console.warn(
        `⚠️  Parent component stories file not found at ${storiesPath}`
      );
    }
  }

  // 5. Update root index.ts to export the new component
  const rootIndexPath = path.join(__dirname, '../src/index.ts');

  try {
    if (parentComponent) {
      // For subcomponents, update existing export from parent component

      let indexContent = fs.readFileSync(rootIndexPath, 'utf-8');

      // Check if parent export path exists - search case-insensitively for the path
      let foundExportPath = null;
      const pathSearchRegex = new RegExp(
        `from\\s*['"](\\./components/${folderType}\\/[^'"]+)['"](;?)`,
        'gi'
      );
      let pathMatch;
      while ((pathMatch = pathSearchRegex.exec(indexContent)) !== null) {
        // Check if this is the parent component path (case-insensitive comparison)
        if (
          pathMatch[1].toLowerCase().includes(parentComponent.toLowerCase())
        ) {
          foundExportPath = pathMatch[1];
          break;
        }
      }

      if (!foundExportPath) {
        console.warn(
          `⚠️  Could not find parent export in src/index.ts for path containing: ${parentComponent}`
        );
        console.warn(
          `   This might happen if the parent component was just created.`
        );
        console.warn(`   Attempting to create parent export...`);

        // Try to create the parent export if it doesn't exist
        const parentPascalCase =
          parentComponent.charAt(0).toUpperCase() + parentComponent.slice(1);
        const parentExportPath = `./components/${folderType}/${parentComponent}`;
        const parentExportStatement = `export { ${parentPascalCase} } from '${parentExportPath}';\n`;

        // Double-check that it doesn't already exist before appending
        // Re-read the file to ensure we have the latest content
        let latestContent = fs.readFileSync(rootIndexPath, 'utf-8');
        if (
          !latestContent.includes(`from '${parentExportPath}'`) &&
          !latestContent.includes(`from "${parentExportPath}"`)
        ) {
          fs.appendFileSync(rootIndexPath, parentExportStatement);
          console.log(`✅ Created parent export in src/index.ts`);

          // Re-read the updated content for further processing
          indexContent = fs.readFileSync(rootIndexPath, 'utf-8');
          foundExportPath = parentExportPath;
        } else {
          console.log(`ℹ️  Parent export already exists, using it...`);
          // Update indexContent with the latest file content
          indexContent = latestContent;
        }
      } else {
        console.log(`📍 Found parent export with path: ${foundExportPath}`);
      }

      // Now try to match and update with the found path
      if (foundExportPath) {
        const escapedPath = foundExportPath.replace(/\//g, '\\/');
        const exportRegex = new RegExp(
          `export\\s*\\{\\s*([^}]+?)\\s*\\}\\s*from\\s*['"](${escapedPath})['"](;?)`,
          's'
        );

        console.log(
          `📍 Looking for parent export with path: ${foundExportPath}`
        );

        const match = indexContent.match(exportRegex);
        if (match) {
          const existingExports = match[1];

          // Check if subcomponent already exists
          if (existingExports.includes(pascalCase)) {
            console.log(`⚠️  Subcomponent already exists in parent export`);
          } else {
            // Add subcomponent to existing export
            const trimmedExports = existingExports.trim();

            // Check if this is a single-line or multi-line export
            const isSingleLine = !trimmedExports.includes('\n');

            let newExport;
            if (isSingleLine) {
              // Convert single-line to multi-line format
              newExport = `\n  ${trimmedExports},\n  ${pascalCase}\n`;
            } else {
              // Already multi-line, just append
              const hasTrailingComma = trimmedExports.endsWith(',');
              newExport = hasTrailingComma
                ? `${trimmedExports}\n  ${pascalCase}`
                : `${trimmedExports},\n  ${pascalCase}`;
            }

            // Replace the export statement
            const updatedContent = indexContent.replace(
              exportRegex,
              `export {${newExport}} from '${foundExportPath}';`
            );

            fs.writeFileSync(rootIndexPath, updatedContent);
            console.log(
              `✅ Added subcomponent to parent export in src/index.ts`
            );
          }
        } else {
          console.warn(
            `⚠️  Could not match parent export with regex for path: ${foundExportPath}`
          );
          console.warn(
            `   Please check the export format in src/index.ts manually.`
          );
        }
      }
    } else {
      // For main components, add new export statement
      let indexContent = fs.readFileSync(rootIndexPath, 'utf-8');
      const exportPath = `./components/${folderType}/${camelCase}`;
      const exportStatement = `export { ${pascalCase} } from '${exportPath}';\n`;

      // Check if export already exists
      if (indexContent.includes(`from '${exportPath}'`)) {
        console.log(`⚠️  Export already exists in src/index.ts`);
      } else {
        // Append export to file
        fs.appendFileSync(rootIndexPath, exportStatement);
        console.log(`✅ Added export to src/index.ts`);
      }
    }
  } catch (error) {
    console.warn(`⚠️  Could not update src/index.ts: ${error.message}`);
  }

  if (parentComponent) {
    console.log(`ℹ️  Subcomponent added to parent component's stories.js`);
  }

  if (parentComponent) {
    console.log(`\n✅ Subcomponent "${camelCase}" created successfully!`);
    console.log(
      `📁 Location: src/components/${folderType}/${parentComponent}/${camelCase}/`
    );
  } else {
    console.log(`\n✅ Component "${camelCase}" created successfully!`);
    console.log(`📁 Location: src/components/${folderType}/${camelCase}/`);
  }
}

// Start the script
createComponent().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
