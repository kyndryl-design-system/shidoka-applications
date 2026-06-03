import { html } from 'lit';
import { expect, userEvent, waitFor } from 'storybook/test';

import './';
import '../../reusable/tabs';
import { GLOBAL_SWITCHER_PATTERN_STYLES } from '../../../stories/globalSwitcher/globalSwitcherPatternStyles.js';

export default {
  title: 'Tests/Global Components/Header/Categorical Nav',
  component: 'kyn-header-categories',
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

export const SlottedTruncatedRootToFullDetailRegression = {
  parameters: {
    a11y: {
      disable: true,
    },
  },
  render: () => html`
    <div style="padding: 16px;">
      <kyn-header-categories layout="masonry" maxColumns="2" maxRootLinks="5">
        <kyn-header-category heading="Access Management">
          <kyn-header-link href="#">Bridge Access Management</kyn-header-link>
          <kyn-header-link href="#">Service Access Management</kyn-header-link>
        </kyn-header-category>

        <kyn-header-category heading="Policy Service">
          <kyn-header-link href="#">Policy Management</kyn-header-link>
        </kyn-header-category>

        <kyn-header-category heading="Service Operations">
          <kyn-header-link href="#">Actions</kyn-header-link>
          <kyn-header-link href="#">Audit</kyn-header-link>
          <kyn-header-link href="#">Connections Management</kyn-header-link>
          <kyn-header-link href="#">Enablement</kyn-header-link>
          <kyn-header-link href="#">Insights Management</kyn-header-link>
          <kyn-header-link href="#">Logging & Monitoring</kyn-header-link>
          <kyn-header-link href="#"
            >Sunrise Insights Administration</kyn-header-link
          >
          <kyn-header-link href="#">Change Tracking</kyn-header-link>
          <kyn-header-link href="#">Incident Console</kyn-header-link>
          <kyn-header-link href="#">Maintenance Windows</kyn-header-link>
          <kyn-header-link href="#">Runbook Automation</kyn-header-link>
          <kyn-header-link href="#">Service Health Dashboard</kyn-header-link>
        </kyn-header-category>

        <kyn-header-category heading="Tag Management">
          <kyn-header-link href="#">Tag Management</kyn-header-link>
        </kyn-header-category>
      </kyn-header-categories>
    </div>
  `,
  play: async ({ canvasElement }) => {
    const categoriesHost = canvasElement.querySelector('kyn-header-categories');
    expect(categoriesHost).not.toBeNull();

    await categoriesHost.updateComplete;

    const serviceOperationsCategory = Array.from(
      categoriesHost.querySelectorAll('kyn-header-category')
    ).find(
      (category) => category.getAttribute('heading') === 'Service Operations'
    );
    expect(serviceOperationsCategory).toBeTruthy();

    await serviceOperationsCategory.updateComplete;

    const serviceOperationsLinks = Array.from(
      serviceOperationsCategory.querySelectorAll('kyn-header-link')
    );
    expect(serviceOperationsLinks).toHaveLength(12);

    const moreLink = Array.from(
      serviceOperationsCategory.shadowRoot.querySelectorAll('kyn-header-link')
    ).find((link) => link.textContent?.includes('More'));
    expect(moreLink).toBeTruthy();

    const moreAnchor = moreLink.shadowRoot?.querySelector('a');
    expect(moreAnchor).not.toBeNull();

    await userEvent.click(moreAnchor);

    await waitFor(() => {
      expect(categoriesHost.activeMegaCategoryId).toBe('category-3');
      expect(categoriesHost.view).toBe('detail');
      expect(serviceOperationsLinks[5]).toBeVisible();
      expect(serviceOperationsLinks[11]).toBeVisible();
      expect(
        categoriesHost.shadowRoot.querySelector(
          '[aria-label="Service Operations – More"]'
        )
      ).not.toBeNull();
      expect(
        categoriesHost.shadowRoot.querySelector(
          '[aria-label="Access Management – More"]'
        )
      ).toBeNull();
      expect(
        Array.from(
          serviceOperationsCategory.shadowRoot.querySelectorAll(
            'kyn-header-link'
          )
        ).find((link) => link.textContent?.includes('More'))
      ).toBeUndefined();
    });
  },
};

export const FullWidthFlyoutSingleCategoryRegression = {
  render: () => html`
    <style>
      ${GLOBAL_SWITCHER_PATTERN_STYLES}
    </style>
    <kyn-header rootUrl="/" appTitle="Application">
      <kyn-header-nav
        class="global-switcher-nav"
        auto-open-flyout="services"
        truncate-links
      >
        <kyn-header-link
          id="services"
          href="javascript:void(0)"
          full-width-flyout
        >
          Services

          <kyn-tabs
            tabSize="md"
            slot="links"
            style="width: 100%; max-width: none; --global-switcher-tab-width: 170px;"
          >
            <kyn-tab
              slot="tabs"
              id="kyndryl"
              fill-width
              selected
              style="width: var(--global-switcher-tab-width); flex: 0 0 var(--global-switcher-tab-width);"
            >
              Kyndryl Services
            </kyn-tab>
            <kyn-tab
              slot="tabs"
              id="platform"
              fill-width
              style="width: var(--global-switcher-tab-width); flex: 0 0 var(--global-switcher-tab-width);"
            >
              Platform Services
            </kyn-tab>
            <kyn-tab
              slot="tabs"
              id="additional"
              fill-width
              style="width: var(--global-switcher-tab-width); flex: 0 0 var(--global-switcher-tab-width);"
            >
              Additional Services
            </kyn-tab>

            <kyn-tab-panel tabId="kyndryl" noPadding visible>
              <kyn-header-categories
                layout="masonry"
                .limitRootLinks=${false}
                style="--kyn-header-category-single-column-width: 350px;"
              >
                <kyn-header-category heading="Security & Resiliency">
                  <kyn-header-link href="#escm">
                    <span>ESCM</span>
                  </kyn-header-link>
                </kyn-header-category>
              </kyn-header-categories>
            </kyn-tab-panel>
            <kyn-tab-panel tabId="platform" noPadding>
              <div style="min-height: 220px;"></div>
            </kyn-tab-panel>
            <kyn-tab-panel tabId="additional" noPadding>
              <div style="min-height: 220px;"></div>
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
      const categoryWidth = Math.round(
        categories.getBoundingClientRect().width
      );
      const linkWidth = Math.round(serviceLink.getBoundingClientRect().width);

      expect(flyoutWidth).toBeGreaterThan(500);
      expect(categoryWidth).toBeLessThanOrEqual(370);
      expect(linkWidth).toBeGreaterThan(0);
      expect(linkWidth).toBeLessThanOrEqual(370);
      expect(linkWidth).toBeLessThan(flyoutWidth / 2);
    });
  },
};
