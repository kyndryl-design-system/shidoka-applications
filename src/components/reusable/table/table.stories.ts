import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { useArgs } from 'storybook/preview-api';
/**
 * Copyright Kyndryl, Inc. 2023
 */

// Import external libraries
import { html } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { action } from 'storybook/actions';

// Kyndryl Design System Components and Icons
import './index';
import './story-helpers/action-menu.sample';
import './story-helpers/table-story.sample';
import './story-helpers/table.settings.sample';
import {
  characters,
  dataForColumns,
  dataForColumnsFilter,
} from './story-helpers/ultils.sample';
import allData from './story-helpers/table-data.json';
import '../../reusable/dropdown';
import '../../reusable/tag';
import '../../reusable/textInput';

import maleIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/user.svg';
import femaleIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/user.svg';

const meta: Meta = {
  title: 'Components/Data Table',
  component: 'kyn-table',
  subcomponents: {
    'kyn-table-container': 'kyn-table-container',
    'kyn-table-toolbar': 'kyn-table-toolbar',
    'kyn-th': 'kyn-th',
    'kyn-tr': 'kyn-tr',
    'kyn-expanded-tr': 'kyn-expanded-tr',
    'kyn-td': 'kyn-td',
    'kyn-thead': 'kyn-thead',
    'kyn-tbody': 'kyn-tbody',
    'kyn-header-tr': 'kyn-header-tr',
    'kyn-tfoot': 'kyn-tfoot',
    'kyn-table-footer': 'kyn-table-footer',
    'kyn-table-legend': 'kyn-table-legend',
    'kyn-table-legend-item': 'kyn-table-legend-item',
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/9Q2XfTSxfzTXfNe2Bi8KDS/Component-Viewer?node-id=1-382289&p=f&m=dev',
    },
  },
};

export default meta;

// Type definition for the story
type Story = StoryObj;

const parameters = {
  docs: {
    source: {
      code: `
      // For guidance on how to construct this code, please refer to the 'table-story.ts' file.
      // You can find it at the following path:
      // https://github.com/kyndryl-design-system/shidoka-applications/tree/main/src/components/reusable/table/story-helpers/table-story.sample.ts
      `,
    },
  },
};

export const Basic: Story = {
  render: () => {
    return html`
      <story-table .tableTitle=${'Basic'} .rows=${characters}> </story-table>
    `;
  },
  parameters,
};

export const Sorting: Story = {
  args: {
    sortable: true,
  },
  render: (args) => {
    return html`
      <story-table
        .tableTitle=${'Sorting'}
        .rows=${characters}
        ?sortable=${args.sortable}
      >
      </story-table>
    `;
  },
  parameters,
};

export const Selection: Story = {
  render: () => {
    return html`
      <h4>Important Information about Row Selection</h4>
      <ul>
        <li>
          <b>Note:</b> The 'rowId' attribute is required when enabling
          multi-selection functionality.
        </li>

        <li>
          The 'getSelectedRows' method is publicly accessible and can be
          optionally used to fetch the currently selected rows from the table,
          as per requirement.
        </li>
      </ul>

      <story-table
        .tableTitle=${'Selection'}
        .rows=${characters}
        ?checkboxSelection=${true}
        .multiSelectColumnWidth=${'64px'}
      >
      </story-table>
    `;
  },
  parameters,
};

