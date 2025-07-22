import { html } from 'lit';
import './index';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import warningImg from '@kyndryl-design-system/shidoka-foundation/assets/svg/mascot/warning.svg';

import '../button';

export default {
  title: 'Components/Empty State',
  component: 'kyn-empty-state',
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
};

const args = {
  titleText: '',
};

export const ErrorBlock = {
  args,
  render: (args) => {
    return html`
      <kyn-empty-state titleText=${args.titleText}>
        <div slot="image">${unsafeSVG(warningImg)}</div>
        <p>Your description for the error message goes here.</p>
        <kyn-button slot="actions" size="medium" description="Primary action">
          Primary action
        </kyn-button>
        <kyn-button
          slot="actions"
          size="medium"
          kind="secondary"
          description="Secondary action"
        >
          Secondary action
        </kyn-button>
      </kyn-empty-state>
    `;
  },
};
