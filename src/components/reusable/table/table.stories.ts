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
  const { title, rows } = params;

  return html` <story-table
    .tableTitle=${title}
    .rows=${rows}
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

export const Basic: Story = {
  args: {},
  render: (args) => {
    const rows = allData.slice(0, 5);
    return tableRenderer(args, { title: 'Basic', rows });
  },
};

export const Sorting: Story = {
  args: {
    sortable: true,
  },
  render: (args) => {
    const rows = allData.slice(0, 5);
    return tableRenderer(args, { title: 'Sorting', rows });
  },
};

export const Selection: Story = {
  args: {
    checkboxSelection: true,
  },
  render: (args) => {
    const rows = allData.slice(0, 5);
    return tableRenderer(args, { title: 'Selection', rows });
  },
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
};

export const StickyHeader: Story = {
  args: {
    stickyHeader: true,
  },
  render: (args) => {
    const rows = allData;
    return tableRenderer(args, { title: 'Sticky Header', rows });
  },
};

export const StripedRows: Story = {
  args: {
    striped: true,
  },
  render: (args) => {
    const rows = allData.slice(0, 5);
    return tableRenderer(args, { title: 'Striped Rows', rows });
  },
};

export const Dense: Story = {
  args: {
    dense: true,
  },
  render: (args) => {
    const rows = allData.slice(0, 5);
    return tableRenderer(args, { title: 'Dense', rows });
  },
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
};

export const FixedLayout: Story = {
  args: {
    fixedLayout: true,
  },
  render: (args) => {
    const rows = allData.slice(0, 5);
    return tableRenderer(args, { title: 'Fixed Layout', rows });
  },
};
