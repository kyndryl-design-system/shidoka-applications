import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import CheckMarkFilledIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/32/checkmark-filled.svg';
import Styles from './widget.scss?inline';

/**
 * Widget.
 * @fires on-select - Emits the widget selected state .`detail:{ selected: boolean }`
 * @slot unnamed - Slot for widget content.
 * @slot actions - Slot for action buttons.
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

  /** Widget selectable state. */
  @property({ type: Boolean })
  accessor selectable = false;

  /** Widget selected state. */
  @property({ type: Boolean })
  accessor selected = false;

  /** Widget compact state, reduced padding. */
  @property({ type: Boolean })
  accessor compact = false;

  /** Removes the widget header. */
  @property({ type: Boolean })
  accessor removeHeader = false;

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
      selectable: this.selectable,
      selected: this.selected,
      compact: this.compact,
    };

    return html`
      <div
        class=${classMap(Classes)}
        role="group"
        aria-disabled=${this.disabled}
        @click=${this._handleBodyClick}
        @keydown=${this._handleKeyDown}
        tabindex=${this.selectable && !this.disabled ? 0 : -1}
      >
        ${!this.removeHeader
          ? html`
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
                  <slot
                    name="actions"
                    tabindex=${this.selectable ? -1 : 0}
                  ></slot>
                </div>
              </div>
            `
          : null}

        <div class="widget-content">
          <div class="widget-body">
            <slot
              @slotchange=${this._handleSlotChange}
              tabindex=${this.selectable ? -1 : 0}
            ></slot>
          </div>

          <div class="widget-footer">
            <slot name="footer" tabindex=${this.selectable ? -1 : 0}></slot>
          </div>
        </div>

        ${this.selectable && this.selected
          ? html`
              <div class="opacity-overlay"></div>
              <div class="checkmark-overlay">
                <div class="checkmark-bg">
                  <span class="checkmark-iconsize"
                    >${unsafeSVG(CheckMarkFilledIcon)}</span
                  >
                </div>
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
