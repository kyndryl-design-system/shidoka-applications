import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';

import '../index';
import { Table } from '../table';

@customElement('story-column-filter')
class StoryColumnFilter extends LitElement {
  static override styles = css`
    .no-data {
      margin-top: 24px;
      width: 100%;
      color: var(--kd-color-text-level-secondary);
      pointer-events: none;
    }
    @media (max-width: 1232px) {
      .ellipsis-header {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 100px;
        display: block;
      }
    }
  `;

  /**
   * kynTable: Reference to the kyn-table component.
   * @ignore
   */
  @state()
  private accessor kynTable: Table | null | undefined;

  @property({ type: Array })
  accessor rows: any = [];

  @state()
  private accessor displayRows: any = [];

  @state()
  private accessor originalRows: any = [];

  @state()
  private accessor filterValues: { [key: string]: string } = {};

  @property({ type: String, reflect: true })
  accessor tableTitle = 'Table Title';

  override willUpdate(changedProperties: any) {
    if (changedProperties.has('rows') && this.rows && this.rows.length > 0) {
      this.originalRows = JSON.parse(JSON.stringify(this.rows));
      this.displayRows = JSON.parse(JSON.stringify(this.rows));
      this.filterValues = {};
    }
  }

  private applyFilters() {
    const hasActiveFilter = Object.values(this.filterValues).some(
      (value) => value && value.trim().length > 0
    );

    if (!hasActiveFilter) {
      // If no filters are active, show all original rows
      this.displayRows = JSON.parse(JSON.stringify(this.originalRows));
    } else {
      // Apply all active filters
      const filtered = this.originalRows.filter((row: any) => {
        return Object.entries(this.filterValues).every(([key, searchValue]) => {
          if (!searchValue || searchValue.trim().length === 0) {
            return true;
          }
          const rowValue = row[key];
          return (
            rowValue &&
            rowValue.toLowerCase().includes(searchValue.toLowerCase())
          );
        });
      });
      this.displayRows = filtered;
    }

    this.requestUpdate();
  }

  _handleSearchByapplnName(e: CustomEvent) {
    const { searchValue } = e.detail;
    console.log('searchValue applnName:', searchValue, e.detail);
    this.filterValues = {
      ...this.filterValues,
      applnName: searchValue?.trim() || '',
    };
    this.applyFilters();
  }

  _handleSearchByBusinessService(e: CustomEvent) {
    const { searchValue } = e.detail;
    this.filterValues = {
      ...this.filterValues,
      businessService: searchValue?.trim() || '',
    };
    this.applyFilters();
  }

  _handleSearchByBusinessGroups(e: CustomEvent) {
    const { searchValue } = e.detail;
    this.filterValues = {
      ...this.filterValues,
      businessGroups: searchValue?.trim() || '',
    };
    this.applyFilters();
  }

  override firstUpdated() {
    this.kynTable = this.shadowRoot?.querySelector('kyn-table');
  }

  override render() {
    const { displayRows } = this;

    const currentRows = displayRows;

    return html`
      <kyn-table-toolbar
        tableTitle="Column Filter"
        tableSubtitle="SubTitle Text"
      >
      </kyn-table-toolbar>

      <kyn-table-container>
        <kyn-table>
          <kyn-thead>
            <kyn-header-tr>
              <kyn-th
                enableFiltering
                searchKey="applnName"
                @on-search=${this._handleSearchByapplnName}
              >
                <span class="ellipsis-header">Applications</span>
              </kyn-th>
              <kyn-th
                enableFiltering
                searchKey="businessServices"
                @on-search=${this._handleSearchByBusinessService}
                ><span class="ellipsis-header">Business Service</span></kyn-th
              >
              <kyn-th enableFiltering
              searchKey="businessGroups"
                @on-search=${this._handleSearchByBusinessGroups}
                ><span class="ellipsis-header">Business Groups</span></kyn-th
              >
              <kyn-th enableFiltering .align=${'right'}
                ><span class="ellipsis-header">Oppurtunity Size</span></kyn-th
              >
              <kyn-th enableFiltering .align=${'right'}
                ><span class="ellipsis-header">Criticality Risk %</span></kyn-th
              >
              <kyn-th enableFiltering .align=${'right'}
                ><span class="ellipsis-header">Complexity Risk %</span></kyn-th
                ></kyn-th
              >
            </kyn-header-tr>
            
          </kyn-thead>
          <kyn-tbody>
            ${
              currentRows.length === 0
                ? html` <div class="no-data">
                    <kyn-tr> No records to display. </kyn-tr>
                  </div>`
                : repeat(
                    currentRows,
                    (row: any) => html`
                      <kyn-tr>
                        <kyn-td> ${row.applnName} </kyn-td>
                        <kyn-td>${row.businessService}</kyn-td>
                        <kyn-td>${row.businessGroups}</kyn-td>
                        <kyn-td .align=${'right'}
                          >${row.oppurtunitySize}</kyn-td
                        >
                        <kyn-td .align=${'right'}>
                          ${row.criticalityRisk}</kyn-td
                        >
                        <kyn-td .align=${'right'}>
                          ${row.complexityRisk}</kyn-td
                        >
                      </kyn-tr>
                    `
                  )
            }
          </kyn-tbody>
        </kyn-table>
      </kyn-table-container>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'story-column-filter': StoryColumnFilter;
  }
}
