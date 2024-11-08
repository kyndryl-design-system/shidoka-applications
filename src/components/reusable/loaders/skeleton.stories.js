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
};

const args = {
  lines: 2,
  minWidth: 100,
  maxWidth: 100,
};

export const Block = {
  render: () => {
    return html`
      <style>
        kyn-skeleton.block-example {
          height: 128px;
        }
      </style>

      <kyn-skeleton class="block-example"></kyn-skeleton>
    `;
  },
};

export const Inline = {
  render: () => {
    return html`
      <style>
        kyn-skeleton.inline-example {
          width: 108px;
          height: 16px;
        }
      </style>

      <kyn-skeleton inline class="inline-example"></kyn-skeleton>
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
      <kyn-skeleton
        lines=${args.lines}
        minWidth=${args.minWidth}
        maxWidth=${args.maxWidth}
        class="block-example"
      ></kyn-skeleton>
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
        minWidth=${args.minWidth}
        maxWidth=${args.maxWidth}
        class="inline-example"
      ></kyn-skeleton>
    `;
  },
};
