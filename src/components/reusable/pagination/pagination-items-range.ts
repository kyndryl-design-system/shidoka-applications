import { html, LitElement } from 'lit';
import { property, customElement, state } from 'lit/decorators.js';

import { SHOWING_TEXT, OF_TEXT, ITEMS_TEXT, BREAKPOINT } from './constants';
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
  @property({ type: Number })
  count = 0;

  /** Current page number being displayed. */
  @property({ type: Number })
  pageNumber = 0;

  /** Number of items displayed per page. */
  @property({ type: Number })
  pageSize = 5;

  /**
   * Determines the device type the component is being rendered on.
   * @ignore
   */
  @state()
  isMobile = window.innerWidth < BREAKPOINT;

  private get itemsRangeText(): string {
    const baseTotalItemsByPage = this.pageSize * this.pageNumber;
    const lowerRangeItemsCount =
      baseTotalItemsByPage > 0
        ? baseTotalItemsByPage - this.pageSize + 1
        : baseTotalItemsByPage;
    const higherRangeItemsCount =
      baseTotalItemsByPage < this.count ? baseTotalItemsByPage : this.count;

    return this.isMobile
      ? `${lowerRangeItemsCount}\u2014${higherRangeItemsCount} ${OF_TEXT} ${this.count}`
      : `${SHOWING_TEXT} ${lowerRangeItemsCount} \u2014 ${higherRangeItemsCount} ${OF_TEXT} ${this.count} ${ITEMS_TEXT}`;
  }

  override render() {
    return html`
      <span role="status" aria-live="polite">${this.itemsRangeText}</span>
    `;
  }
}

// Define the custom element in the global namespace
declare global {
  interface HTMLElementTagNameMap {
    'kyn-pagination-items-range': PaginationItemsRange;
  }
}
