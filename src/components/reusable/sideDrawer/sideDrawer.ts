import { LitElement, html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import SideDrawerScss from './sideDrawer.scss';

import '@kyndryl-design-system/shidoka-foundation/components/button';
import '@kyndryl-design-system/shidoka-foundation/components/icon';
import closeIcon from '@carbon/icons/es/close/32';

/**
 * Side Drawer.
 * @slot unnamed - Slot for modal body content.
 * @slot anchor - Slot for the anchor button content.
 * @fires on-close - Emits the modal close event with `returnValue` (`'ok'` or `'cancel'`).
 */

@customElement('kyn-side-drawer')
export class SideDrawer extends LitElement {
  static override styles = SideDrawerScss;

  /**
   * Drawer open state.
   */
  @property({ type: Boolean })
  open = false;

  /**
   * Drawer size. `'md'`, or `'sm'`.
   */
  @property({ type: String })
  size = 'md';

  /**
   * Title / Heading text, required.
   */
  @property({ type: String })
  titleText = '';

  /**
   * Label text, optional.
   */
  @property({ type: String })
  labelText = '';

  /**
   * Submit button text.
   */
  @property({ type: String })
  submitBtnText = 'OK';

  /**
   * Cancel button text.
   */
  @property({ type: String })
  canceBtnText = 'Cancel';

  /** Changes the primary button styles to indicate the action is destructive. */
  @property({ type: Boolean })
  destructive = false;

  /** Disables the primary button. */
  @property({ type: Boolean })
  submitBtnDisabled = false;

  /** Function to execute before the Drawer can close. Useful for running checks or validations before closing. Exposes `returnValue` (`'ok'` or `'cancel'`). Must return `true` or `false`. */
  @property({ attribute: false })
  beforeClose!: Function;

  /** The dialog element
   * @internal
   */
  @query('dialog')
  _dialog!: any;

  override render() {
    return html`
      <button @click="${this._toggleDrawer}">Toggle Drawer</button>
      <dialog ?open="${this.open}">
        <slot></slot>
      </dialog>
    `;
  }

  private _toggleDrawer() {
    this.open = !this.open;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-side-drawer': SideDrawer;
  }
}
