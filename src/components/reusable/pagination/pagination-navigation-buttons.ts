import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { html, LitElement } from 'lit';
import { property, customElement } from 'lit/decorators.js';

// Import required components and icons
import '../button';
import chevLeftIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/chevron-left.svg';
import chevRightIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/chevron-right.svg';

import styles from './pagination-navigation-buttons.scss';
// import { OF_TEXT, PAGES_TEXT } from './constants';

/**
 * `kyn-pagination-navigation-buttons` Web Component.
 *
 * This component provides navigational controls for pagination.
 * It includes back and next buttons, along with displaying the current page and total pages.
 *
 * @fires on-page-number-change - Dispatched when the page number is changed.
 */
@customElement('kyn-pagination-navigation-buttons')
export class PaginationNavigationButtons extends LitElement {
  static override styles = [styles];

  // Current page number, defaults to 0
  @property({ type: Number, reflect: true })
  pageNumber = 1;

  // Total number of pages, defaults to 0
  @property({ type: Number, reflect: true })
  numberOfPages = 1;

  /** Customizable text strings. Inherited from parent
   * @internal
   */
  @property({ type: Object })
  textStrings: any = {};

  // Constant representing the smallest possible page number
  private readonly SMALLEST_PAGE_NUMBER = 1;

  /**
   * Handles the button click event, either moving to the next page or previous page
   * @param {boolean} next - If true, will move to the next page, otherwise to the previous page
   */
  private handleButtonClick(next: boolean) {
    const currentPage = next ? this.pageNumber + 1 : this.pageNumber - 1;
    this.pageNumber = currentPage;

    // Dispatch a custom event to notify about the page change
    this.dispatchEvent(
      new CustomEvent('on-page-number-change', {
        detail: { value: currentPage },
        bubbles: true, // Allows parent components to catch it
        composed: true, // Required for the event to pass through the Shadow DOM boundary
      })
    );
  }

  override render() {
    const disableBackButton = this.pageNumber <= this.SMALLEST_PAGE_NUMBER;
    const disableNextButton = this.pageNumber >= this.numberOfPages;

    // Render back button, current page number, and next button
    return html`
      <kyn-button
        iconposition="center"
        kind="tertiary"
        type="button"
        size="small"
        ?disabled=${disableBackButton}
        @on-click=${() => this.handleButtonClick(false)}
        description=${this.textStrings.previousPage}
      >
        <span slot="icon">${unsafeSVG(chevLeftIcon)}</span>
      </kyn-button>

      <span class="page-range" role="status" aria-live="polite">
        ${this.pageNumber} ${this.textStrings.of} ${this.numberOfPages}
        ${this.textStrings.pages}
      </span>

      <kyn-button
        iconposition="center"
        kind="tertiary"
        type="button"
        size="small"
        ?disabled=${disableNextButton}
        @on-click=${() => this.handleButtonClick(true)}
        description=${this.textStrings.nextPage}
      >
        <span slot="icon">${unsafeSVG(chevRightIcon)}</span>
      </kyn-button>
    `;
  }
}

// Define the custom element in the global namespace
declare global {
  interface HTMLElementTagNameMap {
    'kyn-pagination-navigation-buttons': PaginationNavigationButtons;
  }
}
