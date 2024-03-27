import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import NotificationScss from './notification.scss';

/**
 * Notification
 * @slot overflow-menu-slot - Slot for menu.
 * @slot unnamed - Slot for notification content.
 */

@customElement('kyn-notification')
export class Notification extends LitElement {
  static override styles = NotificationScss;

  /** Notification Title. */
  @property({ type: String })
  notificationTitle = '';

  /** Notification subtitle. */
  @property({ type: String })
  notificationSubtitle = '';

  /** Notification description. */
  @property({ type: String })
  description = '';

  /** Timestamp of notification */
  @property({ type: String })
  timeStamp = '';

  override render() {
    return html`
      <kyn-card>
        <div class="notification-wrapper">
          <div class="notification-title-wrap">
            <div class="notification-head">
              <h1 class="notitifcation-title">Urgent: Overspending Alert</h1>
              <div class="notification-subtitle">Subtitle</div>
            </div>
            <div>
              <slot name="overflow-menu-slot"></slot>
            </div>
          </div>
        </div>
      </kyn-card>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-notification': Notification;
  }
}
