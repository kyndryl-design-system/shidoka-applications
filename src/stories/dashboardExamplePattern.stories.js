import { html } from 'lit';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import '../components/global/uiShell';
import '../components/global/header';
import '../components/global/localNav';
import '../components/global/footer';
import '../components/reusable/badge';
import '../components/reusable/button';
import '../components/reusable/iconSelector';
import '../components/reusable/link';
import '../components/reusable/pagetitle';
import '../components/reusable/tabs';
import '../components/reusable/widget';
import '@kyndryl-design-system/shidoka-charts/components/chart';
import '@kyndryl-cto/shidoka-studio/styles/shell-overlays.css';

import navData from './globalSwitcher/example_global_switcher_data.json';
import trellisPattern from './dashboardExamplePatternTrellis.svg';
import { WorkspaceSwitcherPattern } from './workspaceSwitcher/WorkspaceSwitcher.stories.js';

import bridgeLogo from '@kyndryl-design-system/shidoka-foundation/assets/svg/bridge-logo-large.svg';
import insightsIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/actionable-insights.svg';
import adminIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/user-settings.svg';
import catalogIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/catalog-management.svg';
import chevronDownIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/chevron-down.svg';
import circleIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/circle-stroke.svg';
import consoleIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/console.svg';
import dashboardIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/dashboard.svg';
import historyIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/history.svg';
import homeIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/home.svg';
import informationIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/information.svg';
import launchIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/launch.svg';
import notificationIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/notification.svg';
import servicesIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/services.svg';
import settingsIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/settings.svg';
import starFilledIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/recommend-filled.svg';
import starOutlineIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/recommend.svg';
import userAvatarIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/user.svg';

const iconMap = {
  'catalog-management': catalogIcon,
  'circle-stroke': circleIcon,
  console: consoleIcon,
  dashboard: dashboardIcon,
  history: historyIcon,
  home: homeIcon,
  launch: launchIcon,
  recommend: starOutlineIcon,
  'recommend-filled': starFilledIcon,
  services: servicesIcon,
  'user-settings': adminIcon,
};

