import { LitElement, html, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import Styles from './dropdownCategory.scss?inline';

/**
 * Dropdown category.
 * @slot unnamed - Slot for category title text.
 */
@customElement('kyn-dropdown-category')
export class DropdownCategory extends LitElement {
  static override styles = unsafeCSS(Styles);

  override render() {
    return html`
      <div class="category">
        <slot></slot>
      </div>
    `;
  }
}
