import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { html } from 'lit';
import { useArgs } from 'storybook/preview-api';

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

const args = {
  rootUrl: '/',
  appTitle: 'Application',
  flyoutAutoCollapsed: false,
};

export default {
  title: 'Patterns/Global Switcher',
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
  args,
};

export const FullImplementation = {
  args: {
    ...args,
    activeServicesTab: 'kyndryl',
    flyoutAutoCollapsed: false,
  },
  render: (renderArgs) => {
    const [, updateArgs] = useArgs();

    return html`
      <kyn-header rootUrl=${renderArgs.rootUrl} appTitle=${renderArgs.appTitle}>
        <kyn-header-nav ?flyoutAutoCollapsed=${renderArgs.flyoutAutoCollapsed}>
          <!-- FAVORITES -->
          <kyn-header-link href="javascript:void(0)" hideSearch>
            <span>${unsafeSVG(starFilledIcon)}</span>
            Favorites

            <kyn-header-category slot="links">
              <kyn-header-link href="#">
                <span>Connections Management</span>
                <kyn-icon-selector
                  checked
                  onlyVisibleOnHover
                  persistWhenChecked
                >
                  <span slot="icon-unchecked"
                    >${unsafeSVG(starOutlineIcon)}</span
                  >
                  <span slot="icon-checked">${unsafeSVG(starFilledIcon)}</span>
                </kyn-icon-selector>
              </kyn-header-link>
              <kyn-header-link href="#">
                <span>Discovered Data</span>
                <kyn-icon-selector
                  checked
                  onlyVisibleOnHover
                  persistWhenChecked
                >
                  <span slot="icon-unchecked"
                    >${unsafeSVG(starOutlineIcon)}</span
                  >
                  <span slot="icon-checked">${unsafeSVG(starFilledIcon)}</span>
                </kyn-icon-selector>
              </kyn-header-link>
              <kyn-header-link href="#">
                <span>Visualization, Exploration and Semantic Analytics</span>
                <kyn-icon-selector
                  checked
                  onlyVisibleOnHover
                  persistWhenChecked
                >
                  <span slot="icon-unchecked"
                    >${unsafeSVG(starOutlineIcon)}</span
                  >
                  <span slot="icon-checked">${unsafeSVG(starFilledIcon)}</span>
                </kyn-icon-selector>
              </kyn-header-link>
              <kyn-header-link href="#">
                <span>Topology</span>
                <kyn-icon-selector
                  checked
                  onlyVisibleOnHover
                  persistWhenChecked
                >
                  <span slot="icon-unchecked"
                    >${unsafeSVG(starOutlineIcon)}</span
                  >
                  <span slot="icon-checked">${unsafeSVG(starFilledIcon)}</span>
                </kyn-icon-selector>
              </kyn-header-link>
              <kyn-header-link href="#">
                <span>Menu item five</span>
                <kyn-icon-selector
                  checked
                  onlyVisibleOnHover
                  persistWhenChecked
                >
                  <span slot="icon-unchecked"
                    >${unsafeSVG(starOutlineIcon)}</span
                  >
                  <span slot="icon-checked">${unsafeSVG(starFilledIcon)}</span>
                </kyn-icon-selector>
              </kyn-header-link>
              <kyn-header-link href="#">
                <span>Menu item six</span>
                <kyn-icon-selector
                  checked
                  onlyVisibleOnHover
                  persistWhenChecked
                >
                  <span slot="icon-unchecked"
                    >${unsafeSVG(starOutlineIcon)}</span
                  >
                  <span slot="icon-checked">${unsafeSVG(starFilledIcon)}</span>
                </kyn-icon-selector>
              </kyn-header-link>
              <kyn-header-link href="#">
                <span>Menu Item seven</span>
                <kyn-icon-selector
                  checked
                  onlyVisibleOnHover
                  persistWhenChecked
                >
                  <span slot="icon-unchecked"
                    >${unsafeSVG(starOutlineIcon)}</span
                  >
                  <span slot="icon-checked">${unsafeSVG(starFilledIcon)}</span>
                </kyn-icon-selector>
              </kyn-header-link>
            </kyn-header-category>
          </kyn-header-link>

          <!-- RECENTLY VIEWED -->
          <kyn-header-link href="javascript:void(0)" hideSearch>
            <span>${unsafeSVG(historyIcon)}</span>
            Recently Viewed

            <kyn-header-category slot="links">
              <kyn-header-link href="#"><span>Topology</span></kyn-header-link>
              <kyn-header-link href="#"
                ><span>Discovered Data</span></kyn-header-link
              >
              <kyn-header-link href="#"
                ><span>Connections Management</span></kyn-header-link
              >
              <kyn-header-link href="#"
                ><span>Sustainability Advisor</span></kyn-header-link
              >
              <kyn-header-link href="#"
                ><span>Discovered Data</span></kyn-header-link
              >
              <kyn-header-link href="#"
                ><span>Private Cloud IaaS/PaaS</span></kyn-header-link
              >
              <kyn-header-link href="#"
                ><span>Mass Recovery Model</span></kyn-header-link
              >
              <kyn-header-link href="#"
                ><span
                  >Assessment for Microsoft Azure Stack Hyper Converged
                  Infrastructure</span
                ></kyn-header-link
              >
              <kyn-header-link href="#"
                ><span>Private Cloud IaaS/PaaS</span></kyn-header-link
              >
              <kyn-header-link href="#"
                ><span
                  >Rapid Assessments for Enterprise Sustainability</span
                ></kyn-header-link
              >
            </kyn-header-category>
          </kyn-header-link>

          <kyn-header-divider></kyn-header-divider>

          <!-- CONSOLE -->
          <!-- Single column layout: use div wrapper instead of kyn-header-categories -->
          <kyn-header-link href="javascript:void(0)" hideSearch>
            <span>${unsafeSVG(consoleIcon)}</span>
            Console

            <div
              slot="links"
              style="display: flex; flex-direction: column; gap: 2px;"
            >
              <kyn-header-link href="#">
                <span>Bridge Home</span>
                <kyn-icon-selector onlyVisibleOnHover persistWhenChecked>
                  <span slot="icon-unchecked"
                    >${unsafeSVG(starOutlineIcon)}</span
                  >
                  <span slot="icon-checked">${unsafeSVG(starFilledIcon)}</span>
                </kyn-icon-selector>
              </kyn-header-link>
              <kyn-header-link href="#">
                <span>All Dashboards</span>
                <kyn-icon-selector onlyVisibleOnHover persistWhenChecked>
                  <span slot="icon-unchecked"
                    >${unsafeSVG(starOutlineIcon)}</span
                  >
                  <span slot="icon-checked">${unsafeSVG(starFilledIcon)}</span>
                </kyn-icon-selector>
              </kyn-header-link>

              <kyn-header-category
                heading="Dashboards"
                style="margin-top: 8px;"
              >
                <kyn-header-link href="#">
                  <span>Actionable Insights</span>
                  <kyn-icon-selector onlyVisibleOnHover persistWhenChecked>
                    <span slot="icon-unchecked"
                      >${unsafeSVG(starOutlineIcon)}</span
                    >
                    <span slot="icon-checked"
                      >${unsafeSVG(starFilledIcon)}</span
                    >
                  </kyn-icon-selector>
                </kyn-header-link>
                <kyn-header-link href="#">
                  <span>AIOps IT Health Indicators Dashboard</span>
                  <kyn-icon-selector onlyVisibleOnHover persistWhenChecked>
                    <span slot="icon-unchecked"
                      >${unsafeSVG(starOutlineIcon)}</span
                    >
                    <span slot="icon-checked"
                      >${unsafeSVG(starFilledIcon)}</span
                    >
                  </kyn-icon-selector>
                </kyn-header-link>
                <kyn-header-link href="#" target="_blank">
                  <span>Business Console (legacy)</span>
                  <kyn-icon-selector onlyVisibleOnHover persistWhenChecked>
                    <span slot="icon-unchecked"
                      >${unsafeSVG(starOutlineIcon)}</span
                    >
                    <span slot="icon-checked"
                      >${unsafeSVG(starFilledIcon)}</span
                    >
                  </kyn-icon-selector>
                  <span
                    style="display: flex; width: 16px; height: 16px; flex-shrink: 0;"
                    >${unsafeSVG(launchIcon)}</span
                  >
                </kyn-header-link>
                <kyn-header-link href="#" target="_blank">
                  <span>Business Service Insights (legacy)</span>
                  <kyn-icon-selector onlyVisibleOnHover persistWhenChecked>
                    <span slot="icon-unchecked"
                      >${unsafeSVG(starOutlineIcon)}</span
                    >
                    <span slot="icon-checked"
                      >${unsafeSVG(starFilledIcon)}</span
                    >
                  </kyn-icon-selector>
                  <span
                    style="display: flex; width: 16px; height: 16px; flex-shrink: 0;"
                    >${unsafeSVG(launchIcon)}</span
                  >
                </kyn-header-link>
              </kyn-header-category>
            </div>
          </kyn-header-link>

          <!-- SERVICES -->
          <kyn-header-link href="javascript:void(0)">
            <span>${unsafeSVG(servicesIcon)}</span>
            Services

            <kyn-tabs
              tabSize="lg"
              slot="links"
              style="width: 100%; max-width: none;"
            >
              <kyn-tab
                slot="tabs"
                id="kyndryl"
                ?selected=${renderArgs.activeServicesTab === 'kyndryl'}
                @click=${() => updateArgs({ activeServicesTab: 'kyndryl' })}
              >
                Kyndryl Services
              </kyn-tab>

              <kyn-tab
                slot="tabs"
                id="platform"
                ?selected=${renderArgs.activeServicesTab === 'platform'}
                @click=${() => updateArgs({ activeServicesTab: 'platform' })}
              >
                Platform Services
              </kyn-tab>

              <!-- KYNDRYL SERVICES TAB -->
              <kyn-tab-panel
                tabId="kyndryl"
                noPadding
                ?visible=${renderArgs.activeServicesTab === 'kyndryl'}
              >
                <div style="display: flex; gap: 32px; width: 100%;">
                  <!-- LEFT COLUMN -->
                  <div
                    style="display: flex; flex-direction: column; gap: 8px; flex: 1; min-width: 0;"
                  >
                    <kyn-header-category heading="Applications, Data, & AI">
                      <kyn-header-link href="#">
                        <span>Business Intelligence</span>
                        <kyn-icon-selector
                          onlyVisibleOnHover
                          persistWhenChecked
                        >
                          <span slot="icon-unchecked"
                            >${unsafeSVG(starOutlineIcon)}</span
                          >
                          <span slot="icon-checked"
                            >${unsafeSVG(starFilledIcon)}</span
                          >
                        </kyn-icon-selector>
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span>Storage Migration</span>
                        <kyn-icon-selector
                          onlyVisibleOnHover
                          persistWhenChecked
                        >
                          <span slot="icon-unchecked"
                            >${unsafeSVG(starOutlineIcon)}</span
                          >
                          <span slot="icon-checked"
                            >${unsafeSVG(starFilledIcon)}</span
                          >
                        </kyn-icon-selector>
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span
                          >Visualization, Exploration and Semantic
                          Analytics</span
                        >
                        <kyn-icon-selector
                          onlyVisibleOnHover
                          persistWhenChecked
                        >
                          <span slot="icon-unchecked"
                            >${unsafeSVG(starOutlineIcon)}</span
                          >
                          <span slot="icon-checked"
                            >${unsafeSVG(starFilledIcon)}</span
                          >
                        </kyn-icon-selector>
                      </kyn-header-link>
                    </kyn-header-category>

                    <kyn-header-category heading="Cloud Services">
                      <kyn-header-link href="#">
                        <span
                          >Assessment for Microsoft Azure Stack Hyper Converged
                          Infrastructure</span
                        >
                        <kyn-icon-selector
                          onlyVisibleOnHover
                          persistWhenChecked
                        >
                          <span slot="icon-unchecked"
                            >${unsafeSVG(starOutlineIcon)}</span
                          >
                          <span slot="icon-checked"
                            >${unsafeSVG(starFilledIcon)}</span
                          >
                        </kyn-icon-selector>
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span>Private Cloud IaaS/PaaS</span>
                        <kyn-icon-selector
                          onlyVisibleOnHover
                          persistWhenChecked
                        >
                          <span slot="icon-unchecked"
                            >${unsafeSVG(starOutlineIcon)}</span
                          >
                          <span slot="icon-checked"
                            >${unsafeSVG(starFilledIcon)}</span
                          >
                        </kyn-icon-selector>
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span
                          >Rapid Assessments for Enterprise Sustainability</span
                        >
                        <kyn-icon-selector
                          onlyVisibleOnHover
                          persistWhenChecked
                        >
                          <span slot="icon-unchecked"
                            >${unsafeSVG(starOutlineIcon)}</span
                          >
                          <span slot="icon-checked"
                            >${unsafeSVG(starFilledIcon)}</span
                          >
                        </kyn-icon-selector>
                      </kyn-header-link>
                    </kyn-header-category>
                  </div>

                  <!-- MIDDLE COLUMN -->
                  <div
                    style="display: flex; flex-direction: column; gap: 8px; flex: 1; min-width: 0;"
                  >
                    <kyn-header-category heading="Core Enterprise & Z Cloud">
                      <kyn-header-link href="#">
                        <span
                          >Application Management Services for IBM Z and IBM
                          i</span
                        >
                        <kyn-icon-selector
                          onlyVisibleOnHover
                          persistWhenChecked
                        >
                          <span slot="icon-unchecked"
                            >${unsafeSVG(starOutlineIcon)}</span
                          >
                          <span slot="icon-checked"
                            >${unsafeSVG(starFilledIcon)}</span
                          >
                        </kyn-icon-selector>
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span
                          >Managed Extended Cloud IaaS for IBM i on Skytap</span
                        >
                        <kyn-icon-selector
                          onlyVisibleOnHover
                          persistWhenChecked
                        >
                          <span slot="icon-unchecked"
                            >${unsafeSVG(starOutlineIcon)}</span
                          >
                          <span slot="icon-checked"
                            >${unsafeSVG(starFilledIcon)}</span
                          >
                        </kyn-icon-selector>
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span
                          >Managed Extended Cloud IaaS for IBM Z (zCloud)</span
                        >
                        <kyn-icon-selector
                          onlyVisibleOnHover
                          persistWhenChecked
                        >
                          <span slot="icon-unchecked"
                            >${unsafeSVG(starOutlineIcon)}</span
                          >
                          <span slot="icon-checked"
                            >${unsafeSVG(starFilledIcon)}</span
                          >
                        </kyn-icon-selector>
                      </kyn-header-link>
                    </kyn-header-category>

                    <kyn-header-category heading="Digital Workplace">
                      <kyn-header-link href="#">
                        <span>Connected Experience</span>
                        <kyn-icon-selector
                          onlyVisibleOnHover
                          persistWhenChecked
                        >
                          <span slot="icon-unchecked"
                            >${unsafeSVG(starOutlineIcon)}</span
                          >
                          <span slot="icon-checked"
                            >${unsafeSVG(starFilledIcon)}</span
                          >
                        </kyn-icon-selector>
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span>Digital Experience Management</span>
                        <kyn-icon-selector
                          onlyVisibleOnHover
                          persistWhenChecked
                        >
                          <span slot="icon-unchecked"
                            >${unsafeSVG(starOutlineIcon)}</span
                          >
                          <span slot="icon-checked"
                            >${unsafeSVG(starFilledIcon)}</span
                          >
                        </kyn-icon-selector>
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span>Modern Device Management Services</span>
                        <kyn-icon-selector
                          onlyVisibleOnHover
                          persistWhenChecked
                        >
                          <span slot="icon-unchecked"
                            >${unsafeSVG(starOutlineIcon)}</span
                          >
                          <span slot="icon-checked"
                            >${unsafeSVG(starFilledIcon)}</span
                          >
                        </kyn-icon-selector>
                      </kyn-header-link>
                    </kyn-header-category>

                    <kyn-header-category heading="Network & Edge">
                      <kyn-header-link href="#">
                        <span>Managed Network Services</span>
                        <kyn-icon-selector
                          onlyVisibleOnHover
                          persistWhenChecked
                        >
                          <span slot="icon-unchecked"
                            >${unsafeSVG(starOutlineIcon)}</span
                          >
                          <span slot="icon-checked"
                            >${unsafeSVG(starFilledIcon)}</span
                          >
                        </kyn-icon-selector>
                      </kyn-header-link>
                    </kyn-header-category>
                  </div>

                  <!-- RIGHT COLUMN -->
                  <div
                    style="display: flex; flex-direction: column; gap: 8px; flex: 1; min-width: 0;"
                  >
                    <kyn-header-category heading="Security & Resiliency">
                      <kyn-header-link href="#">
                        <span>Continuous Controls Monitoring & Management</span>
                        <kyn-icon-selector
                          onlyVisibleOnHover
                          persistWhenChecked
                        >
                          <span slot="icon-unchecked"
                            >${unsafeSVG(starOutlineIcon)}</span
                          >
                          <span slot="icon-checked"
                            >${unsafeSVG(starFilledIcon)}</span
                          >
                        </kyn-icon-selector>
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span>Enterprise Security Compliance Management</span>
                        <kyn-icon-selector
                          onlyVisibleOnHover
                          persistWhenChecked
                        >
                          <span slot="icon-unchecked"
                            >${unsafeSVG(starOutlineIcon)}</span
                          >
                          <span slot="icon-checked"
                            >${unsafeSVG(starFilledIcon)}</span
                          >
                        </kyn-icon-selector>
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span>Intelligent Recovery Service</span>
                        <kyn-icon-selector
                          onlyVisibleOnHover
                          persistWhenChecked
                        >
                          <span slot="icon-unchecked"
                            >${unsafeSVG(starOutlineIcon)}</span
                          >
                          <span slot="icon-checked"
                            >${unsafeSVG(starFilledIcon)}</span
                          >
                        </kyn-icon-selector>
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span>Mass Recovery Model</span>
                        <kyn-icon-selector
                          onlyVisibleOnHover
                          persistWhenChecked
                        >
                          <span slot="icon-unchecked"
                            >${unsafeSVG(starOutlineIcon)}</span
                          >
                          <span slot="icon-checked"
                            >${unsafeSVG(starFilledIcon)}</span
                          >
                        </kyn-icon-selector>
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span>Recovery Retainer Service</span>
                        <kyn-icon-selector
                          onlyVisibleOnHover
                          persistWhenChecked
                        >
                          <span slot="icon-unchecked"
                            >${unsafeSVG(starOutlineIcon)}</span
                          >
                          <span slot="icon-checked"
                            >${unsafeSVG(starFilledIcon)}</span
                          >
                        </kyn-icon-selector>
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span>Security & Network Operations</span>
                        <kyn-icon-selector
                          onlyVisibleOnHover
                          persistWhenChecked
                        >
                          <span slot="icon-unchecked"
                            >${unsafeSVG(starOutlineIcon)}</span
                          >
                          <span slot="icon-checked"
                            >${unsafeSVG(starFilledIcon)}</span
                          >
                        </kyn-icon-selector>
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span>Security Operations as a Platform</span>
                        <kyn-icon-selector
                          onlyVisibleOnHover
                          persistWhenChecked
                        >
                          <span slot="icon-unchecked"
                            >${unsafeSVG(starOutlineIcon)}</span
                          >
                          <span slot="icon-checked"
                            >${unsafeSVG(starFilledIcon)}</span
                          >
                        </kyn-icon-selector>
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span>Sustainability Advisor</span>
                        <kyn-icon-selector
                          onlyVisibleOnHover
                          persistWhenChecked
                        >
                          <span slot="icon-unchecked"
                            >${unsafeSVG(starOutlineIcon)}</span
                          >
                          <span slot="icon-checked"
                            >${unsafeSVG(starFilledIcon)}</span
                          >
                        </kyn-icon-selector>
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span>Vulnerability Management Service</span>
                        <kyn-icon-selector
                          onlyVisibleOnHover
                          persistWhenChecked
                        >
                          <span slot="icon-unchecked"
                            >${unsafeSVG(starOutlineIcon)}</span
                          >
                          <span slot="icon-checked"
                            >${unsafeSVG(starFilledIcon)}</span
                          >
                        </kyn-icon-selector>
                      </kyn-header-link>
                    </kyn-header-category>
                  </div>
                </div>
              </kyn-tab-panel>

              <!-- PLATFORM SERVICES TAB -->
              <kyn-tab-panel
                tabId="platform"
                noPadding
                ?visible=${renderArgs.activeServicesTab === 'platform'}
              >
                <div style="display: flex; gap: 32px; width: 100%;">
                  <!-- LEFT COLUMN -->
                  <div
                    style="display: flex; flex-direction: column; gap: 8px; flex: 1; min-width: 0;"
                  >
                    <kyn-header-category
                      heading="Application & Business Services"
                    >
                      <kyn-header-link href="#">
                        <span>Application Modernization Intelligence</span>
                        <kyn-icon-selector
                          onlyVisibleOnHover
                          persistWhenChecked
                        >
                          <span slot="icon-unchecked"
                            >${unsafeSVG(starOutlineIcon)}</span
                          >
                          <span slot="icon-checked"
                            >${unsafeSVG(starFilledIcon)}</span
                          >
                        </kyn-icon-selector>
                      </kyn-header-link>
                    </kyn-header-category>

                    <kyn-header-category heading="Change Management">
                      <kyn-header-link href="#" target="_blank">
                        <span>Guided Change Manager (legacy)</span>
                        <span
                          style="display: inline-flex; align-items: center; margin-left: auto; gap: 8px; flex-shrink: 0;"
                        >
                          <kyn-icon-selector
                            onlyVisibleOnHover
                            persistWhenChecked
                          >
                            <span slot="icon-unchecked"
                              >${unsafeSVG(starOutlineIcon)}</span
                            >
                            <span slot="icon-checked"
                              >${unsafeSVG(starFilledIcon)}</span
                            >
                          </kyn-icon-selector>
                          <span
                            style="display: flex; width: 16px; height: 16px;"
                            >${unsafeSVG(launchIcon)}</span
                          >
                        </span>
                      </kyn-header-link>
                    </kyn-header-category>

                    <kyn-header-category heading="Cloud Management">
                      <kyn-header-link href="#">
                        <span>Container Cluster Management</span>
                        <kyn-icon-selector
                          onlyVisibleOnHover
                          persistWhenChecked
                        >
                          <span slot="icon-unchecked"
                            >${unsafeSVG(starOutlineIcon)}</span
                          >
                          <span slot="icon-checked"
                            >${unsafeSVG(starFilledIcon)}</span
                          >
                        </kyn-icon-selector>
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span>FinOps & Cost Optimization Intelligence</span>
                        <kyn-icon-selector
                          onlyVisibleOnHover
                          persistWhenChecked
                        >
                          <span slot="icon-unchecked"
                            >${unsafeSVG(starOutlineIcon)}</span
                          >
                          <span slot="icon-checked"
                            >${unsafeSVG(starFilledIcon)}</span
                          >
                        </kyn-icon-selector>
                      </kyn-header-link>
                    </kyn-header-category>

                    <kyn-header-category heading="Data Analytics">
                      <kyn-header-link href="#">
                        <span>Data Fabric</span>
                        <kyn-icon-selector
                          onlyVisibleOnHover
                          persistWhenChecked
                        >
                          <span slot="icon-unchecked"
                            >${unsafeSVG(starOutlineIcon)}</span
                          >
                          <span slot="icon-checked"
                            >${unsafeSVG(starFilledIcon)}</span
                          >
                        </kyn-icon-selector>
                      </kyn-header-link>
                    </kyn-header-category>

                    <kyn-header-category heading="Discovery">
                      <kyn-header-link href="#">
                        <span>Discovered Data</span>
                        <kyn-icon-selector
                          onlyVisibleOnHover
                          persistWhenChecked
                        >
                          <span slot="icon-unchecked"
                            >${unsafeSVG(starOutlineIcon)}</span
                          >
                          <span slot="icon-checked"
                            >${unsafeSVG(starFilledIcon)}</span
                          >
                        </kyn-icon-selector>
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span>Discovered Management</span>
                        <kyn-icon-selector
                          onlyVisibleOnHover
                          persistWhenChecked
                        >
                          <span slot="icon-unchecked"
                            >${unsafeSVG(starOutlineIcon)}</span
                          >
                          <span slot="icon-checked"
                            >${unsafeSVG(starFilledIcon)}</span
                          >
                        </kyn-icon-selector>
                      </kyn-header-link>
                    </kyn-header-category>
                  </div>

                  <!-- MIDDLE COLUMN -->
                  <div
                    style="display: flex; flex-direction: column; gap: 8px; flex: 1; min-width: 0;"
                  >
                    <kyn-header-category heading="Inventory">
                      <kyn-header-link href="#" target="_blank">
                        <span>Applications & Resources (legacy)</span>
                        <span
                          style="display: inline-flex; align-items: center; margin-left: auto; gap: 8px; flex-shrink: 0;"
                        >
                          <kyn-icon-selector
                            onlyVisibleOnHover
                            persistWhenChecked
                          >
                            <span slot="icon-unchecked"
                              >${unsafeSVG(starOutlineIcon)}</span
                            >
                            <span slot="icon-checked"
                              >${unsafeSVG(starFilledIcon)}</span
                            >
                          </kyn-icon-selector>
                          <span
                            style="display: flex; width: 16px; height: 16px;"
                            >${unsafeSVG(launchIcon)}</span
                          >
                        </span>
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span>Application Inventory</span>
                        <kyn-icon-selector
                          onlyVisibleOnHover
                          persistWhenChecked
                        >
                          <span slot="icon-unchecked"
                            >${unsafeSVG(starOutlineIcon)}</span
                          >
                          <span slot="icon-checked"
                            >${unsafeSVG(starFilledIcon)}</span
                          >
                        </kyn-icon-selector>
                      </kyn-header-link>
                      <kyn-header-link href="#" target="_blank">
                        <span>Infrastructure & Cloud Inventory (legacy)</span>
                        <span
                          style="display: inline-flex; align-items: center; margin-left: auto; gap: 8px; flex-shrink: 0;"
                        >
                          <kyn-icon-selector
                            onlyVisibleOnHover
                            persistWhenChecked
                          >
                            <span slot="icon-unchecked"
                              >${unsafeSVG(starOutlineIcon)}</span
                            >
                            <span slot="icon-checked"
                              >${unsafeSVG(starFilledIcon)}</span
                            >
                          </kyn-icon-selector>
                          <span
                            style="display: flex; width: 16px; height: 16px;"
                            >${unsafeSVG(launchIcon)}</span
                          >
                        </span>
                      </kyn-header-link>
                      <kyn-header-link href="#" target="_blank">
                        <span>Inventory Insights (legacy)</span>
                        <span
                          style="display: inline-flex; align-items: center; margin-left: auto; gap: 8px; flex-shrink: 0;"
                        >
                          <kyn-icon-selector
                            onlyVisibleOnHover
                            persistWhenChecked
                          >
                            <span slot="icon-unchecked"
                              >${unsafeSVG(starOutlineIcon)}</span
                            >
                            <span slot="icon-checked"
                              >${unsafeSVG(starFilledIcon)}</span
                            >
                          </kyn-icon-selector>
                          <span
                            style="display: flex; width: 16px; height: 16px;"
                            >${unsafeSVG(launchIcon)}</span
                          >
                        </span>
                      </kyn-header-link>
                      <kyn-header-link href="#" target="_blank">
                        <span>Location Dictionary (legacy)</span>
                        <span
                          style="display: inline-flex; align-items: center; margin-left: auto; gap: 8px; flex-shrink: 0;"
                        >
                          <kyn-icon-selector
                            onlyVisibleOnHover
                            persistWhenChecked
                          >
                            <span slot="icon-unchecked"
                              >${unsafeSVG(starOutlineIcon)}</span
                            >
                            <span slot="icon-checked"
                              >${unsafeSVG(starFilledIcon)}</span
                            >
                          </kyn-icon-selector>
                          <span
                            style="display: flex; width: 16px; height: 16px;"
                            >${unsafeSVG(launchIcon)}</span
                          >
                        </span>
                      </kyn-header-link>
                      <kyn-header-link href="#" target="_blank">
                        <span>Product Dictionary (legacy)</span>
                        <span
                          style="display: inline-flex; align-items: center; margin-left: auto; gap: 8px; flex-shrink: 0;"
                        >
                          <kyn-icon-selector
                            onlyVisibleOnHover
                            persistWhenChecked
                          >
                            <span slot="icon-unchecked"
                              >${unsafeSVG(starOutlineIcon)}</span
                            >
                            <span slot="icon-checked"
                              >${unsafeSVG(starFilledIcon)}</span
                            >
                          </kyn-icon-selector>
                          <span
                            style="display: flex; width: 16px; height: 16px;"
                            >${unsafeSVG(launchIcon)}</span
                          >
                        </span>
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span>Tagging Compliance Report</span>
                        <kyn-icon-selector
                          onlyVisibleOnHover
                          persistWhenChecked
                        >
                          <span slot="icon-unchecked"
                            >${unsafeSVG(starOutlineIcon)}</span
                          >
                          <span slot="icon-checked"
                            >${unsafeSVG(starFilledIcon)}</span
                          >
                        </kyn-icon-selector>
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span>Topology</span>
                        <kyn-icon-selector
                          onlyVisibleOnHover
                          persistWhenChecked
                        >
                          <span slot="icon-unchecked"
                            >${unsafeSVG(starOutlineIcon)}</span
                          >
                          <span slot="icon-checked"
                            >${unsafeSVG(starFilledIcon)}</span
                          >
                        </kyn-icon-selector>
                      </kyn-header-link>
                      <kyn-header-link href="#" target="_blank">
                        <span>Workstation Inventory (legacy)</span>
                        <span
                          style="display: inline-flex; align-items: center; margin-left: auto; gap: 8px; flex-shrink: 0;"
                        >
                          <kyn-icon-selector
                            onlyVisibleOnHover
                            persistWhenChecked
                          >
                            <span slot="icon-unchecked"
                              >${unsafeSVG(starOutlineIcon)}</span
                            >
                            <span slot="icon-checked"
                              >${unsafeSVG(starFilledIcon)}</span
                            >
                          </kyn-icon-selector>
                          <span
                            style="display: flex; width: 16px; height: 16px;"
                            >${unsafeSVG(launchIcon)}</span
                          >
                        </span>
                      </kyn-header-link>
                    </kyn-header-category>

                    <kyn-header-category heading="Knowledge & AI">
                      <kyn-header-link href="#">
                        <span>Agentic AI Designer</span>
                        <kyn-icon-selector
                          onlyVisibleOnHover
                          persistWhenChecked
                        >
                          <span slot="icon-unchecked"
                            >${unsafeSVG(starOutlineIcon)}</span
                          >
                          <span slot="icon-checked"
                            >${unsafeSVG(starFilledIcon)}</span
                          >
                        </kyn-icon-selector>
                      </kyn-header-link>
                      <kyn-header-link href="#" target="_blank">
                        <span
                          >Artificial Intelligence for IT Operations
                          (legacy)</span
                        >
                        <span
                          style="display: inline-flex; align-items: center; margin-left: auto; gap: 8px; flex-shrink: 0;"
                        >
                          <kyn-icon-selector
                            onlyVisibleOnHover
                            persistWhenChecked
                          >
                            <span slot="icon-unchecked"
                              >${unsafeSVG(starOutlineIcon)}</span
                            >
                            <span slot="icon-checked"
                              >${unsafeSVG(starFilledIcon)}</span
                            >
                          </kyn-icon-selector>
                          <span
                            style="display: flex; width: 16px; height: 16px;"
                            >${unsafeSVG(launchIcon)}</span
                          >
                        </span>
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span>Bridge AI Assist Configuration</span>
                        <kyn-icon-selector
                          onlyVisibleOnHover
                          persistWhenChecked
                        >
                          <span slot="icon-unchecked"
                            >${unsafeSVG(starOutlineIcon)}</span
                          >
                          <span slot="icon-checked"
                            >${unsafeSVG(starFilledIcon)}</span
                          >
                        </kyn-icon-selector>
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span>Knowledge Foundation</span>
                        <kyn-icon-selector
                          onlyVisibleOnHover
                          persistWhenChecked
                        >
                          <span slot="icon-unchecked"
                            >${unsafeSVG(starOutlineIcon)}</span
                          >
                          <span slot="icon-checked"
                            >${unsafeSVG(starFilledIcon)}</span
                          >
                        </kyn-icon-selector>
                      </kyn-header-link>
                    </kyn-header-category>
                  </div>

                  <!-- RIGHT COLUMN -->
                  <div
                    style="display: flex; flex-direction: column; gap: 8px; flex: 1; min-width: 0;"
                  >
                    <kyn-header-category
                      heading="Provisioning Orchestration & Automation"
                    >
                      <kyn-header-link href="#" target="_blank">
                        <span>Actions (legacy)</span>
                        <kyn-icon-selector
                          onlyVisibleOnHover
                          persistWhenChecked
                        >
                          <span slot="icon-unchecked"
                            >${unsafeSVG(starOutlineIcon)}</span
                          >
                          <span slot="icon-checked"
                            >${unsafeSVG(starFilledIcon)}</span
                          >
                        </kyn-icon-selector>
                        <span
                          style="display: flex; width: 16px; height: 16px; flex-shrink: 0;"
                          >${unsafeSVG(launchIcon)}</span
                        >
                      </kyn-header-link>
                      <kyn-header-link href="#" target="_blank">
                        <span>Automation (legacy)</span>
                        <kyn-icon-selector
                          onlyVisibleOnHover
                          persistWhenChecked
                        >
                          <span slot="icon-unchecked"
                            >${unsafeSVG(starOutlineIcon)}</span
                          >
                          <span slot="icon-checked"
                            >${unsafeSVG(starFilledIcon)}</span
                          >
                        </kyn-icon-selector>
                        <span
                          style="display: flex; width: 16px; height: 16px; flex-shrink: 0;"
                          >${unsafeSVG(launchIcon)}</span
                        >
                      </kyn-header-link>
                      <kyn-header-link href="#" target="_blank">
                        <span>Scheduler (legacy)</span>
                        <kyn-icon-selector
                          onlyVisibleOnHover
                          persistWhenChecked
                        >
                          <span slot="icon-unchecked"
                            >${unsafeSVG(starOutlineIcon)}</span
                          >
                          <span slot="icon-checked"
                            >${unsafeSVG(starFilledIcon)}</span
                          >
                        </kyn-icon-selector>
                        <span
                          style="display: flex; width: 16px; height: 16px; flex-shrink: 0;"
                          >${unsafeSVG(launchIcon)}</span
                        >
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span>Workflow Executions</span>
                        <kyn-icon-selector
                          onlyVisibleOnHover
                          persistWhenChecked
                        >
                          <span slot="icon-unchecked"
                            >${unsafeSVG(starOutlineIcon)}</span
                          >
                          <span slot="icon-checked"
                            >${unsafeSVG(starFilledIcon)}</span
                          >
                        </kyn-icon-selector>
                      </kyn-header-link>
                    </kyn-header-category>

                    <kyn-header-category heading="Toolchain & Pipeline">
                      <kyn-header-link href="#">
                        <span>DevOps Intelligence</span>
                        <kyn-icon-selector
                          onlyVisibleOnHover
                          persistWhenChecked
                        >
                          <span slot="icon-unchecked"
                            >${unsafeSVG(starOutlineIcon)}</span
                          >
                          <span slot="icon-checked"
                            >${unsafeSVG(starFilledIcon)}</span
                          >
                        </kyn-icon-selector>
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span>Machine Learning Operations Pipeline</span>
                        <kyn-icon-selector
                          onlyVisibleOnHover
                          persistWhenChecked
                        >
                          <span slot="icon-unchecked"
                            >${unsafeSVG(starOutlineIcon)}</span
                          >
                          <span slot="icon-checked"
                            >${unsafeSVG(starFilledIcon)}</span
                          >
                        </kyn-icon-selector>
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span>Tool Chain Management</span>
                        <kyn-icon-selector
                          onlyVisibleOnHover
                          persistWhenChecked
                        >
                          <span slot="icon-unchecked"
                            >${unsafeSVG(starOutlineIcon)}</span
                          >
                          <span slot="icon-checked"
                            >${unsafeSVG(starFilledIcon)}</span
                          >
                        </kyn-icon-selector>
                      </kyn-header-link>
                    </kyn-header-category>
                  </div>
                </div>
              </kyn-tab-panel>
            </kyn-tabs>
          </kyn-header-link>

          <!-- CATALOGS -->
          <kyn-header-link href="javascript:void(0)" hideSearch>
            <span>${unsafeSVG(catalogIcon)}</span>
            Catalogs

            <kyn-header-category slot="links">
              <kyn-header-link href="#">
                <span>Bridge Private Catalog</span>
                <kyn-icon-selector onlyVisibleOnHover persistWhenChecked>
                  <span slot="icon-unchecked"
                    >${unsafeSVG(starOutlineIcon)}</span
                  >
                  <span slot="icon-checked">${unsafeSVG(starFilledIcon)}</span>
                </kyn-icon-selector>
              </kyn-header-link>
              <kyn-header-link href="#">
                <span>Bridge Service Catalog</span>
                <kyn-icon-selector onlyVisibleOnHover persistWhenChecked>
                  <span slot="icon-unchecked"
                    >${unsafeSVG(starOutlineIcon)}</span
                  >
                  <span slot="icon-checked">${unsafeSVG(starFilledIcon)}</span>
                </kyn-icon-selector>
              </kyn-header-link>
              <kyn-header-link href="#">
                <span>Enablement Catalog</span>
                <kyn-icon-selector onlyVisibleOnHover persistWhenChecked>
                  <span slot="icon-unchecked"
                    >${unsafeSVG(starOutlineIcon)}</span
                  >
                  <span slot="icon-checked">${unsafeSVG(starFilledIcon)}</span>
                </kyn-icon-selector>
              </kyn-header-link>
              <kyn-header-link href="#">
                <span>Orchestration Catalog</span>
                <kyn-icon-selector onlyVisibleOnHover persistWhenChecked>
                  <span slot="icon-unchecked"
                    >${unsafeSVG(starOutlineIcon)}</span
                  >
                  <span slot="icon-checked">${unsafeSVG(starFilledIcon)}</span>
                </kyn-icon-selector>
              </kyn-header-link>
            </kyn-header-category>
          </kyn-header-link>

          <!-- ADMINISTRATION -->
          <!-- Two-column layout with explicit column arrangement -->
          <kyn-header-link href="javascript:void(0)" hideSearch>
            <span>${unsafeSVG(adminIcon)}</span>
            Administration

            <div slot="links" style="display: flex; gap: 32px;">
              <!-- LEFT COLUMN -->
              <div
                style="display: flex; flex-direction: column; gap: 8px; flex: 1; min-width: 0;"
              >
                <!-- ACCESS MANAGEMENT -->
                <kyn-header-category heading="Access Management">
                  <kyn-header-link href="#">
                    <span>Access Request Management System (ARMS)</span>
                    <kyn-icon-selector onlyVisibleOnHover persistWhenChecked>
                      <span slot="icon-unchecked"
                        >${unsafeSVG(starOutlineIcon)}</span
                      >
                      <span slot="icon-checked"
                        >${unsafeSVG(starFilledIcon)}</span
                      >
                    </kyn-icon-selector>
                  </kyn-header-link>
                  <kyn-header-link href="#">
                    <span>Bridge Access Management</span>
                    <kyn-icon-selector onlyVisibleOnHover persistWhenChecked>
                      <span slot="icon-unchecked"
                        >${unsafeSVG(starOutlineIcon)}</span
                      >
                      <span slot="icon-checked"
                        >${unsafeSVG(starFilledIcon)}</span
                      >
                    </kyn-icon-selector>
                  </kyn-header-link>
                  <kyn-header-link href="#">
                    <span>Service Access Management</span>
                    <kyn-icon-selector onlyVisibleOnHover persistWhenChecked>
                      <span slot="icon-unchecked"
                        >${unsafeSVG(starOutlineIcon)}</span
                      >
                      <span slot="icon-checked"
                        >${unsafeSVG(starFilledIcon)}</span
                      >
                    </kyn-icon-selector>
                  </kyn-header-link>
                </kyn-header-category>

                <!-- POLICY SERVICE -->
                <kyn-header-category heading="Policy Service">
                  <kyn-header-link href="#">
                    <span>Policy Management (Bundles)</span>
                    <kyn-icon-selector onlyVisibleOnHover persistWhenChecked>
                      <span slot="icon-unchecked"
                        >${unsafeSVG(starOutlineIcon)}</span
                      >
                      <span slot="icon-checked"
                        >${unsafeSVG(starFilledIcon)}</span
                      >
                    </kyn-icon-selector>
                  </kyn-header-link>
                </kyn-header-category>

                <!-- PROVISIONING ORCHESTRATION & ADMINISTRATION -->
                <kyn-header-category
                  heading="Provisioning Orchestration & Administration"
                >
                  <kyn-header-link href="#">
                    <span>Orchestration Administration</span>
                    <kyn-icon-selector onlyVisibleOnHover persistWhenChecked>
                      <span slot="icon-unchecked"
                        >${unsafeSVG(starOutlineIcon)}</span
                      >
                      <span slot="icon-checked"
                        >${unsafeSVG(starFilledIcon)}</span
                      >
                    </kyn-icon-selector>
                  </kyn-header-link>
                </kyn-header-category>
              </div>

              <!-- RIGHT COLUMN -->
              <div
                style="display: flex; flex-direction: column; gap: 8px; flex: 1; min-width: 0;"
              >
                <!-- SERVICE OPERATIONS -->
                <kyn-header-category heading="Service Operations">
                  <kyn-header-link href="#">
                    <span>Auditing</span>
                    <kyn-icon-selector onlyVisibleOnHover persistWhenChecked>
                      <span slot="icon-unchecked"
                        >${unsafeSVG(starOutlineIcon)}</span
                      >
                      <span slot="icon-checked"
                        >${unsafeSVG(starFilledIcon)}</span
                      >
                    </kyn-icon-selector>
                  </kyn-header-link>
                  <kyn-header-link href="#">
                    <span>Connections Management</span>
                    <kyn-icon-selector onlyVisibleOnHover persistWhenChecked>
                      <span slot="icon-unchecked"
                        >${unsafeSVG(starOutlineIcon)}</span
                      >
                      <span slot="icon-checked"
                        >${unsafeSVG(starFilledIcon)}</span
                      >
                    </kyn-icon-selector>
                  </kyn-header-link>
                  <kyn-header-link href="#">
                    <span>Logging & Monitoring</span>
                    <kyn-icon-selector onlyVisibleOnHover persistWhenChecked>
                      <span slot="icon-unchecked"
                        >${unsafeSVG(starOutlineIcon)}</span
                      >
                      <span slot="icon-checked"
                        >${unsafeSVG(starFilledIcon)}</span
                      >
                    </kyn-icon-selector>
                  </kyn-header-link>
                  <kyn-header-link href="#" target="_blank">
                    <span>Sunrise Insights Administration (legacy)</span>
                    <kyn-icon-selector onlyVisibleOnHover persistWhenChecked>
                      <span slot="icon-unchecked"
                        >${unsafeSVG(starOutlineIcon)}</span
                      >
                      <span slot="icon-checked"
                        >${unsafeSVG(starFilledIcon)}</span
                      >
                    </kyn-icon-selector>
                    <span
                      style="display: flex; width: 16px; height: 16px; flex-shrink: 0;"
                      >${unsafeSVG(launchIcon)}</span
                    >
                  </kyn-header-link>
                </kyn-header-category>

                <!-- TAG MANAGEMENT -->
                <kyn-header-category heading="Tag Management">
                  <kyn-header-link href="#" target="_blank">
                    <span>AIOps Tagging (legacy)</span>
                    <kyn-icon-selector onlyVisibleOnHover persistWhenChecked>
                      <span slot="icon-unchecked"
                        >${unsafeSVG(starOutlineIcon)}</span
                      >
                      <span slot="icon-checked"
                        >${unsafeSVG(starFilledIcon)}</span
                      >
                    </kyn-icon-selector>
                    <span
                      style="display: flex; width: 16px; height: 16px; flex-shrink: 0;"
                      >${unsafeSVG(launchIcon)}</span
                    >
                  </kyn-header-link>
                  <kyn-header-link href="#">
                    <span>Bridge Tag Management</span>
                    <kyn-icon-selector onlyVisibleOnHover persistWhenChecked>
                      <span slot="icon-unchecked"
                        >${unsafeSVG(starOutlineIcon)}</span
                      >
                      <span slot="icon-checked"
                        >${unsafeSVG(starFilledIcon)}</span
                      >
                    </kyn-icon-selector>
                  </kyn-header-link>
                </kyn-header-category>
              </div>
            </div>
          </kyn-header-link>
        </kyn-header-nav>
      </kyn-header>
    `;
  },
};
