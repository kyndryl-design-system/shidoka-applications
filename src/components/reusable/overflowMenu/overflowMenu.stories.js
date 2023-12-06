import { html } from 'lit';
import './index';
// import { action } from '@storybook/addon-actions';

export default {
  title: 'Components/Overflow Menu',
  component: 'kyn-overflow-menu',
  subcomponents: {
    'kyn-overflow-menu-item': 'kyn-overflow-menu-item',
  },
  decorators: [
    (story) =>
      html`
        <div style="display: flex; justify-content: center;">${story()}</div>
      `,
  ],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/6AovH7Iay9Y7BkpoL5975s/Applications-Specs-for-Devs?node-id=2522%3A520713&mode=dev',
    },
  },
};

const args = {
  open: false,
  anchorRight: false,
};

export const OverflowMenu = {
  args: args,
  render: (args) => {
    return html`
      <kyn-overflow-menu ?open=${args.open} ?anchorRight=${args.anchorRight}>
        <kyn-overflow-menu-item>Option 1</kyn-overflow-menu-item>
        <kyn-overflow-menu-item href="javascript:void(0);">
          Option 2
        </kyn-overflow-menu-item>
        <kyn-overflow-menu-item disabled>Option 3</kyn-overflow-menu-item>
        <kyn-overflow-menu-item> Option 4 </kyn-overflow-menu-item>
        <kyn-overflow-menu-item destructive>Option 5</kyn-overflow-menu-item>
      </kyn-overflow-menu>
    `;
  },
};
