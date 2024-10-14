import { html } from 'lit';
import './index';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';

import '@kyndryl-design-system/shidoka-foundation/components/button';
import alertImg from '../../../common/assets/redfords/Alert_Redford.svg';
import notFoundImg from '../../../common/assets/redfords/NotFound_Redford.svg';
import stopImg from '../../../common/assets/redfords/Stop_Redford.svg';
import timeoutImg from '../../../common/assets/redfords/Timeout_Redford.svg';

export default {
  title: 'Components/Error Block',
  component: 'kyn-error',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/CQuDZEeLiuGiALvCWjAKlu/Applications---Component-Library?node-id=17386-106044&node-type=canvas&t=VYrUi3e41lGwsAHM-0',
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
        <!-- <div slot="image">${unsafeSVG(alertImg)}</div> -->
        <!-- <div slot="image">${unsafeSVG(notFoundImg)}</div> -->
        <!-- <div slot="image">${unsafeSVG(stopImg)}</div> -->
        <div slot="image">${unsafeSVG(timeoutImg)}</div>
        <p>Your description for the error message goes here.</p>
        <kd-button
          slot="actions"
          size="medium"
          kind="primary-app"
          description="Primary action"
        >
          Primary action
        </kd-button>
        <kd-button
          slot="actions"
          size="medium"
          kind="secondary"
          description="Secondary action"
        >
          Secondary action
        </kd-button>
      </kyn-error-block>
    `;
  },
};
