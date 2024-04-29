import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import NotificationScss from './notification.scss';
import '@kyndryl-design-system/shidoka-foundation/components/card';
import '@kyndryl-design-system/shidoka-foundation/components/icon';
import successIcon from '@carbon/icons/es/checkmark--filled/16';
import warningErrorIcon from '@carbon/icons/es/warning--alt--filled/16';
import infoIcon from '@carbon/icons/es/information--filled/16';

import '../tag';
/**
 * Notification component.
 * @slot unnamed - Slot for notification message body.
 * @slot actions - Slot for menu.
 * @slot action-link - Slot for action link.
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

  /** Notification status / tag type. `'default'`, `'info'`, `'warning'`, `'success'` & `'error'`. */
  @property({ type: String })
  tagStatus = 'default';

  /** Notification type. `'normal'`, `'inline'`, `'toast'` and `'clickable'`. Clickable type can be use inside notification panel */
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

  /** Set notification mark read prop. Required `type: 'clickable'`.*/
  @property({ type: Boolean, reflect: true })
  unRead = false;

  override render() {
    const cardBgClasses = {
      'notification-inline': this.type === 'inline',
      'notification-toast': this.type === 'toast',
      'notification-error':
        (this.type === 'inline' || this.type === 'toast') &&
        this.tagStatus === 'error',
      'notification-success':
        (this.type === 'inline' || this.type === 'toast') &&
        this.tagStatus === 'success',
      'notification-warning':
        (this.type === 'inline' || this.type === 'toast') &&
        this.tagStatus === 'warning',
      'notification-info':
        (this.type === 'inline' || this.type === 'toast') &&
        this.tagStatus === 'info',
      'notification-default':
        (this.type === 'inline' || this.type === 'toast') &&
        this.tagStatus === 'default',
    };

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
        : html`<kd-card type=${this.type} class="${classMap(cardBgClasses)}"
            >${this.renderInnerUI()}</kd-card
          >`}
    `;
  }

  private renderInnerUI() {
    const notificationIcon: any = {
      success: successIcon,
      error: warningErrorIcon,
      warning: warningErrorIcon,
      info: infoIcon,
    };

    const notificationIconFillColor: any = {
      success: 'var(--kd-color-border-success, #1FA452)',
      error: 'var(--kd-color-border-destructive, #CC1800)',
      warning: 'var(--kd-color-border-warning,#F5C400)',
      info: 'var(--kd-color-border-informational, #1473FF)',
    };

    return html`<div class="notification-wrapper">
      <div class="notification-title-wrap">
        <div class="notification-head">
          ${(this.type === 'inline' || this.type === 'toast') &&
          this.tagStatus !== 'default'
            ? html` <kd-icon
                class="notification-state-icon"
                slot="icon"
                fill=${notificationIconFillColor[this.tagStatus]}
                .icon=${notificationIcon[this.tagStatus]}
              ></kd-icon>`
            : null}

          <h1 class="notification-title">${this.notificationTitle}</h1>

          ${this.notificationSubtitle !== '' &&
          (this.type === 'normal' || this.type === 'clickable')
            ? html`
                <div class="notification-subtitle">
                  ${this.notificationSubtitle}
                </div>
              `
            : null}
        </div>
        <!-- actions slot could be an overflow menu, close icon etc. -->
        <div>
          <slot name="actions"></slot>
        </div>
      </div>

      <div class="notification-description">
        <slot></slot>
      </div>

      <div class="notification-content-wrapper">
        <div class="status-tag">
          ${this.tagStatus !== 'default' &&
          (this.type === 'normal' || this.type === 'clickable')
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

      <div class="notification-inline-toast-action">
        <slot name="action-link"></slot>
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
