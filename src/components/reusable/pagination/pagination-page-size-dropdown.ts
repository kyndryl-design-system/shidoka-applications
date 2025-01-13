import { html, LitElement } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import '../dropdown/dropdown';
import '../dropdown/dropdownOption';

import styles from './pagination-page-size-dropdown.scss';
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
  static override styles = [styles];

  /** Current page size. */
  @property({ type: Number, reflect: true })
  pageSize = 5;

  /** Available options for the page size. */
  @property({ type: Array })
  pageSizeOptions: Array<number> = [5, 10, 20, 30, 40, 50];

  /** Customizable text strings. Inherited from parent
   * @internal
   */
  @property({ type: Object })
  textStrings: any = {};

  /** Label for the page size dropdown. Required for accessibility.
   * @internal
   */
  @property({ type: String })
  pageSizeDropdownLabel = 'Items per page';

  /**
   * Handles the dropdown change event.
   * @param {CustomEvent} event - The dropdown change event.
   */
  private handleChange(event: CustomEvent) {
    this.pageSize = event.detail.value;

    // this.shadowRoot?.querySelector('kyn-dropdown')?.resetSelection();

    this.dispatchEvent(
      new CustomEvent('on-page-size-change', {
        detail: { value: Number(event.detail.value) },
        bubbles: true, // So that parent components can catch it
        composed: true, // Required for the event to pass through the Shadow DOM boundary
      })
    );
  }

  override render() {
    return html`
      <label> ${this.textStrings.itemsPerPage} </label>
      <kyn-dropdown
        name="page-size"
        label="${this.pageSizeDropdownLabel}"
        inline
        size="sm"
        value=${this.pageSize.toString()}
        @on-change=${(e: CustomEvent) => this.handleChange(e)}
      >
        <span slot="label">${this.textStrings.itemsPerPage}</span>

        ${this.pageSizeOptions.map((option) => {
          return html`
            <kyn-dropdown-option value=${option}>
              ${option}
            </kyn-dropdown-option>
          `;
        })}
      </kyn-dropdown>
    `;
  }
}

// Define the custom element in the global namespace
declare global {
  interface HTMLElementTagNameMap {
    'kyn-pagination-page-size-dropdown': PaginationPageSizeDropdown;
  }
}
