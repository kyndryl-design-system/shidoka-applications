import { html } from 'lit';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import '../components/global/uiShell';
import '../components/global/header';
import '../components/global/localNav';
import '../components/global/footer';
import '../components/reusable/button';
import '../components/reusable/iconSelector';
import '../components/reusable/link';
import '../components/reusable/pagetitle';
import '../components/reusable/sideDrawer';
import '../components/reusable/tabs';
import '../components/reusable/widget';
import '@kyndryl-design-system/shidoka-charts/components/chart';
import { Config as gridstackConfig } from '../common/helpers/gridstack';

import navData from './globalSwitcher/example_global_switcher_data.json';
import { GLOBAL_SWITCHER_PATTERN_STYLES } from './globalSwitcher/globalSwitcherPatternStyles.js';
import { createGlobalSwitcherSectionSource } from './globalSwitcher/globalSwitcherPattern.js';
import { renderGlobalSwitcherSection } from './globalSwitcher/globalSwitcherRender.js';
import trellisPattern from './dashboardExamplePatternTrellis.svg';
import { WorkspaceSwitcherPattern } from './workspaceSwitcher/WorkspaceSwitcher.stories.js';

import bridgeLogo from '@kyndryl-design-system/shidoka-foundation/assets/svg/bridge-logo-large.svg';
import insightsIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/actionable-insights.svg';
import chevronDownIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/chevron-down.svg';
import dashboardIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/dashboard.svg';
import informationIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/information.svg';
import lockIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/lock.svg';
import notificationIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/notification.svg';
import overflowIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/overflow.svg';
import servicesIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/services.svg';
import settingsIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/settings.svg';
import userAvatarIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/user.svg';
import arrowDownIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/arrow-down.svg';
import arrowUpIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/arrow-up.svg';

const DASHBOARD_PATTERN_STYLES = /* css */ `
  /* Copyable pattern CSS. Import gridstack-shidoka.css globally for kyn-widget-gridstack. */
  .dashboard-main {
    min-height: 100vh;
    padding: max(var(--kd-shell-header-clearance, 0px), 2rem)
      var(--kd-page-gutter, 2rem) calc(var(--kd-page-gutter, 2rem) + 2rem);
  }

  .dashboard-content {
    align-items: start;
    width: 100%;
    max-width: 110rem;
    margin-inline: 0 auto;
    justify-content: start;
  }

  .dashboard-content .grid-stack {
    width: 100%;
    max-width: none;
  }

  .dashboard-hero {
    display: flex;
    align-items: center;
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
  }

  .dashboard-tabs {
    min-width: 0;
    width: 100%;
  }

  .dashboard-tabs kyn-tabs {
    min-width: 0;
    max-width: 100%;
  }

  .dashboard-tabs-grid-col {
    min-width: 0;
  }

  .dashboard-tab-panel-content {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    padding-top: 0.75rem;
  }

  .dashboard-settings-drawer {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .dashboard-settings-drawer__section {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem;
    background: var(--kd-color-background-container-soft);
    border-radius: 0.5rem;
  }

  .dashboard-settings-drawer__title {
    color: var(--kd-color-text-level-primary);
    font-weight: var(--kd-font-weight-medium);
  }

  .dashboard-settings-drawer__description {
    color: var(--kd-color-text-level-secondary);
  }

  .dashboard-kpi {
    min-height: 156px;
  }

  .dashboard-kpi kyn-widget {
    height: 100%;
  }

  .dashboard-kpi__content {
    display: flex;
    height: 100%;
    flex-direction: column;
    gap: 0.75rem;
  }

  .dashboard-kpi__top {
    display: flex;
    min-width: 0;
    align-items: center;
    gap: 0.5rem;
  }

  .dashboard-kpi__lock,
  .dashboard-kpi__menu,
  .dashboard-kpi__trend {
    display: inline-flex;
    flex: 0 0 auto;
    align-items: center;
    justify-content: center;
    color: var(--kd-color-icon-secondary);
  }

  .dashboard-kpi__lock svg,
  .dashboard-kpi__menu svg,
  .dashboard-kpi__trend svg {
    display: block;
    width: 14px;
    height: 14px;
  }

  .dashboard-kpi__label {
    min-width: 0;
    flex: 1 1 auto;
    color: var(--kd-color-text-level-secondary);
    font-size: 0.75rem;
    font-weight: var(--kd-font-weight-medium);
    line-height: 1.25;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .dashboard-kpi__menu {
    margin-inline-start: auto;
  }

  .dashboard-kpi__value-row {
    display: flex;
    align-items: baseline;
    gap: 0.375rem;
    margin-block-start: 0.25rem;
  }

  .dashboard-kpi__value {
    color: var(--kd-color-text-level-primary);
    font-size: clamp(2.25rem, 3.5vw, 2.875rem);
    font-weight: var(--kd-font-weight-regular);
    line-height: 1;
  }

  .dashboard-kpi__trend {
    color: var(--kd-color-text-level-primary);
    transform: translateY(-0.125rem);
  }

  .dashboard-kpi__meta {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    color: var(--kd-color-text-level-secondary);
    font-size: 0.75rem;
    font-weight: var(--kd-font-weight-regular);
    line-height: 1.25;
    white-space: nowrap;
  }

  .dashboard-kpi__action {
    display: flex;
    justify-content: center;
    margin-top: auto;
    padding-top: 0.125rem;
  }

  .dashboard-kpi__action kyn-button {
    width: min(100%, 9rem);
  }

  @media (max-width: calc(52rem - 0.001px)) {
    .dashboard-hero {
      align-items: flex-start;
      flex-direction: column;
    }

    .dashboard-hero-actions {
      justify-content: flex-start;
      width: 100%;
    }
  }

  @media (max-width: calc(42rem - 0.001px)) {
    .dashboard-main {
      padding-inline: 1rem;
    }
  }
`;

