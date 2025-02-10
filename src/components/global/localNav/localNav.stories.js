import { useArgs } from '@storybook/preview-api';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import './localNav';
import './localNavLink';
import '../../reusable/textInput';
import '../../reusable/blockCodeView';
import { filterLocalNavLinks } from '../../../common/helpers/helpers';

import searchIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/24/search.svg';
import sampleIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/circle-stroke.svg';

export default {
  title: 'Global Components/Local Nav',
  component: 'kyn-local-nav',
  subcomponents: {
    'kyn-local-nav-link': 'kyn-local-nav-link',
    'kyn-local-nav-divider': 'kyn-local-nav-divider',
  },
  decorators: [
    (story) =>
      html`
        <div style="min-height: 300px; margin: var(--kd-negative-page-gutter);">
          ${story()}
        </div>
      `,
  ],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/aKH1l6UGwobua14CjbWBMC/Local-Nav-1.1?node-id=602%3A18931&mode=dev',
    },
  },
};

const args = {
  pinned: false,
  textStrings: {
    pin: 'Pin',
    unpin: 'Unpin',
    toggleMenu: 'Toggle Menu',
    collapse: 'Collapse',
    menu: 'Menu',
  },
};

export const LocalNav = {
  args,
  render: (args) => {
    return html`
      <kyn-local-nav ?pinned=${args.pinned} .textStrings=${args.textStrings}>
        <kyn-local-nav-link href="javascript:void(0)" active>
          <span slot="icon">${unsafeSVG(sampleIcon)}</span>
          Link 1
        </kyn-local-nav-link>

        <kyn-local-nav-link href="javascript:void(0)">
          <span slot="icon">${unsafeSVG(sampleIcon)}</span>
          Link 2

          <kyn-local-nav-link slot="links" href="javascript:void(0)">
            <span slot="icon">${unsafeSVG(sampleIcon)}</span>
            L2 Link 1
          </kyn-local-nav-link>
          <kyn-local-nav-link slot="links" href="javascript:void(0)">
            <span slot="icon">${unsafeSVG(sampleIcon)}</span>
            L2 Link 2
          </kyn-local-nav-link>
        </kyn-local-nav-link>

        <kyn-local-nav-link href="javascript:void(0)">
          <span slot="icon">${unsafeSVG(sampleIcon)}</span>
          Link 3

          <kyn-local-nav-link slot="links" href="javascript:void(0)">
            <span slot="icon">${unsafeSVG(sampleIcon)}</span>
            L2 Link 1

            <kyn-local-nav-link slot="links" href="javascript:void(0)">
              <span slot="icon">${unsafeSVG(sampleIcon)}</span>
              L3 Link 1
            </kyn-local-nav-link>
            <kyn-local-nav-link slot="links" href="javascript:void(0)">
              <span slot="icon">${unsafeSVG(sampleIcon)}</span>
              L3 Link 2
            </kyn-local-nav-link>
          </kyn-local-nav-link>
        </kyn-local-nav-link>
      </kyn-local-nav>
    `;
  },
};

export const WithDivider = {
  args,
  render: (args) => {
    return html`
      <kyn-local-nav
        ?pinned=${args.pinned}
        pinText=${args.pinText}
        unpinText=${args.unpinText}
        .textStrings=${args.textStrings}
      >
        <kyn-local-nav-link href="javascript:void(0)" active>
          <span slot="icon">${unsafeSVG(sampleIcon)}</span>
          Link 1
        </kyn-local-nav-link>

        <kyn-local-nav-divider></kyn-local-nav-divider>

        <kyn-local-nav-link href="javascript:void(0)">
          <span slot="icon">${unsafeSVG(sampleIcon)}</span>
          Link 2
        </kyn-local-nav-link>

        <kyn-local-nav-divider
          heading="Divider with Heading"
        ></kyn-local-nav-divider>

        <kyn-local-nav-link href="javascript:void(0)">
          <span slot="icon">${unsafeSVG(sampleIcon)}</span>
          Link 3
        </kyn-local-nav-link>
      </kyn-local-nav>
    `;
  },
};

const SampleLinks = [
  {
    text: 'Link 1',
  },
  {
    text: 'Link 2',
    links: [{ text: 'Level 2 Link 1' }, { text: 'Level 2 Link 2' }],
  },
  {
    text: 'Link 3',
    links: [
      {
        text: 'Level 2 Link 1',
        links: [{ text: 'Level 3 Link 1' }, { text: 'Level 3 Link 2' }],
      },
      {
        text: 'Level 2 Link 2',
      },
    ],
  },
  {
    text: 'Link 4',
    links: [
      {
        text: 'Level 2 Link 1',
        links: [
          {
            text: 'Level 3 Link 1',
            links: [{ text: 'Level 4 Link 1' }, { text: 'Level 4 Link 2' }],
          },
          { text: 'Level 3 Link 2' },
        ],
      },
      { text: 'Level 2 Link 2' },
    ],
  },
];

export const WithSearch = {
  args: {
    ...args,
    links: SampleLinks,
    filteredLinks: SampleLinks,
  },
  render: (args) => {
    const [{ filteredLinks }, updateArgs] = useArgs();

    const handleSearch = (e) => {
      const SearchTerm = e.detail.value;
      const result = filterLocalNavLinks(args.links, SearchTerm);
      updateArgs({ filteredLinks: result });
    };

    const renderLink = (link, isSublink) => {
      return html`
        <kyn-local-nav-link
          href="javascript:void(0)"
          slot=${ifDefined(isSublink ? 'links' : undefined)}
          ?expanded=${link.expanded}
        >
          ${!isSublink
            ? html`<span slot="icon">${unsafeSVG(sampleIcon)}</span>`
            : null}
          ${link.text}
          ${link.links && link.links.length
            ? html`
                ${link.links.map((link) => {
                  return renderLink(link, true);
                })}
              `
            : null}
        </kyn-local-nav-link>
      `;
    };

    return html`
      <kyn-local-nav
        ?pinned=${args.pinned}
        pinText=${args.pinText}
        unpinText=${args.unpinText}
        .textStrings=${args.textStrings}
      >
        <kyn-text-input
          slot="search"
          size="sm"
          placeholder="Search"
          hideLabel
          @on-input=${(e) => handleSearch(e)}
        >
          ${unsafeSVG(searchIcon.split('<svg').join('<svg slot="icon"'))} Search
        </kyn-text-input>

        ${filteredLinks.map((link) => {
          return renderLink(link);
        })}
      </kyn-local-nav>

      <div class="extra-docs">
        Search/filter functionality must be implemented at the application
        level. We've
        <a
          href="https://github.com/kyndryl-design-system/shidoka-applications/blob/e328e500799e8db4fdc4441ec1f7c2504c98bc01/src/common/helpers/helpers.ts#L55"
          >included the filter function used in this story as a helper
          function</a
        >
        that can potentially be used to filter a nested array of links:

        <kyn-block-code-view
          language="javascript"
          copyButtonDescriptionAttr="Copy"
          codeSnippet="import { filterLocalNavLinks } from '@kyndryl-design-system/shidoka-applications/common/helpers/helpers'"
          copyOptionVisible
        ></kyn-block-code-view>

        <style>
          .extra-docs {
            margin: 16px;
          }

          @media (min-width: 42rem) {
            .extra-docs {
              margin: 32px;
              margin-left: 88px;
            }
          }
        </style>
      </div>
    `;
  },
};
