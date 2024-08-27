import { LitElement, html } from 'lit';
import { customElement, query, state, property } from 'lit/decorators.js';
import ModalStyles from './kyn-modal-wb.scss';

import '@kyndryl-design-system/shidoka-foundation/components/link';
import '@kyndryl-design-system/shidoka-foundation/components/button';
import '@kyndryl-design-system/shidoka-foundation/components/icon';

import closeIcon from '@carbon/icons/es/close/20';

/**
 * Modal.
 * @slot anchor - Slot for the anchor button content.
 * @slot modalBody -- Slot for the modal body content.
 */
@customElement('kyn-modal-wb')
export class KynModalWb extends LitElement {
  static override styles = [ModalStyles];

  /**
   * Modal size `'auto'`, `'sm'`, `'md'`, or `'lg'`.
   */
  @property({ type: String })
  size = 'sm';

  /**
   * Title/heading text, required.
   */
  @property({ type: String })
  modalTitle = '';

  /**
   * Subheading text, optional.
   */
  @property({ type: String })
  subheader = '';

  /**
   * Modal open state.
   */
  @property({ type: Boolean })
  showModal = false;

  /**
   * Subheader href to determine if is link.
   */
  @property({ type: String })
  subheaderHref = '';

  /** Formatted timestamp value
   * @internal
   */
  @state()
  _timestamp: string = new Date(Date.UTC(2012, 11, 20, 3, 0, 0)).toLocaleString(
    'en-GB',
    { timeZone: 'UTC' }
  );

  /**
   * Timestamp visible state.
   */
  @property({ type: Boolean })
  timestampVisible = false;

  /** Modal element
   * @internal
   */
  @query('#modal')
  _modal!: HTMLDivElement;

  /** Interval to hide toaster
   * @internal
   */
  private _toastTimeoutId: number | undefined = undefined;

  override render() {
    return html`
      <span class="anchor" @click=${this._toggleModal}>
        <slot name="anchor"></slot>
      </span>

      <div
        id="modal"
        class=${`modal-visible-${this.showModal}`}
        ?hidden=${!this.showModal}
      >
        <div id="modal-inner" class=${this.size}>
          <button
            @click=${() => {
              this._toggleModal();
            }}
            @keydown=${(e: KeyboardEvent) => {
              if (e.key === 'Enter') {
                this._toggleModal();
              }
            }}
            class="x-out"
          >
            <kd-icon .icon=${closeIcon}></kd-icon>
          </button>
          <h2 id="modal-title">${this.modalTitle}</h2>
          ${this.subheader
            ? html` <h3 id="modal-subheader">
                ${!this.subheaderHref
                  ? html`<span>${this.subheader}</span>`
                  : html`<kd-link standalone href=${this.subheaderHref}
                      >${this.subheader}</kd-link
                    >`}
              </h3>`
            : null}
          <div id="modal-body">
            <slot name="modal-body"></slot>
          </div>
          <span ?hidden=${!this.timestampVisible} id="timestamp"
            >${this._timestamp}</span
          >
          <div id="modal-footer">
            <kd-button
              class="show-hide-button action-button hide-on-modal"
              value="cancel"
              kind="primary-web"
              @click=${this._toggleModal}
            >
              Ok
            </kd-button>
            <kd-button
              class="show-hide-button action-button hide-on-modal"
              value="cancel"
              kind="tertiary"
              @click=${this._toggleModal}
            >
              Cancel
            </kd-button>
          </div>
        </div>
      </div>
    `;
  }

  private _toggleModal() {
    this.showModal = !this.showModal;

    if (this._toastTimeoutId) {
      clearTimeout(this._toastTimeoutId);
      this._toastTimeoutId = undefined;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-modal-wb': KynModalWb;
  }
}
