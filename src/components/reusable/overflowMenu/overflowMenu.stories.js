import { html } from 'lit';
import './index';
import { action } from '@storybook/addon-actions';
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
  verticalDots: false,
  fixed: false,
  assistiveText: 'Toggle Menu',
};

export const OverflowMenu = {
  args: args,
  render: (args) => {
    return html`
      <kyn-overflow-menu
        ?open=${args.open}
        ?anchorRight=${args.anchorRight}
        ?verticalDots=${args.verticalDots}
        ?fixed=${args.fixed}
        assistiveText=${args.assistiveText}
      >
        <kyn-overflow-menu-item
          @on-click=${(e) => {
            action(e.type)(e);
          }}
          >Option 1</kyn-overflow-menu-item
        >
        <kyn-overflow-menu-item
          href="javascript:void(0);"
          @on-click=${(e) => {
            action(e.type)(e);
          }}
        >
          Option 2
        </kyn-overflow-menu-item>
        <kyn-overflow-menu-item disabled>Option 3</kyn-overflow-menu-item>
        <kyn-overflow-menu-item
          @on-click=${(e) => {
            action(e.type)(e);
          }}
        >
          Option 4</kyn-overflow-menu-item
        >
        <kyn-overflow-menu-item
          @on-click=${(e) => {
            action(e.type)(e);
          }}
          >Longer Text Option will show as tooltip</kyn-overflow-menu-item
        >
        <kyn-overflow-menu-item
          destructive
          description="Button description"
          @on-click=${(e) => {
            action(e.type)(e);
          }}
          >Option 5</kyn-overflow-menu-item
        >
      </kyn-overflow-menu>
    `;
  },
};
