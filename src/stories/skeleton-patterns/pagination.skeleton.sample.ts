import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import styles from '../../components/reusable/pagination/pagination.scss';
import '../../components/reusable/loaders/skeleton';

/**
 * `kyn-pagination-skeleton` Web Component.
 */
@customElement('kyn-pagination-skeleton')
export class PaginationSkeleton extends LitElement {
  static override styles = [styles];

  /** Option to hide the items range display. */
  @property({ type: Boolean })
  hideItemsRange = false;

  /** Option to hide the page size dropdown. */
  @property({ type: Boolean })
  hidePageSizeDropdown = false;

  /** Option to hide the navigation buttons. */
  @property({ type: Boolean })
  hideNavigationButtons = false;

  override render() {
    return html`
      ${!this.hideItemsRange
        ? html`<kyn-skeleton elementType="pagination" inline></kyn-skeleton>`
        : null}
      ${!this.hidePageSizeDropdown
        ? html`<kyn-skeleton elementType="pagination" inline></kyn-skeleton>`
        : null}
      ${!this.hideNavigationButtons
        ? html`<kyn-skeleton elementType="pagination" inline></kyn-skeleton>`
        : null}
    `;
  }
}

// Define the custom element in the global namespace
declare global {
  interface HTMLElementTagNameMap {
    'kyn-pagination-skeleton': PaginationSkeleton;
  }
}
