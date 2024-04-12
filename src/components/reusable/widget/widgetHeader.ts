import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import Styles from './widgetHeader.scss';

import '@kyndryl-design-system/shidoka-foundation/components/icon';

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

  override render() {
    return html`
      <div
        class="widget-header ${this._pill ? 'pill' : ''} ${this._dragHandle
          ? 'has-drag-handle'
          : ''}"
      >
        <div class="title-desc">
          <div class="title">${this.widgetTitle}</div>
          <div class="description">${this.description}</div>
        </div>

        <div class="actions">
          <slot></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-widget-header': WidgetHeader;
  }
}
