import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import Styles from './widgetGridstack.scss?inline';
import { querySelectorDeep } from 'query-selector-shadow-dom';
import { debounce } from '../../../common/helpers/helpers';
import { GetConfig } from '../../../common/helpers/gridstack';
import { GridStack } from 'gridstack';

/**
 * GridStack wrapper that includes Shidoka default config and styles.
 * @fires on-grid-init - Emits after GridStack initializes.
 * @fires on-grid-save - Emits the GridStack save() method results (new layout) on dragstop and resizestop.
 * @slot unnamed - Slot for .grid-stack container element.
 */
@customElement('kyn-widget-gridstack')
export class WidgetGridstack extends LitElement {
  static override styles = unsafeCSS(Styles);

  /** GridStack layout/widget size/position definitions for each breakpoint. */
  @property({ type: Object })
  accessor layout: any = {};

  /** Custom GridStack config. */
  @property({ type: Object })
  accessor gridstackConfig!: any;

  /** Final config passed to gridstack.
   * @internal */
  @state()
  accessor _gridstackConfig!: any;

  /** GridStack instance. */
  @property({ attribute: false })
  accessor gridStack: any = GridStack;

  /** GridStack grid instance. */
  @property({ attribute: false })
  accessor grid!: any;

  /** Use compact grid config. Ignored in case of custom gridstackConfig. */
  @property({ type: Boolean })
  accessor compact = false;

  /** Make entire widget draggable. Ignored in case of custom gridstackConfig. */
  @property({ type: Boolean })
  accessor wholeWidgetDraggable = false;

  /** Current breakpoint.
   * @internal
   */
  @state()
  accessor _breakpoint = '';

  override render() {
    return html`
      <div class="grid-wrapper ${this.compact ? 'compact' : ''}">
        <slot></slot>
      </div>
    `;
  }

  override firstUpdated() {
    this._setBreakpoint();
  }

  override willUpdate(changedProps: any) {
    /* This part of the code is checking if the properties `compact` or `wholeWidgetDraggable` have
    changed. If either of these properties has changed, it updates the `_gridstackConfig` property
    based on the current values of `compact` and `wholeWidgetDraggable`. */
    if (
      changedProps.has('compact') ||
      changedProps.has('wholeWidgetDraggable')
    ) {
      this._gridstackConfig =
        this.gridstackConfig ||
        GetConfig(this.compact, this.wholeWidgetDraggable);
    }

    /* This part of the code is checking if the properties `layout` and `_breakpoint` are truthy and if
    either `_breakpoint` or `layout` properties have changed. If these conditions are met, it calls
    the `_updateLayout()` method to update the gridstack size and position of each widget when there
    is a change in the breakpoint or layout. */
    if (
      this.layout &&
      this._breakpoint &&
      (changedProps.has('_breakpoint') || changedProps.has('layout'))
    ) {
      // update the gridstack size/position of each widget when breakpoint or layout changes
      this._updateLayout();
    }
  }

  /**
   * The private `_saveLayout` function saves the grid layout by updating each widget's properties and
   * emitting a custom event with the new layout.
   */
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

  /**
   * The function `_initGridstack` initializes a GridStack layout with event listeners for drag, resize,
   * and saving layout changes.
   */
  private _initGridstack() {
    // destory grid if already exists
    if (this.grid) {
      this.grid.destroy(false);
    }

    // initialize the GridStack with Shidoka default options
    const GridstackEl: any = this.querySelector('.grid-stack');
    this.grid = this.gridStack.init(this._gridstackConfig, GridstackEl);

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

    // emit init event
    const event = new CustomEvent('on-grid-init', {
      detail: { grid: this.grid, gridStack: this.gridStack },
    });
    this.dispatchEvent(event);
  }

  override updated(changedProps: any) {
    if (
      changedProps.has('gridstackConfig') ||
      changedProps.has('_gridstackConfig')
    ) {
      this._initGridstack();
    }

    if (changedProps.has('compact')) {
      this._updateWidgetsDensity();
    }
  }

  /**
   * The function `_updateWidgetsDensity` iterates through all `kyn-widget` elements and sets their
   * `compact` property based on the parent element's `compact` property.
   */
  private _updateWidgetsDensity() {
    this.querySelectorAll('kyn-widget').forEach((widget: any) => {
      widget.compact = this.compact;
    });
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

  /**
   * The function `_setBreakpoint` retrieves and sets the current breakpoint value from the CSS custom
   * property `--kd-current-breakpoint`.
   */
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
