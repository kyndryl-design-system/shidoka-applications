import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';

// Predefined drawer widths in px, matching the size prop
const DRAWER_WIDTHS: Record<'sm' | 'standard' | 'md' | 'xl', number> = {
  sm: 384,
  standard: 560,
  md: 800,
  xl: 1024,
};

import '../button';
import closeIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/close-simple.svg';

import SideDrawerScss from './sideDrawer.scss?inline';

/**
 * Side Drawer.
 * @slot unnamed - Slot for drawer body content.
 * @slot anchor - Slot for the anchor button content.
 * @slot header-inline - Slot for an inline header action (badge/button) rendered next to the title/label when using the default header.
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

  /** Apply gradient to modal background */
  @property({ type: Boolean, reflect: true })
  accessor gradientBackground = false;

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

  /** Set this to `true` to add a horizontal resize drag handle */
  @property({ type: Boolean })
  accessor resizable = false;

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
      'gradient-bkg': this.aiConnected && this.gradientBackground,
      resizable: this.resizable,
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
          <kyn-button
            class="side-drawer-close-btn"
            size="small"
            kind=${this.aiConnected ? 'ghost-ai' : 'ghost'}
            description=${ifDefined(this.closeBtnDescription)}
            @click=${(e: Event) => this._closeDrawer(e, 'cancel')}
          >
            <span slot="icon">${unsafeSVG(closeIcon)}</span>
          </kyn-button>

          <!--  Header -->
          <header>
            <div class="header-inner">
              <div class="header-label-title">
                <h1 class="${classMap(dialogHeaderClasses)}" id="dialogLabel">
                  ${this.titleText}
                </h1>
                ${this.labelText !== ''
                  ? html`<span class="label">${this.labelText}</span>`
                  : null}
              </div>

              <slot name="header-inline"></slot>
            </div>
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
                            kind=${this.aiConnected ? 'ghost-ai' : 'ghost'}
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
        this._setupResizeObserver();
      } else {
        this._dialog.close();
        this._teardownResizeObserver();
      }
    }
  }

  /** @internal */
  private _resizeHandler = (event?: Event) => {
    // Only handle user-initiated resizes (mouse events)
    if (event && !(event instanceof MouseEvent)) return;
    if (!this._dialog) return;
    let width = this._dialog.offsetWidth;
    const minWidth = DRAWER_WIDTHS.sm;
    const maxWidth = DRAWER_WIDTHS.xl;
    if (width < minWidth) width = minWidth;
    if (width > maxWidth) width = maxWidth;
    // Find the closest predefined width within allowed range
    let closestSize: 'sm' | 'md' | 'xl' | 'standard' = 'md';
    let minDiff = Infinity;
    for (const [size, px] of Object.entries(DRAWER_WIDTHS)) {
      if (px < minWidth || px > maxWidth) continue;
      const diff = Math.abs(width - px);
      if (diff < minDiff) {
        minDiff = diff;
        closestSize = size as 'sm' | 'md' | 'xl' | 'standard';
      }
    }
    const snapWidth = DRAWER_WIDTHS[closestSize];
    // Always respect the CSS max-width (responsive)
    this._dialog.style.width = snapWidth + 'px';
    if (this.size !== closestSize) {
      this.size = closestSize;
    }
  };

  private _setupResizeObserver() {
    this._dialog.addEventListener('mousemove', this._resizeHandler, true);
    this._dialog.addEventListener('mouseup', this._resizeHandler, true);
  }

  private _teardownResizeObserver() {
    if (this._dialog && this._dialog.style) {
      this._dialog.removeEventListener('mousemove', this._resizeHandler, true);
      this._dialog.removeEventListener('mouseup', this._resizeHandler, true);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-side-drawer': SideDrawer;
  }
}
