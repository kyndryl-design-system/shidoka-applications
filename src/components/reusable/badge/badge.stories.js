import { html } from 'lit';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import userIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/user.svg';
import './index';

export default {
  title: 'Components/Badge',
  component: 'kyn-badge',
  argTypes: {
    size: {
      options: ['sm', 'md'],
      control: { type: 'select' },
    },
    type: {
      options: ['heavy', 'medium', 'light'],
      control: { type: 'select' },
    },
    status: {
      options: ['success', 'error', 'warning', 'information', 'critical'],
      control: { type: 'select' },
    },
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/rC5XdRnXVbDmu3vPN8tJ4q/2.1-Edinburgh?node-id=5198-3197&t=wYJ65omfGf5LC5w7-0',
    },
  },
};

const args = {
  label: 'Badge example',
  size: 'md',
  type: 'medium',
  status: 'success',
  noTruncation: false,
};

export const Badge = {
  args,
  render: (args) => {
    return html`
      <kyn-badge
        label=${args.label}
        size=${args.size}
        type=${args.type}
        status=${args.status}
        ?noTruncation=${args.noTruncation}
      ></kyn-badge>
    `;
  },
};

export const BadgeWithCustomIcon = {
  args: {
    ...args,
    label: 'Badge with custom icon',
    status: 'others',
  },
  argTypes: {
    status: {
      options: ['others'],
      control: { type: 'select' },
    },
  },
  render: (args) => {
    return html`
      <kyn-badge
        label=${args.label}
        size=${args.size}
        status=${args.status}
        type=${args.type}
        ?noTruncation=${args.noTruncation}
      >
        <span>${unsafeSVG(userIcon)}</span>
      </kyn-badge>
    `;
  },
};

export const BadgeWithIconOnly = {
  args: {
    ...args,
    label: '',
  },
  argTypes: {
    label: {
      control: false,
    },
  },
  render: (args) => {
    return html`
      <kyn-badge
        label=${args.label}
        size=${args.size}
        type=${args.type}
        status=${args.status}
      >
        <span>${unsafeSVG(userIcon)}</span>
      </kyn-badge>
    `;
  },
};
