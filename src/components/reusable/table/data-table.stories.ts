/**
 * Copyright Kyndryl, Inc. 2023
 */

// Import external libraries
import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';
import { useArgs } from '@storybook/preview-api';

// Kyndryl Design System Components and Icons
import '@kyndryl-design-system/shidoka-foundation/components/button';
import '@kyndryl-design-system/shidoka-foundation/components/icon';
import maleIcon from '@carbon/icons/es/gender--male/16';
import femaleIcon from '@carbon/icons/es/gender--female/16';
import './index';
import './data-table';
import './story-helpers/action-menu';
import './story-helpers/batch-actions';
import { SORT_DIRECTION } from './defs';

const meta: Meta = {
  title: 'Components/Data Table',
  component: 'kyn-data-table',
  argTypes: {
    checkboxSelection: { control: 'boolean', table: { position: 1 } },
    fixedLayout: { control: 'boolean' },
    dense: { control: 'boolean', table: { position: 2 } },
    stickyHeader: { control: 'boolean', table: { position: 3 } },
    striped: { control: 'boolean', table: { position: 4 } },
    count: { control: 'number' },
    pageSize: { control: 'select', options: [5, 10, 20, 30, 40, 50, 100] },
    pageNumber: { control: 'number' },
    pageSizeOptions: { control: 'array' },
    hideItemsRange: { control: 'boolean' },
    hidePageSizeDropdown: { control: 'boolean' },
    hideNavigationButtons: { control: 'boolean' },
  },
  subcomponents: {
    'kyn-table': 'kyn-table',
    'kyn-th': 'kyn-th',
    'kyn-tr': 'kyn-tr',
    'kyn-td': 'kyn-td',
    'kyn-thead': 'kyn-thead',
    'kyn-tbody': 'kyn-tbody',
    'kyn-table-container': 'kyn-table-container',
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/6AovH7Iay9Y7BkpoL5975s/Applications-with-Specs?node-id=828%3A4607&mode=dev',
    },
  },
};

export default meta;

// Type definition for the story
type Story = StoryObj & {
  args?: {
    count?: number;
    pageSize?: number;
    pageNumber?: number;
    pageSizeOptions?: number[];
  };
};

const getRandomName = () => {
  const fNames = [
    { name: 'Jon', gender: 'male' },
    { name: 'Cersei', gender: 'female' },
    { name: 'Arya', gender: 'female' },
    { name: 'Tywin', gender: 'male' },
    { name: 'Tyrion', gender: 'male' },
    { name: 'Jaime', gender: 'male' },
    { name: 'Daenerys', gender: 'female' },
    { name: 'Sansa', gender: 'female' },
    { name: 'Ned', gender: 'male' },
    { name: 'Brandon', gender: 'male' },
    { name: 'Catelyn', gender: 'female' },
    { name: 'Joffrey', gender: 'male' },
    { name: 'Robert', gender: 'male' },
    { name: 'Theon', gender: 'male' },
    { name: 'Jorah', gender: 'male' },
    { name: 'Petyr', gender: 'male' },
    { name: 'Viserys', gender: 'male' },
    { name: 'Robb', gender: 'male' },
    { name: 'Bran', gender: 'male' },
    { name: 'Samwell', gender: 'male' },
    { name: 'Sandor', gender: 'male' },
    { name: 'Bronn', gender: 'male' },
    { name: 'Varys', gender: 'male' },
    { name: 'Shae', gender: 'female' },
    { name: 'Talisa', gender: 'female' },
  ];

  const lNames = [
    'Snow',
    'Lannister',
    'Stark',
    'Targaryen',
    'Baratheon',
    'Greyjoy',
    'Martell',
    'Tully',
    'Arryn',
    'Tyrell',
    'Frey',
    'Bolton',
    'Mormont',
    'Clegane',
    'Tarly',
    'Meryn',
    'Trant',
    'Drogo',
    '',
  ];

  const fNRandomIndex = Math.floor(Math.random() * fNames.length);
  const lNRandomIndex = Math.floor(Math.random() * lNames.length);
  return [
    fNames[fNRandomIndex].name,
    lNames[lNRandomIndex],
    fNames[fNRandomIndex].gender,
  ];
};

