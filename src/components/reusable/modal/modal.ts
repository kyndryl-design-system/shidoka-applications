import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { LitElement, html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import ModalScss from './modal.scss';

import '../button';

import closeIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/close-simple.svg';

/**
 * Modal.
 * @slot unnamed - Slot for modal body content.
 * @slot anchor - Slot for the anchor button content.
 * @fires on-close - Emits the modal close event with `returnValue` (`'ok'` or `'cancel'`).
 * @fires on-open - Emits the modal open event.
 */
@customElement('kyn-modal')
export class Modal extends LitElement {
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
    `,
  ];

  /** Modal open state. */
  @property({ type: Boolean })
  open = false;

  /** Modal size. `'auto'`, `'md'`, or `'lg'`. */
  @property({ type: String })
  size = 'auto';

  /** Title/heading text, required. */
  @property({ type: String })
  titleText = '';

  /** Label text, optional. */
  @property({ type: String })
  labelText = '';

  /** OK button text. */
  @property({ type: String })
  okText = 'OK';

  /** Cancel button text. */
  @property({ type: String })
  cancelText = 'Cancel';

  /** Changes the primary button styles to indicate the action is destructive. */
  @property({ type: Boolean })
  destructive = false;

  /** Disables the primary button. */
  @property({ type: Boolean })
  okDisabled = false;

  /** Disables the secondary button. */
  @property({ type: Boolean })
  secondaryDisabled = false;

  /** Hides the footer/action buttons to create a passive modal. */
  @property({ type: Boolean })
  hideFooter = false;

  /** Secondary button text. */
  @property({ type: String })
  secondaryButtonText = 'Secondary';

  /** Hides the secondary button. */
  @property({ type: Boolean })
  showSecondaryButton = false;

  /** Hides the cancel button. */
  @property({ type: Boolean })
  hideCancelButton = false;

  /** Function to execute before the modal can close. Useful for running checks or validations before closing. Exposes `returnValue` (`'ok'` or `'cancel'`). Must return `true` or `false`. */
  @property({ attribute: false })
  beforeClose!: Function;

  /** Close button text. */
  @property({ type: String })
  closeText = 'Close';

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
        autofocus
        aria-labelledby="dialogLabel"
        @cancel=${(e: Event) => this._closeModal(e, 'cancel')}
      >
        <form method="dialog">
          <kyn-button
            class="close"
            ghost
            kind="tertiary"
            size="small"
            description=${this.closeText}
            @click=${(e: Event) => this._closeModal(e, 'cancel')}
          >
            <span slot="icon">${unsafeSVG(closeIcon)}</span>
          </kyn-button>
          <header>
            <div>
              <h1 id="dialogLabel">${this.titleText}</h1>
              ${this.labelText !== ''
                ? html`<span class="label">${this.labelText}</span>`
                : null}
            </div>
          </header>

          <div class="body">
            <slot></slot>
          </div>

          ${!this.hideFooter
            ? html`
                <div class="footer">
                  <kyn-button
                    class="action-button"
                    value="ok"
                    ?destructive=${this.destructive}
                    ?disabled=${this.okDisabled}
                    @click=${(e: Event) => this._closeModal(e, 'ok')}
                  >
                    ${this.okText}
                  </kyn-button>
                  ${this.showSecondaryButton
                    ? html`
                        <kyn-button
                          class="action-button"
                          value="Secondary"
                          kind="secondary"
                          ?disabled=${this.secondaryDisabled}
                          @click=${(e: Event) =>
                            this._closeModal(e, 'secondary')}
                        >
                          ${this.secondaryButtonText}
                        </kyn-button>
                      `
                    : null}
                  ${this.hideCancelButton
                    ? null
                    : html`
                        <kyn-button
                          class="action-button"
                          value="cancel"
                          kind="tertiary"
                          @click=${(e: Event) => this._closeModal(e, 'cancel')}
                        >
                          ${this.cancelText}
                        </kyn-button>
                      `}
                  <!--
            <div class="custom-actions">
              <slot name="actions"></slot>
            </div>
            -->
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

  private _closeModal(e: Event, returnValue: string) {
    if (
      !this.beforeClose ||
      (this.beforeClose && this.beforeClose(returnValue))
    ) {
      this.open = false;
      this._dialog.returnValue = returnValue;
      this._emitCloseEvent(e);
    }
  }

  private _emitCloseEvent(e: Event) {
    const event = new CustomEvent('on-close', {
      detail: {
        returnValue: this._dialog.returnValue,
        origEvent: e,
      },
    });
    this.dispatchEvent(event);
  }

  private _emitOpenEvent() {
    const event = new CustomEvent('on-open');
    this.dispatchEvent(event);
  }

  override updated(changedProps: any) {
    if (changedProps.has('open')) {
      if (this.open) {
        this._dialog.showModal();
        this._emitOpenEvent();
      } else {
        this._dialog.close();
      }
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-modal': Modal;
  }
}
