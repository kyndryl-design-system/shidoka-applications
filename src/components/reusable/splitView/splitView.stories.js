import { html } from 'lit';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { action } from 'storybook/actions';

import './index';
import '../button/button';
import '../badge/badge';
import '../blockCodeView/blockCodeView';
import '../widget/widget';
import { WIDGET_STATUS } from '../widget/defs';

import statusIconCritical from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/document-no-access.svg';
import statusIconHigh from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/cloud-services.svg';
import statusIconMedium from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/access-management.svg';
import statusIconLow from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/settings.svg';

export default {
  title: 'Components/Layout & Structure/Split View',
  component: 'kyn-split-view',
  tags: ['version:v2.95.0', 'new'],
  argTypes: {
    startPaneSize: { control: { type: 'text' } },
    endPaneSize: { control: { type: 'text' } },
    compactBreakpoint: { control: { type: 'number', min: 0, step: 8 } },
    minPaneSize: { control: { type: 'number', min: 0, step: 8 } },
    minCenterSize: { control: { type: 'number', min: 0, step: 8 } },
    startPaneLabel: { control: { type: 'text' } },
    primaryPaneLabel: { control: { type: 'text' } },
    endPaneLabel: { control: { type: 'text' } },
    startDividerInverted: {
      options: ['none', 'left', 'right'],
      control: { type: 'select' },
    },
    endDividerInverted: {
      options: ['none', 'left', 'right'],
      control: { type: 'select' },
    },
    hideBorder: { control: { type: 'boolean' } },
    // Exclude kyn-divider sub-component props that leak through
    decorative: { control: false, table: { disable: true } },
    resizeLabel: { control: false, table: { disable: true } },
    dragging: { control: false, table: { disable: true } },
    hideHairline: { control: false, table: { disable: true } },
    dragHandle: { control: false, table: { disable: true } },
    invertedHandle: { control: false, table: { disable: true } },
    vertical: { control: false, table: { disable: true } },
    'drag-handle': { control: false, table: { disable: true } },
    'inverted-handle': { control: false, table: { disable: true } },
  },
  parameters: {
    layout: 'fullscreen',
    design: {
      type: 'figma',
      url: '',
    },
  },
  decorators: [
    (story) => html`
      <style>
        .story-container {
          box-sizing: border-box;
          width: 100%;
          max-width: 1280px;
          margin: 0 auto;
          padding: var(--kd-spacing-24);
          min-height: 420px;
          background: var(--kd-color-background-page-default);
        }

        .story-container kyn-split-view {
          height: min(640px, 82vh);
        }

        .sv-placeholder {
          padding: var(--kd-spacing-16);
          color: var(--kd-color-text-level-secondary);
          font: var(--kd-font-body-01);
        }

        .sv-issue-list {
          display: flex;
          flex-direction: column;
          flex: 1;
          background: var(--kd-color-background-container-ai-level-2);
          padding: var(--kd-spacing-16);
          gap: var(--kd-spacing-16);
          box-sizing: border-box;
        }

        .sv-issue-list__scroll {
          display: flex;
          flex-direction: column;
          gap: var(--kd-spacing-16);
        }

        .sv-issue-widget__content {
          display: flex;
          flex-direction: column;
          gap: var(--kd-spacing-8);
        }

        .sv-issue-widget__header {
          display: flex;
          align-items: flex-start;
          gap: var(--kd-spacing-8);
        }

        .sv-issue-widget__leading-icon {
          width: 16px;
          height: 16px;
          display: inline-flex;
          flex-shrink: 0;
          margin-top: 3px;
        }

        .sv-issue-widget__copy {
          flex: 1 1 auto;
          min-width: 0;
        }

        .sv-issue-widget__title {
          margin: 0 0 var(--kd-spacing-2);
          font: var(--kd-font-ui-01);
          font-weight: var(--kd-font-weight-bold);
        }

        .sv-issue-widget__desc,
        .sv-issue-widget__time {
          margin: 0;
          color: var(--kd-color-text-level-secondary);
          font: var(--kd-font-ui-02);
        }

        .sv-issue-detail {
          display: flex;
          flex-direction: column;
          flex: 1;
          gap: var(--kd-spacing-16);
          padding: var(--kd-spacing-24);
          box-sizing: border-box;
        }

        .sv-issue-detail__title-row {
          display: flex;
          align-items: center;
          gap: var(--kd-spacing-12);
          flex-wrap: wrap;
        }

        .sv-issue-detail__title {
          margin: 0;
          font: var(--kd-font-heading-04);
          font-weight: var(--kd-font-weight-bold);
        }

        .sv-issue-detail__section-title {
          margin: 0 0 var(--kd-spacing-8);
          font: var(--kd-font-heading-06);
          font-weight: var(--kd-font-weight-bold);
        }

        .sv-issue-detail__body {
          margin: 0;
          font: var(--kd-font-body-01);
          max-width: 72ch;
        }

        .sv-issue-detail__footer {
          margin-top: auto;
          display: flex;
          gap: var(--kd-spacing-8);
          flex-wrap: wrap;
        }

        .sv-code-pane {
          display: flex;
          flex-direction: column;
          flex: 1 1 auto;
          min-height: 0;
          background: var(--kd-color-code-view-background);
        }

        .sv-code-pane kyn-block-code-view {
          flex: 1 1 auto;
          min-height: 0;
          width: 100%;
        }

        kyn-split-view[compact] .sv-code-pane {
          height: auto;
          overflow: visible;
          flex: none;
        }
      </style>
      <div class="story-container">${story()}</div>
    `,
  ],
};

