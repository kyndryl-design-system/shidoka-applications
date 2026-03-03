/**
 * Story UI – Shidoka Applications (Web Components + Lit)
 * https://github.com/southleft/story-ui
 *
 * All component data is driven from custom-elements.json (CEM).
 * Run `npm run generate-component-registry` to rebuild the registry.
 */
export default {
  componentFramework: 'web-components',
  storybookFramework: '@storybook/web-components-vite',

  componentsPath: './src/components',
  generatedStoriesPath: './src/stories/generated',
  // importPath + importStyle: 'individual' causes getImportPath() to generate wrong
  // kebab-case paths (e.g. ../../components/button instead of ../../components/reusable/button/index).
  // The Vite plugin vitePluginRewriteGeneratedImports in .storybook/main.js fixes these at build time.
  importPath: '../../components',
  importStyle: 'individual',

  // Auto-generated from custom-elements.json — run: npm run generate-component-registry
  // Every component in the design system, grouped by import path.
  importExamples: [
    "import { html } from 'lit';",
    "import '../../components/ai/aiLaunchButton/index'; // kyn-ai-launch-btn",
    "import '../../components/ai/sourcesFeedback/index'; // kyn-ai-sources-feedback",
    "import '../../components/global/footer/index'; // kyn-footer",
    "import '../../components/global/header/index'; // kyn-header, kyn-header-categories, kyn-header-category, kyn-header-divider, kyn-header-flyout, kyn-header-flyouts, kyn-header-link, kyn-header-nav, kyn-header-notification-panel, kyn-header-panel-link, kyn-header-user-profile",
    "import '../../components/global/localNav/index'; // kyn-local-nav, kyn-local-nav-divider, kyn-local-nav-link",
    "import '../../components/global/uiShell/index'; // kyn-ui-shell",
    "import '../../components/global/workspaceSwitcher/index'; // kyn-workspace-switcher, kyn-workspace-switcher-menu-item",
    "import '../../components/reusable/accordion/index'; // kyn-accordion, kyn-accordion-item",
    "import '../../components/reusable/avatar/index'; // kyn-avatar",
    "import '../../components/reusable/badge/index'; // kyn-badge",
    "import '../../components/reusable/blockCodeView/index'; // kyn-block-code-view",
    "import '../../components/reusable/breadcrumbs/index'; // kyn-breadcrumbs",
    "import '../../components/reusable/button/index'; // kyn-button",
    "import '../../components/reusable/buttonGroup/index'; // kyn-button-group",
    "import '../../components/reusable/card/index'; // kyn-card, kyn-info-card-skeleton, kyn-vital-card-skeleton",
    "import '../../components/reusable/checkbox/index'; // kyn-checkbox, kyn-checkbox-group, kyn-checkbox-subgroup",
    "import '../../components/reusable/colorInput/index'; // kyn-color-input",
    "import '../../components/reusable/datePicker/index'; // kyn-date-picker",
    "import '../../components/reusable/daterangepicker/index'; // kyn-date-range-picker",
    "import '../../components/reusable/divider/index'; // kyn-divider",
    "import '../../components/reusable/dropdown/index'; // kyn-dropdown, kyn-dropdown-category, kyn-dropdown-option, kyn-enhanced-dropdown-option",
    "import '../../components/reusable/errorBlock/index'; // kyn-error-block",
    "import '../../components/reusable/fileUploader/index'; // kyn-file-uploader, kyn-file-uploader-list-container",
    "import '../../components/reusable/floatingContainer/index'; // kyn-button-float-container",
    "import '../../components/reusable/globalFilter/index'; // kyn-global-filter",
    "import '../../components/reusable/iconSelector/index'; // kyn-icon-selector, kyn-icon-selector-group",
    "import '../../components/reusable/inlineCodeView/index'; // kyn-inline-code-view",
    "import '../../components/reusable/inlineConfirm/index'; // kyn-inline-confirm",
    "import '../../components/reusable/link/index'; // kyn-link",
    "import '../../components/reusable/loaders/index'; // kyn-ai-loader, kyn-loader-inline, kyn-loader, kyn-skeleton, kyn-spinner",
    "import '../../components/reusable/metaData/index'; // kyn-meta-data",
    "import '../../components/reusable/modal/index'; // kyn-modal",
    "import '../../components/reusable/multiInputField/index'; // kyn-multi-input-field",
    "import '../../components/reusable/notification/index'; // kyn-notification, kyn-notification-container",
    "import '../../components/reusable/numberInput/index'; // kyn-number-input",
    "import '../../components/reusable/overflowMenu/index'; // kyn-overflow-menu, kyn-overflow-menu-item",
    "import '../../components/reusable/pagetitle/index'; // kyn-page-title",
    "import '../../components/reusable/pagination/index'; // kyn-pagination, kyn-pagination-items-range, kyn-pagination-navigation-buttons, kyn-pagination-page-size-dropdown, kyn-pagination-skeleton",
    "import '../../components/reusable/popover/index'; // kyn-popover",
    "import '../../components/reusable/progressBar/index'; // kyn-progress-bar",
    "import '../../components/reusable/queryBuilder/index'; // kyn-query-builder, kyn-qb-group, kyn-qb-rule",
    "import '../../components/reusable/radioButton/index'; // kyn-radio-button, kyn-radio-button-group",
    "import '../../components/reusable/search/index'; // kyn-search",
    "import '../../components/reusable/sideDrawer/index'; // kyn-side-drawer",
    "import '../../components/reusable/sliderInput/index'; // kyn-slider-input",
    "import '../../components/reusable/splitButton/index'; // kyn-split-btn, kyn-splitbutton-option",
    "import '../../components/reusable/statusButton/index'; // kyn-status-btn",
    "import '../../components/reusable/stepper/index'; // kyn-stepper, kyn-stepper-item, kyn-stepper-item-child",
    "import '../../components/reusable/table/index'; // kyn-table, kyn-table-container, kyn-table-toolbar, kyn-table-footer, kyn-table-legend, kyn-table-legend-item, kyn-table-skeleton, kyn-thead, kyn-tbody, kyn-tfoot, kyn-header-tr, kyn-tr, kyn-expanded-tr, kyn-th, kyn-th-group, kyn-td",
    "import '../../components/reusable/tabs/index'; // kyn-tabs, kyn-tab, kyn-tab-panel",
    "import '../../components/reusable/tag/index'; // kyn-tag, kyn-tag-group, kyn-tag-skeleton",
    "import '../../components/reusable/textArea/index'; // kyn-text-area",
    "import '../../components/reusable/textInput/index'; // kyn-text-input",
    "import '../../components/reusable/timepicker/index'; // kyn-time-picker",
    "import '../../components/reusable/toggleButton/index'; // kyn-toggle-button",
    "import '../../components/reusable/tooltip/index'; // kyn-tooltip",
    "import '../../components/reusable/widget/index'; // kyn-widget, kyn-widget-drag-handle, kyn-widget-gridstack",
  ],

  componentPrefix: 'kyn-',
  storyPrefix: 'Generated/',
  defaultAuthor: 'Story UI AI',
  llmProvider: 'openai',

  // Custom system prompt — overrides Story UI's default which confuses small models.
  systemPrompt: `You generate Storybook stories for the Shidoka Web Components library using Lit.

RULES:
1. ONLY use kyn-* tags. NEVER use <my-button>, <button>, <input>, <select>, <table>, <thead>, <tbody>, <tr>, <th>, <td>, or any invented tag.
2. The ONLY lit import is: import { html } from 'lit';
3. Copy import paths EXACTLY from the reference below. NEVER guess or convert to kebab-case.
4. NEVER import from 'your-library', 'my-library', or 'lit/button'.
5. Title prefix: use 'Generated/Pages/...' for full page layouts, 'Generated/Components/...' for single components.
6. For tables, use kyn-table elements: kyn-thead > kyn-header-tr > kyn-th, kyn-tbody > kyn-tr > kyn-td.
7. Side drawer needs the open attribute to be visible. Place as sibling of <main>.
8. If the user provides JSON data, use .map() to render rows dynamically.

IMPORTS — copy exactly, do not modify paths:
- import '../../components/reusable/button/index';        // kyn-button (kind: primary|secondary|tertiary|ghost)
- import '../../components/reusable/card/index';           // kyn-card
- import '../../components/reusable/table/index';          // kyn-table-container, kyn-table, kyn-thead, kyn-header-tr, kyn-th, kyn-tbody, kyn-tr, kyn-td
- import '../../components/reusable/modal/index';          // kyn-modal
- import '../../components/reusable/textInput/index';      // kyn-text-input
- import '../../components/reusable/dropdown/index';       // kyn-dropdown, kyn-dropdown-option
- import '../../components/reusable/checkbox/index';       // kyn-checkbox
- import '../../components/reusable/tabs/index';           // kyn-tabs, kyn-tab, kyn-tab-panel
- import '../../components/reusable/accordion/index';      // kyn-accordion, kyn-accordion-item
- import '../../components/reusable/sideDrawer/index';     // kyn-side-drawer (needs open attr)
- import '../../components/reusable/tag/index';            // kyn-tag
- import '../../components/reusable/notification/index';   // kyn-notification
- import '../../components/reusable/badge/index';          // kyn-badge
- import '../../components/reusable/link/index';           // kyn-link
- import '../../components/reusable/tooltip/index';        // kyn-tooltip
- import '../../components/reusable/breadcrumbs/index';    // kyn-breadcrumbs
- import '../../components/reusable/pagetitle/index';      // kyn-page-title
- import '../../components/reusable/progressBar/index';    // kyn-progress-bar
- import '../../components/global/uiShell/index';          // kyn-ui-shell
- import '../../components/global/header/index';           // kyn-header
- import '../../components/global/footer/index';           // kyn-footer
- import '../../components/global/localNav/index';         // kyn-local-nav

For layout, use plain HTML: div, main, section, span, p, h1-h6, ul, li, a.

EXAMPLE — 3-row data table story (copy this pattern for table requests, add more kyn-tr rows as needed):
\`\`\`
import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';
import '../../components/reusable/table/index';

const meta: Meta = { title: 'Generated/Components/Data Table' };
export default meta;
type Story = StoryObj;
export const Default: Story = {
  render: () => html\\\`
    <kyn-table-container>
      <kyn-table>
        <kyn-thead><kyn-header-tr><kyn-th>Name</kyn-th><kyn-th>Role</kyn-th><kyn-th>Status</kyn-th></kyn-header-tr></kyn-thead>
        <kyn-tbody>
          <kyn-tr><kyn-td>Alice</kyn-td><kyn-td>Engineer</kyn-td><kyn-td>Active</kyn-td></kyn-tr>
          <kyn-tr><kyn-td>Bob</kyn-td><kyn-td>Designer</kyn-td><kyn-td>Active</kyn-td></kyn-tr>
          <kyn-tr><kyn-td>Carol</kyn-td><kyn-td>PM</kyn-td><kyn-td>Away</kyn-td></kyn-tr>
        </kyn-tbody>
      </kyn-table>
    </kyn-table-container>
  \\\`
};
\`\`\``,

  layoutRules: {
    multiColumnWrapper: 'div',
    columnComponent: 'div',
    containerComponent: 'div',
    mainContentPadding: 'var(--kd-page-gutter, 1rem)',
    tableWrapperExample:
      '<div style="overflow: auto; max-height: 360px; border: 1px solid var(--kd-color-border, #e0e0e0); border-radius: 4px;">\n  <kyn-table>...</kyn-table>\n</div>',
    fullPageShellOrder:
      'kyn-header, (optional kyn-local-nav), main, kyn-footer',
    layoutExamples: {
      twoColumn:
        "<div style='display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;'>\n  <div>Column 1</div>\n  <div>Column 2</div>\n</div>",
    },
    prohibitedElements: [
      'my-button',
      'my-card',
      'my-table',
      'my-ui-shell',
      'my-side-drawer',
      'my-modal',
      'my-input',
      'my-text',
      'my-header',
      'my-footer',
      'my-nav',
      'lit-button',
      'lit-table',
      'lit-card',
      'lit-shell',
      'app-shell',
      'data-table',
      'sidedrawer',
      'nav-bar',
    ],
  },
};
