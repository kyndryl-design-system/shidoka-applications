import { html } from 'lit';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { expect, waitFor } from 'storybook/test';

import '../../components/global/header';
import '../../components/reusable/tabs';

import { GLOBAL_SWITCHER_PATTERN_STYLES } from './globalSwitcherPatternStyles.js';

import bridgeLogo from '@kyndryl-design-system/shidoka-foundation/assets/svg/bridge-logo-large.svg';
import servicesIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/services.svg';

const equalTabStyle =
  'width: var(--global-switcher-tab-width); flex: 0 0 var(--global-switcher-tab-width);';

const renderEmptyState = (title = 'Subscribe to your first service') => html`
  <div
    style="display: flex; align-items: center; justify-content: center; min-height: 280px; margin-bottom: -8px; padding: 48px 24px; box-sizing: border-box; text-align: center; background: var(--kd-color-background-container-subtle); border-radius: 8px;"
  >
    <div style="max-width: 520px;">
      <h2 style="margin: 0 0 12px; font-size: 20px; line-height: 1.3;">
        ${title}
      </h2>
      <p style="margin: 0 0 24px; color: var(--kd-color-text-level-secondary);">
        Check out the catalog to provision your first service, or connect with
        your account manager to dive deeper into our service capabilities.
      </p>
      <a
        href="#"
        style="color: var(--kd-color-text-link-level-default); font-weight: var(--kd-font-weight-medium); text-decoration: none;"
      >
        Visit the Bridge Service Catalog
      </a>
    </div>
  </div>
`;

export default {
  title: 'Tests/Patterns/Global Switcher',
  tags: ['!autodocs'],
  parameters: {
    docs: {
      disable: true,
    },
    controls: {
      disable: true,
    },
  },
};

export const FullWidthEmptyStateServiceTabs = {
  render: () => html`
    <style>
      ${GLOBAL_SWITCHER_PATTERN_STYLES}
    </style>
    <kyn-header rootUrl="/" appTitle="Services Catalog">
      <span slot="logo" style="--kyn-header-logo-width: 120px;"
        >${unsafeSVG(bridgeLogo)}</span
      >
      <kyn-header-nav class="global-switcher-nav" auto-open-flyout="default">
        <kyn-header-link
          id="services"
          href="javascript:void(0)"
          full-width-flyout
        >
          <span>${unsafeSVG(servicesIcon)}</span>
          Services

          <kyn-tabs
            tabSize="md"
            slot="links"
            style="width: 100%; max-width: none; --global-switcher-tab-width: 184px;"
          >
            <kyn-tab
              slot="tabs"
              id="kyndryl"
              fill-width
              style=${equalTabStyle}
              selected
            >
              Kyndryl Services
            </kyn-tab>
            <kyn-tab
              slot="tabs"
              id="platform"
              fill-width
              style=${equalTabStyle}
            >
              Platform Services
            </kyn-tab>
            <kyn-tab
              slot="tabs"
              id="additional"
              fill-width
              style=${equalTabStyle}
            >
              Additional Services
            </kyn-tab>

            <kyn-tab-panel tabId="kyndryl" noPadding visible>
              ${renderEmptyState('Subscribe to your first Kyndryl Service')}
            </kyn-tab-panel>
            <kyn-tab-panel tabId="platform" noPadding>
              ${renderEmptyState('Subscribe to your first Platform Service')}
            </kyn-tab-panel>
            <kyn-tab-panel tabId="additional" noPadding>
              ${renderEmptyState()}
            </kyn-tab-panel>
          </kyn-tabs>
        </kyn-header-link>
      </kyn-header-nav>
    </kyn-header>
  `,
  play: async ({ canvasElement }) => {
    const servicesLink = canvasElement.querySelector(
      'kyn-header-link#services'
    );
    expect(servicesLink).not.toBeNull();
    expect(servicesLink.hasAttribute('full-width-flyout')).toBe(true);

    await waitFor(() => {
      expect(servicesLink.open).toBe(true);
    });

    const flyout = servicesLink.shadowRoot?.querySelector('.menu__content');
    expect(flyout).not.toBeNull();

    await waitFor(() => {
      const viewportWidth = canvasElement.ownerDocument.defaultView.innerWidth;
      const flyoutWidth = Math.round(flyout.getBoundingClientRect().width);

      expect(getComputedStyle(flyout).display).not.toBe('none');
      expect(flyoutWidth).toBeGreaterThanOrEqual(viewportWidth - 32);
    });

    const tabs = Array.from(
      canvasElement.querySelectorAll('kyn-tab[slot="tabs"]')
    );

    await waitFor(() => {
      const widths = tabs.map((tab) =>
        Math.round(tab.getBoundingClientRect().width)
      );
      expect(new Set(widths).size).toBe(1);
    });
  },
};

