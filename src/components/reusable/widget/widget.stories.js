import { html } from 'lit';
import './index';
import { action } from '@storybook/addon-actions';
import 'gridstack/dist/gridstack.min.css';
import { GridStack } from 'gridstack';

import '@kyndryl-design-system/shidoka-foundation/components/button';
import '@kyndryl-design-system/shidoka-foundation/components/icon';
import '@kyndryl-design-system/shidoka-charts/components/chart';
import '../overflowMenu';

import settingsIcon from '@carbon/icons/es/settings/16';

export default {
  title: 'Components/Widget',
  component: 'kyn-widget',
  subcomponents: {
    'kyn-widget-drag-handle': 'kyn-widget-drag-handle',
  },
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
    a11y: {
      // disable violations flagged in chartjs-plugin-a11y-legend
      config: {
        rules: [
          {
            id: 'aria-toggle-field-name',
            enabled: false,
          },
          {
            id: 'aria-required-parent',
            enabled: false,
          },
        ],
      },
    },
  },
};

const args = {
  widgetTitle: 'Widget Title',
  subTitle: 'Subtitle',
};

export const Widget = {
  args,
  render: (args) => {
    return html`
      <div style="display: flex; max-width: 500px; min-height: 200px;">
        <div style="flex-grow: 1;">
          <kyn-widget widgetTitle=${args.widgetTitle} subTitle=${args.subTitle}>
            Widget Content
          </kyn-widget>
        </div>
      </div>
    `;
  },
};

export const WithActions = {
  args,
  render: (args) => {
    return html`
      <div style="display: flex; max-width: 500px; min-height: 200px;">
        <div style="flex-grow: 1;">
          <kyn-widget widgetTitle=${args.widgetTitle} subTitle=${args.subTitle}>
            <kd-button
              slot="actions"
              kind="tertiary"
              size="small"
              description="Settings"
            >
              <kd-icon slot="icon" .icon=${settingsIcon}></kd-icon>
            </kd-button>

            <kyn-overflow-menu slot="actions" anchorRight verticalDots>
              <kyn-overflow-menu-item>Option 1</kyn-overflow-menu-item>
              <kyn-overflow-menu-item>Option 2</kyn-overflow-menu-item>
            </kyn-overflow-menu>

            Widget Content
          </kyn-widget>
        </div>
      </div>
    `;
  },
};

export const WithChart = {
  args,
  render: (args) => {
    return html`
      <div style="max-width: 500px;">
        <kyn-widget>
          <kd-chart
            type="bar"
            chartTitle=${args.widgetTitle}
            description=${args.subTitle}
            .labels=${['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange']}
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
    `;
  },
};

export const StaticGrid = {
  render: () => {
    return html`
      This example uses
      <a
        href="https://kyndryl-design-system.github.io/shidoka-foundation/?path=/docs/foundation-grid--docs"
        target="_blank"
        rel="noopener"
        >Shidoka Foundation Grid</a
      >
      for a static dashboard layout.
      <br /><br />

      <div class="kd-grid">
        <div class="kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-3">
          <kyn-widget widgetTitle="Widget"> Widget Content </kyn-widget>
        </div>

        <div class="kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-3">
          <kyn-widget widgetTitle="Widget">
            Widget Content
            <br />
            Widget Content
            <br />
            Widget Content
          </kyn-widget>
        </div>

        <div class="kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-3">
          <kyn-widget widgetTitle="Widget">
            Widget Content
            <br />
            Widget Content
          </kyn-widget>
        </div>

        <div class="kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-3">
          <kyn-widget widgetTitle="Widget"> Widget Content </kyn-widget>
        </div>
      </div>

      <div class="kd-grid" style="margin-top: 32px;">
        <div class="kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-8">
          <kyn-widget widgetTitle="Widget"> Widget Content </kyn-widget>
        </div>

        <div class="kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-4">
          <div class="kd-grid">
            <div
              class="kd-grid__col--sm-2 kd-grid__col--md-4 kd-grid__col--lg-6"
            >
              <kyn-widget widgetTitle="Widget"> Widget Content </kyn-widget>
            </div>

            <div
              class="kd-grid__col--sm-2 kd-grid__col--md-4 kd-grid__col--lg-6"
            >
              <kyn-widget widgetTitle="Widget"> Widget Content </kyn-widget>
            </div>
            <div
              class="kd-grid__col--sm-2 kd-grid__col--md-4 kd-grid__col--lg-6"
            >
              <kyn-widget widgetTitle="Widget"> Widget Content </kyn-widget>
            </div>
            <div
              class="kd-grid__col--sm-2 kd-grid__col--md-4 kd-grid__col--lg-6"
            >
              <kyn-widget widgetTitle="Widget"> Widget Content </kyn-widget>
            </div>
          </div>
        </div>
      </div>

      <div class="kd-grid" style="margin-top: 32px;">
        <div class="kd-grid__col--sm-4 kd-grid__col--md-8 kd-grid__col--lg-12">
          <kyn-widget widgetTitle="Widget"> Widget Content </kyn-widget>
        </div>
      </div>

      <div class="kd-grid" style="margin-top: 32px;">
        <div class="kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-6">
          <kyn-widget>
            <kd-chart
              type="bar"
              chartTitle="Widget"
              .labels=${['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange']}
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
        <div class="kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-6">
          <kyn-widget>
            <kd-chart
              type="doughnut"
              chartTitle="Widget"
              .labels=${['Blue', 'Red', 'Orange', 'Yellow', 'Green', 'Purple']}
              .datasets=${[
                {
                  label: 'Dataset 1',
                  data: [120, 190, 300, 500, 200, 300],
                },
              ]}
              .options=${{
                aspectRatio: 2,
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
            ></kd-chart>
          </kyn-widget>
        </div>
      </div>
    `;
  },
};

