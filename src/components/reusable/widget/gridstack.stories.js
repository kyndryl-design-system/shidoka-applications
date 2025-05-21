import { html } from 'lit';
import './index';
import { Config } from '../../../common/helpers/gridstack';
import sampleLayout from './layout.sample';
import { action } from '@storybook/addon-actions';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { useArgs } from '@storybook/preview-api';

import '@kyndryl-design-system/shidoka-charts/components/chart';
import gridStackLayout from './gridstacklayout.sample.ts';
import rolesIcon from '@kyndryl-design-system/shidoka-icons/svg/duotone/48/roles.svg';
import listIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/list.svg';
import filterIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/filter.svg';

import '../sideDrawer';
import '../button';
import '../tabs';
import '../pagetitle';
import '../card';
import '../inlineConfirm';
import '../overflowMenu';
import '../search';
import '../radioButton';
import '../checkbox';
import '../fileUploader';

import { Dashboards } from './gridStackDashboards.stories.js';
import { Settings } from './gridStackSettings.stories.js';

export default {
  title: 'Components/Widget/Gridstack',
  component: 'kyn-widget-gridstack',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/CQuDZEeLiuGiALvCWjAKlu/Applications---Component-Library?node-id=10395%3A701&mode=dev',
    },
    a11y: {
      disable: true,
    },
  },
  decorators: [
    (story) => html`
      <style>
        .test {
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--kd-color-background-container-soft);
          height: 100%;
          border-radius: 4px;
        }
      </style>
      ${story()}
    `,
  ],
};

const args = {
  gridstackConfig: Config,
  layout: sampleLayout,
};

export const Gridstack = {
  args,
  render: (args) => {
    return html`
      <kyn-widget-gridstack
        .layout=${args.layout}
        .gridstackConfig=${args.gridstackConfig}
        @on-grid-save=${(e) => action(e.type)(e)}
      >
        <div class="grid-stack">
          ${Array(5)
            .fill(null)
            .map((_, i) => {
              return html`
                <div gs-id="w${i + 1}" class="grid-stack-item">
                  <div class="grid-stack-item-content">
                    <kyn-widget
                      widgetTitle="Widget ${i + 1}"
                      subTitle="Widget Subtitle"
                    >
                      <kyn-widget-drag-handle></kyn-widget-drag-handle>
                      <div class="test">Widget Content</div>
                    </kyn-widget>
                  </div>
                </div>
              `;
            })}

          <div gs-id="w6" class="grid-stack-item">
            <div class="grid-stack-item-content">
              <kyn-widget>
                <kd-chart
                  type="bar"
                  chartTitle="Widget 6"
                  description="Widget Subtitle"
                  hideCaptions
                  .labels=${[
                    'Red',
                    'Blue',
                    'Yellow',
                    'Green',
                    'Purple',
                    'Orange',
                  ]}
                  .datasets=${[
                    {
                      label: 'Dataset 1',
                      data: [12, 19, 3, 5, 2, 3],
                    },
                    {
                      label: 'Dataset 2',
                      data: [8, 15, 7, 9, 6, 13],
                    },
                  ]}
                  .options=${{
                    maintainAspectRatio: false, // disable chart aspect ratio so it scales with widget instead
                    scales: {
                      x: {
                        title: {
                          text: 'Color',
                        },
                      },
                      y: {
                        title: {
                          text: 'Votes',
                        },
                      },
                    },
                  }}
                >
                  <kyn-widget-drag-handle></kyn-widget-drag-handle>
                </kd-chart>
              </kyn-widget>
            </div>
          </div>

          <div gs-id="w7" class="grid-stack-item">
            <div class="grid-stack-item-content">
              <kyn-widget>
                <kd-chart
                  type="doughnut"
                  chartTitle="Widget 7"
                  description="Widget Subtitle"
                  hideCaptions
                  .labels=${[
                    'Blue',
                    'Red',
                    'Orange',
                    'Yellow',
                    'Green',
                    'Purple',
                  ]}
                  .datasets=${[
                    {
                      label: 'Dataset 1',
                      data: [120, 190, 300, 500, 200, 300],
                    },
                  ]}
                  .options=${{
                    maintainAspectRatio: false, // disable chart aspect ratio so it scales with widget instead
                    scales: {
                      x: {
                        title: {
                          text: 'Color',
                        },
                      },
                      y: {
                        title: {
                          text: 'Votes',
                        },
                      },
                    },
                  }}
                >
                  <kyn-widget-drag-handle></kyn-widget-drag-handle>
                </kd-chart>
              </kyn-widget>
            </div>
          </div>

          <div gs-id="w8" class="grid-stack-item">
            <div class="grid-stack-item-content">
              <kyn-widget widgetTitle="Widget 8" subTitle="Widget Subtitle">
                <kyn-widget-drag-handle></kyn-widget-drag-handle>
                <div class="test">Widget Content</div>
              </kyn-widget>
            </div>
          </div>
        </div>
      </kyn-widget-gridstack>
    `;
  },
};

