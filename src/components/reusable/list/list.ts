import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import ListStyles from './list.scss';

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

  override render() {
    return html`
      <div class="list-title-container">
        <slot name="icon"></slot>
        <slot name="title"></slot>
      </div>
      ${this.listType === 'unordered'
        ? html`<ul>
            <slot></slot>
          </ul>`
        : html`<ol>
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
