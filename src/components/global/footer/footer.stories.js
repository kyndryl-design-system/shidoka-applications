import { withDesign } from 'storybook-addon-designs';
import { html } from 'lit';
import './footer';
import '../../reusable/icon/icon';
import './footerNav';
import './footerLink';

export default {
  title: 'Global/Footer',
  component: 'kyn-footer',
  subcomponents: {
    FooterNav: 'kyn-footer-nav',
    FooterNavLink: 'kyn-footer-link',
  },
  decorators: [withDesign],
};

export const Footer = {
  args: {
    rootUrl: '/',
  },
  render: (args) => html`
    <kyn-footer rootUrl=${args.rootUrl}>
      <kyn-footer-nav>
        <kyn-footer-link divider href="//www.kyndryl.com/us/en/privacy">
          Privacy
        </kyn-footer-link>
        <kyn-footer-link divider href="//www.kyndryl.com/us/en/terms">
          Terms
        </kyn-footer-link>
        <kyn-footer-link divider href="//www.kyndryl.com/us/en/security">
          Security
        </kyn-footer-link>

        <kyn-footer-link href="javascript:void(0)">Custom Link</kyn-footer-link>
      </kyn-footer-nav>
    </kyn-footer>
  `,
};

Footer.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/zGyRSDM6stIrSjC3TOyGGQ/719820--Kyndryl-Bridge-Navigation-Patterns?node-id=2154%3A9325&t=l4gSUzqO6Vbo3YOX-1',
  },
};
