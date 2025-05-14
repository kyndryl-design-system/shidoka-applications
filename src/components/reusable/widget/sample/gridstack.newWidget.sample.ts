import { LitElement, html } from 'lit';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { customElement } from 'lit/decorators.js';
import { Config } from '../../../../common/helpers/gridstack';
import sampleLayout from './layout_new.sample';
import { action } from '@storybook/addon-actions';
import '../index';
import '@kyndryl-design-system/shidoka-charts/components/chart';
import Styles from './gridstack.newWidget.scss';
import '../../sideDrawer';
import '../../button';
import '../../tabs';
import '../../pagetitle';
import rolesIcon from '@kyndryl-design-system/shidoka-icons/svg/duotone/48/roles.svg';
import listIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/list.svg';
import filterIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/filter.svg';
import searchIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/search.svg';
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
      <kyn-side-drawer
        ?open=${false}
        size="standard"
        titleText="Drawer Title"
        ?hideFooter=${true}
        noBackdrop
        @on-close=${(e: any) => action(e.type)(e)}
        @on-open=${(e: any) => action(e.type)(e)}
      >
        <kyn-button slot="anchor">Open Drawer</kyn-button>
        <kyn-tabs
          style="height: 100%;"
          tabSize="sm"
          scrollablePanels
          tabStyle="line"
          @on-change=${(e: any) => action(e.type)(e)}
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
                  @on-click=${(e: any) => action(e.type)(e)}
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
                    @on-click=${(e: any) => action(e.type)(e)}
                  >
                    <span style="display:flex;" slot="icon"
                      >${unsafeSVG(searchIcon)}</span
                    >
                  </kyn-button>
                  <kyn-button
                    kind="outline"
                    size="small"
                    description="filter"
                    @on-click=${(e: any) => action(e.type)(e)}
                  >
                    <span style="display:flex;" slot="icon"
                      >${unsafeSVG(filterIcon)}</span
                    >
                  </kyn-button>
                </div>
              </div>
            </div>
            <div style="display: flex; flex-direction: column;gap: 16px">
              <div class="grid-stack-item new-widget">
                <div class="grid-stack-item-content">
                  <kyn-widget widgetTitle="New Widget Title" subTitle="">
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
                </div>
              </div>
              <div class="grid-stack-item new-widget">
                <div class="grid-stack-item-content">
                  <kyn-widget>
                    <kd-chart
                      type="bar"
                      chartTitle="Widget"
                      description=""
                      hideControls
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
              <div class="grid-stack-item new-widget">
                <div class="grid-stack-item-content">
                  <kyn-widget>
                    <kd-chart
                      type="doughnut"
                      chartTitle="Widget 2"
                      description="Widget Subtitle"
                      hideCaptions
                      hideControls
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
            </div>
          </kyn-tab-panel>
        </kyn-tabs>
      </kyn-side-drawer>

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
