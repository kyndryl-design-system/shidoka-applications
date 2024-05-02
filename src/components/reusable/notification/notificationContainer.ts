import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import NotificationContainerScss from './notificationContainer.scss';

/**
 * Notification container component for Toast notification.
 * Usage is limited for <kyn-notification type="toast">..</kyn-notification>
 * @slot unnamed - Slot for <kyn-notification type="toast"> component.
 */

@customElement('kyn-notification-container')
export class NotificationContainer extends LitElement {
  static override styles = NotificationContainerScss;
  override render() {
    return html`<div class="notification-container">
      <slot></slot>
    </div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'kyn-notification-container': NotificationContainer;
  }
}
