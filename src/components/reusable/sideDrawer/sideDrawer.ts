import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import '../button';
import closeIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/close-simple.svg';

import SideDrawerScss from './sideDrawer.scss?inline';

/**
 * Side Drawer.
 * @slot unnamed - Slot for drawer body content.
 * @slot anchor - Slot for the anchor button content.
 * @fires on-close - Emits the drawer close event with `returnValue` (`'ok'` or `'cancel'`).`detail:{ origEvent: PointerEvent,returnValue: string }`
 * @fires on-open - Emits the drawer open event.
 */

@customElement('kyn-side-drawer')
export class SideDrawer extends LitElement {
  static override styles = [
    unsafeCSS(SideDrawerScss),
    css`
      @supports (transition-behavior: allow-discrete) {
        @starting-style {
          dialog[open] {
            transform: translateX(100%);
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
   * Drawer open state.
   */
  @property({ type: Boolean })
  accessor open = false;

  /**
   * Drawer size.
   */
  @property({ type: String })
  accessor size: 'md' | 'sm' | 'xl' | 'standard' = 'md';

  /**
   * Title / Heading text, required.
   */
  @property({ type: String })
  accessor titleText = '';

  /**
   * Label text, optional.
   */
  @property({ type: String })
  accessor labelText = '';

  /**
   * Submit button text.
   */
  @property({ type: String })
  accessor submitBtnText = 'Ok';

  /**
   * Cancel button text.
   */
  @property({ type: String })
  accessor cancelBtnText = 'Cancel';

  /** Close button description (Required to support accessibility). */
  @property({ type: String })
  accessor closeBtnDescription = 'Close';

  /** Disables the primary button. */
  @property({ type: Boolean })
  accessor submitBtnDisabled = false;

  /** Determine whether needs footer */
  @property({ type: Boolean })
  accessor hideFooter = false;

  /** Changes the primary button styles to indicate the action is destructive. */
  @property({ type: Boolean })
  accessor destructive = false;

  /** Secondary button text. */
  @property({ type: String })
  accessor secondaryButtonText = 'Secondary';

  /** Hides the secondary button. */
  @property({ type: Boolean })
  accessor showSecondaryButton = false;

  /** Hides the cancel button. */
  @property({ type: Boolean })
  accessor hideCancelButton = false;

  /** Function to execute before the Drawer can close. Useful for running checks or validations before closing. Exposes `returnValue` (`'ok'` or `'cancel'`). Must return `true` or `false`. */
  @property({ attribute: false })
  accessor beforeClose!: Function;

  /** Set this to `true` for AI theme. */
  @property({ type: Boolean })
  accessor aiConnected = false;

  /** Set this to `true` for no backdrop */
  @property({ type: Boolean })
  accessor noBackdrop = false;

  /** The dialog element
   * @internal
   */
  @query('dialog')
  accessor _dialog!: any;

  override render() {
    const classes = {
      dialog: true,
      'no-backdrop': this.noBackdrop,
      [`size--${this.size}`]: this.size,
      'ai-connected': this.aiConnected,
    };

    const dialogFooterClasses = {
      'dialog-footer': true,
      'ai-connected': this.aiConnected,
    };

    const dialogHeaderClasses = {
      'header-title': true,
      'ai-connected': this.aiConnected,
    };

    return html`
      <span class="anchor" @click=${this._openDrawer}>
        <slot name="anchor"></slot>
      </span>

      <dialog
        class="${classMap(classes)}"
        aria-labelledby="dialogLabel"
        tabindex="-1"
        @cancel=${(e: Event) => this._closeDrawer(e, 'cancel')}
      >
        <form method="dialog">
          <!--  Header -->
          <header>
            <div class="header-label-title">
              <h1 class="${classMap(dialogHeaderClasses)}" id="dialogLabel">
                ${this.titleText}
              </h1>
              ${this.labelText !== ''
                ? html`<span class="label">${this.labelText}</span>`
                : null}
            </div>

            <kyn-button
              class="side-drawer-close-btn"
              size="small"
              kind="ghost"
              description=${ifDefined(this.closeBtnDescription)}
              @click=${(e: Event) => this._closeDrawer(e, 'cancel')}
            >
              <span slot="icon">${unsafeSVG(closeIcon)}</span>
            </kyn-button>
          </header>

          <!-- Body -->
          <div
            class="body"
            role="region"
            aria-label="${this.titleText} content"
            tabindex="0"
          >
            <slot></slot>
          </div>

          <!-- footer -->
          ${!this.hideFooter
            ? html`
                <div class="${classMap(dialogFooterClasses)}">
                  <div class="actions">
                    <kyn-button
                      class="action-button"
                      value="Ok"
                      ?disabled=${this.submitBtnDisabled}
                      kind=${this.destructive
                        ? 'primary-destructive'
                        : this.aiConnected
                        ? 'primary-ai'
                        : 'primary'}
                      @click=${(e: Event) => this._closeDrawer(e, 'ok')}
                    >
                      ${this.submitBtnText}
                    </kyn-button>

                    ${this.showSecondaryButton
                      ? html`
                          <kyn-button
                            class="action-button"
                            value="Secondary"
                            kind=${'secondary'}
                            @click=${(e: Event) =>
                              this._closeDrawer(e, 'secondary')}
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
                            value="Cancel"
                            kind="ghost"
                            @click=${(e: Event) =>
                              this._closeDrawer(e, 'cancel')}
                          >
                            ${this.cancelBtnText}
                          </kyn-button>
                        `}
                  </div>
                </div>
              `
            : null}
        </form>
      </dialog>
    `;
  }

  private _openDrawer() {
    this.open = true;
  }

  private _closeDrawer(e: Event, returnValue: string) {
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
        if (this.noBackdrop) {
          this._dialog.show();
        } else {
          this._dialog.showModal();
        }
        this._emitOpenEvent();
      } else {
        this._dialog.close();
      }
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-side-drawer': SideDrawer;
  }
}
