import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '../../reusable/button';

import HeaderNotificationPanelScss from './headerNotificationPanel.scss?inline';

/**
 * Component for notification panel within the Header.
 * @slot menu-slot - Slot for panel menu
 * @slot unnamed - Slot for notification content.
 * @fires on-footer-btn-click - Emits the panel footer button event. `detail:{ origEvent: Event }`
 */

@customElement('kyn-header-notification-panel')
export class HeaderNotificationPanel extends LitElement {
  static override styles = unsafeCSS(HeaderNotificationPanelScss);

  /** Notification panel Title. */
  @property({ type: String })
  accessor panelTitle = '';

  /** Notification panel footer button text. */
  @property({ type: String })
  accessor panelFooterBtnText = '';

  /** Hide notification panel footer */
  @property({ type: Boolean })
  accessor hidePanelFooter = false;

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
            <kyn-button
              kind="ghost"
              @click=${(e: Event) => this._handlefooterBtnEvent(e)}
              >${this.panelFooterBtnText}</kyn-button
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
    'kyn-header-notification-panel': HeaderNotificationPanel;
  }
}
