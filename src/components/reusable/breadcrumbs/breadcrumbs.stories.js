import { html } from 'lit';
import '@kyndryl-design-system/shidoka-foundation/components/link';
import '@kyndryl-design-system/shidoka-foundation/components/icon';
import '../overflowMenu';
import './';
import '../loaders/skeleton';

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
        <kd-link standalone href="/path">Level 1</kd-link>
        <kd-link standalone href="/path">Level 2</kd-link>
        <strong aria-current="page">Current page</strong>
      </kyn-breadcrumbs>
    `;
  },
};

export const WithOverflow = {
  render: () => {
    return html`
      <kyn-breadcrumbs aria-label="Breadcrumb">
        <kd-link standalone href="/path">Level 1</kd-link>
        <kd-link standalone href="/path">Level 2</kd-link>

        <kyn-overflow-menu>
          <kyn-overflow-menu-item href="/path">Level 3</kyn-overflow-menu-item>
          <kyn-overflow-menu-item href="/path">Level 4</kyn-overflow-menu-item>
        </kyn-overflow-menu>

        <kd-link standalone href="/path">Level 5</kd-link>
        <strong aria-current="page">Current page</strong>
      </kyn-breadcrumbs>
    `;
  },
};

export const Skeleton = {
  render: () => {
    return html`
      <style>
        kyn-skeleton.inline-example1 {
          width: 100px;
        }
        kyn-skeleton.inline-example {
          width: 80px;
        }
      </style>
      <kyn-breadcrumbs aria-label="Breadcrumb"> </kyn-breadcrumbs>
    `;
  },
};
