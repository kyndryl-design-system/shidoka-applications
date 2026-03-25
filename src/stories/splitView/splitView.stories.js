import { html, unsafeCSS } from 'lit';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { action } from 'storybook/actions';

import { registerSplitViewPattern } from './splitViewPattern';
import { registerSplitViewCodeRail } from './splitViewCodeRail';

import '../../components/reusable/button/button';
import '../../components/reusable/card/card';
import '../../components/reusable/badge/badge';
import '../../components/reusable/divider/divider';
import '../../components/reusable/blockCodeView/blockCodeView';
import { WIDGET_STATUS } from '../../components/reusable/widget/defs';

import statusIconCritical from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/document-no-access.svg';
import statusIconHigh from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/cloud-services.svg';
import statusIconMedium from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/access-management.svg';
import statusIconLow from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/settings.svg';

import {
  SPLIT_VIEW_PATTERN_SHADOW_CSS,
  SPLIT_VIEW_CODE_RAIL_SHADOW_CSS,
  SPLIT_VIEW_BLOCK_CODE_FLUSH_CSS,
  SPLIT_VIEW_STORY_LIGHT_DOM_CSS,
} from 'virtual:split-view-css';

/** Styles: single `splitView.scss` (section markers); Vite plugin in `.storybook/main.js` compiles chunks. */
registerSplitViewPattern(SPLIT_VIEW_PATTERN_SHADOW_CSS);
registerSplitViewCodeRail(
  SPLIT_VIEW_CODE_RAIL_SHADOW_CSS,
  SPLIT_VIEW_BLOCK_CODE_FLUSH_CSS
);

const splitViewArgTypes = {
  panes: {
    control: { type: 'select' },
    options: [2, 3],
    description:
      'Column count. The component default is `3` when omitted; stories set this explicitly.',
  },
};

/** Minimal two-pane story: multi-line sample so `blockFlush` + flex layout read as a full-height pane. */
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

const splitViewStyles = html`<style>
  ${unsafeCSS(SPLIT_VIEW_STORY_LIGHT_DOM_CSS)}
</style>`;

/* Do not re-export SPLIT_VIEW_* from this file — Storybook treats named exports as stories. */

export default {
  title: 'Patterns/Split View',
  /* Web component tag for docs / a11y; pattern is registered on module load. */
  component: 'split-view-pattern',
  argTypes: splitViewArgTypes,
  parameters: {
    docs: {
      description: {
        component: `
The Split View pattern arranges two or three columns with draggable vertical dividers. The center column grows and shrinks as you drag; outer columns use minimum widths.

Use **\`kyn-divider\`** with **\`vertical\`** and **\`drag-handle\`** for the affordance (aligned with the resizable side drawer). Interactive sizing for Storybook is demonstrated with **\`<split-view-pattern>\`**, a Storybook-only helper in this folder—it is **not** a published \`kyn-*\` component.

**Docs:** Open **Patterns / Split View / Docs** for copy-paste imports (this repo + vendored), file checklist, and API. **Minimal (two panes)** uses the same **issue detail** markup as **Three Pane Issue Detail**’s center pane in **\`slot="pane-1"\`**, with **\`split-view-code-rail\`** + **\`kyn-block-code-view\`** in **\`slot="pane-2"\`**. **Three Pane Issue Detail** adds a third pane (code rail) + issue list. **Canvas → Code** matches what you run in Storybook; pair with **Docs** when vendoring outside Storybook.
        `,
      },
    },
  },
};

const panePlaceholder = (label) => html`
  <div class="pane--placeholder">${label}</div>
`;

/** Issue detail body (shared by Minimal two pane — left — and Three pane issue detail — center). */
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
        @on-resize=${(e) => action('on-resize')(e.detail)}
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

