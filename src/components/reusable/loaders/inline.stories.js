import { html } from 'lit';
import './index';
import { action } from 'storybook/actions';

export default {
  title: 'Components/Loaders/Loader Inline',
  component: 'kyn-loader-inline',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/9Q2XfTSxfzTXfNe2Bi8KDS/Component-Viewer?node-id=1-546569&p=f&m=dev',
    },
  },
  argTypes: {
    status: {
      options: ['active', 'inactive', 'success', 'error', 'ai-active'],
      control: { type: 'select' },
    },
  },
};

export const Inline = {
  args: {
    status: 'active',
    unnamed: 'Loading...',
  },
  render: (args) => {
    return html`
      <kyn-loader-inline
        status=${args.status}
        @on-start=${(e) => action(e.type)({ ...e, detail: e.detail })}
        @on-stop=${(e) => action(e.type)({ ...e, detail: e.detail })}
      >
        ${args.unnamed}
      </kyn-loader-inline>
    `;
  },
};
