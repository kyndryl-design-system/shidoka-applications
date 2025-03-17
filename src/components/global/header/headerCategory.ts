import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import HeaderCategoryScss from './headerCategory.scss';

/**
 * Header link category
 * @slot unnamed - Slot for links.
 * @slot icon - Slot for icon.
 */
@customElement('kyn-header-category')
export class HeaderCategory extends LitElement {
  static override styles = HeaderCategoryScss;

  /** Category text. */
  @property({ type: String })
  heading = '';

  override render() {
    return html`
      <div class="category">
        <div class="heading">
          <slot name="icon"></slot>
          ${this.heading}
        </div>
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-header-category': HeaderCategory;
  }
}
