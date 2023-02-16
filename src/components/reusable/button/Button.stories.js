import { html } from 'lit';
import '../../reusable/button/button';
import '../../reusable/icon/icon';
import arrowRightIcon from '@carbon/icons/es/arrow--right/16';

export default {
  title: 'Components/Reusable/Button',
  component: 'kyn-button',
  argTypes: {
    kind: {
      control: { type: 'select' },
      options: ['primary', 'secondary'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
  },
};

const args = {
  kind: 'primary',
  size: 'md',
  href: '',
  disabled: false,
};

export const Button = {
  args: args,
  render: (args) => html`
    <kyn-button
      kind=${args.kind}
      href=${args.href}
      size=${args.size}
      ?disabled=${args.disabled}
    >
      Default
    </kyn-button>
  `,
};

export const ButtonWithIcon = {
  args: args,
  render: (args) => html`
    <kyn-button
      kind=${args.kind}
      href=${args.href}
      size=${args.size}
      ?disabled=${args.disabled}
    >
      Button
      <kyn-icon .icon=${arrowRightIcon}></kyn-icon>
    </kyn-button>
  `,
};
