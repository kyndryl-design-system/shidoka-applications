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

import maleIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/gender-male.svg';
import femaleIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/gender-female.svg';
import lgCube from '@kyndryl-design-system/shidoka-icons/svg/monochrome/32/cube.svg';

import successIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/checkmark-filled.svg';
import warningIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/warning-filled.svg';
import failedIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/close-filled.svg';

const meta: Meta = {
  title: 'Components/Data Display/Data Table',
  component: 'kyn-table',
  subcomponents: {
    'kyn-table-container': 'kyn-table-container',
    'kyn-table-toolbar': 'kyn-table-toolbar',
    'kyn-th': 'kyn-th',
    'kyn-th-group': 'kyn-th-group',
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

export const Basic: Story = {
  render: () => {
    return html`
      <kyn-table-toolbar
        .tableTitle=${'Basic'}
        tableSubtitle=${'Table Subtitle'}
      >
      </kyn-table-toolbar>

      <kyn-table-container>
        <kyn-table>
          <kyn-thead>
            <kyn-header-tr>
              <kyn-th .align=${'center'}> ID </kyn-th>
              <kyn-th> First Name </kyn-th>
              <kyn-th> Last Name </kyn-th>
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
                <kyn-tr .rowId=${row.id} key="row-${row.id}">
                  <kyn-td .align=${'center'}>${row.id}</kyn-td>
                  <kyn-td> ${row.firstName} </kyn-td>
                  <kyn-td>${row.lastName}</kyn-td>
                  <kyn-td>${row.birthday}</kyn-td>
                  <kyn-td .align=${'right'}>${row.age}</kyn-td>
                  <kyn-td>${row.firstName} ${row.lastName}</kyn-td>
                  <kyn-td .align=${'center'}>
                    ${row.gender === 'Male'
                      ? html`<span>${unsafeSVG(maleIcon)}</span>`
                      : html`<span>${unsafeSVG(femaleIcon)}</span>`}
                  </kyn-td>
                </kyn-tr>
              `
            )}
          </kyn-tbody>
        </kyn-table>
      </kyn-table-container>
    `;
  },
};

export const Sorting: Story = {
  args: {
    sortable: true,
    rows: characters,
  },
  render: (args) => {
    const [{ rows }, updateArgs] = useArgs();
    let characters = rows;

    const handleSort = (e: Event) => {
      action(e.type)({ ...e, detail: (e as CustomEvent).detail });
      const detail = (e as CustomEvent).detail;
      const sortKey = detail.sortKey;
      const sortDirection = detail.sortDirection;
      const sorted = [...characters];

      // Sorting the data
      const direction = sortDirection === 'asc' ? 1 : -1;
      sorted.sort((a: any, b: any) => {
        const valueA = a[sortKey];
        const valueB = b[sortKey];

        // Handle numeric sorting
        if (typeof valueA === 'number' && typeof valueB === 'number') {
          return (valueA - valueB) * direction;
        }

        // Handle date sorting
        if (
          sortKey === 'birthday' &&
          typeof valueA === 'string' &&
          typeof valueB === 'string'
        ) {
          const dateA = new Date(valueA);
          const dateB = new Date(valueB);
          return (dateA.getTime() - dateB.getTime()) * direction;
        }

        // Handle string sorting (firstName, lastName)
        if (typeof valueA === 'string' && typeof valueB === 'string') {
          return valueA.localeCompare(valueB) * direction;
        }

        return 0;
      });

      characters = sorted;
      updateArgs({ rows: sorted });
    };
    return html`
      <kyn-table-toolbar
        .tableTitle=${'Sorting'}
        tableSubtitle=${'Table Subtitle'}
      >
      </kyn-table-toolbar>

      <kyn-table-container>
        <kyn-table>
          <kyn-thead>
            <kyn-header-tr>
              <kyn-th
                .align=${'center'}
                .sortable=${args.sortable}
                sortKey="id"
                @on-sort-changed=${handleSort}
              >
                ID
              </kyn-th>
              <kyn-th
                .sortable=${args.sortable}
                sortKey="firstName"
                @on-sort-changed=${handleSort}
              >
                First Name
              </kyn-th>
              <kyn-th
                .sortable=${args.sortable}
                sortKey="lastName"
                @on-sort-changed=${handleSort}
              >
                Last Name
              </kyn-th>
              <kyn-th
                .sortable=${args.sortable}
                sortKey="birthday"
                @on-sort-changed=${handleSort}
                >Birthday</kyn-th
              >
              <kyn-th
                .align=${'right'}
                .sortable=${args.sortable}
                sortKey="age"
                @on-sort-changed=${handleSort}
                >Age</kyn-th
              >
              <kyn-th>Full Name</kyn-th>
              <kyn-th .align=${'center'}>Gender</kyn-th>
            </kyn-header-tr>
          </kyn-thead>
          <kyn-tbody>
            ${repeat(
              characters,
              (row: any) => row.id,
              (row: any) => html`
                <kyn-tr .rowId=${row.id} key="row-${row.id}">
                  <kyn-td .align=${'center'}>${row.id}</kyn-td>
                  <kyn-td> ${row.firstName} </kyn-td>
                  <kyn-td>${row.lastName}</kyn-td>
                  <kyn-td>${row.birthday}</kyn-td>
                  <kyn-td .align=${'right'}>${row.age}</kyn-td>
                  <kyn-td>${row.firstName} ${row.lastName}</kyn-td>
                  <kyn-td .align=${'center'}>
                    ${row.gender === 'Male'
                      ? html`<span>${unsafeSVG(maleIcon)}</span>`
                      : html`<span>${unsafeSVG(femaleIcon)}</span>`}
                  </kyn-td>
                </kyn-tr>
              `
            )}
          </kyn-tbody>
        </kyn-table>
      </kyn-table-container>
    `;
  },
};

export const Selection: Story = {
  render: () => {
    let selectedCount = 0;

    const handleSelectionChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      const selectedRows = customEvent.detail.selectedRows;
      selectedCount = selectedRows.length;

      const toolbar = document.querySelector('kyn-table-toolbar');
      if (toolbar) {
        toolbar.setAttribute(
          'tableTitle',
          selectedCount > 0 ? `${selectedCount} items selected` : 'Selection'
        );
      }

      action(e.type)({ ...e, detail: customEvent.detail });
    };

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

      <kyn-table-toolbar
        .tableTitle=${'Selection'}
        tableSubtitle=${'Table Subtitle'}
      >
      </kyn-table-toolbar>

      <kyn-table-container>
        <kyn-table
          ?checkboxSelection=${true}
          enableBulkSelectionMenu
          @on-row-selection-change=${handleSelectionChange}
          @on-all-rows-selection-change=${handleSelectionChange}
        >
          <kyn-thead>
            <kyn-header-tr .multiSelectColumnWidth=${'64px'}>
              <kyn-th .align=${'center'}> ID </kyn-th>
              <kyn-th> First Name </kyn-th>
              <kyn-th> Last Name </kyn-th>
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
                <kyn-tr .rowId=${row.id} key="row-${row.id}">
                  <kyn-td .align=${'center'}>${row.id}</kyn-td>
                  <kyn-td> ${row.firstName} </kyn-td>
                  <kyn-td>${row.lastName}</kyn-td>
                  <kyn-td>${row.birthday}</kyn-td>
                  <kyn-td .align=${'right'}>${row.age}</kyn-td>
                  <kyn-td>${row.firstName} ${row.lastName}</kyn-td>
                  <kyn-td .align=${'center'}>
                    ${row.gender === 'Male'
                      ? html`<span>${unsafeSVG(maleIcon)}</span>`
                      : html`<span>${unsafeSVG(femaleIcon)}</span>`}
                  </kyn-td>
                </kyn-tr>
              `
            )}
          </kyn-tbody>
        </kyn-table>
      </kyn-table-container>
    `;
  },
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
      <kyn-table-toolbar
        tableTitle=${'Nesting Table'}
        tableSubtitle=${'Table Subtitle'}
      >
      </kyn-table-toolbar>
      <kyn-table
        @on-row-selection-change=${(e: Event) =>
          action(e.type)({ ...e, detail: (e as CustomEvent).detail })}
        @on-all-rows-selection-change=${(e: Event) =>
          action(e.type)({ ...e, detail: (e as CustomEvent).detail })}
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
                  ${row.gender === 'Male'
                    ? html`<span>${unsafeSVG(maleIcon)}</span>`
                    : html`<span>${unsafeSVG(femaleIcon)}</span>`}
                </kyn-td>
              </kyn-tr>
              <kyn-expanded-tr .colSpan=${8}>
                <div class="story-table-container">
                  <kyn-table-toolbar
                    .tableTitle=${'Nested Table'}
                    tableSubtitle=${'Table Subtitle'}
                  >
                  </kyn-table-toolbar>
                  <kyn-table-container>
                    <kyn-table
                      checkboxSelection
                      @on-row-selection-change=${(e: Event) =>
                        action(e.type)({
                          ...e,
                          detail: (e as CustomEvent).detail,
                        })}
                      @on-all-rows-selection-change=${(e: Event) =>
                        action(e.type)({
                          ...e,
                          detail: (e as CustomEvent).detail,
                        })}
                    >
                      <kyn-thead>
                        <kyn-header-tr .multiSelectColumnWidth=${'64px'}>
                          <kyn-th .align=${'center'}> ID </kyn-th>
                          <kyn-th> First Name </kyn-th>
                          <kyn-th> Last Name </kyn-th>
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
                            <kyn-tr .rowId=${row.id} key="row-${row.id}">
                              <kyn-td .align=${'center'}>${row.id}</kyn-td>
                              <kyn-td> ${row.firstName} </kyn-td>
                              <kyn-td>${row.lastName}</kyn-td>
                              <kyn-td>${row.birthday}</kyn-td>
                              <kyn-td .align=${'right'}>${row.age}</kyn-td>
                              <kyn-td>${row.firstName} ${row.lastName}</kyn-td>
                              <kyn-td .align=${'center'}>
                                ${row.gender === 'Male'
                                  ? html`<span>${unsafeSVG(maleIcon)}</span>`
                                  : html`<span>${unsafeSVG(femaleIcon)}</span>`}
                              </kyn-td>
                            </kyn-tr>
                          `
                        )}
                      </kyn-tbody>
                    </kyn-table>
                  </kyn-table-container>
                </div>
              </kyn-expanded-tr>
            `
          )}
        </kyn-tbody>
      </kyn-table>`;
  },
};

