/**
 * Copyright Kyndryl, Inc. 2023
 */

// Import external libraries
import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';

// Import Kyndryl Design System components
import '@kyndryl-design-system/foundation/components/link';

// Import component from this directory
import './breadcrumbs';
import './breadcrumbItem';

// Metadata for the storybook
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

// Type definition for the story
type Story = StoryObj;

// Define the Breadcrumbs story
export const Breadcrumbs: Story = {
  render: () => {
    return html`<kyn-breadcrumbs>
      <kyn-breadcrumb-item href="/">Breadcrumb</kyn-breadcrumb-item>
      <kyn-breadcrumb-item href="/beadcrumb">Breadcrumb</kyn-breadcrumb-item>
      <kyn-breadcrumb-item>Breadcrumb</kyn-breadcrumb-item>
    </kyn-breadcrumbs> `;
  },
};
