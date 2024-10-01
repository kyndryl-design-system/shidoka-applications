import { useArgs } from '@storybook/preview-api';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import './localNav';
import './localNavLink';
import '../../reusable/textInput';
import '@kyndryl-design-system/shidoka-foundation/components/icon';
import { filterLocalNavLinks } from '../../../common/helpers/helpers';

import searchIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/24/search.svg';
import sampleIcon from '@carbon/icons/es/circle--outline/16';

export default {
  title: 'Global Components/Local Nav',
  component: 'kyn-local-nav',
  subcomponents: {
    'kyn-local-nav-link': 'kyn-local-nav-link',
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

export const LocalNav = {
  args: {
    pinned: false,
    pinText: 'Pin',
    unpinText: 'Unpin',
    textStrings: {
      toggleMenu: 'Toggle Menu',
      collapse: 'Collapse',
      menu: 'Menu',
    },
  },
  render: (args) => {
    return html`
      <kyn-local-nav
        ?pinned=${args.pinned}
        pinText=${args.pinText}
        unpinText=${args.unpinText}
        .textStrings=${args.textStrings}
      >
        <kyn-local-nav-link href="javascript:void(0)" active>
          <kd-icon slot="icon" .icon=${sampleIcon}></kd-icon>
          Link 1
        </kyn-local-nav-link>

        <kyn-local-nav-link href="javascript:void(0)">
          <kd-icon slot="icon" .icon=${sampleIcon}></kd-icon>
          Link 2

          <kyn-local-nav-link slot="links" href="javascript:void(0)">
            <kd-icon slot="icon" .icon=${sampleIcon}></kd-icon>
            L2 Link 1
          </kyn-local-nav-link>
          <kyn-local-nav-link slot="links" href="javascript:void(0)">
            <kd-icon slot="icon" .icon=${sampleIcon}></kd-icon>
            L2 Link 2
          </kyn-local-nav-link>
        </kyn-local-nav-link>

        <kyn-local-nav-link href="javascript:void(0)" expanded>
          <kd-icon slot="icon" .icon=${sampleIcon}></kd-icon>
          Link 3

          <kyn-local-nav-link slot="links" href="javascript:void(0)">
            <kd-icon slot="icon" .icon=${sampleIcon}></kd-icon>
            L2 Link 1

            <kyn-local-nav-link slot="links" href="javascript:void(0)">
              <kd-icon slot="icon" .icon=${sampleIcon}></kd-icon>
              L3 Link 1
            </kyn-local-nav-link>
            <kyn-local-nav-link slot="links" href="javascript:void(0)">
              <kd-icon slot="icon" .icon=${sampleIcon}></kd-icon>
              L3 Link 2
            </kyn-local-nav-link>
          </kyn-local-nav-link>
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
    pinned: false,
    pinText: 'Pin',
    unpinText: 'Unpin',
    textStrings: {
      toggleMenu: 'Toggle Menu',
      collapse: 'Collapse',
      menu: 'Menu',
    },
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
            ? html`<kd-icon slot="icon" .icon=${sampleIcon}></kd-icon>`
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
    `;
  },
};
