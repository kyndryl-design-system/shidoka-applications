import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { html } from 'lit';
import { action } from 'storybook/actions';
import './index';

import '../button';
import '@kyndryl-design-system/shidoka-charts/components/chart';
import '../overflowMenu';

import settingsIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/settings.svg';
import lgCube from '@kyndryl-design-system/shidoka-icons/svg/monochrome/32/cube.svg';
import smCube from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/cube.svg';
import { Badge } from '../badge/badge.stories.js';

export default {
  title: 'Components/Widget',
  component: 'kyn-widget',
  subcomponents: {
    'kyn-widget-drag-handle': 'kyn-widget-drag-handle',
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/9Q2XfTSxfzTXfNe2Bi8KDS/Component-Viewer?node-id=4-423936&p=f&m=dev',
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
        .example {
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--kd-color-background-container-subtle);
          border: 1px dashed var(--kd-color-utility-variant-border);
          height: 100%;
          border-radius: 4px;

          svg {
            height: 52px;
            width: 52px;
          }
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
  selectable: false,
  selected: false,
  compact: false,
  removeHeader: false,
};

const getExampleContent = () => html`
  <div class="example" style="flex-direction: column;">
    <div class="cube-icon" style="color:var(--kd-color-icon-brand);">
      ${unsafeSVG(lgCube)}
    </div>
    <div class="kd-type--ui-01 kd-type--weight-medium">Expansion Slot</div>
    <p class="kd-type--ui-04 kd-type--weight-light">
      Swap this with your own component.
    </p>
  </div>
`;

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
            ?selectable=${args.selectable}
            ?selected=${args.selected}
            ?compact=${args.compact}
            ?removeHeader=${args.removeHeader}
            @on-select=${(e) => action(e.type)({ ...e, detail: e.detail })}
          >
            ${getExampleContent()}
          </kyn-widget>
        </div>
      </div>
    `;
  },
};

export const SelectableWidget = {
  args: {
    ...args,
    selectable: true,
    selected: true,
  },
  parameters: {
    a11y: {
      disable: true,
    },
  },
  render: (args) => {
    return html`
      <div style="display: flex; max-width: 500px; min-height: 200px;">
        <div style="flex-grow: 1;">
          <kyn-widget
            widgetTitle=${args.widgetTitle}
            subTitle=${args.subTitle}
            ?disabled=${args.disabled}
            ?dragActive=${args.dragActive}
            ?selectable=${args.selectable}
            ?selected=${args.selected}
            ?compact=${args.compact}
            ?removeHeader=${args.removeHeader}
            @on-select=${(e) => action(e.type)({ ...e, detail: e.detail })}
          >
            ${getExampleContent()}
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
            ?selectable=${args.selectable}
            ?selected=${args.selected}
            ?compact=${args.compact}
            ?removeHeader=${args.removeHeader}
            @on-select=${(e) => action(e.type)({ ...e, detail: e.detail })}
          >
            <kyn-button
              slot="actions"
              kind="secondary"
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

            ${getExampleContent()}
          </kyn-widget>
        </div>
      </div>
    `;
  },
};

export const WithBadge = {
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
            ?selectable=${args.selectable}
            ?selected=${args.selected}
            ?compact=${args.compact}
            ?removeHeader=${args.removeHeader}
            @on-select=${(e) => action(e.type)({ ...e, detail: e.detail })}
          >
            <div
              slot="actions"
              style="display: flex; align-items: center; gap: 8px;"
            >
              ${Badge.render({
                ...Badge.args,
                label: 'Update',
                status: 'information',
                hideIcon: true,
              })}
            </div>

            <kyn-overflow-menu
              slot="actions"
              anchorRight
              verticalDots
              ?disabled=${args.disabled}
            >
              <kyn-overflow-menu-item>Option 1</kyn-overflow-menu-item>
              <kyn-overflow-menu-item>Option 2</kyn-overflow-menu-item>
            </kyn-overflow-menu>

            ${getExampleContent()}
          </kyn-widget>
        </div>
      </div>
    `;
  },
};

