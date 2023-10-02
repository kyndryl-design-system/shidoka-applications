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

/**
 * Generates an array of mock data
 * @type {string[]}
 */
const allData = Array(100)
  .fill(0)
  .map((_, index) => `Row ${index + 1}`);

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

  const handleSortChange = (e: CustomEvent) => {
    const { sortDirection } = e.detail;
    allData.sort((a, b) => {
      const numA = parseInt(a.split(' ')[1]);
      const numB = parseInt(b.split(' ')[1]);

      if (sortDirection === 'asc') {
        return numA - numB;
      } else {
        return numB - numA;
      }
    });
    updateArgs({ sorting: true });
  };

  const currentData = extractData(args.pageNumber, args.pageSize);

  return html`
    <kyn-table-container>
      <kyn-table-toolbar tableTitle=${title}></kyn-table-toolbar>
      <kyn-table>
        <kyn-thead>
          <kyn-tr>
            <kyn-th .sortable=${true} @on-sort-changed=${handleSortChange}
              >Col 1</kyn-th
            >
            <kyn-th>Col 2</kyn-th>
            <kyn-th .align=${'right'}>Col 3</kyn-th>
            <kyn-th>Col 4</kyn-th>
            <kyn-th>Col 6</kyn-th>
            <kyn-th>Col 7</kyn-th>
            <kyn-th .align=${'center'}></kyn-th>
            <kyn-th .align=${'center'}>ACTION</kyn-th>
          </kyn-tr>
        </kyn-thead>
        <kyn-tbody .striped=${args.striped}>
          ${currentData.map(
            (data) => html`<kyn-tr>
              <kyn-td>${data}</kyn-td>
              <kyn-td>${data}</kyn-td>
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
              <kyn-td>${data}</kyn-td>
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
    return tableRenderer(args, updateArgs, 'Table title', args.striped);
  },
};