// -- Demo data helpers --

const BADGE_STATUS = {
  [WIDGET_STATUS.CRITICAL]: 'critical',
  [WIDGET_STATUS.HIGH]: 'error',
  [WIDGET_STATUS.MEDIUM]: 'warning',
  [WIDGET_STATUS.LOW]: 'success',
};

const ISSUE_WIDGET_STATUS = {
  [WIDGET_STATUS.CRITICAL]: WIDGET_STATUS.INFORMATION,
  [WIDGET_STATUS.HIGH]: WIDGET_STATUS.ERROR,
  [WIDGET_STATUS.MEDIUM]: WIDGET_STATUS.WARNING,
  [WIDGET_STATUS.LOW]: WIDGET_STATUS.SUCCESS,
};

const CODE_SAMPLE = `/**
 * Example service bootstrap (demo only).
 */
import { fetchConfig } from './config';

const DEFAULT_TIMEOUT_MS = 30_000;

export async function runDiagnostics(options = {}) {
  const { signal } = options;
  const config = await fetchConfig({ timeout: DEFAULT_TIMEOUT_MS, signal });

  if (!config.enabled) {
    console.warn('Diagnostics disabled by configuration.');
    return { ok: false, reason: 'disabled' };
  }

  const results = await Promise.all(
    config.checks.map((check) => executeCheck(check, signal))
  );

  return { ok: results.every((r) => r.passed), results };
}

function executeCheck(check, signal) {
  void signal;
  return Promise.resolve({ name: check.id, passed: true });
}
`;

const CODE_DEMO_ALL = `function isEven(number) {
  return Number(number) % 2 === 0;
}
const isOdd = (number) => !isEven(number);

console.log(process.env.STRING);
const args = process.argv.slice(2);
console.log(args[0]);
console.log(args[1], args[2]);

console.log(3.14159 * 42);
console.log(1e100 + 0.001);
const foo = 0xffffffff;
const masked = foo & 0xdeadbeef;`;

const issueListItem = ({
  status,
  icon,
  label,
  selected = false,
  description,
}) => html`
  <kyn-widget
    ?removeHeader=${true}
    widgetStatus=${selected
      ? WIDGET_STATUS.DEFAULT
      : ISSUE_WIDGET_STATUS[status]}
  >
    <div class="sv-issue-widget__content">
      <div class="sv-issue-widget__header">
        <span class="sv-issue-widget__leading-icon" aria-hidden="true">
          ${unsafeSVG(icon)}
        </span>
        <div class="sv-issue-widget__copy">
          <h3 class="sv-issue-widget__title">Issue title goes here</h3>
          <p class="sv-issue-widget__desc">${description}</p>
        </div>
        <kyn-badge
          label=${label}
          size="sm"
          type="heavy"
          status=${BADGE_STATUS[status]}
          iconTitle=${`${label} severity`}
          ?hideIcon=${true}
        ></kyn-badge>
      </div>
      <div>
        <span class="sv-issue-widget__time">2 min ago</span>
      </div>
    </div>
  </kyn-widget>
`;

const issueDetailPane = () => html`
  <div class="sv-issue-detail">
    <div class="sv-issue-detail__title-row">
      <h2 class="sv-issue-detail__title">Issue title</h2>
      <kyn-badge
        label="Critical"
        size="md"
        type="heavy"
        status=${BADGE_STATUS[WIDGET_STATUS.CRITICAL]}
        iconTitle="Critical severity"
        ?hideIcon=${true}
      ></kyn-badge>
    </div>
    <div>
      <h3 class="sv-issue-detail__section-title">Root cause analysis</h3>
      <p class="sv-issue-detail__body">
        The service timed out when calling the upstream dependency under load.
      </p>
    </div>
    <div>
      <h3 class="sv-issue-detail__section-title">Suggested fix</h3>
      <p class="sv-issue-detail__body">
        Increase pool size and add exponential backoff on transient failures.
      </p>
    </div>
    <div class="sv-issue-detail__footer">
      <kyn-button kind="primary" size="small">Apply fix</kyn-button>
      <kyn-button kind="secondary" size="small"
        >Run diagnostics again</kyn-button
      >
    </div>
  </div>
`;

const codePaneContent = (snippet) => html`
  <div class="sv-code-pane">
    <kyn-block-code-view
      flush
      darkTheme="dark"
      language="javascript"
      copyOptionVisible
      ?codeViewExpandable=${false}
      codeSnippet=${snippet}
    ></kyn-block-code-view>
  </div>
`;