const DASHBOARD_VISUAL_TREATMENT_STYLES = /* css */ `
  /* Optional Storybook visual treatment: backdrop gradient and trellis art. */
  .ui-shell-dashboard-demo {
    --dashboard-trellis-height: clamp(320px, 30vw, 560px);

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
    height: var(--dashboard-trellis-height);
    content: '';
    background: var(--kd-color-background-container-soft);
    -webkit-mask-image: linear-gradient(to bottom, #000 0 50%, transparent 100%);
    mask-image: linear-gradient(to bottom, #000 0 50%, transparent 100%);
    pointer-events: none;
  }

  .dashboard-main {
    position: relative;
    overflow: hidden;
  }

  .dashboard-main::after {
    position: absolute;
    inset: calc(var(--dashboard-trellis-height) / 2) 0 auto;
    height: calc(var(--dashboard-trellis-height) / 2);
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
    z-index: 2;
  }

  .dashboard-trellis {
    position: absolute;
    z-index: 0;
    inset-block-start: 0;
    inset-inline-end: 0;
    width: min(82vw, 1440px);
    height: var(--dashboard-trellis-height);
    color: var(--kd-color-opacity-ai-warm-red-50);
    overflow: hidden;
    -webkit-mask-image: linear-gradient(to bottom, #000 0 50%, transparent 100%);
    mask-image: linear-gradient(to bottom, #000 0 50%, transparent 100%);
    pointer-events: none;
  }

  .dashboard-trellis svg {
    display: block;
    width: auto;
    height: 100%;
    max-width: none;
    margin-inline-start: auto;
  }
`;

