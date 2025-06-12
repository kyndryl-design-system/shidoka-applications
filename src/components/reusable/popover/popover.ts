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

  /** trigger style */
  @property({ type: String, reflect: true })
  triggerType: 'icon' | 'link' | 'button' = 'icon';

  /** positioning mode */
  @property({ type: String, reflect: true })
  mode: 'modal' | 'anchor' | 'floating' = 'anchor';

  /** Placement for anchor and floating. */
  @property({ type: String, reflect: true })
  placement: 'top' | 'bottom' | 'left' | 'right' = 'bottom';

  /** Direction for arrow orientation */
  @property({ type: String, reflect: true })
  direction: 'top' | 'bottom' | 'left' | 'right' = 'bottom';

  /** Anchor position for arrow alignment */
  @property({ type: String, reflect: true })
  anchorPosition: 'start' | 'center' | 'end' = 'center';

  /** Popover size, one of 'mini', 'narrow', or 'wide' */
  @property({ type: String })
  popoverSize: 'mini' | 'narrow' | 'wide' = 'mini';

  /** Controls popover visibility */
  @property({ type: Boolean })
  open = false;

  /** Title/heading text for the modal */
  @property({ type: String })
  titleText = '';

  /** Label text for the modal */
  @property({ type: String })
  labelText = '';

  /** OK button text */
  @property({ type: String })
  okText = 'OK';

  /** Cancel button text */
  @property({ type: String })
  cancelText = '';

  /** Close button text */
  @property({ type: String })
  closeText = '';

  /** Changes the primary button styles to indicate the action is destructive */
  @property({ type: Boolean })
  destructive = false;

  /** Disables the primary button */
  @property({ type: Boolean })
  okDisabled = false;

  /** Hides the footer/action buttons to create a passive modal */
  @property({ type: Boolean })
  hideFooter = false;

  /** Shows the secondary button */
  @property({ type: Boolean })
  showSecondaryButton = false;

  /** Secondary button text */
  @property({ type: String })
  secondaryButtonText = '';

  /** Disables the secondary button */
  @property({ type: Boolean })
  secondaryDisabled = false;

  /** Hides the cancel button */
  @property({ type: Boolean })
  hideCancelButton = false;

  /** Determines if the component is themed for GenAI */
  @property({ type: Boolean })
  aiConnected = false;

  /** Disables scroll on the modal body to allow scrolling of nested elements inside */
  @property({ type: Boolean })
  disableScroll = false;

  /** Function to execute before the modal can close */
  @property({ attribute: false })
  beforeClose!: () => void;

  /** Manual coords for floating mode (overrides anchor); accepts px, %, vw/vh, etc. */
  @property({ type: String }) top: string | number = 0;
  @property({ type: String }) left: string | number = 0;
  @property({ type: String }) right: string | number = 0;
  @property({ type: String }) bottom: string | number = 0;

  /** @internal Queries the .anchor element. */
  @query('.anchor')
  private _anchor!: HTMLElement;

  /** @internal Queries the modal host. */
  @query('kyn-modal.popover-modal')
  private _modalEl!: LitElement;

  /** Internal link slot detection. */
  @state()
  private hasLinkSlot = false;

  override render() {
    const popoverClasses = {
      [`type--${this.triggerType}`]: true,
      [`popover-size--${this.popoverSize}`]: true,
      [`direction--${this.direction}`]: this.mode === 'anchor',
      [`anchor--${this.anchorPosition}`]: this.mode === 'anchor',
    };

    return html`
      <div class=${classMap(popoverClasses)}>
        <span class="anchor" @click=${(e: MouseEvent) => this._toggle(e)}>
          <slot name="anchor"></slot>
        </span>

        <kyn-modal
          class="popover-modal"
          ?inline=${this.mode !== 'modal'}
          popoverExtended
          .popoverType=${this.mode}
          .open=${this.open}
          size=${this.popoverSize === 'wide' ? 'lg' : 'md'}
          titleText=${this.titleText}
          labelText=${this.labelText}
          okText=${this.okText}
          cancelText=${this.cancelText}
          closeText=${this.closeText}
          triggerType=${this.triggerType}
          ?destructive=${this.destructive}
          ?okDisabled=${this.okDisabled}
          ?hideFooter=${this.mode === 'anchor' || this.hideFooter}
          ?showSecondaryButton=${this.showSecondaryButton}
          secondaryButtonText=${this.secondaryButtonText}
          ?secondaryDisabled=${this.secondaryDisabled}
          ?hideCancelButton=${this.hideCancelButton}
          ?aiConnected=${this.aiConnected}
          ?disableScroll=${this.disableScroll}
          .beforeClose=${this.beforeClose}
          .popoverSize=${this.popoverSize}
          @on-close=${() => (this.open = false)}
        >
          <div class="expansion-container"><slot></slot></div>
          <div class="link-slot" ?hidden=${!this.hasLinkSlot}>
            <slot name="link"></slot>
          </div>
        </kyn-modal>
      </div>
    `;
  }

  override updated(changed: Map<string, unknown>) {
    if (
      changed.has('open') ||
      changed.has('top') ||
      changed.has('left') ||
      changed.has('placement') ||
      changed.has('mode')
    ) {
      this._position();
    }
  }

  private _position() {
    const dialogEl = this._modalEl.shadowRoot!.querySelector(
      'dialog'
    ) as HTMLDialogElement;
    if (!dialogEl) return;

    // Modal mode: fixed centering
    if (this.mode === 'modal') {
      Object.assign(dialogEl.style, {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        margin: '0',
      });
      return;
    }

    // Floating mode: fixed positioning via props
    if (this.mode === 'floating') {
      const { width: dW, height: dH } = dialogEl.getBoundingClientRect();
      const fmt = (v: string | number, axis: 'x' | 'y') => {
        if (typeof v === 'number' || /^\d+$/.test(String(v))) return `${v}px`;
        if (typeof v === 'string' && v.endsWith('%')) {
          const pct = parseFloat(v) / 100;
          const bound = axis === 'x' ? window.innerWidth : window.innerHeight;
          const size = axis === 'x' ? dW : dH;
          return `${pct * bound - size / 2}px`;
        }
        return `${v}`;
      };
      const style: Partial<CSSStyleDeclaration> = {
        position: 'fixed',
        margin: '0',
        transform: 'none',
        top: 'auto',
        bottom: 'auto',
        left: 'auto',
        right: 'auto',
      };
      if (this.left != null && this.left !== '')
        style.left = fmt(this.left, 'x');
      if (this.right != null && this.right !== '')
        style.right = fmt(this.right, 'x');
      if (this.bottom != null && this.bottom !== '')
        style.bottom = fmt(this.bottom, 'y');
      else style.top = fmt(this.top, 'y');
      Object.assign(dialogEl.style, style);
      return;
    }

    // Anchor mode: precise alignment with anchor
    this.direction = this.placement;

    const anchorRect = this._anchor.getBoundingClientRect();
    const dialogRect = dialogEl.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const offset = 0; // set to 6 or higher for gap between popover and anchor

    // Compute arrow anchor position (start/center/end)
    let anchorPos: 'start' | 'center' | 'end' = 'center';
    if (this.placement === 'top' || this.placement === 'bottom') {
      if (anchorRect.left > viewportWidth * 0.67) anchorPos = 'end';
      else if (anchorRect.left > viewportWidth * 0.33) anchorPos = 'center';
      else anchorPos = 'start';
    } else {
      if (anchorRect.top > viewportHeight * 0.67) anchorPos = 'end';
      else if (anchorRect.top > viewportHeight * 0.33) anchorPos = 'center';
      else anchorPos = 'start';
    }
    this.anchorPosition = anchorPos;

    // Align the popover precisely to the anchor
    let top = 0,
      left = 0;
    switch (this.placement) {
      case 'top':
        top = Math.round(anchorRect.top - dialogRect.height - offset);
        left = Math.round(
          anchorRect.left + anchorRect.width / 2 - dialogRect.width / 2
        );
        break;
      case 'bottom':
        top = Math.round(anchorRect.bottom + offset);
        left = Math.round(
          anchorRect.left + anchorRect.width / 2 - dialogRect.width / 2
        );
        break;
      case 'left':
        top = Math.round(
          anchorRect.top + anchorRect.height / 2 - dialogRect.height / 2
        );
        left = Math.round(anchorRect.left - dialogRect.width - offset);
        break;
      case 'right':
        top = Math.round(
          anchorRect.top + anchorRect.height / 2 - dialogRect.height / 2
        );
        left = Math.round(anchorRect.right + offset);
        break;
    }

    // Clamp to viewport
    if (top + dialogRect.height > viewportHeight)
      top = viewportHeight - dialogRect.height;
    if (top < 0) top = 0;
    if (left + dialogRect.width > viewportWidth)
      left = viewportWidth - dialogRect.width;
    if (left < 0) left = 0;

    Object.assign(dialogEl.style, {
      position: 'absolute',
      left: `${left}px`,
      top: `${top}px`,
      margin: '0',
    });
  }

  override firstUpdated() {
    const slot = this.shadowRoot!.querySelector('slot[name="link"]')!;
    slot.addEventListener('slotchange', () => this._updateLinkSlot());
    this._updateLinkSlot();
    setTimeout(() => this._position(), 0);
  }

  private _updateLinkSlot() {
    const slot = this.renderRoot.querySelector(
      'slot[name="link"]'
    ) as HTMLSlotElement;
    this.hasLinkSlot = (slot.assignedNodes({ flatten: true }) ?? []).some(
      (n) =>
        n.nodeType !== Node.TEXT_NODE || (n.textContent?.trim() ?? '') !== ''
    );
  }

  private _toggle(e: MouseEvent) {
    this.open = !this.open;
    if (this.mode !== 'floating') {
      this.left = e.clientX;
      this.top = e.clientY;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-popover': Popover;
  }
}