export const ExpandableRows: Story = {
  args: {
    textStrings: {
      expanded: 'Expanded',
      collapsed: 'Collapsed',
    },
  },

  render: (args) => {
    const handleExpand = (e: CustomEvent, id: number) => {
      action(e.type)({ ...e, detail: { ...e.detail, rowId: id } });
    };
    return html` <style>
        .example {
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--kd-color-background-container-subtle);
          border: 1px dashed var(--kd-color-utility-variant-border);
          height: 140px;
          border-radius: 4px;
          svg {
            height: 52px;
            width: 52px;
          }
        }
      </style>

      <kyn-table-toolbar
        tableTitle=${'Expanded Rows'}
        tableSubtitle=${'Table Subtitle'}
      >
      </kyn-table-toolbar>
      <kyn-table>
        <kyn-thead>
          <kyn-header-tr expandable .expandableColumnWidth=${'64px'}>
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
            characters,
            (row: any) => row.id,
            (row: any) => html`
              <kyn-tr
                .rowId=${row.id}
                key="row-${row.id}"
                expandable
                .textStrings=${args.textStrings}
                @table-row-expando-toggled=${(e: CustomEvent) =>
                  handleExpand(e, row.id)}
              >
                <kyn-td .align=${'center'}>${row.id}</kyn-td>
                <kyn-td>${row.firstName}</kyn-td>
                <kyn-td>${row.lastName}</kyn-td>
                <kyn-td>${row.birthday}</kyn-td>
                <kyn-td .align=${'right'}>${row.age}</kyn-td>
                <kyn-td>${row.firstName} ${row.lastName}</kyn-td>
                <kyn-td .align=${'center'}>
                  ${row.gender === 'Male'
                    ? html`<span>${unsafeSVG(maleIcon)}</span>`
                    : html`<span>${unsafeSVG(femaleIcon)}</span>`}
                </kyn-td>
              </kyn-tr>
              <kyn-expanded-tr .colSpan=${7}>
                <div
                  class="example"
                  style="flex-direction: column;
          margin: 16px 8px;"
                >
                  <div
                    class="cube-icon"
                    style="color:var(--kd-color-icon-brand);"
                  >
                    ${unsafeSVG(lgCube)}
                  </div>
                  <div class="kd-type--ui-01 kd-type--weight-medium">
                    Expansion Slot ${row.id}
                  </div>
                  <p class="kd-type--ui-04 kd-type--weight-light">
                    Swap this with your own component.
                  </p>
                </div>
              </kyn-expanded-tr>
            `
          )}
        </kyn-tbody>
      </kyn-table>`;
  },
};