const DASHBOARD_SHELL_DEMO_STYLES = /* css */ `
  /* Storybook shell glue for the demo header/flyouts; not dashboard pattern CSS. */
  .ui-shell-dashboard-demo kyn-header {
    position: relative;
    z-index: 30;
  }

  .ui-shell-dashboard-demo kyn-header-nav,
  .ui-shell-dashboard-demo kyn-header-flyouts,
  .ui-shell-dashboard-demo kyn-header-flyout {
    position: relative;
    z-index: 31;
  }

  .ui-shell-dashboard-demo kyn-local-nav {
    position: relative;
    z-index: 10;
  }

  .ui-shell-dashboard-demo kyn-side-drawer,
  .ui-shell-dashboard-demo kyn-modal {
    position: relative;
    z-index: 0;
  }

  .ui-shell-dashboard-demo kyn-side-drawer[open],
  .ui-shell-dashboard-demo kyn-modal[open] {
    position: relative;
    z-index: 32;
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
    min-width: 220px;
  }

  .flyout-action-list {
    gap: 0.25rem;
    padding: 0.25rem;
  }

  .user-flyout-card {
    align-items: stretch;
    gap: 0.75rem;
    min-width: 240px;
    padding: 0.75rem;
  }

  .user-flyout-card .flyout-action-list {
    min-width: 0;
    padding: 0;
  }

  @media (max-width: calc(52rem - 0.001px)) {
    .ui-impl-switcher {
      width: min(375px, calc(100vw - 2rem));
      min-width: 0;
    }

    .account-chevron {
      display: none;
    }
  }
`;

const DASHBOARD_STYLES = [
  DASHBOARD_PATTERN_STYLES,
  GLOBAL_SWITCHER_PATTERN_STYLES,
  DASHBOARD_VISUAL_TREATMENT_STYLES,
  DASHBOARD_SHELL_DEMO_STYLES,
].join('\n\n');

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

const createFlyoutActionLinkSource = (label) =>
  [
    '<kyn-header-link href="javascript:void(0)">',
    `  ${escapeSource(label)}`,
    '</kyn-header-link>',
  ].join('\n');

const createKpiSource = (
  kpi
) => `<div class="dashboard-kpi kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-3">
  <kyn-widget removeHeader>
    <div class="dashboard-kpi__content">
      <div class="dashboard-kpi__top">
        <span class="dashboard-kpi__lock"><!-- lock icon --></span>
        <span class="dashboard-kpi__label">${escapeSource(kpi.label)}</span>
        <span class="dashboard-kpi__menu"><!-- overflow icon --></span>
      </div>
      <div class="dashboard-kpi__value-row">
        <span class="dashboard-kpi__value">${escapeSource(kpi.value)}</span>
        <span class="dashboard-kpi__trend"><!-- ${
          kpi.trend === 'down' ? 'arrow-down' : 'arrow-up'
        } icon --></span>
      </div>
      <div class="dashboard-kpi__meta">
        <span>${escapeSource(kpi.meta)}</span>
      </div>
      <div class="dashboard-kpi__action">
        <kyn-button kind="secondary" size="extra-small">
          More Info
        </kyn-button>
      </div>
    </div>
  </kyn-widget>
</div>`;

const SETTINGS_DRAWER_SOURCE = `
<kyn-side-drawer
  size="md"
  titleText="Dashboard settings"
  labelText="Adjust how this dashboard summarizes operations signals."
  submitBtnText="Apply"
>
  <kyn-button
    slot="anchor"
    kind="primary"
    size="small"
    iconPosition="left"
  >
    ${createSourceIcon('settings', 'icon')}
    Settings
  </kyn-button>

  <div class="dashboard-settings-drawer">
    <div class="dashboard-settings-drawer__section">
      <div class="dashboard-settings-drawer__title kd-type--ui-02">
        Data refresh
      </div>
      <div class="dashboard-settings-drawer__description kd-type--ui-03">
        Showing live operations data with a five minute refresh cadence.
      </div>
    </div>

    <div class="dashboard-settings-drawer__section">
      <div class="dashboard-settings-drawer__title kd-type--ui-02">
        Dashboard scope
      </div>
      <div class="dashboard-settings-drawer__description kd-type--ui-03">
        Metrics include recommendations, input quality, latency, and cost
        signals across active environments.
      </div>
    </div>
  </div>
</kyn-side-drawer>`;

