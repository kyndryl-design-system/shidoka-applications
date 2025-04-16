import { html } from 'lit';

import './index';

export default {
  title: 'Components/Avatar',
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

Avatar.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/design/9Q2XfTSxfzTXfNe2Bi8KDS/Component-Viewer?node-id=7-302033&m=dev',
  },
};
