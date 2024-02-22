import { html } from 'lit';
import './index';
import { action } from '@storybook/addon-actions';

import '@kyndryl-design-system/shidoka-foundation/components/button';
import '@kyndryl-design-system/shidoka-foundation/components/icon';

export default {
  title: 'Components/SideDrawer',
  component: 'kyn-side-drawer',
  argTypes: {
    size: {
      options: ['auto', 'md', 'lg'],
      control: { type: 'select' },
    },
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/6AovH7Iay9Y7BkpoL5975s/Applications-Specs-for-Devs?node-id=1287%3A171858&mode=dev',
    },
  },
};

const args = {
  open: false,
};

export const SideDrawer = {
  args,
  render: (args) => {
    return html`
      <kyn-side-drawer ?open=${args.open}>
        Basic Modal example.
      </kyn-side-drawer>
    `;
  },
};
