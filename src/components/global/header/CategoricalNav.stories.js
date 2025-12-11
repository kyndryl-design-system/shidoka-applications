import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { html } from 'lit';
import { useArgs } from 'storybook/preview-api';

import './';
import '../../reusable/button';
import '../../reusable/tabs';
import '../../reusable/search';

import megaNavConfig from './sampleMegaNavCategories.json';
import circleIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/circle-stroke.svg';

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

    /** @type {HeaderMegaLinkRenderer} */
    const renderMegaLink = (link, _context) =>
      html`<span>${unsafeSVG(circleIcon)}</span>${link.label}`;

    return html`
      <kyn-header rootUrl=${renderArgs.rootUrl} appTitle=${renderArgs.appTitle}>
        <kyn-header-nav expandActiveMegaOnLoad>
          <div style="padding: 8px 0;">
            <kyn-header-link href="javascript:void(0)">
              <span>${unsafeSVG(circleIcon)}</span>
              Application

              <kyn-tabs tabSize="sm" slot="links">
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
                    linkRenderer=${renderMegaLink}
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
                    linkRenderer=${renderMegaLink}
                    @on-nav-change=${handleMegaChange}
                  ></kyn-header-categories>
                </kyn-tab-panel>
              </kyn-tabs>
            </kyn-header-link>
          </div>

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
WithCategorizedNav.storyName = 'Categorical Nav (JSON-driven)';

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
        <kyn-header-nav expandActiveMegaOnLoad>
          <div style="padding: 8px 0;">
            <kyn-header-link href="javascript:void(0)">
              <span>${unsafeSVG(circleIcon)}</span>
              Application

              <kyn-tabs tabSize="sm" slot="links">
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
                      <kyn-header-link href="#">
                        <span>${unsafeSVG(circleIcon)}</span>
                        Sub Link 1
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span>${unsafeSVG(circleIcon)}</span>
                        Sub Link 2
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span>${unsafeSVG(circleIcon)}</span>
                        Sub Link 3
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span>${unsafeSVG(circleIcon)}</span>
                        Sub Link 4
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span>${unsafeSVG(circleIcon)}</span>
                        Sub Link 5
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span>${unsafeSVG(circleIcon)}</span>
                        Sub Link 6
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span>${unsafeSVG(circleIcon)}</span>
                        Sub Link 7
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span>${unsafeSVG(circleIcon)}</span>
                        Sub Link 8
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span>${unsafeSVG(circleIcon)}</span>
                        Sub Link 9
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span>${unsafeSVG(circleIcon)}</span>
                        Sub Link 10
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span>${unsafeSVG(circleIcon)}</span>
                        Sub Link 11
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span>${unsafeSVG(circleIcon)}</span>
                        Sub Link 12
                      </kyn-header-link>
                    </kyn-header-category>

                    <!-- CATEGORY 2 -->
                    <kyn-header-category heading="Category 2">
                      <kyn-header-link href="#">
                        <span>${unsafeSVG(circleIcon)}</span>
                        Sub Link 1
                      </kyn-header-link>
                    </kyn-header-category>

                    <!-- CATEGORY 3 -->
                    <kyn-header-category heading="Category 3">
                      <kyn-header-link href="#">
                        <span>${unsafeSVG(circleIcon)}</span>
                        Sub Link 1
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span>${unsafeSVG(circleIcon)}</span>
                        Sub Link 2
                      </kyn-header-link>
                    </kyn-header-category>

                    <!-- CATEGORY 4 -->
                    <kyn-header-category heading="Category 4">
                      <kyn-header-link href="#">
                        <span>${unsafeSVG(circleIcon)}</span>
                        Sub Link 1
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span>${unsafeSVG(circleIcon)}</span>
                        Sub Link 2
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span>${unsafeSVG(circleIcon)}</span>
                        Sub Link 3
                      </kyn-header-link>
                    </kyn-header-category>

                    <!-- CATEGORY 5 -->
                    <kyn-header-category heading="Category 5">
                      <kyn-header-link href="#">
                        <span>${unsafeSVG(circleIcon)}</span>
                        Sub Link 1
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span>${unsafeSVG(circleIcon)}</span>
                        Sub Link 2
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span>${unsafeSVG(circleIcon)}</span>
                        Sub Link 3
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span>${unsafeSVG(circleIcon)}</span>
                        Sub Link 4
                      </kyn-header-link>
                    </kyn-header-category>

                    <!-- CATEGORY 6 -->
                    <kyn-header-category heading="Category 6">
                      <kyn-header-link href="#">
                        <span>${unsafeSVG(circleIcon)}</span>
                        Sub Link 1
                      </kyn-header-link>
                    </kyn-header-category>

                    <!-- CATEGORY 7 -->
                    <kyn-header-category heading="Category 7">
                      ${Array.from({ length: 13 }).map(
                        (_, idx) => html`
                          <kyn-header-link href="#">
                            <span>${unsafeSVG(circleIcon)}</span>
                            Sub Link ${idx + 1}
                          </kyn-header-link>
                        `
                      )}
                    </kyn-header-category>

                    <!-- CATEGORY 8 -->
                    <kyn-header-category heading="Category 8">
                      <kyn-header-link href="#">
                        <span>${unsafeSVG(circleIcon)}</span>
                        Sub Link 1
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span>${unsafeSVG(circleIcon)}</span>
                        Sub Link 2
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span>${unsafeSVG(circleIcon)}</span>
                        Sub Link 3
                      </kyn-header-link>
                    </kyn-header-category>

                    <!-- CATEGORY 9 -->
                    <kyn-header-category heading="Category 9">
                      <kyn-header-link href="#">
                        <span>${unsafeSVG(circleIcon)}</span>
                        Sub Link 1
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span>${unsafeSVG(circleIcon)}</span>
                        Sub Link 2
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span>${unsafeSVG(circleIcon)}</span>
                        Sub Link 3
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span>${unsafeSVG(circleIcon)}</span>
                        Sub Link 4
                      </kyn-header-link>
                    </kyn-header-category>

                    <!-- CATEGORY 10 -->
                    <kyn-header-category heading="Category 10">
                      <kyn-header-link href="#">
                        <span>${unsafeSVG(circleIcon)}</span>
                        Sub Link 1
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span>${unsafeSVG(circleIcon)}</span>
                        Sub Link 2
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span>${unsafeSVG(circleIcon)}</span>
                        Sub Link 3
                      </kyn-header-link>
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
                      ${Array.from({ length: 40 }).map(
                        (_, idx) => html`
                          <kyn-header-link href="#">
                            <span>${unsafeSVG(circleIcon)}</span>
                            Sub Link ${idx + 1}
                          </kyn-header-link>
                        `
                      )}
                    </kyn-header-category>

                    <kyn-header-category heading="T2 - Category 2">
                      <kyn-header-link href="#">
                        <span>${unsafeSVG(circleIcon)}</span>
                        Sub Link 1
                      </kyn-header-link>
                    </kyn-header-category>
                  </kyn-header-categories>
                </kyn-tab-panel>
              </kyn-tabs>
            </kyn-header-link>
          </div>

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
WithCategorizedNavManualHtml.storyName = 'Categorical Nav (Slotted)';
