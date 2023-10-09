/**
 * Copyright Kyndryl, Inc. 2023
 */

// Import external libraries
import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';
import { useArgs } from '@storybook/client-api';

// Kyndryl Design System Components and Icons
import '@kyndryl-design-system/shidoka-foundation/components/icon';
import infoIcon from '@carbon/icons/es/information/16';
import './index';
import { SORT_DIRECTION } from './defs';

const meta: Meta = {
  title: 'Components/Table',
  component: 'kyn-table',
  argTypes: {
    striped: { control: 'boolean' },
    count: { control: 'number' },
    pageSize: { control: 'select', options: [5, 10, 20, 30, 40, 50, 100] },
    pageNumber: { control: 'number' },
    pageSizeOptions: { control: 'array' },
  },
  subcomponents: {
    'kyn-th': 'kyn-th',
    'kyn-tr': 'kyn-tr',
    'kyn-td': 'kyn-td',
    'kyn-thead': 'kyn-thead',
    'kyn-tbody': 'kyn-tbody',
    'kyn-pagination': 'kyn-pagination',
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
    count: number;
    pageSize: number;
    pageNumber: number;
    pageSizeOptions: number[];
  };
};

const getRandomName = () => {
  const names = [
    'Alice',
    'Bob',
    'Charlie',
    'Diana',
    'Eva',
    'Frank',
    'Grace',
    'Hank',
    'Ivy',
    'Jack',
  ];
  const randomIndex = Math.floor(Math.random() * names.length);
  return names[randomIndex];
};

const getRandomNumberBetween1And10000 = () => {
  return Math.floor(Math.random() * 10000) + 1;
};

const incrementDate = () => {
  const newDate = new Date('01/01/2000');
  newDate.setDate(newDate.getDate() + getRandomNumberBetween1And10000());
  return newDate;
};

/**
 * Generates an array of mock data
 * @type {Array<object>}
 */
const allData = Array(100)
  .fill(0)
  .map((_, index) => ({
    id: index + 1,
    name: getRandomName(),
    birthday: incrementDate().toLocaleDateString(),
  }));

interface Person {
  id: number;
  name: string;
  birthday: string;
}

const sortByName = (sortDirection: SORT_DIRECTION) => {
  return (a: Person, b: Person) => {
    return sortDirection === 'asc'
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name);
  };
};

const sortById = (sortDirection: SORT_DIRECTION) => {
  return (a: Person, b: Person) => {
    return sortDirection === 'asc' ? a.id - b.id : b.id - a.id;
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

const extractData = (pageNumber: number, pageSize: number) => {
  const start = (pageNumber - 1) * pageSize;
  const end = start + pageSize;
  return allData.slice(start, end);
};

/**
 * Renders the table based on the given arguments
 * @param {object} args - Arguments for the table
 * @param {Function} updateArgs - Function to update the story's arguments
 * @param {string} title - Title of the table
 * @param {boolean} [striped=false] - Determines if the table has striped rows
 * @returns {import("lit").TemplateResult} Rendered table
 */
const tableRenderer = (args: any, updateArgs: any, title: string) => {
  const pageSizeChangeHandler = (e: CustomEvent) => {
    updateArgs({ pageSize: +e.detail.value });
    updateArgs({ pageNumber: 1 });
  };

  const pageNumberChangeHandler = (e: CustomEvent) => {
    updateArgs({ pageNumber: +e.detail.value });
  };

  const handleSortByIdNumber = (e: CustomEvent) => {
    const { sortDirection } = e.detail;
    allData.sort(sortById(sortDirection));
    updateArgs({ sorting: true });
  };

  const handleSortByName = (e: CustomEvent) => {
    const { sortDirection } = e.detail;
    allData.sort(sortByName(sortDirection));
    updateArgs({ sorting: true });
  };

  const handleSortByDate = (e: CustomEvent) => {
    const { sortDirection } = e.detail;
    allData.sort(sortByDate(sortDirection));
    updateArgs({ sorting: true });
  };

  const currentData = extractData(args.pageNumber, args.pageSize);

  return html`
    <kyn-table-container>
      <kyn-table-toolbar tableTitle=${title}></kyn-table-toolbar>
      <kyn-table>
        <kyn-thead>
          <kyn-tr>
            <kyn-th
              .sortable=${true}
              @on-sort-changed=${handleSortByIdNumber}
              sortKey=${'order'}
              >ID</kyn-th
            >
            <kyn-th
              .sortable=${true}
              @on-sort-changed=${handleSortByName}
              sortKey=${'name'}
              >Name</kyn-th
            >
            <kyn-th
              .sortable=${true}
              @on-sort-changed=${handleSortByDate}
              sortKey=${'birthday'}
              >Birthday</kyn-th
            >
            <kyn-th .align=${'right'}>Col 4</kyn-th>
            <kyn-th>Col 6</kyn-th>
            <kyn-th>Col 7</kyn-th>
            <kyn-th .align=${'center'} visiblyHidden>Info Icon</kyn-th>
            <kyn-th .align=${'center'}>ACTION</kyn-th>
          </kyn-tr>
        </kyn-thead>
        <kyn-tbody .striped=${args.striped}>
          ${currentData.map(
            ({ id, name, birthday }) => html`<kyn-tr>
              <kyn-td>${id}</kyn-td>
              <kyn-td>${name}</kyn-td>
              <kyn-td>${birthday}</kyn-td>
              <kyn-td .align=${'right'}>Content</kyn-td>
              <kyn-td>
                <div style="display: flex; align-items: center">
                  <kd-icon
                    .icon=${infoIcon}
                    style="margin-right: 10px;"
                  ></kd-icon
                  >Content
                </div>
              </kyn-td>
              <kyn-td>Tag</kyn-td>
              <kyn-td .align=${'center'}
                ><kd-icon .icon=${infoIcon}></kd-icon
              ></kyn-td>
              <kyn-td .align=${'center'}>...</kyn-td>
            </kyn-tr>`
          )}
        </kyn-tbody>
      </kyn-table>
    </kyn-table-container>
    <kyn-pagination
      .count=${args.count}
      .pageSize=${args.pageSize}
      .pageNumber=${args.pageNumber}
      .pageSizeOptions=${args.pageSizeOptions}
      @on-page-size-change=${pageSizeChangeHandler}
      @on-page-number-change=${pageNumberChangeHandler}
    ></kyn-pagination>
  `;
};

export const BasicTable: Story = {
  args: {
    count: allData.length,
    pageSize: 10,
    pageNumber: 1,
    pageSizeOptions: [5, 10, 20, 30, 40, 50, 100],
  },
  render: (args) => {
    const [, updateArgs] = useArgs();
    return tableRenderer(args, updateArgs, 'Table title');
  },
};
