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

  /** Add left padding when icon is not provided to align text with links that do have icons. */
  @property({ type: Boolean })
  leftPadding = false;

  override render() {
    return html`
      <div class="category">
        <div class="heading ${this.leftPadding ? 'left-padding' : ''}">
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
