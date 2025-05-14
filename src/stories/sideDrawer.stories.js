import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { html } from 'lit';
import '../components/reusable/sideDrawer';
import '../components/reusable/tabs';
import '../components/reusable/card';
import '../components/reusable/pagetitle';
import '../components/reusable/button';
import '../components/reusable/widget';
import '@kyndryl-design-system/shidoka-foundation/css/typography.css';
import arrowsVerticalIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/arrows-vertical.svg';
import arrowDownIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/arrow-down.svg';
import arrowUpIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/arrow-up.svg';
import recommendFilledIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/recommend-filled.svg';
import recommendIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/recommend.svg';
import editIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/edit.svg';
import listIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/list.svg';
import filterIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/filter.svg';
import searchIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/search.svg';
import rolesIcon from '@kyndryl-design-system/shidoka-icons/svg/duotone/48/roles.svg';
import { action } from '@storybook/addon-actions';
import { useArgs } from '@storybook/preview-api';
import { InlineConfirm } from '../components/reusable/inlineConfirm/inlineConfirm.stories';

export default {
  title: 'Patterns/Side Drawer',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/VC8A7QxPdskgsXcfw9czLO/2.2-Oreo?node-id=7109-19482&m=dev',
    },
  },
};

const mockData = [
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
const getArrowIcon = (index, totalItems) => {
  if (index === 0) {
    return arrowDownIcon; // Show arrowDownIcon for the first item
  } else if (index === totalItems - 1) {
    return arrowUpIcon; // Show arrowUpIcon for the last item
  }
  return arrowsVerticalIcon; // Show arrowsVerticalIcon for all other items
};

const displayImages = [
  { name: 'Sample_one.png', selected: false },
  { name: 'Sample_two.png', selected: true },
  { name: 'Sample_three.png', selected: false },
];

export const SideDrawer = {
  args: {
    selectedTabId: 'settings',
    items: mockData,
  },
  render: () => {
    const [{ items }, updateArgs] = useArgs();

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
      action('re-order')(updatedItems);
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

    return html`
      <kyn-side-drawer
        ?open=${false}
        size="standard"
        ?hideFooter=${true}
        noBackdrop
        @on-close=${(e) => action(e.type)(e)}
        @on-open=${(e) => action(e.type)(e)}
      >
        <kyn-button slot="anchor">Open Drawer</kyn-button>

        <kyn-tabs
          style="height: 100%;"
          tabSize="sm"
          scrollablePanels
          tabStyle="line"
          @on-change=${(e) =>
            updateArgs({ selectedTabId: e.detail.selectedTabId })}
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
              <div class="content-wrapper">
                ${Array.from({ length: 3 }, (_, i) => {
                  return html`
                    <kyn-widget widgetTitle="Widget Title ${i + 1}">
                      <kyn-widget-drag-handle></kyn-widget-drag-handle>
                      <div class="test widget-content">
                        <span style="display:flex;" slot="icon"
                          >${unsafeSVG(rolesIcon)}</span
                        >
                        <div class="kd-type--ui-01" style="font-weight: 500">
                          Add some description text here
                        </div>
                      </div>
                    </kyn-widget>
                  `;
                })}
              </div>
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
                          ${InlineConfirm.render({
                            destructive: true,
                            anchorText: 'Delete',
                            confirmText: 'Confirm',
                            cancelText: 'Cancel',
                            openRight: false,
                          })}

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

          <kyn-tab-panel tabId="settings">
            <div class="dashboard-wrapper">
              <kyn-page-title
                type="tertiary"
                pageTitle="Settings"
                subTitle="Change Dashboard settings"
              >
              </kyn-page-title>
              <div class="content-wrapper">
                ${displayImages.map((item) => {
                  return html`<img src="${item.name}" alt="${item.name}" /> `;
                })}
              </div>
            </div></kyn-tab-panel
          >
        </kyn-tabs>
      </kyn-side-drawer>
      <style>
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
          flex: 1 0 0;
          align-self: stretch;
          height: 150px;
          span > svg {
            width: 80px;
            height: 80px;
          }
        }
        .star-filled > svg {
          color: var(--kd-color-icon-brand);
        }
      </style>
    `;
  },
};
