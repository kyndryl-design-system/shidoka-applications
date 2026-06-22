import { html } from 'lit';
import './index';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';

import '../button';
import warningImg from '@kyndryl-design-system/shidoka-foundation/assets/svg/mascot/warning.svg';

export default {
  title: 'Components/Feedback & Status/Error Block',
  component: 'kyn-error',
  parameters: {
    docs: {
      description: {
        component:
          '**Deprecated.** Use the [State Pattern](/docs/components-feedback-status-state-pattern--docs) (`kyn-state-indicator`) instead. This component remains available for existing consumers.',
      },
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
