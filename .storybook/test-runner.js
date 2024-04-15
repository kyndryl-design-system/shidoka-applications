const { injectAxe, checkA11y, configureAxe } = require('axe-playwright');
const { getStoryContext } = require('@storybook/test-runner');

/*
 * See https://storybook.js.org/docs/writing-tests/test-runner#test-hook-api
 * to learn more about the test-runner hooks API.
 */
module.exports = {
  async preVisit(page, context) {
    await injectAxe(page);
  },
  async postVisit(page, context) {
    const storyContext = await getStoryContext(page, context);

    // run accessibility tests if not disabled
    if (!storyContext.parameters?.a11y?.disable) {
      const Options = {
        detailedReport: true,
        detailedReportOptions: {
          html: true,
        },
      };

      // get custom rules, convert from array to object structure, inject to options
      const Rules = storyContext.parameters?.a11y?.config?.rules;
      if (Rules) {
        // const RulesObj = {};
        // Rules.forEach((rule) => {
        //   RulesObj[rule.id] = { enabled: rule.enabled };
        // });

        // Options.axeOptions = {
        //   rules: RulesObj,
        // };

        await configureAxe(page, {
          rules: Rules,
        });
      }

      await checkA11y(page, '#storybook-root', Options);
    }

    // // run snapshot tests
    // // get story HTML
    // let html = await page.evaluate(
    //   "document.querySelector('#root-inner').innerHTML"
    // );

    // // filter out stories that don't use components
    // // if (context.title.toLowerCase().includes('components/')) {
    // // const outerHtml = await page.evaluate(
    // //   "Array.prototype.slice.call(document.querySelectorAll('*')).find((el) => el.tagName.startsWith('KD-')).outerHTML"
    // // );
    // // const shadowRootHtml = await page.evaluate(
    // //   "Array.prototype.slice.call(document.querySelectorAll('*')).find((el) => el.tagName.startsWith('KD-')).shadowRoot.innerHTML"
    // // );
    // // console.log(shadowRootHtml);

    // // get HTML from every element with a shadow root
    // html += await page.evaluate(`
    //   let html = '';
    //   Array.prototype.slice.call(document.querySelectorAll('*'))
    //     .filter((el) => el.shadowRoot)
    //     .forEach((el) => html += el.shadowRoot.innerHTML);
    //   html;
    // `);
    // // }

    // expect(html).toMatchSnapshot();
  },
};
