import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { html } from 'lit';
import { useArgs } from 'storybook/preview-api';

import './';
import '../../reusable/button';
import '../../reusable/tabs';
import '../../reusable/search';

import megaNavConfig from './sampleMegaNavCategories.json';
import circleIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/circle-stroke.svg';

// icons for FullImplementation story
import starFilledIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/recommend-filled.svg';
import starOutlineIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/recommend.svg';
import historyIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/history.svg';
import catalogIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/catalog-management.svg';
import consoleIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/console.svg';
import servicesIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/services.svg';
import adminIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/user-settings.svg';
import launchIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/launch.svg';

import './Docs.mdx';

const args = {
  rootUrl: '/',
  appTitle: 'Application',
};

export default {
  title: 'Global Components/Header/Categorical Nav',
  component: 'kyn-header',
  subcomponents: {
    'kyn-header-nav': 'kyn-header-nav',
    'kyn-header-link': 'kyn-header-link',
    'kyn-header-category': 'kyn-header-category',
    'kyn-header-categories': 'kyn-header-categories',
  },
  tags: ['!autodocs'],
  args,
};

// -----------------------------------------------------------------------------
// Fully manual HTML variant (no JSON) - slot driven
// -----------------------------------------------------------------------------

export const WithCategorizedNavManualHtml = {
  args: {
    ...args,
    activeMegaTabId: 'tab1',
  },
  render: (renderArgs) => {
    const [, updateArgs] = useArgs();

    return html`
      <kyn-header rootUrl=${renderArgs.rootUrl} appTitle=${renderArgs.appTitle}>
        <kyn-header-nav>
          <kyn-header-link href="javascript:void(0)">
            <span>${unsafeSVG(circleIcon)}</span>
            Application

            <kyn-tabs tabSize="lg" slot="links">
              <kyn-tab
                slot="tabs"
                id="tab1"
                ?selected=${renderArgs.activeMegaTabId === 'tab1'}
                @click=${() => updateArgs({ activeMegaTabId: 'tab1' })}
              >
                Tab 1
              </kyn-tab>

              <kyn-tab
                slot="tabs"
                id="tab2"
                ?selected=${renderArgs.activeMegaTabId === 'tab2'}
                @click=${() => updateArgs({ activeMegaTabId: 'tab2' })}
              >
                Tab 2
              </kyn-tab>

              <kyn-tab-panel
                tabId="tab1"
                noPadding
                ?visible=${renderArgs.activeMegaTabId === 'tab1'}
              >
                <kyn-search
                  label="Filter items... (Application controlled)"
                  style="display: block; margin-bottom: 16px;"
                ></kyn-search>

                <kyn-header-categories>
                  <!-- CATEGORY 1 -->
                  <kyn-header-category heading="Category 1">
                    <span slot="icon">${unsafeSVG(circleIcon)}</span>
                    <kyn-header-link href="#">Sub Link 1</kyn-header-link>
                    <kyn-header-link href="#">Sub Link 2</kyn-header-link>
                    <kyn-header-link href="#">Sub Link 3</kyn-header-link>
                    <kyn-header-link href="#">Sub Link 4</kyn-header-link>
                    <kyn-header-link href="#">Sub Link 5</kyn-header-link>
                    <kyn-header-link href="#">Sub Link 6</kyn-header-link>
                    <kyn-header-link href="#">Sub Link 7</kyn-header-link>
                    <kyn-header-link href="#">Sub Link 8</kyn-header-link>
                    <kyn-header-link href="#">Sub Link 9</kyn-header-link>
                    <kyn-header-link href="#">Sub Link 10</kyn-header-link>
                    <kyn-header-link href="#">Sub Link 11</kyn-header-link>
                    <kyn-header-link href="#">Sub Link 12</kyn-header-link>
                  </kyn-header-category>

                  <!-- CATEGORY 2 -->
                  <kyn-header-category heading="Category 2">
                    <span slot="icon">${unsafeSVG(circleIcon)}</span>
                    <kyn-header-link href="#">Sub Link 1</kyn-header-link>
                  </kyn-header-category>

                  <!-- CATEGORY 3 -->
                  <kyn-header-category heading="Category 3">
                    <span slot="icon">${unsafeSVG(circleIcon)}</span>
                    <kyn-header-link href="#">Sub Link 1</kyn-header-link>
                    <kyn-header-link href="#">Sub Link 2</kyn-header-link>
                  </kyn-header-category>

                  <!-- CATEGORY 4 -->
                  <kyn-header-category heading="Category 4">
                    <span slot="icon">${unsafeSVG(circleIcon)}</span>
                    <kyn-header-link href="#">Sub Link 1</kyn-header-link>
                    <kyn-header-link href="#">Sub Link 2</kyn-header-link>
                    <kyn-header-link href="#">Sub Link 3</kyn-header-link>
                  </kyn-header-category>

                  <!-- CATEGORY 5 -->
                  <kyn-header-category heading="Category 5">
                    <span slot="icon">${unsafeSVG(circleIcon)}</span>
                    <kyn-header-link href="#">Sub Link 1</kyn-header-link>
                    <kyn-header-link href="#">Sub Link 2</kyn-header-link>
                    <kyn-header-link href="#">Sub Link 3</kyn-header-link>
                    <kyn-header-link href="#">Sub Link 4</kyn-header-link>
                  </kyn-header-category>

                  <!-- CATEGORY 6 -->
                  <kyn-header-category heading="Category 6">
                    <span slot="icon">${unsafeSVG(circleIcon)}</span>
                    <kyn-header-link href="#">Sub Link 1</kyn-header-link>
                  </kyn-header-category>

                  <!-- CATEGORY 7 -->
                  <kyn-header-category heading="Category 7">
                    <span slot="icon">${unsafeSVG(circleIcon)}</span>
                    ${Array.from({ length: 13 }).map(
                      (_, idx) => html`
                        <kyn-header-link href="#"
                          >Sub Link ${idx + 1}</kyn-header-link
                        >
                      `
                    )}
                  </kyn-header-category>

                  <!-- CATEGORY 8 -->
                  <kyn-header-category heading="Category 8">
                    <span slot="icon">${unsafeSVG(circleIcon)}</span>
                    <kyn-header-link href="#">Sub Link 1</kyn-header-link>
                    <kyn-header-link href="#">Sub Link 2</kyn-header-link>
                    <kyn-header-link href="#">Sub Link 3</kyn-header-link>
                  </kyn-header-category>

                  <!-- CATEGORY 9 -->
                  <kyn-header-category heading="Category 9">
                    <span slot="icon">${unsafeSVG(circleIcon)}</span>
                    <kyn-header-link href="#">Sub Link 1</kyn-header-link>
                    <kyn-header-link href="#">Sub Link 2</kyn-header-link>
                    <kyn-header-link href="#">Sub Link 3</kyn-header-link>
                    <kyn-header-link href="#">Sub Link 4</kyn-header-link>
                  </kyn-header-category>

                  <!-- CATEGORY 10 -->
                  <kyn-header-category heading="Category 10">
                    <span slot="icon">${unsafeSVG(circleIcon)}</span>
                    <kyn-header-link href="#">Sub Link 1</kyn-header-link>
                    <kyn-header-link href="#">Sub Link 2</kyn-header-link>
                    <kyn-header-link href="#">Sub Link 3</kyn-header-link>
                  </kyn-header-category>

                  <!-- CATEGORY 11 -->
                  <kyn-header-category heading="Category 11">
                    <span slot="icon">${unsafeSVG(circleIcon)}</span>
                    <kyn-header-link href="#">Sub Link 1</kyn-header-link>
                    <kyn-header-link href="#">Sub Link 2</kyn-header-link>
                  </kyn-header-category>

                  <!-- CATEGORY 12 -->
                  <kyn-header-category heading="Category 12">
                    <span slot="icon">${unsafeSVG(circleIcon)}</span>
                    <kyn-header-link href="#">Sub Link 1</kyn-header-link>
                    <kyn-header-link href="#">Sub Link 2</kyn-header-link>
                    <kyn-header-link href="#">Sub Link 3</kyn-header-link>
                    <kyn-header-link href="#">Sub Link 4</kyn-header-link>
                  </kyn-header-category>

                  <!-- CATEGORY 13 -->
                  <kyn-header-category heading="Category 13">
                    <span slot="icon">${unsafeSVG(circleIcon)}</span>
                    <kyn-header-link href="#">Sub Link 1</kyn-header-link>
                  </kyn-header-category>

                  <!-- CATEGORY 14 -->
                  <kyn-header-category heading="Category 14">
                    <span slot="icon">${unsafeSVG(circleIcon)}</span>
                    <kyn-header-link href="#">Sub Link 1</kyn-header-link>
                    <kyn-header-link href="#">Sub Link 2</kyn-header-link>
                    <kyn-header-link href="#">Sub Link 3</kyn-header-link>
                  </kyn-header-category>

                  <!-- CATEGORY 15 -->
                  <kyn-header-category heading="Category 15">
                    <span slot="icon">${unsafeSVG(circleIcon)}</span>
                    <kyn-header-link href="#">Sub Link 1</kyn-header-link>
                    <kyn-header-link href="#">Sub Link 2</kyn-header-link>
                  </kyn-header-category>

                  <!-- CATEGORY 16 -->
                  <kyn-header-category heading="Category 16">
                    <span slot="icon">${unsafeSVG(circleIcon)}</span>
                    <kyn-header-link href="#">Sub Link 1</kyn-header-link>
                    <kyn-header-link href="#">Sub Link 2</kyn-header-link>
                    <kyn-header-link href="#">Sub Link 3</kyn-header-link>
                    <kyn-header-link href="#">Sub Link 4</kyn-header-link>
                    <kyn-header-link href="#">Sub Link 5</kyn-header-link>
                  </kyn-header-category>

                  <!-- CATEGORY 17 -->
                  <kyn-header-category heading="Category 17">
                    <span slot="icon">${unsafeSVG(circleIcon)}</span>
                    <kyn-header-link href="#">Sub Link 1</kyn-header-link>
                    <kyn-header-link href="#">Sub Link 2</kyn-header-link>
                  </kyn-header-category>

                  <!-- CATEGORY 18 -->
                  <kyn-header-category heading="Category 18">
                    <span slot="icon">${unsafeSVG(circleIcon)}</span>
                    <kyn-header-link href="#">Sub Link 1</kyn-header-link>
                    <kyn-header-link href="#">Sub Link 2</kyn-header-link>
                    <kyn-header-link href="#">Sub Link 3</kyn-header-link>
                  </kyn-header-category>

                  <!-- CATEGORY 19 -->
                  <kyn-header-category heading="Category 19">
                    <span slot="icon">${unsafeSVG(circleIcon)}</span>
                    <kyn-header-link href="#">Sub Link 1</kyn-header-link>
                  </kyn-header-category>

                  <!-- CATEGORY 20 -->
                  <kyn-header-category heading="Category 20">
                    <span slot="icon">${unsafeSVG(circleIcon)}</span>
                    <kyn-header-link href="#">Sub Link 1</kyn-header-link>
                    <kyn-header-link href="#">Sub Link 2</kyn-header-link>
                    <kyn-header-link href="#">Sub Link 3</kyn-header-link>
                    <kyn-header-link href="#">Sub Link 4</kyn-header-link>
                  </kyn-header-category>
                </kyn-header-categories>
              </kyn-tab-panel>

              <kyn-tab-panel
                tabId="tab2"
                noPadding
                ?visible=${renderArgs.activeMegaTabId === 'tab2'}
              >
                <kyn-search
                  label="Filter items... (Application controlled)"
                  style="display: block; margin-bottom: 16px;"
                ></kyn-search>

                <!-- iterating through array here to show how the details view handles many links -->
                <kyn-header-categories>
                  <kyn-header-category heading="T2 - Category 1">
                    <span slot="icon">${unsafeSVG(circleIcon)}</span>
                    ${Array.from({ length: 40 }).map(
                      (_, idx) => html`
                        <kyn-header-link href="#"
                          >Sub Link ${idx + 1}</kyn-header-link
                        >
                      `
                    )}
                  </kyn-header-category>

                  <kyn-header-category heading="T2 - Category 2">
                    <span slot="icon">${unsafeSVG(circleIcon)}</span>
                    <kyn-header-link href="#">Sub Link 1</kyn-header-link>
                  </kyn-header-category>
                </kyn-header-categories>
              </kyn-tab-panel>
            </kyn-tabs>
          </kyn-header-link>

          <kyn-header-link href="javascript:void(0)">
            <span>${unsafeSVG(circleIcon)}</span>
            Application 2

            <kyn-tabs tabSize="lg" slot="links">
              <kyn-tab
                slot="tabs"
                id="tab1"
                ?selected=${renderArgs.activeMegaTabId === 'tab1'}
                @click=${() => updateArgs({ activeMegaTabId: 'tab1' })}
              >
                Tab 3
              </kyn-tab>

              <kyn-tab
                slot="tabs"
                id="tab2"
                ?selected=${renderArgs.activeMegaTabId === 'tab2'}
                @click=${() => updateArgs({ activeMegaTabId: 'tab2' })}
              >
                Tab 4
              </kyn-tab>

              <kyn-tab-panel
                tabId="tab1"
                noPadding
                ?visible=${renderArgs.activeMegaTabId === 'tab1'}
              >
                <kyn-search
                  label="Filter items... (Application controlled)"
                  style="display: block; margin-bottom: 16px;"
                ></kyn-search>

                <kyn-header-categories>
                  <!-- CATEGORY 1 -->
                  <kyn-header-category heading="Category 1">
                    <span slot="icon">${unsafeSVG(circleIcon)}</span>
                    <kyn-header-link href="#">Sub Link 1</kyn-header-link>
                    <kyn-header-link href="#">Sub Link 2</kyn-header-link>
                    <kyn-header-link href="#">Sub Link 3</kyn-header-link>
                    <kyn-header-link href="#">Sub Link 4</kyn-header-link>
                    <kyn-header-link href="#">Sub Link 5</kyn-header-link>
                    <kyn-header-link href="#">Sub Link 6</kyn-header-link>
                    <kyn-header-link href="#">Sub Link 7</kyn-header-link>
                    <kyn-header-link href="#">Sub Link 8</kyn-header-link>
                    <kyn-header-link href="#">Sub Link 9</kyn-header-link>
                    <kyn-header-link href="#">Sub Link 10</kyn-header-link>
                    <kyn-header-link href="#">Sub Link 11</kyn-header-link>
                    <kyn-header-link href="#">Sub Link 12</kyn-header-link>
                  </kyn-header-category>

                  <!-- CATEGORY 2 -->
                  <kyn-header-category heading="Category 2">
                    <span slot="icon">${unsafeSVG(circleIcon)}</span>
                    <kyn-header-link href="#">Sub Link 1</kyn-header-link>
                  </kyn-header-category>

                  <!-- CATEGORY 3 -->
                  <kyn-header-category heading="Category 3">
                    <span slot="icon">${unsafeSVG(circleIcon)}</span>
                    <kyn-header-link href="#">Sub Link 1</kyn-header-link>
                    <kyn-header-link href="#">Sub Link 2</kyn-header-link>
                  </kyn-header-category>

                  <!-- CATEGORY 4 -->
                  <kyn-header-category heading="Category 4">
                    <span slot="icon">${unsafeSVG(circleIcon)}</span>
                    <kyn-header-link href="#">Sub Link 1</kyn-header-link>
                    <kyn-header-link href="#">Sub Link 2</kyn-header-link>
                    <kyn-header-link href="#">Sub Link 3</kyn-header-link>
                  </kyn-header-category>

                  <!-- CATEGORY 5 -->
                  <kyn-header-category heading="Category 5">
                    <span slot="icon">${unsafeSVG(circleIcon)}</span>
                    <kyn-header-link href="#">Sub Link 1</kyn-header-link>
                    <kyn-header-link href="#">Sub Link 2</kyn-header-link>
                    <kyn-header-link href="#">Sub Link 3</kyn-header-link>
                    <kyn-header-link href="#">Sub Link 4</kyn-header-link>
                  </kyn-header-category>

                  <!-- CATEGORY 6 -->
                  <kyn-header-category heading="Category 6">
                    <span slot="icon">${unsafeSVG(circleIcon)}</span>
                    <kyn-header-link href="#">Sub Link 1</kyn-header-link>
                  </kyn-header-category>

                  <!-- CATEGORY 7 -->
                  <kyn-header-category heading="Category 7">
                    <span slot="icon">${unsafeSVG(circleIcon)}</span>
                    ${Array.from({ length: 13 }).map(
                      (_, idx) => html`
                        <kyn-header-link href="#"
                          >Sub Link ${idx + 1}</kyn-header-link
                        >
                      `
                    )}
                  </kyn-header-category>

                  <!-- CATEGORY 8 -->
                  <kyn-header-category heading="Category 8">
                    <span slot="icon">${unsafeSVG(circleIcon)}</span>
                    <kyn-header-link href="#">Sub Link 1</kyn-header-link>
                    <kyn-header-link href="#">Sub Link 2</kyn-header-link>
                    <kyn-header-link href="#">Sub Link 3</kyn-header-link>
                  </kyn-header-category>

                  <!-- CATEGORY 9 -->
                  <kyn-header-category heading="Category 9">
                    <span slot="icon">${unsafeSVG(circleIcon)}</span>
                    <kyn-header-link href="#">Sub Link 1</kyn-header-link>
                    <kyn-header-link href="#">Sub Link 2</kyn-header-link>
                    <kyn-header-link href="#">Sub Link 3</kyn-header-link>
                    <kyn-header-link href="#">Sub Link 4</kyn-header-link>
                  </kyn-header-category>

                  <!-- CATEGORY 10 -->
                  <kyn-header-category heading="Category 10">
                    <span slot="icon">${unsafeSVG(circleIcon)}</span>
                    <kyn-header-link href="#">Sub Link 1</kyn-header-link>
                    <kyn-header-link href="#">Sub Link 2</kyn-header-link>
                    <kyn-header-link href="#">Sub Link 3</kyn-header-link>
                  </kyn-header-category>

                  <!-- CATEGORY 11 -->
                  <kyn-header-category heading="Category 11">
                    <span slot="icon">${unsafeSVG(circleIcon)}</span>
                    <kyn-header-link href="#">Sub Link 1</kyn-header-link>
                    <kyn-header-link href="#">Sub Link 2</kyn-header-link>
                  </kyn-header-category>

                  <!-- CATEGORY 12 -->
                  <kyn-header-category heading="Category 12">
                    <span slot="icon">${unsafeSVG(circleIcon)}</span>
                    <kyn-header-link href="#">Sub Link 1</kyn-header-link>
                    <kyn-header-link href="#">Sub Link 2</kyn-header-link>
                    <kyn-header-link href="#">Sub Link 3</kyn-header-link>
                    <kyn-header-link href="#">Sub Link 4</kyn-header-link>
                  </kyn-header-category>

                  <!-- CATEGORY 13 -->
                  <kyn-header-category heading="Category 13">
                    <span slot="icon">${unsafeSVG(circleIcon)}</span>
                    <kyn-header-link href="#">Sub Link 1</kyn-header-link>
                  </kyn-header-category>

                  <!-- CATEGORY 14 -->
                  <kyn-header-category heading="Category 14">
                    <span slot="icon">${unsafeSVG(circleIcon)}</span>
                    <kyn-header-link href="#">Sub Link 1</kyn-header-link>
                    <kyn-header-link href="#">Sub Link 2</kyn-header-link>
                    <kyn-header-link href="#">Sub Link 3</kyn-header-link>
                  </kyn-header-category>

                  <!-- CATEGORY 15 -->
                  <kyn-header-category heading="Category 15">
                    <span slot="icon">${unsafeSVG(circleIcon)}</span>
                    <kyn-header-link href="#">Sub Link 1</kyn-header-link>
                    <kyn-header-link href="#">Sub Link 2</kyn-header-link>
                  </kyn-header-category>

                  <!-- CATEGORY 16 -->
                  <kyn-header-category heading="Category 16">
                    <span slot="icon">${unsafeSVG(circleIcon)}</span>
                    <kyn-header-link href="#">Sub Link 1</kyn-header-link>
                    <kyn-header-link href="#">Sub Link 2</kyn-header-link>
                    <kyn-header-link href="#">Sub Link 3</kyn-header-link>
                    <kyn-header-link href="#">Sub Link 4</kyn-header-link>
                    <kyn-header-link href="#">Sub Link 5</kyn-header-link>
                  </kyn-header-category>

                  <!-- CATEGORY 17 -->
                  <kyn-header-category heading="Category 17">
                    <span slot="icon">${unsafeSVG(circleIcon)}</span>
                    <kyn-header-link href="#">Sub Link 1</kyn-header-link>
                    <kyn-header-link href="#">Sub Link 2</kyn-header-link>
                  </kyn-header-category>

                  <!-- CATEGORY 18 -->
                  <kyn-header-category heading="Category 18">
                    <span slot="icon">${unsafeSVG(circleIcon)}</span>
                    <kyn-header-link href="#">Sub Link 1</kyn-header-link>
                    <kyn-header-link href="#">Sub Link 2</kyn-header-link>
                    <kyn-header-link href="#">Sub Link 3</kyn-header-link>
                  </kyn-header-category>

                  <!-- CATEGORY 19 -->
                  <kyn-header-category heading="Category 19">
                    <span slot="icon">${unsafeSVG(circleIcon)}</span>
                    <kyn-header-link href="#">Sub Link 1</kyn-header-link>
                  </kyn-header-category>

                  <!-- CATEGORY 20 -->
                  <kyn-header-category heading="Category 20">
                    <span slot="icon">${unsafeSVG(circleIcon)}</span>
                    <kyn-header-link href="#">Sub Link 1</kyn-header-link>
                    <kyn-header-link href="#">Sub Link 2</kyn-header-link>
                    <kyn-header-link href="#">Sub Link 3</kyn-header-link>
                    <kyn-header-link href="#">Sub Link 4</kyn-header-link>
                  </kyn-header-category>
                </kyn-header-categories>
              </kyn-tab-panel>

              <kyn-tab-panel
                tabId="tab2"
                noPadding
                ?visible=${renderArgs.activeMegaTabId === 'tab2'}
              >
                <kyn-search
                  label="Filter items... (Application controlled)"
                  style="display: block; margin-bottom: 16px;"
                ></kyn-search>

                <!-- iterating through array here to show how the details view handles many links -->
                <kyn-header-categories>
                  <kyn-header-category heading="T4 - Category 1">
                    <span slot="icon">${unsafeSVG(circleIcon)}</span>
                    ${Array.from({ length: 40 }).map(
                      (_, idx) => html`
                        <kyn-header-link href="#"
                          >Sub Link ${idx + 1}</kyn-header-link
                        >
                      `
                    )}
                  </kyn-header-category>

                  <kyn-header-category heading="T4 - Category 2">
                    <span slot="icon">${unsafeSVG(circleIcon)}</span>
                    <kyn-header-link href="#">Sub Link 1</kyn-header-link>
                  </kyn-header-category>
                </kyn-header-categories>
              </kyn-tab-panel>
            </kyn-tabs>
          </kyn-header-link>

          <kyn-header-link href="javascript:void(0)">
            <span>${unsafeSVG(circleIcon)}</span>
            Link 1
          </kyn-header-link>

          <kyn-header-divider></kyn-header-divider>

          <kyn-header-category heading="Category">
            <kyn-header-link href="javascript:void(0)">
              <span>${unsafeSVG(circleIcon)}</span>
              Link 2
            </kyn-header-link>
            <kyn-header-link href="javascript:void(0)">
              <span>${unsafeSVG(circleIcon)}</span>
              Link 3
            </kyn-header-link>
          </kyn-header-category>

          <kyn-header-divider></kyn-header-divider>

          <kyn-header-link href="javascript:void(0)">
            <span>${unsafeSVG(circleIcon)}</span>
            Link 4
          </kyn-header-link>
        </kyn-header-nav>
      </kyn-header>
    `;
  },
};
WithCategorizedNavManualHtml.storyName = 'Slotted HTML Example';

