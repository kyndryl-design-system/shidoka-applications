import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import NotificationScss from './notification.scss';
import '../card';

/**
 * Notification
 * @slot overflow-menu-slot - Slot for menu.
 * @slot status-tag-slot - Slot for status tag.
 * @slot unnamed - Slot for notification content.
 * @fires on-notification-click - Emit event when click on notification
 */

@customElement('kyn-notification')
export class Notification extends LitElement {
  static override styles = NotificationScss;

  /** Notification Title (Required). */
  @property({ type: String })
  notificationTitle = '';

  /** Notification subtitle. */
  @property({ type: String })
  notificationSubtitle = '';

  /** Notification description (Required). */
  @property({ type: String })
  description = '';

  /** Timestamp of notification. */
  @property({ type: String })
  timeStamp = '';

  /** Card href link */
  @property({ type: String })
  href = '';

  override render() {
    return html`
      <kyn-card type="clickable" href=${this.href} target="_blank">
        <div class="notification-wrapper">
          <div class="notification-title-wrap">
            <div class="notification-head">
              <!-- Title -->
              <h1 class="notification-title">${this.notificationTitle}</h1>
              <!-- subtitle -->
              ${this.notificationSubtitle
                ? html` <div class="notification-subtitle">
                    ${this.notificationSubtitle}
                  </div>`
                : null}
            </div>
            <!-- Slot for overflow menu -->
            <div>
              <slot name="overflow-menu-slot"></slot>
            </div>
          </div>
          <!-- Description -->
          <div class="notification-description">${this.description}</div>
          <!-- Tag and timestamp -->
          <div class="notification-content-wrapper">
            <div class="status-tag">
              <slot name="status-tag-slot"></slot>
            </div>
            <div class="timestamp-wrapper">
              <div class="timestamp-text">${this.timeStamp}</div>
            </div>
          </div>
          <!-- other content if any -->
          <div>
            <slot></slot>
          </div>
        </div>
      </kyn-card>
    `;
  }

  private _handleCardClick(e: any) {
    console.log(e);
    const event = new CustomEvent('on-notification-click', {
      detail: this,
    });
    this.dispatchEvent(event);
  }

  override connectedCallback() {
    super.connectedCallback();
    // capture card click event
    this.addEventListener('on-card-click', (e: any) =>
      this._handleCardClick(e)
    );
  }

  override disconnectedCallback() {
    this.removeEventListener('on-card-click', (e: any) =>
      this._handleCardClick(e)
    );
    super.disconnectedCallback();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-notification': Notification;
  }
}
