import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import HeaderFlyoutsScss from './headerFlyouts.scss';

import overflowIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/overflow.svg';

/**
 * Container for header-flyout components.
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
          <span class="overflow-icon">${unsafeSVG(overflowIcon)}</span>
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

  private _handleClickOut(e: Event) {
    if (!e.composedPath().includes(this)) {
      this.open = false;
    }
  }

  override willUpdate(changedProps: any) {
    if (changedProps.has('open')) {
      const event = new CustomEvent('on-flyouts-toggle', {
        composed: true,
        bubbles: true,
        detail: { open: this.open },
      });
      this.dispatchEvent(event);
    }
  }

  override connectedCallback() {
    super.connectedCallback();

    document.addEventListener('click', (e) => this._handleClickOut(e));
  }

  override disconnectedCallback() {
    document.removeEventListener('click', (e) => this._handleClickOut(e));

    super.disconnectedCallback();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-header-flyouts': HeaderFlyouts;
  }
}