const DASHBOARD_STYLES = /* css */ `
  .ui-shell-dashboard-demo {
    position: relative;
    isolation: isolate;
    min-height: 100vh;
    margin: var(--kd-negative-page-gutter);
    background: var(--kd-color-background-page-default);
  }

  .ui-shell-dashboard-demo::before {
    position: absolute;
    z-index: 0;
    inset-block-start: var(--kd-header-height, 56px);
    inset-inline: 0;
    height: min(38vh, 360px);
    content: '';
    background: var(--kd-color-background-container-soft);
    -webkit-mask-image: linear-gradient(to bottom, #000 0 38%, transparent 100%);
    mask-image: linear-gradient(to bottom, #000 0 38%, transparent 100%);
    pointer-events: none;
  }

  .dashboard-main {
    position: relative;
    min-height: 100vh;
    overflow: hidden;
    padding: max(var(--kd-shell-header-clearance, 0px), 2rem)
      var(--kd-page-gutter, 2rem) calc(var(--kd-page-gutter, 2rem) + 2rem);
  }

  .dashboard-main::before {
    position: absolute;
    inset: 0 0 auto;
    height: min(38vh, 360px);
    content: '';
    pointer-events: none;
  }

  .dashboard-main::after {
    position: absolute;
    inset: calc(min(38vh, 360px) - 120px) 0 auto;
    height: 160px;
    content: '';
    background: linear-gradient(
      to bottom,
      rgb(255 255 255 / 0%),
      var(--kd-color-background-page-default)
    );
    pointer-events: none;
  }

  .dashboard-content {
    position: relative;
    z-index: 1;
    align-items: start;
  }

  .dashboard-trellis {
    position: absolute;
    z-index: 1;
    inset-block-start: 0;
    inset-inline-end: 0;
    width: min(62vw, 980px);
    height: min(38vh, 360px);
    color: var(--kd-color-opacity-ai-warm-red-50);
    overflow: hidden;
    -webkit-mask-image: linear-gradient(to bottom, #000 0 34%, transparent 100%);
    mask-image: linear-gradient(to bottom, #000 0 34%, transparent 100%);
    pointer-events: none;
  }

  .dashboard-trellis svg {
    display: block;
    width: auto;
    height: 100%;
    max-width: none;
    margin-inline-start: auto;
  }

  .dashboard-hero {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1.5rem;
    margin-bottom: 0.5rem;
  }

  .dashboard-hero-actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
    gap: 0.75rem;
    padding-top: 0.5rem;
  }

  .dashboard-kpis {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 1rem;
  }

  .dashboard-kpi {
    display: flex;
    min-height: 116px;
    flex-direction: column;
    gap: 0.75rem;
    padding: 1rem;
    background: var(--kd-color-background-container-default);
    border: 1px solid var(--kd-color-border-variants-light);
    border-radius: 8px;
    box-shadow: var(--kd-elevation-level-1);
  }

  .dashboard-kpi__label {
    color: var(--kd-color-text-level-secondary);
  }

  .dashboard-kpi__value {
    color: var(--kd-color-text-level-primary);
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 300;
    line-height: 1;
  }

  .dashboard-kpi__meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
  }

  .dashboard-chart-cell {
    min-height: 420px;
  }

  .dashboard-chart-cell kyn-widget {
    height: 100%;
  }

  .dashboard-chart-body {
    display: flex;
    min-height: 100%;
    height: 100%;
    flex-direction: column;
    gap: 0.75rem;
  }

  .dashboard-chart-host {
    display: block;
    flex: 1;
    min-height: 320px;
    width: 100%;
  }

  .dashboard-chart-host kd-chart {
    display: block;
    width: 100%;
  }

  .dashboard-chart-cell--radar .dashboard-chart-host {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .dashboard-chart-cell--radar .dashboard-chart-host kd-chart {
    width: min(100%, 560px);
  }

  .dashboard-widget-footer {
    display: flex;
    flex-shrink: 0;
    justify-content: flex-end;
    margin-top: auto;
    padding-block-start: 0.5rem;
  }

  .account-name {
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .account-chevron,
  .header-icon,
  .local-nav-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .account-chevron svg,
  .header-icon svg {
    display: block;
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }

  .local-nav-icon svg {
    display: block;
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }

  .account-chevron {
    transition: transform 0.2s;
  }

  .ui-impl-switcher {
    width: 625px;
    min-width: 625px;
    max-width: calc(100vw - 2rem);
  }

  .flyout-action-list,
  .user-flyout-card {
    display: flex;
    flex-direction: column;
    min-width: 240px;
    padding: 0.75rem;
  }

  .flyout-action-list {
    gap: 0.25rem;
  }

  .user-flyout-card {
    align-items: stretch;
    gap: 0.75rem;
  }

  .user-flyout-card .flyout-action-list {
    min-width: 0;
    padding: 0;
  }

  @media (max-width: calc(82rem - 0.001px)) {
    .dashboard-kpis {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: calc(52rem - 0.001px)) {
    .dashboard-hero {
      flex-direction: column;
    }

    .dashboard-hero-actions {
      justify-content: flex-start;
      width: 100%;
    }

    .ui-impl-switcher {
      width: min(375px, calc(100vw - 2rem));
      min-width: 0;
    }

    .account-chevron {
      display: none;
    }
  }

  @media (max-width: calc(42rem - 0.001px)) {
    .dashboard-main {
      padding-inline: 1rem;
    }

    .dashboard-kpis {
      grid-template-columns: 1fr;
    }

    .dashboard-chart-cell {
      min-height: 380px;
    }
  }
`;

const createStorySource = (markup, styles) =>
  `<style>\n${styles.trim()}\n</style>\n\n${markup.trim()}`;

const escapeSource = (value = '') =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');

const indentSource = (markup, spaces = 2) => {
  const prefix = ' '.repeat(spaces);
  return markup
    .split('\n')
    .map((line) => (line ? `${prefix}${line}` : line))
    .join('\n');
};

const createSourceIcon = (icon, slot = '', className = '') => {
  const slotAttr = slot ? ` slot="${slot}"` : '';
  const classAttr = className ? ` class="${className}"` : '';
  return `<span${slotAttr}${classAttr}><!-- ${escapeSource(
    icon
  )} icon --></span>`;
};

const createSourceStarSelector = (checked = false) =>
  [
    `<kyn-icon-selector${checked ? ' checked' : ''}>`,
    '  <span slot="icon-unchecked"><!-- recommend icon --></span>',
    '  <span slot="icon-checked"><!-- recommend-filled icon --></span>',
    '</kyn-icon-selector>',
  ].join('\n');

