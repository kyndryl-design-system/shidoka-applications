import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import ModalScss from './aiModal.scss?inline';

import '../../reusable/button';
import expandIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/expand.svg';
import closeIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/close-simple.svg';
// ⬇️ Add these (adjust paths if your icon names differ)

import shrinkIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/shrink.svg';
/**
 * Modal.
 * @slot unnamed - Slot for modal body content.
 * @slot anchor - Slot for the anchor button content.
 * @slot header-inline - Slot for an inline header action (badge/button) rendered next to the title/label when using the default header.
 * @slot footer - Slot for the footer content which replaces the ok, cancel, and secondary buttons.
 * @fires on-close - Emits the modal close event with `returnValue` (`'ok'` or `'cancel'`).`detail:{ origEvent: PointerEvent,returnValue: string }`
 * @fires on-open - Emits the modal open event.
 * @fires on-resize - Emits when the modal toggles expanded state. `detail:{ expanded: boolean }`
 */
@customElement('kyn-modal-ai')
export class ModalAI extends LitElement {
  static override styles = unsafeCSS(ModalScss);

  /** Modal open state. */
  @property({ type: Boolean })
  accessor open = false;

  /** Modal size. `'auto'`, `'md'`, `'lg'`, or `'xl'`. */
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

  /** Function to execute before the modal can close. Exposes `returnValue` (`'ok'` or `'cancel'`). Must return `true` or `false`. */
  @property({ attribute: false })
  accessor beforeClose!: Function;

  /** Close button text. */
  @property({ type: String })
  accessor closeText = 'Close';

  /** Apply gradient to modal background */
  @property({ type: Boolean, reflect: true })
  accessor gradientBackground = false;

  /** The dialog element
   * @internal
   */
  @query('dialog')
  accessor _dialog!: HTMLDialogElement;

  /** Determines if the component is themed for GenAI.*/
  @property({ type: Boolean, reflect: true })
  accessor aiConnected = false;

  /** Disables scroll on the modal body to allow scrolling of nested elements inside. */
  @property({ type: Boolean })
  accessor disableScroll = false;

  /** Expanded (full-screen) state. */
  @property({ type: Boolean, reflect: true })
  accessor expanded = false;

  /** Expand button aria label text (i18n). */
  @property({ type: String })
  accessor expandText = 'Expand';

  /** Collapse button aria label text (i18n). */
  @property({ type: String })
  accessor collapseText = 'Collapse';

  override render() {
    const classes = {
      modal: true,
      'size--md': this.size === 'md',
      'size--lg': this.size === 'lg',
      'size--xl': this.size === 'xl',
      'ai-connected': this.aiConnected,
      'gradient-bkg': this.aiConnected && this.gradientBackground,
      expanded: this.expanded,
    };

    const headerActionsKind = this.aiConnected ? 'ghost-ai' : 'ghost';

    return html`
      <span class="anchor" @click=${this._openModal}>
        <slot name="anchor"></slot>
      </span>

      <dialog
        class="${classMap(classes)}"
        aria-labelledby="dialogLabel"
        aria-modal="true"
        tabindex="-1"
        @cancel=${(e: Event) => this._closeModal(e, 'cancel')}
        @keydown=${this._onKeydown}
      >
        <form method="dialog">
          <!-- Header -->
          <header
            @dblclick=${this._toggleExpand}
            title="Double-click to ${this.expanded ? 'collapse' : 'expand'}"
          >
            <div class="header-inner">
              <div class="header-text">
                <h1 id="dialogLabel">${this.titleText}</h1>
                ${this.labelText !== ''
                  ? html`<span class="label">${this.labelText}</span>`
                  : null}
              </div>

              <slot name="header-inline"></slot>

              <!-- Right controls: Expand + Close -->
              <div class="header-actions">
                <kyn-button
                  class="expand"
                  kind=${headerActionsKind}
                  size="small"
                  description=${this.expanded
                    ? this.collapseText
                    : this.expandText}
                  aria-pressed="${this.expanded ? 'true' : 'false'}"
                  @click=${this._toggleExpand}
                >
                  <span slot="icon">
                    ${this.expanded
                      ? unsafeSVG(shrinkIcon)
                      : unsafeSVG(expandIcon)}
                  </span>
                </kyn-button>

                <kyn-button
                  class="close"
                  kind=${headerActionsKind}
                  size="small"
                  description=${this.closeText}
                  @click=${(e: Event) => this._closeModal(e, 'cancel')}
                >
                  <span slot="icon">${unsafeSVG(closeIcon)}</span>
                </kyn-button>
              </div>
            </div>
          </header>

          <!-- Body -->
          <div tabindex="${this.disableScroll ? '-1' : '0'}">
            <slot></slot>
          </div>

          <!-- (Your footer remains in your base stylesheet / slots) -->
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
      // Reset expanded when closing, optional:
      this.expanded = false;
    }
  }

  private _toggleExpand = (e?: Event) => {
    e?.preventDefault();
    this.expanded = !this.expanded;
    this._emitResizeEvent();
    // lock body scroll behind <dialog> (optional safety if your base CSS doesn't already)
    if (this.expanded) {
      document.documentElement.style.setProperty(
        '--kyn-modal-ai-overflow',
        document.body.style.overflow || ''
      );
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow =
        getComputedStyle(document.documentElement).getPropertyValue(
          '--kyn-modal-ai-overflow'
        ) || '';
      document.documentElement.style.removeProperty('--kyn-modal-ai-overflow');
    }
  };

  private _onKeydown = (e: KeyboardEvent) => {
    // Example keybind for expand: Ctrl/Cmd + Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      this._toggleExpand(e);
    }
  };

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

  private _emitResizeEvent() {
    const event = new CustomEvent('on-resize', {
      detail: { expanded: this.expanded },
      bubbles: true,
      composed: true,
    });
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
    'kyn-modal-ai': ModalAI;
  }
}
