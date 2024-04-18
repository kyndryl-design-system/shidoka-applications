import { LitElement, html } from 'lit';
import {
  customElement,
  property,
  state,
  queryAssignedElements,
} from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import Styles from './widget.scss';

/**
 * Widget.
 * @fires on-drag-handle-grabbed - Event that emits when the drag handle is grabbed.
 * @fires on-drag-handle-released - Event that emits when the drag handle is released.
 * @fires on-resize - Emits when the widget is resized and returns the ResizeObserverEntry details. We recommend using a debounce function in your event listener so you're not executing on every pixel shift. This will also fire on load, content size change, and window resize.
 * @slot unnamed - Slot for widget content.
 */
@customElement('kyn-widget')
export class Widget extends LitElement {
  static override styles = Styles;

  /** Enables drag handle. */
  @property({ type: Boolean })
  dragHandle = false;

  /** Adds a resize handle. */
  @property({ type: Boolean })
  resizable = false;

  /** Pill style widget. */
  @property({ type: Boolean })
  pill = false;

  /** Widget drag handle active state.
   * @internal
   */
  @state()
  _dragActive = false;

  /** Query for widget header.
   * @internal
   */
  @queryAssignedElements({ selector: 'kyn-widget-header' })
  _widgetHeaders!: any;

  /** Query for slotted charts.
   * @internal
   */
  @queryAssignedElements({ selector: 'kd-chart' })
  _charts!: any;

  /** Initializes a resize observer.
   * @internal
   */
  resizeObserver = new ResizeObserver((entries) => {
    if (this.resizable) {
      entries.forEach((entry) => {
        const event = new CustomEvent('on-resize', {
          detail: {
            entry,
          },
        });
        this.dispatchEvent(event);
      });
    }
  });

  override render() {
    const Classes = {
      widget: true,
      pill: this.pill,
      'drag-active': this._dragActive,
      resizable: this.resizable,
    };

    return html`
      <div class=${classMap(Classes)}>
        <slot @slotchange=${this._handleSlotChange}></slot>
      </div>
    `;
  }

  override willUpdate(changedProps: any) {
    if (changedProps.has('dragHandle') || changedProps.has('pill')) {
      this._updateChildren();
    }

    if (
      changedProps.has('_dragActive') &&
      changedProps.get('_dragActive') !== undefined
    ) {
      if (this._dragActive) {
        const event = new CustomEvent('on-drag-handle-grabbed');
        this.dispatchEvent(event);
      } else {
        const event = new CustomEvent('on-drag-handle-released');
        this.dispatchEvent(event);
      }
    }
  }

  override updated(changedProps: any) {
    if (changedProps.has('resizable')) {
      if (this.resizable) {
        const Widget: any = this.shadowRoot?.querySelector('.widget');
        this.resizeObserver.observe(Widget);
      } else {
        this.resizeObserver.disconnect();
      }
    }
  }

  override disconnectedCallback() {
    this.resizeObserver.disconnect();

    super.disconnectedCallback();
  }

  private _handleSlotChange() {
    this._updateChildren();
  }

  private _updateChildren() {
    if (this._widgetHeaders.length) {
      this._widgetHeaders[0]._dragHandle = this.dragHandle;
      this._widgetHeaders[0]._pill = this.pill;
    }

    if (this._charts.length) {
      this._charts[0]._widget = true;
      this._charts[0]._dragHandle = this.dragHandle;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-widget': Widget;
  }
}
