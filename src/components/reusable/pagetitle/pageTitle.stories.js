import { html } from 'lit';
import './index';
import cloudDownloadIcon from '@carbon/icons/es/cloud--download/32';

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
      url: 'https://www.figma.com/file/pQKkip0UrZqEbaGN2dQ3dY/Istanbul-Release?type=design&node-id=1345-63879&mode=design&t=yhPVQlRVw0TwFfLz-0',
    },
  },
};

const args = {
  type: 'primary',
  headLine: 'Headline',
  title: 'Page Title',
  subTitle: 'Subtitle',
  showheadLine: false,
  showSubTitle: false,
  showIcon: false,
  icon: cloudDownloadIcon,
};

export const PageTitle = {
  args,
  render: (args) => {
    return html`
      <kyn-page-title
        type=${args.type}
        headLine=${args.headLine}
        title=${args.title}
        subTitle=${args.subTitle}
        .icon=${args.icon}
        ?showheadLine=${args.showheadLine}
        ?showSubTitle=${args.showSubTitle}
        ?showIcon=${args.showIcon}
      ></kyn-page-title>
    `;
  },
};