export const NestedTable: Story = {
  args: {
    textStrings: {
      expanded: 'Expanded',
      collapsed: 'Collapsed',
    },
  },
  render: (args) => {
    const rows = allData.slice(0, 5);
    return html` <style>
        .story-table-container {
          padding-bottom: 30px;
        }
      </style>
      <kyn-table-toolbar tableTitle=${'Nesting Table'}> </kyn-table-toolbar>
      <kyn-table
        @on-row-selection-change=${(e: Event) => action(e.type)(e)}
        @on-all-rows-selection-change=${(e: Event) => action(e.type)(e)}
      >
        <kyn-thead>
          <kyn-header-tr expandable checkboxSelection>
            <kyn-th .align=${'center'}>ID</kyn-th>
            <kyn-th>First Name</kyn-th>
            <kyn-th>Last Name</kyn-th>
            <kyn-th>Birthday</kyn-th>
            <kyn-th .align=${'right'}>Age</kyn-th>
            <kyn-th>Full Name</kyn-th>
            <kyn-th .align=${'center'}>Gender</kyn-th>
          </kyn-header-tr>
        </kyn-thead>
        <kyn-tbody>
          ${repeat(
            rows,
            (row: any) => row.id,
            (row: any) => html`
              <kyn-tr
                .rowId=${row.id}
                key="row-${row.id}"
                expandable
                checkboxSelection
                .textStrings=${args.textStrings}
              >
                <kyn-td .align=${'center'}>${row.id}</kyn-td>
                <kyn-td>${row.firstName}</kyn-td>
                <kyn-td>${row.lastName}</kyn-td>
                <kyn-td>${row.birthday}</kyn-td>
                <kyn-td .align=${'right'}>${row.age}</kyn-td>
                <kyn-td>${row.firstName} ${row.lastName}</kyn-td>
                <kyn-td .align=${'center'}>
                  ${row.gender === 'male'
                    ? html`<span>${unsafeSVG(maleIcon)}</span>`
                    : html`<span>${unsafeSVG(femaleIcon)}</span>`}
                </kyn-td>
              </kyn-tr>
              <kyn-expanded-tr .colSpan=${8}>
                <div class="story-table-container">
                  <story-table
                    checkboxSelection
                    .rows=${characters}
                    .tableTitle=${'Nested Table'}
                  ></story-table>
                </div>
              </kyn-expanded-tr>
            `
          )}
        </kyn-tbody>
      </kyn-table>`;
  },
  parameters,
};

export const ExpandableRows: Story = {
  args: {
    textStrings: {
      expanded: 'Expanded',
      collapsed: 'Collapsed',
    },
  },
  render: (args) => {
    return html` <style>
        .center-content {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 140px;
        }
      </style>
      <kyn-table-toolbar tableTitle=${'Expanded Rows'}> </kyn-table-toolbar>
      <kyn-table>
        <kyn-thead>
          <kyn-header-tr>
            <kyn-th width="200px" .align=${'center'}>ID</kyn-th>
            <kyn-th>First Name</kyn-th>
            <kyn-th>Last Name</kyn-th>
            <kyn-th>Birthday</kyn-th>
            <kyn-th .align=${'right'}>Age</kyn-th>
            <kyn-th>Full Name</kyn-th>
            <kyn-th .align=${'center'}>Gender</kyn-th>
          </kyn-header-tr>
        </kyn-thead>
        <kyn-tbody>
          ${repeat(
            characters,
            (row: any) => row.id,
            (row: any) => html`
              <kyn-tr
                .rowId=${row.id}
                key="row-${row.id}"
                expandable
                .textStrings=${args.textStrings}
              >
                <kyn-td .align=${'center'}>${row.id}</kyn-td>
                <kyn-td>${row.firstName}</kyn-td>
                <kyn-td>${row.lastName}</kyn-td>
                <kyn-td>${row.birthday}</kyn-td>
                <kyn-td .align=${'right'}>${row.age}</kyn-td>
                <kyn-td>${row.firstName} ${row.lastName}</kyn-td>
                <kyn-td .align=${'center'}>
                  ${row.gender === 'male'
                    ? html`<span>${unsafeSVG(maleIcon)}</span>`
                    : html`<span>${unsafeSVG(femaleIcon)}</span>`}
                </kyn-td>
              </kyn-tr>
              <kyn-expanded-tr .colSpan=${8}>
                <div class="center-content">
                  Put your expanded table content here
                </div>
              </kyn-expanded-tr>
            `
          )}
        </kyn-tbody>
      </kyn-table>`;
  },
  parameters,
};

export const SortAndExpand: Story = {
  args: {
    sortable: true,
  },
  render: (args) => {
    return html`
      <story-table
        .tableTitle=${'Sorting'}
        .rows=${characters}
        sortable
        expandable
      >
      </story-table>
    `;
  },
  parameters,
};

export const BatchActions: Story = {
  args: {
    checkboxSelection: true,
    showTableActions: true,
  },
  render: (args) => {
    return html`
      <story-table
        .tableTitle=${'Batch Actions'}
        .rows=${characters}
        ?checkboxSelection=${args.checkboxSelection}
        ?showTableActions=${args.showTableActions}
      >
      </story-table>
    `;
  },
  parameters,
};