const createDashboardTabsSource = () => `
<div class="dashboard-tabs">
  <kyn-tabs tabSize="md">
    <kyn-tab slot="tabs" id="my-dashboard" selected>My Dashboard</kyn-tab>
    <kyn-tab slot="tabs" id="vital-dashboard">Vital Dashboard</kyn-tab>
    <kyn-tab slot="tabs" id="data-dashboard">Data Dashboard</kyn-tab>
    <kyn-tab slot="tabs" id="gtm-dashboard">GTM Dashboard</kyn-tab>

    <kyn-tab-panel tabId="my-dashboard" visible noPadding>
      <div class="dashboard-tab-panel-content">
        <div class="dashboard-kpis kd-grid kd-grid--no-max kd-grid--align-left">
${indentSource(kpis.map((kpi) => createKpiSource(kpi)).join('\n'), 10)}
        </div>

        <kyn-widget-gridstack
          .layout=${stringifySourceProp(dashboardChartLayout)}
          .gridstackConfig=${stringifySourceProp(dashboardGridstackConfig)}
        >
          <div class="grid-stack">
${chartData.map((chart) => createChartSource(chart)).join('\n\n')}
          </div>
        </kyn-widget-gridstack>
      </div>
    </kyn-tab-panel>
    <kyn-tab-panel tabId="vital-dashboard" noPadding></kyn-tab-panel>
    <kyn-tab-panel tabId="data-dashboard" noPadding></kyn-tab-panel>
    <kyn-tab-panel tabId="gtm-dashboard" noPadding></kyn-tab-panel>
  </kyn-tabs>
</div>`;

