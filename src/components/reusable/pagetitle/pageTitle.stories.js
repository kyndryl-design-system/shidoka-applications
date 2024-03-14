import { html } from 'lit';
import './index';
import cloudDownloadIcon from '@carbon/icons/es/cloud--download/32';
import '@kyndryl-design-system/shidoka-foundation/components/icon';

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
      <kyn-page-title
        type=${args.type}
        headLine=${args.headLine}
        pageTitle=${args.pageTitle}
        subTitle=${args.subTitle}
      >
        <!-- Note: use icon size 56 * 56 for Page title as per UX guidelines -->
        <kd-icon
          slot="icon"
          .icon=${cloudDownloadIcon}
          sizeOverride="56"
        ></kd-icon>
      </kyn-page-title>
    `;
  },
};
