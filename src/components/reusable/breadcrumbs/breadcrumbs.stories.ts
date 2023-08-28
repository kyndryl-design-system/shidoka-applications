/**
 * Copyright Kyndryl, Inc. 2023
 */

// External library imports
import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';

import '@kyndryl-design-system/foundation/components/link';

// Relative component imports
import './breadcrumbs';
import './index';

/**
 * ## Usage
 *
 * Here's how you can use the `kyn-breadcrumbs` component with sample items:
 *
 * ```javascript
 *
 * html`
 *  <kyn-breadcrumbs>
 *    <kd-link class="breadcrumb-item" .href="${'/'}">Bridge</kd-link>
 *    <kd-link class="breadcrumb-item" .href="${'/catalog'}">Catalog</kd-link>
 *    <span class="breadcrumb-item breadcrumb-last">FinOps</span>
 *  </kyn-breadcrumbs>
 * `;
 * ```
 *
 * Remember to import and define the component before using it.
 */

const meta: Meta = {
  title: 'Components/Breadcrumbs',
  component: 'kyn-breadcrumbs',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/6AovH7Iay9Y7BkpoL5975s/Component-Library-for-Dev?node-id=459%3A39033&mode=dev',
    },
  },
};

export default meta;

type Story = StoryObj;

export const Breadcrumbs: Story = {
  render: () => {
    return html`<kyn-breadcrumbs>
      <kd-link class="breadcrumb-item" .href="${'/'}">Bridge</kd-link>
      <kd-link class="breadcrumb-item" .href="${'/catalog'}">Catalog</kd-link>
      <span class="breadcrumb-item breadcrumb-last">FinOps</span>
    </kyn-breadcrumbs>`;
  },
};
