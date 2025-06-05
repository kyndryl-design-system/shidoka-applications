import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import PopoverScss from './popover.scss';

import '../modal';
/**
 * Popover component.
 * @slot unnamed - Main content of the popover.
 * @slot anchor - Element that triggers the popover.
 * @slot expansion - Slot for expansion content that appears at different sizes (wide, narrow, mini).
 */

@customElement('kyn-popover')
export class Popover extends LitElement {
  static override styles = [PopoverScss];

  /** Popover display type */
  @property({ type: String })
  type: 'icon' | 'link' | 'button' = 'icon';

  /** Popover size, one of 'mini', 'narrow', or 'wide' */
  @property({ type: String })
  size: 'mini' | 'narrow' | 'wide' = 'mini';

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
  cancelText = 'Cancel';

  /** Close button text */
  @property({ type: String })
  closeText = 'Close';

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
  secondaryButtonText = 'Secondary';

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

  private _toggle() {
    this.open = !this.open;
  }

  override render() {
    const modalClasses = {
      [`type--${this.type}`]: true,
      [`size--${this.size}`]: true,
    };

    return html`
      <span class="anchor" @click=${this._toggle}>
        <slot name="anchor"></slot>
      </span>

      <kyn-modal
        ?open=${this.open}
        size=${this.size}
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
        class=${classMap(modalClasses)}
        @on-close=${() => (this.open = false)}
      >
        <slot></slot>
        <div class="expansion-container">
          <slot name="expansion"></slot>
        </div>
      </kyn-modal>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-popover': Popover;
  }
}
