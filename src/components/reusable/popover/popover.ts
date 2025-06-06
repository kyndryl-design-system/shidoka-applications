import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import PopoverScss from './popover.scss';

import '../modal';
/**
 * Popover component.
 * @slot unnamed - Slot for content that appears at different sizes (wide, narrow, mini).
 * @slot anchor - Element that triggers the popover.
 */

@customElement('kyn-popover')
export class Popover extends LitElement {
  static override styles = [PopoverScss];

  /** Popover display type */
  @property({ type: String })
  type: 'icon' | 'link' | 'button' = 'icon';

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
  beforeClose!: Function;

  /**
   * Maps popoverSize to modal size values
   * All set to auto and controlled by CSS
   */
  get size(): string {
    return 'auto'; // Use auto for all sizes and control width via CSS
  }

  /** Toggles the popover open state
   * @internal
   */
  private _toggle() {
    this.open = !this.open;
    console.log('Toggle popover:', this.open); // Add logging to debug
  }

  private getDialogWidth(): string {
    const widths = {
      mini: '400px',
      narrow: '500px',
      wide: '600px',
    };
    return widths[this.popoverSize] || 'auto';
  }

  override updated(changedProps: any) {
    super.updated(changedProps);

    if (changedProps.has('popoverSize') || changedProps.has('open')) {
      setTimeout(() => {
        const modal = this.shadowRoot?.querySelector('kyn-modal');
        if (modal) {
          modal.style.setProperty('--dialog-width', this.getDialogWidth());
        }
      }, 0);
    }
  }

  override render() {
    const popoverClasses = {
      [`type--${this.type}`]: true,
      [`popover-size--${this.popoverSize}`]: true,
    };

    return html`
      <div class=${classMap(popoverClasses)}>
        <span class="anchor" @click=${() => this._toggle()}>
          <slot name="anchor"></slot>
        </span>

        <kyn-modal
          class="popover-modal"
          .open=${this.open}
          size=${'auto'}
          style="--dialog-width: ${this.getDialogWidth()};"
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
          @on-close=${() => (this.open = false)}
        >
          <div class="expansion-container">
            <slot></slot>
          </div>
        </kyn-modal>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-popover': Popover;
  }
}
