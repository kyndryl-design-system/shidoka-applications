<template>
  <kyn-ui-shell>
    <kyn-header
      root-url="/"
      app-title="Shidoka Playground"
    >
      <span slot="logo" style="--kyn-header-logo-width: 120px;">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 24" fill="currentColor" aria-hidden="true">
          <text x="0" y="18" font-size="18" font-weight="600">Shidoka</text>
        </svg>
      </span>
      <kyn-header-nav
        slot="left"
        style="--kyn-global-switcher-max-height: 70vh;"
      >
        <kyn-header-link
          label="Applications"
          search-threshold="2"
        >
          <kyn-header-category
            slot="links"
            heading="CATEGORY"
          >
            <kyn-header-link href="#">Connections Management</kyn-header-link>
            <kyn-header-link href="#">Discovered Data</kyn-header-link>
            <kyn-header-link href="#">Visualization &amp; Analytics</kyn-header-link>
            <kyn-header-link href="#">Topology</kyn-header-link>
            <kyn-header-link href="#">Settings</kyn-header-link>
            <kyn-header-link href="#">Support</kyn-header-link>
          </kyn-header-category>
        </kyn-header-link>
      </kyn-header-nav>
      <kyn-header-flyouts>
        <kyn-header-flyout
          hide-menu-label
          hide-button-label
          no-padding
          @on-flyout-toggle="onWorkspaceFlyoutToggle"
        >
          <span
            slot="button"
            style="display: flex; align-items: center; gap: 8px; font-size: 14px;"
          >
            <span
              id="workspace-trigger-label"
              class="account-name"
              :title="workspaceTriggerLabel"
            >{{ workspaceTriggerLabel }}</span>
            <span
              class="account-chevron"
              ref="workspaceChevronRef"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5z"/></svg>
            </span>
          </span>
          <kyn-workspace-switcher
            id="workspace-switcher"
            class="ui-impl-switcher"
            :style="{ maxHeight: 'var(--kyn-workspace-switcher-max-height, 70vh)' }"
            :text-strings="workspaceTextStrings"
            @on-click="onWorkspaceSwitcherClick"
          >
            <div slot="left">
              <strong>Current workspace</strong>
              <p>{{ workspaceTriggerLabel }}</p>
            </div>
            <kyn-workspace-switcher-menu-item
              slot="left-list"
              variant="workspace"
              value="ws-1"
              name="Workspace One"
              :count="3"
              :selected="true"
            />
            <kyn-workspace-switcher-menu-item
              slot="left-list"
              variant="workspace"
              value="ws-2"
              name="Workspace Two"
              :count="1"
            />
            <kyn-workspace-switcher-menu-item
              slot="right-list"
              variant="item"
              value="item-1"
              name="Account A"
            />
            <kyn-workspace-switcher-menu-item
              slot="right-list"
              variant="item"
              value="item-2"
              name="Account B"
            />
          </kyn-workspace-switcher>
        </kyn-header-flyout>
        <kyn-header-flyout hide-menu-label>
          <span slot="button">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>
          </span>
          <kyn-header-link href="#">Notifications</kyn-header-link>
        </kyn-header-flyout>
        <kyn-header-flyout>
          <span slot="button">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/></svg>
          </span>
          <kyn-header-link href="#">Help</kyn-header-link>
        </kyn-header-flyout>
        <kyn-header-flyout hide-menu-label>
          <span slot="button">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
          </span>
          <kyn-header-user-profile
            user-name="User"
            subtext="user@example.com"
          />
          <kyn-header-link href="#">Profile Settings</kyn-header-link>
          <kyn-header-link href="#">Sign Out</kyn-header-link>
        </kyn-header-flyout>
      </kyn-header-flyouts>
    </kyn-header>

    <kyn-local-nav>
      <kyn-local-nav-link
        href="#"
        :active="true"
      >Dashboard</kyn-local-nav-link>
      <kyn-local-nav-link href="#">Data</kyn-local-nav-link>
      <kyn-local-nav-link href="#">Analytics</kyn-local-nav-link>
      <kyn-local-nav-link href="#">Settings</kyn-local-nav-link>
    </kyn-local-nav>

    <main style="padding: var(--kd-page-gutter, 1rem);">
      <kyn-page-title
        head-line="Section"
        page-title="Data Table"
        style="margin-bottom: 1rem;"
      />
      <div
        style="display: flex; justify-content: space-between; align-items: center; gap: 1rem; margin: 1rem 0;"
      >
        <kyn-side-drawer
          size="md"
          title-text="Drawer"
          label-text="Open drawer"
          close-btn-description="Close drawer"
          :hide-footer="true"
        >
          <kyn-button
            slot="anchor"
            kind="tertiary"
            description="Open side drawer"
          >
            OPEN SESAME
          </kyn-button>
          <ul style="list-style: none; padding: 0; margin: 0;">
            <li style="padding: 0.5rem 0;">Item 1</li>
            <li style="padding: 0.5rem 0;">Item 2</li>
          </ul>
        </kyn-side-drawer>
        <kyn-button kind="ghost">
          MYSTERY
        </kyn-button>
      </div>

      <div style="width: 100%; margin-bottom: 1.5rem;">
        <kd-chart
          chart-title="Sample line chart"
          type="line"
          height="280"
          style="width: 100%; display: block;"
          :labels="chartLabels"
          :datasets="chartDatasets"
          :options="chartOptions"
          hide-description
        />
      </div>

      <div
        style="width: 100%; overflow: auto; max-height: 360px; border: 1px solid var(--kd-color-border, #e0e0e0); border-radius: 4px;"
      >
        <kyn-table-container>
          <kyn-table>
            <kyn-thead>
              <kyn-header-tr>
                <kyn-th>Name</kyn-th>
                <kyn-th>Status</kyn-th>
                <kyn-th>Value</kyn-th>
              </kyn-header-tr>
            </kyn-thead>
            <kyn-tbody>
              <kyn-tr
                v-for="row in tableRows"
                :key="row.id"
                :row-id="row.id"
              >
                <kyn-td>{{ row.name }}</kyn-td>
                <kyn-td>{{ row.status }}</kyn-td>
                <kyn-td>{{ row.value }}</kyn-td>
              </kyn-tr>
            </kyn-tbody>
          </kyn-table>
        </kyn-table-container>
      </div>
    </main>

    <kyn-footer
      root-url="/"
      logo-aria-label="Home"
    >
      <span slot="copyright">
        Copyright © {{ new Date().getFullYear() }} Kyndryl Inc. All rights reserved.
      </span>
    </kyn-footer>
  </kyn-ui-shell>
