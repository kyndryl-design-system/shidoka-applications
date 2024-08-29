import { html } from 'lit';
import './index';

export default {
  title: 'Components/CardItem',
  component: 'kyn-card-item',
  argTypes: {
    theme: {
      options: ['simple', 'vertical', 'horizontal', 'page'],
      control: { type: 'select' },
    },
  },
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
};

const args = {
  theme: 'page',
  cardTitle: 'Card Item',
  cardSubheader: 'Main Header',
  cardImgSrc:
    'https://fastly.picsum.photos/id/163/32/32.jpg?hmac=6Ev67xrdofIgcyzhr8G7E_OCYUUziK4DoqoH3XZ4I08',
  body: 'This is some card body text. You can put anything you want here.',
  cardLinkText: 'Test Link >>',
  cardLinkHref: 'https://www.example.com',
};

export const KynCardSimple = {
  args,
  render: (args) => {
    return html`
      <kyn-card-item
        theme="simple"
        cardTitle=${args.cardTitle}
        cardSubheader=${args.cardSubheader}
        cardImgSrc=${args.cardImgSrc}
        cardLinkText=${args.cardLinkText}
        cardLinkHref=${args.cardLinkHref}
      >
        <p>${args.body}</p>
      </kyn-card-item>
    `;
  },
};

export const KynCardPage = {
  args,
  render: (args) => {
    return html`
      <kyn-card-item
        theme="page"
        cardTitle=${args.cardTitle}
        cardSubheader=${args.cardSubheader}
        cardImgSrc=${args.cardImgSrc}
        cardLinkText=${args.cardLinkText}
        cardLinkHref=${args.cardLinkHref}
      >
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec
          purus feugiat, vestibulum mi nec, ultricies metus. Nulla facilisi.
          Nullam auctor, nunc nec lacinia ultricies, nunc turpis fermentum nunc,
          nec varius nunc metus ac nunc. Nulla facilisi. Nullam auctor, nunc nec
          lacinia ultricies, nunc turpis fermentum nunc, nec varius nunc metus
          ac nunc.
        </p>
      </kyn-card-item>
    `;
  },
};

export const KynCardVertical = {
  args,
  render: (args) => {
    return html`
      <kyn-card-item
        theme="vertical"
        cardTitle=${args.cardTitle}
        cardSubheader=${args.cardSubheader}
        cardImgSrc=${args.cardImgSrc}
        cardLinkText=${args.cardLinkText}
        cardLinkHref=${args.cardLinkHref}
      >
        <p>${args.body}</p>
      </kyn-card-item>
    `;
  },
};

export const KynCardHorizontal = {
  args,
  render: (args) => {
    return html`
      <kyn-card-item
        theme="horizontal"
        cardTitle=${args.cardTitle}
        cardSubheader=${args.cardSubheader}
        cardImgSrc=${args.cardImgSrc}
        cardLinkText=${args.cardLinkText}
        cardLinkHref=${args.cardLinkHref}
      >
        <p>${args.body}</p>
      </kyn-card-item>
    `;
  },
};
