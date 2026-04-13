import { html } from 'lit';
import '../components/reusable/card';

import './sampleCardComponents/vitalCard.sample.js';

export default {
  title: 'Patterns/Vital Card',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/9Q2XfTSxfzTXfNe2Bi8KDS/Component-Viewer?node-id=7-297686&p=f&m=dev',
    },
  },
};

export const Default = {
  render: () => {
    return html`
      <kyn-card type="normal">
        <vital-card-sample-component></vital-card-sample-component>
      </kyn-card>
    `;
  },
};

export const VitalCardWithTitleTooltip = {
  render: () => {
    return html` <kyn-card type="normal">
      <vital-card-sample-component
        ?showtooltip=${true}
      ></vital-card-sample-component>
    </kyn-card>`;
  },
};

export const VitalCardSkeleton = {
  args: { lines: 1 },
  render: (args) => {
    return html` <kyn-card type="normal">
      <kyn-vital-card-skeleton .lines=${args.lines}></kyn-vital-card-skeleton>
    </kyn-card>`;
  },
};
