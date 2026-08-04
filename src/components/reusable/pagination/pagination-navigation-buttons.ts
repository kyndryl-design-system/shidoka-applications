import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { html, LitElement, PropertyValues, unsafeCSS } from 'lit';
import { property, customElement, state } from 'lit/decorators.js';

// Import required components and icons
import '../button';
import '../dropdown';
import '../numberInput';
import chevLeftIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/chevron-left.svg';
import chevRightIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/chevron-right.svg';

import styles from './pagination-navigation-buttons.scss?inline';
// import { OF_TEXT, PAGES_TEXT } from './constants';

/**
 * `kyn-pagination-navigation-buttons` Web Component.
 *
 * This component provides navigational controls for pagination.
 * It includes back and next buttons, along with displaying the current page and total pages.
 *
 * @fires on-page-number-change - Dispatched when the active page is committed
 * (prev/next, dropdown selection, or number-input blur/Enter).
 * `detail.value` is always within `1…numberOfPages`.`detail:{ value: number }`
 */
@customElement('kyn-pagination-navigation-buttons')
export class PaginationNavigationButtons extends LitElement {
  static override styles = unsafeCSS(styles);

  // Current page number, defaults to 0
  @property({ type: Number, reflect: true })
  accessor pageNumber = 1;

  // Total number of pages, defaults to 0
  @property({ type: Number, reflect: true })
  accessor numberOfPages = 1;

  /** Customizable text strings. Inherited from parent
   * @internal
   */
  @property({ type: Object })
  accessor textStrings: any = {};

  /** Controls direction that dropdown opens. */
  @property({ type: String })
  accessor openDirection: 'auto' | 'up' | 'down' = 'auto';

  /** Available options for the page number. */
  @state()
  accessor pageNumberOptions: Array<number> = [];

  /** Draft page value while the free-text input is being edited.
   * @internal
   */
  @state()
  accessor _draftPageNumber: number | null = null;

  /**
   * When true, the next page-input commit (blur) is ignored.
   * Set on prev/next pointerdown so button navigation is relative to the
   * committed page, not an in-progress draft.
   */
  private _suppressPageInputCommit = false;

  // Constant representing the smallest possible page number
  private readonly SMALLEST_PAGE_NUMBER = 1;

  /** Label for the page size dropdown. Required for accessibility.
   * @internal
   */
  @property({ type: String })
  accessor pageNumberLabel = 'Page number';

  /**
   * Discards an in-progress page draft before the input blurs into a nav button.
   * Runs on pointerdown so it precedes the input's change/commit.
   */
  private _onNavButtonPointerDown() {
    if (this.pageNumberOptions.length <= 20) return;
    this._suppressPageInputCommit = true;
    this._draftPageNumber = null;
  }

  /**
   * Handles the button click event, either moving to the next page or previous page
   * @param {boolean} next - If true, will move to the next page, otherwise to the previous page
   */
  private handleButtonClick(next: boolean) {
    this._suppressPageInputCommit = false;
    this._draftPageNumber = null;
    const currentPage = next ? this.pageNumber + 1 : this.pageNumber - 1;
    this._emitPageNumberChange(currentPage);
  }

  /**
   * Handles the dropdown change event.
   * @param {CustomEvent} event
   */
  private handleDropdownChange(event: CustomEvent) {
    this._emitPageNumberChange(Number(event.detail.value));
  }

  /**
   * Tracks typed page values without navigating.
   * @param {CustomEvent} event
   */
  private _handlePageInputDraft(event: CustomEvent) {
    this._suppressPageInputCommit = false;
    this._draftPageNumber = Number(event.detail.value);
  }

  /**
   * Commits the free-text page input on blur/Enter.
   * @param {CustomEvent} event
   */
  private _handlePageInputCommit(event: CustomEvent) {
    if (this._suppressPageInputCommit) {
      this._suppressPageInputCommit = false;
      this._draftPageNumber = null;
      this.requestUpdate();
      return;
    }

    const raw = Number(
      event.detail?.value ?? this._draftPageNumber ?? this.pageNumber
    );
    this._commitPageNumber(raw);
  }

