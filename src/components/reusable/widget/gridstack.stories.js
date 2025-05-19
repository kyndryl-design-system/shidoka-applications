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
import searchIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/search.svg';
import launchIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/launch.svg';
import arrowsVerticalIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/arrows-vertical.svg';
import arrowDownIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/arrow-down.svg';
import arrowUpIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/arrow-up.svg';
import recommendFilledIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/recommend-filled.svg';
import recommendIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/recommend.svg';
import deleteIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/delete.svg';
import editIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/edit.svg';

import '../sideDrawer';
import '../button';
import '../tabs';
import '../pagetitle';
import '../card';
import '../inlineConfirm';
import '../overflowMenu';

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
    name: 'My Dashboard Test',
    favourite: false,
  },
  {
    id: 3,
    name: 'My Dashboard Test 1',
    favourite: false,
  },
  {
    id: 4,
    name: 'My Dashboard Test 2 ',
    favourite: false,
  },
];

export const AddWidget = {
  args: {
    items: mockItems,
  },
  render: () => {
    const modifiedConfig = {
      ...Config,
      acceptWidgets: true,
    };

    const [{ items }, updateArgs] = useArgs();

    const handleInit = (e) => {
      const gridStack = e.detail.gridStack;
      if (!gridStack) return;
      const draggableElements = document.querySelectorAll('.new-widget');
      gridStack.setupDragIn(draggableElements, {
        appendTo: 'body',
        helper: 'clone',
      });
    };

    const deleteWidget = (widgetId) => {
      const gridstackElement = document.querySelector('kyn-widget-gridstack');
      if (gridstackElement) {
        gridstackElement.removeWidgetById(widgetId);
      } else {
        console.error('kyn-widget-gridstack element not found.');
      }
    };

    const handleReorderClick = (e, index) => {
      const updatedItems = [...items];
      if (index === items.length - 1) {
        const temp = updatedItems[index];
        updatedItems[index] = updatedItems[index - 1];
        updatedItems[index - 1] = temp;
      } else {
        const temp = updatedItems[index];
        updatedItems[index] = updatedItems[index + 1];
        updatedItems[index + 1] = temp;
      }
      updateArgs({
        items: updatedItems,
      });
      action(e.type)(e);
    };

    const handleRecommendClick = (e, index) => {
      const updatedItems = [...items].map((item, i) => ({
        ...item,
        favourite: i === index,
      }));
      updateArgs({
        items: updatedItems,
      });
      action(e.type)(e);
    };

    const getArrowIcon = (i, length) => {
      if (i === 0) {
        return arrowDownIcon;
      } else if (i === length - 1) {
        return arrowUpIcon;
      }
      return arrowsVerticalIcon;
    };
    return html`<kyn-side-drawer
        ?open=${false}
        size="standard"
        titleText="Dashboard Manager"
        ?hideFooter=${true}
        noBackdrop
        @on-close=${(e) => action(e.type)(e)}
        @on-open=${(e) => action(e.type)(e)}
      >
        <kyn-button slot="anchor">+ Widget</kyn-button>
        <kyn-tabs
          style="height: 100%;"
          tabSize="sm"
          scrollablePanels
          tabStyle="line"
          @on-change=${(e) => action(e.type)(e)}
        >
          <kyn-tab slot="tabs" id="widgets" selected> Widgets </kyn-tab>
          <kyn-tab slot="tabs" id="dashboards"> Dashboards </kyn-tab>
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
                  <kyn-button
                    kind="outline"
                    size="small"
                    description="search"
                    @on-click=${(e) => action(e.type)(e)}
                  >
                    <span style="display:flex;" slot="icon"
                      >${unsafeSVG(searchIcon)}</span
                    >
                  </kyn-button>
                  <kyn-button
                    kind="outline"
                    size="small"
                    description="filter"
                    @on-click=${(e) => action(e.type)(e)}
                  >
                    <span style="display:flex;" slot="icon"
                      >${unsafeSVG(filterIcon)}</span
                    >
                  </kyn-button>
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
                        <kyn-widget
                          widgetTitle="New Widget Title ${i + 3}"
                          subTitle=""
                        >
                          <kyn-widget-drag-handle></kyn-widget-drag-handle>
                          <kyn-button
                            slot="actions"
                            kind="tertiary"
                            size="small"
                            description="External link"
                          >
                            <span slot="icon" style="display:flex"
                              >${unsafeSVG(launchIcon)}</span
                            >
                          </kyn-button>
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
            <div class="dashboard-wrapper">
              <kyn-page-title
                type="tertiary"
                pageTitle="Dashboards"
                subTitle="Add, edit, reorder, and select a default dashboard"
              >
              </kyn-page-title>
              <div class="content-wrapper">
                ${items.map((item, i) => {
                  const arrowIcon = getArrowIcon(i, items.length);
                  return html`
                    <kyn-card
                      type="normal"
                      role="article"
                      aria-label="card content"
                      style="width:100%"
                    >
                      <div class="content-container">
                        <div class="content-items">
                          <div class="content-item">
                            <kyn-button
                              kind="ghost"
                              size="small"
                              description="reorder"
                              @on-click=${(e) => handleReorderClick(e, i)}
                            >
                              <span style="display:flex;" slot="icon"
                                >${unsafeSVG(arrowIcon)}</span
                              >
                            </kyn-button>
                            <kyn-button
                              kind="ghost"
                              size="small"
                              description="recommended"
                              @on-click=${(e) => handleRecommendClick(e, i)}
                            >
                              <span
                                class=${item.favourite ? 'star-filled' : ''}
                                style="display:flex;"
                                slot="icon"
                              >
                                ${unsafeSVG(
                                  item.favourite
                                    ? recommendFilledIcon
                                    : recommendIcon
                                )}
                              </span>
                            </kyn-button>
                          </div>
                          <div class="content-items">${item.name}</div>
                        </div>
                        <div class="content-item">
                          <kyn-inline-confirm
                            destructive
                            anchorText="Delete"
                            confirmText="Confirm"
                            cancelText="Cancel"
                            @on-confirm=${(e) => action('on-confirm')(e)}
                          >
                            ${unsafeSVG(deleteIcon)}
                            <span slot="confirmIcon"
                              >${unsafeSVG(deleteIcon)}</span
                            >
                          </kyn-inline-confirm>

                          <kyn-button
                            kind="ghost"
                            size="small"
                            description="edit"
                            @on-click=${(e) => action(e.type)(e)}
                          >
                            <span style="display:flex;" slot="icon"
                              >${unsafeSVG(editIcon)}</span
                            >
                          </kyn-button>
                        </div>
                      </div>
                    </kyn-card>
                  `;
                })}
              </div>
            </div>
          </kyn-tab-panel>
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
                      <kyn-button
                        slot="actions"
                        kind="tertiary"
                        size="small"
                        description="External link"
                      >
                        <span slot="icon" style="display:flex"
                          >${unsafeSVG(launchIcon)}</span
                        >
                      </kyn-button>
                      <kyn-overflow-menu
                        slot="actions"
                        anchorRight
                        verticalDots
                      >
                        <kyn-overflow-menu-item
                          destructive
                          @click=${() => deleteWidget(widgetId)}
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
        .star-filled > svg {
          color: var(--kd-color-icon-brand);
        }
        .overflowmenu_hidden {
          display: none;
        }
      </style> `;
  },
};
