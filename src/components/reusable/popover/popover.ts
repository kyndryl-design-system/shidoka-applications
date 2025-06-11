// Popover.ts
import { LitElement, html } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { computePosition, offset, flip } from '@floating-ui/dom';
import PopoverScss from './popover.scss';
import '../modal';
import '../link';

@customElement('kyn-popover')
export class Popover extends LitElement {
  static override styles = [PopoverScss];

  /** trigger style */
  @property({ type: String, reflect: true })
  triggerType: 'icon' | 'link' | 'button' = 'icon';

  /** positioning mode */
  @property({ type: String, reflect: true })
  mode: 'modal' | 'anchor' | 'floating' = 'anchor';

  /** fine-tune floating placement */
  @property({ type: String })
  placement: 'top' | 'bottom' | 'left' | 'right' = 'bottom';

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

  /** manual coords for floating mode (overrides anchor) -- x coord */
  @property({ type: Number })
  x = 0;
  y = 0;

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
      [`type--${this.triggerType}`]: true,
      [`popover-size--${this.popoverSize}`]: true,
    };

    return html`
      <div class=${classMap(popoverClasses)}>
        <span class="anchor" @click=${this._toggle}>
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
          ?hideFooter=${this.hideFooter}
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

  override updated(changed: Map<string, any>) {
    console.log('Updated values:', { x: this.x, y: this.y });
    if (
      changed.has('open') ||
      changed.has('x') ||
      changed.has('y') ||
      changed.has('placement') ||
      changed.has('mode')
    ) {
      this._position();
    }
  }

  private _position() {
    console.log('Positioning popover at:', { x: this.x, y: this.y });
    console.log('Dialog element before positioning:', this._dialog);
    console.log('Dialog element:', this._dialog);
    if (!this._dialog) {
      console.error('Dialog element is not available.');
      return;
    }
    console.log('Positioning popover at:', { x: this.x, y: this.y });
    if (
      this.mode === 'floating' &&
      typeof this.x === 'number' &&
      typeof this.y === 'number'
    ) {
      Object.assign(this._dialog.style, {
        position: 'fixed',
        left: `${this.x}px`,
        top: `${this.y}px`,
      });
      return;
    }

    computePosition(this._anchor, this._dialog, {
      placement: this.placement,
      strategy: this.mode === 'floating' ? 'fixed' : 'absolute',
      middleware: [offset(6), flip()],
    }).then(({ x, y }) => {
      Object.assign(this._dialog.style, {
        position: this.mode === 'floating' ? 'fixed' : 'absolute',
        left: `${x}px`,
        top: `${y}px`,
      });
    });
  }

  override firstUpdated() {
    const slot =
      this.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="link"]');
    slot?.addEventListener('slotchange', () => this._updateLinkSlot());
    this._updateLinkSlot();
    setTimeout(() => {
      this._position();
    }, 0);
  }

  private _updateLinkSlot() {
    const slot =
      this.renderRoot.querySelector<HTMLSlotElement>('slot[name="link"]');
    this.hasLinkSlot = (slot?.assignedNodes({ flatten: true }) ?? []).some(
      (n) =>
        n.nodeType !== Node.TEXT_NODE || (n.textContent?.trim() ?? '') !== ''
    );
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
