import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import '../loaders/skeleton';

import styles from './pagination.scss';

/**
 * `kyn-pagination-skeleton` Web Component.
 */
@customElement('kyn-pagination-skeleton')
export class PaginationSkeleton extends LitElement {
  static override styles = [
    styles,
    css`
      kyn-skeleton {
        width: 150px;
        height: 16px;
        width: clamp(100px, 20vw, 150px);
      }

      @media (max-width: 767px) {
        kyn-skeleton {
          width: clamp(75px, 20vw, 90px);
        }
      }

      .desktop {
        display: none;
        @media (min-width: 42rem) {
          display: block;
        }
      }
    `,
  ];

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
        ? html`<kyn-skeleton
            class="desktop"
            elementType="pagination"
            inline
          ></kyn-skeleton>`
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

declare global {
  interface HTMLElementTagNameMap {
    'kyn-pagination-skeleton': PaginationSkeleton;
  }
}
