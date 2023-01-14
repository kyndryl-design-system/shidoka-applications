import { html } from 'lit';
import '../components/reusable/icon';
import userIcon from '@carbon/icons/es/user--avatar/24';

export default {
  title: 'Reusable/Icon',
  component: 'kyn-icon',
  argTypes: {
    fill: {
      control: { type: 'color' },
    },
    sizeOverride: {
      control: { type: 'number', min: 10, max: 100 },
    },
  },
};

export const Icon = {
  args: {
    icon: userIcon,
    fill: 'currentColor',
    sizeOverride: null,
  },
  render: (args) => html`
    <kyn-icon
      .icon=${args.icon}
      fill=${args.fill}
      sizeOverride=${args.sizeOverride}
    ></kyn-icon>
  `,
};