const createGlobalSwitcherLinkSource = (link) => {
  const attrs = [
    `href="${escapeSource(link.href || 'javascript:void(0)')}"`,
    link.target ? `target="${escapeSource(link.target)}"` : '',
    link.target === '_blank' ? 'truncate' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const content = [
    link.icon
      ? [
          '<span style="display: inline-flex; align-items: center; gap: 8px;">',
          `  ${createSourceIcon(link.icon, '', 'global-switcher-icon')}`,
          `  ${escapeSource(link.label)}`,
          '</span>',
        ].join('\n')
      : `<span>${escapeSource(link.label)}</span>`,
    createSourceStarSelector(link.starred || false),
    link.target === '_blank'
      ? createSourceIcon('launch', '', 'global-switcher-launch-icon')
      : '',
  ]
    .filter(Boolean)
    .map((line) => indentSource(line, 2))
    .join('\n');

  return [`<kyn-header-link ${attrs}>`, content, '</kyn-header-link>'].join(
    '\n'
  );
};

const createGlobalSwitcherCategorySource = (category) =>
  [
    `<kyn-header-category heading="${escapeSource(category.heading)}">`,
    indentSource(createSourceIcon(category.icon || 'circle-stroke', 'icon'), 2),
    indentSource(
      category.links
        .map((link) => createGlobalSwitcherLinkSource(link))
        .join('\n'),
      2
    ),
    '</kyn-header-category>',
  ].join('\n');

const createSimpleGlobalSwitcherSectionSource = (section) =>
  [
    `<kyn-header-link id="${escapeSource(
      section.id
    )}" href="javascript:void(0)"${section.hideSearch ? ' hideSearch' : ''}>`,
    indentSource(createSourceIcon(section.icon), 2),
    indentSource(escapeSource(section.label), 2),
    indentSource('<kyn-header-category slot="links">', 2),
    indentSource(
      section.links
        .map((link) => createGlobalSwitcherLinkSource(link))
        .join('\n'),
      4
    ),
    indentSource('</kyn-header-category>', 2),
    '</kyn-header-link>',
    section.dividerAfter ? '<kyn-header-divider></kyn-header-divider>' : '',
  ]
    .filter(Boolean)
    .join('\n');

const createMixedGlobalSwitcherSectionSource = (section) =>
  [
    `<kyn-header-link id="${escapeSource(
      section.id
    )}" href="javascript:void(0)"${section.hideSearch ? ' hideSearch' : ''}>`,
    indentSource(createSourceIcon(section.icon), 2),
    indentSource(escapeSource(section.label), 2),
    indentSource(
      [
        '<div slot="links" style="display: flex; flex-direction: column; gap: 2px;">',
        indentSource(
          [
            ...section.topLinks.map((link) =>
              createGlobalSwitcherLinkSource(link)
            ),
            ...section.categories.map((category) =>
              createGlobalSwitcherCategorySource(category)
            ),
          ].join('\n'),
          2
        ),
        '</div>',
      ].join('\n'),
      2
    ),
    '</kyn-header-link>',
  ].join('\n');

const createTabbedGlobalSwitcherSectionSource = (section) =>
  [
    `<kyn-header-link id="${escapeSource(
      section.id
    )}" href="javascript:void(0)" full-width-flyout>`,
    indentSource(createSourceIcon(section.icon), 2),
    indentSource(escapeSource(section.label), 2),
    indentSource(
      [
        '<kyn-tabs tabSize="md" slot="links" style="width: 100%; max-width: none; --global-switcher-tab-width: 170px;">',
        indentSource(
          section.tabs
            .map(
              (tab, index) => `<kyn-tab
  slot="tabs"
  id="${escapeSource(tab.id)}"
  fill-width
  style="width: var(--global-switcher-tab-width); flex: 0 0 var(--global-switcher-tab-width);"${
    index === 0 ? '\n  selected' : ''
  }
>
  ${escapeSource(tab.label)}
</kyn-tab>`
            )
            .join('\n'),
          2
        ),
        indentSource(
          section.tabs
            .map(
              (tab, index) => `<kyn-tab-panel tabId="${escapeSource(
                tab.id
              )}" noPadding${index === 0 ? ' visible' : ''}>
  <kyn-header-categories layout="masonry">
${indentSource(
  tab.categories
    .map((category) => createGlobalSwitcherCategorySource(category))
    .join('\n'),
  4
)}
  </kyn-header-categories>
</kyn-tab-panel>`
            )
            .join('\n'),
          2
        ),
        '</kyn-tabs>',
      ].join('\n'),
      2
    ),
    '</kyn-header-link>',
  ].join('\n');

const createCategoricalGlobalSwitcherSectionSource = (section) =>
  [
    `<kyn-header-link id="${escapeSource(
      section.id
    )}" href="javascript:void(0)"${section.hideSearch ? ' hideSearch' : ''}>`,
    indentSource(createSourceIcon(section.icon), 2),
    indentSource(escapeSource(section.label), 2),
    indentSource(
      [
        `<kyn-header-categories slot="links" layout="masonry" maxColumns="${
          section.maxColumns || 3
        }">`,
        indentSource(
          section.categories
            .map((category) => createGlobalSwitcherCategorySource(category))
            .join('\n'),
          2
        ),
        '</kyn-header-categories>',
      ].join('\n'),
      2
    ),
    '</kyn-header-link>',
  ].join('\n');

const createGlobalSwitcherSectionSource = (section) => {
  switch (section.type) {
    case 'simple':
      return createSimpleGlobalSwitcherSectionSource(section);
    case 'mixed':
      return createMixedGlobalSwitcherSectionSource(section);
    case 'tabbed':
      return createTabbedGlobalSwitcherSectionSource(section);
    case 'categorical':
      return createCategoricalGlobalSwitcherSectionSource(section);
    default:
      return '';
  }
};

const createFlyoutActionLinkSource = (label) =>
  [
    '<kyn-header-link href="javascript:void(0)">',
    `  ${escapeSource(label)}`,
    '</kyn-header-link>',
  ].join('\n');

const createKpiSource = (kpi) => `<div class="dashboard-kpi">
  <span class="dashboard-kpi__label kd-type--ui-02">${escapeSource(
    kpi.label
  )}</span>
  <span class="dashboard-kpi__value">${escapeSource(kpi.value)}</span>
  <div class="dashboard-kpi__meta">
    <kyn-badge label="${escapeSource(kpi.statusLabel)}" status="${escapeSource(
  kpi.status
)}" hideIcon></kyn-badge>
    <span class="kd-type--ui-04">${escapeSource(kpi.meta)}</span>
  </div>
</div>`;

const starSelector = (checked = false) => html`
  <kyn-icon-selector ?checked=${checked}>
    <span slot="icon-unchecked">${unsafeSVG(starOutlineIcon)}</span>
    <span slot="icon-checked">${unsafeSVG(starFilledIcon)}</span>
  </kyn-icon-selector>
`;

const renderGlobalSwitcherLink = (link) => html`
  <kyn-header-link
    href=${link.href}
    ?truncate=${link.target === '_blank'}
    target=${link.target || ''}
  >
    ${link.icon
      ? html`<span style="display: inline-flex; align-items: center; gap: 8px;">
          <span style="display: flex; flex-shrink: 0; margin-top: -2px;">
            ${unsafeSVG(iconMap[link.icon])}
          </span>
          ${link.label}
        </span>`
      : html`<span>${link.label}</span>`}
    ${starSelector(link.starred || false)}
    ${link.target === '_blank'
      ? html`<span
          style="display: flex; width: 16px; height: 16px; flex-shrink: 0;"
          >${unsafeSVG(launchIcon)}</span
        >`
      : ''}
  </kyn-header-link>
`;

const renderGlobalSwitcherCategory = (category) => html`
  <kyn-header-category heading=${category.heading}>
    <span slot="icon">
      ${unsafeSVG(category.icon ? iconMap[category.icon] : circleIcon)}
    </span>
    ${category.links.map((link) => renderGlobalSwitcherLink(link))}
  </kyn-header-category>
`;

const renderSimpleGlobalSwitcherSection = (section) => html`
  <kyn-header-link
    id=${section.id}
    href="javascript:void(0)"
    ?hideSearch=${section.hideSearch}
  >
    <span>${unsafeSVG(iconMap[section.icon])}</span>
    ${section.label}

    <kyn-header-category slot="links">
      ${section.links.map((link) => renderGlobalSwitcherLink(link))}
    </kyn-header-category>
  </kyn-header-link>
  ${section.dividerAfter ? html`<kyn-header-divider></kyn-header-divider>` : ''}
`;

const renderMixedGlobalSwitcherSection = (section) => html`
  <kyn-header-link
    id=${section.id}
    href="javascript:void(0)"
    ?hideSearch=${section.hideSearch}
  >
    <span>${unsafeSVG(iconMap[section.icon])}</span>
    ${section.label}

    <div slot="links" style="display: flex; flex-direction: column; gap: 2px;">
      ${section.topLinks.map((link) => renderGlobalSwitcherLink(link))}
      ${section.categories.map(
        (category) => html`
          <kyn-header-category
            heading=${category.heading}
            style="margin-top: 8px;"
          >
            <span slot="icon">
              ${unsafeSVG(category.icon ? iconMap[category.icon] : circleIcon)}
            </span>
            ${category.links.map((link) => renderGlobalSwitcherLink(link))}
          </kyn-header-category>
        `
      )}
    </div>
  </kyn-header-link>
`;

const renderTabbedGlobalSwitcherSection = (section) => html`
  <kyn-header-link id=${section.id} href="javascript:void(0)" full-width-flyout>
    <span>${unsafeSVG(iconMap[section.icon])}</span>
    ${section.label}

    <kyn-tabs
      tabSize="md"
      slot="links"
      style="width: 100%; max-width: none; --global-switcher-tab-width: 170px;"
    >
      ${section.tabs.map(
        (tab, index) => html`
          <kyn-tab
            slot="tabs"
            id=${tab.id}
            fill-width
            style="width: var(--global-switcher-tab-width); flex: 0 0 var(--global-switcher-tab-width);"
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
  </kyn-header-link>
`;

const renderCategoricalGlobalSwitcherSection = (section) => html`
  <kyn-header-link
    id=${section.id}
    href="javascript:void(0)"
    ?hideSearch=${section.hideSearch}
  >
    <span>${unsafeSVG(iconMap[section.icon])}</span>
    ${section.label}

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
  </kyn-header-link>
`;

const renderGlobalSwitcherSection = (section) => {
  switch (section.type) {
    case 'simple':
      return renderSimpleGlobalSwitcherSection(section);
    case 'mixed':
      return renderMixedGlobalSwitcherSection(section);
    case 'tabbed':
      return renderTabbedGlobalSwitcherSection(section);
    case 'categorical':
      return renderCategoricalGlobalSwitcherSection(section);
    default:
      return '';
  }
};

const renderShellHeader = () => html`
  <kyn-header rootUrl="/" appTitle="Dashboard">
    <span slot="logo" style="--kyn-header-logo-width: 120px;">
      ${unsafeSVG(bridgeLogo)}
    </span>
    <kyn-header-nav
      truncate-links
      style="--kyn-icon-selector-animate-selection: 1; --kyn-icon-selector-only-visible-on-hover: 1; --kyn-icon-selector-persist-when-checked: 1;"
    >
      ${navData.sections.map((section) => renderGlobalSwitcherSection(section))}
    </kyn-header-nav>

    <kyn-header-flyouts>
      <kyn-header-flyout
        label="Workspaces"
        hideMenuLabel
        hideButtonLabel
        noPadding
        @on-flyout-toggle=${WorkspaceSwitcherPattern.handleFlyoutToggle}
      >
        <span
          slot="button"
          style="display: flex; align-items: center; gap: 8px; font-size: 14px;"
        >
          <span class="account-name">Workspaces</span>
          <span class="account-chevron">${unsafeSVG(chevronDownIcon)}</span>
        </span>

        <div class="ui-impl-switcher">
          ${WorkspaceSwitcherPattern.createStandalonePattern(
            WorkspaceSwitcherPattern.args,
            {
              withFlyout: true,
            }
          )}
        </div>
      </kyn-header-flyout>

      <kyn-header-flyout label="Notifications" hideMenuLabel>
        <span slot="button" class="header-icon">
          ${unsafeSVG(notificationIcon)}
        </span>

        <div class="flyout-action-list">
          <kyn-header-link href="javascript:void(0)">
            Notification center
          </kyn-header-link>
          <kyn-header-link href="javascript:void(0)">
            Alert preferences
          </kyn-header-link>
          <kyn-header-link href="javascript:void(0)">
            Mark all as read
          </kyn-header-link>
        </div>
      </kyn-header-flyout>

      <kyn-header-flyout label="Help">
        <span slot="button" class="header-icon">
          ${unsafeSVG(informationIcon)}
        </span>

        <div class="flyout-action-list">
          <kyn-header-link href="javascript:void(0)">
            Documentation
          </kyn-header-link>
          <kyn-header-link href="javascript:void(0)"> Support </kyn-header-link>
          <kyn-header-link href="javascript:void(0)">
            Release notes
          </kyn-header-link>
        </div>
      </kyn-header-flyout>

      <kyn-header-flyout label="User Profile" hideMenuLabel>
        <span slot="button" class="header-icon">
          ${unsafeSVG(userAvatarIcon)}
        </span>

        <div class="user-flyout-card">
          <kyn-header-user-profile
            name="User Name"
            subtitle="Job Title"
            email="user@kyndryl.com"
            profileLink="#"
          >
            <img src="https://picsum.photos/id/237/112/112" alt="User Name" />
          </kyn-header-user-profile>

          <div class="flyout-action-list">
            <kyn-header-link href="javascript:void(0)">
              Profile settings
            </kyn-header-link>
            <kyn-header-link href="javascript:void(0)">
              Account settings
            </kyn-header-link>
            <kyn-header-link href="javascript:void(0)">
              Sign out
            </kyn-header-link>
          </div>
        </div>
      </kyn-header-flyout>
    </kyn-header-flyouts>
  </kyn-header>
`;

const renderLocalNav = () => html`
  <kyn-local-nav>
    <kyn-local-nav-link href="javascript:void(0)" active>
      <span slot="icon" class="local-nav-icon"
        >${unsafeSVG(dashboardIcon)}</span
      >
      Dashboard
    </kyn-local-nav-link>
    <kyn-local-nav-link href="javascript:void(0)">
      <span slot="icon" class="local-nav-icon">${unsafeSVG(insightsIcon)}</span>
      Insights
    </kyn-local-nav-link>
    <kyn-local-nav-link href="javascript:void(0)">
      <span slot="icon" class="local-nav-icon">${unsafeSVG(servicesIcon)}</span>
      Services
    </kyn-local-nav-link>
    <kyn-local-nav-link href="javascript:void(0)">
      <span slot="icon" class="local-nav-icon">${unsafeSVG(settingsIcon)}</span>
      Settings
    </kyn-local-nav-link>
  </kyn-local-nav>
`;

const kpis = [
  {
    label: 'Recommendations',
    value: '84',
    status: 'success',
    statusLabel: 'Healthy',
    meta: 'Increased by 12%',
  },
  {
    label: 'Input data quality',
    value: '92%',
    status: 'info',
    statusLabel: 'Stable',
    meta: 'Across 18 sources',
  },
  {
    label: 'Interference time',
    value: '18%',
    status: 'warning',
    statusLabel: 'Review',
    meta: 'Decreased by 4%',
  },
  {
    label: 'Uptime',
    value: '99.7%',
    status: 'success',
    statusLabel: 'On target',
    meta: 'Last 30 days',
  },
];

const cartesianOptions = (xTitle, yTitle) => ({
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: xTitle,
      },
    },
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: yTitle,
      },
    },
  },
});

const radarOptions = {
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
    },
  },
  scales: {
    r: {
      beginAtZero: true,
      suggestedMax: 100,
    },
  },
};

const chartData = [
  {
    title: 'Recommendation health',
    subtitle: 'AI recommendation confidence over time',
    type: 'line',
    className: 'kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-4',
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    datasets: [
      {
        label: 'Current',
        data: [64, 72, 68, 81, 78, 86],
      },
      {
        label: 'Previous',
        data: [58, 65, 62, 70, 74, 79],
      },
    ],
    options: cartesianOptions('Day', 'Score'),
  },
  {
    title: 'Container growth',
    subtitle: 'Container count by environment',
    type: 'bar',
    className: 'kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-4',
    labels: ['Dev', 'Test', 'Stage', 'Prod', 'DR'],
    datasets: [
      {
        label: 'Linux',
        data: [32, 41, 38, 56, 24],
      },
      {
        label: 'Windows',
        data: [18, 24, 21, 31, 16],
      },
    ],
    options: cartesianOptions('Environment', 'Containers'),
  },
  {
    title: 'Service readiness',
    subtitle: 'Readiness dimensions by domain',
    type: 'radar',
    className: 'kd-grid__col--sm-4 kd-grid__col--md-8 kd-grid__col--lg-4',
    labels: ['Security', 'Cost', 'Resiliency', 'Capacity', 'Compliance'],
    datasets: [
      {
        label: 'Current',
        data: [82, 76, 88, 71, 84],
      },
      {
        label: 'Target',
        data: [90, 86, 92, 84, 90],
      },
    ],
    options: radarOptions,
  },
  {
    title: 'Inference latency',
    subtitle: 'Median and p95 latency by day',
    type: 'line',
    className: 'kd-grid__col--sm-4 kd-grid__col--md-8 kd-grid__col--lg-8',
    labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    datasets: [
      {
        label: 'Median',
        data: [220, 214, 236, 228, 218, 211, 205],
      },
      {
        label: 'p95',
        data: [360, 342, 388, 352, 330, 318, 310],
      },
    ],
    options: cartesianOptions('Day', 'Milliseconds'),
  },
  {
    title: 'Feature drift',
    subtitle: 'Signals outside expected tolerance',
    type: 'bar',
    className: 'kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-4',
    labels: ['Model A', 'Model B', 'Model C', 'Model D'],
    datasets: [
      {
        label: 'Observed',
        data: [12, 8, 17, 10],
      },
      {
        label: 'Threshold',
        data: [10, 10, 10, 10],
      },
    ],
    options: cartesianOptions('Model', 'Signals'),
  },
  {
    title: 'Coverage profile',
    subtitle: 'Operational coverage by capability',
    type: 'radar',
    className: 'kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-6',
    labels: ['Observe', 'Recover', 'Optimize', 'Secure', 'Govern', 'Automate'],
    datasets: [
      {
        label: 'Coverage',
        data: [86, 74, 68, 91, 79, 72],
      },
      {
        label: 'Goal',
        data: [90, 85, 82, 94, 88, 86],
      },
    ],
    options: radarOptions,
  },
  {
    title: 'Cost optimization',
    subtitle: 'Estimated savings trend',
    type: 'line',
    className: 'kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-6',
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Realized',
        data: [18, 24, 31, 37, 45, 52],
      },
      {
        label: 'Forecast',
        data: [20, 28, 35, 43, 51, 61],
      },
    ],
    options: cartesianOptions('Month', 'Savings (k)'),
  },
];

const stringifySourceProp = (value) => JSON.stringify(value, null, 2);

const createChartSource = (chart) => `
      <div class="${chart.className} dashboard-chart-cell${
  chart.type === 'radar' ? ' dashboard-chart-cell--radar' : ''
}">
        <kyn-widget widgetTitle="${chart.title}">
          <span slot="subtitle">${chart.subtitle}</span>
          <div class="dashboard-chart-body">
            <div class="dashboard-chart-host">
              <kd-chart
                type="${chart.type}"
                chartTitle="${chart.title}"
                description="${chart.subtitle}"
                hideControls
                hideCaptions
                height="320"
                .labels=${stringifySourceProp(chart.labels)}
                .datasets=${stringifySourceProp(chart.datasets)}
                .options=${stringifySourceProp(chart.options)}
              ></kd-chart>
            </div>
            <div class="dashboard-widget-footer">
              <kyn-button kind="secondary" size="small">Visit</kyn-button>
            </div>
          </div>
        </kyn-widget>
      </div>`;

const DASHBOARD_SOURCE = createStorySource(
  `
