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
  argTypes: {
    open: { control: 'boolean' },
    kind: {
      control: 'select',
      options: ['default', 'ai'],
    },
    anchorRight: { control: 'boolean' },
    verticalDots: { control: 'boolean' },
    fixed: { control: 'boolean' },
    assistiveText: { control: 'text' },
    backButtonText: { control: 'text' },
    deactivateHover: { control: 'boolean' },
    'kind-changed': {
      table: { disable: true },
      control: false,
    },
  },
};

const args = {
  open: false,
  kind: 'default',
  anchorRight: false,
  verticalDots: false,
  deactivateHover: false,
  backButtonText: 'Back',
  fixed: false,
  assistiveText: 'Toggle Menu',
};

export const Default = {
  args: args,
  render: (args) => {
    return html`
      <kyn-overflow-menu
        ?open=${args.open}
        ?anchorRight=${args.anchorRight}
        ?verticalDots=${args.verticalDots}
        kind=${args.kind}
        backButtonText=${args.backButtonText}
        ?fixed=${args.fixed}
        ?deactivateHover=${args.deactivateHover}
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

export const Nested = {
  args: args,
  render: (args) => {
    return html`
      <kyn-overflow-menu
        ?open=${args.open}
        ?anchorRight=${args.anchorRight}
        ?verticalDots=${args.verticalDots}
        backButtonText=${args.backButtonText}
        kind=${args.kind}
        ?fixed=${args.fixed}
        ?deactivateHover=${args.deactivateHover}
        assistiveText=${args.assistiveText}
      >
        <kyn-overflow-menu-item
          @on-click=${(e) => {
            action(e.type)({ ...e, detail: e.detail });
          }}
          >Top Option</kyn-overflow-menu-item
        >

        <kyn-overflow-menu-item nested ?deactivateHover=${args.deactivateHover}>
          More actions
          <div slot="submenu">
            <kyn-overflow-menu-item
              @on-click=${(e) => {
                action(e.type)({ ...e, detail: e.detail });
              }}
              >Sub action 1</kyn-overflow-menu-item
            >
            <kyn-overflow-menu-item
              @on-click=${(e) => {
                action(e.type)({ ...e, detail: e.detail });
              }}
              >Sub action 2</kyn-overflow-menu-item
            >
            <kyn-overflow-menu-item
              nested
              ?deactivateHover=${args.deactivateHover}
            >
              Deeper
              <div slot="submenu">
                <kyn-overflow-menu-item
                  @on-click=${(e) => {
                    action(e.type)({ ...e, detail: e.detail });
                  }}
                  >Deeper a</kyn-overflow-menu-item
                >
                <kyn-overflow-menu-item
                  @on-click=${(e) => {
                    action(e.type)({ ...e, detail: e.detail });
                  }}
                  >Deeper b</kyn-overflow-menu-item
                >
              </div>
            </kyn-overflow-menu-item>
          </div>
        </kyn-overflow-menu-item>

        <kyn-overflow-menu-item
          destructive
          description="Destructive Action"
          @on-click=${(e) => {
            action(e.type)({ ...e, detail: e.detail });
          }}
          >Delete</kyn-overflow-menu-item
        >
      </kyn-overflow-menu>
    `;
  },
};

export const AIVariant = {
  args: {
    ...args,
    kind: 'ai',
  },
  render: (args) => {
    return html`
      <kyn-overflow-menu
        ?open=${args.open}
        ?anchorRight=${args.anchorRight}
        ?verticalDots=${args.verticalDots}
        backButtonText=${args.backButtonText}
        kind=${args.kind}
        ?fixed=${args.fixed}
        ?deactivateHover=${args.deactivateHover}
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

export const NestedAI = {
  args: { ...args, kind: 'ai' },
  render: (args) => {
    return html`
      <kyn-overflow-menu
        ?open=${args.open}
        ?anchorRight=${args.anchorRight}
        ?verticalDots=${args.verticalDots}
        backButtonText=${args.backButtonText}
        kind=${args.kind}
        ?fixed=${args.fixed}
        ?deactivateHover=${args.deactivateHover}
        assistiveText=${args.assistiveText}
      >
        <kyn-overflow-menu-item
          @on-click=${(e) => {
            action(e.type)({ ...e, detail: e.detail });
          }}
          >Top Option</kyn-overflow-menu-item
        >

        <kyn-overflow-menu-item nested ?deactivateHover=${args.deactivateHover}>
          More actions
          <div slot="submenu">
            <kyn-overflow-menu-item
              @on-click=${(e) => {
                action(e.type)({ ...e, detail: e.detail });
              }}
              >Sub action 1</kyn-overflow-menu-item
            >
            <kyn-overflow-menu-item
              @on-click=${(e) => {
                action(e.type)({ ...e, detail: e.detail });
              }}
              >Sub action 2</kyn-overflow-menu-item
            >
            <kyn-overflow-menu-item
              nested
              ?deactivateHover=${args.deactivateHover}
            >
              Deeper
              <div slot="submenu">
                <kyn-overflow-menu-item
                  @on-click=${(e) => {
                    action(e.type)({ ...e, detail: e.detail });
                  }}
                  >Deeper a</kyn-overflow-menu-item
                >
                <kyn-overflow-menu-item
                  @on-click=${(e) => {
                    action(e.type)({ ...e, detail: e.detail });
                  }}
                  >Deeper b</kyn-overflow-menu-item
                >
              </div>
            </kyn-overflow-menu-item>
          </div>
        </kyn-overflow-menu-item>

        <kyn-overflow-menu-item
          destructive
          description="Destructive Action"
          @on-click=${(e) => {
            action(e.type)({ ...e, detail: e.detail });
          }}
          >Delete</kyn-overflow-menu-item
        >
      </kyn-overflow-menu>
    `;
  },
};
