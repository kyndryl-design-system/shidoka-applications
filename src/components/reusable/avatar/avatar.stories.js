import { html } from 'lit';

import './index';

export default {
  title: 'Components/Indicators & Labels/Avatar',
  component: 'kyn-avatar',
};

export const Avatar = {
  args: {
    initials: 'A',
  },
  render: (args) => {
    return html` <kyn-avatar initials=${args.initials}></kyn-avatar> `;
  },
};