export const Pagination: Story = {
  args: {
    pageSize: 5,
    pageNumber: 1,
    pageSizeOptions: [5, 10, 20, 30, 40, 50, 100],
  },
  render: (args) => {
    const rows = allData;
    return html`
      <story-table
        .tableTitle=${'Pagination'}
        .rows=${rows}
        .pageSize=${args.pageSize}
        .pageNumber=${args.pageNumber}
        .pageSizeOptions=${args.pageSizeOptions}
        showPagination
      >
      </story-table>
    `;
  },
  parameters,
};

export const Legend: Story = {
  args: {
    pageSize: 5,
    pageNumber: 1,
    pageSizeOptions: [5, 10, 20, 30, 40, 50, 100],
  },
  render: (args) => {
    return html`
      <story-table
        .tableTitle=${'Legend'}
        .rows=${characters}
        .pageSize=${args.pageSize}
        .pageNumber=${args.pageNumber}
        .pageSizeOptions=${args.pageSizeOptions}
        showLegend
        showPagination
      >
      </story-table>
    `;
  },
  parameters,
};

export const StickyHeader: Story = {
  args: {
    stickyHeader: true,
  },
  render: (args) => {
    const rows = allData;
    return html`
      <story-table
        .tableTitle=${'Sticky Header'}
        .rows=${rows}
        ?stickyHeader=${args.stickyHeader}
      >
      </story-table>
    `;
  },
  parameters,
};

export const StripedRows: Story = {
  args: {
    striped: true,
  },
  render: (args) => {
    return html`
      <story-table
        .tableTitle=${'Striped Rows'}
        .rows=${characters}
        ?striped=${args.striped}
      >
      </story-table>
    `;
  },
  parameters,
};

export const Dense: Story = {
  args: {
    dense: true,
  },
  render: (args) => {
    return html`
      <story-table
        .tableTitle=${'Dense'}
        .rows=${characters}
        ?dense=${args.dense}
      >
      </story-table>
    `;
  },
  parameters,
};

export const FixedLayout: Story = {
  args: {
    fixedLayout: true,
  },
  render: (args) => {
    return html`
      <story-table
        .tableTitle=${'Fixed Layout'}
        .rows=${characters}
        ?fixedLayout=${args.fixedLayout}
      >
      </story-table>
    `;
  },
  parameters,
};

export const DisabledRows: Story = {
  render: () => {
    return html` <kyn-table-toolbar tableTitle=${'Disabled Rows'}>
      </kyn-table-toolbar>
      <kyn-table checkboxSelection>
        <kyn-thead>
          <kyn-header-tr>
            <kyn-th .align=${'center'}>ID</kyn-th>
            <kyn-th>First Name</kyn-th>
            <kyn-th>Last Name</kyn-th>
            <kyn-th>Birthday</kyn-th>
            <kyn-th .align=${'right'}>Age</kyn-th>
            <kyn-th>Full Name</kyn-th>
            <kyn-th .align=${'center'}>Action</kyn-th>
          </kyn-header-tr>
        </kyn-thead>
        <kyn-tbody>
          ${repeat(
            characters,
            (row: any) => row.id,
            (row: any) => html`
              <kyn-tr
                .rowId=${row.id}
                key="row-${row.id}"
                ?disabled=${row.id == 1 || row.id == 3 ? true : false}
                ?selected=${row.id == 2 ? true : false}
              >
                <kyn-td .align=${'center'}>${row.id}</kyn-td>
                <kyn-td>${row.firstName}</kyn-td>
                <kyn-td>${row.lastName}</kyn-td>
                <kyn-td>${row.birthday}</kyn-td>
                <kyn-td .align=${'right'}>${row.age}</kyn-td>
                <kyn-td>${row.firstName} ${row.lastName}</kyn-td>
                <kyn-td .align=${'center'}>
                  <action-menu
                    ?disabled=${row.id == 1 || row.id == 3 ? true : false}
                  ></action-menu>
                </kyn-td>
              </kyn-tr>
            `
          )}
        </kyn-tbody>
      </kyn-table>`;
  },
};

