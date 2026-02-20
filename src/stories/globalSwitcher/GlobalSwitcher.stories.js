import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { html } from 'lit';

import '../../components/global/header';
import '../../components/reusable/tabs';
import '../../components/reusable/iconSelector';

import starFilledIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/recommend-filled.svg';
import starOutlineIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/recommend.svg';
import historyIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/history.svg';
import catalogIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/catalog-management.svg';
import consoleIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/console.svg';
import servicesIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/services.svg';
import adminIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/user-settings.svg';
import launchIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/launch.svg';
import circleIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/circle-stroke.svg';
import bridgeLogo from '@kyndryl-design-system/shidoka-foundation/assets/svg/bridge-logo-large.svg';
import homeIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/home.svg';
import dashboardIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/dashboard.svg';

import navData from './example_global_switcher_data.json';

const starSelector = (checked = false) => html`
  <kyn-icon-selector ?checked=${checked}>
    <span slot="icon-unchecked">${unsafeSVG(starOutlineIcon)}</span>
    <span slot="icon-checked">${unsafeSVG(starFilledIcon)}</span>
  </kyn-icon-selector>
`;

const args = {
  rootUrl: '/',
  appTitle: 'Application',
};

export default {
  title: 'Patterns/Global Switcher',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/qyPEUQckxj8LUgesi1OEES/Component-Library?node-id=43098-12090&p=f&m=dev',
    },
  },
  args,
};

