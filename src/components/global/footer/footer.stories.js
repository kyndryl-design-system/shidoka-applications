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
    FooterNavLink: 'kyn-footer-link'
  },
  decorators: [
    withDesign,
    (story) =>
      html`
        <div
          style="height: 100%; min-height: 250px; transform: translate3d(0,0,0); margin: -16px;"
        >
          ${story()}
        </div>
      `,
  ],
};

export const Footer = {
  args: {
    rootUrl: '/',
    breakpoint: 740,
  },
  render: (args) => html`
    <kyn-footer
      rootUrl=${args.rootUrl}
      breakpoint=${args.breakpoint}
    >
      <kyn-footer-nav>
        <kyn-footer-link divider href="//www.kyndryl.com/us/en/privacy">Privacy</kyn-footer-link>
        <kyn-footer-link divider href="//www.kyndryl.com/us/en/terms">Terms</kyn-footer-link>
        <kyn-footer-link divider href="//www.kyndryl.com/us/en/security">Security</kyn-footer-link>
        
        <kyn-footer-link onclick="alert('Custom link clicked')">Custom Link</kyn-footer-link>
      </kyn-footer-nav>
    </kyn-footer>
  `,
};

Footer.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/zGyRSDM6stIrSjC3TOyGGQ/719820--Kyndryl-Bridge-Navigation-Patterns?node-id=2154-11029&t=tURyPlJ1YyDS3qAT-0'
  },
};
