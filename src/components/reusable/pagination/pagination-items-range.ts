import { html, LitElement } from 'lit';
import { property, customElement } from 'lit/decorators.js';

// import { SHOWING_TEXT, OF_TEXT, ITEMS_TEXT } from './constants';
import styles from './pagination-items-range.scss';

/**
 * `kyn-pagination-items-range` Web Component.
 *
 * This component is responsible for displaying the range of items being displayed
 * in the context of pagination. It shows which items (by number) are currently visible
 * and the total number of items.
 */
@customElement('kyn-pagination-items-range')
export class PaginationItemsRange extends LitElement {
  static override styles = [styles];

  /** Total number of items. */
  @property({ type: Number, reflect: true })
  count = 0;

  /** Current page number being displayed. */
  @property({ type: Number, reflect: true })
  pageNumber = 1;

  /** Number of items displayed per page. */
  @property({ type: Number, reflect: true })
  pageSize = 5;

  /** Customizable text strings. Inherited from parent
   * @internal
   */
  @property({ type: Object })
  textStrings: any = {};

  private itemsRangeText(isMobile: Boolean): string {
    const baseTotalItemsByPage = this.pageSize * this.pageNumber;
    const lowerRangeItemsCount =
      baseTotalItemsByPage > 0
        ? baseTotalItemsByPage - this.pageSize + 1
        : baseTotalItemsByPage;
    const higherRangeItemsCount =
      baseTotalItemsByPage < this.count ? baseTotalItemsByPage : this.count;

    return isMobile
      ? `${lowerRangeItemsCount}\u2014${higherRangeItemsCount} ${this.textStrings.of} ${this.count}`
      : `${this.textStrings.showing} ${lowerRangeItemsCount} \u2014 ${higherRangeItemsCount} ${this.textStrings.of} ${this.count} ${this.textStrings.items}`;
  }

  override render() {
    return html`
      <span role="status" aria-live="polite">
        <span class="mobile">${this.itemsRangeText(true)}</span>
        <span class="desktop">${this.itemsRangeText(false)}</span>
      </span>
    `;
  }
}

// Define the custom element in the global namespace
declare global {
  interface HTMLElementTagNameMap {
    'kyn-pagination-items-range': PaginationItemsRange;
  }
}
