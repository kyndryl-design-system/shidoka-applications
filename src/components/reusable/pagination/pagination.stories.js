import { html } from 'lit';
import './index';
import { action } from 'storybook/actions';

export default {
  title: 'Components/Pagination',
  component: 'kyn-pagination',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/9Q2XfTSxfzTXfNe2Bi8KDS/Component-Viewer?node-id=1-443883&t=A5tcETiCf23sAgKK-0',
    },
  },
  argTypes: {
    pageSize: {
      options: [5, 10, 20, 30, 40, 50, 100],
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

export const Pagination = {
  args,
  render: (args) => {
    return html`
      <kyn-pagination
        .count=${args.count}
        .pageSize=${args.pageSize}
        .pageNumber=${args.pageNumber}
        .pageSizeOptions=${args.pageSizeOptions}
        .pageSizeDropdownLabel=${args.pageSizeDropdownLabel}
        ?hideItemsRange=${args.hideItemsRange}
        ?hidePageSizeDropdown=${args.hidePageSizeDropdown}
        ?hideNavigationButtons=${args.hideNavigationButtons}
        .textStrings=${args.textStrings}
        @on-page-size-change=${(e) =>
          action(e.type)({ ...e, detail: e.detail })}
        @on-page-number-change=${(e) =>
          action(e.type)({ ...e, detail: e.detail })}
      ></kyn-pagination>
    `;
  },
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