export const SlottedHTMLSwitcher = {
  render: (renderArgs) => {
    return html`
      <kyn-header rootUrl=${renderArgs.rootUrl} appTitle=${renderArgs.appTitle}>
        <span slot="logo" style="--kyn-header-logo-width: 120px;"
          >${unsafeSVG(bridgeLogo)}</span
        >
        <kyn-header-nav
          auto-open-flyout="favorites"
          truncate-links
          style="--kyn-icon-selector-animate-selection: 1; --kyn-icon-selector-only-visible-on-hover: 1; --kyn-icon-selector-persist-when-checked: 1;"
        >
          <!-- FAVORITES -->
          <kyn-header-link id="favorites" href="javascript:void(0)" hideSearch>
            <span>${unsafeSVG(starFilledIcon)}</span>
            Favorites

            <kyn-header-category slot="links">
              <kyn-header-link href="#">
                <span>Connections Management</span>
                ${starSelector(true)}
              </kyn-header-link>
              <kyn-header-link href="#">
                <span>Discovered Data</span>
                ${starSelector(true)}
              </kyn-header-link>
              <kyn-header-link href="#">
                <span>Visualization, Exploration and Semantic Analytics</span>
                ${starSelector(true)}
              </kyn-header-link>
              <kyn-header-link href="#">
                <span>Topology</span>
                ${starSelector(true)}
              </kyn-header-link>
              <kyn-header-link href="#">
                <span>Menu item five</span>
                ${starSelector(true)}
              </kyn-header-link>
              <kyn-header-link href="#">
                <span>Menu item six</span>
                ${starSelector(true)}
              </kyn-header-link>
              <kyn-header-link href="#">
                <span>Menu Item seven</span>
                ${starSelector(true)}
              </kyn-header-link>
            </kyn-header-category>
          </kyn-header-link>

          <!-- RECENTLY VIEWED -->
          <kyn-header-link
            id="recently-viewed"
            href="javascript:void(0)"
            hideSearch
          >
            <span>${unsafeSVG(historyIcon)}</span>
            Recently Viewed

            <kyn-header-category slot="links">
              <kyn-header-link href="#">
                <span>Topology</span>
                ${starSelector()}
              </kyn-header-link>
              <kyn-header-link href="#">
                <span>Discovered Data</span>
                ${starSelector()}
              </kyn-header-link>
              <kyn-header-link href="#">
                <span>Connections Management</span>
                ${starSelector()}
              </kyn-header-link>
              <kyn-header-link href="#">
                <span>Sustainability Advisor</span>
                ${starSelector()}
              </kyn-header-link>
              <kyn-header-link href="#">
                <span>Discovered Data</span>
                ${starSelector()}
              </kyn-header-link>
              <kyn-header-link href="#">
                <span>Private Cloud IaaS/PaaS</span>
                ${starSelector()}
              </kyn-header-link>
              <kyn-header-link href="#">
                <span>Mass Recovery Model</span>
                ${starSelector()}
              </kyn-header-link>
              <kyn-header-link href="#">
                <span
                  >Assessment for Microsoft Azure Stack Hyper Converged
                  Infrastructure</span
                >
                ${starSelector()}
              </kyn-header-link>
              <kyn-header-link href="#">
                <span>Private Cloud IaaS/PaaS</span>
                ${starSelector()}
              </kyn-header-link>
              <kyn-header-link href="#">
                <span>Rapid Assessments for Enterprise Sustainability</span>
                ${starSelector()}
              </kyn-header-link>
            </kyn-header-category>
          </kyn-header-link>

          <kyn-header-divider></kyn-header-divider>

          <!-- CONSOLE -->
          <!-- Single column layout: use div wrapper instead of kyn-header-categories -->
          <kyn-header-link id="console" href="javascript:void(0)" hideSearch>
            <span>${unsafeSVG(consoleIcon)}</span>
            Console

            <div
              slot="links"
              style="display: flex; flex-direction: column; gap: 2px;"
            >
              <kyn-header-link href="#">
                <span
                  style="display: inline-flex; align-items: center; gap: 8px;"
                >
                  <span style="display: flex; flex-shrink: 0; margin-top: -2px;"
                    >${unsafeSVG(homeIcon)}</span
                  >
                  Bridge Home
                </span>
                ${starSelector()}
              </kyn-header-link>

              <kyn-header-category
                heading="Dashboards"
                style="margin-top: 8px;"
              >
                <span slot="icon">${unsafeSVG(dashboardIcon)}</span>
                <kyn-header-link href="#">
                  <span>All Dashboards</span>
                  ${starSelector()}
                </kyn-header-link>
                <kyn-header-link href="#">
                  <span>Actionable Insights</span>
                  ${starSelector()}
                </kyn-header-link>
                <kyn-header-link href="#">
                  <span>AIOps IT Health Indicators Dashboard</span>
                  ${starSelector()}
                </kyn-header-link>
                <kyn-header-link href="#" target="_blank">
                  <span>Business Console (legacy)</span>
                  ${starSelector()}
                  <span
                    style="display: flex; width: 16px; height: 16px; flex-shrink: 0;"
                    >${unsafeSVG(launchIcon)}</span
                  >
                </kyn-header-link>
                <kyn-header-link href="#" target="_blank">
                  <span>Business Service Insights (legacy)</span>
                  ${starSelector()}
                  <span
                    style="display: flex; width: 16px; height: 16px; flex-shrink: 0;"
                    >${unsafeSVG(launchIcon)}</span
                  >
                </kyn-header-link>
              </kyn-header-category>
            </div>
          </kyn-header-link>

          <!-- SERVICES -->
          <kyn-header-link id="services" href="javascript:void(0)">
            <span>${unsafeSVG(servicesIcon)}</span>
            Services

            <kyn-tabs
              tabSize="md"
              slot="links"
              style="width: 100%; max-width: none;"
            >
              <kyn-tab slot="tabs" id="kyndryl" selected>
                Kyndryl Services
              </kyn-tab>

              <kyn-tab slot="tabs" id="platform"> Platform Services </kyn-tab>

              <!-- KYNDRYL SERVICES TAB -->
              <kyn-tab-panel tabId="kyndryl" noPadding visible>
                <kyn-header-categories layout="masonry" .maxRootLinks=${0}>
                  <kyn-header-category heading="Applications, Data, & AI">
                    <span slot="icon">${unsafeSVG(circleIcon)}</span>
                    <kyn-header-link href="#">
                      <span>Business Intelligence</span>
                      ${starSelector()}
                    </kyn-header-link>
                    <kyn-header-link href="#">
                      <span>Storage Migration</span>
                      ${starSelector()}
                    </kyn-header-link>
                    <kyn-header-link href="#">
                      <span
                        >Visualization, Exploration and Semantic Analytics</span
                      >
                      ${starSelector()}
                    </kyn-header-link>
                  </kyn-header-category>

                  <kyn-header-category heading="Cloud Services">
                    <span slot="icon">${unsafeSVG(circleIcon)}</span>
                    <kyn-header-link href="#">
                      <span
                        >Assessment for Microsoft Azure Stack Hyper Converged
                        Infrastructure</span
                      >
                      ${starSelector()}
                    </kyn-header-link>
                    <kyn-header-link href="#">
                      <span>Private Cloud IaaS/PaaS</span>
                      ${starSelector()}
                    </kyn-header-link>
                    <kyn-header-link href="#">
                      <span
                        >Rapid Assessments for Enterprise Sustainability</span
                      >
                      ${starSelector()}
                    </kyn-header-link>
                  </kyn-header-category>

                  <kyn-header-category heading="Core Enterprise & Z Cloud">
                    <span slot="icon">${unsafeSVG(circleIcon)}</span>
                    <kyn-header-link href="#">
                      <span
                        >Application Management Services for IBM Z and IBM
                        i</span
                      >
                      ${starSelector()}
                    </kyn-header-link>
                    <kyn-header-link href="#">
                      <span
                        >Managed Extended Cloud IaaS for IBM i on Skytap</span
                      >
                      ${starSelector()}
                    </kyn-header-link>
                    <kyn-header-link href="#">
                      <span
                        >Managed Extended Cloud IaaS for IBM Z (zCloud)</span
                      >
                      ${starSelector()}
                    </kyn-header-link>
                  </kyn-header-category>

                  <kyn-header-category heading="Digital Workplace">
                    <span slot="icon">${unsafeSVG(circleIcon)}</span>
                    <kyn-header-link href="#">
                      <span>Connected Experience</span>
                      ${starSelector()}
                    </kyn-header-link>
                    <kyn-header-link href="#">
                      <span>Digital Experience Management</span>
                      ${starSelector()}
                    </kyn-header-link>
                    <kyn-header-link href="#">
                      <span>Modern Device Management Services</span>
                      ${starSelector()}
                    </kyn-header-link>
                  </kyn-header-category>

                  <kyn-header-category heading="Network & Edge">
                    <span slot="icon">${unsafeSVG(circleIcon)}</span>
                    <kyn-header-link href="#">
                      <span>Managed Network Services</span>
                      ${starSelector()}
                    </kyn-header-link>
                  </kyn-header-category>

                  <kyn-header-category heading="Security & Resiliency">
                    <span slot="icon">${unsafeSVG(circleIcon)}</span>
                    <kyn-header-link href="#">
                      <span>Continuous Controls Monitoring & Management</span>
                      ${starSelector()}
                    </kyn-header-link>
                    <kyn-header-link href="#">
                      <span>Enterprise Security Compliance Management</span>
                      ${starSelector()}
                    </kyn-header-link>
                    <kyn-header-link href="#">
                      <span>Intelligent Recovery Service</span>
                      ${starSelector()}
                    </kyn-header-link>
                    <kyn-header-link href="#">
                      <span>Mass Recovery Model</span>
                      ${starSelector()}
                    </kyn-header-link>
                    <kyn-header-link href="#">
                      <span>Recovery Retainer Service</span>
                      ${starSelector()}
                    </kyn-header-link>
                    <kyn-header-link href="#">
                      <span>Security & Network Operations</span>
                      ${starSelector()}
                    </kyn-header-link>
                    <kyn-header-link href="#">
                      <span>Security Operations as a Platform</span>
                      ${starSelector()}
                    </kyn-header-link>
                    <kyn-header-link href="#">
                      <span>Sustainability Advisor</span>
                      ${starSelector()}
                    </kyn-header-link>
                    <kyn-header-link href="#">
                      <span>Vulnerability Management Service</span>
                      ${starSelector()}
                    </kyn-header-link>
                  </kyn-header-category>
                </kyn-header-categories>
              </kyn-tab-panel>

              <!-- PLATFORM SERVICES TAB -->
              <kyn-tab-panel tabId="platform" noPadding>
                <kyn-header-categories layout="masonry" .maxRootLinks=${0}>
                  <kyn-header-category
                    heading="Application & Business Services"
                  >
                    <span slot="icon">${unsafeSVG(circleIcon)}</span>
                    <kyn-header-link href="#">
                      <span>Application Modernization Intelligence</span>
                      ${starSelector()}
                    </kyn-header-link>
                  </kyn-header-category>

                  <kyn-header-category heading="Change Management">
                    <span slot="icon">${unsafeSVG(circleIcon)}</span>
                    <kyn-header-link href="#" target="_blank" truncate>
                      <span>Guided Change Manager (legacy)</span>
                      ${starSelector()}
                      <span
                        style="display: flex; width: 16px; height: 16px; flex-shrink: 0;"
                        >${unsafeSVG(launchIcon)}</span
                      >
                    </kyn-header-link>
                  </kyn-header-category>

                  <kyn-header-category heading="Cloud Management">
                    <span slot="icon">${unsafeSVG(circleIcon)}</span>
                    <kyn-header-link href="#">
                      <span>Container Cluster Management</span>
                      ${starSelector()}
                    </kyn-header-link>
                    <kyn-header-link href="#">
                      <span>FinOps & Cost Optimization Intelligence</span>
                      ${starSelector()}
                    </kyn-header-link>
                  </kyn-header-category>

                  <kyn-header-category heading="Data Analytics">
                    <span slot="icon">${unsafeSVG(circleIcon)}</span>
                    <kyn-header-link href="#">
                      <span>Data Fabric</span>
                      ${starSelector()}
                    </kyn-header-link>
                  </kyn-header-category>

                  <kyn-header-category heading="Discovery">
                    <span slot="icon">${unsafeSVG(circleIcon)}</span>
                    <kyn-header-link href="#">
                      <span>Discovered Data</span>
                      ${starSelector()}
                    </kyn-header-link>
                    <kyn-header-link href="#">
                      <span>Discovered Management</span>
                      ${starSelector()}
                    </kyn-header-link>
                  </kyn-header-category>

                  <kyn-header-category heading="Inventory">
                    <span slot="icon">${unsafeSVG(circleIcon)}</span>
                    <kyn-header-link href="#" target="_blank" truncate>
                      <span>Applications & Resources (legacy)</span>
                      ${starSelector()}
                      <span
                        style="display: flex; width: 16px; height: 16px; flex-shrink: 0;"
                        >${unsafeSVG(launchIcon)}</span
                      >
                    </kyn-header-link>
                    <kyn-header-link href="#">
                      <span>Application Inventory</span>
                      ${starSelector()}
                    </kyn-header-link>
                    <kyn-header-link href="#" target="_blank" truncate>
                      <span>Infrastructure & Cloud Inventory (legacy)</span>
                      ${starSelector()}
                      <span
                        style="display: flex; width: 16px; height: 16px; flex-shrink: 0;"
                        >${unsafeSVG(launchIcon)}</span
                      >
                    </kyn-header-link>
                    <kyn-header-link href="#" target="_blank" truncate>
                      <span>Inventory Insights (legacy)</span>
                      ${starSelector()}
                      <span
                        style="display: flex; width: 16px; height: 16px; flex-shrink: 0;"
                        >${unsafeSVG(launchIcon)}</span
                      >
                    </kyn-header-link>
                    <kyn-header-link href="#" target="_blank" truncate>
                      <span>Location Dictionary (legacy)</span>
                      ${starSelector()}
                      <span
                        style="display: flex; width: 16px; height: 16px; flex-shrink: 0;"
                        >${unsafeSVG(launchIcon)}</span
                      >
                    </kyn-header-link>
                    <kyn-header-link href="#" target="_blank" truncate>
                      <span>Product Dictionary (legacy)</span>
                      ${starSelector()}
                      <span
                        style="display: flex; width: 16px; height: 16px; flex-shrink: 0;"
                        >${unsafeSVG(launchIcon)}</span
                      >
                    </kyn-header-link>
                    <kyn-header-link href="#">
                      <span>Tagging Compliance Report</span>
                      ${starSelector()}
                    </kyn-header-link>
                    <kyn-header-link href="#">
                      <span>Topology</span>
                      ${starSelector()}
                    </kyn-header-link>
                    <kyn-header-link href="#" target="_blank" truncate>
                      <span>Workstation Inventory (legacy)</span>
                      ${starSelector()}
                      <span
                        style="display: flex; width: 16px; height: 16px; flex-shrink: 0;"
                        >${unsafeSVG(launchIcon)}</span
                      >
                    </kyn-header-link>
                  </kyn-header-category>

                  <kyn-header-category heading="Knowledge & AI">
                    <span slot="icon">${unsafeSVG(circleIcon)}</span>
                    <kyn-header-link href="#">
                      <span>Agentic AI Designer</span>
                      ${starSelector()}
                    </kyn-header-link>
                    <kyn-header-link href="#" target="_blank" truncate>
                      <span
                        >Artificial Intelligence for IT Operations
                        (legacy)</span
                      >
                      ${starSelector()}
                      <span
                        style="display: flex; width: 16px; height: 16px; flex-shrink: 0;"
                        >${unsafeSVG(launchIcon)}</span
                      >
                    </kyn-header-link>
                    <kyn-header-link href="#">
                      <span>Bridge AI Assist Configuration</span>
                      ${starSelector()}
                    </kyn-header-link>
                    <kyn-header-link href="#">
                      <span>Knowledge Foundation</span>
                      ${starSelector()}
                    </kyn-header-link>
                  </kyn-header-category>

                  <kyn-header-category
                    heading="Provisioning Orchestration & Automation"
                  >
                    <span slot="icon">${unsafeSVG(circleIcon)}</span>
                    <kyn-header-link href="#" target="_blank" truncate>
                      <span>Actions (legacy)</span>
                      ${starSelector()}
                      <span
                        style="display: flex; width: 16px; height: 16px; flex-shrink: 0;"
                        >${unsafeSVG(launchIcon)}</span
                      >
                    </kyn-header-link>
                    <kyn-header-link href="#" target="_blank" truncate>
                      <span>Automation (legacy)</span>
                      ${starSelector()}
                      <span
                        style="display: flex; width: 16px; height: 16px; flex-shrink: 0;"
                        >${unsafeSVG(launchIcon)}</span
                      >
                    </kyn-header-link>
                    <kyn-header-link href="#" target="_blank" truncate>
                      <span>Scheduler (legacy)</span>
                      ${starSelector()}
                      <span
                        style="display: flex; width: 16px; height: 16px; flex-shrink: 0;"
                        >${unsafeSVG(launchIcon)}</span
                      >
                    </kyn-header-link>
                    <kyn-header-link href="#">
                      <span>Workflow Executions</span>
                      ${starSelector()}
                    </kyn-header-link>
                  </kyn-header-category>

                  <kyn-header-category heading="Toolchain & Pipeline">
                    <span slot="icon">${unsafeSVG(circleIcon)}</span>
                    <kyn-header-link href="#">
                      <span>DevOps Intelligence</span>
                      ${starSelector()}
                    </kyn-header-link>
                    <kyn-header-link href="#">
                      <span>Machine Learning Operations Pipeline</span>
                      ${starSelector()}
                    </kyn-header-link>
                    <kyn-header-link href="#">
                      <span>Tool Chain Management</span>
                      ${starSelector()}
                    </kyn-header-link>
                  </kyn-header-category>
                </kyn-header-categories>
              </kyn-tab-panel>
            </kyn-tabs>
          </kyn-header-link>

          <!-- CATALOGS -->
          <kyn-header-link id="catalogs" href="javascript:void(0)" hideSearch>
            <span>${unsafeSVG(catalogIcon)}</span>
            Catalogs

            <kyn-header-category slot="links">
              <kyn-header-link href="#">
                <span>Bridge Private Catalog</span>
                ${starSelector()}
              </kyn-header-link>
              <kyn-header-link href="#">
                <span>Bridge Service Catalog</span>
                ${starSelector()}
              </kyn-header-link>
              <kyn-header-link href="#">
                <span>Enablement Catalog</span>
                ${starSelector()}
              </kyn-header-link>
              <kyn-header-link href="#">
                <span>Orchestration Catalog</span>
                ${starSelector()}
              </kyn-header-link>
            </kyn-header-category>
          </kyn-header-link>

          <!-- ADMINISTRATION -->
          <kyn-header-link
            id="administration"
            href="javascript:void(0)"
            hideSearch
          >
            <span>${unsafeSVG(adminIcon)}</span>
            Administration

            <kyn-header-categories
              slot="links"
              layout="masonry"
              maxColumns="2"
              .maxRootLinks=${0}
            >
              <kyn-header-category heading="Access Management">
                <span slot="icon">${unsafeSVG(circleIcon)}</span>
                <kyn-header-link href="#">
                  <span>Access Request Management System (ARMS)</span>
                  ${starSelector()}
                </kyn-header-link>
                <kyn-header-link href="#">
                  <span>Bridge Access Management</span>
                  ${starSelector()}
                </kyn-header-link>
                <kyn-header-link href="#">
                  <span>Service Access Management</span>
                  ${starSelector()}
                </kyn-header-link>
              </kyn-header-category>

              <kyn-header-category heading="Policy Service">
                <span slot="icon">${unsafeSVG(circleIcon)}</span>
                <kyn-header-link href="#">
                  <span>Policy Management (Bundles)</span>
                  ${starSelector()}
                </kyn-header-link>
              </kyn-header-category>

              <kyn-header-category
                heading="Provisioning Orchestration & Administration"
              >
                <span slot="icon">${unsafeSVG(circleIcon)}</span>
                <kyn-header-link href="#">
                  <span>Orchestration Administration</span>
                  ${starSelector()}
                </kyn-header-link>
              </kyn-header-category>

              <kyn-header-category heading="Service Operations">
                <span slot="icon">${unsafeSVG(circleIcon)}</span>
                <kyn-header-link href="#">
                  <span>Auditing</span>
                  ${starSelector()}
                </kyn-header-link>
                <kyn-header-link href="#">
                  <span>Connections Management</span>
                  ${starSelector()}
                </kyn-header-link>
                <kyn-header-link href="#">
                  <span>Logging & Monitoring</span>
                  ${starSelector()}
                </kyn-header-link>
                <kyn-header-link href="#" target="_blank" truncate>
                  <span>Sunrise Insights Administration (legacy)</span>
                  ${starSelector()}
                  <span
                    style="display: flex; width: 16px; height: 16px; flex-shrink: 0;"
                    >${unsafeSVG(launchIcon)}</span
                  >
                </kyn-header-link>
              </kyn-header-category>

              <kyn-header-category heading="Tag Management">
                <span slot="icon">${unsafeSVG(circleIcon)}</span>
                <kyn-header-link href="#" target="_blank" truncate>
                  <span>AIOps Tagging (legacy)</span>
                  ${starSelector()}
                  <span
                    style="display: flex; width: 16px; height: 16px; flex-shrink: 0;"
                    >${unsafeSVG(launchIcon)}</span
                  >
                </kyn-header-link>
                <kyn-header-link href="#">
                  <span>Bridge Tag Management</span>
                  ${starSelector()}
                </kyn-header-link>
              </kyn-header-category>
            </kyn-header-categories>
          </kyn-header-link>
        </kyn-header-nav>
      </kyn-header>
    `;
  },
};

