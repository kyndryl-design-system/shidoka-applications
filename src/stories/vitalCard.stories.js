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

const args = {
  type: 'normal',
  href: '',
  rel: '',
  target: '_self',
  hideBorder: false,
};

const parameters = {
  docs: {
    source: {
      code: `
      // For guidance on how to construct this code, please refer to the 'vitalCard.sample.ts' file.
      // You can find it at the following path:
      // https://github.com/kyndryl-design-system/shidoka-applications/blob/main/src/stories/sampleCardComponents/vitalCard.sample.ts
      `,
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
  parameters,
};

export const WithTitleTooltip = {
  render: () => {
    return html` <kyn-card type="normal">
      <vital-card-sample-component
        ?showtooltip=${true}
      ></vital-card-sample-component>
    </kyn-card>`;
  },
  parameters,
};

export const WithSkeleton = {
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
