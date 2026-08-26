import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { html } from 'lit';
import { action } from 'storybook/actions';
import './index';
import cloudDownloadDuotoneIcon from '@kyndryl-design-system/shidoka-icons/svg/duotone/48/cloud-download.svg';
import cloudDownloadMono32Icon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/32/cloud-download.svg';
import cloudDownloadMono20Icon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/cloud-download.svg';

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
  },
};

const args = {
  type: 'primary',
  headLine: '',
  pageTitle: 'Page Title',
  subTitle: '',
  aiConnected: false,
  truncationOverride: false,
  contextual: false,
  open: false,
};

const handleChange = (e) => {
  action(e.type)({ ...e, detail: e.detail });
};

const hiddenControl = { control: false, table: { disable: true } };

const basicStoryArgTypes = {
  contextual: hiddenControl,
  open: hiddenControl,
  truncationOverride: hiddenControl,
};

const contextualStoryArgTypes = {
  truncationOverride: hiddenControl,
};

const truncationStoryArgTypes = {
  contextual: hiddenControl,
  open: hiddenControl,
};

/** Duotone at primary; monotone for secondary and tertiary. */
const getPageTitleIcon = (type = 'primary') => {
  switch (type) {
    case 'secondary':
      return cloudDownloadMono32Icon;
    case 'tertiary':
      return cloudDownloadMono20Icon;
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

const renderIconSlot = (type = 'primary') =>
  html`<span slot="icon">${unsafeSVG(getPageTitleIcon(type))}</span>`;

const renderPageTitle = (args, slots = '') => html`
  <kyn-page-title
    type=${args.type}
    headLine=${args.headLine}
    pageTitle=${args.pageTitle}
    subTitle=${args.subTitle}
    ?aiConnected=${args.aiConnected}
    ?truncationOverride=${args.truncationOverride}
    ?contextual=${args.contextual}
    ?open=${args.open}
    @on-change=${handleChange}
  >
    ${slots}
  </kyn-page-title>
`;

export const PageTitle = {
  args,
  argTypes: basicStoryArgTypes,
  render: (args) => renderPageTitle(args),
};

export const WithIcon = {
  args,
  argTypes: basicStoryArgTypes,
  render: (args) => html`
    ${iconSlotStyles}
    ${renderPageTitle(args, renderIconSlot(args.type))}
  `,
};

export const AIConnected = {
  args: { ...args, aiConnected: true },
  argTypes: basicStoryArgTypes,
  render: (args) => renderPageTitle(args),
};

export const Contextual = {
  args: {
    ...args,
    pageTitle: 'Application Name',
    contextual: true,
  },
  argTypes: contextualStoryArgTypes,
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
  argTypes: contextualStoryArgTypes,
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

const typeGalleryItems = [
  { type: 'primary', heading: 'h1', pageTitle: 'Page Title' },
  { type: 'secondary', heading: 'h2', pageTitle: 'Title' },
  { type: 'tertiary', heading: 'h3', pageTitle: 'Title' },
];

export const TypeGallery = {
  name: 'Type Gallery',
  parameters: { controls: { disable: true } },
  render: () => html`
    ${iconSlotStyles}
    <style>
      .page-title-type-gallery {
        display: flex;
        flex-direction: column;
        gap: 32px;
      }
      .page-title-type-gallery__row {
        display: flex;
        align-items: center;
        gap: 24px;
      }
      .page-title-type-gallery__label {
        flex-shrink: 0;
        min-width: 168px;
        white-space: nowrap;
        color: var(--kd-color-text-level-secondary);
        font-family: var(--kd-font-family-code-view, monospace);
        font-size: 14px;
        text-transform: capitalize;
      }
    </style>
    <div class="page-title-type-gallery">
      ${typeGalleryItems.map(
        ({ type, heading, pageTitle }) => html`
          <div class="page-title-type-gallery__row">
            <span class="page-title-type-gallery__label"
              >${type} · ${heading}</span
            >
            <kyn-page-title type=${type} pageTitle=${pageTitle}>
              ${renderIconSlot(type)}
            </kyn-page-title>
          </div>
        `
      )}
    </div>
  `,
};

export const TruncationExample = {
  name: 'Truncation Example',
  args: {
    ...args,
    pageTitle: 'A long page title that will be truncated',
    subTitle:
      'Page titles truncate at 35 characters by default. Set truncationOverride to show the full title.',
  },
  argTypes: truncationStoryArgTypes,
  render: (args) => renderPageTitle(args),
};
