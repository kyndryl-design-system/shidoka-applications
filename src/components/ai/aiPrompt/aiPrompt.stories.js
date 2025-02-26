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
    promptOrientation: 'horizontal',
  },
  render: (args) => html`
    <div>
      <div>
        <div class="heading kd-type--headline-08">Single Select Group</div>
        <p style="margin: 5px 0 20px;">
          Only one prompt can be selected at a time.
        </p>
        <kyn-ai-prompt-group promptOrientation=${args.promptOrientation}>
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
        </kyn-ai-prompt-group>
      </div>

      <div>
        <div class="heading kd-type--headline-08" style="margin-top: 30px;">
          Multi-select Group
        </div>
        <p style="margin: 5px 0 20px;">Multiple prompts can be selected.</p>
        <kyn-ai-prompt-group
          promptOrientation="vertical"
          multipleSelect
          style="max-width: 400px;"
        >
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
        </kyn-ai-prompt-group>
      </div>
    </div>
  `,
};
