import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { html } from 'lit';
import { action } from 'storybook/actions';
import './index';
import { PAGE_TITLE_SIZES } from './defs';
import { createOptionsArray } from '../../../common/helpers/helpers';
import cloudDownloadDuotoneIcon from '@kyndryl-design-system/shidoka-icons/svg/duotone/48/cloud-download.svg';
import cloudDownloadMono24Icon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/24/cloud-download.svg';
import cloudDownloadMono20Icon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/cloud-download.svg';
import cloudDownloadMono16Icon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/cloud-download.svg';

export default {
  title: 'Components/Layout & Structure/Page Title',
  component: 'kyn-page-title',
  subcomponents: {
    PageTitleOption: 'kyn-pagetitle-option',
  },
  argTypes: {
    type: {
      options: ['primary', 'secondary', 'tertiary'],
      control: { type: 'select' },
    },
    size: {
      options: createOptionsArray(PAGE_TITLE_SIZES),
      control: { type: 'select' },
    },
  },
};

const args = {
  type: 'primary',
  size: PAGE_TITLE_SIZES.LARGE,
  headLine: '',
  pageTitle: 'Page Title',
  subTitle: '',
  aiConnected: false,
  contextual: false,
  open: false,
};

const handleChange = (e) => {
  action(e.type)({ ...e, detail: e.detail });
};

/** Duotone at large; monotone for medium, small, and extra-small. */
const getPageTitleIcon = (size = PAGE_TITLE_SIZES.LARGE) => {
  switch (size) {
    case PAGE_TITLE_SIZES.MEDIUM:
      return cloudDownloadMono24Icon;
    case PAGE_TITLE_SIZES.SMALL:
      return cloudDownloadMono20Icon;
    case PAGE_TITLE_SIZES.EXTRA_SMALL:
      return cloudDownloadMono16Icon;
    default:
      return cloudDownloadDuotoneIcon;
  }
};

const iconSlotStyles = html`
  <style>
    kyn-page-title [slot='icon'] svg {
      width: 100%;
      height: 100%;
    }
  </style>
`;

const renderIconSlot = (size) =>
  html`<span slot="icon">${unsafeSVG(getPageTitleIcon(size))}</span>`;

const renderPageTitle = (args, slots = '') => html`
  <kyn-page-title
    type=${args.type}
    size=${args.size}
    headLine=${args.headLine}
    pageTitle=${args.pageTitle}
    subTitle=${args.subTitle}
    ?aiConnected=${args.aiConnected}
    ?contextual=${args.contextual}
    ?open=${args.open}
    @on-change=${handleChange}
  >
    ${slots}
  </kyn-page-title>
`;

export const PageTitle = {
  args,
  argTypes: {
    contextual: { control: false, table: { disable: true } },
  },
  render: (args) => renderPageTitle(args),
};

export const WithIcon = {
  args,
  argTypes: {
    contextual: { control: false, table: { disable: true } },
  },
  render: (args) => html`
    ${iconSlotStyles}
    ${renderPageTitle(args, renderIconSlot(args.size))}
  `,
};

export const AIConnected = {
  args: { ...args, aiConnected: true },
  argTypes: {
    contextual: { control: false, table: { disable: true } },
  },
  render: (args) => renderPageTitle(args),
};

export const Contextual = {
  args: {
    ...args,
    pageTitle: 'Application Name',
    contextual: true,
  },
  render: (args) =>
    renderPageTitle(
      args,
      html`
        <kyn-pagetitle-option value="app-1">Application 1</kyn-pagetitle-option>
        <kyn-pagetitle-option value="app-2">Application 2</kyn-pagetitle-option>
        <kyn-pagetitle-option value="app-3">Application 3</kyn-pagetitle-option>
      `
    ),
};

export const ContextualWithSubtitle = {
  args: {
    ...args,
    pageTitle: 'Application Name',
    subTitle: 'Application subtitle description',
    contextual: true,
  },
  render: (args) =>
    renderPageTitle(
      args,
      html`
        <kyn-pagetitle-option value="app-1">Application 1</kyn-pagetitle-option>
        <kyn-pagetitle-option value="app-2">Application 2</kyn-pagetitle-option>
        <kyn-pagetitle-option value="app-3">Application 3</kyn-pagetitle-option>
      `
    ),
};

const sizeGalleryItems = [
  { size: PAGE_TITLE_SIZES.LARGE, heading: 'h1', pageTitle: 'Page Title' },
  { size: PAGE_TITLE_SIZES.MEDIUM, heading: 'h2', pageTitle: 'Title' },
  { size: PAGE_TITLE_SIZES.SMALL, heading: 'h3', pageTitle: 'Title' },
  {
    size: PAGE_TITLE_SIZES.EXTRA_SMALL,
    heading: 'h4',
    pageTitle: 'Title',
  },
];

export const SizeGallery = {
  name: 'Size Gallery',
  parameters: { controls: { disable: true } },
  render: () => html`
    ${iconSlotStyles}
    <style>
      .page-title-size-gallery {
        display: flex;
        flex-direction: column;
        gap: 32px;
      }
      .page-title-size-gallery__row {
        display: flex;
        align-items: center;
        gap: 24px;
      }
      .page-title-size-gallery__label {
        flex-shrink: 0;
        min-width: 168px;
        white-space: nowrap;
        color: var(--kd-color-text-level-secondary);
        font-family: var(--kd-font-family-code-view, monospace);
        font-size: 14px;
        text-transform: capitalize;
      }
    </style>
    <div class="page-title-size-gallery">
      ${sizeGalleryItems.map(
        ({ size, heading, pageTitle }) => html`
          <div class="page-title-size-gallery__row">
            <span class="page-title-size-gallery__label">${size} · ${heading}</span>
            <kyn-page-title size=${size} pageTitle=${pageTitle}>
              ${renderIconSlot(size)}
            </kyn-page-title>
          </div>
        `
      )}
    </div>
  `,
};
