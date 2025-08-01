import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { PAGE_SIZE_LABEL, PAGE_NUMBER_LABEL } from './constants.sample';
import styles from './pagination.scss?inline';

import './pagination-items-range';
import './pagination-page-size-dropdown';
import './pagination-navigation-buttons';

/**
 * `kyn-pagination` Web Component.
 *
 * A component that provides pagination functionality, enabling the user to
 * navigate through large datasets by splitting them into discrete chunks.
 * Integrates with other utility components like items range display, page size dropdown,
 * and navigation buttons.
 * @fires on-page-size-change - Dispatched when the page size changes.`detail:{ value: number }`
 * @fires on-page-number-change - Dispatched when the currently active page changes.`detail:{ value: number }`
 *
 */
@customElement('kyn-pagination')
export class Pagination extends LitElement {
  static override styles = unsafeCSS(styles);

  /** Total number of items that need pagination. */
  @property({ type: Number, reflect: true })
  accessor count = 0;

  /** Current active page number. */
  @property({ type: Number, reflect: true })
  accessor pageNumber = 1;

  /** Number of items displayed per page. */
  @property({ type: Number, reflect: true })
  accessor pageSize = 5;

  /** Available options for the page size. */
  @property({ type: Array })
  accessor pageSizeOptions: number[] = [5, 10, 20, 30, 40, 50, 100];

  /** Number of pages. */
  @state()
  accessor _numberOfPages = 1;

  /** Label for the page size dropdown. Required for accessibility. */
  @property({ type: String })
  accessor pageSizeDropdownLabel = PAGE_SIZE_LABEL;

  /** Label for the page size dropdown. Required for accessibility. */
  @property({ type: String })
  accessor pageNumberLabel = PAGE_NUMBER_LABEL;

  /** Option to hide the items range display. */
  @property({ type: Boolean })
  accessor hideItemsRange = false;

  /** Option to hide the page size dropdown. */
  @property({ type: Boolean })
  accessor hidePageSizeDropdown = false;

  /** Option to hide the navigation buttons. */
  @property({ type: Boolean })
  accessor hideNavigationButtons = false;

  /** Customizable text strings */
  @property({ type: Object })
  accessor textStrings = {
    showing: 'Showing',
    of: 'of',
    items: 'items',
    pages: 'pages',
    itemsPerPage: 'Items per page:',
    previousPage: 'Previous page',
    nextPage: 'Next page',
  };

  /**
   * Handler for the event when the page size is changed by the user.
   * Updates the `pageSize` and resets the `pageNumber` to 1.
   *
   * @param e - The emitted custom event with the selected page size.
   */
  private handlePageSizeChange(e: CustomEvent) {
    this.pageSize = e.detail.value;
    this.pageNumber = 1;
  }

  /**
   * Handler for the event when the page number is changed by the user.
   * Updates the `pageNumber`.
   *
   * @param e - The emitted custom event with the selected page number.
   */
  private handlePageNumberChange(e: CustomEvent) {
    this.pageNumber = e.detail.value;
  }

  override render() {
    return html`
      ${!this.hideItemsRange
        ? html`
            <kyn-pagination-items-range
              .pageNumber=${this.pageNumber}
              .pageSize=${this.pageSize}
              .count=${this.count}
              .textStrings=${this.textStrings}
            ></kyn-pagination-items-range>
          `
        : null}
      ${!this.hidePageSizeDropdown
        ? html`
            <kyn-pagination-page-size-dropdown
              .pageSize=${this.pageSize}
              .pageSizeOptions=${this.pageSizeOptions}
              .pageSizeDropdownLabel=${this.pageSizeDropdownLabel}
              .textStrings=${this.textStrings}
              @on-page-size-change=${this.handlePageSizeChange}
            ></kyn-pagination-page-size-dropdown>
          `
        : null}
      ${!this.hideNavigationButtons
        ? html`
            <kyn-pagination-navigation-buttons
              .pageNumber=${this.pageNumber}
              .numberOfPages=${this._numberOfPages}
              .pageNumberLabel=${this.pageNumberLabel}
              .textStrings=${this.textStrings}
              @on-page-number-change=${this.handlePageNumberChange}
            ></kyn-pagination-navigation-buttons>
          `
        : null}
    `;
  }

  override updated(changedProps: any) {
    if (changedProps.has('count') || changedProps.has('pageSize')) {
      if (this.pageSize && this.count) {
        this._numberOfPages = Math.ceil(this.count / this.pageSize);
        // this.pageNumber = 1;
      }
    }
  }
}

// Define the custom element in the global namespace
declare global {
  interface HTMLElementTagNameMap {
    'kyn-pagination': Pagination;
  }
}