export const SortAndExpand: Story = {
  args: {
    sortable: true,
    rows: characters,
  },
  render: (args) => {
    const [{ rows }, updateArgs] = useArgs();
    let characters = rows;

    const handleSort = (e: Event) => {
      action(e.type)({ ...e, detail: (e as CustomEvent).detail });
      const detail = (e as CustomEvent).detail;
      const sortKey = detail.sortKey;
      const sortDirection = detail.sortDirection;
      const sorted = [...characters];

      // Sorting the data
      const direction = sortDirection === 'asc' ? 1 : -1;
      sorted.sort((a: any, b: any) => {
        const valueA = a[sortKey];
        const valueB = b[sortKey];

        // Handle numeric sorting
        if (typeof valueA === 'number' && typeof valueB === 'number') {
          return (valueA - valueB) * direction;
        }

        // Handle date sorting
        if (
          sortKey === 'birthday' &&
          typeof valueA === 'string' &&
          typeof valueB === 'string'
        ) {
          const dateA = new Date(valueA);
          const dateB = new Date(valueB);
          return (dateA.getTime() - dateB.getTime()) * direction;
        }

        // Handle string sorting (firstName, lastName)
        if (typeof valueA === 'string' && typeof valueB === 'string') {
          return valueA.localeCompare(valueB) * direction;
        }

        return 0;
      });

      characters = sorted;
      updateArgs({ rows: sorted });
    };

    const handleExpand = (e: CustomEvent, id: number) => {
      action(e.type)({ ...e, detail: { ...e.detail, rowId: id } });
    };
    return html`
      <style>
        .example {
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--kd-color-background-container-subtle);
          border: 1px dashed var(--kd-color-utility-variant-border);
          height: 140px;
          border-radius: 4px;
          svg {
            height: 52px;
            width: 52px;
          }
        }
      </style>
      <kyn-table-toolbar
        tableTitle=${'Sort and Expand'}
        tableSubtitle=${'Table Subtitle'}
      >
      </kyn-table-toolbar>
      <kyn-table>
        <kyn-thead>
          <kyn-header-tr expandable .expandableColumnWidth=${'64px'}>
            <kyn-th
              .align=${'center'}
              .sortable=${args.sortable}
              sortKey="id"
              @on-sort-changed=${handleSort}
              >ID</kyn-th
            >
            <kyn-th
              .sortable=${args.sortable}
              sortKey="firstName"
              @on-sort-changed=${handleSort}
              >First Name</kyn-th
            >
            <kyn-th
              .sortable=${args.sortable}
              sortKey="lastName"
              @on-sort-changed=${handleSort}
              >Last Name</kyn-th
            >
            <kyn-th
              .sortable=${args.sortable}
              sortKey="birthday"
              @on-sort-changed=${handleSort}
              >Birthday</kyn-th
            >
            <kyn-th
              .align=${'right'}
              .sortable=${args.sortable}
              sortKey="age"
              @on-sort-changed=${handleSort}
              >Age</kyn-th
            >
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
                @table-row-expando-toggled=${(e: CustomEvent) =>
                  handleExpand(e, row.id)}
              >
                <kyn-td .align=${'center'}>${row.id}</kyn-td>
                <kyn-td>${row.firstName}</kyn-td>
                <kyn-td>${row.lastName}</kyn-td>
                <kyn-td>${row.birthday}</kyn-td>
                <kyn-td .align=${'right'}>${row.age}</kyn-td>
                <kyn-td>${row.firstName} ${row.lastName}</kyn-td>
                <kyn-td .align=${'center'}>
                  ${row.gender === 'Male'
                    ? html`<span>${unsafeSVG(maleIcon)}</span>`
                    : html`<span>${unsafeSVG(femaleIcon)}</span>`}
                </kyn-td>
              </kyn-tr>
              <kyn-expanded-tr .colSpan=${7}>
                <div
                  class="example"
                  style="flex-direction: column;
          margin: 16px 8px;"
                >
                  <div
                    class="cube-icon"
                    style="color:var(--kd-color-icon-brand);"
                  >
                    ${unsafeSVG(lgCube)}
                  </div>
                  <div class="kd-type--ui-01 kd-type--weight-medium">
                    Expansion Slot ${row.id}
                  </div>
                  <p class="kd-type--ui-04 kd-type--weight-light">
                    Swap this with your own component.
                  </p>
                </div>
              </kyn-expanded-tr>
            `
          )}
        </kyn-tbody>
      </kyn-table>
    `;
  },
};

export const BatchActions: Story = {
  args: {
    showTableActions: true,
    checkboxSelection: true,
    rows: characters,
  },
  render: (args) => {
    const [{ rows }, updateArgs] = useArgs();
    let characters = rows;

    const handleDeleteRow = (id: number) => {
      const filtered = characters.filter((row: any) => row.id !== id);
      characters = filtered;
      updateArgs({ rows: filtered });
      action('delete-row')({ id });
    };
    return html`
      <kyn-table-toolbar
        .tableTitle=${'Batch Actions'}
        tableSubtitle=${'Table Subtitle'}
      >
        <kyn-overflow-menu anchorRight fixed assistiveText="Actions">
          <kyn-overflow-menu-item @on-click=${(e: Event) => action(e.type)(e)}>
            Action 1
          </kyn-overflow-menu-item>
          <kyn-overflow-menu-item
            href="javascript:void(0);"
            @on-click=${(e: Event) => action(e.type)(e)}
          >
            Action 2
          </kyn-overflow-menu-item>
          <kyn-overflow-menu-item
            disabled
            @on-click=${(e: Event) => action(e.type)(e)}
          >
            Action 3
          </kyn-overflow-menu-item>
          <kyn-overflow-menu-item
            destructive
            @on-click=${(e: Event) => action(e.type)(e)}
          >
            Delete
          </kyn-overflow-menu-item>
        </kyn-overflow-menu>
      </kyn-table-toolbar>

      <kyn-table-container>
        <kyn-table ?checkboxSelection=${args.checkboxSelection}>
          <kyn-thead>
            <kyn-header-tr>
              <kyn-th .align=${'center'}> ID </kyn-th>
              <kyn-th> First Name </kyn-th>
              <kyn-th> Last Name </kyn-th>
              <kyn-th>Birthday</kyn-th>
              <kyn-th .align=${'right'}>Age</kyn-th>
              <kyn-th>Full Name</kyn-th>
              <kyn-th .align=${'center'}>Gender</kyn-th>
              <kyn-th>Action</kyn-th>
            </kyn-header-tr>
          </kyn-thead>
          <kyn-tbody>
            ${repeat(
              characters,
              (row: any) => row.id,
              (row: any) => html`
                <kyn-tr .rowId=${row.id} key="row-${row.id}">
                  <kyn-td .align=${'center'}>${row.id}</kyn-td>
                  <kyn-td> ${row.firstName} </kyn-td>
                  <kyn-td>${row.lastName}</kyn-td>
                  <kyn-td>${row.birthday}</kyn-td>
                  <kyn-td .align=${'right'}>${row.age}</kyn-td>
                  <kyn-td>${row.firstName} ${row.lastName}</kyn-td>
                  <kyn-td .align=${'center'}>
                    ${row.gender === 'Male'
                      ? html`<span>${unsafeSVG(maleIcon)}</span>`
                      : html`<span>${unsafeSVG(femaleIcon)}</span>`}
                  </kyn-td>
                  <kyn-td .align=${'center'}>
                    <kyn-overflow-menu
                      anchorRight
                      fixed
                      assistiveText="Actions"
                    >
                      <kyn-overflow-menu-item
                        @on-click=${(e: Event) => action(e.type)(e)}
                      >
                        Action 1
                      </kyn-overflow-menu-item>
                      <kyn-overflow-menu-item
                        href="javascript:void(0);"
                        @on-click=${(e: Event) => action(e.type)(e)}
                      >
                        Action 2
                      </kyn-overflow-menu-item>
                      <kyn-overflow-menu-item
                        disabled
                        @on-click=${(e: Event) => action(e.type)(e)}
                      >
                        Action 3
                      </kyn-overflow-menu-item>
                      <kyn-overflow-menu-item
                        destructive
                        @on-click=${() => handleDeleteRow(row.id)}
                      >
                        Delete
                      </kyn-overflow-menu-item>
                    </kyn-overflow-menu>
                  </kyn-td>
                </kyn-tr>
              `
            )}
          </kyn-tbody>
        </kyn-table>
      </kyn-table-container>
    `;
  },
};

const extractData = (dataTable: any, pageNumber: number, pageSize: number) => {
  const start = (pageNumber - 1) * pageSize;
  const end = start + pageSize;
  return dataTable.slice(start, end);
};

export const Pagination: Story = {
  args: {
    pageSize: 5,
    pageNumber: 1,
    pageSizeOptions: [5, 10, 20, 30, 40, 50, 100],
    dense: false,
    hideItemsRange: false,
    hidePageSizeDropdown: false,
    hideNavigationButtons: false,
    checkboxSelection: true,
  },
  render: (args) => {
    const [
      { pageSize = args.pageSize, pageNumber = args.pageNumber },
      updateArgs,
    ] = useArgs();

    const handlePageSizeChange = (e: Event) => {
      action(e.type)({ ...e, detail: (e as CustomEvent).detail });
      const newPageSize = (e as CustomEvent).detail.value;
      updateArgs({ pageSize: newPageSize, pageNumber: 1 });
    };

    const handlePageNumberChange = (e: Event) => {
      action(e.type)({ ...e, detail: (e as CustomEvent).detail });
      const newPageNumber = (e as CustomEvent).detail.value;
      updateArgs({ pageNumber: newPageNumber });
    };

    const paginatedData = extractData(allData, pageNumber, pageSize);

    return html`
      <kyn-table-toolbar
        .tableTitle=${'Pagination'}
        tableSubtitle=${'Table Subtitle'}
      >
      </kyn-table-toolbar>

      <kyn-table-container>
        <kyn-table
          ?dense=${args.dense}
          ?checkboxSelection=${args.checkboxSelection}
          enableBulkSelectionMenu
        >
          <kyn-thead>
            <kyn-header-tr>
              <kyn-th .align=${'center'}> ID </kyn-th>
              <kyn-th> First Name </kyn-th>
              <kyn-th>Last Name</kyn-th>
              <kyn-th>Birthday</kyn-th>
              <kyn-th .align=${'right'}>Age</kyn-th>
              <kyn-th>Full Name</kyn-th>
              <kyn-th .align=${'center'}>Gender</kyn-th>
            </kyn-header-tr>
          </kyn-thead>
          <kyn-tbody>
            ${repeat(
              paginatedData,
              (row: any) => row.id,
              (row: any) => html`
                <kyn-tr .rowId=${row.id} key="row-${row.id}">
                  <kyn-td .align=${'center'}>${row.id}</kyn-td>
                  <kyn-td title=${row.firstName}> ${row.firstName} </kyn-td>
                  <kyn-td class="min-max-width-100">${row.lastName}</kyn-td>
                  <kyn-td>${row.birthday}</kyn-td>
                  <kyn-td .align=${'right'}>${row.age}</kyn-td>
                  <kyn-td>${row.firstName} ${row.lastName}</kyn-td>
                  <kyn-td .align=${'center'}>
                    ${row.gender === 'Male'
                      ? html`<span>${unsafeSVG(maleIcon)}</span>`
                      : html`<span>${unsafeSVG(femaleIcon)}</span>`}
                  </kyn-td>
                </kyn-tr>
              `
            )}
          </kyn-tbody>
        </kyn-table>
      </kyn-table-container>
      <kyn-table-footer>
        <kyn-pagination
          .count=${allData.length}
          .pageSize=${pageSize}
          .pageNumber=${pageNumber}
          .pageSizeOptions=${args.pageSizeOptions}
          .hideItemsRange=${args.hideItemsRange}
          .hidePageSizeDropdown=${args.hidePageSizeDropdown}
          .hideNavigationButtons=${args.hideNavigationButtons}
          @on-page-size-change=${handlePageSizeChange}
          @on-page-number-change=${handlePageNumberChange}
        ></kyn-pagination>
      </kyn-table-footer>
    `;
  },
};

export const Legend: Story = {
  render: () => {
    return html`
      <kyn-table-toolbar
        .tableTitle=${'Legend'}
        tableSubtitle=${'Table Subtitle'}
      >
      </kyn-table-toolbar>

      <kyn-table-container>
        <kyn-table>
          <kyn-thead>
            <kyn-header-tr>
              <kyn-th .align=${'center'}> ID </kyn-th>
              <kyn-th> First Name </kyn-th>
              <kyn-th> Last Name </kyn-th>
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
                <kyn-tr .rowId=${row.id} key="row-${row.id}">
                  <kyn-td .align=${'center'}>${row.id}</kyn-td>
                  <kyn-td> ${row.firstName} </kyn-td>
                  <kyn-td>${row.lastName}</kyn-td>
                  <kyn-td>${row.birthday}</kyn-td>
                  <kyn-td .align=${'right'}>${row.age}</kyn-td>
                  <kyn-td>${row.firstName} ${row.lastName}</kyn-td>
                  <kyn-td .align=${'center'}>
                    ${row.gender === 'Male'
                      ? html`<span>${unsafeSVG(maleIcon)}</span>`
                      : html`<span>${unsafeSVG(femaleIcon)}</span>`}
                  </kyn-td>
                </kyn-tr>
              `
            )}
          </kyn-tbody>
        </kyn-table>
      </kyn-table-container>
      <kyn-table-footer>
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
      </kyn-table-footer>
    `;
  },
};

