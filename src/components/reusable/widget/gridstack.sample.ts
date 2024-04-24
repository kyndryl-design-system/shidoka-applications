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
    w1: {
      sizes: {
        default: { w: 3, h: 2, x: 0, y: 0 },
        md: { w: 4, h: 3, x: 0, y: 0 },
        sm: { w: 4, h: 3, x: 0, y: 0 },
      },
    },
    w2: {
      sizes: {
        default: { w: 3, h: 2, x: 3, y: 0 },
        md: { w: 4, h: 3, x: 4, y: 0 },
        sm: { w: 4, h: 3, x: 0, y: 3 },
      },
    },
    w3: {
      sizes: {
        default: { w: 3, h: 2, x: 6, y: 0 },
        md: { w: 4, h: 3, x: 0, y: 3 },
        sm: { w: 4, h: 3, x: 0, y: 6 },
      },
    },
    w4: {
      sizes: {
        default: { w: 3, h: 2, x: 9, y: 0 },
        md: { w: 4, h: 3, x: 4, y: 3 },
        sm: { w: 4, h: 3, x: 0, y: 9 },
      },
    },
    w5: {
      sizes: {
        default: { w: 8, h: 4, x: 0, y: 2 },
        md: { w: 4, h: 4, x: 0, y: 6 },
        sm: { w: 4, h: 3, x: 0, y: 12 },
      },
    },
    w6: {
      sizes: {
        default: { w: 2, h: 2, x: 8, y: 2 },
        md: { w: 2, h: 2, x: 4, y: 6 },
        sm: { w: 2, h: 2, x: 0, y: 15 },
      },
    },
    w7: {
      sizes: {
        default: { w: 2, h: 2, x: 10, y: 2 },
        md: { w: 2, h: 2, x: 6, y: 6 },
        sm: { w: 2, h: 2, x: 2, y: 15 },
      },
    },
    w8: {
      sizes: {
        default: { w: 2, h: 2, x: 8, y: 4 },
        md: { w: 2, h: 2, x: 4, y: 8 },
        sm: { w: 2, h: 2, x: 0, y: 17 },
      },
    },
    w9: {
      sizes: {
        default: { w: 2, h: 2, x: 10, y: 4 },
        md: { w: 2, h: 2, x: 6, y: 8 },
        sm: { w: 2, h: 2, x: 2, y: 17 },
      },
    },
    w10: {
      sizes: {
        default: { w: 12, h: 3, x: 0, y: 19 },
        md: { w: 8, h: 2, x: 0, y: 10 },
        sm: { w: 3, h: 2, x: 0, y: 19 },
      },
    },
    w11: {
      sizes: {
        default: { w: 8, h: 4, x: 0, y: 22 },
        md: { w: 4, h: 4, x: 0, y: 12 },
        sm: { w: 4, h: 4, x: 0, y: 21 },
      },
    },
    w12: {
      sizes: {
        default: { w: 4, h: 4, x: 8, y: 22 },
        md: { w: 4, h: 4, x: 4, y: 12 },
        sm: { w: 4, h: 4, x: 0, y: 25 },
      },
    },
  };

  /** GridStack instance. */
  @state()
  _grid: any;

  override render() {
    return html`
      <div class="grid-wrapper">
        <div class="grid-stack">
          <div id="w1" class="grid-stack-item" gs-min-w="2" gs-min-h="2">
            <div class="grid-stack-item-content">
              <kyn-widget widgetTitle="Widget Title" subTitle="Widget Subtitle">
                <kyn-widget-drag-handle></kyn-widget-drag-handle>
                Widget Content
              </kyn-widget>
            </div>
          </div>

          <div id="w2" class="grid-stack-item" gs-min-w="2" gs-min-h="2">
            <div class="grid-stack-item-content">
              <kyn-widget widgetTitle="Widget Title" subTitle="Widget Subtitle">
                <kyn-widget-drag-handle></kyn-widget-drag-handle>
                Widget Content
              </kyn-widget>
            </div>
          </div>

          <div id="w3" class="grid-stack-item" gs-min-w="2" gs-min-h="2">
            <div class="grid-stack-item-content">
              <kyn-widget widgetTitle="Widget Title" subTitle="Widget Subtitle">
                <kyn-widget-drag-handle></kyn-widget-drag-handle>
                Widget Content
              </kyn-widget>
            </div>
          </div>

          <div id="w4" class="grid-stack-item" gs-min-w="2" gs-min-h="2">
            <div class="grid-stack-item-content">
              <kyn-widget widgetTitle="Widget Title" subTitle="Widget Subtitle">
                <kyn-widget-drag-handle></kyn-widget-drag-handle>
                Widget Content
              </kyn-widget>
            </div>
          </div>

          <div id="w5" class="grid-stack-item" gs-min-w="4" gs-min-h="2">
            <div class="grid-stack-item-content">
              <kyn-widget widgetTitle="Widget Title" subTitle="Widget Subtitle">
                <kyn-widget-drag-handle></kyn-widget-drag-handle>
                Widget Content
              </kyn-widget>
            </div>
          </div>

          <div id="w6" class="grid-stack-item" gs-min-w="2" gs-min-h="2">
            <div class="grid-stack-item-content">
              <kyn-widget widgetTitle="Widget Title" subTitle="Widget Subtitle">
                <kyn-widget-drag-handle></kyn-widget-drag-handle>
                Widget Content
              </kyn-widget>
            </div>
          </div>

          <div id="w7" class="grid-stack-item" gs-min-w="2" gs-min-h="2">
            <div class="grid-stack-item-content">
              <kyn-widget widgetTitle="Widget Title" subTitle="Widget Subtitle">
                <kyn-widget-drag-handle></kyn-widget-drag-handle>
                Widget Content
              </kyn-widget>
            </div>
          </div>

          <div id="w8" class="grid-stack-item" gs-min-w="2" gs-min-h="2">
            <div class="grid-stack-item-content">
              <kyn-widget widgetTitle="Widget Title" subTitle="Widget Subtitle">
                <kyn-widget-drag-handle></kyn-widget-drag-handle>
                Widget Content
              </kyn-widget>
            </div>
          </div>

          <div id="w9" class="grid-stack-item" gs-min-w="2" gs-min-h="2">
            <div class="grid-stack-item-content">
              <kyn-widget widgetTitle="Widget Title" subTitle="Widget Subtitle">
                <kyn-widget-drag-handle></kyn-widget-drag-handle>
                Widget Content
              </kyn-widget>
            </div>
          </div>

          <div id="w10" class="grid-stack-item" gs-min-w="4" gs-min-h="2">
            <div class="grid-stack-item-content">
              <kyn-widget widgetTitle="Widget Title" subTitle="Widget Subtitle">
                <kyn-widget-drag-handle></kyn-widget-drag-handle>
                Widget Content
              </kyn-widget>
            </div>
          </div>

          <div id="w11" class="grid-stack-item" gs-min-w="4" gs-min-h="4">
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

          <div id="w12" class="grid-stack-item" gs-min-w="4" gs-min-h="4">
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
    if (changedProps.has('_breakpoint')) {
      const Widgets: any =
        this.shadowRoot?.querySelectorAll('.grid-stack-item');

      // update the gridstack size/position of each widget when breakpoint changes
      Widgets.forEach((widgetEl: any) => {
        const Options =
          this._layout[widgetEl.id].sizes[this._breakpoint] ||
          this._layout[widgetEl.id].sizes['default'];
        this._grid.update(widgetEl, Options);
      });
    }
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
