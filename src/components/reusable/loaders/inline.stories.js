import { html } from 'lit';
import './index';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Components/Loaders/Loader Inline',
  component: 'kyn-loader-inline',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/CQuDZEeLiuGiALvCWjAKlu/branch/qMpff4GuFUEcsMUkvacS3U/Applications---Component-Library?node-id=15313-10436&node-type=canvas&t=cy38tiFaz5uZuLBW-0',
    },
  },
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
        @on-start=${(e) => action(e.type)(e)}
        @on-stop=${(e) => action(e.type)(e)}
      >
        ${args.unnamed}
      </kyn-loader-inline>
    `;
  },
};
