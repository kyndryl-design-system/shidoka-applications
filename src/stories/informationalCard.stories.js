import { html } from 'lit';
import '../components/reusable/card';

import './sampleCardComponents/card.sample.js';
import './sampleCardComponents/card.content.sample.js';

export default {
  title: 'Patterns/Informational Card',
  design: {
    type: 'figma',
    url: 'https://www.figma.com/design/9Q2XfTSxfzTXfNe2Bi8KDS/Component-Viewer?node-id=7-133753&p=f&t=A5tcETiCf23sAgKK-0',
  },
};

const args = {
  type: 'normal',
  href: '',
  rel: '',
  target: '_self',
  hideBorder: false,
};

const parametersSimple = {
  docs: {
    source: {
      code: `
      // For guidance on how to construct this code, please refer to the 'card.sample.ts' file.
      // You can find it at the following path:
      // https://github.com/kyndryl-design-system/shidoka-applications/blob/main/src/stories/sampleCardComponents/card.sample.ts
      `,
    },
  },
};

export const Simple = {
  render: () => {
    return html`
      <kyn-card type="normal" href="" target="" rel="">
        <sample-card-story-component>
          <div slot="title">This is a card title</div>
          <div slot="description">
            Amazon EC2 Auto Scaling ensures that your application always has the
            right amount of compute capacity by dynamically adjusting the number
            of Amazon EC2 instances based on demand.
          </div>
        </sample-card-story-component>
      </kyn-card>
    `;
  },
  parameters: parametersSimple,
};

const parametersForOtherContents = {
  docs: {
    source: {
      code: `
      // For guidance on how to construct this code, please refer to the 'card.content.sample.ts' file.
      // You can find it at the following path:
      // https://github.com/kyndryl-design-system/shidoka-applications/blob/main/src/stories/sampleCardComponents/card.content.sample.ts
      `,
    },
  },
};

export const WithOtherContents = {
  render: () => {
    return html`
      <kyn-card type="normal" href="" target="" rel="">
        <sample-card-story-content-component></sample-card-story-content-component>
      </kyn-card>

      <br /><br />
      <a
        href="https://github.com/kyndryl-design-system/shidoka-applications/blob/main/src/stories/sampleCardComponents/card.content.sample.ts"
        target="_blank"
        rel="noopener"
      >
        See the full example component code here.
      </a>
    `;
  },
  parameters: parametersForOtherContents,
};

export const WithSkeleton = {
  args: { ...args, lines: 2, thumbnailVisible: false },
  render: (args) => {
    return html` <kyn-card
      type=${args.type}
      href=${args.href}
      target=${args.target}
      rel=${args.rel}
      ?hideBorder=${args.hideBorder}
    >
      <kyn-info-card-skeleton
        .lines=${args.lines}
        ?thumbnailVisible=${args.thumbnailVisible}
      ></kyn-info-card-skeleton>
    </kyn-card>`;
  },
};

export const WithThumbnailSkeleton = {
  args: { ...args, lines: 2, thumbnailVisible: true },
  render: (args) => {
    return html` <kyn-card
      type=${args.type}
      href=${args.href}
      target=${args.target}
      rel=${args.rel}
      ?hideBorder=${args.hideBorder}
    >
      <kyn-info-card-skeleton
        .lines=${args.lines}
        ?thumbnailVisible=${args.thumbnailVisible}
      ></kyn-info-card-skeleton>
    </kyn-card>`;
  },
};
