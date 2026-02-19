import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { html } from 'lit';
import { useArgs } from 'storybook/preview-api';

import './';
import '../../reusable/button';
import '../../reusable/search';
import '../../reusable/tabs';

import megaNavConfig from './sampleMegaNavCategories.json';
import circleIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/circle-stroke.svg';
import bridgeLogo from '@kyndryl-design-system/shidoka-foundation/assets/svg/bridge-logo-large.svg';

import './Docs.mdx';

const args = {
  rootUrl: '/',
  appTitle: 'Application',
  autoOpenFlyout: 'default',
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
        <span slot="logo" style="--kyn-header-logo-width: 120px;"
          >${unsafeSVG(bridgeLogo)}</span
        >
        <kyn-header-nav auto-open-flyout=${renderArgs.autoOpenFlyout}>
          <kyn-header-link href="javascript:void(0)">
            <span>${unsafeSVG(circleIcon)}</span>
            Application

            <kyn-tabs tabSize="md" slot="links">
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
                  layout="masonry"
                  maxColumns="4"
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
                  layout="masonry"
                  maxColumns="5"
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

            <kyn-tabs tabSize="md" slot="links">
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
                  layout="masonry"
                  maxColumns="5"
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
                  layout="masonry"
                  maxColumns="5"
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
WithCategorizedNav.storyName = 'JSON Configured Example (masonry layout)';

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
        <span slot="logo" style="--kyn-header-logo-width: 120px;"
          >${unsafeSVG(bridgeLogo)}</span
        >
        <kyn-header-nav auto-open-flyout=${renderArgs.autoOpenFlyout}>
          <kyn-header-link href="javascript:void(0)">
            <span>${unsafeSVG(circleIcon)}</span>
            Application

            <kyn-tabs tabSize="md" slot="links">
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

                <kyn-header-categories layout="grid" maxColumns="5">
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
                <kyn-header-categories layout="grid" maxColumns="5">
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

            <kyn-tabs tabSize="md" slot="links">
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

                <kyn-header-categories layout="grid" maxColumns="5">
                  <!-- APP2 CATEGORY A -->
                  <kyn-header-category heading="App2 Category A">
                    <span slot="icon">${unsafeSVG(circleIcon)}</span>
                    <kyn-header-link href="#">Alpha Link 1</kyn-header-link>
                    <kyn-header-link href="#">Alpha Link 2</kyn-header-link>
                    <kyn-header-link href="#">Alpha Link 3</kyn-header-link>
                  </kyn-header-category>

                  <!-- APP2 CATEGORY B -->
                  <kyn-header-category heading="App2 Category B">
                    <span slot="icon">${unsafeSVG(circleIcon)}</span>
                    <kyn-header-link href="#">Beta Link 1</kyn-header-link>
                    <kyn-header-link href="#">Beta Link 2</kyn-header-link>
                  </kyn-header-category>

                  <!-- APP2 CATEGORY C -->
                  <kyn-header-category heading="App2 Category C">
                    <span slot="icon">${unsafeSVG(circleIcon)}</span>
                    <kyn-header-link href="#">Gamma Link 1</kyn-header-link>
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
                <kyn-header-categories layout="grid" maxColumns="5">
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
WithCategorizedNavManualHtml.storyName = 'Slotted HTML Example (grid layout)';