const getRandomBirthDate = () => {
  // Define the start and end dates for the range
  const startDate = new Date('1940-01-01');
  const endDate = new Date();

  // Calculate the time difference in milliseconds
  const timeDiff = endDate.getTime() - startDate.getTime();

  // Generate a random number between 0 and the time difference
  const randomTime = Math.random() * timeDiff;

  // Add the random time to the start date to get the random birthdate
  const randomBirthDate = new Date(startDate.getTime() + randomTime);

  return randomBirthDate.toLocaleDateString();
};

const ageGenerator = (birthday: string) => {
  // Convert the birthday string to a Date object
  const birthdayDate = new Date(birthday);

  // Get the current date
  const currentDate = new Date();

  // Calculate the age
  let age = currentDate.getFullYear() - birthdayDate.getFullYear();

  // Check if the birthday for this year has already occurred
  // If not, subtract 1 from the age
  if (
    currentDate.getMonth() < birthdayDate.getMonth() ||
    (currentDate.getMonth() === birthdayDate.getMonth() &&
      currentDate.getDate() < birthdayDate.getDate())
  ) {
    age--;
  }
  return age || 1;
};

/**
 * Generates an array of mock data
 * @type {Array<object>}
 */
const allData = Array(100)
  .fill(0)
  .map((_, index) => {
    const birthday = getRandomBirthDate();
    const age = ageGenerator(birthday);
    const nameAndGender = getRandomName();

    return {
      id: index + 1,
      firstName: nameAndGender[0],
      lastName: nameAndGender[1],
      age,
      birthday,
      gender: nameAndGender[2],
    };
  });

interface Person {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  birthday: string;
}

const sortByFName = (sortDirection: SORT_DIRECTION) => {
  return (a: Person, b: Person) => {
    return sortDirection === 'asc'
      ? a.firstName.localeCompare(b.firstName)
      : b.firstName.localeCompare(a.firstName);
  };
};

const sortByLName = (sortDirection: SORT_DIRECTION) => {
  return (a: Person, b: Person) => {
    return sortDirection === 'asc'
      ? a.lastName.localeCompare(b.lastName)
      : b.lastName.localeCompare(a.lastName);
  };
};

const sortById = (sortDirection: SORT_DIRECTION) => {
  return (a: Person, b: Person) => {
    return sortDirection === 'asc' ? a.id - b.id : b.id - a.id;
  };
};

const sortByAge = (sortDirection: SORT_DIRECTION) => {
  return (a: Person, b: Person) => {
    return sortDirection === 'asc' ? a.age - b.age : b.age - a.age;
  };
};

const sortByDate = (sortDirection: SORT_DIRECTION) => {
  return (a: Person, b: Person) => {
    const dateA = new Date(a.birthday);
    const dateB = new Date(b.birthday);

    if (sortDirection === 'asc') {
      return dateA.getTime() - dateB.getTime();
    } else if (sortDirection === 'desc') {
      return dateB.getTime() - dateA.getTime();
    } else {
      throw new Error('Invalid sort direction. Use "asc" or "desc".');
    }
  };
};

const extractData = (dataTable: any, pageNumber: number, pageSize: number) => {
  const start = (pageNumber - 1) * pageSize;
  const end = start + pageSize;
  return dataTable.slice(start, end);
};

//  let selectedRows = [];

/**
 * Renders the table based on the given arguments
 * @param {object} args - Arguments for the table
 * @param {Function} updateArgs - Function to update the story's arguments
 * @param {string} title - Title of the table
 * @param {boolean} [showTableActions=false] - Shows the example batch actions
 * @returns {import("lit").TemplateResult} Rendered table
 */
