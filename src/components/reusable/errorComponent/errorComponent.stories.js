import { html } from 'lit';
import './index';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

import '@kyndryl-design-system/shidoka-foundation/components/button';
import alertImg from './redfords/Alert_Redford.svg';
import notFoundImg from './redfords/NotFound_Redford.svg';
import stopImg from './redfords/Stop_Redford.svg';
import timeoutImg from './redfords/Timeout_Redford.svg';

export default {
  title: 'Components/Error Component',
  component: 'kyn-error-component',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/CQuDZEeLiuGiALvCWjAKlu/Applications---Component-Library?node-id=17386-106044&node-type=canvas&t=VYrUi3e41lGwsAHM-0',
    },
  },
};

const args = {
  titleText: 'Error Title',
  primaryButtonText: 'Primary Action',
  secondaryButtonText: 'Secondary Action',
};

export const ErrorComponent = {
  args,
  render: (args) => {
    return html`
      <kyn-error-component titleText=${args.titleText} primaryButtonText=${args.primaryButtonText} secondaryButtonText=${args.secondaryButtonText}>
        <!-- <div slot="image">${unsafeHTML(alertImg)}</div> -->
        <!-- <div slot="image">${unsafeHTML(notFoundImg)}</div> -->
        <!-- <div slot="image">${unsafeHTML(stopImg)}</div> -->
        <div slot="image">${unsafeHTML(timeoutImg)}</div>
        <p slot="description">
          Your description for the error message goes here.
        </p>
        <!-- <kd-button
          slot="actions"
          size="medium"
          kind="primary-app"
          description="Primary action"
        >
          Primary Action
        </kd-button>
        <kd-button
          slot="actions"
          size="medium"
          kind="secondary"
          description="Secondary action"
        >
          Secondary Action
        </kd-button> -->
      </kyn-error-component>
    `;
  },
};
