import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { html } from 'lit';
import './index';

import '../button';
import '@kyndryl-design-system/shidoka-charts/components/chart';
import '../overflowMenu';

import settingsIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/settings.svg';

export default {
  title: 'Components/Widget',
  component: 'kyn-widget',
  subcomponents: {
    'kyn-widget-drag-handle': 'kyn-widget-drag-handle',
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/CQuDZEeLiuGiALvCWjAKlu/Applications---Component-Library?node-id=10395%3A701&mode=dev',
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
  widgetTitle: 'Widget Title',
  subTitle: 'Subtitle',
  disabled: false,
  dragActive: false,
};

export const Widget = {
  args,
  render: (args) => {
    return html`
      <div style="display: flex; max-width: 500px; min-height: 200px;">
        <div style="flex-grow: 1;">
          <kyn-widget
            widgetTitle=${args.widgetTitle}
            subTitle=${args.subTitle}
            ?disabled=${args.disabled}
            ?dragActive=${args.dragActive}
          >
            <div class="test">Widget Content</div>
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
          <kyn-widget
            widgetTitle=${args.widgetTitle}
            subTitle=${args.subTitle}
            ?disabled=${args.disabled}
            ?dragActive=${args.dragActive}
          >
            <kyn-button
              slot="actions"
              kind="tertiary"
              size="small"
              description="Settings"
              ?disabled=${args.disabled}
            >
              <span slot="icon" style="display:flex"
                >${unsafeSVG(settingsIcon)}</span
              >
            </kyn-button>

            <kyn-overflow-menu
              slot="actions"
              anchorRight
              verticalDots
              ?disabled=${args.disabled}
            >
              <kyn-overflow-menu-item>Option 1</kyn-overflow-menu-item>
              <kyn-overflow-menu-item>Option 2</kyn-overflow-menu-item>
            </kyn-overflow-menu>

            <div class="test">Widget Content</div>
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
        <kyn-widget ?disabled=${args.disabled} ?dragActive=${args.dragActive}>
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
          ></kd-chart>
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
          <kyn-widget widgetTitle="Widget Title" subTitle="Widget Subtitle">
            <div class="test">Widget Content</div>
          </kyn-widget>
        </div>

        <div class="kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-3">
          <kyn-widget widgetTitle="Widget Title" subTitle="Widget Subtitle">
            <div class="test">
              Widget Content
              <br />
              Widget Content
              <br />
              Widget Content
            </div>
          </kyn-widget>
        </div>

        <div class="kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-3">
          <kyn-widget widgetTitle="Widget Title" subTitle="Widget Subtitle">
            <div class="test">
              Widget Content
              <br />
              Widget Content
            </div>
          </kyn-widget>
        </div>

        <div class="kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-3">
          <kyn-widget widgetTitle="Widget Title" subTitle="Widget Subtitle">
            <div class="test">Widget Content</div>
          </kyn-widget>
        </div>
      </div>

      <div class="kd-grid" style="margin-top: 32px;">
        <div class="kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-8">
          <kyn-widget widgetTitle="Widget Title" subTitle="Widget Subtitle">
            <div class="test">Widget Content</div>
          </kyn-widget>
        </div>

        <div class="kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-4">
          <div class="kd-grid">
            <div
              class="kd-grid__col--sm-2 kd-grid__col--md-4 kd-grid__col--lg-6"
            >
              <kyn-widget widgetTitle="Widget Title" subTitle="Widget Subtitle">
                <div class="test">Widget Content</div>
              </kyn-widget>
            </div>

            <div
              class="kd-grid__col--sm-2 kd-grid__col--md-4 kd-grid__col--lg-6"
            >
              <kyn-widget widgetTitle="Widget Title" subTitle="Widget Subtitle">
                <div class="test">Widget Content</div>
              </kyn-widget>
            </div>
            <div
              class="kd-grid__col--sm-2 kd-grid__col--md-4 kd-grid__col--lg-6"
            >
              <kyn-widget widgetTitle="Widget Title" subTitle="Widget Subtitle">
                <div class="test">Widget Content</div>
              </kyn-widget>
            </div>
            <div
              class="kd-grid__col--sm-2 kd-grid__col--md-4 kd-grid__col--lg-6"
            >
              <kyn-widget widgetTitle="Widget Title" subTitle="Widget Subtitle">
                <div class="test">Widget Content</div>
              </kyn-widget>
            </div>
          </div>
        </div>
      </div>

      <div class="kd-grid" style="margin-top: 32px;">
        <div class="kd-grid__col--sm-4 kd-grid__col--md-8 kd-grid__col--lg-12">
          <kyn-widget widgetTitle="Widget Title" subTitle="Widget Subtitle">
            <div class="test">Widget Content</div>
          </kyn-widget>
        </div>
      </div>

      <div class="kd-grid" style="margin-top: 32px;">
        <div class="kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-8">
          <kyn-widget>
            <kd-chart
              type="bar"
              chartTitle="Widget Title"
              description="Widget Subtitle"
              height="400"
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
            ></kd-chart>
          </kyn-widget>
        </div>

        <div class="kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-4">
          <kyn-widget>
            <kd-chart
              type="doughnut"
              chartTitle="Widget Title"
              description="Widget Subtitle"
              height="400"
              .labels=${['Blue', 'Red', 'Orange', 'Yellow', 'Green', 'Purple']}
              .datasets=${[
                {
                  label: 'Dataset 1',
                  data: [120, 190, 300, 500, 200, 300],
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
            ></kd-chart>
          </kyn-widget>
        </div>
      </div>
    `;
  },
};