export const StickyHeader: Story = {
  args: {
    stickyHeader: true,
  },
  render: (args) => {
    return html`
      <kyn-table-toolbar
        .tableTitle=${'Sticky Header'}
        tableSubtitle=${'Table Subtitle'}
      >
      </kyn-table-toolbar>

      <kyn-table-container style=${args.stickyHeader ? 'height: 400px' : ''}>
        <kyn-table ?stickyHeader=${args.stickyHeader}>
          <kyn-thead>
            <kyn-header-tr>
              <kyn-th .align=${'center'}> ID </kyn-th>
              <kyn-th> First Name </kyn-th>
              <kyn-th> Last Name </kyn-th>
              <kyn-th>Birthday</kyn-th>
              <kyn-th .align=${'right'}>Age</kyn-th>
              <kyn-th>Full Name</kyn-th>
              <kyn-th .align=${'center'}>Gender</kyn-th>
            </kyn-header-tr>
          </kyn-thead>
          <kyn-tbody>
            ${repeat(
              allData,
              (row: any) => row.id,
              (row: any) => html`
                <kyn-tr .rowId=${row.id} key="row-${row.id}">
                  <kyn-td .align=${'center'}>${row.id}</kyn-td>
                  <kyn-td> ${row.firstName} </kyn-td>
                  <kyn-td>${row.lastName}</kyn-td>
                  <kyn-td>${row.birthday}</kyn-td>
                  <kyn-td .align=${'right'}>${row.age}</kyn-td>
                  <kyn-td>${row.firstName} ${row.lastName}</kyn-td>
                  <kyn-td .align=${'center'}>
                    ${row.gender === 'Male'
                      ? html`<span>${unsafeSVG(maleIcon)}</span>`
                      : html`<span>${unsafeSVG(femaleIcon)}</span>`}
                  </kyn-td>
                </kyn-tr>
              `
            )}
          </kyn-tbody>
        </kyn-table>
      </kyn-table-container>
    `;
  },
};

