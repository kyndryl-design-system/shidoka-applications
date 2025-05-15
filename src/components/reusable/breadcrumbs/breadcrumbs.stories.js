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
      url: 'https://www.figma.com/design/qyPEUQckxj8LUgesi1OEES/Component-Library-2.0?node-id=4001-136282&p=f&m=dev',
    },
  },
};

export const Breadcrumbs = {
  render: () => {
    return html`
      <kyn-breadcrumbs role="navigation" aria-label="Breadcrumb">
        <kyn-link standalone href="/path">Level 1</kyn-link>
        <kyn-link standalone href="/path">Level 2</kyn-link>
        <strong aria-current="page">Current page</strong>
      </kyn-breadcrumbs>
    `;
  },
};

export const WithOverflow = {
  render: () => {
    return html`
      <kyn-breadcrumbs role="navigation" aria-label="Breadcrumb">
        <kyn-link standalone href="/path">Level 1</kyn-link>
        <kyn-link standalone href="/path">Level 2</kyn-link>

        <kyn-overflow-menu>
          <kyn-overflow-menu-item href="/path">Level 3</kyn-overflow-menu-item>
          <kyn-overflow-menu-item href="/path">Level 4</kyn-overflow-menu-item>
        </kyn-overflow-menu>

        <kyn-link standalone href="/path">Level 5</kyn-link>
        <strong aria-current="page">Current page</strong>
      </kyn-breadcrumbs>
    `;
  },
};
