import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import HeaderFlyoutsScss from './headerFlyouts.scss';

/**
 * Container for header flyout items, aligns to the right, place last.
 * @slot unnamed - This element has a slot.
 */
@customElement('kyn-header-flyouts')
export class HeaderFlyouts extends LitElement {
  static override styles = HeaderFlyoutsScss;

  override render() {
    return html` <div class="header-flyouts"><slot></slot></div> `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-header-flyouts': HeaderFlyouts;
  }
}
