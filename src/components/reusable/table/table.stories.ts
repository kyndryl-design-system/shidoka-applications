/**
 * Copyright Kyndryl, Inc. 2023
 */

// Import external libraries
import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';

// Kyndryl Design System Components and Icons
import './index';
import './story-helpers/table-story';
import { characters } from './story-helpers/ultils';
import allData from './story-helpers/table-data.json';

const meta: Meta = {
  title: 'Components/DataTable',
  component: 'kyn-table',
  subcomponents: {
    'kyn-th': 'kyn-th',
    'kyn-tr': 'kyn-tr',
    'kyn-td': 'kyn-td',
    'kyn-thead': 'kyn-thead',
    'kyn-tbody': 'kyn-tbody',
    'kyn-header-tr': 'kyn-header-tr',
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
type Story = StoryObj;

const parameters = {
  docs: {
    source: {
      code: `
      // For guidance on how to construct this code, please refer to the 'table-story.ts' file.
      // You can find it at the following path:
      // https://github.com/kyndryl-design-system/shidoka-applications/tree/main/src/components/reusable/table/story-helpers/table-story.ts
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
          <b>Note:</b> The 'rowId' attribute is required when enabling multi-selection
          functionality.
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
        .showPagination=${true}
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

export const Ellipsis: Story = {
  args: {
    ellipsis: true,
  },
  render: (args) => {
    const rows = characters.map((row: any) => {
      return {
        ...row,
        firstName: 'This is a very long description that should be truncated.',
      };
    });
    return html`
      <story-table
        .tableTitle=${'Ellipsis'}
        .rows=${rows}
        ?ellipsis=${args.ellipsis}
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
