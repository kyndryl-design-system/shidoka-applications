import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { action } from '@storybook/addon-actions';

import '../../button';
import maleIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/user.svg';
import femaleIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/user.svg';
import successIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/checkmark-filled.svg';
import warningIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/warning-filled.svg';
import failedIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/close-filled.svg';
import './action-menu.sample';
import '../../pagination';

import {
  sortById,
  sortByAge,
  sortByDate,
  sortByFName,
  sortByLName,
  extractData,
} from './ultils.sample';

import '../index';
import { Table } from '../table';

@customElement('story-table')
class MyStoryTable extends LitElement {
  static override styles = css`
    .min-max-width-100 {
      --kyn-td-min-width: 100px;
      --kyn-td-max-width: 100px;
      --kyn-td-width: 100px;
    }
  `;

  /**
   * kynTable: Reference to the kyn-table component.
   * @ignore
   */
  @state()
  private kynTable: Table | null | undefined;

  @property({ type: Array })
  rows: any = [];

  @property({ type: Array })
  selectedRows = [];

  @property({ type: Boolean, reflect: true })
  checkboxSelection = false;

  @property({ type: Boolean, reflect: true })
  striped = false;

  @property({ type: Boolean, reflect: true })
  stickyHeader = false;

  @property({ type: Boolean, reflect: true })
  dense = false;

  @property({ type: Boolean, reflect: true })
  fixedLayout = false;

  @property({ type: Number, reflect: true })
  selectedCount = 0;

  @property({ type: Boolean, reflect: true })
  showTableActions = false;

  @property({ type: Boolean, reflect: true })
  sortable = false;

  @property({ type: String, reflect: true })
  tableTitle = 'Table Title';

  @property({ type: String, reflect: true })
  tableSubtitle = 'Table Subtitle';

  @property({ type: Boolean })
  showPagination = false;

  @property({ type: Boolean })
  showLegend = false;

  @property({ type: Number })
  pageSize = 5;

  @property({ type: Number })
  pageNumber = 0;

  @property({ type: Array })
  pageSizeOptions = [5, 10];

  /** Option to hide the items range display. */
  @property({ type: Boolean })
  hideItemsRange = false;

  /** Option to hide the page size dropdown. */
  @property({ type: Boolean })
  hidePageSizeDropdown = false;

  /** Option to hide the navigation buttons. */
  @property({ type: Boolean })
  hideNavigationButtons = false;

  /**
   * multiSelectColumnWidth: The width of the multi-select column.
   * @type {string}
   * @default '64px'
   */
  @property({ type: String })
  multiSelectColumnWidth = '64px';

  /**
   * Handles the change of page size in pagination.
   */
  async onPageSizeChange(event: CustomEvent) {
    this.pageSize = Number(event.detail.value);
    this.pageNumber = 1;
    await this.updateComplete;

    this.kynTable?.updateAfterExternalChanges();
  }

  /**
   * Handles the change of page number in pagination.
   */
  async onPageNumberChange(event: CustomEvent) {
    this.pageNumber = event.detail.value;

    await this.updateComplete;
    this.kynTable?.updateAfterExternalChanges();
  }

  handleSortByIdNumber(e: CustomEvent) {
    const { sortDirection } = e.detail;
    this.rows.sort(sortById(sortDirection));
    this.requestUpdate();
  }

  handleSortByAge(e: CustomEvent) {
    const { sortDirection } = e.detail;
    this.rows.sort(sortByAge(sortDirection));
    this.requestUpdate();
  }

  handleSortByFName(e: CustomEvent) {
    const { sortDirection } = e.detail;
    this.rows.sort(sortByFName(sortDirection));
    this.requestUpdate();
  }

  handleSortByLName(e: CustomEvent) {
    const { sortDirection } = e.detail;
    this.rows.sort(sortByLName(sortDirection));
    this.requestUpdate();
  }

  handleSortByDate(e: CustomEvent) {
    const { sortDirection } = e.detail;
    this.rows.sort(sortByDate(sortDirection));
    this.requestUpdate();
  }

  async deleteAction(id: number) {
    const filteredRows = this.rows.filter((data: any) => data.id !== id);
    const filterSelectredRows = this.selectedRows.filter(
      (data: any) => data.rowId !== id
    );
    this.selectedRows = filterSelectredRows;
    this.rows = filteredRows;
    await this.updateComplete;

    // have to wait for the update to finish before calling this
    this.kynTable?.updateAfterExternalChanges();
  }

  async deleteSelectedRows() {
    const selectedRowIdsSet = new Set(
      this.selectedRows.map((row: any) => row.rowId)
    );
    this.rows = this.rows.filter((row: any) => !selectedRowIdsSet.has(row.id));

    this.selectedRows = [];
    await this.updateComplete;

    // have to wait for the update to finish before calling this
    this.kynTable?.updateAfterExternalChanges();
  }

  handleSelectedRowsChange(e: CustomEvent) {
    action(e.type)(e);
    const { selectedRows } = e.detail;
    this.selectedRows = selectedRows;
    this.requestUpdate();
  }

  override firstUpdated() {
    this.kynTable = this.shadowRoot?.querySelector('kyn-table');
  }