export const StripedRows: Story = {
  args: {
    striped: true,
  },
  render: (args) => {
    return html`
      <kyn-table-toolbar
        .tableTitle=${'Striped Rows'}
        tableSubtitle=${'Table Subtitle'}
      >
      </kyn-table-toolbar>

      <kyn-table-container>
        <kyn-table ?striped=${args.striped}>
          <kyn-thead>
            <kyn-header-tr>
              <kyn-th .align=${'center'}> ID </kyn-th>
              <kyn-th> First Name </kyn-th>
              <kyn-th> Last Name </kyn-th>
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
                <kyn-tr .rowId=${row.id} key="row-${row.id}">
                  <kyn-td .align=${'center'}>${row.id}</kyn-td>
                  <kyn-td> ${row.firstName} </kyn-td>
                  <kyn-td>${row.lastName}</kyn-td>
                  <kyn-td>${row.birthday}</kyn-td>
                  <kyn-td .align=${'right'}>${row.age}</kyn-td>
                  <kyn-td>${row.firstName} ${row.lastName}</kyn-td>
                  <kyn-td .align=${'center'}>
                    ${row.gender === 'Male'
                      ? html`<span>${unsafeSVG(maleIcon)}</span>`
                      : html`<span>${unsafeSVG(femaleIcon)}</span>`}
                  </kyn-td>
                </kyn-tr>
              `
            )}
          </kyn-tbody>
        </kyn-table>
      </kyn-table-container>
    `;
  },
};

export const Dense: Story = {
  args: {
    dense: true,
  },
  render: (args) => {
    return html`
      <style>
        .min-max-width-100 {
          --kyn-td-min-width: 100px;
          --kyn-td-max-width: 100px;
          --kyn-td-width: 100px;
        }
      </style>
      <kyn-table-toolbar
        .tableTitle=${'Dense'}
        tableSubtitle=${'Table Subtitle'}
      >
      </kyn-table-toolbar>

      <kyn-table-container>
        <kyn-table ?dense=${args.dense}>
          <kyn-thead>
            <kyn-header-tr>
              <kyn-th .align=${'center'}> ID </kyn-th>
              <kyn-th> First Name </kyn-th>
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
                <kyn-tr .rowId=${row.id} key="row-${row.id}">
                  <kyn-td .align=${'center'}>${row.id}</kyn-td>
                  <kyn-td title=${row.firstName}> ${row.firstName} </kyn-td>
                  <kyn-td class="min-max-width-100">${row.lastName}</kyn-td>
                  <kyn-td>${row.birthday}</kyn-td>
                  <kyn-td .align=${'right'}>${row.age}</kyn-td>
                  <kyn-td>${row.firstName} ${row.lastName}</kyn-td>
                  <kyn-td .align=${'center'}>
                    ${row.gender === 'Male'
                      ? html`<span>${unsafeSVG(maleIcon)}</span>`
                      : html`<span>${unsafeSVG(femaleIcon)}</span>`}
                  </kyn-td>
                </kyn-tr>
              `
            )}
          </kyn-tbody>
        </kyn-table>
      </kyn-table-container>
    `;
  },
};

