import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import NotificationScss from './notification.scss';
import '@kyndryl-design-system/shidoka-foundation/components/card';
import '../tag';
/**
 * Notification component.
 * @slot unnamed - Slot for notification message body.
 * @slot actions - Slot for menu.
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
  tagStatus = 'default';

  /** Notification type. `'normal'` and `'clickable'`. clickable type can be use inside notification panel */
  @property({ type: String })
  type = 'normal';

  /** Customizable text strings. */
  @property({ type: Object })
  textStrings: any = {
    success: 'Success',
    warning: 'Warning',
    info: 'Info',
    error: 'Error',
  };

  /** Set tagColor based on provided tagStatus.
   * @internal
   */
  @state()
  _tagColor: any = {
    success: 'passed',
    warning: 'warning',
    info: 'cat01',
    error: 'failed',
  };

  /** Set notification mark read prop.*/
  @property({ type: Boolean, reflect: true })
  unRead = false;

  override render() {
    return html`
      ${this.type === 'clickable'
        ? html`<kd-card
            class="${this.unRead
              ? 'notification-mark-unread'
              : 'notification-mark-read'}"
            type=${this.type}
            href=${this.href}
            target="_blank"
            rel="noopener"
            @on-card-click=${(e: any) => this._handleCardClick(e)}
            hideBorder
            >${this.renderInnerUI()}</kd-card
          >`
        : html`<kd-card type=${this.type}>${this.renderInnerUI()}</kd-card>`}
    `;
  }

  private renderInnerUI() {
    return html`<div class="notification-wrapper">
      <div class="notification-title-wrap">
        <div class="notification-head">
          <h1 class="notification-title">${this.notificationTitle}</h1>

          ${this.notificationSubtitle !== ''
            ? html`
                <div class="notification-subtitle">
                  ${this.notificationSubtitle}
                </div>
              `
            : null}
        </div>
        <div>
          <slot name="actions"></slot>
        </div>
      </div>

      <div class="notification-description">
        <slot></slot>
      </div>

      <div class="notification-content-wrapper">
        <div class="status-tag">
          ${this.tagStatus !== 'default'
            ? html` <kyn-tag
                label=${this.textStrings[this.tagStatus]}
                tagColor=${this._tagColor[this.tagStatus]}
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
