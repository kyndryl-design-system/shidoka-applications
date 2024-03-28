import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '@kyndryl-design-system/shidoka-foundation/components/button';

import NotificationPanelScss from './notificationPanel.scss';

/**
 * Notification Panel.
 * @slot menu-slot - Slot for panel menu
 * @slot unnamed - Slot for notification content.
 * @fires on-footer-btn-click - Emits the panel footer button event.
 */

@customElement('kyn-notification-panel')
export class NotificationPanel extends LitElement {
  static override styles = NotificationPanelScss;

  /** Notification panel Title. */
  @property({ type: String })
  panelTitle = '';

  @property({ type: String })
  panelFooterBtnText = '';

  @property({ type: Boolean })
  hidePanelFooter = false;

  override render() {
    return html` <div class="panel-wrapper">
      <header class="panel-header-wrapper">
        <div class="panel-header">
          <div class="panel-left">
            <h1 class="panel-header-text">${this.panelTitle}</h1>
          </div>
          <div class="panel-left-slot">
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
    'kyn-notification-panel': NotificationPanel;
  }
}