export const ColumnSettings: Story = {
  args: {
    fixedLayout: true,
  },
  render: () => {
    return html`
      <story-table-settings .rows=${dataForColumns}> </story-table-settings>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
        // For guidance on how to construct this code, please refer to the 'table-story.ts' file.
        // You can find it at the following path:
        // https://github.com/kyndryl-design-system/shidoka-applications/tree/main/src/components/reusable/table/story-helpers/table.settings.ts
        `,
      },
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/9Q2XfTSxfzTXfNe2Bi8KDS/Component-Viewer?node-id=3-414323&p=f&m=dev',
    },
  },
};

export const Skeleton = {
  args: {
    rows: 5,
    showPagination: true,
    hideTableTitles: false,
    striped: false,
    dense: false,
    fixedLayout: false,
    tableTitle: '',
    tableSubtitle: '',
    showGlobalFilter: true,
  },
  render: (args) => {
    return html`<kyn-table-skeleton
      .rows=${args.rows}
      ?showPagination=${args.showPagination}
      ?dense=${args.dense}
      ?striped=${args.striped}
      ?fixedLayout=${args.fixedLayout}
      ?hideTableTitles=${args.hideTableTitles}
      tableTitle=${args.tableTitle}
      tableSubtitle=${args.tableSubtitle}
      ?showGlobalFilter=${args.showGlobalFilter}
    ></kyn-table-skeleton>`;
  },
  parameters: {
    docs: {
      source: {
        code: `
        // For guidance on how to construct this code, please refer to the 'table.skeleton.ts' file.
        // You can find it at the following path:
        // https://github.com/kyndryl-design-system/shidoka-applications/tree/main/src/components/reusable/table/table-skeleton.ts
        `,
      },
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/9Q2XfTSxfzTXfNe2Bi8KDS/Component-Viewer?node-id=1-546635&m=dev',
    },
    argTypes: {
      rows: {
        control: { type: 'number' },
        description: 'Number of skeleton rows to display',
      },
      showPagination: {
        control: { type: 'boolean' },
      },
      checkboxSelection: {
        control: { type: 'boolean' },
      },
      hideTableTitles: {
        control: { type: 'boolean' },
      },
      dense: {
        control: { type: 'boolean' },
      },
      fixedLayout: {
        control: { type: 'boolean' },
      },
      striped: {
        control: { type: 'boolean' },
      },
      tableTitle: {
        control: { type: 'text' },
        description: 'Title to display in the table toolbar',
      },
      tableSubtitle: {
        control: { type: 'text' },
        description: 'Subtitle to display in the table toolbar',
      },
    },
  },
};

export const WithFooter: Story = {
  render: () => {
    return html`
      <kyn-table-toolbar
        .tableTitle=${'With Footer'}
        .tableSubtitle=${'Table Subtitle'}
      >
      </kyn-table-toolbar>
      <kyn-table-container>
        <kyn-table>
          <kyn-thead>
            <kyn-header-tr>
              <kyn-th .align=${'center'} resizable>ID</kyn-th>
              <kyn-th resizable>First Name</kyn-th>
              <kyn-th resizable>Last Name</kyn-th>
              <kyn-th resizable>Birthday</kyn-th>
              <kyn-th .align=${'right'} resizable>Age</kyn-th>
              <kyn-th .align=${'right'}>Account Deposits($)</kyn-th>
            </kyn-header-tr>
          </kyn-thead>
          <kyn-tbody>
            ${repeat(
              characters,
              (row: any) => row.id,
              (row: any) => html`
                <kyn-tr .rowId=${row.id}>
                  <kyn-td .align=${'center'}>${row.id}</kyn-td>
                  <kyn-td>${row.firstName}</kyn-td>
                  <kyn-td>${row.lastName}</kyn-td>
                  <kyn-td>${row.birthday}</kyn-td>
                  <kyn-td .align=${'right'}>${row.age}</kyn-td>
                  <kyn-td .align=${'right'}>${row.deposits}</kyn-td>
                </kyn-tr>
              `
            )}
          </kyn-tbody>

          <kyn-tfoot>
            <kyn-tr>
              <kyn-td></kyn-td>
              <kyn-td></kyn-td>
              <kyn-td></kyn-td>
              <kyn-td></kyn-td>
              <kyn-td></kyn-td>
              <kyn-td .align=${'right'}>Total:38000</kyn-td>
            </kyn-tr>
          </kyn-tfoot>
        </kyn-table>
      </kyn-table-container>
    `;
  },
};

