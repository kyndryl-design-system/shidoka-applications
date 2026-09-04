import { html } from 'lit';
import { useArgs } from 'storybook/preview-api';
import './index';
import './sample/gridstack.newWidget.sample';
import { Config } from '../../../common/helpers/gridstack';
import sampleLayout from './layout.sample';
import { action } from 'storybook/actions';
import allData from './../../reusable/table/story-helpers/table-data.json';

import '@kyndryl-design-system/shidoka-charts/components/chart';
import '../../reusable/table';

export default {
  title: 'Components/Layout & Structure/Widget/Gridstack',
  component: 'kyn-widget-gridstack',
  parameters: {
    a11y: {
      disable: true,
    },
  },
  argTypes: {
    localNav: {
      control: { type: 'select' },
      options: ['none', 'collapsed', 'pinned'],
      description: 'Simulate Local Nav presence.',
      table: {
        defaultValue: { summary: false },
      },
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
          left: 8px;
          top: 8px;
          bottom: 8px;
          width: var(--kd-local-nav-width);
          background: var(--kd-color-background-container-default);
          box-shadow: var(--kd-elevation-level-1);
          border-radius: 8px;

          &.pinned {
            width: var(--kd-local-nav-width-expanded);
          }
        }

        @media (min-width: 42rem) {
          .fake-local-nav {
            display: block;
          }

          .with-local-nav {
            margin-left: var(--kd-local-nav-reserved-space);

            &.pinned {
              margin-left: var(--kd-local-nav-expanded-reserved-space);
            }
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
  compact: false,
  wholeWidgetDraggable: false,
  localNav: 'none',
  widget4Value: '1',
};

export const Gridstack = {
  args,
  argTypes: {
    widget4Value: {
      control: { type: 'select' },
      options: ['1', '2', '3', '4'],
      description: 'Selected option for Widget 4 settings dropdown.',
    },
  },
  render: (args) => {
    const [{ widget4Value }, updateArgs] = useArgs();
    const data = allData.slice(0, 5);
    const widget4NotificationCounts = {
      1: 1,
      2: 4,
      3: 9,
      4: 1,
    };
    const widget4NotificationCount =
      widget4NotificationCounts[widget4Value] ?? 3;

    const handleWidget4Change = (e) => {
      updateArgs({ widget4Value: e.detail.value });
      action(e.type)({ ...e, detail: e.detail });
    };

    return html`
      ${args.localNav !== 'none'
        ? html`<div class="fake-local-nav ${args.localNav}"></div>`
        : ''}
      <div
        class="${args.localNav !== 'none'
          ? `with-local-nav ${args.localNav}`
          : ''}"
      >
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
                  <kyn-dropdown
                    slot="actions"
                    size="sm"
                    description="Settings"
                    value=${widget4Value}
                    @on-change=${handleWidget4Change}
                  >
                    <kyn-dropdown-option value="1"
                      >Option 1</kyn-dropdown-option
                    >
                    <kyn-dropdown-option value="2"
                      >Option 2</kyn-dropdown-option
                    >
                    <kyn-dropdown-option value="3"
                      >Option 3</kyn-dropdown-option
                    >
                    <kyn-dropdown-option value="4"
                      >Option 4</kyn-dropdown-option
                    >
                  </kyn-dropdown>
                  <div
                    style="display:flex;flex-direction:column;gap:8px;padding-top:8px"
                  >
                    ${Array.from(
                      { length: widget4NotificationCount },
                      () => html`
                        <kyn-notification>
                          Swap this with your own component. Swap this with your
                          own component. Swap this with your own component. Swap
                          this with your own component. Swap this with your own
                          component. Swap this with your own component.
                        </kyn-notification>
                      `
                    )}
                  </div>
                  <!-- <kyn-table>
                    <kyn-thead>
                      <kyn-tr>
                        <kyn-th>ID</kyn-th>
                        <kyn-th>First Name</kyn-th>
                        <kyn-th>Last Name</kyn-th>
                        <kyn-th>Birthday</kyn-th>
                        <kyn-th .align=${'right'}>Age</kyn-th>
                        <kyn-th>Full Name</kyn-th>
                      </kyn-tr>
                    </kyn-thead>
                    <kyn-tbody>
                      ${data.map(
                    ({
                      id,
                      firstName,
                      lastName,
                      birthday,
                      age,
                    }) => html`<kyn-tr>
                      <kyn-td>${id}</kyn-td>
                      <kyn-td>${firstName}</kyn-td>
                      <kyn-td>${lastName}</kyn-td>
                      <kyn-td>${birthday}</kyn-td>
                      <kyn-td .align=${'right'}>${age}</kyn-td>
                      <kyn-td>${firstName} ${lastName}</kyn-td>
                    </kyn-tr>`
                  )}
                    </kyn-tbody>
                  </kyn-table> -->
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
    localNav: 'none',
  },
  render: (args) => {
    return html`
      ${args.localNav !== 'none'
        ? html`<div class="fake-local-nav ${args.localNav}"></div>`
        : ''}
      <div
        class="${args.localNav !== 'none'
          ? `with-local-nav ${args.localNav}`
          : ''}"
      >
        <new-widget-sample
          @on-click=${(e) => action(e.type)({ ...e, detail: e.detail })}
        ></new-widget-sample>
      </div>

      <br /><br />
      <a
        href="https://github.com/kyndryl-design-system/shidoka-applications/tree/main/src/components/reusable/widget/sample/gridstack.newWidget.sample.ts"
        target="_blank"
        rel="noopener"
      >
        See the full example component code here.
      </a>
    `;
  },
};
