/**
 * Copyright Kyndryl, Inc. 2023
 */

// Import external libraries
import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';

// Kyndryl Design System Components and Icons
import './index';
import './story-helpers/table-story';
import { allData } from './story-helpers/ultils';

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

/**
 * Renders the table based on the given arguments
 * @param {object} args - Arguments for the table
 * @param {string} title - Title of the table
 * @returns {import("lit").TemplateResult} Rendered table
 */
const tableRenderer = (args: any, params: any) => {
  const { title, rows, showPagination } = params;
  const { pageSize, pageNumber, pageSizeOptions } = args;

  return html` <story-table
    .tableTitle=${title}
    .rows=${rows}
    .pageSize=${pageSize}
    .pageNumber=${pageNumber}
    .pageSizeOptions=${pageSizeOptions}
    .showPagination=${showPagination}
    ?showTableActions=${args.showTableActions}
    ?dense=${args.dense}
    ?ellipsis=${args.ellipsis}
    ?sortable=${args.sortable}
    ?checkboxSelection=${args.checkboxSelection}
    ?fixedLayout=${args.fixedLayout}
    ?stickyHeader=${args.stickyHeader}
    ?striped=${args.striped}
  >
  </story-table>`;
};

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
  args: {},
  render: (args) => {
    const rows = allData.slice(0, 5);
    return tableRenderer(args, { title: 'Basic', rows });
  },
  parameters,
};

export const Sorting: Story = {
  args: {
    sortable: true,
  },
  render: (args) => {
    const rows = allData.slice(0, 5);
    return tableRenderer(args, { title: 'Sorting', rows });
  },
  parameters
};

export const Selection: Story = {
  args: {
    checkboxSelection: true,
  },
  render: (args) => {
    const rows = allData.slice(0, 5);
    return tableRenderer(args, { title: 'Selection', rows });
  },
  parameters
};

export const BatchActions: Story = {
  args: {
    checkboxSelection: true,
    showTableActions: true,
  },
  render: (args) => {
    const rows = allData.slice(0, 5);
    return tableRenderer(args, { title: 'Batch Actions', rows });
  },
  parameters
};

export const Pagination: Story = {
  args: {
    pageSize: 5,
    pageNumber: 1,
    pageSizeOptions: [5, 10, 20, 30, 40, 50, 100],
  },
  render: (args) => {
    const rows = allData;
    return tableRenderer(args, {
      title: 'Pagination',
      rows,
      showPagination: true,
    });
  },
  parameters
};

export const StickyHeader: Story = {
  args: {
    stickyHeader: true,
  },
  render: (args) => {
    const rows = allData;
    return tableRenderer(args, { title: 'Sticky Header', rows });
  },
  parameters
};

export const StripedRows: Story = {
  args: {
    striped: true,
  },
  render: (args) => {
    const rows = allData.slice(0, 5);
    return tableRenderer(args, { title: 'Striped Rows', rows });
  },
  parameters
};

export const Dense: Story = {
  args: {
    dense: true,
  },
  render: (args) => {
    const rows = allData.slice(0, 5);
    return tableRenderer(args, { title: 'Dense', rows });
  },
  parameters
};

export const Ellipsis: Story = {
  args: {
    ellipsis: true,
  },
  render: (args) => {
    const rows = allData.slice(0, 5).map((row: any) => {
      return {
        ...row,
        firstName: 'This is a very long description that should be truncated.',
      };
    });
    return tableRenderer(args, { title: 'Ellipsis', rows });
  },
  parameters
};

export const FixedLayout: Story = {
  args: {
    fixedLayout: true,
  },
  render: (args) => {
    const rows = allData.slice(0, 5);
    return tableRenderer(args, { title: 'Fixed Layout', rows });
  },
  parameters
};
