import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import ListStyles from './list.scss';
import { LIST_STYLE_TYPES } from './defs';

/**
 * Component for list.
 * @slot icon - Slot for an icon.
 * @slot title - Slot for title.
 * @slot unnamed - Slot for list items.
 */
@customElement('kyn-list')
export class List extends LitElement {
  static override styles = [ListStyles];

  /** List type - `ordered` or `unordered`. Default `unordered`.  */
  @property({ type: String })
  listType = 'unordered';

  /** List style type. Default is `disc`.
   *
   * Possible values include:
   *
   * **Unordered**:
   * - `none`
   * - `disc`
   * - `circle`
   * - `square`
   *
   * **Ordered**:
   * - `decimal`
   * - `lower-roman`
   * - `upper-roman`
   * - `lower-alpha`
   * - `upper-alpha`
   */
  @property({ type: String })
  listStyleType = LIST_STYLE_TYPES.DISC;

  override render() {
    return html`
      <div class="list-title-container">
        <slot name="icon"></slot>
        <slot name="title"></slot>
      </div>
      ${this.listType === 'unordered'
        ? html`<ul style="list-style-type: ${this.listStyleType}">
            <slot></slot>
          </ul>`
        : html`<ol style="list-style-type: ${this.listStyleType}">
            <slot></slot>
          </ol>`}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-list': List;
  }
}
