import { html } from 'lit';
import { useArgs } from 'storybook/preview-api';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { action } from 'storybook/actions';

import '../button/button';
import './buttonGroup';

import { BUTTON_GROUP_KINDS } from './buttonGroup';

// Example for icons variant
import coreServicesIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/core-services.svg';
import cubeIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/cube.svg';
import collabDriveIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/collab-drive.svg';
import cloudSecurityIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/cloud-security.svg';
import cloudDownloadIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/cloud-download.svg';
import consoleIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/console.svg';
import deleteIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/delete.svg';

export default {
  title: 'Components/Button Group',
  component: 'kyn-button-group',
  parameters: {
    controls: {
      exclude: ['_visibleStart', '_buttons'],
    },
  },
  argTypes: {
    // always available props
    selectedIndex: { control: 'number' },
    kind: {
      control: 'select',
      options: Object.values(BUTTON_GROUP_KINDS),
    },
    // pagination-only props:
    totalPages: {
      control: 'number',
      if: { arg: 'kind', eq: BUTTON_GROUP_KINDS.PAGINATION },
    },
    maxVisible: {
      control: 'number',
      if: { arg: 'kind', eq: BUTTON_GROUP_KINDS.PAGINATION },
    },
    clickIncrementBy: {
      control: 'number',
      if: { arg: 'kind', eq: BUTTON_GROUP_KINDS.PAGINATION },
    },
    visibleStart: {
      table: { category: 'read-only' },
      if: { arg: 'kind', eq: BUTTON_GROUP_KINDS.PAGINATION },
    },
    visibleEnd: {
      table: { category: 'read-only' },
      if: { arg: 'kind', eq: BUTTON_GROUP_KINDS.PAGINATION },
    },
  },
};

const iconButtonConfigs = [
  { value: '1', icon: coreServicesIcon, description: 'Core Services' },
  { value: '2', icon: cubeIcon, description: 'Cube' },
  { value: '3', icon: collabDriveIcon, description: 'Collab Drive' },
  { value: '4', icon: cloudSecurityIcon, description: 'Cloud Security' },
  { value: '5', icon: cloudDownloadIcon, description: 'Cloud Download' },
  { value: '6', icon: consoleIcon, description: 'Console' },
  { value: '7', icon: deleteIcon, description: 'Delete' },
];

const renderButtonsFromArray = (buttons) =>
  buttons.map(
    (btn) => html`
      <kyn-button
        kind="${btn.kind || 'secondary'}"
        value="${btn.value}"
        description="${btn.description || ''}"
        ?disabled="${btn.disabled || false}"
      >
        ${btn.icon ? unsafeSVG(btn.icon) : btn.text || ''}
      </kyn-button>
    `
  );

const Template = (args) => {
  const [, updateArgs] = useArgs();
  return html`
    <kyn-button-group
      .kind=${args.kind}
      .selectedIndex=${args.selectedIndex}
      .totalPages=${args.totalPages}
      .maxVisible=${args.maxVisible}
      .clickIncrementBy=${args.clickIncrementBy}
      @on-click=${(e) => {
        action('on-click')(e);
        if (e.detail.selectedIndex !== undefined) {
          updateArgs({
            selectedIndex: e.detail.selectedIndex,
          });
        }
      }}
    >
      <kyn-button value="1">Button 1</kyn-button>
      <kyn-button value="2">Button 2</kyn-button>
      <kyn-button value="3">Button 3</kyn-button>
      <kyn-button value="4">Button 4</kyn-button>
    </kyn-button-group>
  `;
};

const IconTemplate = (args) => {
  const [, updateArgs] = useArgs();
  return html`
    <kyn-button-group
      .kind=${args.kind}
      .selectedIndex=${args.selectedIndex}
      .totalPages=${args.totalPages}
      .maxVisible=${args.maxVisible}
      .clickIncrementBy=${args.clickIncrementBy}
      @on-click=${(e) => {
        action('on-click')(e);
        if (e.detail.selectedIndex !== undefined) {
          updateArgs({
            selectedIndex: e.detail.selectedIndex,
          });
        }
      }}
    >
      ${renderButtonsFromArray(iconButtonConfigs)}
    </kyn-button-group>
  `;
};

const CustomIconTemplate = (args) => {
  const [, updateArgs] = useArgs();
  const customButtons = [
    { value: 'action1', icon: coreServicesIcon, description: 'Core Services' },
    { value: 'action2', icon: cubeIcon, description: 'Cube', disabled: false },
    { value: 'action3', text: 'Text Button', description: 'Text only button' },
  ];
  return html`
    <kyn-button-group
      .kind=${args.kind}
      .selectedIndex=${args.selectedIndex}
      .totalPages=${args.totalPages}
      .maxVisible=${args.maxVisible}
      .clickIncrementBy=${args.clickIncrementBy}
      @on-click=${(e) => {
        action('on-click')(e);
        if (e.detail.selectedIndex !== undefined) {
          updateArgs({
            selectedIndex: e.detail.selectedIndex,
          });
        }
      }}
    >
      ${renderButtonsFromArray(customButtons)}
    </kyn-button-group>
  `;
};

export const Default = {
  render: Template,
  args: {
    kind: BUTTON_GROUP_KINDS.DEFAULT,
    selectedIndex: -1,
    totalPages: 1,
    maxVisible: 5,
    clickIncrementBy: 1,
  },
};

export const Icons = {
  render: IconTemplate,
  args: {
    kind: BUTTON_GROUP_KINDS.ICONS,
    selectedIndex: 0,
    totalPages: 1,
    maxVisible: 5,
    clickIncrementBy: 1,
  },
};

export const PaginationExample = {
  args: {
    kind: BUTTON_GROUP_KINDS.PAGINATION,
    selectedIndex: 0,
    totalPages: 20,
    maxVisible: 5,
    clickIncrementBy: 3,
    visibleStart: 1,
    visibleEnd: 5,
  },
  render: (args) => {
    const [, updateArgs] = useArgs();
    return html`
      <div class="helper-label">
        Page ${args.selectedIndex + 1} of ${args.totalPages} — showing
        ${args.visibleStart}–${args.visibleEnd}
      </div>
      <kyn-button-group
        .kind=${args.kind}
        .selectedIndex=${args.selectedIndex}
        .totalPages=${args.totalPages}
        .maxVisible=${args.maxVisible}
        .clickIncrementBy=${args.clickIncrementBy}
        @on-click=${(e) => {
          action('on-click')(e);
          updateArgs({
            selectedIndex: e.detail.selectedIndex,
            visibleStart: e.detail.visibleStart,
            visibleEnd: e.detail.visibleEnd,
          });
        }}
      >
        <kyn-button value="1">Button 1</kyn-button>
        <kyn-button value="2">Button 2</kyn-button>
        <kyn-button value="3">Button 3</kyn-button>
        <kyn-button value="4">Button 4</kyn-button>
      </kyn-button-group>
      <style>
        .helper-label {
          margin-bottom: var(--kd-spacing-12);
        }
      </style>
    `;
  },
};

export const CustomIconArray = {
  render: CustomIconTemplate,
  args: {
    kind: BUTTON_GROUP_KINDS.ICONS,
    selectedIndex: 0,
    totalPages: 1,
    maxVisible: 5,
    clickIncrementBy: 1,
  },
};
