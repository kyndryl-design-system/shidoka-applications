import { html } from 'lit';
import './index';

export default {
  title: 'Components/Loader',
  component: 'kyn-loader',
  argTypes: {
    // type: {
    //   options: ['normal', 'inline'],
    //   control: { type: 'select' },
    // },
  },
};

const args = {
  inline: false,
};

export const Default = {
  args,
  render: (args) => {
    return html` <kyn-loader ?inline=${args.inline}></kyn-loader> `;
  },
};
