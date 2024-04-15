import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import Styles from './widgetFooter.scss';

/**
 * Widget footer.
 * @slot unnamed - Slot for content to the right of the widget title.
 */
@customElement('kyn-widget-footer')
export class WidgetFooter extends LitElement {
  static override styles = Styles;

  /** Widget title. */
  @property({ type: String })
  widgetTitle = '';

  override render() {
    return html`
      <div class="widget-footer">
        <div class="title">${this.widgetTitle}</div>
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-widget-footer': WidgetFooter;
  }
}
