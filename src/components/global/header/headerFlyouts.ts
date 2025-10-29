import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { querySelectorAllDeep } from 'query-selector-shadow-dom';
import HeaderFlyoutsScss from './headerFlyouts.scss?inline';

import overflowIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/overflow.svg';

/**
 * Container for header-flyout components.
 * @slot unnamed - Slot for header-flyout components.
 */
@customElement('kyn-header-flyouts')
export class HeaderFlyouts extends LitElement {
  static override styles = unsafeCSS(HeaderFlyoutsScss);

  /* Menu open state (small breakpoint). */
  @property({ type: Boolean })
  accessor open = false;

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

  private _handleFlyoutToggle() {
    this._emitFlyoutsToggle();
  }

  private _emitFlyoutsToggle() {
    const Flyouts: Array<any> = querySelectorAllDeep('kyn-header-flyout', this);

    const event = new CustomEvent('on-flyouts-toggle', {
      composed: true,
      bubbles: true,
      detail: {
        open: this.open,
        childrenOpen: Flyouts.some((flyout: any) => flyout.open),
      },
    });
    this.dispatchEvent(event);
  }

  override willUpdate(changedProps: any) {
    if (changedProps.has('open')) {
      this._emitFlyoutsToggle();
    }
  }

  override connectedCallback() {
    super.connectedCallback();

    document.addEventListener('click', (e) => this._handleClickOut(e));
    document.addEventListener('on-flyout-toggle', () =>
      this._handleFlyoutToggle()
    );
  }

  override disconnectedCallback() {
    document.removeEventListener('click', (e) => this._handleClickOut(e));
    document.removeEventListener('on-flyout-toggle', () =>
      this._handleFlyoutToggle()
    );

    super.disconnectedCallback();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-header-flyouts': HeaderFlyouts;
  }
}
