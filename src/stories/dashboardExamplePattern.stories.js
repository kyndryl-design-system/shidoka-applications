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

import navData from './globalSwitcher/example_global_switcher_data.json';
import trellisPattern from './dashboardExamplePatternTrellis.svg';
import { WorkspaceSwitcherPattern } from './workspaceSwitcher/WorkspaceSwitcher.stories.js';

import insightsIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/actionable-insights.svg';
import adminIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/user-settings.svg';
import catalogIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/catalog-management.svg';
import chevronDownIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/chevron-down.svg';
import circleIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/circle-stroke.svg';
import consoleIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/console.svg';
import dashboardIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/dashboard.svg';
import helpIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/question.svg';
import historyIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/history.svg';
import homeIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/home.svg';
import launchIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/launch.svg';
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
    mask-image: linear-gradient(to bottom, #000 0 38%, transparent 100%);
    pointer-events: none;
  }

  .ui-shell-dashboard-demo kyn-header,
  .ui-shell-dashboard-demo kyn-header-flyout,
  .ui-shell-dashboard-demo kyn-modal,
  .ui-shell-dashboard-demo kyn-side-drawer {
    position: relative;
    z-index: 22;
  }

  .ui-shell-dashboard-demo kyn-local-nav {
    z-index: 21;
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
    padding-block-start: 0.25rem;
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

  .header-icon svg,
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
    gap: 0.25rem;
    min-width: 240px;
    padding: 0.75rem;
  }

  .user-flyout-card {
    align-items: stretch;
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
  <kyn-header rootUrl="/" appTitle="Application">
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

      <kyn-header-flyout label="Menu Label">
        <span slot="button" class="header-icon">${unsafeSVG(helpIcon)}</span>

        <kyn-header-link href="javascript:void(0)">
          <span>${unsafeSVG(circleIcon)}</span>
          Example 1
        </kyn-header-link>
        <kyn-header-link href="javascript:void(0)">
          <span>${unsafeSVG(circleIcon)}</span>
          Example 2
        </kyn-header-link>
      </kyn-header-flyout>

      <kyn-header-flyout label="Menu Label" hideMenuLabel>
        <span slot="button" class="header-icon">
          ${unsafeSVG(userAvatarIcon)}
        </span>

        <kyn-header-user-profile
          name="User Name"
          subtitle="Job Title"
          email="user@kyndryl.com"
          profileLink="#"
        >
          <img src="https://picsum.photos/id/237/112/112" alt="User Name" />
        </kyn-header-user-profile>

        <kyn-header-link href="javascript:void(0)">
          <span>${unsafeSVG(circleIcon)}</span>
          Example Link 1
        </kyn-header-link>
        <kyn-header-link href="javascript:void(0)">
          <span>${unsafeSVG(circleIcon)}</span>
          Example Link 2
        </kyn-header-link>
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
      <!-- Bridge logo from @kyndryl-design-system/shidoka-foundation -->
    </span>
    <kyn-header-nav truncate-links>
      <!-- Global Switcher JSON pattern sections:
           Favorites, Recently Viewed, Console, Services, Catalogs, Administration. -->
    </kyn-header-nav>
    <kyn-header-flyouts>
      <!-- Workspace, Notifications, Help, and User Profile flyouts. -->
    </kyn-header-flyouts>
  </kyn-header>

  <kyn-local-nav>
    <kyn-local-nav-link href="javascript:void(0)" active>
      <span slot="icon" class="local-nav-icon"><!-- dashboard icon --></span>
      Dashboard
    </kyn-local-nav-link>
    <kyn-local-nav-link href="javascript:void(0)">
      <span slot="icon" class="local-nav-icon"><!-- console icon --></span>
      Insights
    </kyn-local-nav-link>
    <kyn-local-nav-link href="javascript:void(0)">
      <span slot="icon" class="local-nav-icon"><!-- services icon --></span>
      Services
    </kyn-local-nav-link>
    <kyn-local-nav-link href="javascript:void(0)">
      <span slot="icon" class="local-nav-icon"><!-- settings icon --></span>
      Settings
    </kyn-local-nav-link>
  </kyn-local-nav>

  <main class="dashboard-main">
    <div class="dashboard-trellis" aria-hidden="true">
      <!-- Extracted from Kyndryl consulting page trellis-sprite.svg#even-pattern. -->
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
          <div class="dashboard-kpi">
            <span class="dashboard-kpi__label kd-type--ui-02">Recommendations</span>
            <span class="dashboard-kpi__value">84</span>
            <div class="dashboard-kpi__meta">
              <kyn-badge label="Healthy" status="success" hideIcon></kyn-badge>
              <span class="kd-type--ui-04">Increased by 12%</span>
            </div>
          </div>
          <!-- Repeat KPI cards for data quality, interference time, and uptime. -->
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
  title: 'Patterns/Dashboard Example Pattern',
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