export const FullWidthSingleCategoryServiceTab = {
  render: () => html`
    <style>
      ${GLOBAL_SWITCHER_PATTERN_STYLES}
    </style>
    <kyn-header rootUrl="/" appTitle="Services Catalog">
      <span slot="logo" style="--kyn-header-logo-width: 120px;"
        >${unsafeSVG(bridgeLogo)}</span
      >
      <kyn-header-nav
        class="global-switcher-nav"
        auto-open-flyout="default"
        truncate-links
      >
        <kyn-header-link
          id="services"
          href="javascript:void(0)"
          full-width-flyout
        >
          <span>${unsafeSVG(servicesIcon)}</span>
          Services

          <kyn-tabs
            tabSize="md"
            slot="links"
            style="width: 100%; max-width: none; --global-switcher-tab-width: 184px;"
          >
            <kyn-tab
              slot="tabs"
              id="kyndryl"
              fill-width
              style=${equalTabStyle}
              selected
            >
              Kyndryl Services
            </kyn-tab>
            <kyn-tab
              slot="tabs"
              id="platform"
              fill-width
              style=${equalTabStyle}
            >
              Platform Services
            </kyn-tab>
            <kyn-tab
              slot="tabs"
              id="additional"
              fill-width
              style=${equalTabStyle}
            >
              Additional Services
            </kyn-tab>

            <kyn-tab-panel tabId="kyndryl" noPadding visible>
              <kyn-header-categories layout="masonry" .limitRootLinks=${false}>
                <kyn-header-category heading="Security & Resiliency">
                  <kyn-header-link href="#escm">
                    <span>ESCM</span>
                  </kyn-header-link>
                </kyn-header-category>
              </kyn-header-categories>
            </kyn-tab-panel>
            <kyn-tab-panel tabId="platform" noPadding>
              ${renderEmptyState('Subscribe to your first Platform Service')}
            </kyn-tab-panel>
            <kyn-tab-panel tabId="additional" noPadding>
              ${renderEmptyState()}
            </kyn-tab-panel>
          </kyn-tabs>
        </kyn-header-link>
      </kyn-header-nav>
    </kyn-header>
  `,
  play: async ({ canvasElement }) => {
    const servicesLink = canvasElement.querySelector(
      'kyn-header-link#services'
    );
    expect(servicesLink).not.toBeNull();

    await waitFor(() => {
      expect(servicesLink.open).toBe(true);
    });

    const flyout = servicesLink.shadowRoot?.querySelector('.menu__content');
    const categories = canvasElement.querySelector(
      'kyn-tab-panel[visible] kyn-header-categories'
    );
    const serviceLink = canvasElement.querySelector(
      'kyn-tab-panel[visible] kyn-header-link[href="#escm"]'
    );

    expect(flyout).not.toBeNull();
    expect(categories).not.toBeNull();
    expect(serviceLink).not.toBeNull();

    await waitFor(() => {
      expect(categories.getAttribute('data-columns')).toBe('1');

      const flyoutWidth = Math.round(flyout.getBoundingClientRect().width);
      const linkWidth = Math.round(serviceLink.getBoundingClientRect().width);

      expect(flyoutWidth).toBeGreaterThan(500);
      expect(linkWidth).toBeGreaterThan(0);
      expect(linkWidth).toBeLessThanOrEqual(370);
      expect(linkWidth).toBeLessThan(flyoutWidth / 2);
    });
  },
};