const tableRenderer = (
  args: any,
  updateArgs: any,
  title: string,
  showTableActions: Boolean
) => {
  const { rows, count, selectedRows } = args;
  // let tableData = args.data || allData;

  const handlePageChange = (e: CustomEvent) => {
    updateArgs({ pageSize: +e.detail.pageSize });
    updateArgs({ pageNumber: +e.detail.pageNumber });
  };

  const handleSortByIdNumber = (e: CustomEvent) => {
    const { sortDirection } = e.detail;
    rows.sort(sortById(sortDirection));
    updateArgs({ sorting: true });
  };

  const handleSortByAge = (e: CustomEvent) => {
    const { sortDirection } = e.detail;
    rows.sort(sortByAge(sortDirection));
    updateArgs({ sorting: true });
  };

  const handleSortByFName = (e: CustomEvent) => {
    const { sortDirection } = e.detail;
    rows.sort(sortByFName(sortDirection));
    updateArgs({ sorting: true });
  };
  const handleSortByLName = (e: CustomEvent) => {
    const { sortDirection } = e.detail;
    rows.sort(sortByLName(sortDirection));
    updateArgs({ sorting: true });
  };

  const handleSortByDate = (e: CustomEvent) => {
    const { sortDirection } = e.detail;
    rows.sort(sortByDate(sortDirection));
    updateArgs({ sorting: true });
  };

  const deleteAction = (id: number) => {
    const filteredRows = rows.filter((data: any) => data.id !== id);
    const filterSelectredRows = selectedRows.filter((data: any) => data !== id);
    const newCount = count ? filteredRows.length : 0;
    updateArgs({
      count: newCount,
      rows: filteredRows,
      selectedRows: filterSelectredRows,
    });
  };

  const handleSelectedRowsChange = (e: CustomEvent) => {
    updateArgs({ selectedRows: e.detail.selectedRows });
  };

  const deleteSelectedRows = () => {
    const filteredRows = rows.filter(
      (row: any) => !selectedRows.includes(row.id)
    );
    const newCount = count ? filteredRows.length : 0;
    updateArgs({
      count: newCount,
      rows: filteredRows,
      selectedRows: [],
    });
  };

  const isPaginationEnabled = count > 0;

  const currentRows = isPaginationEnabled
    ? extractData(rows, args.pageNumber, args.pageSize)
    : rows;

  const columns: any[] = [
    {
      field: 'id',
      headerName: 'ID',
      sortable: true,
      align: 'center',
      sortFn: handleSortByIdNumber,
      maxWidth: '100px',
      elipsis: true,
    },
    {
      field: 'firstName',
      headerName: 'First name',
      align: 'left',
      sortable: true,
      sortFn: handleSortByFName,
      maxWidth: '200px',
      ellipsis: true,
    },
    {
      field: 'lastName',
      headerName: 'Last name',
      sortable: true,
      sortFn: handleSortByLName,
      maxWidth: '200px',
      ellipsis: true,
    },
    {
      field: 'birthday',
      headerName: 'Birthday',
      type: 'date',
      align: 'right',
      sortable: true,
      sortFn: handleSortByDate,
      maxWidth: '200px',
      ellipsis: true,
    },
    {
      field: 'age',
      headerName: 'Age',
      type: 'number',
      align: 'right',
      sortable: true,
      sortFn: handleSortByAge,
      maxWidth: '100px',
      ellipsis: true,
    },
    {
      field: 'fullName',
      headerName: 'Full name',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      maxWidth: '300px',
      ellipsis: true,
      valueGetter: (params: any) =>
        `${params.row.firstName || ''} ${params.row.lastName || ''}`,
    },
    {
      field: 'gender',
      headerName: 'Gender',
      align: 'center',
      maxWidth: '100px',
      valueGetter: (params: any) => {
        if (params.row.gender === 'male') {
          return html`<kd-icon .icon=${maleIcon}></kd-icon>`;
        } else {
          return html`<kd-icon .icon=${femaleIcon}></kd-icon>`;
        }
        return '';
      },
    },
    {
      field: 'action',
      headerName: 'Action',
      align: 'center',
      openMenu: false,
      maxWidth: '100px',
      cellRenderer: ({ row }: { row: any }) =>
        html`
          <action-menu
            .itemId=${row.id}
            .handleDelete=${deleteAction}
          ></action-menu>
        `,
    },
  ];

  const selectedCount = selectedRows?.length;
  const tableTitle =
    selectedCount > 0
      ? selectedCount === 1
        ? '1 item selected'
        : `${selectedCount} items selected`
      : title;

  return html`
    <div style=${args.stickyHeader ? 'height: 400px' : ''}>
      <kyn-table-toolbar tableTitle=${tableTitle}>
        ${showTableActions
          ? html` <batch-actions
              .handleDelete=${deleteSelectedRows}
            ></batch-actions>`
          : null}
      </kyn-table-toolbar>
      <kyn-data-table
        .fixedLayout=${args.fixedLayout}
        .columns=${columns}
        .rows=${currentRows}
        .selectedRows=${args.selectedRows}
        .checkboxSelection=${args.checkboxSelection}
        .stickyHeader=${args.stickyHeader}
        .dense=${args.dense}
        .striped=${args.striped}
        .paginationModel=${{ ...args }}
        .hideItemsRange=${args.hideItemsRange}
        .hidePageSizeDropdown=${args.hidePageSizeDropdown}
        .hideNavigationButtons=${args.hideNavigationButtons}
        @on-page-changed=${handlePageChange}
        @on-selected-rows-changed=${handleSelectedRowsChange}
      ></kyn-data-table>
    </div>
  `;
};

