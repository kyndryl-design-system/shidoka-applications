import { LitElement, html, PropertyValues, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ContextProvider } from '@lit/context';
import { tableContext } from './table-context';

import { TableRow } from './table-row';
import { TableHeaderRow } from './table-header-row';

import styles from './table.scss?inline';

/**
 * `kyn-table` Web Component.
 * This component provides a table with sorting, pagination, and selection capabilities.
 * It is designed to be used with the `kyn-table-toolbar` and `kyn-table-container` components.
 * @fires on-row-selection-change - Dispatched when the selection state of a row is toggled. `detail: { selectedRow: TableRow, selectedRows: Array<TableRow> }`. When `persistSelection` is enabled, `detail.selectedRowIds: Array<string>` is also included with all selected row ids across pages.
 * @fires on-all-rows-selection-change - Dispatched when the selection state of all rows is toggled. `detail: { selectedRows: Array<TableRow> }`. When `persistSelection` is enabled, `detail.selectedRowIds: Array<string>` is also included.
 */

@customElement('kyn-table')
export class Table extends LitElement {
  static override styles = unsafeCSS(styles);

  /** aria role.
   * @internal
   */
  @property({ type: String, reflect: true })
  override accessor role = 'table';

  /**
   * checkboxSelection: Boolean indicating whether rows should be
   * selectable using checkboxes.
   * @type {boolean}
   */
  @property({ type: Boolean })
  accessor checkboxSelection: boolean | undefined;

  /**
   * persistSelection: When true, row selection is persisted across pages
   * (or any external row changes such as filtering / sorting that swap the
   * rendered rows). Selecting / deselecting all only affects the rows
   * currently rendered, while the cumulative selection is exposed via
   * `selectedRowIds` on selection events and `getSelectedRowIds()`.
   * @type {boolean}
   * @default false
   */
  @property({ type: Boolean })
  accessor persistSelection = false;

  /**
   * allRowIds: The complete list of row ids in the dataset across all
   * pages. When provided together with `persistSelection`, the header
   * "Select All" checkbox toggles selection for every row in the dataset
   * (not just the rows currently rendered). Leave empty to fall back to
   * per-page select-all behavior.
   * @type {Array<string>}
   * @default []
   */
  @property({ type: Array })
  accessor allRowIds: string[] = [];

  /**
   * striped: Boolean indicating whether rows should have alternate
   * coloring.
   * @type {boolean}
   */
  @property({ type: Boolean })
  accessor striped = false;

  /**
   * stickyHeader: Boolean indicating whether the table header should be sticky.
   * Must also set a height or max-height on kyn-table-container.
   * @type {boolean}
   */
  @property({ type: Boolean })
  accessor stickyHeader = false;

  /**
   * dense: Boolean indicating whether the table should be displayed
   * in dense mode.
   * @type {boolean}
   * @default false
   */
  @property({ type: Boolean })
  accessor dense = false;

  /**
   * fixedLayout: Boolean indicating whether the table should have a fixed layout.
   * This will set the table's layout to fixed, which means the table and column widths
   * will be determined by the width of the columns and not by the content of the cells.
   * This can be useful when you want to have a consistent column width across multiple tables.
   * @type {boolean}
   * */
  @property({ type: Boolean })
  accessor fixedLayout = false;

  /**
   * _provider: Context provider for the table.
   * @ignore
   * @private
   */
  @state()
  private accessor _provider = new ContextProvider(this, tableContext);

