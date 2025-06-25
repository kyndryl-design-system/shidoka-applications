import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import CheckMarkFilledIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/32/checkmark-filled.svg';
import Styles from './widget.scss';

/**
 * Widget.
 * @fires on-select - Emits the widget selected state .
 * @slot unnamed - Slot for widget content.
 * @slot action - Slot for action buttons.
 * @slot tooltip - Slot for tooltip in header.
 * @slot draghandle - Slot for drag handle.
 * @slot footer - Slot for footer content.
 * @slot icon - Slot for widget selectable icon.
 */
@customElement('kyn-widget')
export class Widget extends LitElement {
  static override styles = Styles;

  /** Widget title. */
  @property({ type: String })
  widgetTitle = '';

  /** Widget sub-title. */
  @property({ type: String })
  subTitle = '';

  /** Widget drag active state. */
  @property({ type: Boolean })
  dragActive = false;

  /** Widget disabled state. */
  @property({ type: Boolean })
  disabled = false;

  /** Widget selectable state. */
  @property({ type: Boolean })
  selectable = true;

  /** Widget selected state. */
  @property({ type: Boolean })
  selected = false;

  /** Slotted chart element.
   * @internal
   */
  @state()
  _chart!: any;

  override render() {
    const Classes = {
      widget: true,
      'drag-active': this.dragActive,
      'has-chart': this._chart,
      disabled: this.disabled,
      selectable: this.selectable,
    };

    return html`
      <div
        class=${classMap(Classes)}
        role="group"
        aria-disabled=${this.disabled}
        @click=${this._handleBodyClick}
        @keydown=${this._handleKeyDown}
        tabindex=${this.disabled ? '-1' : '0'}
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

        ${this.selectable && this.selected
          ? html`
              <div class="opacity-overlay"></div>
              <div class="checkmark-overlay">
                <slot name="icon">${unsafeSVG(CheckMarkFilledIcon)}</slot>
              </div>
            `
          : null}
      </div>
    `;
  }

  private _handleBodyClick() {
    if (!this.selectable || this.disabled) return;
    this.selected = !this.selected;
    this.dispatchEvent(
      new CustomEvent('on-select', {
        detail: { selected: this.selected },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      this._handleBodyClick();
    }
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
