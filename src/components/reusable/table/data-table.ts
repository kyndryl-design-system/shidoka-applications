import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { classMap } from 'lit-html/directives/class-map.js';

// Import required components and icons
import '@kyndryl-design-system/shidoka-foundation/components/button';
import '@kyndryl-design-system/shidoka-foundation/components/icon';

import '../checkbox/checkbox';
import './index';
import styles from './data-table.scss';

type ColumnDefinition = {
  sortable?: boolean;
  sortFn?: Function;
  field: string;
  align?: string;
  headerName: string;
  valueGetter?: Function;
  width?: string;
  maxWidth?: string;
  ellipsis?: boolean;
  cellRenderer?: (data: { row: any; column: ColumnDefinition }) => any;
};

/**
 * DEPRECATED. `kyn-data-table` Web Component.
 * This component provides a table with sorting, pagination, and selection capabilities.
 * It is designed to be used with the `kyn-table-toolbar` and `kyn-table-container` components.
 * @fires on-selected-rows-changed - Dispatched when the selected rows change.
 * @fires on-sort-changed - Dispatched when the sort order changes.
 * @fires on-page-changed - Dispatched when the page number or page size changes.
 */

@customElement('kyn-data-table')
export class DataTable extends LitElement {
  static override styles = [styles];

  /**
   * rows: Array of objects representing each row in the data table.
   */
  @property({ type: Array })
  accessor rows: any[] = [];

  /**
   * columns: Array of objects defining column properties such as
   * field name, sorting function, etc.
   */
  @property({ type: Array })
  accessor columns: ColumnDefinition[] = [];

  /**
   * checkboxSelection: Boolean indicating whether rows should be
   * selectable using checkboxes.
   */
  @property({ type: Boolean })
  accessor checkboxSelection = false;

  /**
   * striped: Boolean indicating whether rows should have alternate
   * coloring.
   */
  @property({ type: Boolean })
  accessor striped = false;

  /**
   * selectedRows: Set of row ids that are currently selected.
   */
  @property({ attribute: false })
  accessor selectedRows = new Set<number>();

  /**
   * selectAll: Boolean indicating whether all rows are currently
   * selected.
   * @ignore
   */
  @state()
  accessor selectAll = false;

  /**
   * stickyHeader: Boolean indicating whether the table header
   * should be sticky.
   */
  @property({ type: Boolean })
  accessor stickyHeader = false;

  /**
   * dense: Boolean indicating whether the table should be displayed
   * in dense mode.
   */
  @property({ type: Boolean })
  accessor dense = false;

  /**
   * paginationModel: Object holding pagination information such as
   * current page, page size, etc.
   */
  @property({ type: Object })
  accessor paginationModel = {
    count: 0,
    pageSize: 5,
    pageNumber: 0,
    pageSizeOptions: [5, 10],
  };

  /** Option to hide the items range display. */
  @property({ type: Boolean })
  accessor hideItemsRange = false;

  /** Option to hide the page size dropdown. */
  @property({ type: Boolean })
  accessor hidePageSizeDropdown = false;

  /** Option to hide the navigation buttons. */
  @property({ type: Boolean })
  accessor hideNavigationButtons = false;

  /** Determines if the table layout is fixed (true) or auto (false). */
  @property({ type: Boolean })
  accessor fixedLayout = false;

  /**
   * headerCheckboxIndeterminate: Boolean indicating whether the header
   * checkbox is in an indeterminate state.
   * @ignore
   */
  @state()
  accessor headerCheckboxIndeterminate = false;

  /**
   * headerCheckboxChecked: Boolean indicating whether the header checkbox is
   * checked.
   * @ignore
   */
  @state()
  accessor headerCheckboxChecked = false;

  /**
   * Updates the state of the header checkbox based on the number of
   * selected rows.
   */
  updateHeaderCheckbox() {
    if (this.selectedRows.size === 0) {
      this.headerCheckboxIndeterminate = false;
      this.headerCheckboxChecked = false;
    } else if (this.selectedRows.size === this.rows.length) {
      this.headerCheckboxIndeterminate = false;
      this.headerCheckboxChecked = true;
      this.selectAll = true;
    } else {
      this.headerCheckboxIndeterminate = true;
      this.headerCheckboxChecked = false;
      this.selectAll = false;
    }
  }

  /**
   * Handles the change of selection state for a specific row.
   */
  handleRowSelectionChange(rowId: number, isChecked: boolean) {
    const newSet = new Set(this.selectedRows);
    if (isChecked) {
      newSet.add(rowId);
    } else {
      newSet.delete(rowId);
    }
    this.selectedRows = newSet;
    this.updateHeaderCheckbox();

    // Emit the custom event with the updated selectedRows
    this.dispatchEvent(
      new CustomEvent('on-selected-rows-changed', {
        detail: { selectedRows: Array.from(this.selectedRows) },
        bubbles: true,
        composed: true,
      })
    );
  }

