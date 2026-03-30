import { html } from 'lit';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';

import '../../components/reusable/button/button';
import '../../components/reusable/badge/badge';
import '../../components/reusable/divider/divider';
import '../../components/reusable/blockCodeView/blockCodeView';
import '../../components/reusable/tabs';
import '../../components/reusable/widget/widget';
import { WIDGET_STATUS } from '../../components/reusable/widget/defs';

import statusIconCritical from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/document-no-access.svg';
import statusIconHigh from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/cloud-services.svg';
import statusIconMedium from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/access-management.svg';
import statusIconLow from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/settings.svg';

const MIN_PANE_PX = 120;
const MIN_CENTER_PX = 160;
const DIVIDER_PX = 8;

const splitViewArgTypes = {
  panes: {
    control: { type: 'select' },
    options: [2, 3],
  },
  startPaneWidthPx: {
    control: { type: 'number', min: MIN_PANE_PX, step: 8 },
  },
  endPaneWidthPx: {
    control: { type: 'number', min: MIN_PANE_PX, step: 8 },
  },
  startPaneBackground: {
    control: { type: 'text' },
  },
  primaryPaneBackground: {
    control: { type: 'text' },
  },
  endPaneBackground: {
    control: { type: 'text' },
  },
  compactBreakpointPx: {
    control: { type: 'number', min: 320, step: 8 },
  },
  compactHeightPx: {
    control: { type: 'number', min: 360, step: 8 },
  },
};

