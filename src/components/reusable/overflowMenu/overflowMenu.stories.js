import { html } from 'lit';
import './index';
import { action } from 'storybook/actions';

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
      url: 'https://www.figma.com/design/9Q2XfTSxfzTXfNe2Bi8KDS/Component-Viewer?node-id=1-551887&p=f&m=dev',
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
            action(e.type)({ ...e, detail: e.detail });
          }}
          >Option 1</kyn-overflow-menu-item
        >
        <kyn-overflow-menu-item
          href="javascript:void(0);"
          @on-click=${(e) => {
            action(e.type)({ ...e, detail: e.detail });
          }}
        >
          Option 2
        </kyn-overflow-menu-item>
        <kyn-overflow-menu-item disabled>Option 3</kyn-overflow-menu-item>
        <kyn-overflow-menu-item
          @on-click=${(e) => {
            action(e.type)({ ...e, detail: e.detail });
          }}
        >
          Option 4
        </kyn-overflow-menu-item>
        <kyn-overflow-menu-item
          @on-click=${(e) => {
            action(e.type)({ ...e, detail: e.detail });
          }}
          >Longer Text Option example
        </kyn-overflow-menu-item>
        <kyn-overflow-menu-item
          destructive
          description="Destructive Action"
          @on-click=${(e) => {
            action(e.type)({ ...e, detail: e.detail });
          }}
          >Option 5
        </kyn-overflow-menu-item>
      </kyn-overflow-menu>
    `;
  },
};