  /**
   * updated: Lifecycle method called when the element is updated.
   */
  override updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    if (
      changedProperties.has('dense') ||
      changedProperties.has('striped') ||
      changedProperties.has('checkboxSelection') ||
      changedProperties.has('stickyHeader')
    ) {
      const newValues: Partial<any> = {
        dense: this.dense,
        striped: this.striped,
        checkboxSelection: this.checkboxSelection,
        stickyHeader: this.stickyHeader,
      };

      this._provider.setValue(newValues);
    }
  }

  /**
   * tableHeaderRow: Reference to the header row of the table.
   * @ignore
   * @private
   */
  @state()
  private accessor _tableHeaderRow: TableHeaderRow | null = null;

  /**
   * allRows: Array of objects representing each row in the data table.
   * @ignore
   * @private
   */
  @state()
  private accessor _allRows: TableRow[] = [];

  /**
   * selectedRows: Set of row ids that are currently selected.
   * @ignore
   * @private
   */
  @state()
  private accessor _selectedRows: TableRow[] = [];

  /**
   * selectedRowIds: Set of row ids that are currently selected.
   * @ignore
   * @private
   */
  @state()
  private accessor _selectedRowIds: Set<string> = new Set();

  /**
   * headerCheckboxIndeterminate: Boolean indicating whether the header
   * checkbox is in an indeterminate state.
   * @ignore
   * @private
   */
  @state()
  private accessor _headerCheckboxIndeterminate = false;

  /**
   * headerCheckboxChecked: Boolean indicating whether the header checkbox is
   * checked.
   * @ignore
   * @private
   */
  @state()
  private accessor _headerCheckboxChecked = false;

  /**
   * Updates the state of the header checkbox based on the number of
   * selected rows.
   * @private
   */
  private _updateHeaderCheckbox() {
    // When persistSelection + allRowIds is provided, evaluate against
    // the entire dataset so the header reflects whole-dataset state.
    if (this.persistSelection && this.allRowIds.length > 0) {
      const totalCount = this.allRowIds.length;
      const selectedCount = this._selectedRowIds.size;

      if (selectedCount === 0) {
        this._headerCheckboxIndeterminate = false;
        this._headerCheckboxChecked = false;
      } else if (selectedCount >= totalCount) {
        this._headerCheckboxIndeterminate = false;
        this._headerCheckboxChecked = true;
      } else {
        this._headerCheckboxIndeterminate = true;
        this._headerCheckboxChecked = false;
      }

      this._tableHeaderRow?.updateHeaderCheckboxState(
        this._headerCheckboxIndeterminate,
        this._headerCheckboxChecked
      );
      return;
    }

    // Default: evaluate against rows currently rendered (current page).
    const selectableRows = this._allRows.filter((row) => !row.disabled);
    const selectedVisibleCount = selectableRows.filter(
      (row) => row.selected
    ).length;

    if (selectableRows.length === 0 || selectedVisibleCount === 0) {
      this._headerCheckboxIndeterminate = false;
      this._headerCheckboxChecked = false;
    } else if (selectedVisibleCount === selectableRows.length) {
      this._headerCheckboxIndeterminate = false;
      this._headerCheckboxChecked = true;
    } else {
      this._headerCheckboxIndeterminate = true;
      this._headerCheckboxChecked = false;
    }

    this._tableHeaderRow?.updateHeaderCheckboxState(
      this._headerCheckboxIndeterminate,
      this._headerCheckboxChecked
    );
  }

  /**
   * Handles the change of selection state for a specific row.
   */
  private _handleRowSelectionChange(event: CustomEvent) {
    event.stopPropagation();

    const target = event.detail.el;
    const selected = event.detail.selected;
    console.log(
      'Handling row selection change for target:',
      target,
      'selected:',
      selected
    );
    const { _selectedRows: selectedRows } = this;

    if (!this.contains(target as TableRow)) {
      return;
    }

    if (!selected && selectedRows.includes(target as TableRow)) {
      this._selectedRows = selectedRows.filter((e) => e !== target);
      this._selectedRowIds.delete((target as TableRow).rowId);
    } else if (selected && !selectedRows.includes(target as TableRow)) {
      this._selectedRows.push(target as TableRow);
      this._selectedRowIds.add((target as TableRow).rowId);
    }

    this._updateHeaderCheckbox();

    const detail: Record<string, unknown> = {
      selectedRow: target,
      selectedRows: this._selectedRows,
    };
    if (this.persistSelection) {
      detail.selectedRowIds = Array.from(this._selectedRowIds);
    }

    const init = {
      bubbles: false,
      cancelable: true,
      composed: true,
      detail,
    };
    console.log('Dispatching on-row-selection-change with detail:', detail);
    this.dispatchEvent(new CustomEvent('on-row-selection-change', init));
  }

  /**
   * Toggles the selection state of all rows in the table.
   */
  private _toggleSelectionAll(event: CustomEvent) {
    event.stopPropagation();

    const {
      detail: { checked },
      target,
    } = event;
    const { _allRows: allRows } = this;

    if (!this.contains(target as TableRow)) {
      return;
    }

    allRows.forEach((row) => {
      if ((row as TableRow).disabled) return;

      (row as TableRow).selected = checked;
    });

    if (this.persistSelection) {
      if (this.allRowIds.length > 0) {
        // Select / deselect across the entire dataset (all pages).
        if (checked) {
          this.allRowIds.forEach((id) => this._selectedRowIds.add(id));
        } else {
          this.allRowIds.forEach((id) => this._selectedRowIds.delete(id));
        }
      } else {
        // Merge with existing selection across pages: add or remove
        // only the rowIds belonging to the rows currently rendered.
        allRows.forEach((row) => {
          if ((row as TableRow).disabled) return;

          if (checked) {
            this._selectedRowIds.add(row.rowId);
          } else {
            this._selectedRowIds.delete(row.rowId);
          }
        });
      }
      this._selectedRows = allRows.filter((row) => row.selected);
    } else {
      this._selectedRows = [...allRows.filter((row) => row.selected)];
      this._selectedRowIds = new Set(
        this._selectedRows.map((row) => row.rowId)
      );
    }

    this._updateHeaderCheckbox();

    const detail: Record<string, unknown> = {
      selectedRows: this._selectedRows,
    };
    if (this.persistSelection) {
      detail.selectedRowIds = Array.from(this._selectedRowIds);
    }

    const init = {
      bubbles: false,
      cancelable: true,
      composed: true,
      detail,
    };
    this.dispatchEvent(new CustomEvent('on-all-rows-selection-change', init));
  }

  /**
   * Resets the selection state of all rows in the table.
   * This method is called when the table is reset or cleared.
   * @public
   * @returns void
   */
  public updateAfterExternalChanges() {
    // Re-query the DOM to update the _allRows based on current children elements
    this._allRows = Array.from(this.querySelectorAll('kyn-tr'));

    // Update _selectedRows based on whether the row elements are marked as selected
    this._selectedRows = this._allRows.filter((row) => row.selected);

    this._updateHeaderCheckbox();
    this.requestUpdate();
  }

  /**
   * Returns the selected rows in the table.
   * @returns Array of selected rows.
   * @public
   */
  public getSelectedRows() {
    return this._selectedRows;
  }

  /**
   * Returns the row ids of all selected rows across pages.
   * Useful when `persistSelection` is enabled and rows from other
   * pages are not currently rendered in the DOM.
   * @returns Array of selected row ids.
   * @public
   */
  public getSelectedRowIds(): string[] {
    return Array.from(this._selectedRowIds);
  }

  /**
   * Replaces the current set of selected row ids and applies the
   * selection state to any rows currently rendered.
   * @param ids - Array of row ids to mark as selected.
   * @public
   */
  public setSelectedRowIds(ids: string[]) {
    this._selectedRowIds = new Set(ids);
    this._updateSelectionStates();
    this._updateHeaderCheckbox();
    this.requestUpdate();
  }

  /**
   * Clears the selection of all rows (across pages when
   * `persistSelection` is enabled) and updates rendered rows.
   * @public
   */
  public clearSelection() {
    this._selectedRowIds.clear();
    this._allRows.forEach((row) => {
      row.selected = false;
    });
    this._selectedRows = [];
    this._updateHeaderCheckbox();
    this.requestUpdate();
  }

  /**
   * Handles the change of rows in the table body.
   * @param {CustomEvent} event - The custom event containing the updated rows.
   * @private
   */
  private _handleRowsChange(event: CustomEvent) {
    const {
      detail: { rows },
    } = event;
    event.stopPropagation();

    this._allRows = rows;
    this._updateSelectionStates();
    this._updateHeaderCheckbox();
  }

  private _updateSelectionStates() {
    // Temporary array to hold updated selected rows
    const updatedSelectedRows: TableRow[] = [];

    // Loop through all rows to update their selected state and rebuild the selectedRows array
    this._allRows.forEach((row) => {
      if (this._selectedRowIds.has(row.rowId)) {
        row.selected = true; // Update the selected property if the rowId matches
        updatedSelectedRows.push(row); // Add the actual row element to the updated selected rows array
      } else if (row.selected) {
        this._selectedRowIds.add(row.rowId); // Add the rowId to the selectedRowIds set
        updatedSelectedRows.push(row); // Add the actual row element to the updated selected rows array
      }
    });

    // Replace the old selectedRows with the updated selected rows
    this._selectedRows = updatedSelectedRows;
  }

  override connectedCallback() {
    super.connectedCallback();

    this.addEventListener(
      'on-header-checkbox-toggle',
      this._toggleSelectionAll as EventListener
    );
    this.addEventListener(
      'on-row-select',
      this._handleRowSelectionChange as EventListener
    );
    this.addEventListener(
      'on-rows-change',
      this._handleRowsChange as EventListener
    );
  }

  override disconnectedCallback() {
    super.disconnectedCallback();

    this.removeEventListener(
      'on-header-checkbox-toggle',
      this._toggleSelectionAll as EventListener
    );
    this.removeEventListener(
      'on-row-select',
      this._handleRowSelectionChange as EventListener
    );
    this.removeEventListener(
      'on-rows-change',
      this._handleRowsChange as EventListener
    );
  }

  override firstUpdated() {
    this._tableHeaderRow = this.querySelector('kyn-header-tr');
  }

  /**
   * Updates table width during column resize based on snapshot widths.
   * Called from kyn-th during drag to calculate and apply table width.
   * @param {Map<number, number>} columnWidthsSnapshot - Map of column index to width
   * @param {number} resizingColumnIndex - Index of the column being resized
   * @param {number} resizedColumnWidth - New width of the resizing column
   * @internal
   */
  public updateTableWidthFromResize = (
    columnWidthsSnapshot: Map<number, number>,
    resizingColumnIndex: number,
    resizedColumnWidth: number
  ) => {
    let totalWidth = 0;

    columnWidthsSnapshot.forEach((width, index) => {
      if (index === resizingColumnIndex) {
        totalWidth += resizedColumnWidth;
      } else {
        totalWidth += width;
      }
    });
    this.style.width = `${totalWidth.toFixed(2)}px`;
  };

  override render() {
    return html` <slot></slot> `;
  }
}

// Define the custom element in the global namespace
declare global {
  interface HTMLElementTagNameMap {
    'kyn-table': Table;
  }
}