const issueList = () => html`
  <div class="sv-issue-list">
    <div class="sv-issue-list__scroll">
      ${issueListItem({
        status: WIDGET_STATUS.CRITICAL,
        icon: statusIconCritical,
        label: 'Critical',
        selected: true,
        description: 'Short description of the issue here',
      })}
      ${issueListItem({
        status: WIDGET_STATUS.HIGH,
        icon: statusIconHigh,
        label: 'High',
        description: 'Short description of the issue here',
      })}
      ${issueListItem({
        status: WIDGET_STATUS.MEDIUM,
        icon: statusIconMedium,
        label: 'Medium',
        description: 'Short description of the issue here',
      })}
      ${issueListItem({
        status: WIDGET_STATUS.LOW,
        icon: statusIconLow,
        label: 'Low',
        description: 'Short description of the issue here',
      })}
    </div>
  </div>
`;

// -- Stories --

export const TwoPane = {
  args: {
    startPaneSize: '39%',
    compactBreakpoint: 900,
    minPaneSize: 120,
    minCenterSize: 160,
    startPaneLabel: 'Start',
    primaryPaneLabel: 'Primary',
    startDividerInverted: 'none',
    hideBorder: false,
  },
  render: (args) => html`
    <kyn-split-view
      startPaneSize=${args.startPaneSize}
      compactBreakpoint=${args.compactBreakpoint}
      minPaneSize=${args.minPaneSize}
      minCenterSize=${args.minCenterSize}
      startPaneLabel=${args.startPaneLabel}
      primaryPaneLabel=${args.primaryPaneLabel}
      startDividerInverted=${args.startDividerInverted}
      ?hideBorder=${args.hideBorder}
      @on-resize=${(e) => action(e.type)({ ...e, detail: e.detail })}
    >
      <div slot="start" class="sv-placeholder">Start pane</div>
      <div class="sv-placeholder">Primary pane (flex)</div>
    </kyn-split-view>
  `,
};

export const ThreePane = {
  args: {
    startPaneSize: '36%',
    endPaneSize: '28%',
    compactBreakpoint: 900,
    minPaneSize: 120,
    minCenterSize: 160,
    startPaneLabel: 'Start',
    primaryPaneLabel: 'Primary',
    endPaneLabel: 'End',
    startDividerInverted: 'none',
    endDividerInverted: 'none',
    hideBorder: false,
  },
  render: (args) => html`
    <kyn-split-view
      startPaneSize=${args.startPaneSize}
      endPaneSize=${args.endPaneSize}
      compactBreakpoint=${args.compactBreakpoint}
      minPaneSize=${args.minPaneSize}
      minCenterSize=${args.minCenterSize}
      startPaneLabel=${args.startPaneLabel}
      primaryPaneLabel=${args.primaryPaneLabel}
      endPaneLabel=${args.endPaneLabel}
      startDividerInverted=${args.startDividerInverted}
      endDividerInverted=${args.endDividerInverted}
      ?hideBorder=${args.hideBorder}
      @on-resize=${(e) => action(e.type)({ ...e, detail: e.detail })}
    >
      <div slot="start" class="sv-placeholder">Start pane</div>
      <div class="sv-placeholder">Primary pane (flex)</div>
      <div slot="end" class="sv-placeholder">End pane</div>
    </kyn-split-view>
  `,
};

export const TwoPaneImplemented = {
  name: 'Two Panes — Example Implementation',
  parameters: { controls: { disable: true } },
  render: () => html`
    <kyn-split-view
      startPaneSize="420px"
      compactBreakpoint="0"
      startPaneLabel="Issue detail"
      primaryPaneLabel="Code rail"
      startDividerInverted="right"
      @on-resize=${(e) => action(e.type)({ ...e, detail: e.detail })}
    >
      <div
        slot="start"
        role="region"
        tabindex="0"
        aria-label="Issue detail pane"
      >
        ${issueDetailPane()}
      </div>
      <div role="region" tabindex="0" aria-label="Code rail pane">
        ${codePaneContent(CODE_SAMPLE)}
      </div>
    </kyn-split-view>
  `,
};

export const ThreePaneImplemented = {
  name: 'Three Panes — Example Implementation',
  parameters: { controls: { disable: true } },
  render: () => html`
    <kyn-split-view
      startPaneSize="420px"
      endPaneSize="320px"
      compactBreakpoint="0"
      startPaneLabel="Issue list"
      primaryPaneLabel="Issue detail"
      endPaneLabel="Code rail"
      endDividerInverted="right"
      @on-resize=${(e) => action(e.type)({ ...e, detail: e.detail })}
    >
      <div slot="start" role="region" tabindex="0" aria-label="Issue list pane">
        ${issueList()}
      </div>
      <div role="region" tabindex="0" aria-label="Issue detail pane">
        ${issueDetailPane()}
      </div>
      <div slot="end" role="region" tabindex="0" aria-label="Code rail pane">
        ${codePaneContent(CODE_DEMO_ALL)}
      </div>
    </kyn-split-view>
  `,
};
