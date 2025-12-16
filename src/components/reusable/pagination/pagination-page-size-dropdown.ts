import { html, LitElement, unsafeCSS, type PropertyValues } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import '../dropdown/dropdown';
import '../dropdown/dropdownOption';

import styles from './pagination-page-size-dropdown.scss?inline';
// import { PAGE_SIZE_LABEL } from './constants';

/**
 * `kyn-pagination-page-size-dropdown` Web Component.
 *
 * This component provides a dropdown to select the page size for pagination.
 * It emits events when the selected page size changes.
 *
 * @fires on-page-size-change - The event fired when the page size changes.
 */
@customElement('kyn-pagination-page-size-dropdown')
export class PaginationPageSizeDropdown extends LitElement {
  static override styles = unsafeCSS(styles);

  /** Current page size. */
  @property({ type: Number, reflect: true })
  accessor pageSize = 5;

  /** Available options for the page size. */
  @property({ attribute: false })
  accessor pageSizeOptions: Array<number> = [5, 10, 20, 30, 40, 50];

  /** Customizable text strings. Inherited from parent
   * @internal
   */
  @property({ attribute: false })
  accessor textStrings: any = {};

  /** Label for the page size dropdown. Required for accessibility.
   * @internal
   */
  @property({ type: String })
  accessor pageSizeDropdownLabel = 'Items per page';

  /**
   * Handles the dropdown change event.
   * @param {CustomEvent} event - The dropdown change event.
   */
  private handleChange(event: CustomEvent) {
    const next = Number(event.detail.value);

    if (!Number.isFinite(next)) return;

    this.pageSize = next;

    this.dispatchEvent(
      new CustomEvent('on-page-size-change', {
        detail: { value: next },
        bubbles: true, // So that parent components can catch it
        composed: true, // Required for the event to pass through the Shadow DOM boundary
      })
    );
  }

  override updated(changedProps: PropertyValues<this>) {
    if (changedProps.has('pageSizeOptions')) {
      if (!Array.isArray(this.pageSizeOptions)) {
        this.pageSizeOptions = [];
      }
    }
  }

  override render() {
    const options = Array.isArray(this.pageSizeOptions)
      ? this.pageSizeOptions
      : [];

    return html`
      <label>${this.textStrings.itemsPerPage}</label>
      <kyn-dropdown
        name="page-size"
        class="pagination-dropdown"
        label=${this.pageSizeDropdownLabel}
        inline
        size="sm"
        .value=${String(this.pageSize)}
        @on-change=${(e: CustomEvent) => this.handleChange(e)}
      >
        <span slot="label">${this.textStrings.itemsPerPage}</span>

        ${options.map(
          (option) => html`
            <kyn-dropdown-option .value=${String(option)}>
              ${option}
            </kyn-dropdown-option>
          `
        )}
      </kyn-dropdown>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-pagination-page-size-dropdown': PaginationPageSizeDropdown;
  }
}
