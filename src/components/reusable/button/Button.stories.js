import { withDesign } from 'storybook-addon-designs';
import { html } from 'lit';
import '../../reusable/button/button';
import '../../reusable/icon/icon';
import arrowRightIcon from '@carbon/icons/es/arrow--right/16';

export default {
  title: 'Reusable/Button (WIP)',
  component: 'kyn-button',
  decorators: [withDesign],
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

Button.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/PDrJbUpubptqYdtRxih328/Kyndryl-Bridge-Styleguide?node-id=438%3A4403&t=iNPRmUaTDCaP8axD-0',
  },
};
