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
      url: 'https://www.figma.com/file/6AovH7Iay9Y7BkpoL5975s/Component-Library-for-Dev?node-id=459%3A39033&mode=dev',
    },
  },
};

export const Breadcrumbs = {
  render: () => {
    return html`
      <kyn-breadcrumbs aria-label="Breadcrumb">
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
      <kyn-breadcrumbs aria-label="Breadcrumb">
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
