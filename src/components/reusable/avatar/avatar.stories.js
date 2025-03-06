import { html } from 'lit';
import './index';

export default {
  title: 'Components/Avatar',
  component: 'kyn-avatar',
};

export const Avatar = {
  args: {
    initials: 'A',
    aiConnected: false,
  },
  render: (args) => {
    return html`
      <kyn-avatar
        initials=${args.initials}
        ?aiConnected=${args.aiConnected}
      ></kyn-avatar>
    `;
  },
};

export const AIConnected = {
  args: {
    initials: 'A',
    aiConnected: true,
  },
  render: (args) => {
    return html`
      <kyn-avatar
        initials=${args.initials}
        ?aiConnected=${args.aiConnected}
      ></kyn-avatar>
    `;
  },
};

Avatar.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/6AovH7Iay9Y7BkpoL5975s/Component-Library-for-Dev?node-id=215%3A2099&mode=dev',
  },
};
