import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { Config } from '../../../../common/helpers/gridstack';
import sampleLayout from '../layout.sample';
import { action } from '@storybook/addon-actions';
import '../index';
import '@kyndryl-design-system/shidoka-charts/components/chart';
import Styles from './gridstack.newWidget.scss';

/**
 * New Widget sample.
 */
@customElement('new-widget-sample')
export class NewWidgetSample extends LitElement {
  static override styles = Styles;

  private _handleInit(e: any) {
    e.detail.gridStack.setupDragIn(
      this.shadowRoot?.querySelectorAll('.new-widget'),
      {
        appendTo: 'body',
        helper: 'clone',
      }
    );
  }

  override render() {
    const modifiedConfig = {
      ...Config,
      acceptWidgets: true,
    };

    return html`
      <div style="width: 280px;">
        <div class="grid-stack-item new-widget">
          <div class="grid-stack-item-content">
            <kyn-widget widgetTitle="New Widget" subTitle="Widget Subtitle">
              <kyn-widget-drag-handle></kyn-widget-drag-handle>
              <div class="test">Drag Me</div>
            </kyn-widget>
          </div>
        </div>
      </div>

      <br />
      <hr />
      <br />

      <kyn-widget-gridstack
        .layout=${sampleLayout}
        .gridstackConfig=${modifiedConfig}
        @on-grid-init=${(e: any) => this._handleInit(e)}
        @on-grid-save=${(e: any) => action(e.type)(e)}
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
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'new-widget-sample': NewWidgetSample;
  }
}
