import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import Styles from './gridstack.sample.scss';
import './index';
import { debounce } from '../../../common/helpers/helpers';

import { GridStack } from 'gridstack';

/**
 * Gridstack sample usage.
 */
@customElement('kyn-gridstack-sample')
export class GridstackSample extends LitElement {
  static override styles = [Styles];

  /** Current breakpoint. */
  @state()
  _breakpoint = '';

  /** Widget size and position definitions for each breakpoint. */
  @state()
  _layout: any = {
    default: [
      {
        id: 'w1',
        w: 3,
        h: 2,
        x: 0,
        y: 0,
        minW: 2,
        minH: 2,
      },
      {
        id: 'w2',
        w: 3,
        h: 2,
        x: 3,
        y: 0,
        minW: 2,
        minH: 2,
      },
      {
        id: 'w3',
        w: 3,
        h: 2,
        x: 6,
        y: 0,
        minW: 2,
        minH: 2,
      },
      {
        id: 'w4',
        w: 3,
        h: 2,
        x: 9,
        y: 0,
        minW: 2,
        minH: 2,
      },
      {
        id: 'w5',
        w: 8,
        h: 4,
        x: 0,
        y: 2,
        minW: 4,
        minH: 2,
      },
      {
        id: 'w6',
        w: 2,
        h: 2,
        x: 8,
        y: 2,
        minW: 2,
        minH: 2,
      },
      {
        id: 'w7',
        w: 2,
        h: 2,
        x: 10,
        y: 2,
        minW: 2,
        minH: 2,
      },
      {
        id: 'w8',
        w: 2,
        h: 2,
        x: 8,
        y: 4,
        minW: 2,
        minH: 2,
      },
      {
        id: 'w9',
        w: 2,
        h: 2,
        x: 10,
        y: 4,
        minW: 2,
        minH: 2,
      },
      {
        id: 'w10',
        w: 12,
        h: 3,
        x: 0,
        y: 19,
        minW: 4,
        minH: 2,
      },
      {
        id: 'w11',
        w: 8,
        h: 4,
        x: 0,
        y: 22,
        minW: 4,
        minH: 4,
      },
      {
        id: 'w12',
        w: 4,
        h: 4,
        x: 8,
        y: 22,
        minW: 4,
        minH: 4,
      },
    ],
    md: [
      {
        id: 'w1',
        w: 4,
        h: 3,
        x: 0,
        y: 0,
        minW: 2,
        minH: 2,
      },
      {
        id: 'w2',
        w: 4,
        h: 3,
        x: 4,
        y: 0,
        minW: 2,
        minH: 2,
      },
      {
        id: 'w3',
        w: 4,
        h: 3,
        x: 0,
        y: 3,
        minW: 2,
        minH: 2,
      },
      {
        id: 'w4',
        w: 4,
        h: 3,
        x: 4,
        y: 3,
        minW: 2,
        minH: 2,
      },
      {
        id: 'w5',
        w: 4,
        h: 4,
        x: 0,
        y: 6,
        minW: 4,
        minH: 2,
      },
      {
        id: 'w6',
        w: 2,
        h: 2,
        x: 4,
        y: 6,
        minW: 2,
        minH: 2,
      },
      {
        id: 'w7',
        w: 2,
        h: 2,
        x: 6,
        y: 6,
        minW: 2,
        minH: 2,
      },
      {
        id: 'w8',
        w: 2,
        h: 2,
        x: 4,
        y: 8,
        minW: 2,
        minH: 2,
      },
      {
        id: 'w9',
        w: 2,
        h: 2,
        x: 6,
        y: 8,
        minW: 2,
        minH: 2,
      },
      {
        id: 'w10',
        w: 8,
        h: 2,
        x: 0,
        y: 10,
        minW: 4,
        minH: 2,
      },
      {
        id: 'w11',
        w: 4,
        h: 4,
        x: 0,
        y: 12,
        minW: 4,
        minH: 4,
      },
      {
        id: 'w12',
        w: 4,
        h: 4,
        x: 4,
        y: 12,
        minW: 4,
        minH: 4,
      },
    ],
    sm: [
      {
        id: 'w1',
        w: 4,
        h: 3,
        x: 0,
        y: 0,
        minW: 2,
        minH: 2,
      },
      {
        id: 'w2',
        w: 4,
        h: 3,
        x: 0,
        y: 3,
        minW: 2,
        minH: 2,
      },
      {
        id: 'w3',
        w: 4,
        h: 3,
        x: 0,
        y: 6,
        minW: 2,
        minH: 2,
      },
      {
        id: 'w4',
        w: 4,
        h: 3,
        x: 0,
        y: 9,
        minW: 2,
        minH: 2,
      },
      {
        id: 'w5',
        w: 4,
        h: 3,
        x: 0,
        y: 12,
        minW: 4,
        minH: 2,
      },
      {
        id: 'w6',
        w: 2,
        h: 2,
        x: 0,
        y: 15,
        minW: 2,
        minH: 2,
      },
      {
        id: 'w7',
        w: 2,
        h: 2,
        x: 2,
        y: 15,
        minW: 2,
        minH: 2,
      },
      {
        id: 'w8',
        w: 2,
        h: 2,
        x: 0,
        y: 17,
        minW: 2,
        minH: 2,
      },
      {
        id: 'w9',
        w: 2,
        h: 2,
        x: 2,
        y: 17,
        minW: 2,
        minH: 2,
      },
      {
        id: 'w10',
        w: 3,
        h: 2,
        x: 0,
        y: 19,
        minW: 4,
        minH: 2,
      },
      {
        id: 'w11',
        w: 4,
        h: 4,
        x: 0,
        y: 21,
        minW: 4,
        minH: 4,
      },
      {
        id: 'w12',
        w: 4,
        h: 4,
        x: 0,
        y: 25,
        minW: 4,
        minH: 4,
      },
    ],
  };