const renderShellHeader = () => html`
  <style>
    ${GLOBAL_SWITCHER_PATTERN_STYLES}
  </style>
  <kyn-header rootUrl="/" appTitle="Dashboard">
    <span slot="logo" style="--kyn-header-logo-width: 120px;">
      ${unsafeSVG(bridgeLogo)}
    </span>
    <kyn-header-nav class="global-switcher-nav" truncate-links>
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

      <kyn-header-flyout label="Notifications" hideMenuLabel noPadding>
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

      <kyn-header-flyout label="Help" noPadding>
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

      <kyn-header-flyout label="User Profile" hideMenuLabel noPadding>
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
    trend: 'up',
  },
  {
    label: 'Input data quality',
    value: '92%',
    status: 'info',
    statusLabel: 'Stable',
    meta: 'Across 18 sources',
    trend: 'up',
  },
  {
    label: 'Interference time',
    value: '18%',
    status: 'warning',
    statusLabel: 'Review',
    meta: 'Decreased by 4%',
    trend: 'down',
  },
  {
    label: 'Uptime',
    value: '99.7%',
    status: 'success',
    statusLabel: 'On target',
    meta: 'Last 30 days',
    trend: 'up',
  },
];

const chartAnimation = {
  duration: 700,
  easing: 'easeOutQuart',
};

const cartesianOptions = (xTitle, yTitle) => ({
  animation: chartAnimation,
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
  animation: chartAnimation,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
    },
  },
  scales: {
    r: {
      beginAtZero: true,
      suggestedMax: 60,
    },
  },
};

const doughnutOptions = {
  animation: chartAnimation,
  maintainAspectRatio: false,
  cutout: '62%',
  plugins: {
    legend: {
      position: 'bottom',
    },
  },
};

const chartData = [
  {
    id: 'recommendation-health',
    title: 'Recommendation health',
    subtitle: 'AI recommendation confidence over time',
    type: 'line',
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
    id: 'container-growth',
    title: 'Container growth',
    subtitle: 'Container count by environment',
    type: 'radar',
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
    options: radarOptions,
  },
  {
    id: 'service-readiness',
    title: '2025 Analysis of Data',
    subtitle: 'Weekly volume by dataset',
    type: 'bar',
    labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    datasets: [
      {
        label: 'Dataset 1',
        data: [18000, 31000, 27000, 42000, 22500, 18000, 22500],
      },
      {
        label: 'Dataset 2',
        data: [14000, 49000, 30500, 37500, 32000, 39500, 19000],
      },
    ],
    options: cartesianOptions('Day of the week', 'Count'),
  },
  {
    id: 'inference-latency',
    title: 'Inference latency',
    subtitle: 'Median and p95 latency by day',
    type: 'line',
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
    id: 'optimization-mix',
    title: 'Optimization mix',
    subtitle: 'Open recommendations by category',
    type: 'doughnut',
    labels: ['Performance', 'Cost', 'Security', 'Reliability'],
    datasets: [
      {
        label: 'Recommendations',
        data: [34, 28, 22, 16],
      },
    ],
    options: doughnutOptions,
  },
];

const chartGridHeight = 5;
const wideChartGridHeight = 6;
const getChartGridHeight = (id) =>
  id === 'service-readiness' ? wideChartGridHeight : chartGridHeight;
const createChartLayoutItem = (id, x, y, w) => ({
  id,
  x,
  y,
  w,
  h: getChartGridHeight(id),
  minW: 4,
  minH: getChartGridHeight(id),
});
const bottomChartGridY = chartGridHeight + wideChartGridHeight;

const dashboardGridstackConfig = {
  ...gridstackConfig,
  cellHeight: 96,
  staticGrid: false,
  disableDrag: false,
  disableResize: true,
};

const dashboardChartLayout = {
  max: [
    createChartLayoutItem('recommendation-health', 0, 0, 6),
    createChartLayoutItem('container-growth', 6, 0, 6),
    createChartLayoutItem('service-readiness', 0, chartGridHeight, 12),
    createChartLayoutItem('inference-latency', 0, bottomChartGridY, 6),
    createChartLayoutItem('optimization-mix', 6, bottomChartGridY, 6),
  ],
  xl: [
    createChartLayoutItem('recommendation-health', 0, 0, 6),
    createChartLayoutItem('container-growth', 6, 0, 6),
    createChartLayoutItem('service-readiness', 0, chartGridHeight, 12),
    createChartLayoutItem('inference-latency', 0, bottomChartGridY, 6),
    createChartLayoutItem('optimization-mix', 6, bottomChartGridY, 6),
  ],
  lg: [
    createChartLayoutItem('recommendation-health', 0, 0, 6),
    createChartLayoutItem('container-growth', 6, 0, 6),
    createChartLayoutItem('service-readiness', 0, chartGridHeight, 12),
    createChartLayoutItem('inference-latency', 0, bottomChartGridY, 6),
    createChartLayoutItem('optimization-mix', 6, bottomChartGridY, 6),
  ],
  md: [
    createChartLayoutItem('recommendation-health', 0, 0, 4),
    createChartLayoutItem('container-growth', 4, 0, 4),
    createChartLayoutItem('service-readiness', 0, chartGridHeight, 8),
    createChartLayoutItem('inference-latency', 0, bottomChartGridY, 4),
    createChartLayoutItem('optimization-mix', 4, bottomChartGridY, 4),
  ],
  sm: [
    createChartLayoutItem('recommendation-health', 0, 0, 4),
    createChartLayoutItem('container-growth', 0, chartGridHeight, 4),
    createChartLayoutItem('service-readiness', 0, chartGridHeight * 2, 4),
    createChartLayoutItem(
      'inference-latency',
      0,
      chartGridHeight * 2 + wideChartGridHeight,
      4
    ),
    createChartLayoutItem(
      'optimization-mix',
      0,
      chartGridHeight * 3 + wideChartGridHeight,
      4
    ),
  ],
};

const stringifySourceProp = (value) => JSON.stringify(value, null, 2);

const createChartSource = (chart) => `
              <div
                gs-id="${chart.id}"
                class="grid-stack-item"
              >
                <div class="grid-stack-item-content">
                  <kyn-widget>
                    <kd-chart
                      type="${chart.type}"
                      chartTitle="${escapeSource(chart.title)}"
                      description="${escapeSource(chart.subtitle)}"
                      aria-label="${escapeSource(
                        `${chart.title}. ${chart.subtitle}`
                      )}"
                      hideControls
                      hideCaptions
                      .labels=${stringifySourceProp(chart.labels)}
                      .datasets=${stringifySourceProp(chart.datasets)}
                      .options=${stringifySourceProp(chart.options)}
                    >
                      <kyn-widget-drag-handle></kyn-widget-drag-handle>
                    </kd-chart>
                    <kyn-button
                      slot="footer"
                      kind="secondary"
                      size="small"
                      style="margin-left: auto;"
                    >
                      Visit
                    </kyn-button>
                  </kyn-widget>
                </div>
              </div>`;

const DASHBOARD_SOURCE = createStorySource(
  `
