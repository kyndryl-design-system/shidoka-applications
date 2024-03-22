import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import HeaderFlyoutsScss from './headerFlyouts.scss';

import '@kyndryl-design-system/shidoka-foundation/components/icon';
import overflowIcon from '@carbon/icons/es/overflow-menu--vertical/20';

/**
 * Container for header-flyout components..
 * @slot unnamed - Slot for header-flyout components.
 */
@customElement('kyn-header-flyouts')
export class HeaderFlyouts extends LitElement {
  static override styles = HeaderFlyoutsScss;

  /* Menu open state (small breakpoint). */
  @property({ type: Boolean })
  open = false;

  override render() {
    return html`
      <div class="header-flyouts menu ${this.open ? 'open' : ''}">
        <button
          class="btn interactive"
          aria-label="Toggle Menu"
          title="Toggle Menu"
          @click=${() => this._toggleOpen()}
        >
          <kd-icon .icon=${overflowIcon}></kd-icon>
        </button>

        <div class="menu__content">
          <slot></slot>
        </div>
      </div>
    `;
  }

  private _toggleOpen() {
    this.open = !this.open;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-header-flyouts': HeaderFlyouts;
  }
}