export const FixedLayout: Story = {
  args: {
    fixedLayout: true,
  },
  render: (args) => {
    return html`
      <style>
        .min-max-width-100 {
          --kyn-td-min-width: 100px;
          --kyn-td-max-width: 100px;
          --kyn-td-width: 100px;
        }
      </style>
      <kyn-table-toolbar
        tableTitle=${'Fixed Layout'}
        tableSubtitle=${'Table Subtitle'}
      >
      </kyn-table-toolbar>

      <kyn-table-container>
        <kyn-table ?fixedLayout=${args.fixedLayout}>
          <kyn-thead>
            <kyn-header-tr>
              <kyn-th .align=${'center'}> ID </kyn-th>
              <kyn-th> First Name </kyn-th>
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
                <kyn-tr .rowId=${row.id} key="row-${row.id}">
                  <kyn-td .align=${'center'}>${row.id}</kyn-td>
                  <kyn-td title=${row.firstName}> ${row.firstName} </kyn-td>
                  <kyn-td class="min-max-width-100">${row.lastName}</kyn-td>
                  <kyn-td>${row.birthday}</kyn-td>
                  <kyn-td .align=${'right'}>${row.age}</kyn-td>
                  <kyn-td>${row.firstName} ${row.lastName}</kyn-td>
                  <kyn-td .align=${'center'}>
                    ${row.gender === 'Male'
                      ? html`<span>${unsafeSVG(maleIcon)}</span>`
                      : html`<span>${unsafeSVG(femaleIcon)}</span>`}
                  </kyn-td>
                </kyn-tr>
              `
            )}
          </kyn-tbody>
        </kyn-table>
      </kyn-table-container>
    `;
  },
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
                  <kyn-overflow-menu
                    ?disabled=${row.id == 1 || row.id == 3 ? true : false}
                    anchorRight
                    fixed
                    assistiveText="Actions"
                    @on-toggle=${(e: Event) => action(e.type)(e)}
                  >
                    <kyn-overflow-menu-item
                      @on-click=${(e: Event) => action(e.type)(e)}
                    >
                      Action 1
                    </kyn-overflow-menu-item>
                    <kyn-overflow-menu-item
                      href="javascript:void(0);"
                      @on-click=${(e: Event) => action(e.type)(e)}
                    >
                      Action 2
                    </kyn-overflow-menu-item>
                    <kyn-overflow-menu-item
                      disabled
                      @on-click=${(e: Event) => action(e.type)(e)}
                    >
                      Action 3
                    </kyn-overflow-menu-item>
                    <kyn-overflow-menu-item
                      destructive
                      @on-click=${(e: Event) => action(e.type)(e)}
                    >
                      Delete
                    </kyn-overflow-menu-item>
                  </kyn-overflow-menu>
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

      <br /><br />
      <a
        href="https://github.com/kyndryl-design-system/shidoka-applications/tree/main/src/components/reusable/table/story-helpers/table.settings.sample.ts"
        target="_blank"
        rel="noopener"
      >
        See the full example component code here.
      </a>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
        // For guidance on how to construct this code, please refer to the 'table-story.ts' file.
        // You can find it at the following path:
        // https://github.com/kyndryl-design-system/shidoka-applications/tree/main/src/components/reusable/table/story-helpers/table.settings.sample.ts
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
    showGlobalFilter: true,
  },
  render: (args: any) => {
    return html`<kyn-table-skeleton
      .rows=${args.rows}
      ?showPagination=${args.showPagination}
      ?dense=${args.dense}
      ?striped=${args.striped}
      ?fixedLayout=${args.fixedLayout}
      ?hideTableTitles=${args.hideTableTitles}
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
              <kyn-th .align=${'center'}>ID</kyn-th>
              <kyn-th>First Name</kyn-th>
              <kyn-th>Last Name</kyn-th>
              <kyn-th>Birthday</kyn-th>
              <kyn-th .align=${'right'}>Age</kyn-th>
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
            ${rows.length > 0
              ? repeat(
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
                )
              : null}
          </kyn-tbody>
        </kyn-table>
      </kyn-table-container>
      ${rows.length === 0
        ? html` <div class="no-data">No records to display.</div> `
        : null}
      <style>
        .no-data {
          margin-top: 24px;
          color: var(--kd-color-text-level-secondary);
          pointer-events: none;
        }
        kyn-th {
          overflow: visible;
          kyn-text-input {
            display: block;
          }
          kyn-dropdown {
            display: block;
            min-width: 150px;
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

export const ColumnResize: Story = {
  tags: ['new', 'version:v2.81.0'],
  render: () => {
    return html`
      <h4>Important Information about Column Resize</h4>
      <ul>
        <li>
          Columns can be resized by clicking and dragging the right edges of the
          column header. To enable this feature, set resizable to true. To
          disable resizing for specific columns, set columns(kyn-th) ->
          resizable to false.
        </li>
        <li>
          <b>Note:</b> When <i>minWidth/maxWidth</i> and
          <i>resizeMinWidth/resizeMaxWidth</i>
          both are provided, then minWidth/maxWidth takes precedence(supports
          'px'. e.g.'150px').
        </li>
      </ul>
      <kyn-table-toolbar
        .tableTitle=${'Column Resize'}
        .tableSubtitle=${'Table Subtitle'}
      >
      </kyn-table-toolbar>
      <kyn-table-container>
        <kyn-table>
          <kyn-thead>
            <kyn-header-tr>
              <kyn-th
                resizable
                maxWidth="250px"
                width="100px"
                .align=${'center'}
                @on-column-resize=${(e: any) =>
                  action(e.type)({ ...e, detail: e.detail })}
                >ID</kyn-th
              >
              <kyn-th
                resizable
                minWidth="150px"
                @on-column-resize=${(e: any) =>
                  action(e.type)({ ...e, detail: e.detail })}
                >First Name</kyn-th
              >
              <kyn-th
                resizable
                minWidth="150px"
                @on-column-resize=${(e: any) =>
                  action(e.type)({ ...e, detail: e.detail })}
                >Last Name</kyn-th
              >
              <kyn-th
                resizable
                resizeMinWidth="150px"
                resizeMaxWidth="300px"
                @on-column-resize=${(e: any) =>
                  action(e.type)({ ...e, detail: e.detail })}
                >Birthday</kyn-th
              >
              <kyn-th
                resizable
                width="150px"
                .align=${'right'}
                @on-column-resize=${(e: any) =>
                  action(e.type)({ ...e, detail: e.detail })}
                >Age</kyn-th
              >
              <kyn-th
                resizable
                minWidth="180px"
                width="200px"
                .align=${'right'}
                @on-column-resize=${(e: any) =>
                  action(e.type)({ ...e, detail: e.detail })}
                >Account Deposits($)</kyn-th
              >
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
        </kyn-table>
      </kyn-table-container>
      <br />
    `;
  },
};

export const StackedHeader: Story = {
  args: {
    rows: characters,
  },
  tags: ['new', 'version:v2.85.0'],
  render: (args) => {
    const [{ rows }, updateArgs] = useArgs();
    let tableData = rows;

    const handleSortByIdNumber = (e: Event) => {
      action(e.type)({ ...e, detail: (e as CustomEvent).detail });
      const detail = (e as CustomEvent).detail;
      const sortKey = detail.sortKey;
      const sortDirection = detail.sortDirection;
      const sorted = [...characters];

      // Sorting the data
      const direction = sortDirection === 'asc' ? 1 : -1;
      sorted.sort((a: any, b: any) => {
        return (a[sortKey] - b[sortKey]) * direction;
      });

      tableData = sorted;
      updateArgs({ rows: sorted });
    };

    return html`
      <style>
        .example {
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--kd-color-background-container-subtle);
          border: 1px dashed var(--kd-color-utility-variant-border);
          height: 140px;
          border-radius: 4px;

          svg {
            height: 52px;
            width: 52px;
          }
        }
      </style>
      <kyn-table-toolbar
        .tableTitle=${'Stacked Header'}
        .tableSubtitle=${'Multiple header rows with column grouping'}
      >
      </kyn-table-toolbar>
      <kyn-table-container>
        <kyn-table>
          <kyn-thead>
            <kyn-header-tr>
              <kyn-th-group label="Personal Info">
                <kyn-th .align=${'center'}>ID</kyn-th>
                <kyn-th>First Name</kyn-th>
                <kyn-th>Last Name</kyn-th>
              </kyn-th-group>
              <kyn-th-group label="Other Info">
                <kyn-th>Birthday</kyn-th>
                <kyn-th .align=${'right'}>Age</kyn-th>
              </kyn-th-group>
              <kyn-th-group label="Financial Info">
                <kyn-th .align=${'right'}>Account Deposits($)</kyn-th>
              </kyn-th-group>
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
        </kyn-table>
      </kyn-table-container>

      <br />
      <br />

      <kyn-table-toolbar
        .tableTitle=${'Stacked Header with Checkbox and Expandable Rows'}
        .tableSubtitle=${'Multiple header rows with column grouping'}
      >
      </kyn-table-toolbar>
      <kyn-table-container>
        <kyn-table>
          <kyn-thead>
            <kyn-header-tr expandable checkboxSelection>
              <kyn-th-group label="Personal Info">
                <kyn-th
                  .align=${'center'}
                  sortable
                  sortKey="id"
                  @on-sort-changed=${handleSortByIdNumber}
                  >ID</kyn-th
                >
                <kyn-th>First Name</kyn-th>
                <kyn-th>Last Name</kyn-th>
              </kyn-th-group>
              <kyn-th-group label="Other Info">
                <kyn-th>Birthday</kyn-th>
                <kyn-th .align=${'right'}>Age</kyn-th>
              </kyn-th-group>
              <kyn-th-group label="Financial Info">
                <kyn-th .align=${'right'}>Account Deposits($)</kyn-th>
              </kyn-th-group>
            </kyn-header-tr>
          </kyn-thead>
          <kyn-tbody>
            ${repeat(
              tableData,
              (row: any) => row.id,
              (row: any) => html`
                <kyn-tr .rowId=${row.id} checkboxSelection expandable>
                  <kyn-td .align=${'center'}>${row.id}</kyn-td>
                  <kyn-td>${row.firstName}</kyn-td>
                  <kyn-td>${row.lastName}</kyn-td>
                  <kyn-td>${row.birthday}</kyn-td>
                  <kyn-td .align=${'right'}>${row.age}</kyn-td>
                  <kyn-td .align=${'right'}>${row.deposits}</kyn-td>
                </kyn-tr>
                <kyn-expanded-tr .colSpan=${8}>
                  <div
                    class="example"
                    style="flex-direction: column;
          margin: 16px 8px;"
                  >
                    <div
                      class="cube-icon"
                      style="color:var(--kd-color-icon-brand);"
                    >
                      ${unsafeSVG(lgCube)}
                    </div>
                    <div class="kd-type--ui-01 kd-type--weight-medium">
                      Expansion Slot
                    </div>
                    <p class="kd-type--ui-04 kd-type--weight-light">
                      Swap this with your own component.
                    </p>
                  </div>
                </kyn-expanded-tr>
              `
            )}
          </kyn-tbody>
        </kyn-table>
      </kyn-table-container>
    `;
  },
};