<kyn-ui-shell>
  <kyn-header rootUrl="/" appTitle="Dashboard">
    <span slot="logo" style="--kyn-header-logo-width: 120px;">
      <!-- bridge logo -->
    </span>
    <kyn-header-nav truncate-links>
${indentSource(
  navData.sections
    .map((section) => createGlobalSwitcherSectionSource(section))
    .join('\n'),
  6
)}
    </kyn-header-nav>
    <kyn-header-flyouts>
      <kyn-header-flyout
        label="Workspaces"
        hideMenuLabel
        hideButtonLabel
        noPadding
      >
        <span
          slot="button"
          style="display: flex; align-items: center; gap: 8px; font-size: 14px;"
        >
          <span class="account-name">Workspaces</span>
          <span class="account-chevron"><!-- chevron-down icon --></span>
        </span>

        <div class="ui-impl-switcher">
${indentSource(
  WorkspaceSwitcherPattern.createSourceMarkup(WorkspaceSwitcherPattern.args),
  10
)}
        </div>
      </kyn-header-flyout>

      <kyn-header-flyout label="Notifications" hideMenuLabel>
        ${createSourceIcon('notification', 'button', 'header-icon')}
        <div class="flyout-action-list">
${indentSource(
  ['Notification center', 'Alert preferences', 'Mark all as read']
    .map((label) => createFlyoutActionLinkSource(label))
    .join('\n'),
  10
)}
        </div>
      </kyn-header-flyout>

      <kyn-header-flyout label="Help">
        ${createSourceIcon('information', 'button', 'header-icon')}
        <div class="flyout-action-list">
