import { html } from 'lit';
import './index';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';

import '../button';
import warningImg from '@kyndryl-design-system/shidoka-foundation/assets/svg/mascot/warning.svg';

export default {
  title: 'Components/Error Block',
  component: 'kyn-error',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/9Q2XfTSxfzTXfNe2Bi8KDS/Component-Viewer?node-id=7-7561&p=f&m=dev',
    },
  },
};

const args = {
  titleText: 'Error title',
};

export const ErrorBlock = {
  args,
  render: (args) => {
    return html`
      <kyn-error-block titleText=${args.titleText}>
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
      </kyn-error-block>
    `;
  },
};