<kyn-ui-shell>
  <kyn-header rootUrl="/" appTitle="Dashboard">
    <span slot="logo" style="--kyn-header-logo-width: 120px;">
      <!-- bridge logo -->
    </span>
    <kyn-header-nav class="global-switcher-nav" truncate-links>
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

      <kyn-header-flyout label="Notifications" hideMenuLabel noPadding>
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

      <kyn-header-flyout label="Help" noPadding>
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

      <kyn-header-flyout label="User Profile" hideMenuLabel noPadding>
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
    <div class="dashboard-content kd-grid">
      <div class="kd-grid__col--sm-4 kd-grid__col--md-8 kd-grid__col--lg-12">
        <div class="dashboard-hero">
          <kyn-page-title pageTitle="Welcome, User"></kyn-page-title>
          <div class="dashboard-hero-actions">
${indentSource(SETTINGS_DRAWER_SOURCE, 12)}
          </div>
        </div>
      </div>

      <div class="dashboard-tabs-grid-col kd-grid__col--sm-4 kd-grid__col--md-8 kd-grid__col--lg-12">
${indentSource(createDashboardTabsSource(), 8)}
      </div>
    </div>
  </main>

  <kyn-footer rootUrl="/" logoAriaLabel="Go to Homepage">
    <span slot="copyright">
      Copyright &copy; ${new Date().getFullYear()} Kyndryl Inc. All rights reserved.
    </span>
  </kyn-footer>
</kyn-ui-shell>
`,
  DASHBOARD_PATTERN_STYLES
);

const renderKpis = () => html`
  <div class="dashboard-kpis kd-grid kd-grid--no-max kd-grid--align-left">
    ${kpis.map(
      (kpi) => html`
        <div
          class="dashboard-kpi kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-3"
        >
          <kyn-widget removeHeader>
            <div class="dashboard-kpi__content">
              <div class="dashboard-kpi__top">
                <span class="dashboard-kpi__lock" aria-hidden="true">
                  ${unsafeSVG(lockIcon)}
                </span>
                <span class="dashboard-kpi__label">${kpi.label}</span>
                <span class="dashboard-kpi__menu" aria-hidden="true">
                  ${unsafeSVG(overflowIcon)}
                </span>
              </div>
              <div class="dashboard-kpi__value-row">
                <span class="dashboard-kpi__value">${kpi.value}</span>
                <span class="dashboard-kpi__trend" aria-hidden="true">
                  ${unsafeSVG(
                    kpi.trend === 'down' ? arrowDownIcon : arrowUpIcon
                  )}
                </span>
              </div>
              <div class="dashboard-kpi__meta">
                <span>${kpi.meta}</span>
              </div>
              <div class="dashboard-kpi__action">
                <kyn-button kind="secondary" size="extra-small">
                  More Info
                </kyn-button>
              </div>
            </div>
          </kyn-widget>
        </div>
      `
    )}
  </div>