  /**
   * Toggles the selection state of all rows in the table.
   */
  toggleSelectionAll() {
    this.selectAll = !this.selectAll;
    if (this.selectAll) {
      // If selecting all, add all row ids to the selectedRows set
      this.rows.forEach((row) => this.selectedRows.add(row.id));
    } else {
      // If deselecting all, clear the selectedRows set
      this.selectedRows.clear();
    }

    this.updateHeaderCheckbox();
    this.requestUpdate();

    this.dispatchEvent(
      new CustomEvent('on-selected-rows-changed', {
        detail: { selectedRows: Array.from(this.selectedRows) },
        bubbles: true,
        composed: true,
      })
    );
  }

  /**
   * Handles the change of page size in pagination.
   */
  onPageSizeChange(event: CustomEvent) {
    this.paginationModel.pageSize = event.detail.value;
    this.dispatchEvent(
      new CustomEvent('on-page-changed', {
        detail: { pageSize: event.detail.value, pageNumber: 1 },
        bubbles: true,
        composed: true,
      })
    );
  }

  /**
   * Handles the change of page number in pagination.
   */
  onPageNumberChange(event: CustomEvent) {
    this.paginationModel.pageNumber = event.detail.value;
    const pageSize = this.paginationModel.pageSize;
    this.dispatchEvent(
      new CustomEvent('on-page-changed', {
        detail: { pageNumber: event.detail.value, pageSize },
        bubbles: true,
        composed: true,
      })
    );
  }

  override render() {
    const { count, pageSize, pageNumber, pageSizeOptions } =
      this.paginationModel;

    this.selectedRows = new Set(this.selectedRows || []);
    this.updateHeaderCheckbox();

    return html`
      <kyn-table-container>
        <kyn-table ?fixedLayout=${this.fixedLayout}>
          <kyn-thead ?stickyHeader=${this.stickyHeader}>
            <kyn-tr>
              ${this.checkboxSelection
                ? html` <kyn-th .align=${'center'} ?dense=${this.dense}
                    ><kyn-checkbox
                      .indeterminate=${this.headerCheckboxIndeterminate}
                      .checked=${this.headerCheckboxChecked}
                      visiblyHidden
                      @on-checkbox-change=${this.toggleSelectionAll}
                      >Select All Items</kyn-checkbox
                    >
                  </kyn-th>`
                : null}
              ${this.columns.map(
                ({ sortable, sortFn, field, align, headerName }) =>
                  html`<kyn-th
                    ?dense=${this.dense}
                    .sortable=${sortable}
                    @on-sort-changed=${sortFn}
                    sortKey=${field}
                    .align=${align}
                    >${headerName}</kyn-th
                  >`
              )}
            </kyn-tr>
          </kyn-thead>
          <kyn-tbody .striped=${this.striped}>
            ${this.rows.map(
              (row) => html`
                <kyn-tr
                  selectable=${ifDefined(this.checkboxSelection)}
                  class=${classMap({
                    selected: this.selectedRows.has(row.id),
                    clickable: this.checkboxSelection,
                  })}
                  @on-row-clicked=${() => {
                    if (this.checkboxSelection) {
                      this.handleRowSelectionChange(
                        row.id,
                        !this.selectedRows.has(row.id)
                      );
                    }
                  }}
                >
                  ${this.checkboxSelection
                    ? html` <kyn-td .align=${'center'} ?dense=${this.dense}>
                        <kyn-checkbox
                          visiblyHidden
                          .checked=${this.selectedRows.has(row.id)}
                          @on-checkbox-change=${(e: CustomEvent) => {
                            this.handleRowSelectionChange(
                              row.id,
                              e.detail.checked
                            );
                          }}
                          >${row.id}</kyn-checkbox
                        >
                      </kyn-td>`
                    : null}
                  ${this.columns.map(
                    (column) => html`
                      <kyn-td
                        .align=${column.align}
                        ?dense=${this.dense}
                        .maxWidth=${column.maxWidth}
                        .width=${column.width}
                        ?ellipsis=${column.ellipsis}
                      >
                        ${column.cellRenderer
                          ? column.cellRenderer({ row, column })
                          : column.valueGetter
                          ? column.valueGetter({ row })
                          : row[column.field]}
                      </kyn-td>
                    `
                  )}
                </kyn-tr>
              `
            )}
          </kyn-tbody>
        </kyn-table>
      </kyn-table-container>
      ${this.paginationModel?.count > 0
        ? html` <kyn-pagination
            .count=${count}
            .pageSize=${pageSize}
            .pageNumber=${pageNumber}
            .pageSizeOptions=${pageSizeOptions}
            .hideItemsRange=${this.hideItemsRange}
            .hidePageSizeDropdown=${this.hidePageSizeDropdown}
            .hideNavigationButtons=${this.hideNavigationButtons}
            @on-page-size-change=${this.onPageSizeChange}
            @on-page-number-change=${this.onPageNumberChange}
          ></kyn-pagination>`
        : null}
    `;
  }
}

// Define the custom element in the global namespace
declare global {
  interface HTMLElementTagNameMap {
    'kyn-data-table': DataTable;
  }
}
