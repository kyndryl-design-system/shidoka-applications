import { html } from 'lit';
import { useArgs } from 'storybook/preview-api';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { action } from 'storybook/actions';

import './button';
import './buttonGroup';

import chevronLeftIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/chevron-left.svg';
import chevronRightIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/chevron-right.svg';

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
    currentPage: { control: 'number' },
    totalPages: { control: 'number' },
    maxVisible: { control: 'number' },
    pagination: { control: 'boolean' },
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

const Template = (args) => {
  const [{ disabled }, updateArgs] = useArgs();

  return html`
    <kyn-button-group
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
      <kyn-button
        value="1"
        ?selected=${args.singleSelect
          ? args.selectedIndex === 0
          : args.selectedIndices.includes(0)}
        >Button 1</kyn-button
      >
      <kyn-button
        value="2"
        ?selected=${args.singleSelect
          ? args.selectedIndex === 1
          : args.selectedIndices.includes(1)}
        >Button 2</kyn-button
      >
      <kyn-button
        value="3"
        ?selected=${args.singleSelect
          ? args.selectedIndex === 2
          : args.selectedIndices.includes(2)}
        >Button 3</kyn-button
      >
      <kyn-button
        value="4"
        ?selected=${args.singleSelect
          ? args.selectedIndex === 3
          : args.selectedIndices.includes(3)}
        >Button 4</kyn-button
      >
    </kyn-button-group>
  `;
};

const IconTemplate = (args) => {
  const [{ disabled }, updateArgs] = useArgs();

  return html`
    <kyn-button-group
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
      <kyn-button
        kind="secondary"
        value="1"
        ?selected=${args.singleSelect
          ? args.selectedIndex === 0
          : args.selectedIndices.includes(0)}
        >${unsafeSVG(coreServicesIcon)}</kyn-button
      >
      <kyn-button
        kind="secondary"
        value="2"
        ?selected=${args.singleSelect
          ? args.selectedIndex === 1
          : args.selectedIndices.includes(1)}
        >${unsafeSVG(cubeIcon)}</kyn-button
      >
      <kyn-button
        kind="secondary"
        value="3"
        ?selected=${args.singleSelect
          ? args.selectedIndex === 2
          : args.selectedIndices.includes(2)}
        >${unsafeSVG(collabDriveIcon)}</kyn-button
      >
      <kyn-button
        kind="secondary"
        value="4"
        ?selected=${args.singleSelect
          ? args.selectedIndex === 3
          : args.selectedIndices.includes(3)}
        >${unsafeSVG(cloudSecurityIcon)}</kyn-button
      >
      <kyn-button
        kind="secondary"
        value="1"
        ?selected=${args.singleSelect
          ? args.selectedIndex === 0
          : args.selectedIndices.includes(0)}
        >${unsafeSVG(cloudDownloadIcon)}</kyn-button
      >
      <kyn-button
        kind="secondary"
        value="2"
        ?selected=${args.singleSelect
          ? args.selectedIndex === 1
          : args.selectedIndices.includes(1)}
        >${unsafeSVG(consoleIcon)}</kyn-button
      >
      <kyn-button
        kind="secondary"
        value="3"
        ?selected=${args.singleSelect
          ? args.selectedIndex === 2
          : args.selectedIndices.includes(2)}
        >${unsafeSVG(deleteIcon)}</kyn-button
      >
    </kyn-button-group>
  `;
};

export const Default = {
  render: Template,
  args: { ...BaseArgs },
};

export const PaginationExample = {
  args: {
    currentPage: 1,
    totalPages: 20,
    maxVisible: 5,
    pagination: true,
    singleSelect: true,
    incrementBy: 5,
  },
  render: (args) => {
    const [{ disabled }, updateArgs] = useArgs();
    const { currentPage, totalPages, maxVisible } = args;
    const half = Math.floor(maxVisible / 2);

    let start, end;

    start = Math.max(1, currentPage - half);
    end = Math.min(totalPages, start + maxVisible - 1);

    if (end === totalPages && totalPages > maxVisible) {
      start = Math.max(1, totalPages - maxVisible + 1);
    }

    return html`
      <div style="margin-bottom:16px">
        Page ${currentPage} of ${totalPages} — showing ${start}–${end}
      </div>
      <kyn-button-group
        .currentPage=${currentPage}
        .totalPages=${totalPages}
        .maxVisible=${maxVisible}
        .incrementBy=${args.incrementBy}
        .prevButtonContent=${chevronLeftIcon}
        .nextButtonContent=${chevronRightIcon}
        ?pagination=${true}
        ?singleSelect=${true}
        @on-change=${(e) => {
          action('on-change')(e);
          updateArgs({ currentPage: e.detail.currentPage });
        }}
      >
      </kyn-button-group>
    `;
  },
};

export const SingleSelectIcons = {
  render: IconTemplate,
  args: { ...BaseArgs, singleSelect: true, selectedIndex: 0 },
};

export const MultiSelect = {
  render: Template,
  args: { ...BaseArgs, singleSelect: false, selectedIndices: [1, 2] },
};

export const LetteredExample = {
  render: (args) => {
    const [, updateArgs] = useArgs();

    return html`
      <kyn-button-group
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
        <kyn-button kind="tertiary" value="A">A</kyn-button>
        <kyn-button kind="tertiary" value="B">B</kyn-button>
        <kyn-button kind="tertiary" value="C">C</kyn-button>
        <kyn-button kind="tertiary" value="D">D</kyn-button>
        <kyn-button kind="tertiary" value="E">E</kyn-button>
        <kyn-button kind="tertiary" value="F">F</kyn-button>
        <kyn-button kind="tertiary" value="G">G</kyn-button>
      </kyn-button-group>
    `;
  },
  args: { ...BaseArgs, singleSelect: true, selectedIndex: 0 },
};
