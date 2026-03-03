import remarkGfm from 'remark-gfm';
import fs from 'fs';

export default {
  stories:
    process.env.STORY_UI === 'true'
      ? ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)']
      : [
          '../src/components/**/*.mdx',
          '../src/components/**/*.stories.@(js|jsx|ts|tsx)',
          '../src/stories/!(story-ui-panel)/**/*.mdx',
          '../src/stories/!(story-ui-panel)/**/*.stories.@(js|jsx|ts|tsx)',
          '../src/stories/*.mdx',
          '../src/stories/*.stories.@(js|jsx|ts|tsx)',
        ],

  addons: [
    '@storybook/addon-links',
    '@storybook/addon-designs',
    '@storybook/addon-themes',
    {
      name: '@storybook/addon-docs',
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm],
          },
        },
      },
    },
    // {
    //   name: '@storybook/addon-styling-webpack',
    //   options: {
    //     rules: [
    //       {
    //         test: /\.s[ac]ss$/i,
    //         exclude: [/node_modules/],
    //         oneOf: [
    //           {
    //             resourceQuery: /global/,
    //             use: [
    //               'style-loader',
    //               'css-loader',
    //               'resolve-url-loader',
    //               {
    //                 loader: 'sass-loader?sourceMap',
    //                 options: {
    //                   sourceMap: true,
    //                 },
    //               },
    //             ],
    //           },
    //           {
    //             use: [
    //               {
    //                 loader: 'lit-css-loader',
    //                 options: {
    //                   transform: (data, { filePath }) =>
    //                     Sass.renderSync({
    //                       data,
    //                       file: filePath,
    //                     }).css.toString(),
    //                 },
    //               },
    //               'sass-loader',
    //             ],
    //           },
    //         ],
    //       },
    //       {
    //         test: /\.css$/,
    //         use: ['style-loader', 'css-loader'],
    //       },
    //     ],
    //   },
    // },
    // {
    //   name: 'storybook-preset-inline-svg',
    //   options: {
    //     svgInlineLoaderOptions: {
    //       removeSVGTagAttrs: false,
    //     },
    //   },
    // },
    // '@storybook/addon-webpack5-compiler-babel',
    '@storybook/addon-a11y',
    '@storybook/addon-vitest',
  ],

  framework: {
    name: '@storybook/web-components-vite',
    options: {},
  },

  core: {
    disableTelemetry: true,
  },

  staticDirs: ['./static'],

  viteFinal: async (config) => {
    const { mergeConfig } = await import('vite');
    const storyUiPort = process.env.VITE_STORY_UI_PORT || '4001';
    const storyUiEdgeUrl = process.env.VITE_STORY_UI_EDGE_URL || '';
    return mergeConfig(config, {
      plugins: [vitePluginRewriteGeneratedImports(), vitePluginRawSvg()],
      assetsInclude: ['**/*.svg'],
      define: {
        ...(config.define || {}),
        'import.meta.env.VITE_STORY_UI_PORT': JSON.stringify(storyUiPort),
        'import.meta.env.VITE_STORY_UI_EDGE_URL':
          JSON.stringify(storyUiEdgeUrl),
      },
      // Only proxy to Story UI server when STORY_UI=true (set by npm run storybook-with-ui)
      ...(process.env.STORY_UI === 'true'
        ? {
            server: {
              proxy: {
                '/story-ui': {
                  target: `http://localhost:${storyUiPort}`,
                  changeOrigin: true,
                },
                '/mcp': {
                  target: `http://localhost:${storyUiPort}`,
                  changeOrigin: true,
                },
              },
            },
          }
        : {}),
    });
  },

  docs: {},
};

/**
 * Rewrite wrong import paths in AI-generated stories.
 *
 * Story UI's getImportPath() converts class names to kebab-case and appends to
 * config.importPath, producing paths like '../../components/button' instead of
 * '../../components/reusable/button/index'. This plugin fixes those at build time.
 *
 * Also rewrites native <button> elements to <kyn-button>.
 */
