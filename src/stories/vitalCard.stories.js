import { html } from 'lit';
import '@kyndryl-design-system/shidoka-foundation/css/grid.css';
import '@kyndryl-design-system/shidoka-foundation/components/card';

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

export const Default = {
  render: () => {
    return html`<kd-card type="normal" href="" target="" rel="">
      <vital-card-sample-component></vital-card-sample-component>
    </kd-card>`;
  },
};
