import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import HeaderFlyoutScss from './headerFlyout.scss';

/**
 * Component for header flyout items.
 * @slot unnamed - Slot for flyout menu content.
 * @slot button - Slot for button/toggle content.
 */
@customElement('kyn-header-flyout')
export class HeaderFlyout extends LitElement {
  static override styles = HeaderFlyoutScss;

  /** Anchor flyout menu to the left edge of the button instead of the right edge. */
  @property({ type: Boolean })
  anchorLeft = false;

  override render() {
    const contentClasses = {
      menu__content: true,
      'menu__content--left': this.anchorLeft,
    };

    return html`
      <div class="menu">
        <button class="btn interactive"><slot name="button"></slot></button>
        <div class=${classMap(contentClasses)}><slot></slot></div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-header-flyout': HeaderFlyout;
  }
}
