import { LitElement, html, PropertyValues } from 'lit';
import { customElement, state, query, property } from 'lit/decorators.js';
import ToastStyles from './kyn-toast-wb.scss';

import '@kyndryl-design-system/shidoka-foundation/components/button';
import '@kyndryl-design-system/shidoka-foundation/components/icon';

import closeIcon from '@carbon/icons/es/close/20';
import successIcon from '@carbon/icons/es/checkmark--filled/16';
import warningErrorIcon from '@carbon/icons/es/warning--alt--filled/16';
import infoIcon from '@carbon/icons/es/information--filled/16';

/**
 * Toast notification.
 * @slot anchor - Slot for the anchor button content.
 */
@customElement('kyn-toast-wb')
export class KynToastWb extends LitElement {
  static override styles = [ToastStyles];

  /**
   * Body text, optional
   */
  @property({ type: Boolean })
  showToast = false;

  /**
   * Toaster notification mode/status. `'default'`, `'success'`, `'warning'`, or `'error'`.
   */
  @property({ type: String })
  toastStatus = 'default';

  /**
   * Title/heading text, required.
   */
  @property({ type: String })
  toasterTitle = '';

  /**
   * Body text, optional
   */
  @property({ type: String })
  toasterBody = '';

  /**
   * Duration that toaster is visible to the user
   */
  @property({ type: Number })
  toastLifespan = 5000;

  /** internal timestamp property
   * @internal
   */
  @state()
  _timestamp: string = new Date(Date.UTC(2012, 11, 20, 3, 0, 0)).toLocaleString(
    'en-GB',
    { timeZone: 'UTC' }
  );

  /**
   *Timestamp visible state
   */
  @property({ type: Boolean })
  timestampVisible = false;

  /** Toaster element
   * @internal
   */
  @query('#toaster')
  _toaster!: HTMLDivElement;

  /** Interval to hide toaster
   * @internal
   */
  private _toastTimeoutId: number | undefined = undefined;

  override render() {
    const notificationIcon: any = {
      success: successIcon,
      error: warningErrorIcon,
      warning: warningErrorIcon,
      default: infoIcon,
    };

    return html`
      <span
        class="anchor"
        @click=${() => this._toggleToast(this.toastLifespan)}
      >
        <slot name="anchor"></slot>
      </span>
      <div id="toaster" class=${this.toastStatus} ?hidden=${!this.showToast}>
        <button class="x-out" @click=${this._toggleToast}>
          <kd-icon .icon=${closeIcon}></kd-icon>
        </button>
        <p id="toaster-title" class=${this.toastStatus}>
          <kd-icon .icon=${notificationIcon[this.toastStatus]}></kd-icon>${this
            .toasterTitle}
        </p>
        <p id="toaster-body">${this.toasterBody}</p>
        ${this.timestampVisible
          ? html`<span id="timestamp">${this._timestamp}</span>`
          : null}
      </div>
    `;
  }

  private _toggleToast(toastTimeout = 5000) {
    this.showToast = !this.showToast;

    if (this._toastTimeoutId) {
      clearTimeout(this._toastTimeoutId);
      this._toastTimeoutId = undefined;
    }

    if (this.showToast) {
      this._toastTimeoutId = window.setTimeout(() => {
        this.showToast = false;
      }, toastTimeout);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-toast-wb': KynToastWb;
  }
}