function vitePluginRewriteGeneratedImports() {
  // Map of wrong path segments → correct full import paths.
  // Keys: what getImportPath() generates (kebab-case of class name)
  // Values: the correct import path
  const IMPORT_MAP = {
    // AI
    'ai-launch-button': '../../components/ai/aiLaunchButton/index',
    'ai-launch-btn': '../../components/ai/aiLaunchButton/index',
    'sources-feedback': '../../components/ai/sourcesFeedback/index',
    'ai-sources-feedback': '../../components/ai/sourcesFeedback/index',
    // Global
    footer: '../../components/global/footer/index',
    header: '../../components/global/header/index',
    'local-nav': '../../components/global/localNav/index',
    'ui-shell': '../../components/global/uiShell/index',
    'workspace-switcher': '../../components/global/workspaceSwitcher/index',
    // Reusable
    accordion: '../../components/reusable/accordion/index',
    avatar: '../../components/reusable/avatar/index',
    badge: '../../components/reusable/badge/index',
    'block-code-view': '../../components/reusable/blockCodeView/index',
    breadcrumbs: '../../components/reusable/breadcrumbs/index',
    button: '../../components/reusable/button/index',
    'button-group': '../../components/reusable/buttonGroup/index',
    card: '../../components/reusable/card/index',
    checkbox: '../../components/reusable/checkbox/index',
    'color-input': '../../components/reusable/colorInput/index',
    'date-picker': '../../components/reusable/datePicker/index',
    'date-range-picker': '../../components/reusable/daterangepicker/index',
    daterangepicker: '../../components/reusable/daterangepicker/index',
    divider: '../../components/reusable/divider/index',
    dropdown: '../../components/reusable/dropdown/index',
    'error-block': '../../components/reusable/errorBlock/index',
    'file-uploader': '../../components/reusable/fileUploader/index',
    'floating-container': '../../components/reusable/floatingContainer/index',
    'global-filter': '../../components/reusable/globalFilter/index',
    'icon-selector': '../../components/reusable/iconSelector/index',
    'inline-code-view': '../../components/reusable/inlineCodeView/index',
    'inline-confirm': '../../components/reusable/inlineConfirm/index',
    link: '../../components/reusable/link/index',
    loaders: '../../components/reusable/loaders/index',
    loader: '../../components/reusable/loaders/index',
    'meta-data': '../../components/reusable/metaData/index',
    modal: '../../components/reusable/modal/index',
    'multi-input-field': '../../components/reusable/multiInputField/index',
    notification: '../../components/reusable/notification/index',
    'number-input': '../../components/reusable/numberInput/index',
    'overflow-menu': '../../components/reusable/overflowMenu/index',
    'page-title': '../../components/reusable/pagetitle/index',
    pagetitle: '../../components/reusable/pagetitle/index',
    pagination: '../../components/reusable/pagination/index',
    popover: '../../components/reusable/popover/index',
    'progress-bar': '../../components/reusable/progressBar/index',
    'query-builder': '../../components/reusable/queryBuilder/index',
    'radio-button': '../../components/reusable/radioButton/index',
    search: '../../components/reusable/search/index',
    'side-drawer': '../../components/reusable/sideDrawer/index',
    'slider-input': '../../components/reusable/sliderInput/index',
    'split-button': '../../components/reusable/splitButton/index',
    'split-btn': '../../components/reusable/splitButton/index',
    'status-button': '../../components/reusable/statusButton/index',
    'status-btn': '../../components/reusable/statusButton/index',
    stepper: '../../components/reusable/stepper/index',
    table: '../../components/reusable/table/index',
    tabs: '../../components/reusable/tabs/index',
    tag: '../../components/reusable/tag/index',
    'text-area': '../../components/reusable/textArea/index',
    'text-input': '../../components/reusable/textInput/index',
    'time-picker': '../../components/reusable/timepicker/index',
    timepicker: '../../components/reusable/timepicker/index',
    'toggle-button': '../../components/reusable/toggleButton/index',
    tooltip: '../../components/reusable/tooltip/index',
    widget: '../../components/reusable/widget/index',
  };

  return {
    name: 'rewrite-generated-imports',
    enforce: 'pre',
    transform(code, id) {
      if (!id.includes('stories/generated') || !id.endsWith('.stories.ts'))
        return null;
      let out = code;

      // 1. Fix wrong import paths: ../../components/<kebab> → correct path
      out = out.replace(
        /(?:import\s+['"]|from\s+['"])\.\.\/\.\.\/components\/([a-z0-9-]+)(?:\/index)?['"]/g,
        (match, segment) => {
          const correct = IMPORT_MAP[segment];
          if (!correct) return match; // unknown segment, leave as-is
          const quote = match.includes("'") ? "'" : '"';
          const prefix = match.startsWith('from') ? 'from ' : 'import ';
          return `${prefix}${quote}${correct}${quote}`;
        }
      );

      // 2. Rewrite native <button> to <kyn-button>
      const hadButton = /<button[\s>]/.test(out);
      if (hadButton) {
        out = out.replace(
          /<button\s+variant=["'](\w+)["']\s*>/g,
          (_, v) => `<kyn-button kind="${v}">`
        );
        out = out.replace(/<button\s+([^>]*)>/g, (_, attrs) => {
          const m = attrs.match(/variant=["'](\w+)["']/);
          return `<kyn-button kind="${m ? m[1] : 'primary'}">`;
        });
        out = out.replace(/<button>/g, '<kyn-button kind="primary">');
        out = out.replace(/<\/button>/g, '</kyn-button>');
        // Ensure button import exists
        if (
          out.includes('kyn-button') &&
          !out.includes('components/reusable/button')
        ) {
          const firstImport = out.indexOf('import ');
          const insertAt =
            firstImport !== -1 ? out.indexOf('\n', firstImport) + 1 : 0;
          out =
            out.slice(0, insertAt) +
            "import '../../components/reusable/button/index';\n" +
            out.slice(insertAt);
        }
      }

      return out === code ? null : { code: out, map: null };
    },
  };
}

// load raw SVGs without requiring the ?raw suffix on imports
function vitePluginRawSvg() {
  return {
    name: 'vite-plugin-raw-svg',
    enforce: 'pre', // to override `vite:asset`'s behavior
    async load(id) {
      if (id.includes('.svg') && !id.includes('.svg.js')) {
        const svg = await fs.promises.readFile(id, 'utf8');
        // Escape backticks and backslashes for template literal
        const safe = svg.replace(/\\/g, '\\\\').replace(/`/g, '\\`');
        return {
          code: `export default \`${safe}\`;`,
          map: null,
        };
      }
    },
  };
}
