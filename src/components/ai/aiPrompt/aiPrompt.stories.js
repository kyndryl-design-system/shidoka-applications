import { html } from 'lit';
import './index';
import { action } from '@storybook/addon-actions';

export default {
  title: 'AI/Components/AI Prompt',
  component: 'kyn-ai-prompt',
  argTypes: {
    target: {
      options: ['_self', '_blank', '_top', '_parent'],
      control: { type: 'select' },
    },
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/qyPEUQckxj8LUgesi1OEES/Component-Library-2.0?node-id=29524-32505&m=dev',
    },
  },
};

const baseArgs = {
  href: '',
  rel: '',
  target: '_self',
  hideBorder: false,
  title: 'AI Prompt Title',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex commodo consequat.',
};

const Template = (args) => html`
  <kyn-ai-prompt
    href=${args.href}
    target=${args.target}
    rel=${args.rel}
    ?highlight=${args.highlight}
    @on-click=${(e) => action(e.type)(e)}
  >
    <div slot="title">${args.title}</div>
    <div slot="description">${args.description}</div>
  </kyn-ai-prompt>
`;

export const Default = {
  args: { ...baseArgs, highlight: false },
  render: Template,
};

export const Highlighted = {
  args: { ...baseArgs, highlight: true, title: 'Highlighted AI Prompt Title' },
  render: Template,
};

export const Groups = {
  args: baseArgs,
  render: (args) => html`
    <div>
      <div class="heading kd-type--headline-07" style="margin: 30px 0;">
        Horizontal Container
      </div>
      <kyn-ai-prompts-container orientation="horizontal" maxWidth="1275px">
        <kyn-ai-prompt
          href=${args.href}
          target=${args.target}
          rel=${args.rel}
          @on-click=${(e) => action(e.type)(e)}
          width="31.3%"
        >
          <div slot="title">${args.title}</div>
          <div slot="description">${args.description}</div>
        </kyn-ai-prompt>
        <kyn-ai-prompt
          href=${args.href}
          target=${args.target}
          rel=${args.rel}
          highlight
          @on-click=${(e) => action(e.type)(e)}
          width="31.3%"
        >
          <div slot="title">${args.title}</div>
          <div slot="description">${args.description}</div>
        </kyn-ai-prompt>
        <kyn-ai-prompt
          href=${args.href}
          target=${args.target}
          rel=${args.rel}
          @on-click=${(e) => action(e.type)(e)}
          width="31.3%"
        >
          <div slot="title">${args.title}</div>
          <div slot="description">${args.description}</div>
        </kyn-ai-prompt>
      </kyn-ai-prompts-container>

      <div class="heading kd-type--headline-07" style="margin: 30px 0;">
        Vertical Container
      </div>
      <kyn-ai-prompts-container orientation="vertical" maxWidth="400px">
        <kyn-ai-prompt
          href=${args.href}
          target=${args.target}
          rel=${args.rel}
          highlight
          @on-click=${(e) => action(e.type)(e)}
        >
          <div slot="title">${args.title}</div>
          <div slot="description">${args.description}</div>
        </kyn-ai-prompt>
        <kyn-ai-prompt
          href=${args.href}
          target=${args.target}
          rel=${args.rel}
          @on-click=${(e) => action(e.type)(e)}
        >
          <div slot="title">${args.title}</div>
          <div slot="description">${args.description}</div>
        </kyn-ai-prompt>
        <kyn-ai-prompt
          href=${args.href}
          target=${args.target}
          rel=${args.rel}
          @on-click=${(e) => action(e.type)(e)}
        >
          <div slot="title">${args.title}</div>
          <div slot="description">${args.description}</div>
        </kyn-ai-prompt>
      </kyn-ai-prompts-container>
    </div>
  `,
};
