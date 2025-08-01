import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import ModalScss from './modal.scss?inline';

import '../button';

import closeIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/close-simple.svg';

/**
 * Modal.
 * @slot unnamed - Slot for modal body content.
 * @slot anchor - Slot for the anchor button content.
 * @slot footer - Slot for the footer content which replaces the ok, cancel, and second ary buttons.
 * @fires on-close - Emits the modal close event with `returnValue` (`'ok'` or `'cancel'`).`detail:{ origEvent: PointerEvent,returnValue: string }`
 * @fires on-open - Emits the modal open event.
 */
@customElement('kyn-modal')
export class Modal extends LitElement {
  static override styles = [
    unsafeCSS(ModalScss),
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
  accessor open = false;

  /** Modal size. `'auto'`, `'md'`, or `'lg', or `'xl'`. */
  @property({ type: String })
  accessor size = 'auto';

  /** Title/heading text, required. */
  @property({ type: String })
  accessor titleText = '';

  /** Label text, optional. */
  @property({ type: String })
  accessor labelText = '';

  /** OK button text. */
  @property({ type: String })
  accessor okText = 'OK';

  /** Cancel button text. */
  @property({ type: String })
  accessor cancelText = 'Cancel';

  /** Changes the primary button styles to indicate the action is destructive. */
  @property({ type: Boolean })
  accessor destructive = false;

  /** Disables the primary button. */
  @property({ type: Boolean })
  accessor okDisabled = false;

  /** Disables the secondary button. */
  @property({ type: Boolean })
  accessor secondaryDisabled = false;

  /** Hides the footer/action buttons to create a passive modal. */
  @property({ type: Boolean })
  accessor hideFooter = false;

  /** Secondary button text. */
  @property({ type: String })
  accessor secondaryButtonText = 'Secondary';

  /** Hides the secondary button. */
  @property({ type: Boolean })
  accessor showSecondaryButton = false;

  /** Hides the cancel button. */
  @property({ type: Boolean })
  accessor hideCancelButton = false;

  /** Function to execute before the modal can close. Useful for running checks or validations before closing. Exposes `returnValue` (`'ok'` or `'cancel'`). Must return `true` or `false`. */
  @property({ attribute: false })
  accessor beforeClose!: Function;

  /** Close button text. */
  @property({ type: String })
  accessor closeText = 'Close';

  /** The dialog element
   * @internal
   */
  @query('dialog')
  accessor _dialog!: any;

  /** Determines if the component is themed for GenAI.*/
  @property({ type: Boolean, reflect: true })
  accessor aiConnected = false;

  /** Disables scroll on the modal body to allow scrolling of nested elements inside. */
  @property({ type: Boolean })
  accessor disableScroll = false;

  override render() {
    const classes = {
      modal: true,
      'size--md': this.size === 'md',
      'size--lg': this.size === 'lg',
      'size--xl': this.size === 'xl',
      'ai-connected': this.aiConnected,
    };

    return html`
      <span class="anchor" @click=${this._openModal}>
        <slot name="anchor"></slot>
      </span>

      <dialog
        class="${classMap(classes)}"
        aria-labelledby="dialogLabel"
        tabindex="-1"
        @cancel=${(e: Event) => this._closeModal(e, 'cancel')}
      >
        <form method="dialog">
          <kyn-button
            class="close"
            kind="ghost"
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

          <div
            class="body ${this.disableScroll ? 'disableScroll' : ''}"
            tabindex="${this.disableScroll ? '-1' : '0'}"
          >
            <slot></slot>
          </div>

          ${!this.hideFooter
            ? html`
                <slot name="footer">
                  <div class="footer">
                    <kyn-button
                      class="action-button"
                      value="ok"
                      kind=${this.destructive
                        ? 'primary-destructive'
                        : this.aiConnected
                        ? 'primary-ai'
                        : 'primary'}
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
                            kind=${this.aiConnected ? 'outline-ai' : 'outline'}
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
                            kind="secondary"
                            @click=${(e: Event) =>
                              this._closeModal(e, 'cancel')}
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
                </slot>
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
