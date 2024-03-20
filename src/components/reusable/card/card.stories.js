import { html } from 'lit';
import './index';
import { action } from '@storybook/addon-actions';
import '@kyndryl-design-system/shidoka-foundation/components/icon';
import actionIcon from '@carbon/icons/es/bookmark/20';
import '@kyndryl-design-system/shidoka-foundation/components/button';

import logoImg from './placeholder-logo.png';
import thumbnailImg from './thumbnail-placeholder.png';
import '../overflowMenu';
import '../tag';

export default {
  title: 'Components/Card',
  component: 'kyn-card',
  argTypes: {
    type: {
      options: ['normal', 'clickable'],
      control: { type: 'select' },
    },
    imagePosition: {
      options: ['top', 'middle'],
      control: { type: 'select' },
    },
  },
};

const tagGroupArr = [
  {
    value: '1',
    text: 'Tag 1',
  },
  {
    value: '2',
    text: 'Tag 2',
  },
  {
    value: '3',
    text: 'Tag 3',
  },
  {
    value: '4',
    text: 'Tag 4',
  },
];

export const Card = {
  args: {
    cardWidth: 264,
    cardTitle: 'This is a card title with a  sentence of 2 lines',
    subTitle: 'This is a subtitle with a sentence of 2 lines.',
    description:
      'Amazon EC2 Auto Scaling ensures that your application always has the right amount of compute capacity by dynamically adjusting the number of Amazon EC2 instances based on demand. Whether it is handling sudden spikes or adjusting to real-time demand, EC2 Auto Scaling adapts seamlessly.',
    type: 'normal',
    showActionBtn: false,
    cardLink: '/',
    imagePosition: 'top',
  },
  render: (args) => {
    return html`
      <kyn-card
        .cardWidth=${args.cardWidth}
        cardTitle=${args.cardTitle}
        subTitle=${args.subTitle}
        description=${args.description}
        type=${args.type}
        ?showActionBtn=${args.showActionBtn}
        .cardLink=${args.cardLink}
        imagePosition=${args.imagePosition}
      >
        <!-- Example : card logo slot -->
        <img slot="card-logo" src="${logoImg}" alt="product logo" />
      </kyn-card>
    `;
  },
};

export const WithSlots = {
  args: Card.args,
  render: (args) => {
    return html`
      <kyn-card
        .cardWidth=${args.cardWidth}
        cardTitle=${args.cardTitle}
        subTitle=${args.subTitle}
        description=${args.description}
        type=${args.type}
        ?showActionBtn=${args.showActionBtn}
        .cardLink=${args.cardLink}
        imagePosition=${args.imagePosition}
      >
        <!-- Example : card logo slot -->
        <img slot="card-logo" src="${logoImg}" alt="product logo" />

        <!-- Example : Card action button -->
        <kd-button
          slot="card-action-button"
          kind="tertiary"
          size="small"
          iconPosition="center"
        >
          <kd-icon slot="icon" .icon=${actionIcon}></kd-icon>
        </kd-button>

        <!-- Example : overflow menu slot -->
        <kyn-overflow-menu
          slot="card-overflow-menu"
          @click=${(e) => e.preventDefault()}
        >
          <kyn-overflow-menu-item>Option 1</kyn-overflow-menu-item>
          <kyn-overflow-menu-item>Option 2</kyn-overflow-menu-item>
        </kyn-overflow-menu>

        <!-- Example : thumbnail image slot -->
        <img slot="card-thumbnail" alt="Card thumbnail" src="${thumbnailImg}" />

        <!-- Example : Tag slot -->
        <kyn-tag-group slot="tags">
          ${tagGroupArr.map(
            (tag) =>
              html`
                <kyn-tag
                  label=${tag.text}
                  tagColor="spruce"
                  @on-close=${(e) => action(e.type)(e)}
                ></kyn-tag>
              `
          )}
        </kyn-tag-group>

        <!-- Example : card links slot -->
        <kd-button slot="card-links" href="/" kind="tertiary" size="small"
          >Link 1</kd-button
        >
        <kd-button slot="card-links" href="/" kind="tertiary" size="small"
          >Link 2</kd-button
        >
      </kyn-card>
    `;
  },
};