const splitViewStyles = html`<style>
  .split-view-shell {
    box-sizing: border-box;
    width: 100%;
    max-width: 1280px;
    margin: 0 auto;
    padding: var(--kd-spacing-24);
    min-height: 420px;
    background: var(--kd-color-background-page-default);
  }

  .split-view {
    display: flex;
    align-items: stretch;
    width: 100%;
    height: min(640px, 82vh);
    border: 1px solid var(--kd-color-border-level-secondary);
    border-radius: 8px;
    box-shadow: var(--kd-elevation-level-1, 0 1px 3px rgb(0 0 0 / 8%));
    overflow: hidden;
    box-sizing: border-box;
    background: var(--kd-color-background-page-default);
  }

  .split-view--compact {
    flex-direction: column;
  }

  .split-view-responsive__compact {
    display: none;
  }

  .pane {
    min-width: 0;
    min-height: 0;
    height: 100%;
    overflow: auto;
    box-sizing: border-box;
  }

  .pane--start {
    flex: 0 0 var(--split-view-start-width, 36%);
    background: var(
      --split-view-start-pane-background,
      var(--kd-color-background-page-default)
    );
    margin-right: -4px;
  }

  .pane--primary {
    flex: 1 1 auto;
    background: var(
      --split-view-primary-pane-background,
      var(--kd-color-background-container-default)
    );
    margin-left: -4px;
  }

  .pane--end {
    flex: 0 0 var(--split-view-end-width, 28%);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: var(
      --split-view-end-pane-background,
      var(--kd-color-code-view-background)
    );
    margin-left: -4px;
  }

  .split-view--three .pane--primary {
    margin-right: -4px;
  }

  .split-view--two .pane--start {
    flex-basis: var(--split-view-start-width, 39%);
  }

  .split-view__divider {
    flex: 0 0 8px;
    min-width: 8px;
    display: flex;
    background: transparent;
    cursor: ew-resize;
    position: relative;
    z-index: 1;
  }

  .split-view__divider kyn-divider {
    width: 100%;
    height: 100%;
  }

  .pane--placeholder {
    padding: var(--kd-spacing-16);
    color: var(--kd-color-text-level-secondary);
    font: var(--kd-font-body-01);
  }

  .issue-list {
    display: flex;
    flex-direction: column;
    min-height: 100%;
    background: var(--kd-color-background-container-ai-level-2);
    padding: var(--kd-spacing-16);
    gap: var(--kd-spacing-16);
    box-sizing: border-box;
  }

  .issue-list__scroll {
    display: flex;
    flex-direction: column;
    gap: var(--kd-spacing-16);
  }

  .issue-widget__content {
    display: flex;
    flex-direction: column;
    gap: var(--kd-spacing-8);
  }

  .issue-widget__header {
    display: flex;
    align-items: flex-start;
    gap: var(--kd-spacing-8);
  }

  .issue-widget__leading-icon {
    width: 16px;
    height: 16px;
    display: inline-flex;
  }

  .issue-widget__copy {
    flex: 1 1 auto;
    min-width: 0;
  }

  .issue-widget__title {
    margin: 0 0 var(--kd-spacing-2);
    font: var(--kd-font-ui-01);
    font-weight: var(--kd-font-weight-bold);
  }

  .issue-widget__desc,
  .issue-widget__time {
    margin: 0;
    color: var(--kd-color-text-level-secondary);
    font: var(--kd-font-ui-02);
  }

  .issue-detail {
    display: flex;
    flex-direction: column;
    gap: var(--kd-spacing-16);
    min-height: 100%;
    padding: var(--kd-spacing-24);
    box-sizing: border-box;
  }

  .issue-detail__title-row {
    display: flex;
    align-items: center;
    gap: var(--kd-spacing-12);
    flex-wrap: wrap;
  }

  .issue-detail__title {
    margin: 0;
    font: var(--kd-font-heading-04);
    font-weight: var(--kd-font-weight-bold);
  }

  .issue-detail__section-title {
    margin: 0 0 var(--kd-spacing-8);
    font: var(--kd-font-heading-06);
    font-weight: var(--kd-font-weight-bold);
  }

  .issue-detail__body {
    margin: 0;
    font: var(--kd-font-body-01);
    max-width: 72ch;
  }

  .issue-detail__footer {
    margin-top: auto;
    display: flex;
    gap: var(--kd-spacing-8);
    flex-wrap: wrap;
  }

  .code-pane {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    min-height: 0;
    height: 100%;
    overflow: hidden;
    padding: 0;
    box-sizing: border-box;
    background: var(
      --split-view-end-pane-background,
      var(--kd-color-code-view-background)
    );
  }

  .code-pane kyn-block-code-view {
    flex: 1 1 auto;
    min-height: 0;
    width: 100%;
    height: 100%;
  }

  .split-view-compact {
    --split-view-compact-height: var(--split-view-compact-height-px, 520px);
    --split-view-compact-content-height: calc(
      var(--split-view-compact-height) - 58px
    );
    height: var(--split-view-compact-height);
    border: 1px solid var(--kd-color-border-level-secondary);
    border-radius: 8px;
    box-shadow: var(--kd-elevation-level-1, 0 1px 3px rgb(0 0 0 / 8%));
    overflow: hidden;
    background: var(--kd-color-background-page-default);
  }

  .split-view-compact kyn-tabs {
    height: 100%;
    display: block;
  }

  .split-view-compact kyn-tab-panel[visible] {
    display: block;
    height: 100%;
  }

  .compact-pane {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    height: var(--split-view-compact-content-height);
    min-height: 0;
    overflow: auto;
    box-sizing: border-box;
  }

  .compact-pane--start {
    background: var(
      --split-view-start-pane-background,
      var(--kd-color-background-page-default)
    );
  }

  .compact-pane--primary {
    background: var(
      --split-view-primary-pane-background,
      var(--kd-color-background-container-default)
    );
  }

  .compact-pane--end {
    background: var(
      --split-view-end-pane-background,
      var(--kd-color-code-view-background)
    );
  }

  @media (max-width: var(--split-view-compact-breakpoint, 900px)) {
    .split-view-responsive__desktop {
      display: none;
    }

    .split-view-responsive__compact {
      display: block;
    }
  }
</style>`;

