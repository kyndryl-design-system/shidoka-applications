import { html } from 'lit';
import './index';

export default {
  title: 'Components/Skeleton',
  component: 'kyn-skeleton',
  argTypes: {
    // type: {
    //   options: ['normal', 'inline'],
    //   control: { type: 'select' },
    // },
  },
};

const args = {
  inline: false,
};

export const SkeletonPlaceholder = {
  args,
  render: (args) => {
    return html`
      <kyn-skeleton ?inline=${args.inline}></kyn-skeleton>

      <br />
      <br />
      <kyn-skeleton inline style="width: 150px; height: 20px;"></kyn-skeleton>
    `;
  },
};
