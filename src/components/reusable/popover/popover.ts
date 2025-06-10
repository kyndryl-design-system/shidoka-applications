import { LitElement, html } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import PopoverScss from './popover.scss';

import '../modal';
import '../link';

/**
 * Popover component.
 * @slot unnamed - Slot for content that appears at different sizes (wide, narrow, mini).
 * @slot anchor - Element that triggers the popover.
 * @slot link - Optional slot for a link element.
 */
@customElement('kyn-popover')
export class Popover extends LitElement {
  static override styles = [PopoverScss];

  /** Popover display type */
  @property({ type: String }) type: 'icon' | 'link' | 'button' = 'icon';

  /** Popover size, one of 'mini', 'narrow', or 'wide' */
  @property({ type: String }) popoverSize: 'mini' | 'narrow' | 'wide' = 'mini';

  /** Controls popover visibility */
  @property({ type: Boolean }) open = false;

  /** Title/heading text for the modal */
  @property({ type: String }) titleText = '';

  /** Label text for the modal */
  @property({ type: String }) labelText = '';

  /** OK button text */
  @property({ type: String }) okText = 'OK';

  /** Cancel button text */
  @property({ type: String }) cancelText = '';

  /** Close button text */
  @property({ type: String }) closeText = '';

  /** Changes the primary button styles to indicate the action is destructive */
  @property({ type: Boolean }) destructive = false;

  /** Disables the primary button */
  @property({ type: Boolean }) okDisabled = false;

  /** Hides the footer/action buttons to create a passive modal */
  @property({ type: Boolean }) hideFooter = false;

  /** Shows the secondary button */
  @property({ type: Boolean }) showSecondaryButton = false;

  /** Secondary button text */
  @property({ type: String }) secondaryButtonText = '';

  /** Disables the secondary button */
  @property({ type: Boolean }) secondaryDisabled = false;

  /** Hides the cancel button */
  @property({ type: Boolean }) hideCancelButton = false;

  /** Determines if the component is themed for GenAI */
  @property({ type: Boolean }) aiConnected = false;

  /** Disables scroll on the modal body to allow scrolling of nested elements inside */
  @property({ type: Boolean }) disableScroll = false;

  /** Function to execute before the modal can close */
  @property({ attribute: false }) beforeClose!: () => void;

  /** Queries the .anchor element.
   * @internal
   */
  @query('.anchor')
  private _anchor!: HTMLElement;

  /** Queries the dialog element.
   * @internal
   */
  @query('dialog')
  private _dialog!: HTMLDialogElement;

  /** Internal link slot detection.
   * @internal
   */
  @state()
  private hasLinkSlot = false;

  override render() {
    const popoverClasses = {
      [`type--${this.type}`]: true,
      [`popover-size--${this.popoverSize}`]: true,
    };

    return html`
      <div class=${classMap(popoverClasses)}>
        <span class="anchor" @click=${this._toggle}>
          <slot name="anchor"></slot>
        </span>

        <kyn-modal
          class="popover-modal popover-size--${this
            .popoverSize} popover-type--${this.type}"
          .open=${this.open}
          size=${this.popoverSize === 'wide' ? 'lg' : 'md'}
          titleText=${this.titleText}
          labelText=${this.labelText}
          okText=${this.okText}
          cancelText=${this.cancelText}
          closeText=${this.closeText}
          ?destructive=${this.destructive}
          ?okDisabled=${this.okDisabled}
          ?hideFooter=${this.hideFooter}
          ?showSecondaryButton=${this.showSecondaryButton}
          secondaryButtonText=${this.secondaryButtonText}
          ?secondaryDisabled=${this.secondaryDisabled}
          ?hideCancelButton=${this.hideCancelButton}
          ?aiConnected=${this.aiConnected}
          ?disableScroll=${this.disableScroll}
          .beforeClose=${this.beforeClose}
          popoverExtended
          popoverSize=${this.popoverSize}
          popoverType=${this.type}
          @on-close=${() => (this.open = false)}
        >
          <div class="expansion-container">
            <slot></slot>
          </div>

          <div class="link-slot" ?hidden=${!this.hasLinkSlot}>
            <slot name="link"></slot>
          </div>
        </kyn-modal>
      </div>
    `;
  }

  override updated(changed: Map<string, any>) {
    if (changed.has('open') && this.open && this.type === 'icon') {
      this._positionTooltip();
    }
  }

  override firstUpdated() {
    const slot =
      this.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="link"]');
    slot?.addEventListener('slotchange', () => this._updateLinkSlot());
    this._updateLinkSlot();
  }

  private _updateLinkSlot() {
    const slot =
      this.renderRoot.querySelector<HTMLSlotElement>('slot[name="link"]');
    const nodes = slot?.assignedNodes({ flatten: true }) ?? [];
    this.hasLinkSlot = nodes.some(
      (n) =>
        n.nodeType !== Node.TEXT_NODE || (n.textContent?.trim() ?? '') !== ''
    );
  }

  private _positionTooltip() {
    if (!this._anchor || !this._dialog) return;
    const rect = this._anchor.getBoundingClientRect();
    this._dialog.style.position = 'absolute';
    this._dialog.style.top = `${rect.bottom + window.scrollY + 6}px`;
    this._dialog.style.left = `${
      rect.left + window.scrollX - this._dialog.offsetWidth / 2 + rect.width / 2
    }px`;
  }

  private _toggle() {
    this.open = !this.open;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-popover': Popover;
  }
}
