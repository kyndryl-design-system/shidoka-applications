import { html } from 'lit';
import './index';
import { action } from 'storybook/actions';

export default {
  title: 'Components/Feedback & Status/Loaders/Loader Inline',
  component: 'kyn-loader-inline',
  argTypes: {
    status: {
      options: ['active', 'inactive', 'success', 'error'],
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
