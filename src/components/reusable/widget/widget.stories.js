import { html } from 'lit';
import './index';
import { action } from '@storybook/addon-actions';

import '@kyndryl-design-system/shidoka-foundation/components/button';
import '@kyndryl-design-system/shidoka-foundation/components/icon';
import '@kyndryl-design-system/shidoka-charts/components/chart';
import '../overflowMenu';

import settingsIcon from '@carbon/icons/es/settings/16';
import closeIcon from '@carbon/icons/es/close/16';

export default {
  title: 'Components/Widget',
  component: 'kyn-widget',
  subcomponents: {
    'kyn-widget-header': 'kyn-widget-header',
  },
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
};

const args = {
  dragHandle: false,
  pill: false,
};

export const Widget = {
  args,
  render: (args) => {
    return html`
      <div style="max-width: 500px;">
        <kyn-widget
          ?dragHandle=${args.dragHandle}
          ?pill=${args.pill}
          @dragstart=${(e) => action(e.type)(e)}
          @dragend=${(e) => action(e.type)(e)}
        >
          <kyn-widget-header widgetTitle="Widget"> </kyn-widget-header>

          Widget Content
        </kyn-widget>
      </div>
    `;
  },
};

export const WithActions = {
  args,
  render: (args) => {
    return html`
      <div style="max-width: 500px;">
        <kyn-widget
          ?dragHandle=${args.dragHandle}
          ?pill=${args.pill}
          @dragstart=${(e) => action(e.type)(e)}
          @dragend=${(e) => action(e.type)(e)}
        >
          <kyn-widget-header widgetTitle="Widget">
            <kd-button kind="tertiary" size="small" description="Settings">
              <kd-icon slot="icon" .icon=${settingsIcon}></kd-icon>
            </kd-button>

            <kyn-overflow-menu anchorRight verticalDots>
              <kyn-overflow-menu-item>Option 1</kyn-overflow-menu-item>
              <kyn-overflow-menu-item>Option 2</kyn-overflow-menu-item>
            </kyn-overflow-menu>

            <kd-button kind="tertiary" size="small" description="Close">
              <kd-icon slot="icon" .icon=${closeIcon}></kd-icon>
            </kd-button>
          </kyn-widget-header>

          Widget Content
        </kyn-widget>
      </div>
    `;
  },
};

export const WithChart = {
  args,
  parameters: {
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
  render: (args) => {
    return html`
      <div style="max-width: 500px;">
        <kyn-widget
          ?dragHandle=${args.dragHandle}
          ?pill=${args.pill}
          @dragstart=${(e) => action(e.type)(e)}
          @dragend=${(e) => action(e.type)(e)}
        >
          <kd-chart
            type="bar"
            noBorder
            chartTitle="Bar Chart"
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

export const GridLayout = {
  args: {},
  render: (args) => {
    return html`
      <div class="kd-grid">
        <div class="kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-4">
          <kyn-widget>
            <kyn-widget-header widgetTitle="Widget"></kyn-widget-header>

            Widget Content
          </kyn-widget>
        </div>
        <div class="kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-4">
          <kyn-widget>
            <kyn-widget-header widgetTitle="Widget"></kyn-widget-header>

            Widget Content
            <br />
            Widget Content
            <br />
            Widget Content
          </kyn-widget>
        </div>
        <div class="kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-4">
          <kyn-widget>
            <kyn-widget-header widgetTitle="Widget"></kyn-widget-header>

            Widget Content
            <br />
            Widget Content
          </kyn-widget>
        </div>
      </div>
    `;
  },
};
