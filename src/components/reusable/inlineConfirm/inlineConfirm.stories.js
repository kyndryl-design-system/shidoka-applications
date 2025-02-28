import { html } from 'lit-html';
import { action } from '@storybook/addon-actions';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import './index';
import '../button'; // Import the button component

import deleteIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/24/delete.svg';

export default {
  title: 'Components/Inline Confirm',
  component: 'kyn-inline-confirm',
  decorators: [
    (story) =>
      html`
        <div style="display: flex; justify-content: center;">${story()}</div>
      `,
  ],
};

const Template = (args) => html`
  <kyn-inline-confirm
    .destructive=${args.destructive}
    .anchorText=${args.anchorText}
    .confirmText=${args.confirmText}
    .cancelText=${args.cancelText}
    .openRight=${args.openRight}
    @on-confirm=${(e) => action('on-confirm')()}
  >
    ${unsafeSVG(deleteIcon)}
  </kyn-inline-confirm>
`;

export const Default = Template.bind({});
Default.args = {
  destructive: true,
  anchorText: 'Delete',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  openRight: false,
};
