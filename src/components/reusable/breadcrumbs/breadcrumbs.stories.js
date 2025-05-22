import { html } from 'lit';
import '../link';
import '../overflowMenu';
import './';

export default {
  title: 'Components/Breadcrumbs',
  component: 'kyn-breadcrumbs',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/9Q2XfTSxfzTXfNe2Bi8KDS/Component-Viewer?node-id=1-363919&p=f&t=A5tcETiCf23sAgKK-0',
    },
  },
};

export const Breadcrumbs = {
  render: () => {
    return html`
      <kyn-breadcrumbs role="navigation" aria-label="Breadcrumb">
        <kyn-link standalone isBreadcrumb href="/path">Level 1</kyn-link>
        <kyn-link standalone isBreadcrumb href="/path">Level 2</kyn-link>
        <strong aria-current="page">Current page</strong>
      </kyn-breadcrumbs>
    `;
  },
};

export const WithOverflow = {
  render: () => {
    return html`
      <kyn-breadcrumbs role="navigation" aria-label="Breadcrumb">
        <kyn-link standalone isBreadcrumb href="/path">Level 1</kyn-link>
        <kyn-link standalone isBreadcrumb href="/path">Level 2</kyn-link>

        <kyn-overflow-menu>
          <kyn-overflow-menu-item href="/path">Level 3</kyn-overflow-menu-item>
          <kyn-overflow-menu-item href="/path">Level 4</kyn-overflow-menu-item>
        </kyn-overflow-menu>

        <kyn-link standalone isBreadcrumb href="/path">Level 5</kyn-link>
        <strong aria-current="page">Current page</strong>
      </kyn-breadcrumbs>
    `;
  },
};