const MINIMAL_TWO_PANE_JS = `/**
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

const CODE_DEMO_JAVASCRIPT = `function isEven(number) {
  return Number(number) % 2 === 0;
}
const isOdd = (number) => !isEven(number);`;

const CODE_DEMO_JAVASCRIPT_CLI = `console.log(process.env.STRING);
const args = process.argv.slice(2);
console.log(args[0]);
console.log(args[1], args[2]);`;

const CODE_DEMO_JAVASCRIPT_MATH = `console.log(3.14159 * 42);
console.log(1e100 + 0.001);
const foo = 0xffffffff;
const masked = foo & 0xdeadbeef;`;

const CODE_DEMO_ALL = [
  CODE_DEMO_JAVASCRIPT,
  CODE_DEMO_JAVASCRIPT_CLI,
  CODE_DEMO_JAVASCRIPT_MATH,
].join('\n\n');

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

const panePlaceholder = (label) => html`
  <div class="pane--placeholder">${label}</div>
`;

const splitViewStyleVars = ({
  startPaneWidthPx = 39,
  endPaneWidthPx = 320,
  startPaneBackground = 'var(--kd-color-background-page-default)',
  primaryPaneBackground = 'var(--kd-color-background-container-default)',
  endPaneBackground = 'var(--kd-color-code-view-background)',
  compactBreakpointPx = 900,
  compactHeightPx = 520,
}) =>
  [
    `--split-view-start-width:${startPaneWidthPx}px`,
    `--split-view-end-width:${endPaneWidthPx}px`,
    `--split-view-start-pane-background:${startPaneBackground}`,
    `--split-view-primary-pane-background:${primaryPaneBackground}`,
    `--split-view-end-pane-background:${endPaneBackground}`,
    `--split-view-compact-breakpoint:${compactBreakpointPx}px`,
    `--split-view-compact-height-px:${compactHeightPx}px`,
  ].join(';');

const compactTabs = ({
  panes = 3,
  pane1Label = 'Start pane',
  pane2Label = 'Primary pane',
  pane3Label = 'End pane',
  pane1Content,
  pane2Content,
  pane3Content,
}) => html`
  <div class="split-view-compact">
    <kyn-tabs tabSize="md" scrollablePanels>
      <kyn-tab slot="tabs" id="pane-1" selected>${pane1Label}</kyn-tab>
      <kyn-tab slot="tabs" id="pane-2">${pane2Label}</kyn-tab>
      ${panes === 3
        ? html`<kyn-tab slot="tabs" id="pane-3">${pane3Label}</kyn-tab>`
        : null}

      <kyn-tab-panel tabId="pane-1" visible noPadding>
        <section class="compact-pane compact-pane--start">
          ${pane1Content}
        </section>
      </kyn-tab-panel>
      <kyn-tab-panel tabId="pane-2" noPadding>
        <section class="compact-pane compact-pane--primary">
          ${pane2Content}
        </section>
      </kyn-tab-panel>
      ${panes === 3
        ? html`
            <kyn-tab-panel tabId="pane-3" noPadding>
              <section class="compact-pane compact-pane--end">
                ${pane3Content}
              </section>
            </kyn-tab-panel>
          `
        : null}
    </kyn-tabs>
  </div>
