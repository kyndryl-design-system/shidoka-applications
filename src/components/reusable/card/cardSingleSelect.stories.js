import { html } from 'lit';
import './index';
import { action } from '@storybook/addon-actions';
import thumbnailImg from './card-thumbnail.png';
import logoImg from './placeholder-logo.png';

export default {
  title: 'Components/Card',
  component: 'kyn-card-single-select',
  argTypes: {
    type: {
      options: ['single', 'multiple'],
      control: { type: 'select' },
    },
  },
  subcomponents: {
    Card: 'kyn-card',
  },
};

export const CardSingleSelect = {
  args: {
    value: '',
    thumbnailSrc: thumbnailImg,
    productLogo: logoImg,
    type: 'single',
  },
  render: (args) => {
    return html`
      <kyn-card-single-select
        value=${args.value}
        type=${args.type}
        @on-card-group-change=${(e) => action(e.type)(e)}
      >
        <kyn-card
          value="1"
          showLogo
          showOptions
          imagePosition="top"
          thumbnailSrc=${args.thumbnailSrc}
          productLogo=${args.productLogo}
          cardTitle="Card 1"
          subTitle="Card subtitle 1"
          description="Card 1 description of dummy card container and this is limit upto 3 lines"
          iconLink="#"
          optionType=${args.type === 'single' ? 'singleSelect' : 'multiSelect'}
        >
        </kyn-card>
        <div style="display:inline-block; visibility: hidden;width:20px;"></div>
        <kyn-card
          value="2"
          showLogo
          showOptions
          imagePosition="top"
          thumbnailSrc=${args.thumbnailSrc}
          productLogo=${args.productLogo}
          cardTitle="Card 2"
          subTitle="Card subtitle 2"
          description="Card 2 description of dummy card container and this is limit upto 3 lines"
          iconLink="#"
          optionType=${args.type === 'single' ? 'singleSelect' : 'multiSelect'}
        >
        </kyn-card>
      </kyn-card-single-select>
    `;
  },
};
