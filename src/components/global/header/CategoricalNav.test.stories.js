import { html } from 'lit';
import { expect, userEvent, waitFor } from 'storybook/test';

import './';

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
