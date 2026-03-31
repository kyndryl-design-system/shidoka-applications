import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';

const dirname =
  typeof __dirname !== 'undefined'
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

const supportedBrowsers = ['chromium', 'firefox', 'webkit'] as const;
type SupportedBrowser = (typeof supportedBrowsers)[number];

const requestedBrowser = process.env.VITEST_BROWSER as
  | SupportedBrowser
  | undefined;
const storybookBrowsers = requestedBrowser
  ? [{ browser: requestedBrowser }]
  : supportedBrowsers.map((browser) => ({ browser }));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  test: {
    projects: [
      // Unit tests for utilities and helpers
      {
        extends: true,
        test: {
          name: 'unit',
          include: ['src/**/*.test.ts'],
          environment: 'node',
        },
      },
      // Storybook interaction tests
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({ configDir: path.join(dirname, '.storybook') }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: 'playwright',
            instances: storybookBrowsers,
          },
          setupFiles: ['.storybook/vitest.setup.ts'],
        },
      },
    ],
  },

  optimizeDeps: {
    include: ['flatpickr'],
  },

  server: {
    fs: {
      allow: ['..'],
    },
  },
});
