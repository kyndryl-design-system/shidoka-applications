import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { PAGE_SIZE_LABEL, BREAKPOINT } from './constants';
import styles from './pagination.scss';

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
 * @fires on-page-size-change - Dispatched when the page size changes.
 * @fires on-page-number-change - Dispatched when the currently active page changes.
 *
 */
@customElement('kyn-pagination')
export class Pagination extends LitElement {
  static override styles = [styles];

  /** Total number of items that need pagination. */
  @property({ type: Number })
  accessor count = 0;

  /** Current active page number.*/
  @property({ type: Number, reflect: true })
  accessor pageNumber = 1;

  /** Number of items displayed per page.*/
  @property({ type: Number })
  accessor pageSize = 5;

  /** Available options for the page size.*/
  @property({ type: Array })
  accessor pageSizeOptions: number[] = [5, 10, 20, 30, 40, 50, 100];

  /** Label for the page size dropdown.*/
  @property({ type: String })
  accessor pageSizeLabel = PAGE_SIZE_LABEL;

  /** Option to hide the items range display. */
  @property({ type: Boolean })
  accessor hideItemsRange = false;

  /** Option to hide the page size dropdown. */
  @property({ type: Boolean })
  accessor hidePageSizeDropdown = false;

  /** Option to hide the navigation buttons. */
  @property({ type: Boolean })
  accessor hideNavigationButtons = false;

  /**
   * Determines the device type the component is being rendered on.
   * @ignore
   */
  @state()
  accessor isMobile = window.innerWidth < BREAKPOINT;

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
    const numberOfPages = Math.ceil(this.count / this.pageSize);

    return html`
      ${!this.hideItemsRange
        ? html`
            <kyn-pagination-items-range
              .pageNumber=${this.pageNumber}
              .pageSize=${this.pageSize}
              .count=${this.count}
            ></kyn-pagination-items-range>
          `
        : null}
      ${this.isMobile
        ? null
        : !this.hidePageSizeDropdown
        ? html`
            <kyn-pagination-page-size-dropdown
              .pageSize=${this.pageSize}
              .pageSizeOptions=${this.pageSizeOptions}
              .pageSizeLabel=${this.pageSizeLabel}
              @on-page-size-change=${this.handlePageSizeChange}
            ></kyn-pagination-page-size-dropdown>
          `
        : null}
      ${!this.hideNavigationButtons
        ? html`
            <kyn-pagination-navigation-buttons
              .pageNumber=${this.pageNumber}
              .numberOfPages=${numberOfPages}
              @on-page-number-change=${this.handlePageNumberChange}
            ></kyn-pagination-navigation-buttons>
          `
        : null}
    `;
  }
}

// Define the custom element in the global namespace
declare global {
  interface HTMLElementTagNameMap {
    'kyn-pagination': Pagination;
  }
}