  override render() {
    const {
      rows,
      selectedRows,
      showTableActions,
      dense,
      striped,
      fixedLayout,
      stickyHeader,
      checkboxSelection,
      pageSize,
      pageNumber,
      pageSizeOptions,
      multiSelectColumnWidth,
    } = this;

    const currentRows = this.showPagination
      ? extractData(rows, pageNumber, pageSize)
      : rows;

    const fNameMaxWidth = 'auto';
    const tableTitle =
      selectedRows.length > 0
        ? selectedRows.length === 1
          ? '1 item selected'
          : `${selectedRows.length} items selected`
        : this.tableTitle;

    return html` <div style=${stickyHeader ? 'height: 400px' : ''}>
      <kyn-table-toolbar
        tableTitle=${tableTitle}
        tableSubtitle=${this.tableSubtitle}
      >
        ${showTableActions
          ? html`
              <action-menu @on-delete=${this.deleteSelectedRows}></action-menu>
            `
          : null}
      </kyn-table-toolbar>

      <kyn-table-container>
        <kyn-table
          ?striped=${striped}
          ?dense=${dense}
          ?fixedLayout=${fixedLayout}
          ?stickyHeader=${stickyHeader}
          ?checkboxSelection=${checkboxSelection}
          @on-row-selection-change=${this.handleSelectedRowsChange}
          @on-all-rows-selection-change=${this.handleSelectedRowsChange}
        >
          <kyn-thead>
            <kyn-header-tr .multiSelectColumnWidth=${multiSelectColumnWidth}>
              <kyn-th
                .align=${'center'}
                .sortable=${this.sortable}
                sortKey="id"
                @on-sort-changed=${this.handleSortByIdNumber}
              >
                ID
              </kyn-th>
              <kyn-th
                .sortable=${this.sortable}
                sortKey="firstName"
                @on-sort-changed=${this.handleSortByFName}
              >
                First Name
              </kyn-th>
              <kyn-th
                .sortable=${this.sortable}
                sortKey="lastName"
                @on-sort-changed=${this.handleSortByLName}
                >Last Name</kyn-th
              >
              <kyn-th
                .sortable=${this.sortable}
                sortKey="birthday"
                @on-sort-changed=${this.handleSortByDate}
                >Birthday</kyn-th
              >
              <kyn-th
                .sortable=${this.sortable}
                sortKey="age"
                @on-sort-changed=${this.handleSortByAge}
                .align=${'right'}
                >Age</kyn-th
              >
              <kyn-th>Full Name</kyn-th>
              <kyn-th .align=${'center'}>Gender</kyn-th>
              ${showTableActions ? html`<kyn-th>Action</kyn-th>` : html``}
            </kyn-header-tr>
          </kyn-thead>
          <kyn-tbody>
            ${repeat(
              currentRows,
              (row: any) => row.id,
              (row: any) => html`
                <kyn-tr
                  .rowId=${row.id}
                  key="row-${row.id}"
                  ?unread=${row.unread}
                >
                  <kyn-td .align=${'center'}>${row.id}</kyn-td>
                  <kyn-td .maxWidth=${fNameMaxWidth} title=${row.firstName}>
                    ${row.firstName}
                  </kyn-td>
                  <kyn-td class="min-max-width-100">${row.lastName}</kyn-td>
                  <kyn-td>${row.birthday}</kyn-td>
                  <kyn-td .align=${'right'}>${row.age}</kyn-td>
                  <kyn-td>${row.firstName} ${row.lastName}</kyn-td>
                  <kyn-td .align=${'center'}>
                    ${row.gender === 'male'
                      ? html`<span>${unsafeSVG(maleIcon)}</span>`
                      : html`<span>${unsafeSVG(femaleIcon)}</span>`}
                  </kyn-td>
                  ${showTableActions
                    ? html` <kyn-td>
                        <action-menu
                          @on-delete=${() => this.deleteAction(row.id)}
                        ></action-menu>
                      </kyn-td>`
                    : html``}
                </kyn-tr>
              `
            )}
          </kyn-tbody>
        </kyn-table>
      </kyn-table-container>

      <kyn-table-footer>
        ${this.showLegend
          ? html`
              <style>
                .success-icon svg {
                  fill: #00af41;
                  display: flex;
                }
                .warning-icon svg {
                  fill: #f5c400;
                  display: flex;
                }
                .failed-icon svg {
                  fill: #cc1800;
                  display: flex;
                }
              </style>
              <kyn-table-legend>
                <kyn-table-legend-item>
                  <span class="success-icon">${unsafeSVG(successIcon)}</span>
                  Success
                </kyn-table-legend-item>
                <kyn-table-legend-item>
                  <span class="warning-icon">${unsafeSVG(warningIcon)}</span>
                  Warning
                </kyn-table-legend-item>
                <kyn-table-legend-item>
                  <span class="failed-icon">${unsafeSVG(failedIcon)}</span>
                  Failed
                </kyn-table-legend-item>
              </kyn-table-legend>
            `
          : null}
        ${this.showPagination
          ? html`
              <kyn-pagination
                .count=${rows.length}
                .pageSize=${pageSize}
                .pageNumber=${pageNumber}
                .pageSizeOptions=${pageSizeOptions}
                .hideItemsRange=${this.hideItemsRange}
                .hidePageSizeDropdown=${this.hidePageSizeDropdown}
                .hideNavigationButtons=${this.hideNavigationButtons}
                @on-page-size-change=${this.onPageSizeChange}
                @on-page-number-change=${this.onPageNumberChange}
              ></kyn-pagination>
            `
          : null}
      </kyn-table-footer>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-story-table': MyStoryTable;
  }
}
