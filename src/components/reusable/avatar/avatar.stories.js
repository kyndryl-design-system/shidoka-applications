import { html } from 'lit';
import './index';
import { action } from '@storybook/addon-actions';
import { ifDefined } from 'lit/directives/if-defined.js';

export default {
  title: 'Components/Avatar',
  component: 'kyn-avatar',
  argTypes: {
    minLength: {
      control: { type: 'number' },
    },
    maxLength: {
      control: { type: 'number' },
    },
  },
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
    url: 'https://www.figma.com/file/6AovH7Iay9Y7BkpoL5975s/Component-Library-for-Dev?node-id=215%3A2099&mode=dev',
  },
};
