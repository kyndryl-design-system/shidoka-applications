import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import Styles from './widgetDragHandle.scss';

import '@kyndryl-design-system/shidoka-foundation/components/icon';
import dragIcon from '@carbon/icons/es/draggable/16';

/**
 * Widget drag handle.
 */
@customElement('kyn-widget-drag-handle')
export class WidgetDragHandle extends LitElement {
  static override styles = Styles;

  /** Force widget slot */
  @property({ type: String, reflect: true })
  override slot = 'draghandle';

  override render() {
    return html`
      <div class="drag-handle">
        <kd-icon .icon=${dragIcon}></kd-icon>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-widget-drag-handle': WidgetDragHandle;
  }
}
