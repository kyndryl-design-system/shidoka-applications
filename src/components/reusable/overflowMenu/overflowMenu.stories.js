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
    decorators: [],
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
    nestedWidth: { control: 'text' },
    anchorRight: { control: 'boolean' },
    verticalDots: { control: 'boolean' },
    fixed: { control: 'boolean' },
    assistiveText: { control: 'text' },
    backButtonText: { control: 'text', name: 'backButtonText' },
    nested: {
      table: { disable: true },
      control: false,
    },
    'kind-changed': {
      table: { disable: true },
      control: false,
    },
    textStrings: {
      backButtonAriaLabel: 'Back to parent menu',
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
  backButtonText: 'Back',
  width: '',
  nestedWidth: 'match-parent',
};

export const Default = {
  args,
  render: (args) => {
    return html`
      <kyn-overflow-menu
        @on-click=${(e) => action('on-click')({ ...e, detail: e.detail })}
        ?open=${args.open}
        ?anchorRight=${args.anchorRight}
        ?verticalDots=${args.verticalDots}
        kind=${args.kind}
        ?fixed=${args.fixed}
        assistiveText=${args.assistiveText}
        .backButtonText=${args.backButtonText}
        width=${args.width}
        .textStrings=${args.textStrings}
        nestedWidth=${args.nestedWidth}
      >
        <kyn-overflow-menu-item
          @on-click=${(e) => {
            action(e.type)({ ...e, detail: e.detail });
          }}
          >Option 1</kyn-overflow-menu-item
        >
        <kyn-overflow-menu-item
          href="https://example.com/"
          target="_blank"
          @on-click=${(e) => {
            action(e.type)({ ...e, detail: e.detail });
          }}
        >
          Visit example.com
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
          >Longer Text Option example</kyn-overflow-menu-item
        >

        <kyn-overflow-menu-item
          destructive
          description="Destructive Action"
          @on-click=${(e) => {
            action(e.type)({ ...e, detail: e.detail });
          }}
          >Option 5</kyn-overflow-menu-item
        >
      </kyn-overflow-menu>
    `;
  },
};

export const AIVariant = {
  args: { ...args, kind: 'ai' },
  render: (args) => {
    return html`
      <kyn-overflow-menu
        @on-click=${(e) => action('on-click')({ ...e, detail: e.detail })}
        ?open=${args.open}
        ?anchorRight=${args.anchorRight}
        ?verticalDots=${args.verticalDots}
        kind=${args.kind}
        ?fixed=${args.fixed}
        assistiveText=${args.assistiveText}
        .textStrings=${args.textStrings}
        .backButtonText=${args.backButtonText}
      >
        <kyn-overflow-menu-item
          @on-click=${(e) => {
            action(e.type)({ ...e, detail: e.detail });
          }}
          >Option 1</kyn-overflow-menu-item
        >
        <kyn-overflow-menu-item
          href="https://example.com/"
          target="_blank"
          @on-click=${(e) => {
            action(e.type)({ ...e, detail: e.detail });
          }}
        >
          Visit example.com
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
          >Longer Text Option example</kyn-overflow-menu-item
        >
        <kyn-overflow-menu-item
          destructive
          description="Destructive Action"
          @on-click=${(e) => {
            action(e.type)({ ...e, detail: e.detail });
          }}
          >Option 5</kyn-overflow-menu-item
        >
      </kyn-overflow-menu>
    `;
  },
};

export const Nested = {
  args,
  render: (args) => html`
    <kyn-overflow-menu
      @on-click=${(e) => action('on-click')({ ...e, detail: e.detail })}
      ?open=${args.open}
      ?anchorRight=${args.anchorRight}
      ?verticalDots=${args.verticalDots}
      kind=${args.kind}
      ?fixed=${args.fixed}
      assistiveText=${args.assistiveText}
      .backButtonText=${args.backButtonText}
      width=${args.width}
      .textStrings=${args.textStrings}
      nestedWidth=${args.nestedWidth}
    >
      <kyn-overflow-menu-item>Option 1</kyn-overflow-menu-item>

      <kyn-overflow-menu-item>
        More actions
        <div slot="submenu">
          <kyn-overflow-menu-item
            @on-click=${(e) => action(e.type)({ ...e, detail: e.detail })}
            >Sub A</kyn-overflow-menu-item
          >
          <kyn-overflow-menu-item
            @on-click=${(e) => action(e.type)({ ...e, detail: e.detail })}
            >Sub B</kyn-overflow-menu-item
          >
          <kyn-overflow-menu-item
            destructive
            description="Destructive"
            @on-click=${(e) => action(e.type)({ ...e, detail: e.detail })}
            >Sub C</kyn-overflow-menu-item
          >
        </div>
      </kyn-overflow-menu-item>

      <kyn-overflow-menu-item>Option 2</kyn-overflow-menu-item>
    </kyn-overflow-menu>
  `,
};