`;

function onDividerPointerDown(which, e) {
  if (e.button !== 0) return;

  const dividerEl = e.currentTarget;
  const splitView = dividerEl.closest('.split-view');
  if (!splitView) return;

  const startPane = splitView.querySelector('[data-pane="start"]');
  const endPane = splitView.querySelector('[data-pane="end"]');
  if (!startPane) return;

  const pointerId = e.pointerId;
  const startX = e.clientX;
  const trackWidth = splitView.getBoundingClientRect().width;
  const startWidth = startPane.getBoundingClientRect().width;
  const endWidth = endPane ? endPane.getBoundingClientRect().width : 0;
  const dividerGrip = dividerEl.querySelector('kyn-divider');

  dividerGrip?.setAttribute('dragging', '');
  splitView.style.userSelect = 'none';
  splitView.style.cursor = 'ew-resize';

  try {
    dividerEl.setPointerCapture(pointerId);
  } catch {
    /* no-op */
  }

  const onMove = (moveEvent) => {
    if (moveEvent.pointerId !== pointerId) return;
    moveEvent.preventDefault();
    const delta = moveEvent.clientX - startX;

    if (which === 1) {
      const maxLeft = endPane
        ? Math.max(
            MIN_PANE_PX,
            trackWidth - 2 * DIVIDER_PX - endWidth - MIN_CENTER_PX
          )
        : Math.max(MIN_PANE_PX, trackWidth - DIVIDER_PX - MIN_CENTER_PX);
      const nextStart = Math.min(
        Math.max(MIN_PANE_PX, startWidth + delta),
        maxLeft
      );
      startPane.style.flexBasis = `${nextStart}px`;
      startPane.style.width = `${nextStart}px`;
      startPane.style.flexGrow = '0';
      startPane.style.flexShrink = '0';
      return;
    }

    if (which === 2 && endPane) {
      const maxRight = Math.max(
        MIN_PANE_PX,
        trackWidth - 2 * DIVIDER_PX - startWidth - MIN_CENTER_PX
      );
      const nextEnd = Math.min(
        Math.max(MIN_PANE_PX, endWidth - delta),
        maxRight
      );
      endPane.style.flexBasis = `${nextEnd}px`;
      endPane.style.width = `${nextEnd}px`;
      endPane.style.flexGrow = '0';
      endPane.style.flexShrink = '0';
    }
  };

  const onUp = (upEvent) => {
    if (upEvent.pointerId !== pointerId) return;
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerup', onUp);
    window.removeEventListener('pointercancel', onUp);
    dividerGrip?.removeAttribute('dragging');
    splitView.style.userSelect = '';
    splitView.style.cursor = '';

    try {
      dividerEl.releasePointerCapture(pointerId);
    } catch {
      /* no-op */
    }
  };

  window.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', onUp);
  window.addEventListener('pointercancel', onUp);
}

const issueListItem = ({
  status,
  icon,
  label,
  selected = false,
  description,
}) => html`
  <kyn-widget
    class=${selected ? 'issue-widget issue-widget--selected' : 'issue-widget'}
    ?removeHeader=${true}
    widgetStatus=${selected
      ? WIDGET_STATUS.DEFAULT
      : ISSUE_WIDGET_STATUS[status]}
  >
    <div class="issue-widget__content">
      <div class="issue-widget__header">
        <span class="issue-widget__leading-icon" aria-hidden="true">
          ${unsafeSVG(icon)}
        </span>
        <div class="issue-widget__copy">
          <h3 class="issue-widget__title">Issue title goes here</h3>
          <p class="issue-widget__desc">${description}</p>
        </div>
        <kyn-badge
          class="issue-widget__badge"
          label=${label}
          size="sm"
          type="heavy"
          status=${BADGE_STATUS[status]}
          iconTitle=${`${label} severity`}
          ?hideIcon=${true}
        ></kyn-badge>
      </div>
      <div class="issue-widget__meta">
        <span class="issue-widget__time">2 min ago</span>
      </div>
    </div>
  </kyn-widget>
`;

const issueDetailPane = () => html`
  <div class="issue-detail">
    <div class="issue-detail__title-row">
      <h2 class="issue-detail__title">Issue title</h2>
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
      <h3 class="issue-detail__section-title">Root cause analysis</h3>
      <p class="issue-detail__body">
        The service timed out when calling the upstream dependency under load.
      </p>
    </div>
    <div>
      <h3 class="issue-detail__section-title">Suggested fix</h3>
      <p class="issue-detail__body">
        Increase pool size and add exponential backoff on transient failures.
      </p>
    </div>
    <div class="issue-detail__footer">
      <kyn-button kind="primary" size="small">Apply fix</kyn-button>
      <kyn-button kind="secondary" size="small"
        >Run diagnostics again</kyn-button
      >
    </div>
  </div>
`;

export default {
  title: 'Patterns/Split View',
  tags: ['autodocs'],
  args: {
    panes: 2,
    startPaneWidthPx: 420,
    endPaneWidthPx: 320,
    startPaneBackground: 'var(--kd-color-background-page-default)',
    primaryPaneBackground: 'var(--kd-color-background-container-default)',
    endPaneBackground: 'var(--kd-color-code-view-background)',
    compactBreakpointPx: 900,
    compactHeightPx: 520,
  },
  argTypes: splitViewArgTypes,
  parameters: {
    docs: {
      description: {
        component: `Two- to three-pane split pattern built with existing components.

