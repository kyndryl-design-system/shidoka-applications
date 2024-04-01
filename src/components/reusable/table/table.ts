import { LitElement, html, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ContextProvider } from '@lit/context';
import { tableContext } from './table-context';

import { TableRow } from './table-row';
import { TableHeaderRow } from './table-header-row';

import styles from './table.scss';

/**
 * `kyn-table` Web Component.
 * This component provides a table with sorting, pagination, and selection capabilities.
 * It is designed to be used with the `kyn-table-toolbar` and `kyn-table-container` components.
 * @fires on-row-selection-change - Dispatched when the selection state of a row is toggled.
 * @fires on-all-rows-selection-change - Dispatched when the selection state of all rows is toggled.
 */

@customElement('kyn-table')
export class Table extends LitElement {
  static override styles = [styles];

  /**
   * checkboxSelection: Boolean indicating whether rows should be
   * selectable using checkboxes.
   */
  @property({ type: Boolean })
  checkboxSelection = false;

  /**
   * striped: Boolean indicating whether rows should have alternate
   * coloring.
   */
  @property({ type: Boolean })
  striped = false;

  /**
   * stickyHeader: Boolean indicating whether the table header
   * should be sticky.
   */
  @property({ type: Boolean })
  stickyHeader = false;

  /**
   * dense: Boolean indicating whether the table should be displayed
   * in dense mode.
   */
  @property({ type: Boolean })
  dense = false;

  /**
   * ellipsis: Boolean indicating whether the table should truncate
   * text content with an ellipsis.
   */
  @property({ type: Boolean })
  ellipsis = false;

  /**
   * fixedLayout: Boolean indicating whether the table should have a fixed layout.
   * This will set the table's layout to fixed, which means the table and column widths
   * will be determined by the width of the columns and not by the content of the cells.
   * This can be useful when you want to have a consistent column width across multiple tables.
   * */
  @property({ type: Boolean })
  fixedLayout = false;

  /**
   * _provider: Context provider for the table.
   * @ignore
   * @private
   */
  @state()
  private _provider = new ContextProvider(this, tableContext);

  /**
   * updated: Lifecycle method called when the element is updated.
   */
  override updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    // Update the context provider with the latest values
    this._provider.setValue({
      dense: this.dense,
      ellipsis: this.ellipsis,
      striped: this.striped,
      checkboxSelection: this.checkboxSelection,
      stickyHeader: this.stickyHeader,
    });
  }

  /**
   * tableHeaderRow: Reference to the header row of the table.
   * @ignore
   * @private
   */
  @state()
  private _tableHeaderRow: TableHeaderRow | null = null;

  /**
   * allRows: Array of objects representing each row in the data table.
   * @ignore
   * @private
   */
  @state()
  private _allRows: TableRow[] = [];

  /**
   * selectedRows: Set of row ids that are currently selected.
   * @ignore
   * @private
   */
  @state()
  private _selectedRows: TableRow[] = [];

  /**
   * headerCheckboxIndeterminate: Boolean indicating whether the header
   * checkbox is in an indeterminate state.
   * @ignore
   * @private
   */
  @state()
  private _headerCheckboxIndeterminate = false;

  /**
   * headerCheckboxChecked: Boolean indicating whether the header checkbox is
   * checked.
   * @ignore
   * @private
   */
  @state()
  private _headerCheckboxChecked = false;

  /**
   * Updates the state of the header checkbox based on the number of
   * selected rows.
   */
  updateHeaderCheckbox() {
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

    this._tableHeaderRow?.updateHeaderCheckboxState(
      this._headerCheckboxIndeterminate,
      this._headerCheckboxChecked
    );
  }

  /**
   * Handles the change of selection state for a specific row.
   */
  handleRowSelectionChange(event: CustomEvent) {
    const { target } = event;
    const { _selectedRows: selectedRows } = this;

    if (!this.contains(target as TableRow)) {
      return;
    }

    if (selectedRows.includes(target as TableRow)) {
      this._selectedRows = selectedRows.filter((e) => e !== target);
    } else {
      this._selectedRows.push(target as TableRow);
    }

    this.updateHeaderCheckbox();

    const init = {
      bubbles: true,
      cancelable: true,
      composed: true,
      detail: {
        selectedRow: target,
        selectedRows: this._selectedRows,
      },
    };
    this.dispatchEvent(new CustomEvent('on-row-selection-change', init));
  }

  /**
   * Toggles the selection state of all rows in the table.
   */
  toggleSelectionAll(event: CustomEvent) {
    const {
      detail: { checked },
      target,
    } = event;
    const { _allRows: allRows } = this;

    if (!this.contains(target as TableRow)) {
      return;
    }

    allRows.forEach((row) => {
      (row as TableRow).selected = checked;
    });

    if (!checked) {
      this._selectedRows = [];
    } else {
      this._selectedRows = [...allRows];
    }

    this.updateHeaderCheckbox();

    const init = {
      bubbles: true,
      cancelable: true,
      composed: true,
      detail: {
        selectedRows: this._selectedRows,
      },
    };
    this.dispatchEvent(new CustomEvent('on-all-rows-selection-change', init));
  }

  /**
   * Resets the selection state of all rows in the table.
   * This method is called when the table is reset or cleared.
   * @public
   * @returns void
   */
  updateAfterExternalChanges() {
    // Re-query the DOM to update the _allRows based on current children elements
    this._allRows = Array.from(this.querySelectorAll('kyn-tr'));

    // Update _selectedRows based on whether the row elements are marked as selected
    this._selectedRows = this._allRows.filter((row) => row.selected);

    this.updateHeaderCheckbox();
    this.requestUpdate();
  }

  /**
   * Returns the selected rows in the table.
   * @returns Array of selected rows.
   * @public
   */
  getSelectedRows() {
    return this._selectedRows;
  }

  override connectedCallback() {
    super.connectedCallback();

    this.addEventListener(
      'on-header-checkbox-toggle',
      this.toggleSelectionAll as EventListener
    );
    this.addEventListener(
      'on-row-select',
      this.handleRowSelectionChange as EventListener
    );
  }

  override disconnectedCallback() {
    super.disconnectedCallback();

    this.removeEventListener(
      'on-header-checkbox-toggle',
      this.toggleSelectionAll as EventListener
    );
    this.removeEventListener(
      'on-row-select',
      this.handleRowSelectionChange as EventListener
    );
  }

  override firstUpdated() {
    this._allRows = Array.from(this.querySelectorAll('kyn-tr'));
    this._tableHeaderRow = this.querySelector('kyn-header-tr');
  }

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
