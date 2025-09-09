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
    width: { control: 'text' },
    nestedWidth: {
      control: 'text',
      description: "Use 'match-parent', a number (px), or any CSS length.",
    },
    linkWidths: { control: 'boolean' },
    anchorRight: { control: 'boolean' },
    verticalDots: { control: 'boolean' },
    fixed: { control: 'boolean' },
    assistiveText: { control: 'text' },
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
  fixed: false,
  assistiveText: 'Toggle Menu',
  width: '', // e.g., '280', '22rem', 'auto'
  nestedWidth: 'match-parent', // 'match-parent' | '' | CSS length
  linkWidths: false,
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
        ?fixed=${args.fixed}
        assistiveText=${args.assistiveText}
        width=${args.width}
        nestedWidth=${args.nestedWidth}
        ?linkWidths=${args.linkWidths}
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
        kind=${args.kind}
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

export const NestedMenuItem = {
  args: args,
  render: (args) => {
    return html`
      <kyn-overflow-menu
        ?open=${args.open}
        ?anchorRight=${args.anchorRight}
        ?verticalDots=${args.verticalDots}
        kind=${args.kind}
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
          nested
          @on-click=${(e) => {
            action(e.type)({ ...e, detail: e.detail });
          }}
        >
          Nested Option
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

export const NestedWidthEqualMainWidth = {
  args: { ...args, width: '200px', linkWidths: true },
  render: (args) => html`
    <kyn-overflow-menu
      ?open=${args.open}
      ?anchorRight=${args.anchorRight}
      ?verticalDots=${args.verticalDots}
      kind=${args.kind}
      ?fixed=${args.fixed}
      assistiveText=${args.assistiveText}
      width=${args.width}
      nestedWidth=${args.nestedWidth}
      ?linkWidths=${args.linkWidths}
    >
      <kyn-overflow-menu-item>Option 1</kyn-overflow-menu-item>
      <kyn-overflow-menu-item nested>Nested Option</kyn-overflow-menu-item>
    </kyn-overflow-menu>
  `,
};
NestedWidthEqualMainWidth.storyName = 'Nested Width = Main Width';

export const SeparateWidths = {
  args: { ...args, width: '200px', nestedWidth: '150px' },
  render: (args) => html`
    <kyn-overflow-menu
      ?open=${args.open}
      ?anchorRight=${args.anchorRight}
      ?verticalDots=${args.verticalDots}
      kind=${args.kind}
      ?fixed=${args.fixed}
      assistiveText=${args.assistiveText}
      width=${args.width}
      nestedWidth=${args.nestedWidth}
      ?linkWidths=${args.linkWidths}
    >
      <kyn-overflow-menu-item>Option 1</kyn-overflow-menu-item>
      <kyn-overflow-menu-item nested>Nested Option</kyn-overflow-menu-item>
    </kyn-overflow-menu>
  `,
};
SeparateWidths.storyName = 'Nested Width ≠ Main Width';
