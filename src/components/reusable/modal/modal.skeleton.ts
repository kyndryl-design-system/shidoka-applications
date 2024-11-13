import { html, css, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import '../loaders/skeleton';

import '@kyndryl-design-system/shidoka-foundation/components/icon';

import closeIcon from '@carbon/icons/es/close/20';

import ModalScss from './modal.scss';

/**
 * `kyn-modal-skeleton` Web Component.
 * @slot anchor - Slot for the anchor button content.
 */
@customElement('kyn-modal-skeleton')
export class ModalSkeleton extends LitElement {
  static override styles = [
    ModalScss,
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

      .footer {
        width: 100%;
        white-space: nowrap;
      }

      .footer kyn-skeleton {
        display: inline-block;
        width: auto;
      }
    `,
  ];

  /** Modal open state. */
  @property({ type: Boolean })
  open = false;

  /** Modal size. `'auto'`, `'md'`, or `'lg'`. */
  @property({ type: String })
  size = 'auto';

  /** Hides the footer/action buttons to create a passive modal. */
  @property({ type: Boolean })
  hideFooter = false;

  /** Hides the secondary button. */
  @property({ type: Boolean })
  showSecondaryButton = false;

  /** Hides the cancel button. */
  @property({ type: Boolean })
  hideCancelButton = false;

  /** The dialog element
   * @internal
   */
  @query('dialog')
  _dialog!: any;

  override render() {
    const classes = {
      modal: true,
      'size--md': this.size === 'md',
      'size--lg': this.size === 'lg',
    };

    return html`
      <span class="anchor" @click=${this._openModal}>
        <slot name="anchor"></slot>
      </span>

      <dialog
        class="${classMap(classes)}"
        aria-labelledby="dialogLabel"
        @cancel=${() => this._closeModal()}
      >
        <form method="dialog">
          <button
            class="close"
            aria-label="Close"
            @click=${() => this._closeModal()}
          >
            <kd-icon .icon=${closeIcon}></kd-icon>
          </button>

          <header>
            <kyn-skeleton elementType="title"></kyn-skeleton>
          </header>

          <div class="body">
            <kyn-skeleton elementType="body-text"></kyn-skeleton>
          </div>

          ${!this.hideFooter
            ? html`
                <div class="footer">
                  <kyn-skeleton elementType="button" inline></kyn-skeleton>
                  ${this.showSecondaryButton
                    ? html`
                        <kyn-skeleton
                          elementType="button"
                          inline
                        ></kyn-skeleton>
                      `
                    : null}
                  ${this.hideCancelButton
                    ? null
                    : html`
                        <kyn-skeleton elementType="link" inline></kyn-skeleton>
                      `}
                </div>
              `
            : null}
        </form>
      </dialog>
    `;
  }

  private _openModal() {
    this.open = true;
  }

  private _closeModal() {
    this.open = false;
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
    'kyn-modal-skeleton': ModalSkeleton;
  }
}
