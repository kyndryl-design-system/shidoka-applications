import { html } from 'lit';
import './index';
import { action } from 'storybook/actions';

export default {
  title: 'Components/Navigation/Pagination',
  component: 'kyn-pagination',
  argTypes: {
    pageSize: {
      options: [5, 10, 20, 30, 40, 50, 100],
      control: { type: 'select' },
    },
    openDirection: {
      options: ['auto', 'up', 'down'],
      control: { type: 'select' },
    },
  },
};

const args = {
  count: 100,
  pageSize: 5,
  pageNumber: 1,
  pageSizeOptions: [5, 10, 20, 30, 40, 50, 100],
  pageSizeDropdownLabel: 'Items Per Page:',
  hideItemsRange: false,
  hidePageSizeDropdown: false,
  hideNavigationButtons: false,
  openDirection: 'auto',
  textStrings: {
    showing: 'Showing',
    of: 'of',
    items: 'items',
    pages: 'pages',
    itemsPerPage: 'Items per page:',
    previousPage: 'Previous page',
    nextPage: 'Next page',
  },
};

const renderPagination = (args) => html`
  <kyn-pagination
    .count=${args.count}
    .pageSize=${args.pageSize}
    .pageNumber=${args.pageNumber}
    .pageSizeOptions=${args.pageSizeOptions}
    .pageSizeDropdownLabel=${args.pageSizeDropdownLabel}
    ?hideItemsRange=${args.hideItemsRange}
    ?hidePageSizeDropdown=${args.hidePageSizeDropdown}
    ?hideNavigationButtons=${args.hideNavigationButtons}
    openDirection=${args.openDirection}
    .textStrings=${args.textStrings}
    @on-page-size-change=${(e) => action(e.type)({ ...e, detail: e.detail })}
    @on-page-number-change=${(e) => action(e.type)({ ...e, detail: e.detail })}
  ></kyn-pagination>
`;

export const Pagination = {
  args,
  render: renderPagination,
};

/** Uses the free-text page input (shown when there are more than 20 pages). */
export const ManyPages = {
  args: {
    ...args,
    count: 500,
    pageSize: 10,
    pageNumber: 1,
  },
  render: renderPagination,
};

export const Skeleton = {
  args,
  render: (args) => html`
    <kyn-pagination-skeleton
      ?hideItemsRange=${args.hideItemsRange}
      ?hidePageSizeDropdown=${args.hidePageSizeDropdown}
      ?hideNavigationButtons=${args.hideNavigationButtons}
    ></kyn-pagination-skeleton>
  `,
};

Skeleton.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/design/9Q2XfTSxfzTXfNe2Bi8KDS/Component-Viewer?node-id=1-546635&t=A5tcETiCf23sAgKK-0',
  },
};