`;

const renderSettingsDrawer = () => html`
  <kyn-side-drawer
    size="md"
    titleText="Dashboard settings"
    labelText="Adjust how this dashboard summarizes operations signals."
    submitBtnText="Apply"
  >
    <kyn-button slot="anchor" kind="primary" size="small" iconPosition="left">
      <span slot="icon">${unsafeSVG(settingsIcon)}</span>
      Settings
    </kyn-button>

    <div class="dashboard-settings-drawer">
      <div class="dashboard-settings-drawer__section">
        <div class="dashboard-settings-drawer__title kd-type--ui-02">
          Data refresh
        </div>
        <div class="dashboard-settings-drawer__description kd-type--ui-03">
          Showing live operations data with a five minute refresh cadence.
        </div>
      </div>

      <div class="dashboard-settings-drawer__section">
        <div class="dashboard-settings-drawer__title kd-type--ui-02">
          Dashboard scope
        </div>
        <div class="dashboard-settings-drawer__description kd-type--ui-03">
          Metrics include recommendations, input quality, latency, and cost
          signals across active environments.
        </div>
      </div>
    </div>
  </kyn-side-drawer>
`;

const renderDashboardTabs = () => html`
  <div class="dashboard-tabs">
    <kyn-tabs tabSize="md">
      <kyn-tab slot="tabs" id="my-dashboard" selected>My Dashboard</kyn-tab>
      <kyn-tab slot="tabs" id="vital-dashboard">Vital Dashboard</kyn-tab>
      <kyn-tab slot="tabs" id="data-dashboard">Data Dashboard</kyn-tab>
      <kyn-tab slot="tabs" id="gtm-dashboard">GTM Dashboard</kyn-tab>

      <kyn-tab-panel tabId="my-dashboard" visible noPadding>
        <div class="dashboard-tab-panel-content">
          ${renderKpis()}

          <kyn-widget-gridstack
            .layout=${dashboardChartLayout}
            .gridstackConfig=${dashboardGridstackConfig}
          >
            <div class="grid-stack">
              ${chartData.map((chart) => renderChartWidget(chart))}
            </div>
          </kyn-widget-gridstack>
        </div>
      </kyn-tab-panel>
      <kyn-tab-panel tabId="vital-dashboard" noPadding></kyn-tab-panel>
      <kyn-tab-panel tabId="data-dashboard" noPadding></kyn-tab-panel>
      <kyn-tab-panel tabId="gtm-dashboard" noPadding></kyn-tab-panel>
    </kyn-tabs>
  </div>
`;

const renderChartWidget = (chart) => html`
  <div gs-id=${chart.id} class="grid-stack-item">
    <div class="grid-stack-item-content">
      <kyn-widget>
        <kd-chart
          type=${chart.type}
          chartTitle=${chart.title}
          description=${chart.subtitle}
          aria-label=${`${chart.title}. ${chart.subtitle}`}
          hideControls
          hideCaptions
          .labels=${chart.labels}
          .datasets=${chart.datasets}
          .options=${chart.options}
        >
          <kyn-widget-drag-handle></kyn-widget-drag-handle>
        </kd-chart>
        <kyn-button
          slot="footer"
          kind="secondary"
          size="small"
          style="margin-left: auto;"
        >
          Visit
        </kyn-button>
      </kyn-widget>
    </div>
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
      description: {
        component:
          'The source panel exposes the copyable dashboard pattern styles only. The trellis art, backdrop gradient, and Storybook shell glue are kept in separate demo-only style constants.',
      },
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
              <kyn-page-title pageTitle="Welcome, User"></kyn-page-title>
              <div class="dashboard-hero-actions">
                ${renderSettingsDrawer()}
              </div>
            </div>
          </div>

          <div
            class="dashboard-tabs-grid-col kd-grid__col--sm-4 kd-grid__col--md-8 kd-grid__col--lg-12"
          >
            ${renderDashboardTabs()}
          </div>
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
