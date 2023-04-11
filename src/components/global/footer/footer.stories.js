import { withDesign } from 'storybook-addon-designs';
import { html } from 'lit';
import './index';

export default {
  title: 'Global/Footer',
  component: 'kyn-footer',
  subcomponents: {
    FooterNav: 'kyn-footer-nav',
    FooterNavLink: 'kyn-footer-link',
  },
  decorators: [
    withDesign,
    (story) =>
      html`
        <div style="position: absolute; bottom: 0; left: 0; right: 0;">
          ${story()}
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
    </kyn-footer>
  `,
};

Footer.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/zGyRSDM6stIrSjC3TOyGGQ/719820--Kyndryl-Bridge-Navigation-Patterns?node-id=1921%3A5110&t=l4gSUzqO6Vbo3YOX-1',
  },
};