</template>

<script setup>
import { ref } from 'vue'

const workspaceTextStrings = {
  currentTitle: 'Current',
  workspacesTitle: 'Workspaces',
  backToWorkspaces: 'Back to workspaces'
}

const workspaceTriggerLabel = ref('Workspace One')

function getNameByValue(value) {
  const map = {
    'ws-1': 'Workspace One',
    'ws-2': 'Workspace Two',
    'item-1': 'Account A',
    'item-2': 'Account B'
  }
  return map[value] ?? value
}

const workspaceChevronRef = ref(null)

function onWorkspaceFlyoutToggle(event) {
  const open = event?.detail?.open ?? false
  if (workspaceChevronRef.value) {
    workspaceChevronRef.value.style.transform = open ? 'rotate(180deg)' : 'rotate(0deg)'
  }
}

function onWorkspaceSwitcherClick(event) {
  const value = event?.detail?.value
  if (value != null) {
    workspaceTriggerLabel.value = getNameByValue(value)
  }
}

const chartLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
const chartDatasets = ref([
  {
    label: 'Series A',
    data: [12, 19, 8, 15, 22, 18],
    fill: false,
    tension: 0.3
  },
  {
    label: 'Series B',
    data: [2, 9, 14, 11, 7, 12],
    fill: false,
    tension: 0.3
  }
])
const chartOptions = ref({
  maintainAspectRatio: false,
  responsive: true,
  scales: {
    x: {
      display: true,
      title: { display: true, text: 'Category' }
    },
    y: {
      display: true,
      title: { display: true, text: 'Value' },
      beginAtZero: true
    }
  }
})

const tableRows = ref([
  { id: '1', name: 'Row one', status: 'Active', value: '100' },
  { id: '2', name: 'Row two', status: 'Pending', value: '200' },
  { id: '3', name: 'Row three', status: 'Active', value: '150' },
  { id: '4', name: 'Row four', status: 'Inactive', value: '75' },
  { id: '5', name: 'Row five', status: 'Active', value: '300' }
])
</script>

<style scoped>
.account-name {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.account-chevron {
  display: flex;
  transition: transform 0.2s;
}
.ui-impl-switcher {
  width: 625px;
  max-width: 100%;
}
@media (max-width: 52rem) {
  .ui-impl-switcher {
    max-width: 375px;
  }
}
@media (max-width: 42rem) {
  .ui-impl-switcher {
    max-width: 100%;
  }
}
</style>