${indentSource(
  ['Documentation', 'Support', 'Release notes']
    .map((label) => createFlyoutActionLinkSource(label))
    .join('\n'),
  10
)}
        </div>
      </kyn-header-flyout>

      <kyn-header-flyout label="User Profile" hideMenuLabel>
        ${createSourceIcon('user', 'button', 'header-icon')}
        <div class="user-flyout-card">
          <kyn-header-user-profile
            name="User Name"
            subtitle="Job Title"
            email="user@kyndryl.com"
            profileLink="#"
          >
            <img src="https://picsum.photos/id/237/112/112" alt="User Name" />
          </kyn-header-user-profile>
          <div class="flyout-action-list">
${indentSource(
  ['Profile settings', 'Account settings', 'Sign out']
    .map((label) => createFlyoutActionLinkSource(label))
    .join('\n'),
  12
)}
          </div>
        </div>
      </kyn-header-flyout>
    </kyn-header-flyouts>
  </kyn-header>

  <kyn-local-nav>
    <kyn-local-nav-link href="javascript:void(0)" active>
      ${createSourceIcon('dashboard', 'icon', 'local-nav-icon')}
      Dashboard
    </kyn-local-nav-link>
    <kyn-local-nav-link href="javascript:void(0)">
      ${createSourceIcon('actionable-insights', 'icon', 'local-nav-icon')}
      Insights
    </kyn-local-nav-link>
    <kyn-local-nav-link href="javascript:void(0)">
      ${createSourceIcon('services', 'icon', 'local-nav-icon')}
      Services
    </kyn-local-nav-link>
    <kyn-local-nav-link href="javascript:void(0)">
      ${createSourceIcon('settings', 'icon', 'local-nav-icon')}
      Settings
    </kyn-local-nav-link>
  </kyn-local-nav>

  <main class="dashboard-main">
    <div class="dashboard-trellis" aria-hidden="true">
      <!-- Inline dashboardExamplePatternTrellis.svg, extracted from trellis-sprite.svg#even-pattern. -->
    </div>
    <div class="dashboard-content kd-grid">
      <div class="kd-grid__col--sm-4 kd-grid__col--md-8 kd-grid__col--lg-12">
        <div class="dashboard-hero">
          <kyn-page-title
            headLine="Dashboard"
            pageTitle="Operations Overview"
            subTitle="Monitor key health, usage, reliability, and cost signals across active environments."
          ></kyn-page-title>
          <div class="dashboard-hero-actions">
            <kyn-badge label="Live data" status="success" hideIcon></kyn-badge>
            <kyn-button kind="primary" size="small">Settings</kyn-button>
          </div>
        </div>
      </div>

      <div class="kd-grid__col--sm-4 kd-grid__col--md-8 kd-grid__col--lg-12">
        <div class="dashboard-kpis">