const columnFilterValues: { [key: string]: string } = {
  applnName: '',
  businessService: '',
  businessGroups: '',
  ticketStatus: '',
};
export const ColumnFiltering: Story = {
  args: {
    rows: dataForColumnsFilter,
  },
  parameters: { a11y: { disable: true } },
  render: function (args) {
    // Store original rows value (module level)
    let originalRowsValue: any[] = [];

    const [{ rows }, updateArgs] = useArgs();

    // Store original rows on first render
    if (originalRowsValue.length === 0) {
      originalRowsValue = JSON.parse(JSON.stringify(dataForColumnsFilter));
    }

    const originalRows = originalRowsValue;
    const filterValues = columnFilterValues;

    const applyFilters = () => {
      const hasActiveFilter = Object.values(filterValues).some(
        (value) => value && value.trim().length > 0
      );

      let filteredRows = originalRows;

      if (hasActiveFilter) {
        filteredRows = originalRows.filter((row: any) => {
          const matches = Object.entries(filterValues).every(
            ([key, searchValue]) => {
              if (!searchValue || searchValue.trim().length === 0) {
                return true;
              }
              const rowValue = row[key];
              if (rowValue === undefined || rowValue === null) {
                return false;
              }

              const match = rowValue
                .toString()
                .toLowerCase()
                .includes(searchValue.toLowerCase());

              return match;
            }
          );
          return matches;
        });
      }

      updateArgs({ rows: filteredRows });
    };

    const handleSearch = (columnKey: string, event: Event) => {
      const searchElement = event.target as HTMLInputElement;
      const searchValue = searchElement.value || '';
      columnFilterValues[columnKey] = searchValue?.trim() || '';
      applyFilters();
    };

    return html`
      <kyn-table-toolbar
        tableTitle="Column Filtering"
        tableSubtitle="SubTitle Text"
      >
      </kyn-table-toolbar>

      <kyn-table-container>
        <kyn-table>
          <kyn-thead>
            <kyn-header-tr>
              <kyn-th>
                <span class="ellipsis-header">Ticket Priority</span>
                <kyn-dropdown
                  slot="column-filter"
                  size="sm"
                  placeholder=" "
                  hideLabel
                  multiple
                  hideTags
                >
                  <kyn-dropdown-option value="p1"> P1 </kyn-dropdown-option>
                  <kyn-dropdown-option value="p2">P2</kyn-dropdown-option>
                  <kyn-dropdown-option value="p3"> P3 </kyn-dropdown-option>
                  <kyn-dropdown-option value="p4"> P4 </kyn-dropdown-option>
                </kyn-dropdown>
              </kyn-th>
              <kyn-th>
                <span class="ellipsis-header">Applications</span>
                <kyn-text-input
                  style="width: 100%;"
                  slot="column-filter"
                  size="sm"
                  type="search"
                  value=""
                  hideLabel
                  @on-input=${(e: Event) => handleSearch('applnName', e)}
                ></kyn-text-input>
              </kyn-th>
              <kyn-th>
                <span class="ellipsis-header">Business Service</span>
                <kyn-text-input
                  style="width: 100%;"
                  slot="column-filter"
                  size="sm"
                  type="search"
                  value=""
                  hideLabel
                  @on-input=${(e: Event) => handleSearch('businessService', e)}
                ></kyn-text-input>
              </kyn-th>
              <kyn-th>
                <span class="ellipsis-header">Business Groups</span>
                <kyn-text-input
                  style="width: 100%;"
                  slot="column-filter"
                  size="sm"
                  type="search"
                  value=""
                  hideLabel
                  @on-input=${(e: Event) => handleSearch('businessGroups', e)}
                ></kyn-text-input>
              </kyn-th>
              <kyn-th>
                <span class="ellipsis-header">Ticket Status</span>
                <kyn-dropdown
                  slot="column-filter"
                  label=${args.label}
                  size="sm"
                  hideLabel
                  placeholder=" "
                  @on-change=${(e: Event) => handleSearch('ticketStatus', e)}
                >
                  <kyn-dropdown-option value="In Progress">
                    In Progress
                  </kyn-dropdown-option>
                  <kyn-dropdown-option value="On Hold"
                    >On Hold</kyn-dropdown-option
                  >
                  <kyn-dropdown-option value="Cancelled">
                    Cancelled
                  </kyn-dropdown-option>
                </kyn-dropdown>
              </kyn-th>
              <kyn-th .align=${'right'}>
                <span class="ellipsis-header">Criticality Risk %</span>
                <kyn-text-input
                  slot="column-filter"
                  size="sm"
                  type="search"
                  value=""
                  hideLabel
                ></kyn-text-input>
              </kyn-th>
            </kyn-header-tr>
          </kyn-thead>
          <kyn-tbody>
            ${rows.length === 0
              ? html`
                  <div class="no-data">
                    <kyn-tr> No records to display. </kyn-tr>
                  </div>
                `
              : repeat(
                  rows,
                  (row: any) => html`
                    <kyn-tr>
                      <kyn-td> ${row.ticketPriority} </kyn-td>
                      <kyn-td> ${row.applnName} </kyn-td>
                      <kyn-td>${row.businessService}</kyn-td>
                      <kyn-td>${row.businessGroups}</kyn-td>
                      <kyn-td><kyn-tag
                              tagSize="md"
                              tagColor=${
                                row.ticketStatus === 'In Progress'
                                  ? 'spruce'
                                  : row.ticketStatus === 'On Hold'
                                  ? 'lilac'
                                  : 'default'
                              }
                            />
                            ${row.ticketStatus}
                          </kyn-tag></kyn-td>
                      <kyn-td .align=${'right'}>${row.criticalityRisk}</kyn-td>
                    </kyn-tr>
                  `
                )}
          </kyn-tbody>
        </kyn-table>
      </kyn-table-container>
      <style>
        .no-data {
          margin-top: 24px;
          width: 100%;
          color: var(--kd-color-text-level-secondary);
          pointer-events: none;
        }
        kyn-table-container {
          overflow: visible;
        }
        kyn-thead {
          overflow: visible;
        }
        kyn-th {
          overflow: visible;
          kyn-dropdown {
            display: block;
            min-width: 200px;
          }
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
      </style>
    `;
  },
};
export const ResizableColumns: Story = {
  args: {
    checkboxSelection: false,
    striped: true,
    stickyHeader: false,
    dense: false,
  },
  render: (args) => {
    const basicData = [
      {
        id: '1',
        name: 'John Smith',
        email: 'john.smith@example.com',
        department: 'Engineering',
        status: 'Active',
      },
      {
        id: '2',
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        department: 'Marketing',
        status: 'Active',
      },
      {
        id: '3',
        name: 'Bob Johnson',
        email: 'bob.johnson@example.com',
        department: 'Sales',
        status: 'Inactive',
      },
      {
        id: '4',
        name: 'Alice Williams',
        email: 'alice.williams@example.com',
        department: 'HR',
        status: 'Active',
      },
      {
        id: '5',
        name: 'Charlie Brown',
        email: 'charlie.brown@example.com',
        department: 'Finance',
        status: 'Active',
      },
    ];

    return html`
      <kyn-table-container>
        <kyn-table
          ?checkboxSelection=${args.checkboxSelection}
          ?striped=${args.striped}
          ?stickyHeader=${args.stickyHeader}
          ?dense=${args.dense}
        >
          <kyn-thead>
            <kyn-header-tr>
              <kyn-th resizable> Name </kyn-th>
              <kyn-th resizable> Email </kyn-th>
              <kyn-th resizable> Department </kyn-th>
              <kyn-th resizable> Status </kyn-th>
            </kyn-header-tr>
          </kyn-thead>
          <kyn-tbody>
            ${repeat(
              basicData,
              (row) => row.id,
              (row) => html`
                <kyn-tr row-id=${row.id}>
                  <kyn-td>${row.name}</kyn-td>
                  <kyn-td>${row.email}</kyn-td>
                  <kyn-td>${row.department}</kyn-td>
                  <kyn-td
                    ><kyn-tag
                      .type=${row.status === 'Active' ? 'success' : 'secondary'}
                      >${row.status}</kyn-tag
                    ></kyn-td
                  >
                </kyn-tr>
              `
            )}
          </kyn-tbody>
        </kyn-table>
      </kyn-table-container>

      <style>
        kyn-table-container {
          margin-top: 16px;
        }

        /* kyn-th {
          user-select: none;
        } */
      </style>
    `;
  },
};
