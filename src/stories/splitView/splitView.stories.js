import { html } from 'lit';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { action } from 'storybook/actions';

import { splitViewStoryStyles as splitViewStyles } from './registerSplitView';

import '../../components/reusable/button/button';
import '../../components/reusable/badge/badge';
import '../../components/reusable/divider/divider';
import '../../components/reusable/blockCodeView/blockCodeView';
import '../../components/reusable/widget/widget';
import { WIDGET_STATUS } from '../../components/reusable/widget/defs';

import statusIconCritical from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/document-no-access.svg';
import statusIconHigh from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/cloud-services.svg';
import statusIconMedium from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/access-management.svg';
import statusIconLow from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/settings.svg';

const splitViewArgTypes = {
  panes: {
    control: { type: 'select' },
    options: [2, 3],
    description:
      'Column count. The component default is `2` when omitted; stories set this explicitly.',
  },
};

/** Two Pane Implemented: multi-line sample so the code rail flexes full height. */
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

/** kyn-badge `status` does not mirror every WIDGET_STATUS value (e.g. High → error). */
const BADGE_STATUS = {
  [WIDGET_STATUS.CRITICAL]: 'critical',
  [WIDGET_STATUS.HIGH]: 'error',
  [WIDGET_STATUS.MEDIUM]: 'warning',
  [WIDGET_STATUS.LOW]: 'success',
};

/** Widget accent colors use the merged widgetStatus palette to match the original Figma treatment. */
const ISSUE_WIDGET_STATUS = {
  [WIDGET_STATUS.CRITICAL]: WIDGET_STATUS.INFORMATION,
  [WIDGET_STATUS.HIGH]: WIDGET_STATUS.ERROR,
  [WIDGET_STATUS.MEDIUM]: WIDGET_STATUS.WARNING,
  [WIDGET_STATUS.LOW]: WIDGET_STATUS.SUCCESS,
};

/** End-pane demo: raw snippets (no markdown fences), three JS sections. */
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

/* Do not re-export SPLIT_VIEW_* from this file — Storybook treats named exports as stories. */

export default {
  title: 'Patterns/Split View',
  tags: ['autodocs'],
  component: 'split-view-pattern',
  argTypes: splitViewArgTypes,
  parameters: {
    docs: {
      description: {
        component: `
The Split View pattern arranges two or three columns with draggable vertical dividers. The center column grows and shrinks as you drag; outer columns use minimum widths.

Use **\`slot="pane-1"\`**, **\`slot="pane-2"\`**, and optionally **\`slot="pane-3"\`** to place your content. **Two Pane Implemented** and **Three Pane Implemented** are complete product-style examples using the same component API.
        `,
      },
    },
  },
};

const panePlaceholder = (label) => html`
  <div class="pane--placeholder">${label}</div>
`;

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