// ---------------------------------------------------------------------------
// JSON-driven implementation helpers
//
// In a real application, `navData` would come from an API response or
// configuration service. The icon map resolves string identifiers from the
// JSON payload to imported SVG assets — the same pattern used in React,
// Angular, or Svelte wrappers around this design system.
// ---------------------------------------------------------------------------

const iconMap = {
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

const renderLink = (link) => html`
  <kyn-header-link
    href=${link.href}
    ?truncate=${link.target === '_blank'}
    target=${link.target || ''}
  >
    ${link.icon
      ? html`<span style="display: inline-flex; align-items: center; gap: 8px;">
          <span style="display: flex; flex-shrink: 0; margin-top: -2px;"
            >${unsafeSVG(iconMap[link.icon])}</span
          >
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

const renderCategory = (cat) => html`
  <kyn-header-category heading=${cat.heading}>
    <span slot="icon"
      >${unsafeSVG(cat.icon ? iconMap[cat.icon] : circleIcon)}</span
    >
    ${cat.links.map((link) => renderLink(link))}
  </kyn-header-category>
`;

const renderSimpleSection = (section) => html`
  <kyn-header-link
    id=${section.id}
    href="javascript:void(0)"
    ?hideSearch=${section.hideSearch}
  >
    <span>${unsafeSVG(iconMap[section.icon])}</span>
    ${section.label}

    <kyn-header-category slot="links">
      ${section.links.map((link) => renderLink(link))}
    </kyn-header-category>
  </kyn-header-link>
  ${section.dividerAfter ? html`<kyn-header-divider></kyn-header-divider>` : ''}
`;

const renderMixedSection = (section) => html`
  <kyn-header-link
    id=${section.id}
    href="javascript:void(0)"
    ?hideSearch=${section.hideSearch}
  >
    <span>${unsafeSVG(iconMap[section.icon])}</span>
    ${section.label}

    <div slot="links" style="display: flex; flex-direction: column; gap: 2px;">
      ${section.topLinks.map((link) => renderLink(link))}
      ${section.categories.map(
        (cat) => html`
          <kyn-header-category heading=${cat.heading} style="margin-top: 8px;">
            <span slot="icon"
              >${unsafeSVG(cat.icon ? iconMap[cat.icon] : circleIcon)}</span
            >
            ${cat.links.map((link) => renderLink(link))}
          </kyn-header-category>
        `
      )}
    </div>
  </kyn-header-link>
`;

const renderTabbedSection = (section) => html`
  <kyn-header-link id=${section.id} href="javascript:void(0)">
    <span>${unsafeSVG(iconMap[section.icon])}</span>
    ${section.label}

    <kyn-tabs tabSize="md" slot="links" style="width: 100%; max-width: none;">
      ${section.tabs.map(
        (tab, i) => html`
          <kyn-tab slot="tabs" id=${tab.id} ?selected=${i === 0}>
            ${tab.label}
          </kyn-tab>
        `
      )}
      ${section.tabs.map(
        (tab, i) => html`
          <kyn-tab-panel tabId=${tab.id} noPadding ?visible=${i === 0}>
            <kyn-header-categories layout="masonry" .maxRootLinks=${0}>
              ${tab.categories.map((cat) => renderCategory(cat))}
            </kyn-header-categories>
          </kyn-tab-panel>
        `
      )}
    </kyn-tabs>
  </kyn-header-link>
`;

const renderCategoricalSection = (section) => html`
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
      .maxRootLinks=${0}
    >
      ${section.categories.map((cat) => renderCategory(cat))}
    </kyn-header-categories>
  </kyn-header-link>
`;

const renderSection = (section) => {
  switch (section.type) {
    case 'simple':
      return renderSimpleSection(section);
    case 'mixed':
      return renderMixedSection(section);
    case 'tabbed':
      return renderTabbedSection(section);
    case 'categorical':
      return renderCategoricalSection(section);
    default:
      return '';
  }
};

export const JSONSwitcher = {
  render: (renderArgs) => {
    return html`
      <kyn-header rootUrl=${renderArgs.rootUrl} appTitle=${renderArgs.appTitle}>
        <span slot="logo" style="--kyn-header-logo-width: 120px;"
          >${unsafeSVG(bridgeLogo)}</span
        >
        <kyn-header-nav
          auto-open-flyout="favorites"
          truncate-links
          style="--kyn-icon-selector-animate-selection: 1; --kyn-icon-selector-only-visible-on-hover: 1; --kyn-icon-selector-persist-when-checked: 1;"
        >
          ${navData.sections.map((section) => renderSection(section))}
        </kyn-header-nav>
      </kyn-header>
    `;
  },
};
