import { html } from 'lit';

import './skeleton';

export default {
  title: 'Components/Loaders/Skeleton',
  component: 'kyn-skeleton',
  argTypes: {
    elementType: {
      control: 'select',
      options: [
        'default',
        'thumbnail',
        'title',
        'tag',
        'subtitle',
        'body-text',
        'table-cell',
        'card-logo',
      ],
    },
    lines: { control: 'number' },
    inline: { control: 'boolean' },
  },
};

const Template = (args) => {
  const skeletons = Array(args.lines)
    .fill(null)
    .map((_, index) => {
      const isLast = index === args.lines - 1;
      return html`
        <div
          style="${args.inline
            ? `flex: 1; margin-right: ${isLast ? '0' : '8px'};`
            : ''}"
        >
          <kyn-skeleton
            class="${args.inline ? 'inline' : 'skeleton-item'} ${isLast
              ? 'last-item'
              : ''}"
            elementType=${args.elementType}
            ?inline=${args.inline}
          ></kyn-skeleton>
        </div>
      `;
    });

  return html`
    <div
      style="${args.inline
        ? 'display: flex; width: 100%; flex-wrap: wrap; gap: 8px;'
        : ''}"
    >
      ${skeletons}
    </div>
  `;
};

export const Block = Template.bind({});
Block.args = {
  elementType: 'default',
  lines: 1,
  inline: false,
};

export const Inline = Template.bind({});
Inline.args = {
  ...Block.args,
  inline: true,
};

export const MultiBlock = Template.bind({});
MultiBlock.args = {
  ...Block.args,
  lines: 2,
};

export const MultiInline = Template.bind({});
MultiInline.args = {
  ...Block.args,
  lines: 2,
  inline: true,
};