export const WithFooter = {
  args,
  render: (args) => {
    return html`
      <div style="display: flex; max-width: 500px; min-height: 300px;">
        <div style="flex-grow: 1;">
          <kyn-widget
            widgetTitle=${args.widgetTitle}
            subTitle=${args.subTitle}
            ?disabled=${args.disabled}
            ?dragActive=${args.dragActive}
            ?selectable=${args.selectable}
            ?selected=${args.selected}
            ?compact=${args.compact}
            ?removeHeader=${args.removeHeader}
            @on-select=${(e) => action(e.type)({ ...e, detail: e.detail })}
          >
            ${getExampleContent()}

            <kyn-button
              slot="footer"
              kind="secondary"
              size="small"
              style="margin-left: auto;"
            >
              CTA
            </kyn-button>
          </kyn-widget>
        </div>
      </div>

      <br />

      <div style="display: flex; max-width: 500px; min-height: 300px;">
        <div style="flex-grow: 1;">
          <kyn-widget
            widgetTitle=${args.widgetTitle}
            subTitle=${args.subTitle}
            ?disabled=${args.disabled}
            ?dragActive=${args.dragActive}
            ?selectable=${args.selectable}
            ?selected=${args.selected}
            ?compact=${args.compact}
            ?removeHeader=${args.removeHeader}
            @on-select=${(e) => action(e.type)({ ...e, detail: e.detail })}
          >
            ${getExampleContent()}

            <div slot="footer" class="footer-example">
              <div class="cube-icon" style="color:var(--kd-color-icon-brand);">
                ${unsafeSVG(smCube)}
              </div>
              Footer Slot
            </div>

            <kyn-button slot="footer" kind="secondary" size="small">
              CTA
            </kyn-button>
          </kyn-widget>
        </div>
      </div>

      <style>
        .footer-example {
          flex-grow: 1;
          display: flex;
          align-items: center;
          font-size: 16px;
          gap: 4px;
          justify-content: center;
          height: 32px;
          border-radius: 4px;
          font-weight: 500;
          padding: 0 16px;
          background: var(--kd-color-background-container-subtle);
          border: 1px dashed var(--kd-color-utility-variant-border);
        }

        .cube-icon svg {
          display: block;
        }
      </style>
    `;
  },
};

export const WithChart = {
  args,
  render: (args) => {
    return html`
      <div style="max-width: 500px;">
        <kyn-widget
          ?disabled=${args.disabled}
          ?dragActive=${args.dragActive}
          ?selectable=${args.selectable}
          ?selected=${args.selected}
          ?compact=${args.compact}
          ?removeHeader=${args.removeHeader}
          @on-select=${(e) => action(e.type)({ ...e, detail: e.detail })}
        >
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
        href="https://shidoka-foundation.netlify.app/?path=/docs/foundation-grid--docs"
        target="_blank"
        rel="noopener"
      >
        Shidoka Foundation Grid
      </a>
      for a static dashboard layout.
      <br /><br />

      <div class="kd-grid">
        <div class="kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-3">
          <kyn-widget widgetTitle="Widget Title" subTitle="Widget Subtitle">
            <div class="example">Widget Content</div>
          </kyn-widget>
        </div>

        <div class="kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-3">
          <kyn-widget widgetTitle="Widget Title" subTitle="Widget Subtitle">
            <div class="example">
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
            <div class="example">
              Widget Content
              <br />
              Widget Content
            </div>
          </kyn-widget>
        </div>

        <div class="kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-3">
          <kyn-widget widgetTitle="Widget Title" subTitle="Widget Subtitle">
            <div class="example">Widget Content</div>
          </kyn-widget>
        </div>
      </div>

      <div class="kd-grid" style="margin-top: 32px;">
        <div class="kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-8">
          <kyn-widget widgetTitle="Widget Title" subTitle="Widget Subtitle">
            <div class="example">Widget Content</div>
          </kyn-widget>
        </div>

        <div class="kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-4">
          <div class="kd-grid">
            <div
              class="kd-grid__col--sm-2 kd-grid__col--md-4 kd-grid__col--lg-6"
            >
              <kyn-widget widgetTitle="Widget Title" subTitle="Widget Subtitle">
                <div class="example">Widget Content</div>
              </kyn-widget>
            </div>

            <div
              class="kd-grid__col--sm-2 kd-grid__col--md-4 kd-grid__col--lg-6"
            >
              <kyn-widget widgetTitle="Widget Title" subTitle="Widget Subtitle">
                <div class="example">Widget Content</div>
              </kyn-widget>
            </div>
            <div
              class="kd-grid__col--sm-2 kd-grid__col--md-4 kd-grid__col--lg-6"
            >
              <kyn-widget widgetTitle="Widget Title" subTitle="Widget Subtitle">
                <div class="example">Widget Content</div>
              </kyn-widget>
            </div>
            <div
              class="kd-grid__col--sm-2 kd-grid__col--md-4 kd-grid__col--lg-6"
            >
              <kyn-widget widgetTitle="Widget Title" subTitle="Widget Subtitle">
                <div class="example">Widget Content</div>
              </kyn-widget>
            </div>
          </div>
        </div>
      </div>

      <div class="kd-grid" style="margin-top: 32px;">
        <div class="kd-grid__col--sm-4 kd-grid__col--md-8 kd-grid__col--lg-12">
          <kyn-widget widgetTitle="Widget Title" subTitle="Widget Subtitle">
            <div class="example">Widget Content</div>
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
