import { html } from 'lit';
import './index';
import './sample/gridstack.newWidget.sample';
import { Config } from '../../../common/helpers/gridstack';
import sampleLayout from './layout.sample';
import { action } from 'storybook/actions';

import '@kyndryl-design-system/shidoka-charts/components/chart';

export default {
  title: 'Components/Widget/Gridstack',
  component: 'kyn-widget-gridstack',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/9Q2XfTSxfzTXfNe2Bi8KDS/Component-Viewer?node-id=4-423936&p=f&t=A5tcETiCf23sAgKK-0',
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
          background: var(--kd-color-background-container-subtle);
          border: 1px dashed var(--kd-color-utility-variant-border);
          height: 100%;
          border-radius: 4px;
        }

        .fake-local-nav {
          display: none;
          position: fixed;
          left: 0;
          top: 0;
          bottom: 0;
          width: var(--kd-local-nav-width);
          background: var(--kd-color-background-menu-state-default);
          box-shadow: var(--kd-elevation-level-2);
        }

        @media (min-width: 42rem) {
          .fake-local-nav {
            display: block;
          }

          .with-local-nav {
            margin-left: 56px;
          }
        }
      </style>
      ${story()}
    `,
  ],
};

const args = {
  gridstackConfig: Config,
  layout: sampleLayout,
  withLocalNav: false,
  compact: false,
  wholeWidgetDraggable: false,
};

export const Gridstack = {
  args,
  render: (args) => {
    return html`
      ${args.withLocalNav ? html`<div class="fake-local-nav"></div>` : ''}
      <div class="${args.withLocalNav ? 'with-local-nav' : ''}">
        <kyn-widget-gridstack
          .layout=${args.layout}
          ?compact=${args.compact}
          ?wholeWidgetDraggable=${args.wholeWidgetDraggable}
          @on-grid-save=${(e) => action(e.type)({ ...e, detail: e.detail })}
          @on-grid-init=${(e) => action(e.type)({ ...e, detail: e.detail })}
        >
          <div class="grid-stack">
            <div gs-id="w1" class="grid-stack-item">
              <div class="grid-stack-item-content">
                <kyn-widget widgetTitle="Widget 1" subTitle="Widget Subtitle">
                  <kyn-widget-drag-handle></kyn-widget-drag-handle>
                  <div class="test">Widget Content</div>
                </kyn-widget>
              </div>
            </div>

            <div gs-id="w2" class="grid-stack-item">
              <div class="grid-stack-item-content">
                <kyn-widget widgetTitle="Widget 2" subTitle="Widget Subtitle">
                  <kyn-widget-drag-handle></kyn-widget-drag-handle>
                  <div class="test">Widget Content</div>
                </kyn-widget>
              </div>
            </div>

            <div gs-id="w3" class="grid-stack-item">
              <div class="grid-stack-item-content">
                <kyn-widget widgetTitle="Widget 3" subTitle="Widget Subtitle">
                  <kyn-widget-drag-handle></kyn-widget-drag-handle>
                  <div class="test">Widget Content</div>
                </kyn-widget>
              </div>
            </div>

            <div gs-id="w4" class="grid-stack-item">
              <div class="grid-stack-item-content">
                <kyn-widget widgetTitle="Widget 4" subTitle="Widget Subtitle">
                  <kyn-widget-drag-handle></kyn-widget-drag-handle>
                  <div class="test">Widget Content</div>
                </kyn-widget>
              </div>
            </div>

            <div gs-id="w5" class="grid-stack-item">
              <div class="grid-stack-item-content">
                <kyn-widget widgetTitle="Widget 5" subTitle="Widget Subtitle">
                  <kyn-widget-drag-handle></kyn-widget-drag-handle>
                  <div class="test">Widget Content</div>
                </kyn-widget>
              </div>
            </div>

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
      </div>
    `;
  },
};

export const AddWidget = {
  args: {
    withLocalNav: false,
  },
  render: (args) => {
    return html`
      ${args.withLocalNav ? html`<div class="fake-local-nav"></div>` : ''}
      <div class="${args.withLocalNav ? 'with-local-nav' : ''}">
        <new-widget-sample
          @on-click=${(e) => action(e.type)({ ...e, detail: e.detail })}
        ></new-widget-sample>
      </div>
    `;
  },
};