/** Issue detail body (shared by Two Pane Implemented — left — and Three Pane Implemented — center). */
const issueDetailPane = () => html`
  <div class="issue-detail">
    <div class="issue-detail__block">
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
    </div>
    <kyn-divider class="issue-detail__divider"></kyn-divider>
    <div class="issue-detail__block">
      <h3 class="issue-detail__section-title">Root cause analysis</h3>
      <p class="issue-detail__body">
        The service timed out when calling the upstream dependency under load.
      </p>
    </div>
    <kyn-divider class="issue-detail__divider"></kyn-divider>
    <div class="issue-detail__block">
      <h3 class="issue-detail__section-title">Key findings</h3>
      <ul class="issue-detail__list">
        <li>Retry budget was exhausted after 500 errors.</li>
        <li>Connection pool size is below peak traffic needs.</li>
      </ul>
    </div>
    <kyn-divider class="issue-detail__divider"></kyn-divider>
    <div class="issue-detail__block">
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

/** Narrower start column than pattern defaults — more room for placeholder primary/end panes. */
const STORY_NARROW_START_FRACTION = (paneCount) =>
  paneCount === 2 ? 0.28 : 0.26;

export const TwoPane = {
  args: { panes: 2 },
  render: ({ panes }) => html`
    ${splitViewStyles}
    <div class="split-view-shell">
      <split-view-pattern
        .panes=${panes}
        .defaultStartPaneFraction=${STORY_NARROW_START_FRACTION(panes)}
        pane-1-label="Start pane"
        pane-2-label="Primary pane"
        pane-3-label="End pane"
        @split-view-resize=${(e) => action('split-view-resize')(e.detail)}
      >
        <div slot="pane-1">${panePlaceholder('Start pane')}</div>
        <div slot="pane-2">${panePlaceholder('Primary pane (flex)')}</div>
        ${panes === 3
          ? html`<div slot="pane-3" class="pane-3">
              ${panePlaceholder('End pane')}
            </div>`
          : null}
      </split-view-pattern>
    </div>
  `,
};

TwoPane.parameters = {
  docs: {
    description: {
      story: 'Basic two-pane usage with slot content and draggable divider.',
    },
  },
};

export const ThreePane = {
  args: { panes: 3 },
  render: ({ panes }) => html`
    ${splitViewStyles}
    <div class="split-view-shell">
      <split-view-pattern
        .panes=${panes}
        .defaultStartPaneFraction=${STORY_NARROW_START_FRACTION(panes)}
        pane-1-label="Start pane"
        pane-2-label="Primary pane"
        pane-3-label="End pane"
        @split-view-resize=${(e) => action('split-view-resize')(e.detail)}
      >
        <div slot="pane-1">${panePlaceholder('Start pane')}</div>
        <div slot="pane-2">${panePlaceholder('Primary pane (flex)')}</div>
        ${panes === 3
          ? html`<div slot="pane-3" class="pane-3">
              ${panePlaceholder('End pane')}
            </div>`
          : null}
      </split-view-pattern>
    </div>
  `,
};

ThreePane.parameters = {
  docs: {
    description: {
      story: 'Basic three-pane usage with two draggable dividers.',
    },
  },
};

/** Shortest copy-paste: shell + `.panes=${2}` + `split-view-code-rail` (flush CSS) + `kyn-block-code-view` in primary pane. */
export const MinimalTwoPane = {
  name: 'Two Pane Implemented',
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Template for vendoring: **issue detail** in `slot="pane-1"` + code in `slot="pane-2"`. Uses **`default-start-pane-fraction="0.39"`** (~40% start / ~60% primary, matching the two-pane layout spec).',
      },
    },
  },
  render: () => html`
    ${splitViewStyles}
    <div class="split-view-shell">
      <split-view-pattern
        .panes=${2}
        .defaultStartPaneFraction=${0.39}
        .invertStartDividerGrip=${true}
        pane-1-label="Issue detail"
        pane-2-label="Code rail"
        @split-view-resize=${(e) => action('split-view-resize')(e.detail)}
      >
        <div slot="pane-1">${issueDetailPane()}</div>
        <div slot="pane-2" class="minimal-two-pane__primary">
          <split-view-code-rail>
            <kyn-block-code-view
              darkTheme="dark"
              language="javascript"
              copyOptionVisible
              ?codeViewExpandable=${false}
              codeSnippet=${MINIMAL_TWO_PANE_JS}
              @on-copy=${(e) => action('on-copy')(e.detail)}
            ></kyn-block-code-view>
          </split-view-code-rail>
        </div>
      </split-view-pattern>
    </div>
  `,
};

export const ThreePaneIssueDetail = {
  name: 'Three Pane Implemented',
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Full three-pane reference: issue list in `slot="pane-1"`, detail in `slot="pane-2"`, and a code rail in `slot="pane-3"`.',
      },
    },
  },
  render: () => html`
    ${splitViewStyles}
    <div class="split-view-shell">
      <split-view-pattern
        .panes=${3}
        .invertEndDividerGrip=${true}
        pane-1-label="Issue list"
        pane-2-label="Issue detail"
        pane-3-label="Code rail"
        @split-view-resize=${(e) => action('split-view-resize')(e.detail)}
      >
        <div slot="pane-1">
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
            <div class="issue-list__footer">
              <kyn-button kind="primary" size="small">Fix All</kyn-button>
            </div>
          </div>
        </div>
        <div slot="pane-2">${issueDetailPane()}</div>
        <div slot="pane-3" class="pane-3">
          <split-view-code-rail>
            <kyn-block-code-view
              darkTheme="dark"
              language="javascript"
              copyOptionVisible
              ?codeViewExpandable=${false}
              codeSnippet=${CODE_DEMO_ALL}
              @on-copy=${(e) => action('on-copy')(e.detail)}
            ></kyn-block-code-view>
          </split-view-code-rail>
        </div>
      </split-view-pattern>
    </div>
  `,
};

export const CompactThreePane = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Narrow-width reference for the production pattern: the layout switches from draggable columns to a single active pane with keyboard-accessible tabs.',
      },
    },
  },
  render: () => html`
    ${splitViewStyles}
    <div class="split-view-shell" style="max-width: 420px;">
      <split-view-pattern
        .panes=${3}
        .compactBreakpointPx=${999}
        pane-1-label="Issue list"
        pane-2-label="Issue detail"
        pane-3-label="Code rail"
      >
        <div slot="pane-1">
          <div class="issue-list">
            <div class="issue-list__scroll">
              <kyn-widget
                class="issue-widget"
                ?removeHeader=${true}
                widgetStatus=${ISSUE_WIDGET_STATUS[WIDGET_STATUS.CRITICAL]}
              >
                <div class="issue-widget__content">
                  <div class="issue-widget__header">
                    <span class="issue-widget__leading-icon" aria-hidden="true">
                      ${unsafeSVG(statusIconCritical)}
                    </span>
                    <div class="issue-widget__copy">
                      <h3 class="issue-widget__title">Selected issue</h3>
                      <p class="issue-widget__desc">
                        Compact mode uses tabs to switch panes.
                      </p>
                    </div>
                    <kyn-badge
                      class="issue-widget__badge"
                      label="Critical"
                      size="sm"
                      type="heavy"
                      status=${BADGE_STATUS[WIDGET_STATUS.CRITICAL]}
                      iconTitle="Critical severity"
                      ?hideIcon=${true}
                    ></kyn-badge>
                  </div>
                  <div class="issue-widget__meta">
                    <span class="issue-widget__time">2 min ago</span>
                  </div>
                </div>
              </kyn-widget>
            </div>
          </div>
        </div>
        <div slot="pane-2">${issueDetailPane()}</div>
        <div slot="pane-3" class="pane-3">
          <split-view-code-rail>
            <kyn-block-code-view
              darkTheme="dark"
              language="javascript"
              copyOptionVisible
              ?codeViewExpandable=${false}
              codeSnippet=${CODE_DEMO_ALL}
            ></kyn-block-code-view>
          </split-view-code-rail>
        </div>
      </split-view-pattern>
    </div>
  `,
};