export const ThreePane = {
  args: { panes: 3 },
  render: ({ panes }) => html`
    ${splitViewStyles}
    <div class="split-view-shell">
      <split-view-pattern
        .panes=${panes}
        .defaultStartPaneFraction=${STORY_NARROW_START_FRACTION(panes)}
        @on-resize=${(e) => action('on-resize')(e.detail)}
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

/** Shortest copy-paste: shell + `.panes=${2}` + `split-view-code-rail` (flush CSS) + `kyn-block-code-view` in primary pane. */
export const MinimalTwoPane = {
  name: 'Minimal (two panes)',
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
        ?invertStartDividerGrip=${true}
        @on-resize=${(e) => action('on-resize')(e.detail)}
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
  parameters: {
    controls: { disable: true },
  },
  render: () => html`
    ${splitViewStyles}
    <div class="split-view-shell">
      <split-view-pattern
        .panes=${3}
        ?invertEndDividerGrip=${true}
        @on-resize=${(e) => action('on-resize')(e.detail)}
      >
        <div slot="pane-1">
          <div class="issue-list">
            <div class="issue-list__scroll">
              <div
                class="status-widget status-${WIDGET_STATUS.CRITICAL} status-widget--selected"
              >
                <kyn-card
                  type="normal"
                  role="article"
                  aria-label="Issue"
                  ?hideBorder=${true}
                >
                  <div class="status-widget__layout">
                    <div class="status-widget__icon" aria-hidden="true">
                      ${unsafeSVG(statusIconCritical)}
                    </div>
                    <div class="status-widget__main">
                      <h3 class="status-widget__title">
                        Issue title goes here
                      </h3>
                      <p class="status-widget__desc">
                        Short description of the issue here
                      </p>
                      <div class="status-widget__meta">
                        <span class="status-widget__time">2 min ago</span>
                        <kyn-badge
                          label="Critical"
                          size="sm"
                          type="heavy"
                          status=${BADGE_STATUS[WIDGET_STATUS.CRITICAL]}
                          iconTitle="Critical severity"
                        ></kyn-badge>
                      </div>
                    </div>
                  </div>
                </kyn-card>
              </div>
              <div class="status-widget status-${WIDGET_STATUS.HIGH}">
                <kyn-card
                  type="normal"
                  role="article"
                  aria-label="Issue"
                  ?hideBorder=${true}
                >
                  <div class="status-widget__layout">
                    <div class="status-widget__icon" aria-hidden="true">
                      ${unsafeSVG(statusIconHigh)}
                    </div>
                    <div class="status-widget__main">
                      <h3 class="status-widget__title">
                        Issue title goes here
                      </h3>
                      <p class="status-widget__desc">
                        Short description of the issue here
                      </p>
                      <div class="status-widget__meta">
                        <span class="status-widget__time">2 min ago</span>
                        <kyn-badge
                          label="High"
                          size="sm"
                          type="heavy"
                          status=${BADGE_STATUS[WIDGET_STATUS.HIGH]}
                          iconTitle="High severity"
                        ></kyn-badge>
                      </div>
                    </div>
                  </div>
                </kyn-card>
              </div>
              <div class="status-widget status-${WIDGET_STATUS.MEDIUM}">
                <kyn-card
                  type="normal"
                  role="article"
                  aria-label="Issue"
                  ?hideBorder=${true}
                >
                  <div class="status-widget__layout">
                    <div class="status-widget__icon" aria-hidden="true">
                      ${unsafeSVG(statusIconMedium)}
                    </div>
                    <div class="status-widget__main">
                      <h3 class="status-widget__title">
                        Issue title goes here
                      </h3>
                      <p class="status-widget__desc">
                        Short description of the issue here
                      </p>
                      <div class="status-widget__meta">
                        <span class="status-widget__time">2 min ago</span>
                        <kyn-badge
                          label="Medium"
                          size="sm"
                          type="heavy"
                          status=${BADGE_STATUS[WIDGET_STATUS.MEDIUM]}
                          iconTitle="Medium severity"
                        ></kyn-badge>
                      </div>
                    </div>
                  </div>
                </kyn-card>
              </div>
              <div class="status-widget status-${WIDGET_STATUS.LOW}">
                <kyn-card
                  type="normal"
                  role="article"
                  aria-label="Issue"
                  ?hideBorder=${true}
                >
                  <div class="status-widget__layout">
                    <div class="status-widget__icon" aria-hidden="true">
                      ${unsafeSVG(statusIconLow)}
                    </div>
                    <div class="status-widget__main">
                      <h3 class="status-widget__title">
                        Issue title goes here
                      </h3>
                      <p class="status-widget__desc">
                        Short description of the issue here
                      </p>
                      <div class="status-widget__meta">
                        <span class="status-widget__time">2 min ago</span>
                        <kyn-badge
                          label="Low"
                          size="sm"
                          type="heavy"
                          status=${BADGE_STATUS[WIDGET_STATUS.LOW]}
                          iconTitle="Low severity"
                        ></kyn-badge>
                      </div>
                    </div>
                  </div>
                </kyn-card>
              </div>
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
