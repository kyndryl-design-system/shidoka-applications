import { LitElement, html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import ModalStyles from './kyn-modal-wb.scss';

import '@kyndryl-design-system/shidoka-foundation/components/button';
import '@kyndryl-design-system/shidoka-foundation/components/icon';
import '@kyndryl-design-system/shidoka-foundation/components/link';

import closeIcon from '@carbon/icons/es/close/20';

/**
 * Modal.
 * @slot anchor - Slot for the anchor button content.
 * @slot modalBody - Slot for the modal body content.
 */
@customElement('kyn-modal-wb')
export class KynModalWb extends LitElement {
  static override styles = [
    ModalStyles,
    css`
      @supports (transition-behavior: allow-discrete) {
        @starting-style {
          dialog[open] {
            opacity: 0;
            transform: scale(0);
          }
        }

        @starting-style {
          dialog[open]::backdrop {
            background-color: rgb(0, 0, 0, 0);
          }
        }
      }
    `,
  ];

  /**
   * Modal open state.
   */
  @property({ type: Boolean })
  open = false;

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
   * Primary button text, optional.
   */
  @property({ type: String })
  primaryButtonText = '';

  /**
   * Secondary button text, optional.
   */
  @property({ type: String })
  secondaryButtonText = '';

  /**
   * Modal destructive bool.
   */
  @property({ type: Boolean })
  destructive = false;

  /**
   * Subheader href to determine if is link.
   */
  @property({ type: String })
  subheaderHref = '';

  /** The dialog element
   * @internal
   */
  @query('dialog')
  _dialog!: any;

  override render() {
    const classes = {
      modal: true,
      'size--auto': this.size === 'auto',
      'size--sm': this.size === 'sm',
      'size--md': this.size === 'md',
      'size--lg': this.size === 'lg',
    };

    return html`
      <span class="anchor" @click=${this._toggleModal}>
        <slot name="anchor"></slot>
      </span>

      <dialog
        class="${classMap(classes)}"
        autofocus
        aria-labelledby="dialogLabel"
        @cancel=${this._toggleModal}
      >
        <form method="dialog">
          <button class="close" @click=${this._toggleModal}>
            <kd-icon .icon=${closeIcon}></kd-icon>
          </button>

          <header>
            <div>
              <h1 id="dialogLabel">${this.modalTitle}</h1>
              ${this.subheader
                ? html` <h2 id="modal-subheader">
                    ${!this.subheaderHref
                      ? html`<span>${this.subheader}</span>`
                      : html`<kd-link standalone href=${this.subheaderHref}
                          >${this.subheader}</kd-link
                        >`}
                  </h2>`
                : null}
            </div>
          </header>

          <div class=${`body modal-body-${this.size}`}>
            <slot name="modal-body"></slot>
          </div>

          <div class="footer">
            <kd-button
              class="action-button"
              value="ok"
              ?destructive=${this.destructive}
              @click=${this._toggleModal}
            >
              ${this.primaryButtonText}
            </kd-button>
            <kd-button
              class="action-button"
              value="Secondary"
              kind="secondary"
              @click=${this._toggleModal}
            >
              ${this.secondaryButtonText}
            </kd-button>
          </div>
        </form>
      </dialog>
    `;
  }

  private _toggleModal() {
    this.open = !this.open;
  }

  override updated(changedProps: any) {
    if (changedProps.has('open')) {
      if (this.open) {
        this._dialog.showModal();
      } else {
        this._dialog.close();
      }
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-modal-wb': KynModalWb;
  }
}
