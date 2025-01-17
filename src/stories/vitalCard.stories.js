import { html } from 'lit';
import '@kyndryl-design-system/shidoka-foundation/css/grid.css';
import '../components/reusable/card';

import './sampleCardComponents/vitalCard.sample.ts';

export default {
  title: 'Patterns/Vital Card',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/CQuDZEeLiuGiALvCWjAKlu/Applications---Component-Library?type=design&node-id=9941-18758&mode=design&t=N5Lw7kAKTAjoCa0x-0',
    },
  },
};

const args = {
  type: 'normal',
  href: '',
  rel: '',
  target: '_self',
  hideBorder: false,
};

export const Default = {
  render: () => {
    return html`<kyn-card type="normal">
      <vital-card-sample-component></vital-card-sample-component>
    </kyn-card>`;
  },
};

export const VitalCardSkeleton = {
  args: { ...args, lines: 1, thumbnailVisible: true },
  render: (args) => {
    return html` <kyn-card
      type=${args.type}
      href=${args.href}
      target=${args.target}
      rel=${args.rel}
      ?hideBorder=${args.hideBorder}
    >
      <kyn-vital-card-skeleton .lines=${args.lines}></kyn-vital-card-skeleton>
    </kyn-card>`;
  },
};