  /**
   * Clamps and emits a committed page number.
   * @param {number} raw
   */
  private _commitPageNumber(raw: number) {
    if (!Number.isFinite(raw)) {
      this._draftPageNumber = null;
      return;
    }

    const next = Math.min(
      this.numberOfPages,
      Math.max(this.SMALLEST_PAGE_NUMBER, Math.trunc(raw))
    );

    this._draftPageNumber = null;

    if (next === this.pageNumber) {
      this.requestUpdate();
      return;
    }

    this._emitPageNumberChange(next);
  }

  /**
   * Updates the current page and notifies listeners.
   * @param {number} value
   */
  private _emitPageNumberChange(value: number) {
    const next = Math.min(
      this.numberOfPages,
      Math.max(this.SMALLEST_PAGE_NUMBER, Math.trunc(value))
    );

    this._draftPageNumber = null;
    this.pageNumber = next;

    this.dispatchEvent(
      new CustomEvent('on-page-number-change', {
        detail: { value: next },
        bubbles: true,
        composed: true,
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
        kind="ghost"
        type="button"
        size="small"
        ?disabled=${disableBackButton}
        @pointerdown=${this._onNavButtonPointerDown}
        @on-click=${() => this.handleButtonClick(false)}
        description=${this.textStrings.previousPage}
      >
        <span slot="icon">${unsafeSVG(chevLeftIcon)}</span>
      </kyn-button>

      <span class="page-range" role="status" aria-live="polite">
        ${this.pageNumberOptions.length > 20
          ? html`
              <kyn-number-input
                class="page-number-input"
                name="page-number"
                label=${this.pageNumberLabel}
                ?hideLabel=${true}
                ?inline=${true}
                .inlineBorder=${true}
                size="sm"
                .value=${this._draftPageNumber ?? this.pageNumber}
                min=${1}
                max=${this.numberOfPages}
                @on-input=${(e: CustomEvent) => this._handlePageInputDraft(e)}
                @on-change=${(e: CustomEvent) => this._handlePageInputCommit(e)}
              ></kyn-number-input>
            `
          : html`
              <kyn-dropdown
                name="page-number"
                class="pagination-dropdown"
                label="${this.pageNumberLabel}"
                ?hideLabel=${true}
                inline
                size="sm"
                openDirection=${this.openDirection}
                value="${this.pageNumber.toString()}"
                @on-change=${(e: CustomEvent) => this.handleDropdownChange(e)}
              >
                ${this.pageNumberOptions.map(
                  (option) => html`
                    <kyn-dropdown-option value="${option.toString()}">
                      ${option.toString()}
                    </kyn-dropdown-option>
                  `
                )}
              </kyn-dropdown>
            `}
        <span class="page-total"
          >${this.textStrings.of} ${this.numberOfPages}
          ${this.textStrings.pages}</span
        >
      </span>

      <kyn-button
        iconposition="center"
        kind="ghost"
        type="button"
        size="small"
        ?disabled=${disableNextButton}
        @pointerdown=${this._onNavButtonPointerDown}
        @on-click=${() => this.handleButtonClick(true)}
        description=${this.textStrings.nextPage}
      >
        <span slot="icon">${unsafeSVG(chevRightIcon)}</span>
      </kyn-button>
    `;
  }

  override willUpdate(changedProps: PropertyValues) {
    if (changedProps.has('numberOfPages')) {
      this.pageNumberOptions = Array.from(
        { length: this.numberOfPages },
        (_, i) => i + 1
      );
      // Draft is invalid across page-count changes (incl. dropdown ↔ input swap).
      this._draftPageNumber = null;
      this._suppressPageInputCommit = false;
    }

    // Drop a stale draft if the page was changed externally (e.g. parent update).
    if (
      changedProps.has('pageNumber') &&
      this._draftPageNumber !== null &&
      this._draftPageNumber !== this.pageNumber
    ) {
      this._draftPageNumber = null;
    }
  }
}

// Define the custom element in the global namespace
declare global {
  interface HTMLElementTagNameMap {
    'kyn-pagination-navigation-buttons': PaginationNavigationButtons;
  }
}