export const BasicTable = (args: any) => {
  const data = allData.slice(0, 5);
  return html`
    <kyn-table-toolbar tableTitle="Basic Table"></kyn-table-toolbar>
    <kyn-table-container>
      <kyn-table>
        <kyn-thead>
          <kyn-tr>
            <kyn-th>ID</kyn-th>
            <kyn-th>First Name</kyn-th>
            <kyn-th>Last Name</kyn-th>
            <kyn-th>Birthday</kyn-th>
            <kyn-th .align=${'right'}>Age</kyn-th>
            <kyn-th>Full Name</kyn-th>
            <kyn-th .align=${'center'}>Gender</kyn-th>
          </kyn-tr>
        </kyn-thead>
        <kyn-tbody .striped=${args.striped}>
          ${data.map(
            ({
              id,
              firstName,
              lastName,
              birthday,
              age,
              gender,
            }) => html`<kyn-tr>
              <kyn-td>${id}</kyn-td>
              <kyn-td>${firstName}</kyn-td>
              <kyn-td>${lastName}</kyn-td>
              <kyn-td>${birthday}</kyn-td>
              <kyn-td .align=${'right'}>${age}</kyn-td>
              <kyn-td>${firstName} ${lastName}</kyn-td>
              <kyn-td .align=${'center'}>
                ${gender === 'male'
                  ? html`<kd-icon .icon=${maleIcon}></kd-icon>`
                  : html`<kd-icon .icon=${femaleIcon}></kd-icon>`}
              </kyn-td>
            </kyn-tr>`
          )}
        </kyn-tbody>
      </kyn-table>
    </kyn-table-container>
  `;
};

export const Sorting: Story = {
  args: {
    rows: allData.slice(0, 5),
  },
  render: (args) => {
    const [, updateArgs] = useArgs();
    return tableRenderer(args, updateArgs, 'Sorting', false);
  },
};

export const Selecting: Story = {
  args: {
    rows: allData.slice(0, 5),
    checkboxSelection: true,
  },
  render: (args) => {
    const [, updateArgs] = useArgs();
    return tableRenderer(args, updateArgs, 'Selecting', true);
  },
};

export const StickyHeader: Story = {
  args: {
    stickyHeader: true,
    rows: allData,
  },
  render: (args) => {
    const [, updateArgs] = useArgs();
    return tableRenderer(args, updateArgs, 'Sticky Header', false);
  },
};

export const DataTable: Story = {
  args: {
    count: allData.length,
    rows: allData,
    pageSize: 10,
    pageNumber: 1,
    pageSizeOptions: [5, 10, 20, 30, 40, 50, 100],
    selectedRows: [],
    checkboxSelection: true,
  },
  render: (args) => {
    const [, updateArgs] = useArgs();
    return tableRenderer(args, updateArgs, 'Data Table', true);
  },
};
