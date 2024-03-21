import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import HeaderCategoryScss from './headerCategory.scss';

/**
 * Header link category
 * @slot unnamed - Slot for links.
 */
@customElement('kyn-header-category')
export class HeaderCategory extends LitElement {
  static override styles = HeaderCategoryScss;

  /** Link url. */
  @property({ type: String })
  heading = '';

  override render() {
    return html`
      <div class="category">
        <div class="heading">${this.heading}</div>
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
