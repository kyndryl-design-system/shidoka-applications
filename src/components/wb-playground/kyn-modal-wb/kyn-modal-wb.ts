import { LitElement, html, PropertyValues } from 'lit';
import { customElement, state, query, property } from 'lit/decorators.js';
import _formatDate from '../utils/formatDate';
import ModalStyles from './kyn-modal-wb.scss';

import '@kyndryl-design-system/shidoka-foundation/components/link';
import '@kyndryl-design-system/shidoka-foundation/components/button';
import '@kyndryl-design-system/shidoka-foundation/components/icon';

import closeIcon from '@carbon/icons/es/close/20';

/**
 * Modal.
 * @slot anchor - Slot for the anchor button content.
 */
@customElement('kyn-modal-wb')
export class KynModalWb extends LitElement {
  static override styles = [ModalStyles];

  /** Date formatting function
   * @internal
   */
  private static _formatDate = _formatDate;

  /**
   * Modal size `'auto'`, `'sm'`, `'md'`, or `'lg'`.
   * @type {string}
   * @default 'sm'
   */
  @property({ type: String })
  size = 'sm';

  /**
   * Title/heading text, required.
   * @type {string}
   * @default ''
   */
  @property({ type: String })
  modalTitle = '';

  /**
   * Subheading text, optional.
   * @type {string}
   * @default ''
   */
  @property({ type: String })
  subheader = '';

  /**
   * Body text, optional.
   * @type {string}
   * @default ''
   */
  @property({ type: String })
  modalBody = '';

  /**
   * Modal open state.
   * @type {boolean}
   * @default false
   */
  @property({ type: Boolean })
  showModal = false;

  /**
   * Subheader href to determine if is link.
   * @type {string}
   * @default ''
   */
  @property({ type: String })
  subheaderHref = '';

  /** Formatted timestamp value
   * @internal
   */
  @state()
  timestamp: string = KynModalWb._formatDate(Date.now());

  /**
   * Timestamp visible state.
   * @type {boolean}
   * @default false
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
              this.showModal = !this.showModal;
            }}
            @keydown=${(e: KeyboardEvent) => {
              if (e.key === 'Enter') {
                this.showModal = !this.showModal;
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
          <p id="modal-body">${this.modalBody}</p>
          <span ?hidden=${!this.timestampVisible} id="timestamp"
            >${this.timestamp}</span
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

  override updated(changedProperties: PropertyValues<this>): void {
    if (changedProperties.has('showModal')) {
      const player = this._modal.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 400,
        easing: 'ease-out',
        fill: 'forwards',
      });

      if (!this.showModal) {
        player.reverse();
      }
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-modal-wb': KynModalWb;
  }
}