${indentSource(kpis.map((kpi) => createKpiSource(kpi)).join('\n'), 10)}
        </div>
      </div>

${chartData.map((chart) => createChartSource(chart)).join('\n\n')}
    </div>
  </main>

  <kyn-footer rootUrl="/" logoAriaLabel="Go to Homepage">
    <span slot="copyright">
      Copyright &copy; ${new Date().getFullYear()} Kyndryl Inc. All rights reserved.
    </span>
  </kyn-footer>
</kyn-ui-shell>
`,
  DASHBOARD_STYLES
);

const renderKpis = () => html`
  <div class="dashboard-kpis">
    ${kpis.map(
      (kpi) => html`
        <div class="dashboard-kpi">
          <span class="dashboard-kpi__label kd-type--ui-02">${kpi.label}</span>
          <span class="dashboard-kpi__value">${kpi.value}</span>
          <div class="dashboard-kpi__meta">
            <kyn-badge
              label=${kpi.statusLabel}
              status=${kpi.status}
              hideIcon
            ></kyn-badge>
            <span class="kd-type--ui-04">${kpi.meta}</span>
          </div>
        </div>
      `
    )}
  </div>
`;

const renderChartWidget = (chart) => html`
  <div
    class="${chart.className} dashboard-chart-cell${chart.type === 'radar'
      ? ' dashboard-chart-cell--radar'
      : ''}"
  >
    <kyn-widget widgetTitle=${chart.title}>
      <span slot="subtitle">${chart.subtitle}</span>
      <div class="dashboard-chart-body">
        <div class="dashboard-chart-host">
          <kd-chart
            type=${chart.type}
            chartTitle=${chart.title}
            description=${chart.subtitle}
            hideControls
            hideCaptions
            height="320"
            .labels=${chart.labels}
            .datasets=${chart.datasets}
            .options=${chart.options}
          ></kd-chart>
        </div>
        <div class="dashboard-widget-footer">
          <kyn-button kind="secondary" size="small">Visit</kyn-button>
        </div>
      </div>
    </kyn-widget>
  </div>