Use \`kyn-divider\` (\`vertical\` + \`drag-handle\`) as the interactive rail, apply your own default widths/backgrounds, and slot any pane content.`,
      },
    },
  },
};

export const TwoPane = {
  args: { panes: 2 },
  render: (args) => html`
    ${splitViewStyles}
    <div class="split-view-shell" style=${splitViewStyleVars(args)}>
      <div class="split-view-responsive">
        <div class="split-view-responsive__desktop">
          <div
            class="split-view ${args.panes === 2
              ? 'split-view--two'
              : 'split-view--three'}"
          >
            <section class="pane pane--start" data-pane="start">
              ${panePlaceholder('Start pane')}
            </section>
            <div
              class="split-view__divider"
              role="separator"
              aria-orientation="vertical"
              aria-label="Pane divider"
              @pointerdown=${(e) => onDividerPointerDown(1, e)}
            >
              <kyn-divider vertical drag-handle></kyn-divider>
            </div>
            <section class="pane pane--primary">
              ${panePlaceholder('Primary pane (flex)')}
            </section>
            ${args.panes === 3
              ? html`
                  <div
                    class="split-view__divider"
                    role="separator"
                    aria-orientation="vertical"
                    aria-label="Pane divider"
                    @pointerdown=${(e) => onDividerPointerDown(2, e)}
                  >
                    <kyn-divider vertical drag-handle></kyn-divider>
                  </div>
                  <section class="pane pane--end" data-pane="end">
                    ${panePlaceholder('End pane')}
                  </section>
                `
              : null}
          </div>
        </div>
        <div class="split-view-responsive__compact">
          ${compactTabs({
            panes: args.panes,
            pane1Content: panePlaceholder('Start pane'),
            pane2Content: panePlaceholder('Primary pane'),
            pane3Content: panePlaceholder('End pane'),
          })}
        </div>
      </div>
    </div>
  `,
};

export const ThreePane = {
  args: { panes: 3 },
  render: (args) => html`
    ${splitViewStyles}
    <div class="split-view-shell" style=${splitViewStyleVars(args)}>
      <div class="split-view-responsive">
        <div class="split-view-responsive__desktop">
          <div class="split-view split-view--three">
            <section class="pane pane--start" data-pane="start">
              ${panePlaceholder('Start pane')}
            </section>
            <div
              class="split-view__divider"
              role="separator"
              aria-orientation="vertical"
              aria-label="Pane divider"
              @pointerdown=${(e) => onDividerPointerDown(1, e)}
            >
              <kyn-divider vertical drag-handle></kyn-divider>
            </div>
            <section class="pane pane--primary">
              ${panePlaceholder('Primary pane (flex)')}
            </section>
            <div
              class="split-view__divider"
              role="separator"
              aria-orientation="vertical"
              aria-label="Pane divider"
              @pointerdown=${(e) => onDividerPointerDown(2, e)}
            >
              <kyn-divider vertical drag-handle></kyn-divider>
            </div>
            <section class="pane pane--end" data-pane="end">
              ${panePlaceholder('End pane')}
            </section>
          </div>
        </div>
        <div class="split-view-responsive__compact">
          ${compactTabs({
            panes: 3,
            pane1Content: panePlaceholder('Start pane'),
            pane2Content: panePlaceholder('Primary pane'),
            pane3Content: panePlaceholder('End pane'),
          })}
        </div>
      </div>
    </div>
  `,
};

