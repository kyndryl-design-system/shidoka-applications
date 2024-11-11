import { html } from 'lit';
import './index';

const args = {
  lines: 2,
};

export default {
  title: 'Components/Loaders/Skeleton',
  component: 'kyn-skeleton',
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
};

export const Block = {
  render: () => {
    return html`
      <kyn-skeleton size="large" aria-hidden="true"></kyn-skeleton>
    `;
  },
};

export const Inline = {
  render: () => {
    return html`
      <kyn-skeleton inline size="medium" aria-hidden="true"></kyn-skeleton>
    `;
  },
};

export const MultiBlock = {
  args,
  render: (args) => {
    return html`
      <style>
        kyn-skeleton.block-example {
          height: 128px;
        }
      </style>
      <kyn-skeleton lines=${args.lines} class="block-example"></kyn-skeleton>
    `;
  },
};

export const MultiInline = {
  args,
  render: (args) => {
    return html`
      <style>
        kyn-skeleton.inline-example {
          width: 108px;
          height: 16px;
        }
      </style>
      <kyn-skeleton
        inline
        lines=${args.lines}
        class="inline-example"
      ></kyn-skeleton>
    `;
  },
};
