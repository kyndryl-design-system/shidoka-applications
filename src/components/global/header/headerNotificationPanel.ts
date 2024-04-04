import { LitElement, html } from 'lit';
import {
  customElement,
  property,
  queryAssignedElements,
} from 'lit/decorators.js';
import '@kyndryl-design-system/shidoka-foundation/components/button';

import HeaderNotificationPanelScss from './headerNotificationPanel.scss';

/**
 * Component for notification panel within the Header.
 * @slot menu-slot - Slot for panel menu
 * @slot unnamed - Slot for notification content.
 * @fires on-footer-btn-click - Emits the panel footer button event.
 */

@customElement('kyn-header-notification-panel')
export class HeaderNotificationPanel extends LitElement {
  static override styles = HeaderNotificationPanelScss;

  /** Notification panel Title. */
  @property({ type: String })
  panelTitle = '';

  /** Notification panel footer button text. */
  @property({ type: String })
  panelFooterBtnText = '';

  /** Hide notification panel footer */
  @property({ type: Boolean })
  hidePanelFooter = false;

  /** Customizable text strings. */
  @property({ type: Object })
  textStrings: any = {
    markAllRead: 'Mark all as Read',
    markAllUnread: 'Mark all as Unread',
  };

  /** Mark all Read */
  @property({ type: Boolean })
  markAllRead = false;

  /**
   * Queries for slotted Notifications.
   * @ignore
   */
  @queryAssignedElements({ selector: 'kyn-notification' })
  notifications!: Array<any>;

  override render() {
    return html` <div class="panel-wrapper">
      <header class="panel-header-wrapper">
        <div class="panel-header">
          <div class="panel-left">
            <h1 class="panel-header-text">${this.panelTitle}</h1>
          </div>
          <div class="panel-left-slot">
            <kd-button
              kind="tertiary"
              @click=${(e: Event) => this._toggleMarkAllReadUnread(e)}
              >${this.markAllRead
                ? this.textStrings.markAllUnread
                : this.textStrings.markAllRead}</kd-button
            >
            <slot name="menu-slot"></slot>
          </div>
        </div>

        <hr class="panel-divider" />
      </header>

      <div class="panel-body">
        <slot></slot>
      </div>
      ${this.hidePanelFooter
        ? null
        : html` <div class="panel-footer">
            <kd-button
              kind="tertiary"
              @click=${(e: Event) => this._handlefooterBtnEvent(e)}
              >${this.panelFooterBtnText}</kd-button
            >
          </div>`}
    </div>`;
  }

  private _toggleMarkAllReadUnread(e: any) {
    this.markAllRead = !this.markAllRead;
    const event = new CustomEvent('on-all-notifications-read-unread', {
      detail: {
        markAllRead: this.markAllRead,
        origEvent: e,
      },
    });
    this.dispatchEvent(event);
  }

  override updated(changedProps: any) {
    if (changedProps.has('markAllRead')) {
      // set read / unread for each notification
      console.log(this.notifications);
      // TODO how to sync when only single notification prop is unread
      this.notifications.forEach((notification: any) => {
        notification.markRead = this.markAllRead;
      });
    }
  }
  // emit event on footer buton click
  private _handlefooterBtnEvent(e: any) {
    const event = new CustomEvent('on-footer-btn-click', {
      detail: {
        origEvent: e,
      },
    });
    this.dispatchEvent(event);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-header-notification-panel': HeaderNotificationPanel;
  }
}
