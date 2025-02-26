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

export const Default = {
  args: {
    href: '',
    rel: '',
    target: '_self',
    hideBorder: false,
    highlight: false,
    title: 'AI Prompt Title',
    description:
      'Help me find previous case studies or success stories involving industry or similar clients for   business problem or using Kyndryl service',
  },
  render: (args) => html`
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
  `,
};

export const Highlighted = {
  args: {
    type: 'normal',
    href: '',
    rel: '',
    target: '_self',
    hideBorder: false,
    highlight: true,
    title: 'Highlighted AI Prompt Title',
    description:
      'Help me find previous case studies or success stories involving industry or similar clients for   business problem or using Kyndryl service',
  },
  render: (args) => html`
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
  `,
};

export const Groups = {
  args: {
    href: '',
    rel: '',
    target: '_self',
    highlight: false,
    title: 'AI Prompt Title',
    description:
      'Help me find previous case studies or success stories involving industry or similar clients for business problem or using Kyndryl service',
    orientation: 'horizontal',
    maxWidth: undefined,
  },
  render: (args) => html`
    <div>
      <div>
        <div class="heading kd-type--headline-08" style="margin: 30px 0;">
          Horizontal Container
        </div>
        <div>
          <kyn-ai-prompts-container
            orientation=${args.orientation}
            maxWidth="1275px"
          >
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
        </div>
      </div>

      <div>
        <div class="heading kd-type--headline-08" style="margin: 30px 0;">
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
    </div>
  `,
};
