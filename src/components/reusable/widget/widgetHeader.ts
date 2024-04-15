import { LitElement, html } from 'lit';
import {
  customElement,
  property,
  state,
  queryAssignedElements,
} from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import Styles from './widgetHeader.scss';

import '@kyndryl-design-system/shidoka-foundation/components/icon';

import dragIcon from '@carbon/icons/es/draggable/16';

/**
 * Widget header.
 * @slot unnamed - Slot of action buttons.
 */
@customElement('kyn-widget-header')
export class WidgetHeader extends LitElement {
  static override styles = Styles;

  /** Widget title. */
  @property({ type: String })
  widgetTitle = '';

  /** Widget sub-title. */
  @property({ type: String })
  description = '';

  /** Parent dragHandle value, inherited.
   * @internal
   */
  @state()
  _dragHandle = false;

  /** Parent pill value, inherited.
   * @internal
   */
  @state()
  _pill = false;

  /** Query for slotted widget action elements.
   * @internal
   */
  @queryAssignedElements()
  _slottedEls!: any;

  override render() {
    const Classes = {
      'widget-header': true,
      pill: this._pill,
      slotted: this._slottedEls.length,
      'has-drag-handle': this._dragHandle,
    };

    return html`
      <div class=${classMap(Classes)}>
        ${this._dragHandle
          ? html`
              <span
                class="drag-handle"
                @pointerdown=${this._handleDragGrabbed}
                @pointerup=${this._handleDragReleased}
              >
                <kd-icon .icon=${dragIcon}></kd-icon>
              </span>
            `
          : null}

        <div class="title-desc">
          <div class="title">${this.widgetTitle}</div>
          <div class="description">${this.description}</div>
        </div>

        <div class="actions">
          <slot @slotchange=${this._handleSlotChange}></slot>
        </div>
      </div>
    `;
  }

  private _handleSlotChange() {
    this.requestUpdate();
  }

  private _handleDragGrabbed() {
    const Widget: any = this.parentElement;
    Widget._dragActive = true;
  }

  private _handleDragReleased() {
    const Widget: any = this.parentElement;
    Widget._dragActive = false;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-widget-header': WidgetHeader;
  }
}
