import { html } from 'lit';
import './index';
import './sample/gridstack.newWidget.sample';
import { Config } from '../../../common/helpers/gridstack';
import sampleLayout from './layout.sample';
import { action } from '@storybook/addon-actions';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';

import arrowsVerticalIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/arrows-vertical.svg';
import arrowDownIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/arrow-down.svg';
import arrowUpIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/arrow-up.svg';
import recommendFilledIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/recommend-filled.svg';
import recommendIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/recommend.svg';
import editIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/edit.svg';
import { useArgs } from '@storybook/preview-api';
import { InlineConfirm } from '../inlineConfirm/inlineConfirm.stories';
import '../card';
import '../button';

import '@kyndryl-design-system/shidoka-charts/components/chart';

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
    return arrowDownIcon;
  } else if (index === totalItems - 1) {
    return arrowUpIcon;
  }
  return arrowsVerticalIcon;
};

export const Dashboards = {
  args: {
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
      updateArgs({ items: updatedItems });
      action('re-order')(updatedItems);
    };
    const handleRecommendClick = (e, index) => {
      const updatedItems = [...items].map((item, i) => ({
        ...item,
        favourite: i === index,
      }));
      updateArgs({ items: updatedItems });
      action(e.type)(e);
    };
    return html`
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
                          item.favourite ? recommendFilledIcon : recommendIcon
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
      <style>
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

export const AddWidget = {
  render: () => {
    return html`<new-widget-sample></new-widget-sample>`;
  },
};
