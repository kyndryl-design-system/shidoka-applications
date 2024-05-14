import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import Styles from './widgetGridstack.scss';
import { querySelectorDeep } from 'query-selector-shadow-dom';
import { debounce } from '../../../common/helpers/helpers';
import GridstackConfig from '../../../common/helpers/gridstack';
import { GridStack } from 'gridstack';

/**
 * GridStack wrapper that includes Shidoka default config and styles.
 * @fires on-grid-save - Emits the GridStack save() method results (new layout) on dragstop and resizestop.
 * @slot unnamed - Slot for .grid-stack container element.
 */
@customElement('kyn-widget-gridstack')
export class WidgetGridstack extends LitElement {
  static override styles = Styles;

  /** GridStack layout/widget size/position definitions for each breakpoint. */
  @property({ type: Object })
  layout: any = {};

  /** GridStack donfig. */
  @property({ type: Object })
  gridstackConfig: any = GridstackConfig;

  /** GridStack instance. */
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
    this.grid = GridStack.init(this.gridstackConfig, GridstackEl);

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
    const NewLayout = this.grid.save(false);

    // update grid layout for current breakpoint
    this.layout[this._breakpoint] = NewLayout;

    // emit save event with new layout in detail
    const event = new CustomEvent('on-grid-save', {
      detail: { layout: this.layout },
    });
    this.dispatchEvent(event);
  }

  private _updateLayout() {
    // get layout for current breakpoint
    const Layout = this.layout[this._breakpoint];

    if (this.grid) {
      // load grid layout
      this.grid.load(Layout);

      // enable gridstack animations
      this.grid.setAnimation(true);
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
    'kyn-widget-gridstack': WidgetGridstack;
  }
}