`;

export default {
  title: 'Patterns/Dashboard Example',
  component: 'kyn-ui-shell',
  decorators: [
    (story) => html`
      <style>
        ${DASHBOARD_STYLES}
      </style>
      <div class="ui-shell-dashboard-demo">${story()}</div>
    `,
  ],
  parameters: {
    a11y: {
      config: {
        rules: [
          { id: 'aria-toggle-field-name', enabled: false },
          { id: 'aria-required-parent', enabled: false },
          {
            id: 'color-contrast',
            enabled: true,
            selector: ':not(kd-chart .description, .description)',
          },
        ],
      },
    },
    docs: {
      source: {
        language: 'html',
        code: DASHBOARD_SOURCE,
      },
    },
  },
};

export const FullDashboardImplementation = {
  parameters: {
    docs: {
      source: {
        language: 'html',
        code: DASHBOARD_SOURCE,
      },
    },
  },
  render: () => html`
    <kyn-ui-shell>
      ${renderShellHeader()} ${renderLocalNav()}

      <main class="dashboard-main">
        <div class="dashboard-trellis" aria-hidden="true">
          ${unsafeSVG(trellisPattern)}
        </div>
        <div class="dashboard-content kd-grid">
          <div
            class="kd-grid__col--sm-4 kd-grid__col--md-8 kd-grid__col--lg-12"
          >
            <div class="dashboard-hero">
              <kyn-page-title
                headLine="Dashboard"
                pageTitle="Operations Overview"
                subTitle="Monitor key health, usage, reliability, and cost signals across active environments."
              ></kyn-page-title>
              <div class="dashboard-hero-actions">
                <kyn-badge
                  label="Live data"
                  status="success"
                  hideIcon
                ></kyn-badge>
                <kyn-button kind="primary" size="small">
                  <span slot="icon">${unsafeSVG(settingsIcon)}</span>
                  Settings
                </kyn-button>
              </div>
            </div>
          </div>

          <div
            class="kd-grid__col--sm-4 kd-grid__col--md-8 kd-grid__col--lg-12"
          >
            ${renderKpis()}
          </div>

          ${chartData.map((chart) => renderChartWidget(chart))}
        </div>
      </main>

      <kyn-footer rootUrl="/" logoAriaLabel="Go to Homepage">
        <span slot="copyright">
          Copyright &copy; ${new Date().getFullYear()} Kyndryl Inc. All rights
          reserved.
        </span>
      </kyn-footer>
    </kyn-ui-shell>
  `,
};