  /** GridStack instance. */
  @state()
  _grid: any;

  override render() {
    return html`
      <div class="grid-wrapper">
        <div class="grid-stack">
          <div id="w1" class="grid-stack-item">
            <div class="grid-stack-item-content">
              <kyn-widget widgetTitle="Widget Title" subTitle="Widget Subtitle">
                <kyn-widget-drag-handle></kyn-widget-drag-handle>
                Widget Content
              </kyn-widget>
            </div>
          </div>

          <div id="w2" class="grid-stack-item">
            <div class="grid-stack-item-content">
              <kyn-widget widgetTitle="Widget Title" subTitle="Widget Subtitle">
                <kyn-widget-drag-handle></kyn-widget-drag-handle>
                Widget Content
              </kyn-widget>
            </div>
          </div>

          <div id="w3" class="grid-stack-item">
            <div class="grid-stack-item-content">
              <kyn-widget widgetTitle="Widget Title" subTitle="Widget Subtitle">
                <kyn-widget-drag-handle></kyn-widget-drag-handle>
                Widget Content
              </kyn-widget>
            </div>
          </div>

          <div id="w4" class="grid-stack-item">
            <div class="grid-stack-item-content">
              <kyn-widget widgetTitle="Widget Title" subTitle="Widget Subtitle">
                <kyn-widget-drag-handle></kyn-widget-drag-handle>
                Widget Content
              </kyn-widget>
            </div>
          </div>

          <div id="w5" class="grid-stack-item">
            <div class="grid-stack-item-content">
              <kyn-widget widgetTitle="Widget Title" subTitle="Widget Subtitle">
                <kyn-widget-drag-handle></kyn-widget-drag-handle>
                Widget Content
              </kyn-widget>
            </div>
          </div>

          <div id="w6" class="grid-stack-item">
            <div class="grid-stack-item-content">
              <kyn-widget widgetTitle="Widget Title" subTitle="Widget Subtitle">
                <kyn-widget-drag-handle></kyn-widget-drag-handle>
                Widget Content
              </kyn-widget>
            </div>
          </div>

          <div id="w7" class="grid-stack-item">
            <div class="grid-stack-item-content">
              <kyn-widget widgetTitle="Widget Title" subTitle="Widget Subtitle">
                <kyn-widget-drag-handle></kyn-widget-drag-handle>
                Widget Content
              </kyn-widget>
            </div>
          </div>

          <div id="w8" class="grid-stack-item">
            <div class="grid-stack-item-content">
              <kyn-widget widgetTitle="Widget Title" subTitle="Widget Subtitle">
                <kyn-widget-drag-handle></kyn-widget-drag-handle>
                Widget Content
              </kyn-widget>
            </div>
          </div>

          <div id="w9" class="grid-stack-item">
            <div class="grid-stack-item-content">
              <kyn-widget widgetTitle="Widget Title" subTitle="Widget Subtitle">
                <kyn-widget-drag-handle></kyn-widget-drag-handle>
                Widget Content
              </kyn-widget>
            </div>
          </div>

          <div id="w10" class="grid-stack-item">
            <div class="grid-stack-item-content">
              <kyn-widget widgetTitle="Widget Title" subTitle="Widget Subtitle">
                <kyn-widget-drag-handle></kyn-widget-drag-handle>
                Widget Content
              </kyn-widget>
            </div>
          </div>

          <div id="w11" class="grid-stack-item">
            <div class="grid-stack-item-content">
              <kyn-widget>
                <kd-chart
                  type="bar"
                  chartTitle="Widget Title"
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

          <div id="w12" class="grid-stack-item">
            <div class="grid-stack-item-content">
              <kyn-widget>
                <kd-chart
                  type="doughnut"
                  chartTitle="Widget Title"
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
        </div>
      </div>
    `;
  }

