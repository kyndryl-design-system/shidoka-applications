const { injectAxe, checkA11y, configureAxe } = require('axe-playwright');
const { getStoryContext } = require('@storybook/test-runner');

/*
 * See https://storybook.js.org/docs/writing-tests/test-runner#test-hook-api
 * to learn more about the test-runner hooks API.
 */
module.exports = {
  async preVisit(page) {
    await injectAxe(page);
    await page.evaluate(() => {
      window.__axeRunning = false;
    });
  },

  async postVisit(page, context) {
    const storyContext = await getStoryContext(page, context);

    // run accessibility tests if not disabled
    if (!storyContext.parameters?.a11y?.disable) {
      if (await page.evaluate(() => window.__axeRunning)) {
        console.warn('Skipping... Axe is already running');
        return;
      }

      await page.evaluate(() => {
        window.__axeRunning = true;
      });

      const Options = {
        detailedReport: true,
        detailedReportOptions: {
          html: true,
        },
      };

      // get custom rules, convert from array to object structure, inject to options
      const Rules = storyContext.parameters?.a11y?.config?.rules;
      if (Rules) {
        await configureAxe(page, {
          rules: Rules,
        });
      }

      await checkA11y(page, '#storybook-root', Options);

      await page.evaluate(() => {
        window.__axeRunning = false;
      });
    }
  },
};
