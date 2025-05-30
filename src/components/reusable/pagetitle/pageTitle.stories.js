import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { html } from 'lit';
import './index';
import cloudDownloadIcon from '@kyndryl-design-system/shidoka-icons/svg/duotone/48/cloud-download.svg';

export default {
  title: 'Components/Page Title',
  component: 'kyn-page-title',
  argTypes: {
    type: {
      options: ['primary', 'secondary', 'tertiary'],
      control: { type: 'select' },
    },
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/9Q2XfTSxfzTXfNe2Bi8KDS/Component-Viewer?node-id=1-552144&p=f&m=dev',
    },
  },
};

const args = {
  type: 'primary',
  headLine: '',
  pageTitle: 'Page Title',
  subTitle: '',
  aiConnected: false,
};

export const PageTitle = {
  args,
  render: (args) => {
    return html`
      <kyn-page-title
        type=${args.type}
        headLine=${args.headLine}
        pageTitle=${args.pageTitle}
        subTitle=${args.subTitle}
        ?aiConnected=${args.aiConnected}
      >
      </kyn-page-title>
    `;
  },
};

export const WithIcon = {
  args,
  render: (args) => {
    return html`
      <style>
        .cloud-icon {
          display: flex;
          svg {
            width: 56px;
            height: 56px;
          }
        }
      </style>
      <kyn-page-title
        type=${args.type}
        headLine=${args.headLine}
        pageTitle=${args.pageTitle}
        subTitle=${args.subTitle}
        ?aiConnected=${args.aiConnected}
      >
        <!-- Note: use icon size 56 * 56 for Page title as per UX guidelines -->
        <span slot="icon" class="cloud-icon"
          >${unsafeSVG(cloudDownloadIcon)}</span
        >
      </kyn-page-title>
    `;
  },
};

export const AIConnected = {
  args: { ...args, aiConnected: true },
  render: (args) => {
    return html`
      <kyn-page-title
        type=${args.type}
        headLine=${args.headLine}
        pageTitle=${args.pageTitle}
        subTitle=${args.subTitle}
        ?aiConnected=${args.aiConnected}
      >
      </kyn-page-title>
    `;
  },
};
