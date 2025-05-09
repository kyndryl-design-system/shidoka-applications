import { html } from 'lit';
import './index';
import '../../reusable/link';

export default {
  title: 'Global Components/Footer',
  component: 'kyn-footer',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/9Q2XfTSxfzTXfNe2Bi8KDS/Component-Viewer?node-id=7-15300&p=f&m=dev',
    },
  },
  decorators: [
    (story) =>
      html`
        <div style="min-height: 100px;">
          <div
            style="position: absolute; right: var(--kd-page-gutter); bottom: var(--kd-page-gutter); left: var(--kd-page-gutter); margin: var(--kd-negative-page-gutter);"
          >
            ${story()}
          </div>
        </div>
      `,
  ],
};

export const Footer = {
  args: {
    rootUrl: '/',
    logoAriaLabel: 'Go to Homepage',
  },
  render: (args) => html`
    <kyn-footer rootUrl=${args.rootUrl} logoAriaLabel=${args.logoAriaLabel}>
      <kyn-link href="javascript:void(0);" standalone="">Link 1</kyn-link>
      <kyn-link href="javascript:void(0);" standalone="">Link 2</kyn-link>
      <kyn-link href="javascript:void(0);" standalone="">Link 3</kyn-link>
      <kyn-link href="javascript:void(0);" standalone="">Link 4</kyn-link>

      <span slot="copyright">
        Copyright &copy; ${new Date().getFullYear()} Kyndryl Inc. All rights
        reserved.
      </span>
    </kyn-footer>
  `,
};
