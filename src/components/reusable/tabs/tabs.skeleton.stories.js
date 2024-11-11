import { html } from 'lit';
import './index';
import '@kyndryl-design-system/shidoka-foundation/components/icon';

import '../loaders/skeleton';

export default {
  title: 'Components/Tabs/Skeleton',
  component: 'kyn-tabs-skeleton',
  argTypes: {
    tabSize: {
      options: ['sm', 'md'],
      control: { type: 'select' },
    },
  },
  design: {
    type: 'figma',
    url: '',
  },
};

const args = {
  tabSize: 'md',
  vertical: false,
  tabCount: 3,
};

export const Skeleton = {
  args,
  render: (args) => {
    return html`
      <kyn-tabs-skeleton
        tabSize=${args.tabSize}
        ?vertical=${args.vertical}
        tabCount=${args.tabCount}
      ></kyn-tabs-skeleton>
    `;
  },
};
