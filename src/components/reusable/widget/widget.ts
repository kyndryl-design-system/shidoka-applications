import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import Styles from './widget.scss?inline';

/**
 * Widget.
 * @slot unnamed - Slot for widget content.
 * @slot action - Slot for action buttons.
 * @slot tooltip - Slot for tooltip in header.
 * @slot draghandle - Slot for drag handle.
 * @slot footer - Slot for footer content.
 */
@customElement('kyn-widget')
export class Widget extends LitElement {
  static override styles = unsafeCSS(Styles);

  /** Widget title. */
  @property({ type: String })
  accessor widgetTitle = '';

  /** Widget sub-title. */
  @property({ type: String })
  accessor subTitle = '';

  /** Widget drag active state. */
  @property({ type: Boolean })
  accessor dragActive = false;

  /** Widget disabled state. */
  @property({ type: Boolean })
  accessor disabled = false;

  /** Slotted chart element.
   * @internal
   */
  @state()
  accessor _chart!: any;

  override render() {
    const Classes = {
      widget: true,
      'drag-active': this.dragActive,
      'has-chart': this._chart,
      disabled: this.disabled,
    };

    return html`
      <div
        class=${classMap(Classes)}
        role="group"
        aria-disabled=${this.disabled}
      >
        <div class="widget-header">
          <slot name="draghandle"></slot>

          <div class="title-desc">
            <div class="title">
              ${this.widgetTitle}
              <slot name="tooltip"></slot>
            </div>

            <div class="description">${this.subTitle}</div>
          </div>

          <div class="actions">
            <slot name="actions"></slot>
          </div>
        </div>

        <div class="widget-content">
          <div class="widget-body">
            <slot @slotchange=${this._handleSlotChange}></slot>
          </div>

          <div class="widget-footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    `;
  }

  private _handleSlotChange() {
    this._updateChildren();
    this.requestUpdate();
  }

  private _updateChildren() {
    const Chart = this.querySelector('kd-chart');
    if (Chart) {
      this._chart = Chart;
      this._chart._widget = true;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-widget': Widget;
  }
}
