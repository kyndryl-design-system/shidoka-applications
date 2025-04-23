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
  iconTitle: 'Icon title',
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
        iconTitle=${args.iconTitle}
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
        <span
          style="display: flex;"
          aria-labelledby="User icon"
          aria-hidden="true"
          >${unsafeSVG(userIcon)}</span
        >
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
    noTruncation: {
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
        iconTitle=${args.iconTitle}
      >
      </kyn-badge>
    `;
  },
};
BadgeWithIconOnly.storyName = 'Badge with icon only - Preset';

export const BadgeWithCustomIconOnly = {
  args: {
    ...args,
    label: '',
    status: 'others',
  },
  argTypes: {
    label: {
      control: false,
    },
    noTruncation: {
      control: false,
    },
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
        type=${args.type}
        status=${args.status}
      >
        <span
          style="display: flex;"
          aria-labelledby="User icon"
          aria-hidden="true"
        >
          ${unsafeSVG(userIcon)}
        </span>
      </kyn-badge>
    `;
  },
};
BadgeWithCustomIconOnly.storyName = 'Badge with icon only - Custom';