// -----------------------------------------------------------------------------
// JSON-driven categorized nav with configurable linkRenderer
// -----------------------------------------------------------------------------
export const WithCategorizedNav = {
  args: {
    ...args,
    activeMegaTabId: 'tab1',
    activeMegaCategoryId: null,
  },
  render: (renderArgs) => {
    const [, updateArgs] = useArgs();

    const handleMegaChange = (e) => {
      const { activeMegaTabId, activeMegaCategoryId } = e.detail;
      updateArgs({ activeMegaTabId, activeMegaCategoryId });
    };

    // Links should not have icons - icons appear only on category titles
    const renderMegaLinkPlainString = (link /*, ctx */) => {
      return link.label;
    };

    return html`
      <kyn-header rootUrl=${renderArgs.rootUrl} appTitle=${renderArgs.appTitle}>
        <kyn-header-nav>
          <kyn-header-link href="javascript:void(0)">
            <span>${unsafeSVG(circleIcon)}</span>
            Application

            <kyn-tabs tabSize="lg" slot="links">
              <kyn-tab
                slot="tabs"
                id="tab1"
                ?selected=${renderArgs.activeMegaTabId === 'tab1'}
                @click=${() =>
                  updateArgs({
                    activeMegaTabId: 'tab1',
                    activeMegaCategoryId: null,
                  })}
              >
                Tab 1
              </kyn-tab>

              <kyn-tab
                slot="tabs"
                id="tab2"
                ?selected=${renderArgs.activeMegaTabId === 'tab2'}
                @click=${() =>
                  updateArgs({
                    activeMegaTabId: 'tab2',
                    activeMegaCategoryId: null,
                  })}
              >
                Tab 2
              </kyn-tab>

              <kyn-tab-panel
                tabId="tab1"
                noPadding
                ?visible=${renderArgs.activeMegaTabId === 'tab1'}
              >
                <kyn-search
                  label="Filter items... (Application controlled)"
                  style="display: block; margin-bottom: 16px;"
                ></kyn-search>

                <kyn-header-categories
                  .tabsConfig=${megaNavConfig}
                  .activeMegaTabId=${renderArgs.activeMegaTabId}
                  .activeMegaCategoryId=${renderArgs.activeMegaCategoryId}
                  .linkRenderer=${renderMegaLinkPlainString}
                  @on-nav-change=${handleMegaChange}
                ></kyn-header-categories>
              </kyn-tab-panel>

              <kyn-tab-panel
                tabId="tab2"
                noPadding
                ?visible=${renderArgs.activeMegaTabId === 'tab2'}
              >
                <kyn-search
                  label="Filter items... (Application controlled)"
                  style="display: block; margin-bottom: 16px;"
                ></kyn-search>

                <kyn-header-categories
                  .tabsConfig=${megaNavConfig}
                  .activeMegaTabId=${renderArgs.activeMegaTabId}
                  .activeMegaCategoryId=${renderArgs.activeMegaCategoryId}
                  .linkRenderer=${renderMegaLinkPlainString}
                  @on-nav-change=${handleMegaChange}
                ></kyn-header-categories>
              </kyn-tab-panel>
            </kyn-tabs>
          </kyn-header-link>

          <kyn-header-link href="javascript:void(0)">
            <span>${unsafeSVG(circleIcon)}</span>
            Application 2

            <kyn-tabs tabSize="lg" slot="links">
              <kyn-tab
                slot="tabs"
                id="tab1"
                ?selected=${renderArgs.activeMegaTabId === 'tab1'}
                @click=${() =>
                  updateArgs({
                    activeMegaTabId: 'tab1',
                    activeMegaCategoryId: null,
                  })}
              >
                Tab 1
              </kyn-tab>

              <kyn-tab
                slot="tabs"
                id="tab2"
                ?selected=${renderArgs.activeMegaTabId === 'tab2'}
                @click=${() =>
                  updateArgs({
                    activeMegaTabId: 'tab2',
                    activeMegaCategoryId: null,
                  })}
              >
                Tab 2
              </kyn-tab>

              <kyn-tab-panel
                tabId="tab1"
                noPadding
                ?visible=${renderArgs.activeMegaTabId === 'tab1'}
              >
                <kyn-search
                  label="Filter items... (Application controlled)"
                  style="display: block; margin-bottom: 16px;"
                ></kyn-search>

                <kyn-header-categories
                  .tabsConfig=${megaNavConfig}
                  .activeMegaTabId=${renderArgs.activeMegaTabId}
                  .activeMegaCategoryId=${renderArgs.activeMegaCategoryId}
                  .linkRenderer=${renderMegaLinkPlainString}
                  @on-nav-change=${handleMegaChange}
                ></kyn-header-categories>
              </kyn-tab-panel>

              <kyn-tab-panel
                tabId="tab2"
                noPadding
                ?visible=${renderArgs.activeMegaTabId === 'tab2'}
              >
                <kyn-search
                  label="Filter items... (Application controlled)"
                  style="display: block; margin-bottom: 16px;"
                ></kyn-search>

                <kyn-header-categories
                  .tabsConfig=${megaNavConfig}
                  .activeMegaTabId=${renderArgs.activeMegaTabId}
                  .activeMegaCategoryId=${renderArgs.activeMegaCategoryId}
                  .linkRenderer=${renderMegaLinkPlainString}
                  @on-nav-change=${handleMegaChange}
                ></kyn-header-categories>
              </kyn-tab-panel>
            </kyn-tabs>
          </kyn-header-link>

          <kyn-header-link href="javascript:void(0)">
            <span>${unsafeSVG(circleIcon)}</span>
            Link 1
          </kyn-header-link>

          <kyn-header-divider></kyn-header-divider>

          <kyn-header-category heading="Category">
            <kyn-header-link href="javascript:void(0)">
              <span>${unsafeSVG(circleIcon)}</span>
              Link 2
            </kyn-header-link>
            <kyn-header-link href="javascript:void(0)">
              <span>${unsafeSVG(circleIcon)}</span>
              Link 3
            </kyn-header-link>
          </kyn-header-category>

          <kyn-header-divider></kyn-header-divider>

          <kyn-header-link href="javascript:void(0)">
            <span>${unsafeSVG(circleIcon)}</span>
            Link 4
          </kyn-header-link>
        </kyn-header-nav>
      </kyn-header>
    `;
  },
};
WithCategorizedNav.storyName = 'JSON-driven with linkRenderer';

