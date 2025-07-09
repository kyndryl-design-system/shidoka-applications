import { html } from 'lit';
import { useArgs } from 'storybook/preview-api';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { action } from 'storybook/actions';

import './button';
import './buttonGroup';

import { BUTTON_GROUP_KINDS } from './buttonGroup';

import coreServicesIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/core-services.svg';
import cubeIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/cube.svg';
import collabDriveIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/collab-drive.svg';
import cloudSecurityIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/cloud-security.svg';
import cloudDownloadIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/cloud-download.svg';
import consoleIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/console.svg';
import deleteIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/delete.svg';

export default {
  title: 'Components/Button/Button Group',
  component: 'kyn-button-group',
  argTypes: {
    kind: {
      control: 'select',
      options: Object.values(BUTTON_GROUP_KINDS),
    },
    currentPage: { control: 'number' },
    totalPages: { control: 'number' },
    maxVisible: { control: 'number' },
    singleSelect: { control: 'boolean' },
    selectedIndex: { control: 'number' },
    incrementBy: { control: 'number' },
  },
};

const BaseArgs = {
  singleSelect: false,
  selectedIndex: -1,
  selectedIndices: [],
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
      ?singleSelect=${args.singleSelect}
      .selectedIndex=${args.selectedIndex}
      .selectedIndices=${args.selectedIndices}
      @on-change=${(e) => {
        action('on-change')(e);
        updateArgs({
          selectedIndex: e.detail.selectedIndex,
          selectedIndices: [...e.detail.selectedIndices],
        });
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
      ?singleSelect=${args.singleSelect}
      .selectedIndex=${args.selectedIndex}
      .selectedIndices=${args.selectedIndices}
      @on-change=${(e) => {
        action('on-change')(e);
        updateArgs({
          selectedIndex: e.detail.selectedIndex,
          selectedIndices: [...e.detail.selectedIndices],
        });
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
      ?singleSelect=${args.singleSelect}
      .selectedIndex=${args.selectedIndex}
      .selectedIndices=${args.selectedIndices}
      @on-change=${(e) => {
        action('on-change')(e);
        updateArgs({
          selectedIndex: e.detail.selectedIndex,
          selectedIndices: [...e.detail.selectedIndices],
        });
      }}
    >
      ${renderButtonsFromArray(customButtons)}
    </kyn-button-group>
  `;
};

export const Default = {
  render: Template,
  args: { ...BaseArgs, kind: BUTTON_GROUP_KINDS.DEFAULT },
};

export const Icons = {
  render: IconTemplate,
  args: {
    ...BaseArgs,
    kind: BUTTON_GROUP_KINDS.ICONS,
    singleSelect: true,
    selectedIndex: 0,
  },
};

export const PaginationExample = {
  args: {
    kind: BUTTON_GROUP_KINDS.PAGINATION,
    currentPage: 1,
    totalPages: 20,
    maxVisible: 5,
    singleSelect: true,
    incrementBy: 3,
    visibleStart: 1,
    visibleEnd: 5,
  },
  render: (args) => {
    const [, updateArgs] = useArgs();
    const { currentPage, totalPages, visibleStart, visibleEnd } = args;
    return html`
      <div style="margin-bottom:16px">
        Page ${currentPage} of ${totalPages} — showing
        ${visibleStart}–${visibleEnd}
      </div>
      <kyn-button-group
        .kind=${BUTTON_GROUP_KINDS.PAGINATION}
        .currentPage=${currentPage}
        .totalPages=${totalPages}
        .maxVisible=${args.maxVisible}
        .incrementBy=${args.incrementBy}
        ?singleSelect=${true}
        @on-change=${(e) => {
          action('on-change')(e);
          updateArgs({
            currentPage: e.detail.currentPage,
            visibleStart: e.detail.visibleStart,
            visibleEnd: e.detail.visibleEnd,
          });
        }}
      ></kyn-button-group>
    `;
  },
};

export const CustomIconArray = {
  render: CustomIconTemplate,
  args: {
    ...BaseArgs,
    kind: BUTTON_GROUP_KINDS.ICONS,
    singleSelect: false,
    selectedIndices: [0],
  },
};