export const NestedWidthEqualMainWidth = {
  args: { ...args, width: '200px' },
  render: (args) => html`
    <kyn-overflow-menu
      @on-click=${(e) => action('on-click')({ ...e, detail: e.detail })}
      ?open=${args.open}
      ?anchorRight=${args.anchorRight}
      ?verticalDots=${args.verticalDots}
      kind=${args.kind}
      ?fixed=${args.fixed}
      assistiveText=${args.assistiveText}
      .backButtonText=${args.backButtonText}
      width=${args.width}
      nestedWidth=${args.nestedWidth}
    >
      <kyn-overflow-menu-item>Option 1</kyn-overflow-menu-item>

      <kyn-overflow-menu-item>
        Nested Option
        <div slot="submenu">
          <kyn-overflow-menu-item
            @on-click=${(e) => action(e.type)({ ...e, detail: e.detail })}
            >Option A</kyn-overflow-menu-item
          >
          <kyn-overflow-menu-item
            @on-click=${(e) => action(e.type)({ ...e, detail: e.detail })}
            >Option B</kyn-overflow-menu-item
          >
          <kyn-overflow-menu-item
            destructive
            description="Destructive"
            @on-click=${(e) => action(e.type)({ ...e, detail: e.detail })}
            >Option C</kyn-overflow-menu-item
          >
        </div>
      </kyn-overflow-menu-item>
    </kyn-overflow-menu>
  `,
};
NestedWidthEqualMainWidth.storyName = 'Nested Width = Main Width';

export const SeparateWidths = {
  args: { ...args, width: '200px', nestedWidth: '150px' },
  render: (args) => html`
    <kyn-overflow-menu
      @on-click=${(e) => action('on-click')({ ...e, detail: e.detail })}
      ?open=${args.open}
      ?anchorRight=${args.anchorRight}
      ?verticalDots=${args.verticalDots}
      kind=${args.kind}
      ?fixed=${args.fixed}
      assistiveText=${args.assistiveText}
      .backButtonText=${args.backButtonText}
      width=${args.width}
      .textStrings=${args.textStrings}
      nestedWidth=${args.nestedWidth}
    >
      <kyn-overflow-menu-item>Option 1</kyn-overflow-menu-item>

      <kyn-overflow-menu-item>
        Nested Option
        <div slot="submenu">
          <kyn-overflow-menu-item
            @on-click=${(e) => action(e.type)({ ...e, detail: e.detail })}
            >Nested Option 1</kyn-overflow-menu-item
          >
          <kyn-overflow-menu-item
            @on-click=${(e) => action(e.type)({ ...e, detail: e.detail })}
            >Nested Option 2</kyn-overflow-menu-item
          >
          <kyn-overflow-menu-item
            destructive
            description="Destructive"
            @on-click=${(e) => action(e.type)({ ...e, detail: e.detail })}
            >Nested Option 3</kyn-overflow-menu-item
          >
        </div>
      </kyn-overflow-menu-item>
    </kyn-overflow-menu>
  `,
};
SeparateWidths.storyName = 'Nested Width ≠ Main Width';

export const TwoNestedMenus = {
  args: { ...args },
  render: (args) => html`
    <kyn-overflow-menu
      @on-click=${(e) => action('on-click')({ ...e, detail: e.detail })}
      ?open=${args.open}
      ?anchorRight=${args.anchorRight}
      ?verticalDots=${args.verticalDots}
      kind=${args.kind}
      ?fixed=${args.fixed}
      assistiveText=${args.assistiveText}
      .backButtonText=${args.backButtonText}
      width=${args.width}
      .textStrings=${args.textStrings}
      nestedWidth=${args.nestedWidth}
    >
      <kyn-overflow-menu-item>Option 1</kyn-overflow-menu-item>

      <kyn-overflow-menu-item>
        Outer Submenu
        <div slot="submenu">
          <kyn-overflow-menu-item
            @on-click=${(e) => action(e.type)({ ...e, detail: e.detail })}
            >Sub Outer 1</kyn-overflow-menu-item
          >

          <kyn-overflow-menu-item>
            Inner Submenu Trigger
            <div slot="submenu">
              <kyn-overflow-menu-item
                @on-click=${(e) => action(e.type)({ ...e, detail: e.detail })}
                >Inner A</kyn-overflow-menu-item
              >
              <kyn-overflow-menu-item
                @on-click=${(e) => action(e.type)({ ...e, detail: e.detail })}
                >Inner B</kyn-overflow-menu-item
              >
            </div>
          </kyn-overflow-menu-item>

          <kyn-overflow-menu-item
            @on-click=${(e) => action(e.type)({ ...e, detail: e.detail })}
            >Sub Outer 2</kyn-overflow-menu-item
          >
        </div>
      </kyn-overflow-menu-item>

      <kyn-overflow-menu-item>Option 2</kyn-overflow-menu-item>
    </kyn-overflow-menu>
  `,
};
TwoNestedMenus.storyName = 'Multiple Nested Overflow Menus';
