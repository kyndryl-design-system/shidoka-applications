import { html } from 'lit';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';

import starFilledIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/recommend-filled.svg';
import starOutlineIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/recommend.svg';
import historyIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/history.svg';
import catalogIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/catalog-management.svg';
import consoleIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/console.svg';
import servicesIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/services.svg';
import adminIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/user-settings.svg';
import launchIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/launch.svg';
import circleIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/circle-stroke.svg';
import homeIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/home.svg';
import dashboardIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/dashboard.svg';

import {
  GLOBAL_SWITCHER_EQUAL_TAB_STYLE,
  GLOBAL_SWITCHER_PATTERN_STYLES,
} from './globalSwitcherPatternStyles.js';

export const globalSwitcherIconMap = {
  'recommend-filled': starFilledIcon,
  recommend: starOutlineIcon,
  history: historyIcon,
  'catalog-management': catalogIcon,
  console: consoleIcon,
  services: servicesIcon,
  'user-settings': adminIcon,
  launch: launchIcon,
  'circle-stroke': circleIcon,
  home: homeIcon,
  dashboard: dashboardIcon,
};

export const globalSwitcherPatternStyles = html`
  <style>
    ${GLOBAL_SWITCHER_PATTERN_STYLES}
  </style>
`;

const iconSvg = (key) => unsafeSVG(globalSwitcherIconMap[key] ?? circleIcon);

export const createStarSelector = (checked = false) => html`
  <kyn-icon-selector ?checked=${checked}>
    <span slot="icon-unchecked">${unsafeSVG(starOutlineIcon)}</span>
    <span slot="icon-checked">${unsafeSVG(starFilledIcon)}</span>
  </kyn-icon-selector>
`;

export const renderGlobalSwitcherLink = (link) => html`
  <kyn-header-link
    href=${link.href}
    ?truncate=${link.target === '_blank'}
    target=${link.target || ''}
  >
    ${link.icon
      ? html`<span class="global-switcher-link-label">
          <span class="global-switcher-link-icon">${iconSvg(link.icon)}</span>
          ${link.label}
        </span>`
      : html`<span>${link.label}</span>`}
    ${createStarSelector(link.starred || false)}
    ${link.target === '_blank'
      ? html`<span class="global-switcher-external-icon"
          >${unsafeSVG(launchIcon)}</span
        >`
      : ''}
  </kyn-header-link>
`;

export const renderGlobalSwitcherCategory = (
  category,
  { spaced = false } = {}
) => html`
  <kyn-header-category
    heading=${category.heading}
    class=${spaced ? 'global-switcher-category--spaced' : undefined}
  >
    <span slot="icon">${iconSvg(category.icon || 'circle-stroke')}</span>
    ${category.links.map((link) => renderGlobalSwitcherLink(link))}
  </kyn-header-category>
`;

const renderSectionTrigger = (section) => html`
  <span>${iconSvg(section.icon)}</span>
  ${section.label}
`;

const renderLinksSlot = {
  simple: (section) => html`
    <kyn-header-category slot="links">
      ${section.links.map((link) => renderGlobalSwitcherLink(link))}
    </kyn-header-category>
  `,
  mixed: (section) => html`
    <div slot="links" class="global-switcher-mixed-links">
      ${section.topLinks.map((link) => renderGlobalSwitcherLink(link))}
      ${section.categories.map((category) =>
        renderGlobalSwitcherCategory(category, { spaced: true })
      )}
    </div>
  `,
  tabbed: (section) => html`
    <kyn-tabs tabSize="md" slot="links" class="global-switcher-tabs">
      ${section.tabs.map(
        (tab, index) => html`
          <kyn-tab
            slot="tabs"
            id=${tab.id}
            fill-width
            style=${GLOBAL_SWITCHER_EQUAL_TAB_STYLE}
            ?selected=${index === 0}
          >
            ${tab.label}
          </kyn-tab>
        `
      )}
      ${section.tabs.map(
        (tab, index) => html`
          <kyn-tab-panel tabId=${tab.id} noPadding ?visible=${index === 0}>
            <kyn-header-categories layout="masonry" .limitRootLinks=${false}>
              ${tab.categories.map((category) =>
                renderGlobalSwitcherCategory(category)
              )}
            </kyn-header-categories>
          </kyn-tab-panel>
        `
      )}
    </kyn-tabs>
  `,
  categorical: (section) => html`
    <kyn-header-categories
      slot="links"
      layout="masonry"
      maxColumns=${section.maxColumns || 3}
      .limitRootLinks=${false}
    >
      ${section.categories.map((category) =>
        renderGlobalSwitcherCategory(category)
      )}
    </kyn-header-categories>
  `,
};

export const renderGlobalSwitcherSection = (section) => html`
  <kyn-header-link
    id=${section.id}
    href="javascript:void(0)"
    ?hideSearch=${section.hideSearch}
    ?full-width-flyout=${section.type === 'tabbed'}
  >
    ${renderSectionTrigger(section)} ${renderLinksSlot[section.type]?.(section)}
  </kyn-header-link>
  ${section.dividerAfter ? html`<kyn-header-divider></kyn-header-divider>` : ''}
`;

export const renderGlobalSwitcherNav = (
  navData,
  { autoOpenFlyout = 'favorites', truncateLinks = true } = {}
) => html`
  <kyn-header-nav
    class="global-switcher-nav"
    auto-open-flyout=${autoOpenFlyout}
    ?truncate-links=${truncateLinks}
  >
    ${navData.sections.map((section) => renderGlobalSwitcherSection(section))}
  </kyn-header-nav>
`;

export const renderGlobalSwitcherHeader = (
  navData,
  {
    rootUrl = '/',
    appTitle = 'Application',
    logoSvg = null,
    autoOpenFlyout = 'favorites',
    truncateLinks = true,
  } = {}
) => html`
  ${globalSwitcherPatternStyles}
  <kyn-header rootUrl=${rootUrl} appTitle=${appTitle}>
    ${logoSvg
      ? html`<span slot="logo" style="--kyn-header-logo-width: 120px;"
          >${unsafeSVG(logoSvg)}</span
        >`
      : html`<span slot="logo" style="--kyn-header-logo-width: 120px;"></span>`}
    ${renderGlobalSwitcherNav(navData, { autoOpenFlyout, truncateLinks })}
  </kyn-header>
`;
