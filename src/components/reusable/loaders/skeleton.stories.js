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

const Template = (args) => html`
  <div class="skeleton-wrapper">
    ${Array(args.lines)
      .fill(null)
      .map(
        (_, index) => html`
          <kyn-skeleton
            class="${!args.inline ? 'skeleton-item' : 'inline'} ${index ===
            args.lines - 1
              ? 'last-item'
              : ''}"
            elementType=${args.elementType}
            .lines=${args.lines}
            ?inline=${args.inline}
          ></kyn-skeleton>
        `
      )}
  </div>
`;

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
