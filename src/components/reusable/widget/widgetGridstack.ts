import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import Styles from './widgetGridstack.scss';
import { querySelectorDeep } from 'query-selector-shadow-dom';
import { debounce } from '../../../common/helpers/helpers';
import { Config } from '../../../common/helpers/gridstack';
import { GridStack } from 'gridstack';
import '@kyndryl-design-system/shidoka-charts/components/chart';

/**
 * GridStack wrapper that includes Shidoka default config and styles.
 * @fires on-grid-init - Emits after GridStack initializes.
 * @fires on-grid-save - Emits the GridStack save() method results (new layout) on dragstop and resizestop.
 * @slot unnamed - Slot for .grid-stack container element.
 */
@customElement('kyn-widget-gridstack')
export class WidgetGridstack extends LitElement {
  static override styles = Styles;

  /** GridStack layout/widget size/position definitions for each breakpoint. */
  @property({ type: Object })
  layout: any = {};

  /** GridStack config. */
  @property({ type: Object })
  gridstackConfig: any = Config;

  /** GridStack instance. */
  @property({ attribute: false })
  gridStack: any = GridStack;

  /** GridStack grid instance. */
  @property({ attribute: false })
  grid!: any;

  /** Current breakpoint.
   * @internal
   */
  @state()
  _breakpoint = '';

  override render() {
    return html`
      <div class="grid-wrapper">
        <slot></slot>
      </div>
    `;
  }

  override firstUpdated() {
    this._setBreakpoint();

    // initialize the GridStack with Shidoka default options
    const GridstackEl: any = this.querySelector('.grid-stack');
    this.grid = this.gridStack.init(this.gridstackConfig, GridstackEl);

    // set widget drag state on dragstart
    this.grid.on('dragstart', (e: Event) => {
      const El: any = e.target;
      const Widget: any = querySelectorDeep('kyn-widget', El);
      Widget.dragActive = true;
    });

    // unset widget drag state and save layout on dragstop
    this.grid.on('dragstop', (e: Event) => {
      const El: any = e.target;
      const Widget: any = querySelectorDeep('kyn-widget', El);
      Widget.dragActive = false;
      this._saveLayout();
    });

    // save layout on resizestop
    this.grid.on('resizestop', () => {
      this._saveLayout();
    });

    this.grid.on('added', (event: any) => {
      const El: any = event.target;
      const Widget: any = querySelectorDeep('kyn-widget', El);
      Widget.dragActive = false;
      this._saveLayout();
    });

    // Chart re-render testing

    // this.grid.on('added', (_event: any, items: any[]) => {
    //   items.forEach((item) => {
    //     const widget = item.el.querySelector('kyn-widget');
    //     if (!widget) return;

    //     // Wait for DOM/layout to settle
    //     requestAnimationFrame(() => {
    //       const chart = widget.shadowRoot?.querySelector('kd-chart');
    //       console.log('Chart size:', chart?.offsetWidth, chart?.offsetHeight);
    //       if (chart) {
    //         requestAnimationFrame(() => {
    //           if (typeof chart.resize === 'function') {
    //             chart.resize();
    //           } else {
    //             chart.requestUpdate?.();
    //             window.dispatchEvent(new Event('resize'));
    //           }
    //         });
    //       }
    //     });
    //   });
    // });

    // emit init event
    const event = new CustomEvent('on-grid-init', {
      detail: { grid: this.grid, gridStack: this.gridStack },
    });
    this.dispatchEvent(event);
  }

  override willUpdate(changedProps: any) {
    if (
      this.layout &&
      this._breakpoint &&
      (changedProps.has('_breakpoint') || changedProps.has('layout'))
    ) {
      // update the gridstack size/position of each widget when breakpoint or layout changes
      this._updateLayout();
    }
  }

  private _saveLayout() {
    // get new grid layout
    let NewLayout = this.grid.save(false);

    // manually update each widget's properties because GridStack drops "w" or "h" if they match their respective min values and freezes the browser
    NewLayout = NewLayout.map((Widget: any) => {
      return {
        ...Widget,
        w: Widget.w || Widget.minW,
        h: Widget.h || Widget.minH,
      };
    });

    // update layout for current breakpoint
    this.layout[this._breakpoint] = NewLayout;

    // emit save event with new layout in detail
    const event = new CustomEvent('on-grid-save', {
      detail: { layout: this.layout },
    });
    this.dispatchEvent(event);
  }

  private _updateLayout() {
    // get layout for current breakpoint
    const Layout = this.layout[this._breakpoint] || this.layout['max'];

    if (this.grid) {
      // load grid layout
      this.grid.load(Layout);

      // enable gridstack animations
      this.grid.setAnimation(true);
    }
  }

  /** @internal */
  private _debounceResize = debounce(() => {
    this._setBreakpoint();
  });

  override connectedCallback() {
    super.connectedCallback();

    window?.addEventListener('resize', this._debounceResize);
  }

  override disconnectedCallback() {
    window?.removeEventListener('resize', this._debounceResize);

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
    'kyn-widget-gridstack': WidgetGridstack;
  }
}
