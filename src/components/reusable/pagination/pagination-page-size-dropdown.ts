import { html, LitElement } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import '../dropdown/dropdown';
import '../dropdown/dropdownOption';

import styles from './pagination-page-size-dropdown.scss';
import { PAGE_SIZE_LABEL } from './constants';

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
  @property({ type: Number })
  accessor pageSize = 5;

  /** Label for the page size dropdown. */
  @property({ type: String })
  accessor pageSizeLabel = PAGE_SIZE_LABEL;

  /** Available options for the page size. */
  @property({ type: Array })
  accessor pageSizeOptions: Array<number> = [5, 10, 20, 30, 40, 50];

  /**
   * Handles the dropdown change event.
   * @param {CustomEvent} event - The dropdown change event.
   */
  private handleChange(event: CustomEvent) {
    this.pageSize = event.detail.value;

    this.dispatchEvent(
      new CustomEvent('on-page-size-change', {
        detail: { value: event.detail.value },
        bubbles: true, // So that parent components can catch it
        composed: true, // Required for the event to pass through the Shadow DOM boundary
      })
    );
  }

  override render() {
    return html`
      <label> ${this.pageSizeLabel} </label>
      <kyn-dropdown
        inline
        placeholder=${this.pageSize}
        size="sm"
        @on-change=${(e: CustomEvent) => this.handleChange(e)}
      >
        ${this.pageSizeOptions.map((option) => {
          return html`
            <kyn-dropdown-option
              ?selected=${this.pageSize === option}
              value=${option}
            >
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
