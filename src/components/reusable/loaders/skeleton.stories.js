import { html } from 'lit';

import './index';

export default {
  title: 'Components/Loaders/Skeleton',
  component: 'kyn-skeleton',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/CQuDZEeLiuGiALvCWjAKlu/branch/qMpff4GuFUEcsMUkvacS3U/Applications---Component-Library?node-id=15313-10436&node-type=canvas&t=cy38tiFaz5uZuLBW-0',
    },
  },
  argTypes: {
    shape: {
      control: 'select',
      options: ['rectangle', 'circle'],
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
    lines: { control: 'number' },
    inline: { control: 'boolean' },
    width: { control: 'text' },
    height: { control: 'text' },
    aiConnected: { control: 'boolean' },
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
            shape=${args.shape}
            size=${args.size || ''}
            ?inline=${args.inline}
            width=${args.width || ''}
            height=${args.height || ''}
            ?aiConnected=${args.aiConnected}
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
  shape: 'rectangle',
  lines: 1,
  inline: false,
  aiConnected: false,
  width: '100%',
};

export const Inline = Template.bind({});
Inline.args = {
  ...Block.args,
  inline: true,
};

export const MultiBlock = Template.bind({});
MultiBlock.args = {
  shape: 'rectangle',
  lines: 2,
  inline: false,
  height: '128px',
  aiConnected: false,
};

export const MultiInline = Template.bind({});
MultiInline.args = {
  shape: 'rectangle',
  lines: 2,
  inline: true,
  size: 'medium',
  width: '100%',
  aiConnected: false,
};

const CustomTemplate = () => html`
  <div style="display:flex;gap:45px">
    <div>
      <div class="heading kd-type--headline-04">Default</div>
      <h3>Custom Button</h3>
      <kyn-skeleton
        style="margin: 8px 0 16px"
        width="120px"
        height="48px"
      ></kyn-skeleton>

      <h3>Custom Title</h3>
      <kyn-skeleton
        style="margin: 8px 0 16px"
        width="200px"
        height="24px"
      ></kyn-skeleton>

      <h3>Custom Thumbnail</h3>
      <kyn-skeleton
        style="margin: 8px 0 16px"
        width="200px"
        height="120px"
      ></kyn-skeleton>

      <h3>Custom Logo</h3>
      <kyn-skeleton
        style="margin: 8px 0 0"
        shape="circle"
        width="54px"
        height="54px"
      ></kyn-skeleton>
    </div>
    <div>
      <div class="heading kd-type--headline-04">AI</div>
      <h3>Custom Button AI</h3>
      <kyn-skeleton
        style="margin: 8px 0 16px"
        width="120px"
        height="48px"
        aiConnected
      ></kyn-skeleton>

      <h3>Custom Title AI</h3>
      <kyn-skeleton
        style="margin: 8px 0 16px"
        width="200px"
        height="24px"
        aiConnected
      ></kyn-skeleton>

      <h3>Custom Thumbnail AI</h3>
      <kyn-skeleton
        style="margin: 8px 0 16px"
        width="200px"
        height="120px"
        aiConnected
      ></kyn-skeleton>

      <h3>Custom Logo AI</h3>
      <kyn-skeleton
        style="margin: 8px 0 0"
        shape="circle"
        width="54px"
        height="54px"
        aiConnected
      ></kyn-skeleton>
    </div>
  </div>
`;

export const Gallery = CustomTemplate.bind({});

const SizesTemplate = () => html`
  <div style="display: flex; gap: 16px; align-items: top;">
    <kyn-skeleton shape="rectangle" size="small"></kyn-skeleton>
    <kyn-skeleton shape="rectangle" size="medium"></kyn-skeleton>
    <kyn-skeleton shape="rectangle" size="large"></kyn-skeleton>
  </div>
  <div style="display: flex; gap: 16px; align-items: top; margin-top: 24px;">
    <kyn-skeleton shape="circle" size="small"></kyn-skeleton>
    <kyn-skeleton shape="circle" size="medium"></kyn-skeleton>
    <kyn-skeleton shape="circle" size="large"></kyn-skeleton>
  </div>
`;

export const Sizes = SizesTemplate.bind({});

export const AIConnected = Template.bind({});
AIConnected.args = {
  ...Block.args,
  inline: true,
  aiConnected: true,
};
