import { html } from 'lit';
import './index';
import { action } from '@storybook/addon-actions';
import thumbnailImg from './card-thumbnail.png';
import logoImg from './placeholder-logo.png';
import '../tag';

export default {
  title: 'Components/Card',
  component: 'kyn-card',
  argTypes: {
    imagePosition: {
      options: ['top', 'middle'],
      control: { type: 'select' },
    },
    // options: {
    //   options: ['overflowMenu', 'multiSelect', 'singleSelect'],
    //   control: { type: 'select' },
    // },
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
  {
    value: '5',
    text: 'Tag 5',
  },
  {
    value: '6',
    text: 'Tag 6',
  },
];

// single tile select logic
const handleTileSelected = (event) => {
  const selectedTile = event.detail;
  const tiles = document.querySelectorAll('kyn-card');
  tiles.forEach((tile) => {
    if (tile !== selectedTile) {
      tile.selected = false;
    }
  });
  action(event.type)(event);
};

// multiselect tile logic
// let selectedTiles = [];

// const handleTileSelected = (event) => {
//   const { selected } = event.detail;
//   if (selected) {
//     selectedTiles.push(event.target);
//   } else {
//     selectedTiles = selectedTiles.filter((tile) => tile !== event.target);
//   }
//   console.log(
//     'Selected Tiles:',
//     selectedTiles.map((tile) => tile.title)
//   );
//   action(event.type)(event);
// };

export const Card = {
  args: {
    showLogo: false,
    showTags: false,
    // showOptions: false,
    imagePosition: 'top',
    thumbnailSrc: thumbnailImg,
    productLogo: logoImg,
    cardTitle: 'This is a card title with a maximum sentence limit of 2 lines',
    subTitle: 'Subtitle',
    description:
      'Amazon EC2 Auto Scaling ensures that your application always has the right amount of compute lorem ipsum dummy text ilposin fogthi jkiuy',
    iconLink: '#',
    // options: 'overflowMenu',
  },
  render: (args) => {
    return html`
      <kyn-card
        ?showLogo=${args.showLogo}
        ?showTags=${args.showTags}
        imagePosition=${args.imagePosition}
        thumbnailSrc=${args.thumbnailSrc}
        productLogo=${args.productLogo}
        cardTitle=${args.cardTitle}
        subTitle=${args.subTitle}
        description=${args.description}
        iconLink=${args.iconLink}
        @tile-selected="${handleTileSelected}"
      >
        ${args.showTags
          ? html` <kyn-tag-group slot="tags" limitTags>
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
            </kyn-tag-group>`
          : null}
      </kyn-card>

      <!-- <kyn-card
        ?showLogo=${args.showLogo}
        ?showTags=${args.showTags}
        imagePosition=${args.imagePosition}
        thumbnailSrc=${args.thumbnailSrc}
        productLogo=${args.productLogo}
        cardTitle=${args.cardTitle}
        subTitle=${args.subTitle}
        description=${args.description}
        iconLink=${args.iconLink}
        @tile-selected="${handleTileSelected}"
      >
        ${args.showTags
        ? html` <kyn-tag-group slot="tags" limitTags>
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
          </kyn-tag-group>`
        : null}
      </kyn-card> -->
    `;
  },
};