export const Gridstack = {
  decorators: [
    (story) =>
      html`
        <style>
          .grid-stack > .grid-stack-item > .grid-stack-item-content {
            overflow: hidden;
          }
        </style>
        ${story()}
      `,
  ],
  render: () => {
    setTimeout(function () {
      const Grid = GridStack.init({
        handle: 'kyn-widget-drag-handle',
      });

      Grid.on('dragstart', function (e, el) {
        e.target.querySelector('kyn-widget').dragActive = true;
      });

      Grid.on('dragstop', function (e, el) {
        e.target.querySelector('kyn-widget').dragActive = false;
      });
    });

    return html`
      This example uses
      <a href="https://gridstackjs.com/" target="_blank" rel="noopener"
        >Gridstack</a
      >
      for a customizable dashboard layout.
      <br /><br />

      <div class="grid-stack">
        <div class="grid-stack-item" gs-w="3" gs-h="2">
          <div class="grid-stack-item-content">
            <kyn-widget widgetTitle="Widget">
              <kyn-widget-drag-handle></kyn-widget-drag-handle>
              Widget Content
            </kyn-widget>
          </div>
        </div>

        <div class="grid-stack-item" gs-w="3" gs-h="2">
          <div class="grid-stack-item-content">
            <kyn-widget widgetTitle="Widget">
              <kyn-widget-drag-handle></kyn-widget-drag-handle>
              Widget Content
            </kyn-widget>
          </div>
        </div>

        <div class="grid-stack-item" gs-w="3" gs-h="2">
          <div class="grid-stack-item-content">
            <kyn-widget widgetTitle="Widget">
              <kyn-widget-drag-handle></kyn-widget-drag-handle>
              Widget Content
            </kyn-widget>
          </div>
        </div>

        <div class="grid-stack-item" gs-w="3" gs-h="2">
          <div class="grid-stack-item-content">
            <kyn-widget widgetTitle="Widget">
              <kyn-widget-drag-handle></kyn-widget-drag-handle>
              Widget Content
            </kyn-widget>
          </div>
        </div>

        <div class="grid-stack-item" gs-w="8" gs-h="4">
          <div class="grid-stack-item-content">
            <kyn-widget widgetTitle="Widget">
              <kyn-widget-drag-handle></kyn-widget-drag-handle>
              Widget Content
            </kyn-widget>
          </div>
        </div>

        <div class="grid-stack-item" gs-w="2" gs-h="2">
          <div class="grid-stack-item-content">
            <kyn-widget widgetTitle="Widget">
              <kyn-widget-drag-handle></kyn-widget-drag-handle>
              Widget Content
            </kyn-widget>
          </div>
        </div>

        <div class="grid-stack-item" gs-w="2" gs-h="2">
          <div class="grid-stack-item-content">
            <kyn-widget widgetTitle="Widget">
              <kyn-widget-drag-handle></kyn-widget-drag-handle>
              Widget Content
            </kyn-widget>
          </div>
        </div>

        <div class="grid-stack-item" gs-w="2" gs-h="2">
          <div class="grid-stack-item-content">
            <kyn-widget widgetTitle="Widget">
              <kyn-widget-drag-handle></kyn-widget-drag-handle>
              Widget Content
            </kyn-widget>
          </div>
        </div>

        <div class="grid-stack-item" gs-w="2" gs-h="2">
          <div class="grid-stack-item-content">
            <kyn-widget widgetTitle="Widget">
              <kyn-widget-drag-handle></kyn-widget-drag-handle>
              Widget Content
            </kyn-widget>
          </div>
        </div>

        <div class="grid-stack-item" gs-w="12" gs-h="4">
          <div class="grid-stack-item-content">
            <kyn-widget widgetTitle="Widget">
              <kyn-widget-drag-handle></kyn-widget-drag-handle>
              Widget Content
            </kyn-widget>
          </div>
        </div>

        <div class="grid-stack-item" gs-w="6" gs-h="4">
          <div class="grid-stack-item-content">
            <kyn-widget>
              <kd-chart
                type="bar"
                chartTitle="Widget"
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

        <div class="grid-stack-item" gs-w="6" gs-h="4">
          <div class="grid-stack-item-content">
            <kyn-widget>
              <kd-chart
                type="doughnut"
                chartTitle="Widget"
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
                  aspectRatio: 2,
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
      </div>
    `;
  },
};
