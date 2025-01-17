import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { html } from 'lit';
import './index';
import cloudDownloadIcon from '@kyndryl-design-system/shidoka-icons/svg/duotone/48/cloud-download.svg';

export default {
  title: 'Components/PageTitle',
  component: 'kyn-page-title',
  argTypes: {
    type: {
      options: ['primary', 'secondary'],
      control: { type: 'select' },
    },
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/pQKkip0UrZqEbaGN2dQ3dY/Istanbul-Release?type=design&node-id=352-128746&mode=design&t=UYTWn3Fif4KMP6v3-0',
    },
  },
};

const args = {
  type: 'primary',
  headLine: '',
  pageTitle: 'Page Title',
  subTitle: '',
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
      >
        <!-- Note: use icon size 56 * 56 for Page title as per UX guidelines -->
        <span slot="icon" class="cloud-icon"
          >${unsafeSVG(cloudDownloadIcon)}</span
        >
      </kyn-page-title>
    `;
  },
};