  override firstUpdated() {
    this._setBreakpoint();

    // initialize the GridStack
    const El: any = this.shadowRoot?.querySelector('.grid-stack');
    this._grid = GridStack.init(
      {
        handle: 'kyn-widget-drag-handle', // set the drag handle
        margin: 16, // 32px gap
        columnOpts: {
          breakpointForWindow: true, // break based on viewport size, not grid size
          breakpoints: [
            { w: 671, c: 4 }, // shidoka-foundation sm breakpoint -1px
            { w: 1183, c: 8 }, // shidoka-foundation md breakpoint -1px
          ],
        },
      },
      El
    );

    // set drag state on widget on dragstart
    this._grid.on('dragstart', function (e: Event, el: HTMLElement) {
      console.log(e);
      const Widget: any = el.querySelector('kyn-widget');
      Widget.dragActive = true;
    });

    // unset drag state on widget on dragstop
    this._grid.on('dragstop', function (e: Event, el: HTMLElement) {
      console.log(e);
      const Widget: any = el.querySelector('kyn-widget');
      Widget.dragActive = false;
    });
  }

  override willUpdate(changedProps: any) {
    if (changedProps.has('_breakpoint') || changedProps.has('_layout')) {
      // update the gridstack size/position of each widget when breakpoint or layout changes
      this._updateWidgets();
    }
  }

  private _updateWidgets() {
    // get widget elements
    const Widgets: any = this.shadowRoot?.querySelectorAll('.grid-stack-item');
    // get layout for current breakpoint
    const Layout = this._layout[this._breakpoint] || this._layout['default'];

    // update each widget
    Widgets.forEach((widgetEl: any) => {
      // get widget options
      const Options = Layout.find((specs: any) => specs.id === widgetEl.id);
      // call gridstack update function
      this._grid.update(widgetEl, Options);
    });
  }

  override connectedCallback() {
    super.connectedCallback();

    window?.addEventListener(
      'resize',
      debounce(() => {
        this._setBreakpoint();
      })
    );
  }

  override disconnectedCallback() {
    window?.removeEventListener(
      'resize',
      debounce(() => {
        this._setBreakpoint();
      })
    );

    super.disconnectedCallback();
  }

  private _setBreakpoint() {
    // get and set current breakpoint variable
    this._breakpoint = getComputedStyle(
      document.documentElement
    ).getPropertyValue('--kd-current-breakpoint');
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-gridstack-sample': GridstackSample;
  }
}
