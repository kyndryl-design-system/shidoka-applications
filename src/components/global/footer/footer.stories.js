import { html } from 'lit';
import './index';
import '@kyndryl-design-system/shidoka-foundation/components/link';

export default {
  title: 'Global Components/Footer',
  component: 'kyn-footer',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/CQuDZEeLiuGiALvCWjAKlu/Applications---Component-Library?node-id=10033-1598&m=dev',
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
  },
  render: (args) => html`
    <kyn-footer rootUrl=${args.rootUrl}>
      <kd-link href="javascript:void(0);">Link 1</kd-link>
      <kd-link href="javascript:void(0);">Link 2</kd-link>
      <kd-link href="javascript:void(0);">Link 3</kd-link>
      <kd-link href="javascript:void(0);">Link 4</kd-link>

      <span slot="copyright">
        Copyright &copy; ${new Date().getFullYear()} Kyndryl Inc. All rights
        reserved.
      </span>
    </kyn-footer>
  `,
};
