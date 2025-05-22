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
      options: [
        'success',
        'error',
        'warning',
        'information',
        'critical',
        'others',
      ],
      control: { type: 'select' },
    },
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/9Q2XfTSxfzTXfNe2Bi8KDS/Component-Viewer?node-id=740-35405&p=f&t=A5tcETiCf23sAgKK-0',
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
  hideIcon: false,
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
        ?hideIcon=${args.hideIcon}
        >${args.status === 'others'
          ? html`<span
              style="display: flex;"
              aria-labelledby="User icon"
              aria-hidden="true"
              >${unsafeSVG(userIcon)}</span
            >`
          : null}</kyn-badge
      >
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
    hideIcon: {
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
        ?noTruncation=${args.noTruncation}
        iconTitle=${args.iconTitle}
        >${args.status === 'others'
          ? html`<span
              style="display: flex;"
              aria-labelledby="User icon"
              aria-hidden="true"
              >${unsafeSVG(userIcon)}</span
            >`
          : null}</kyn-badge
      >
    `;
  },
};
