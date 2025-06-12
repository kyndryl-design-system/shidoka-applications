import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import PopoverScss from './popover.scss';

import '../modal';
import '../link';
import positionPopover from '../../../common/helpers/popoverHelper';

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
      (positionPopover as any).call(this);
    }
  }

  override firstUpdated() {
    const slot = this.shadowRoot!.querySelector('slot[name="link"]')!;
    slot.addEventListener('slotchange', () => this._updateLinkSlot());
    this._updateLinkSlot();
    setTimeout(() => (positionPopover as any).call(this), 0);
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