const mockItems = [
  {
    id: 1,
    name: 'My Dashboard',
    favourite: true,
  },
  {
    id: 2,
    name: 'My Dashboard',
    favourite: false,
  },
  {
    id: 3,
    name: 'My Dashboard',
    favourite: false,
  },
  {
    id: 4,
    name: 'My Dashboard',
    favourite: false,
  },
  {
    id: 5,
    name: 'My Dashboard',
    favourite: false,
  },
  {
    id: 6,
    name: 'My Dashboard',
    favourite: false,
  },
  {
    id: 7,
    name: 'My Dashboard',
    favourite: false,
  },
  {
    id: 8,
    name: 'My Dashboard',
    favourite: false,
  },
];

export const AddWidget = {
  args: {
    items: mockItems,
    selectedTabId: 'widgets',
  },
  render: () => {
    const modifiedConfig = {
      ...Config,
      acceptWidgets: true,
    };

    const [{ selectedTabId }, updateArgs] = useArgs();

    const handleInit = (e) => {
      const gridStack = e.detail.gridStack;
      if (!gridStack) return;
      const draggableElements = document.querySelectorAll('.new-widget');
      gridStack.setupDragIn(draggableElements, {
        appendTo: 'body',
        helper: 'clone',
      });
    };

    const handleTabSelected = (e) => {
      updateArgs({ selectedTabId: e.detail.selectedTabId });
    };

    return html`<kyn-side-drawer
        ?open=${false}
        size="standard"
        titleText="Dashboard Manager"
        ?hideFooter=${selectedTabId === 'widgets' ||
        selectedTabId === 'settings'}
        ?hideCancelButton=${true}
        submitBtnText="Add Dashboard"
        noBackdrop
        @on-close=${(e) => action(e.type)(e)}
        @on-open=${(e) => action(e.type)(e)}
      >
        <kyn-button slot="anchor">Add Widget</kyn-button>
        <kyn-tabs
          style="height: 100%;"
          tabSize="sm"
          scrollablePanels
          tabStyle="line"
          @on-change=${handleTabSelected}
        >
          <kyn-tab slot="tabs" id="widgets" selected> Widgets </kyn-tab>
          <kyn-tab slot="tabs" id="dashboards"> Dashboards </kyn-tab>
          <kyn-tab slot="tabs" id="settings"> Settings </kyn-tab>
          <kyn-tab-panel tabId="widgets" visible>
            <div class="dashboard-wrapper">
              <kyn-page-title
                type="tertiary"
                pageTitle="Add widgets to your Dashboard"
                subTitle="Drag widgets to your dashboard. Some widgets have predefined sizing depending on the type of content"
              >
              </kyn-page-title>
              <div class="content-content">
                <kyn-button
                  kind="outline"
                  size="small"
                  description="list"
                  @on-click=${(e) => action(e.type)(e)}
                >
                  <span style="display:flex;" slot="icon"
                    >${unsafeSVG(listIcon)}</span
                  >
                </kyn-button>
                <div class="content-items">
                  <kyn-search
                    name="search"
                    label="Search..."
                    value=""
                    size="sm"
                    expandable
                    expandablesearchbtndescription="Expandable search button"
                  ></kyn-search>
                  <kyn-side-drawer
                    ?open=${false}
                    size="standard"
                    titleText="Dashboard Manager"
                    showSecondaryButton
                    ?hideCancelButton=${true}
                    submitBtnText="Apply(1)"
                    secondaryButtonText="Reset All"
                  >
                    <kyn-button slot="anchor" kind="outline" size="small">
                      <span style="display:flex;" slot="icon"
                        >${unsafeSVG(filterIcon)}</span
                      ></kyn-button
                    >
                    <div class="dashboard-wrapper">
                      <div class="bacground-image">
                        <kyn-page-title
                          type="tertiary"
                          pageTitle="Filter & Sort Results"
                          subTitle=""
                        >
                        </kyn-page-title>
                        <div class="bacground-image">
                          <kyn-radio-button value="1">
                            Alphabetically (A-Z)</kyn-radio-button
                          >
                          <kyn-radio-button value="2">
                            Alphabetically (Z-A)
                          </kyn-radio-button>
                        </div>
                      </div>
                      <div class="bacground-image">
                        <kyn-page-title
                          type="tertiary"
                          pageTitle="Applications"
                          subTitle=""
                        >
                        </kyn-page-title>
                        <div class="bacground-image">
                          <kyn-checkbox value="1">
                            Kyndryl IT Support Services (0)</kyn-checkbox
                          >
                          <kyn-checkbox value="2">
                            Kyndryl Modern Device Management Services
                            (1)</kyn-checkbox
                          >
                          <kyn-checkbox value="3">
                            Common Discovery (0)</kyn-checkbox
                          >
                        </div>
                      </div>
                      <div class="bacground-image">
                        <kyn-page-title
                          type="tertiary"
                          pageTitle="Bundles"
                          subTitle=""
                        >
                        </kyn-page-title>
                        <div class="bacground-image">
                          <kyn-checkbox value="1"
                            >Kyndryl IT Support Services Call Logs
                            (0)</kyn-checkbox
                          >
                          <kyn-checkbox value="2"
                            >Kyndryl Modern Device Management Services
                            (1)</kyn-checkbox
                          >
                        </div>
                      </div>
                    </div>
                  </kyn-side-drawer>
                </div>
              </div>
            </div>
            <div style="display: flex; flex-direction: column;gap: 16px">
              ${Array(5)
                .fill(null)
                .map((_, i) => {
                  const widgetId = `w${i + 3}`;
                  return html`
                    <div class="grid-stack-item new-widget" gs-id="${widgetId}">
                      <div class="grid-stack-item-content">
                        <kyn-widget widgetTitle="New Widget Title" subTitle="">
                          <kyn-widget-drag-handle></kyn-widget-drag-handle>
                          <kyn-overflow-menu
                            class="overflowmenu_hidden"
                            slot="actions"
                            anchorRight
                            verticalDots
                          >
                            <kyn-overflow-menu-item destructive
                              >Delete</kyn-overflow-menu-item
                            >
                          </kyn-overflow-menu>
                          <div class="test widget-content">
                            <span style="display:flex;" slot="icon"
                              >${unsafeSVG(rolesIcon)}</span
                            >
                            <div
                              class="kd-type--ui-01"
                              style="font-weight: 500"
                            >
                              Description text
                            </div>
                          </div>
                        </kyn-widget>
                      </div>
                    </div>
                  `;
                })}
            </div>
          </kyn-tab-panel>
          <kyn-tab-panel tabId="dashboards">
            ${Dashboards.render()}
          </kyn-tab-panel>
          <kyn-tab-panel tabId="settings"> ${Settings.render()} </kyn-tab-panel>
        </kyn-tabs>
      </kyn-side-drawer>

      <br />
      <br />
      <kyn-widget-gridstack
        .layout=${gridStackLayout}
        .gridstackConfig=${modifiedConfig}
        @on-grid-init=${(e) => handleInit(e)}
        @on-grid-save=${(e) => action(e.type)(e)}
      >
        <div class="grid-stack">
          ${Array(2)
            .fill(null)
            .map((_, i) => {
              const widgetId = `w${i + 1}`;
              return html`
                <div gs-id="${widgetId}" class="grid-stack-item">
                  <div class="grid-stack-item-content">
                    <kyn-widget
                      widgetTitle="Widget${i + 1}"
                      subTitle="Widget Subtitle"
                    >
                      <kyn-widget-drag-handle></kyn-widget-drag-handle>
                      <kyn-overflow-menu
                        slot="actions"
                        anchorRight
                        verticalDots
                      >
                        <kyn-overflow-menu-item destructive
                          >Delete</kyn-overflow-menu-item
                        >
                      </kyn-overflow-menu>
                      <div class="test">Widget Content</div>
                    </kyn-widget>
                  </div>
                </div>
              `;
            })}
        </div>
      </kyn-widget-gridstack>
      <style>
        .test {
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--kd-color-background-container-soft);
          height: 100%;
          border-radius: 4px;
        }

        .dashboard-wrapper {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 32px;
          align-self: stretch;
        }
        .content-wrapper {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 16px;
          align-self: stretch;
        }
        .content-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          align-self: stretch;
          margin-bottom: 32px;
        }
        .content-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          align-self: stretch;
        }
        .content-items {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .content-item {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .widget-content {
          display: flex;
          padding: 8px;
          align-items: center;
          gap: 16px;
          align-self: stretch;
          span > svg {
            width: 80px;
            height: 80px;
          }
        }
        .overflowmenu_hidden {
          display: none;
        }
      </style> `;
  },
};
