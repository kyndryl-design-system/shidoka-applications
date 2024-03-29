import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import NotificationScss from './notification.scss';
import '../card';
import '../tag';

/**
 * Notification
 * @slot action-slot - Slot for menu.
 * @slot notification-body-slot - Slot for notification message.
 * @fires on-notification-click - Emit event for clickable notification.
 */

@customElement('kyn-notification')
export class Notification extends LitElement {
  static override styles = NotificationScss;

  /** Notification Title (Required). */
  @property({ type: String })
  notificationTitle = '';

  /** Notification subtitle.(optional) */
  @property({ type: String })
  notificationSubtitle = '';

  /** Timestamp of notification. */
  @property({ type: String })
  timeStamp = '';

  /** Card href link */
  @property({ type: String })
  href = '';

  /** Notification status tag type. `'default'`, `'info'`, `'warning'`, `'success'` & `'error'` */
  @property({ type: String })
  tagStatus = 'info';

  /** Notification type. `'normal'` and `'clickable'`. clickable type can be use inside notification panel */
  @property({ type: String })
  type = 'normal';

  /** Notification tag label. Insert text of tag according to notification status type. (Requires `tagStatus` other than default) */
  @property({ type: String })
  tagLabel = '';

  /** Set tagColor based on provided tagStatus.
   * @internal
   */
  @state()
  tagColor: '';

  override render() {
    return html`
      ${this.type === 'clickable'
        ? html`<kyn-card
            type=${this.type}
            href=${this.href}
            target="_blank"
            @on-card-click=${(e) => this._handleCardClick(e)}
            hideBorder
            >${this.renderInnerUI()}</kyn-card
          >`
        : html`<kyn-card type=${this.type}>${this.renderInnerUI()}</kyn-card>`}
    `;
  }

  private renderInnerUI() {
    return html`<div class="notification-wrapper">
      <div class="notification-title-wrap">
        <div class="notification-head">
          <h1 class="notification-title">${this.notificationTitle}</h1>

          ${this.notificationSubtitle !== ''
            ? html` <div class="notification-subtitle">
                ${this.notificationSubtitle}
              </div>`
            : null}
        </div>

        <div>
          <slot name="action-slot"></slot>
        </div>
      </div>

      <div class="notification-description">
        <slot name="notification-body-slot"></slot>
      </div>

      <div class="notification-content-wrapper">
        <div class="status-tag">
          ${this.tagStatus !== 'default' && this.tagLabel !== ''
            ? html`<kyn-tag
                label=${this.tagLabel}
                tagColor=${this.tagColor}
                shade="dark"
              ></kyn-tag>`
            : null}
        </div>
        <div class="timestamp-wrapper">
          <div class="timestamp-text">${this.timeStamp}</div>
        </div>
      </div>
    </div>`;
  }

  override updated(changedProps: any) {
    if (changedProps.has('tagStatus')) {
      this.requestUpdate();

      switch (this.tagStatus) {
        case 'info':
          this.tagColor = 'spruce';
          break;
        case 'warning':
          this.tagColor = 'warning';
          break;
        case 'success':
          this.tagColor = 'passed';
          break;
        case 'error':
          this.tagColor = 'failed';
          break;
        default:
          this.tagColor = '';
          return;
      }
    }
  }

  private _handleCardClick(e: any) {
    const event = new CustomEvent('on-notification-click', {
      detail: e.detail.origEvent,
    });
    this.dispatchEvent(event);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-notification': Notification;
  }
}
