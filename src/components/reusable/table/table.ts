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
 * @fires on-row-selection-change - Dispatched when the selection state of a row is toggled. `detail: { mode: string,selectedRow: TableRow, selectedRows: Array<TableRow>,excludedRowIds: Array<string> }`
 * @fires on-all-rows-selection-change - Dispatched when the selection state of all rows is toggled. `detail:{ mode: string, selectedRows: Array<TableRow>, excludedRowIds: Array<string> }`
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

  /** enableBulkSelectionMenu: Boolean indicating whether to show the bulk selection menu in the header when checkboxSelection is enabled.
   * @type {boolean}
   * @default false
   */
  @property({ type: Boolean })
  accessor enableBulkSelectionMenu: boolean | undefined;

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
      changedProperties.has('stickyHeader') ||
      changedProperties.has('enableBulkSelectionMenu')
    ) {
      const newValues: Partial<any> = {
        dense: this.dense,
        striped: this.striped,
        checkboxSelection: this.checkboxSelection,
        stickyHeader: this.stickyHeader,
        enableBulkSelectionMenu: this.enableBulkSelectionMenu,
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

  /** allSelected: Boolean indicating whether all rows are currently selected.
   * @ignore
   * @private
   */
  @state()
  private accessor _allSelected = false;

  /**
   * excludedRowIds: To keep track of unselected rows when "Select all" is active.
   * @ignore
   * @private
   */
  @state()
  private accessor _excludedRowIds: Set<string> = new Set();

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
    if (this._allSelected) {
      const selectableVisibleRows = this._allRows.filter(
        (row) => !row.disabled
      );

      const selectedVisibleRows = selectableVisibleRows.filter(
        (row) => !this._excludedRowIds.has(row.rowId)
      );
      if (selectedVisibleRows.length === 0) {
        this._headerCheckboxChecked = false;
        this._headerCheckboxIndeterminate = false;
      } else if (selectedVisibleRows.length === selectableVisibleRows.length) {
        this._headerCheckboxChecked = true;
        this._headerCheckboxIndeterminate = false;
      } else {
        this._headerCheckboxChecked = false;
        this._headerCheckboxIndeterminate = true;
      }
    } else {
      if (this._selectedRows.length === 0 || this._allRows.length === 0) {
        this._headerCheckboxIndeterminate = false;
        this._headerCheckboxChecked = false;
      } else if (this._selectedRows.length === this._allRows.length) {
        this._headerCheckboxIndeterminate = false;
        this._headerCheckboxChecked = true;
      } else {
        this._headerCheckboxIndeterminate = true;
        this._headerCheckboxChecked = false;
      }
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
    const { _selectedRows: selectedRows } = this;

    if (!this.contains(target as TableRow)) {
      return;
    }

    if (this._allSelected) {
      if (selected) {
        this._excludedRowIds.delete(target.rowId);
      } else {
        this._excludedRowIds.add(target.rowId);
      }
    } else {
      if (!selected && selectedRows.includes(target as TableRow)) {
        this._selectedRows = selectedRows.filter((e) => e !== target);
        this._selectedRowIds.delete((target as TableRow).rowId);
      } else if (selected && !selectedRows.includes(target as TableRow)) {
        this._selectedRows.push(target as TableRow);
        this._selectedRowIds.add((target as TableRow).rowId);
      }
    }

    this._updateHeaderCheckbox();

    const init = {
      bubbles: false,
      cancelable: true,
      composed: true,
      detail: {
        mode: this._allSelected ? 'select_all' : '',
        selectedRow: target,
        selectedRows: this._selectedRows, // visible selected rows
        excludedRowIds: Array.from(this._excludedRowIds), // Used in select-all mode to track which rows are unselected
      },
    };
    console.log(
      'Dispatching on-row-selection-change with detail:',
      init.detail
    );
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

    this._allSelected = false;
    this._excludedRowIds.clear();

    allRows.forEach((row) => {
      if ((row as TableRow).disabled) return;

      (row as TableRow).selected = checked;

      if (checked) {
        this._selectedRowIds.add(row.rowId);
      } else {
        this._selectedRowIds.delete(row.rowId);
      }
    });

    this._selectedRows = [...allRows.filter((row) => row.selected)];
    this._selectedRowIds = new Set(this._selectedRows.map((row) => row.rowId));

    this._updateHeaderCheckbox();

    const init = {
      bubbles: false,
      cancelable: true,
      composed: true,
      detail: {
        mode: 'select_visible_all',
        selectedRows: this._selectedRows,
      },
    };

    console.log('on-all-rows-selection-change from select_visible_all:', init);

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

  // private _updateSelectionStates() {
  //   // Temporary array to hold updated selected rows
  //   const updatedSelectedRows: TableRow[] = [];

  //   // Loop through all rows to update their selected state and rebuild the selectedRows array
  //   this._allRows.forEach((row) => {
  //     if (this._selectedRowIds.has(row.rowId)) {
  //       row.selected = true; // Update the selected property if the rowId matches
  //       updatedSelectedRows.push(row); // Add the actual row element to the updated selected rows array
  //     } else if (row.selected) {
  //       this._selectedRowIds.add(row.rowId); // Add the rowId to the selectedRowIds set
  //       updatedSelectedRows.push(row); // Add the actual row element to the updated selected rows array
  //     }
  //   });

  //   // Replace the old selectedRows with the updated selected rows
  //   this._selectedRows = updatedSelectedRows;
  // }

  private _updateSelectionStates() {
    const updatedSelectedRows: TableRow[] = [];

    this._allRows.forEach((row) => {
      let shouldSelect = false;

      // If "Select all" is active, select all rows except those in the excludedRowIds set
      if (this._allSelected) {
        shouldSelect = !this._excludedRowIds.has(row.rowId);
      } else {
        // normal mode - select if rowId is in selectedRowIds set
        shouldSelect = this._selectedRowIds.has(row.rowId);
      }

      row.selected = shouldSelect;

      if (shouldSelect) {
        updatedSelectedRows.push(row);
      }
    });

    this._selectedRows = updatedSelectedRows;
  }

  /**
   * Handles bulk selection menu actions.
   * select_all  -> select entire dataset (scalable)
   * clear_all      -> clear everything
   */
  private _handleSelectAllMenu(event: CustomEvent) {
    event.stopPropagation();

    const { action } = event.detail;

    switch (action) {
      // Select all rows across pages
      case 'select_all': {
        this._allSelected = true;
        this._selectedRowIds.clear();
        this._excludedRowIds.clear();
        this._allRows.forEach((row) => {
          if (!row.disabled) {
            row.selected = true;
          }
        });

        break;
      }

      /**
       * reset selection
       */
      case 'clear_all': {
        this._allSelected = false;

        this._selectedRowIds.clear();
        this._excludedRowIds.clear();

        this._allRows.forEach((row) => {
          row.selected = false;
        });

        break;
      }
    }

    this._updateVisibleSelectedRows();

    this._updateHeaderCheckbox();

    /**
     * Common event dispatch
     */
    const copydetail = {
      mode: action,
      selectedRows: this._selectedRows,
      excludedRowIds: Array.from(this._excludedRowIds),
    };
    console.log(
      'on-all-rows-selection-change from _bulk_selection_menu with selectedRows:',
      copydetail
    );
    this.dispatchEvent(
      new CustomEvent('on-all-rows-selection-change', {
        bubbles: false,
        cancelable: true,
        composed: true,
        detail: {
          mode: action,
          selectedRows: this._selectedRows,
          excludedRowIds: Array.from(this._excludedRowIds),
        },
      })
    );
  }

  /**
   * Updates currently visible selected rows.
   * Only rows on current page.
   */
  private _updateVisibleSelectedRows() {
    this._selectedRows = this._allRows.filter((row) => row.selected);
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
    this.addEventListener(
      'on-select-all-menu',
      this._handleSelectAllMenu as EventListener
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

    this.removeEventListener(
      'on-select-all-menu',
      this._handleSelectAllMenu as EventListener
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
