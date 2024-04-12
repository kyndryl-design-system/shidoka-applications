import { LitElement, html } from 'lit';
import {
  customElement,
  property,
  state,
  queryAssignedElements,
} from 'lit/decorators.js';
import Styles from './widget.scss';

import '@kyndryl-design-system/shidoka-foundation/components/card';
import '@kyndryl-design-system/shidoka-foundation/components/icon';

import dragIcon from '@carbon/icons/es/draggable/16';

/**
 * Widget.
 * @slot unnamed - Slot for widget content.
 */
@customElement('kyn-widget')
export class Widget extends LitElement {
  static override styles = Styles;

  /** Enables drag handle. */
  @property({ type: Boolean })
  dragHandle = false;

  /** Pill style widget. */
  @property({ type: Boolean })
  pill = false;

  /** Query for widget header
   * @internal
   */
  @queryAssignedElements({ selector: 'kyn-widget-header' })
  widgetHeaders!: any;

  /** Widget title, inherited from child header.
   * @internal
   */
  @state()
  _widgetTitle = '';

  override render() {
    return html`
      <kd-card>
        ${this.dragHandle
          ? html`
              <span
                class="drag-handle"
                @pointerdown=${(e: Event) => this._handleDragStart(e)}
                @pointerup=${(e: Event) => this._handleDragEnd(e)}
                @pointerleave=${(e: Event) => this._handleDragEnd(e)}
              >
                <kd-icon .icon=${dragIcon}></kd-icon>
              </span>
            `
          : null}

        <slot @slotchange=${this._handleSlotChange}></slot>

        ${this.pill
          ? html` <div class="pill-title">${this._widgetTitle}</div> `
          : null}
      </kd-card>
    `;
  }

  override willUpdate(changedProps: any) {
    if (changedProps.has('dragHandle') || changedProps.has('pill')) {
      this._updateChildren();
    }
  }

  private _handleSlotChange() {
    this._updateChildren();
  }

  private _updateChildren() {
    if (this.widgetHeaders.length) {
      this.widgetHeaders[0]._dragHandle = this.dragHandle;
      this.widgetHeaders[0]._pill = this.pill;
      this._widgetTitle = this.widgetHeaders[0].widgetTitle;
    }
  }

  private _handleDragStart(e: any) {
    this.draggable = true;
  }

  private _handleDragEnd(e: any) {
    this.draggable = false;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-widget': Widget;
  }
}
