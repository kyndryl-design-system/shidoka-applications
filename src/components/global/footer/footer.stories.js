import { html } from 'lit';
import './index';

export default {
  title: 'Global Components/Footer',
  component: 'kyn-footer',
  subcomponents: {
    FooterNav: 'kyn-footer-nav',
    FooterNavLink: 'kyn-footer-link',
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
      <kyn-footer-nav>
        <kyn-footer-link href="javascript:void(0);">Link 1</kyn-footer-link>
        <kyn-footer-link href="javascript:void(0);">Link 2</kyn-footer-link>
        <kyn-footer-link href="javascript:void(0);">Link 3</kyn-footer-link>
        <kyn-footer-link href="javascript:void(0);">Link 4</kyn-footer-link>
      </kyn-footer-nav>

      <span slot="copyright">
        Copyright &copy; ${new Date().getFullYear()} Kyndryl Inc. All rights
        reserved.
      </span>
    </kyn-footer>
  `,
};

Footer.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/zGyRSDM6stIrSjC3TOyGGQ/719820--Kyndryl-Bridge-Navigation-Patterns?node-id=1921%3A5110&t=l4gSUzqO6Vbo3YOX-1',
  },
};