// -----------------------------------------------------------------------------
// FullImplementation
// -----------------------------------------------------------------------------

export const FullImplementation = {
  args: {
    ...args,
    activeServicesTab: 'kyndryl',
  },
  render: (renderArgs) => {
    const [, updateArgs] = useArgs();

    return html`
      <kyn-header rootUrl=${renderArgs.rootUrl} appTitle=${renderArgs.appTitle}>
        <kyn-header-nav>
          <!-- FAVORITES -->
          <kyn-header-link href="javascript:void(0)" hideSearch>
            <span>${unsafeSVG(starFilledIcon)}</span>
            Favorites

            <kyn-header-category slot="links">
              <kyn-header-link href="#">
                <span
                  style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                  >Connections Management</span
                >
                <span
                  style="display: inline-flex; align-items: center; justify-content: center; margin-left: auto; width: 16px; height: 16px; flex-shrink: 0;"
                  >${unsafeSVG(starFilledIcon)}</span
                >
              </kyn-header-link>
              <kyn-header-link href="#">
                <span
                  style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                  >Discovered Data</span
                >
                <span
                  style="display: inline-flex; align-items: center; justify-content: center; margin-left: auto; width: 16px; height: 16px; flex-shrink: 0;"
                  >${unsafeSVG(starFilledIcon)}</span
                >
              </kyn-header-link>
              <kyn-header-link href="#">
                <span
                  style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                  >Visualization, Exploration and Semantic Analytics</span
                >
                <span
                  style="display: inline-flex; align-items: center; justify-content: center; margin-left: auto; width: 16px; height: 16px; flex-shrink: 0;"
                  >${unsafeSVG(starFilledIcon)}</span
                >
              </kyn-header-link>
              <kyn-header-link href="#">
                <span
                  style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                  >Topology</span
                >
                <span
                  style="display: inline-flex; align-items: center; justify-content: center; margin-left: auto; width: 16px; height: 16px; flex-shrink: 0;"
                  >${unsafeSVG(starFilledIcon)}</span
                >
              </kyn-header-link>
              <kyn-header-link href="#">
                <span
                  style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                  >Menu item five</span
                >
                <span
                  style="display: inline-flex; align-items: center; justify-content: center; margin-left: auto; width: 16px; height: 16px; flex-shrink: 0;"
                  >${unsafeSVG(starFilledIcon)}</span
                >
              </kyn-header-link>
              <kyn-header-link href="#">
                <span
                  style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                  >Menu item six</span
                >
                <span
                  style="display: inline-flex; align-items: center; justify-content: center; margin-left: auto; width: 16px; height: 16px; flex-shrink: 0;"
                  >${unsafeSVG(starFilledIcon)}</span
                >
              </kyn-header-link>
              <kyn-header-link href="#">
                <span
                  style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                  >Menu Item seven</span
                >
                <span
                  style="display: inline-flex; align-items: center; justify-content: center; margin-left: auto; width: 16px; height: 16px; flex-shrink: 0;"
                  >${unsafeSVG(starFilledIcon)}</span
                >
              </kyn-header-link>
            </kyn-header-category>
          </kyn-header-link>

          <!-- RECENTLY VIEWED -->
          <kyn-header-link href="javascript:void(0)" hideSearch>
            <span>${unsafeSVG(historyIcon)}</span>
            Recently Viewed

            <kyn-header-category slot="links">
              <kyn-header-link href="#"
                ><span
                  style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                  >Topology</span
                ></kyn-header-link
              >
              <kyn-header-link href="#"
                ><span
                  style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                  >Discovered Data</span
                ></kyn-header-link
              >
              <kyn-header-link href="#"
                ><span
                  style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                  >Connections Management</span
                ></kyn-header-link
              >
              <kyn-header-link href="#"
                ><span
                  style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                  >Sustainability Advisor</span
                ></kyn-header-link
              >
              <kyn-header-link href="#"
                ><span
                  style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                  >Discovered Data</span
                ></kyn-header-link
              >
              <kyn-header-link href="#"
                ><span
                  style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                  >Private Cloud IaaS/PaaS</span
                ></kyn-header-link
              >
              <kyn-header-link href="#"
                ><span
                  style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                  >Mass Recovery Model</span
                ></kyn-header-link
              >
              <kyn-header-link href="#"
                ><span
                  style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                  >Assessment for Microsoft Azure Stack Hyper Converged
                  Infrastructure</span
                ></kyn-header-link
              >
              <kyn-header-link href="#"
                ><span
                  style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                  >Private Cloud IaaS/PaaS</span
                ></kyn-header-link
              >
              <kyn-header-link href="#"
                ><span
                  style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                  >Rapid Assessments for Enterprise Sustainability</span
                ></kyn-header-link
              >
            </kyn-header-category>
          </kyn-header-link>

          <kyn-header-divider></kyn-header-divider>

          <!-- CONSOLE -->
          <!-- Single column layout: use div wrapper instead of kyn-header-categories -->
          <kyn-header-link href="javascript:void(0)" hideSearch>
            <span>${unsafeSVG(consoleIcon)}</span>
            Console

            <div
              slot="links"
              style="display: flex; flex-direction: column; gap: 2px; padding-top: 12px;"
            >
              <kyn-header-link href="#">
                <span
                  style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                  >Bridge Home</span
                >
                <span
                  style="display: inline-flex; align-items: center; margin-left: auto; width: 40px; justify-content: flex-end; flex-shrink: 0;"
                  ><span style="display: flex; width: 16px; height: 16px;"
                    >${unsafeSVG(starOutlineIcon)}</span
                  ></span
                >
              </kyn-header-link>
              <kyn-header-link href="#">
                <span
                  style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                  >All Dashboards</span
                >
                <span
                  style="display: inline-flex; align-items: center; margin-left: auto; width: 40px; justify-content: flex-end; flex-shrink: 0;"
                  ><span style="display: flex; width: 16px; height: 16px;"
                    >${unsafeSVG(starOutlineIcon)}</span
                  ></span
                >
              </kyn-header-link>

              <kyn-header-category
                heading="Dashboards"
                style="margin-top: 8px;"
              >
                <kyn-header-link href="#">
                  <span
                    style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                    >Actionable Insights</span
                  >
                  <span
                    style="display: inline-flex; align-items: center; margin-left: auto; width: 40px; justify-content: flex-end; flex-shrink: 0;"
                    ><span style="display: flex; width: 16px; height: 16px;"
                      >${unsafeSVG(starOutlineIcon)}</span
                    ></span
                  >
                </kyn-header-link>
                <kyn-header-link href="#">
                  <span
                    style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                    >AIOps IT Health Indicators Dashboard</span
                  >
                  <span
                    style="display: inline-flex; align-items: center; margin-left: auto; width: 40px; justify-content: flex-end; flex-shrink: 0;"
                    ><span style="display: flex; width: 16px; height: 16px;"
                      >${unsafeSVG(starOutlineIcon)}</span
                    ></span
                  >
                </kyn-header-link>
                <kyn-header-link href="#" target="_blank">
                  <span
                    style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                    >Business Console (legacy)</span
                  >
                  <span
                    style="display: inline-flex; align-items: center; margin-left: auto; gap: 8px; width: 40px; justify-content: flex-end; flex-shrink: 0;"
                  >
                    <span style="display: flex; width: 16px; height: 16px;"
                      >${unsafeSVG(launchIcon)}</span
                    >
                    <span style="display: flex; width: 16px; height: 16px;"
                      >${unsafeSVG(starOutlineIcon)}</span
                    >
                  </span>
                </kyn-header-link>
                <kyn-header-link href="#" target="_blank">
                  <span
                    style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                    >Business Service Insights (legacy)</span
                  >
                  <span
                    style="display: inline-flex; align-items: center; margin-left: auto; gap: 8px; width: 40px; justify-content: flex-end; flex-shrink: 0;"
                  >
                    <span style="display: flex; width: 16px; height: 16px;"
                      >${unsafeSVG(launchIcon)}</span
                    >
                    <span style="display: flex; width: 16px; height: 16px;"
                      >${unsafeSVG(starOutlineIcon)}</span
                    >
                  </span>
                </kyn-header-link>
              </kyn-header-category>
            </div>
          </kyn-header-link>

          <!-- SERVICES -->
          <kyn-header-link href="javascript:void(0)">
            <span>${unsafeSVG(servicesIcon)}</span>
            Services

            <kyn-tabs
              tabSize="lg"
              slot="links"
              style="width: 100%; max-width: none;"
            >
              <kyn-tab
                slot="tabs"
                id="kyndryl"
                ?selected=${renderArgs.activeServicesTab === 'kyndryl'}
                @click=${() => updateArgs({ activeServicesTab: 'kyndryl' })}
              >
                Kyndryl Services
              </kyn-tab>

              <kyn-tab
                slot="tabs"
                id="platform"
                ?selected=${renderArgs.activeServicesTab === 'platform'}
                @click=${() => updateArgs({ activeServicesTab: 'platform' })}
              >
                Platform Services
              </kyn-tab>

              <!-- KYNDRYL SERVICES TAB -->
              <kyn-tab-panel
                tabId="kyndryl"
                noPadding
                ?visible=${renderArgs.activeServicesTab === 'kyndryl'}
              >
                <div
                  style="display: flex; gap: 32px; width: 100%; max-width: none;"
                >
                  <!-- LEFT COLUMN -->
                  <div
                    style="display: flex; flex-direction: column; gap: 8px; flex: 1; min-width: 0;"
                  >
                    <kyn-header-category heading="Applications, Data, & AI">
                      <kyn-header-link href="#">
                        <span
                          style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                          >Business Intelligence</span
                        >
                        <span
                          style="display: inline-flex; align-items: center; justify-content: center; margin-left: auto; width: 16px; height: 16px; flex-shrink: 0;"
                          >${unsafeSVG(starOutlineIcon)}</span
                        >
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span
                          style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                          >Storage Migration</span
                        >
                        <span
                          style="display: inline-flex; align-items: center; justify-content: center; margin-left: auto; width: 16px; height: 16px; flex-shrink: 0;"
                          >${unsafeSVG(starOutlineIcon)}</span
                        >
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span
                          style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                          >Visualization, Exploration and Semantic
                          Analytics</span
                        >
                        <span
                          style="display: inline-flex; align-items: center; justify-content: center; margin-left: auto; width: 16px; height: 16px; flex-shrink: 0;"
                          >${unsafeSVG(starOutlineIcon)}</span
                        >
                      </kyn-header-link>
                    </kyn-header-category>

                    <kyn-header-category heading="Cloud Services">
                      <kyn-header-link href="#">
                        <span
                          style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                          >Assessment for Microsoft Azure Stack Hyper Converged
                          Infrastructure</span
                        >
                        <span
                          style="display: inline-flex; align-items: center; justify-content: center; margin-left: auto; width: 16px; height: 16px; flex-shrink: 0;"
                          >${unsafeSVG(starOutlineIcon)}</span
                        >
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span
                          style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                          >Private Cloud IaaS/PaaS</span
                        >
                        <span
                          style="display: inline-flex; align-items: center; justify-content: center; margin-left: auto; width: 16px; height: 16px; flex-shrink: 0;"
                          >${unsafeSVG(starOutlineIcon)}</span
                        >
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span
                          style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                          >Rapid Assessments for Enterprise Sustainability</span
                        >
                        <span
                          style="display: inline-flex; align-items: center; justify-content: center; margin-left: auto; width: 16px; height: 16px; flex-shrink: 0;"
                          >${unsafeSVG(starOutlineIcon)}</span
                        >
                      </kyn-header-link>
                    </kyn-header-category>
                  </div>

                  <!-- MIDDLE COLUMN -->
                  <div
                    style="display: flex; flex-direction: column; gap: 8px; flex: 1; min-width: 0;"
                  >
                    <kyn-header-category heading="Core Enterprise & Z Cloud">
                      <kyn-header-link href="#">
                        <span
                          style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                          >Application Management Services for IBM Z and IBM
                          i</span
                        >
                        <span
                          style="display: inline-flex; align-items: center; justify-content: center; margin-left: auto; width: 16px; height: 16px; flex-shrink: 0;"
                          >${unsafeSVG(starOutlineIcon)}</span
                        >
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span
                          style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                          >Managed Extended Cloud IaaS for IBM i on Skytap</span
                        >
                        <span
                          style="display: inline-flex; align-items: center; justify-content: center; margin-left: auto; width: 16px; height: 16px; flex-shrink: 0;"
                          >${unsafeSVG(starOutlineIcon)}</span
                        >
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span
                          style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                          >Managed Extended Cloud IaaS for IBM Z (zCloud)</span
                        >
                        <span
                          style="display: inline-flex; align-items: center; justify-content: center; margin-left: auto; width: 16px; height: 16px; flex-shrink: 0;"
                          >${unsafeSVG(starOutlineIcon)}</span
                        >
                      </kyn-header-link>
                    </kyn-header-category>

                    <kyn-header-category heading="Digital Workplace">
                      <kyn-header-link href="#">
                        <span
                          style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                          >Connected Experience</span
                        >
                        <span
                          style="display: inline-flex; align-items: center; justify-content: center; margin-left: auto; width: 16px; height: 16px; flex-shrink: 0;"
                          >${unsafeSVG(starOutlineIcon)}</span
                        >
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span
                          style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                          >Digital Experience Management</span
                        >
                        <span
                          style="display: inline-flex; align-items: center; justify-content: center; margin-left: auto; width: 16px; height: 16px; flex-shrink: 0;"
                          >${unsafeSVG(starOutlineIcon)}</span
                        >
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span
                          style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                          >Modern Device Management Services</span
                        >
                        <span
                          style="display: inline-flex; align-items: center; justify-content: center; margin-left: auto; width: 16px; height: 16px; flex-shrink: 0;"
                          >${unsafeSVG(starOutlineIcon)}</span
                        >
                      </kyn-header-link>
                    </kyn-header-category>

                    <kyn-header-category heading="Network & Edge">
                      <kyn-header-link href="#">
                        <span
                          style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                          >Managed Network Services</span
                        >
                        <span
                          style="display: inline-flex; align-items: center; justify-content: center; margin-left: auto; width: 16px; height: 16px; flex-shrink: 0;"
                          >${unsafeSVG(starOutlineIcon)}</span
                        >
                      </kyn-header-link>
                    </kyn-header-category>
                  </div>

                  <!-- RIGHT COLUMN -->
                  <div
                    style="display: flex; flex-direction: column; gap: 8px; flex: 1; min-width: 0;"
                  >
                    <kyn-header-category heading="Security & Resiliency">
                      <kyn-header-link href="#">
                        <span
                          style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                          >Continuous Controls Monitoring & Management</span
                        >
                        <span
                          style="display: inline-flex; align-items: center; justify-content: center; margin-left: auto; width: 16px; height: 16px; flex-shrink: 0;"
                          >${unsafeSVG(starOutlineIcon)}</span
                        >
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span
                          style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                          >Enterprise Security Compliance Management</span
                        >
                        <span
                          style="display: inline-flex; align-items: center; justify-content: center; margin-left: auto; width: 16px; height: 16px; flex-shrink: 0;"
                          >${unsafeSVG(starOutlineIcon)}</span
                        >
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span
                          style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                          >Intelligent Recovery Service</span
                        >
                        <span
                          style="display: inline-flex; align-items: center; justify-content: center; margin-left: auto; width: 16px; height: 16px; flex-shrink: 0;"
                          >${unsafeSVG(starOutlineIcon)}</span
                        >
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span
                          style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                          >Mass Recovery Model</span
                        >
                        <span
                          style="display: inline-flex; align-items: center; justify-content: center; margin-left: auto; width: 16px; height: 16px; flex-shrink: 0;"
                          >${unsafeSVG(starOutlineIcon)}</span
                        >
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span
                          style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                          >Recovery Retainer Service</span
                        >
                        <span
                          style="display: inline-flex; align-items: center; justify-content: center; margin-left: auto; width: 16px; height: 16px; flex-shrink: 0;"
                          >${unsafeSVG(starOutlineIcon)}</span
                        >
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span
                          style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                          >Security & Network Operations</span
                        >
                        <span
                          style="display: inline-flex; align-items: center; justify-content: center; margin-left: auto; width: 16px; height: 16px; flex-shrink: 0;"
                          >${unsafeSVG(starOutlineIcon)}</span
                        >
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span
                          style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                          >Security Operations as a Platform</span
                        >
                        <span
                          style="display: inline-flex; align-items: center; justify-content: center; margin-left: auto; width: 16px; height: 16px; flex-shrink: 0;"
                          >${unsafeSVG(starOutlineIcon)}</span
                        >
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span
                          style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                          >Sustainability Advisor</span
                        >
                        <span
                          style="display: inline-flex; align-items: center; justify-content: center; margin-left: auto; width: 16px; height: 16px; flex-shrink: 0;"
                          >${unsafeSVG(starOutlineIcon)}</span
                        >
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span
                          style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                          >Vulnerability Management Service</span
                        >
                        <span
                          style="display: inline-flex; align-items: center; justify-content: center; margin-left: auto; width: 16px; height: 16px; flex-shrink: 0;"
                          >${unsafeSVG(starOutlineIcon)}</span
                        >
                      </kyn-header-link>
                    </kyn-header-category>
                  </div>
                </div>
              </kyn-tab-panel>

              <!-- PLATFORM SERVICES TAB -->
              <kyn-tab-panel
                tabId="platform"
                noPadding
                ?visible=${renderArgs.activeServicesTab === 'platform'}
              >
                <div
                  style="display: flex; gap: 32px; width: 100%; max-width: none;"
                >
                  <!-- LEFT COLUMN -->
                  <div
                    style="display: flex; flex-direction: column; gap: 8px; flex: 1; min-width: 0;"
                  >
                    <kyn-header-category
                      heading="Application & Business Services"
                    >
                      <kyn-header-link href="#">
                        <span
                          style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                          >Application Modernization Intelligence</span
                        >
                        <span
                          style="display: inline-flex; align-items: center; justify-content: center; margin-left: auto; width: 16px; height: 16px; flex-shrink: 0;"
                          >${unsafeSVG(starOutlineIcon)}</span
                        >
                      </kyn-header-link>
                    </kyn-header-category>

                    <kyn-header-category heading="Change Management">
                      <kyn-header-link href="#" target="_blank">
                        <span
                          style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                          >Guided Change Manager (legacy)</span
                        >
                        <span
                          style="display: inline-flex; align-items: center; margin-left: auto; gap: 8px; width: 40px; justify-content: flex-end; flex-shrink: 0;"
                        >
                          <span
                            style="display: flex; width: 16px; height: 16px;"
                            >${unsafeSVG(launchIcon)}</span
                          >
                          <span
                            style="display: flex; width: 16px; height: 16px;"
                            >${unsafeSVG(starOutlineIcon)}</span
                          >
                        </span>
                      </kyn-header-link>
                    </kyn-header-category>

                    <kyn-header-category heading="Cloud Management">
                      <kyn-header-link href="#">
                        <span
                          style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                          >Container Cluster Management</span
                        >
                        <span
                          style="display: inline-flex; align-items: center; margin-left: auto; width: 40px; justify-content: flex-end; flex-shrink: 0;"
                          ><span
                            style="display: flex; width: 16px; height: 16px;"
                            >${unsafeSVG(starOutlineIcon)}</span
                          ></span
                        >
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span
                          style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                          >FinOps & Cost Optimization Intelligence</span
                        >
                        <span
                          style="display: inline-flex; align-items: center; margin-left: auto; width: 40px; justify-content: flex-end; flex-shrink: 0;"
                          ><span
                            style="display: flex; width: 16px; height: 16px;"
                            >${unsafeSVG(starOutlineIcon)}</span
                          ></span
                        >
                      </kyn-header-link>
                    </kyn-header-category>

                    <kyn-header-category heading="Data Analytics">
                      <kyn-header-link href="#">
                        <span
                          style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                          >Data Fabric</span
                        >
                        <span
                          style="display: inline-flex; align-items: center; justify-content: center; margin-left: auto; width: 16px; height: 16px; flex-shrink: 0;"
                          >${unsafeSVG(starOutlineIcon)}</span
                        >
                      </kyn-header-link>
                    </kyn-header-category>

                    <kyn-header-category heading="Discovery">
                      <kyn-header-link href="#">
                        <span
                          style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                          >Discovered Data</span
                        >
                        <span
                          style="display: inline-flex; align-items: center; justify-content: center; margin-left: auto; width: 16px; height: 16px; flex-shrink: 0;"
                          >${unsafeSVG(starOutlineIcon)}</span
                        >
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span
                          style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                          >Discovered Management</span
                        >
                        <span
                          style="display: inline-flex; align-items: center; justify-content: center; margin-left: auto; width: 16px; height: 16px; flex-shrink: 0;"
                          >${unsafeSVG(starOutlineIcon)}</span
                        >
                      </kyn-header-link>
                    </kyn-header-category>
                  </div>

                  <!-- MIDDLE COLUMN -->
                  <div
                    style="display: flex; flex-direction: column; gap: 8px; flex: 1; min-width: 0;"
                  >
                    <kyn-header-category heading="Inventory">
                      <kyn-header-link href="#" target="_blank">
                        <span
                          style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                          >Applications & Resources (legacy)</span
                        >
                        <span
                          style="display: inline-flex; align-items: center; margin-left: auto; gap: 8px; width: 40px; justify-content: flex-end; flex-shrink: 0;"
                        >
                          <span
                            style="display: flex; width: 16px; height: 16px;"
                            >${unsafeSVG(launchIcon)}</span
                          >
                          <span
                            style="display: flex; width: 16px; height: 16px;"
                            >${unsafeSVG(starOutlineIcon)}</span
                          >
                        </span>
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span
                          style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                          >Application Inventory</span
                        >
                        <span
                          style="display: inline-flex; align-items: center; margin-left: auto; width: 40px; justify-content: flex-end; flex-shrink: 0;"
                          ><span
                            style="display: flex; width: 16px; height: 16px;"
                            >${unsafeSVG(starOutlineIcon)}</span
                          ></span
                        >
                      </kyn-header-link>
                      <kyn-header-link href="#" target="_blank">
                        <span
                          style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                          >Infrastructure & Cloud Inventory (legacy)</span
                        >
                        <span
                          style="display: inline-flex; align-items: center; margin-left: auto; gap: 8px; width: 40px; justify-content: flex-end; flex-shrink: 0;"
                        >
                          <span
                            style="display: flex; width: 16px; height: 16px;"
                            >${unsafeSVG(launchIcon)}</span
                          >
                          <span
                            style="display: flex; width: 16px; height: 16px;"
                            >${unsafeSVG(starOutlineIcon)}</span
                          >
                        </span>
                      </kyn-header-link>
                      <kyn-header-link href="#" target="_blank">
                        <span
                          style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                          >Inventory Insights (legacy)</span
                        >
                        <span
                          style="display: inline-flex; align-items: center; margin-left: auto; gap: 8px; width: 40px; justify-content: flex-end; flex-shrink: 0;"
                        >
                          <span
                            style="display: flex; width: 16px; height: 16px;"
                            >${unsafeSVG(launchIcon)}</span
                          >
                          <span
                            style="display: flex; width: 16px; height: 16px;"
                            >${unsafeSVG(starOutlineIcon)}</span
                          >
                        </span>
                      </kyn-header-link>
                      <kyn-header-link href="#" target="_blank">
                        <span
                          style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                          >Location Dictionary (legacy)</span
                        >
                        <span
                          style="display: inline-flex; align-items: center; margin-left: auto; gap: 8px; width: 40px; justify-content: flex-end; flex-shrink: 0;"
                        >
                          <span
                            style="display: flex; width: 16px; height: 16px;"
                            >${unsafeSVG(launchIcon)}</span
                          >
                          <span
                            style="display: flex; width: 16px; height: 16px;"
                            >${unsafeSVG(starOutlineIcon)}</span
                          >
                        </span>
                      </kyn-header-link>
                      <kyn-header-link href="#" target="_blank">
                        <span
                          style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                          >Product Dictionary (legacy)</span
                        >
                        <span
                          style="display: inline-flex; align-items: center; margin-left: auto; gap: 8px; width: 40px; justify-content: flex-end; flex-shrink: 0;"
                        >
                          <span
                            style="display: flex; width: 16px; height: 16px;"
                            >${unsafeSVG(launchIcon)}</span
                          >
                          <span
                            style="display: flex; width: 16px; height: 16px;"
                            >${unsafeSVG(starOutlineIcon)}</span
                          >
                        </span>
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span
                          style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                          >Tagging Compliance Report</span
                        >
                        <span
                          style="display: inline-flex; align-items: center; margin-left: auto; width: 40px; justify-content: flex-end; flex-shrink: 0;"
                          ><span
                            style="display: flex; width: 16px; height: 16px;"
                            >${unsafeSVG(starOutlineIcon)}</span
                          ></span
                        >
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span
                          style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                          >Topology</span
                        >
                        <span
                          style="display: inline-flex; align-items: center; margin-left: auto; width: 40px; justify-content: flex-end; flex-shrink: 0;"
                          ><span
                            style="display: flex; width: 16px; height: 16px;"
                            >${unsafeSVG(starOutlineIcon)}</span
                          ></span
                        >
                      </kyn-header-link>
                      <kyn-header-link href="#" target="_blank">
                        <span
                          style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                          >Workstation Inventory (legacy)</span
                        >
                        <span
                          style="display: inline-flex; align-items: center; margin-left: auto; gap: 8px; width: 40px; justify-content: flex-end; flex-shrink: 0;"
                        >
                          <span
                            style="display: flex; width: 16px; height: 16px;"
                            >${unsafeSVG(launchIcon)}</span
                          >
                          <span
                            style="display: flex; width: 16px; height: 16px;"
                            >${unsafeSVG(starOutlineIcon)}</span
                          >
                        </span>
                      </kyn-header-link>
                    </kyn-header-category>

                    <kyn-header-category heading="Knowledge & AI">
                      <kyn-header-link href="#">
                        <span
                          style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                          >Agentic AI Designer</span
                        >
                        <span
                          style="display: inline-flex; align-items: center; margin-left: auto; width: 40px; justify-content: flex-end; flex-shrink: 0;"
                          ><span
                            style="display: flex; width: 16px; height: 16px;"
                            >${unsafeSVG(starOutlineIcon)}</span
                          ></span
                        >
                      </kyn-header-link>
                      <kyn-header-link href="#" target="_blank">
                        <span
                          style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                          >Artificial Intelligence for IT Operations
                          (legacy)</span
                        >
                        <span
                          style="display: inline-flex; align-items: center; margin-left: auto; gap: 8px; width: 40px; justify-content: flex-end; flex-shrink: 0;"
                        >
                          <span
                            style="display: flex; width: 16px; height: 16px;"
                            >${unsafeSVG(launchIcon)}</span
                          >
                          <span
                            style="display: flex; width: 16px; height: 16px;"
                            >${unsafeSVG(starOutlineIcon)}</span
                          >
                        </span>
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span
                          style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                          >Bridge AI Assist Configuration</span
                        >
                        <span
                          style="display: inline-flex; align-items: center; margin-left: auto; width: 40px; justify-content: flex-end; flex-shrink: 0;"
                          ><span
                            style="display: flex; width: 16px; height: 16px;"
                            >${unsafeSVG(starOutlineIcon)}</span
                          ></span
                        >
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span
                          style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                          >Knowledge Foundation</span
                        >
                        <span
                          style="display: inline-flex; align-items: center; margin-left: auto; width: 40px; justify-content: flex-end; flex-shrink: 0;"
                          ><span
                            style="display: flex; width: 16px; height: 16px;"
                            >${unsafeSVG(starOutlineIcon)}</span
                          ></span
                        >
                      </kyn-header-link>
                    </kyn-header-category>
                  </div>

                  <!-- RIGHT COLUMN -->
                  <div
                    style="display: flex; flex-direction: column; gap: 8px; flex: 1; min-width: 0;"
                  >
                    <kyn-header-category
                      heading="Provisioning Orchestration & Automation"
                    >
                      <kyn-header-link href="#" target="_blank">
                        <span
                          style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                          >Actions (legacy)</span
                        >
                        <span
                          style="display: inline-flex; align-items: center; margin-left: auto; gap: 8px; width: 40px; justify-content: flex-end; flex-shrink: 0;"
                        >
                          <span
                            style="display: flex; width: 16px; height: 16px;"
                            >${unsafeSVG(launchIcon)}</span
                          >
                          <span
                            style="display: flex; width: 16px; height: 16px;"
                            >${unsafeSVG(starOutlineIcon)}</span
                          >
                        </span>
                      </kyn-header-link>
                      <kyn-header-link href="#" target="_blank">
                        <span
                          style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                          >Automation (legacy)</span
                        >
                        <span
                          style="display: inline-flex; align-items: center; margin-left: auto; gap: 8px; width: 40px; justify-content: flex-end; flex-shrink: 0;"
                        >
                          <span
                            style="display: flex; width: 16px; height: 16px;"
                            >${unsafeSVG(launchIcon)}</span
                          >
                          <span
                            style="display: flex; width: 16px; height: 16px;"
                            >${unsafeSVG(starOutlineIcon)}</span
                          >
                        </span>
                      </kyn-header-link>
                      <kyn-header-link href="#" target="_blank">
                        <span
                          style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                          >Scheduler (legacy)</span
                        >
                        <span
                          style="display: inline-flex; align-items: center; margin-left: auto; gap: 8px; width: 40px; justify-content: flex-end; flex-shrink: 0;"
                        >
                          <span
                            style="display: flex; width: 16px; height: 16px;"
                            >${unsafeSVG(launchIcon)}</span
                          >
                          <span
                            style="display: flex; width: 16px; height: 16px;"
                            >${unsafeSVG(starOutlineIcon)}</span
                          >
                        </span>
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span
                          style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                          >Workflow Executions</span
                        >
                        <span
                          style="display: inline-flex; align-items: center; margin-left: auto; width: 40px; justify-content: flex-end; flex-shrink: 0;"
                          ><span
                            style="display: flex; width: 16px; height: 16px;"
                            >${unsafeSVG(starOutlineIcon)}</span
                          ></span
                        >
                      </kyn-header-link>
                    </kyn-header-category>

                    <kyn-header-category heading="Toolchain & Pipeline">
                      <kyn-header-link href="#">
                        <span
                          style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                          >DevOps Intelligence</span
                        >
                        <span
                          style="display: inline-flex; align-items: center; justify-content: center; margin-left: auto; width: 16px; height: 16px; flex-shrink: 0;"
                          >${unsafeSVG(starOutlineIcon)}</span
                        >
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span
                          style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                          >Machine Learning Operations Pipeline</span
                        >
                        <span
                          style="display: inline-flex; align-items: center; justify-content: center; margin-left: auto; width: 16px; height: 16px; flex-shrink: 0;"
                          >${unsafeSVG(starOutlineIcon)}</span
                        >
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span
                          style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                          >Tool Chain Management</span
                        >
                        <span
                          style="display: inline-flex; align-items: center; justify-content: center; margin-left: auto; width: 16px; height: 16px; flex-shrink: 0;"
                          >${unsafeSVG(starOutlineIcon)}</span
                        >
                      </kyn-header-link>
                    </kyn-header-category>
                  </div>
                </div>
              </kyn-tab-panel>
            </kyn-tabs>
          </kyn-header-link>

          <!-- CATALOGS -->
          <kyn-header-link href="javascript:void(0)" hideSearch>
            <span>${unsafeSVG(catalogIcon)}</span>
            Catalogs

            <kyn-header-category slot="links">
              <kyn-header-link href="#">
                <span
                  style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                  >Bridge Private Catalog</span
                >
                <span
                  style="display: inline-flex; align-items: center; justify-content: center; margin-left: auto; width: 16px; height: 16px; flex-shrink: 0;"
                  >${unsafeSVG(starOutlineIcon)}</span
                >
              </kyn-header-link>
              <kyn-header-link href="#">
                <span
                  style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                  >Bridge Service Catalog</span
                >
                <span
                  style="display: inline-flex; align-items: center; justify-content: center; margin-left: auto; width: 16px; height: 16px; flex-shrink: 0;"
                  >${unsafeSVG(starOutlineIcon)}</span
                >
              </kyn-header-link>
              <kyn-header-link href="#">
                <span
                  style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                  >Enablement Catalog</span
                >
                <span
                  style="display: inline-flex; align-items: center; justify-content: center; margin-left: auto; width: 16px; height: 16px; flex-shrink: 0;"
                  >${unsafeSVG(starOutlineIcon)}</span
                >
              </kyn-header-link>
              <kyn-header-link href="#">
                <span
                  style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                  >Orchestration Catalog</span
                >
                <span
                  style="display: inline-flex; align-items: center; justify-content: center; margin-left: auto; width: 16px; height: 16px; flex-shrink: 0;"
                  >${unsafeSVG(starOutlineIcon)}</span
                >
              </kyn-header-link>
            </kyn-header-category>
          </kyn-header-link>

          <!-- ADMINISTRATION -->
          <!-- Two-column layout with explicit column arrangement -->
          <kyn-header-link href="javascript:void(0)" hideSearch>
            <span>${unsafeSVG(adminIcon)}</span>
            Administration

            <div
              slot="links"
              style="display: flex; gap: 32px; padding-top: 12px; width: 100%; max-width: none;"
            >
              <!-- LEFT COLUMN -->
              <div
                style="display: flex; flex-direction: column; gap: 8px; flex: 1; min-width: 0;"
              >
                <!-- ACCESS MANAGEMENT -->
                <kyn-header-category heading="Access Management">
                  <kyn-header-link href="#">
                    <span
                      style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                      >Access Request Management System (ARMS)</span
                    >
                    <span
                      style="display: inline-flex; align-items: center; justify-content: center; margin-left: auto; width: 16px; height: 16px; flex-shrink: 0;"
                      >${unsafeSVG(starOutlineIcon)}</span
                    >
                  </kyn-header-link>
                  <kyn-header-link href="#">
                    <span
                      style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                      >Bridge Access Management</span
                    >
                    <span
                      style="display: inline-flex; align-items: center; justify-content: center; margin-left: auto; width: 16px; height: 16px; flex-shrink: 0;"
                      >${unsafeSVG(starOutlineIcon)}</span
                    >
                  </kyn-header-link>
                  <kyn-header-link href="#">
                    <span
                      style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                      >Service Access Management</span
                    >
                    <span
                      style="display: inline-flex; align-items: center; justify-content: center; margin-left: auto; width: 16px; height: 16px; flex-shrink: 0;"
                      >${unsafeSVG(starOutlineIcon)}</span
                    >
                  </kyn-header-link>
                </kyn-header-category>

                <!-- POLICY SERVICE -->
                <kyn-header-category heading="Policy Service">
                  <kyn-header-link href="#">
                    <span
                      style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                      >Policy Management (Bundles)</span
                    >
                    <span
                      style="display: inline-flex; align-items: center; justify-content: center; margin-left: auto; width: 16px; height: 16px; flex-shrink: 0;"
                      >${unsafeSVG(starOutlineIcon)}</span
                    >
                  </kyn-header-link>
                </kyn-header-category>

                <!-- PROVISIONING ORCHESTRATION & ADMINISTRATION -->
                <kyn-header-category
                  heading="Provisioning Orchestration & Administration"
                >
                  <kyn-header-link href="#">
                    <span
                      style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                      >Orchestration Administration</span
                    >
                    <span
                      style="display: inline-flex; align-items: center; justify-content: center; margin-left: auto; width: 16px; height: 16px; flex-shrink: 0;"
                      >${unsafeSVG(starOutlineIcon)}</span
                    >
                  </kyn-header-link>
                </kyn-header-category>
              </div>

              <!-- RIGHT COLUMN -->
              <div
                style="display: flex; flex-direction: column; gap: 8px; flex: 1; min-width: 0;"
              >
                <!-- SERVICE OPERATIONS -->
                <kyn-header-category heading="Service Operations">
                  <kyn-header-link href="#">
                    <span
                      style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                      >Auditing</span
                    >
                    <span
                      style="display: inline-flex; align-items: center; margin-left: auto; width: 40px; justify-content: flex-end; flex-shrink: 0;"
                      ><span style="display: flex; width: 16px; height: 16px;"
                        >${unsafeSVG(starOutlineIcon)}</span
                      ></span
                    >
                  </kyn-header-link>
                  <kyn-header-link href="#">
                    <span
                      style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                      >Connections Management</span
                    >
                    <span
                      style="display: inline-flex; align-items: center; margin-left: auto; width: 40px; justify-content: flex-end; flex-shrink: 0;"
                      ><span style="display: flex; width: 16px; height: 16px;"
                        >${unsafeSVG(starOutlineIcon)}</span
                      ></span
                    >
                  </kyn-header-link>
                  <kyn-header-link href="#">
                    <span
                      style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                      >Logging & Monitoring</span
                    >
                    <span
                      style="display: inline-flex; align-items: center; margin-left: auto; width: 40px; justify-content: flex-end; flex-shrink: 0;"
                      ><span style="display: flex; width: 16px; height: 16px;"
                        >${unsafeSVG(starOutlineIcon)}</span
                      ></span
                    >
                  </kyn-header-link>
                  <kyn-header-link href="#" target="_blank">
                    <span
                      style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                      >Sunrise Insights Administration (legacy)</span
                    >
                    <span
                      style="display: inline-flex; align-items: center; margin-left: auto; gap: 8px; width: 40px; justify-content: flex-end; flex-shrink: 0;"
                    >
                      <span style="display: flex; width: 16px; height: 16px;"
                        >${unsafeSVG(launchIcon)}</span
                      >
                      <span style="display: flex; width: 16px; height: 16px;"
                        >${unsafeSVG(starOutlineIcon)}</span
                      >
                    </span>
                  </kyn-header-link>
                </kyn-header-category>

                <!-- TAG MANAGEMENT -->
                <kyn-header-category heading="Tag Management">
                  <kyn-header-link href="#" target="_blank">
                    <span
                      style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                      >AIOps Tagging (legacy)</span
                    >
                    <span
                      style="display: inline-flex; align-items: center; margin-left: auto; gap: 8px; width: 40px; justify-content: flex-end; flex-shrink: 0;"
                    >
                      <span style="display: flex; width: 16px; height: 16px;"
                        >${unsafeSVG(launchIcon)}</span
                      >
                      <span style="display: flex; width: 16px; height: 16px;"
                        >${unsafeSVG(starOutlineIcon)}</span
                      >
                    </span>
                  </kyn-header-link>
                  <kyn-header-link href="#">
                    <span
                      style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: left;"
                      >Bridge Tag Management</span
                    >
                    <span
                      style="display: inline-flex; align-items: center; margin-left: auto; width: 40px; justify-content: flex-end; flex-shrink: 0;"
                      ><span style="display: flex; width: 16px; height: 16px;"
                        >${unsafeSVG(starOutlineIcon)}</span
                      ></span
                    >
                  </kyn-header-link>
                </kyn-header-category>
              </div>
            </div>
          </kyn-header-link>
        </kyn-header-nav>
      </kyn-header>
    `;
  },
};
