import { html } from 'lit';

import './index';

export default {
  title: 'Components/Loaders/Skeleton',
  component: 'kyn-skeleton',
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
  argTypes: {
    elementType: {
      control: 'select',
      options: [
        'default',
        'thumbnail',
        'title',
        'subtitle',
        'body-text',
        'table-cell',
        'button',
        'link',
        'card-logo',
      ],
    },
    lines: { control: 'number' },
    inline: { control: 'boolean' },
    width: { control: 'text' },
    height: { control: 'text' },
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
            width=${args.width || ''}
            height=${args.height || ''}
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

const CustomTemplate = () => html`
  <div>
    <h3>Custom Button Skeleton</h3>
    <kyn-skeleton
      style="margin: 8px 0 16px"
      elementType="button"
      width="120px"
      height="48px"
    ></kyn-skeleton>

    <h3>Custom Title Skeleton</h3>
    <kyn-skeleton
      style="margin: 8px 0 16px"
      elementType="title"
      width="200px"
      height="24px"
    ></kyn-skeleton>

    <h3>Custom Thumbnail Skeleton</h3>
    <kyn-skeleton
      style="margin: 8px 0 16px"
      elementType="thumbnail"
      width="200px"
      height="120px"
    ></kyn-skeleton>

    <h3>Custom Card Logo Skeleton</h3>
    <kyn-skeleton
      style="margin: 8px 0 0"
      elementType="card-logo"
      width="54px"
      height="54px"
    ></kyn-skeleton>
  </div>
`;

export const CustomSizes = CustomTemplate.bind({});