export const MinimalTwoPane = {
  name: 'Two Pane Implemented',
  parameters: { controls: { disable: true } },
  render: (args) => html`
    ${splitViewStyles}
    <div class="split-view-shell" style=${splitViewStyleVars(args)}>
      <div class="split-view-responsive">
        <div class="split-view-responsive__desktop">
          <div class="split-view split-view--two">
            <section class="pane pane--start" data-pane="start">
              ${issueDetailPane()}
            </section>
            <div
              class="split-view__divider"
              role="separator"
              aria-orientation="vertical"
              aria-label="Pane divider"
              @pointerdown=${(e) => onDividerPointerDown(1, e)}
            >
              <kyn-divider vertical drag-handle></kyn-divider>
            </div>
            <section class="pane pane--primary code-pane">
              <kyn-block-code-view
                flush
                darkTheme="dark"
                language="javascript"
                copyOptionVisible
                ?codeViewExpandable=${false}
                codeSnippet=${MINIMAL_TWO_PANE_JS}
              ></kyn-block-code-view>
            </section>
          </div>
        </div>
        <div class="split-view-responsive__compact">
          ${compactTabs({
            panes: 2,
            pane1Label: 'Issue detail',
            pane2Label: 'Code rail',
            pane1Content: issueDetailPane(),
            pane2Content: html`
              <div class="code-pane">
                <kyn-block-code-view
                  flush
                  darkTheme="dark"
                  language="javascript"
                  copyOptionVisible
                  ?codeViewExpandable=${false}
                  codeSnippet=${MINIMAL_TWO_PANE_JS}
                ></kyn-block-code-view>
              </div>
            `,
          })}
        </div>
      </div>
    </div>
  `,
};

export const ThreePaneIssueDetail = {
  name: 'Three Pane Implemented',
  parameters: { controls: { disable: true } },
  render: (args) => html`
    ${splitViewStyles}
    <div class="split-view-shell" style=${splitViewStyleVars(args)}>
      <div class="split-view-responsive">
        <div class="split-view-responsive__desktop">
          <div class="split-view split-view--three">
            <section class="pane pane--start" data-pane="start">
              <div class="issue-list">
                <div class="issue-list__scroll">
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
            </section>
            <div
              class="split-view__divider"
              role="separator"
              aria-orientation="vertical"
              aria-label="Pane divider"
              @pointerdown=${(e) => onDividerPointerDown(1, e)}
            >
              <kyn-divider vertical drag-handle></kyn-divider>
            </div>
            <section class="pane pane--primary">${issueDetailPane()}</section>
            <div
              class="split-view__divider"
              role="separator"
              aria-orientation="vertical"
              aria-label="Pane divider"
              @pointerdown=${(e) => onDividerPointerDown(2, e)}
            >
              <kyn-divider vertical drag-handle></kyn-divider>
            </div>
            <section class="pane pane--end code-pane" data-pane="end">
              <kyn-block-code-view
                flush
                darkTheme="dark"
                language="javascript"
                copyOptionVisible
                ?codeViewExpandable=${false}
                codeSnippet=${CODE_DEMO_ALL}
              ></kyn-block-code-view>
            </section>
          </div>
        </div>
        <div class="split-view-responsive__compact">
          ${compactTabs({
            panes: 3,
            pane1Label: 'Issue list',
            pane2Label: 'Issue detail',
            pane3Label: 'Code rail',
            pane1Content: html`
              <div class="issue-list">
                <div class="issue-list__scroll">
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
            `,
            pane2Content: issueDetailPane(),
            pane3Content: html`
              <div class="code-pane">
                <kyn-block-code-view
                  flush
                  darkTheme="dark"
                  language="javascript"
                  copyOptionVisible
                  ?codeViewExpandable=${false}
                  codeSnippet=${CODE_DEMO_ALL}
                ></kyn-block-code-view>
              </div>
            `,
          })}
        </div>
      </div>
    </div>
  `,
};

export const CompactThreePane = {
  parameters: { controls: { disable: true } },
  render: (args) => html`
    ${splitViewStyles}
    <div
      class="split-view-shell"
      style=${`${splitViewStyleVars(args)};max-width:420px;`}
    >
      ${compactTabs({
        panes: 3,
        pane1Label: 'Issue list',
        pane2Label: 'Issue detail',
        pane3Label: 'Code rail',
        pane1Content: panePlaceholder('Issue list'),
        pane2Content: panePlaceholder('Issue detail'),
        pane3Content: html`
          <div class="code-pane">
            <kyn-block-code-view
              flush
              darkTheme="dark"
              language="javascript"
              copyOptionVisible
              ?codeViewExpandable=${false}
              codeSnippet=${CODE_DEMO_ALL}
            ></kyn-block-code-view>
          </div>
        `,
      })}
    </div>
  `,
};
