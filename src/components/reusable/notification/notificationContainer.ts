import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import NotificationContainerScss from './notificationContainer.scss?inline';

/**
 * Notification container component for Toast notification.
 * Usage is limited for <kyn-notification type="toast">..</kyn-notification>
 * @slot unnamed - Slot for <kyn-notification type="toast"> component.
 */

@customElement('kyn-notification-container')
export class NotificationContainer extends LitElement {
  static override styles = unsafeCSS(NotificationContainerScss);

  /** Position at bottom instead of top of screen. */
  @property({ type: Boolean })
  accessor bottom = false;

  override render() {
    return html`
      <div class="notification-container ${this.bottom ? 'bottom' : ''}">
        <slot></slot>
      </div>
    `;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'kyn-notification-container': NotificationContainer;
  }
}
