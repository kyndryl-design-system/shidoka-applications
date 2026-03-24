import { html } from 'lit';
import { action } from 'storybook/actions';

import './splitViewPattern';

import '../../components/reusable/button/button';
import '../../components/reusable/card/card';
import '../../components/reusable/tag/tag';
import '../../components/reusable/blockCodeView/blockCodeView';

const DEMO_CODE = `const patch = {
  file: 'src/api/client.ts',
  change: 'Add retry with backoff',
};

npm run verify && git add -A && git commit -m "fix: client retry"`;

/** Story-only: kyn-card defaults to 264px wide; full-width rail cards need an explicit override. */
const splitViewShellStyles = html`
  <style>
    .split-view-shell {
      box-sizing: border-box;
      width: 100%;
      max-width: 1280px;
      margin: 0 auto;
      padding: var(--kd-spacing-24);
      min-height: 480px;
      background: var(--kd-color-background-page-default);
    }
    .split-view-shell kyn-card {
      display: block;
      width: 100%;
      max-width: 100%;
      box-sizing: border-box;
    }
  </style>
`;

const issueDetailStyles = html`
  <style>
    .issue-list {
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 0;
      box-sizing: border-box;
      padding: var(--kd-spacing-16);
      gap: 0;
    }
    .issue-list__scroll {
      flex: 1 1 auto;
      min-height: 0;
      overflow-y: auto;
      overflow-x: hidden;
      display: flex;
      flex-direction: column;
      gap: var(--kd-spacing-12);
      padding-right: var(--kd-spacing-4);
    }
    .issue-list__footer {
      flex: 0 0 auto;
      padding-top: var(--kd-spacing-16);
      margin-top: var(--kd-spacing-8);
      border-top: 1px solid var(--kd-color-border-level-secondary);
    }
    .issue-card__head {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: var(--kd-spacing-8);
      margin-bottom: var(--kd-spacing-8);
    }
    .issue-card__title {
      font: var(--kd-font-heading-06);
      color: var(--kd-color-text-level-primary);
      margin: 0;
      flex: 1 1 auto;
      min-width: 0;
    }
    .issue-card__meta {
      font: var(--kd-font-caption-01);
      color: var(--kd-color-text-level-secondary);
      margin: 0;
    }
    .issue-card__meta + .issue-card__meta {
      margin-top: var(--kd-spacing-4);
    }
    .issue-detail {
      display: flex;
      flex-direction: column;
      padding: var(--kd-spacing-24) var(--kd-spacing-32);
      height: 100%;
      min-height: 0;
      box-sizing: border-box;
      overflow: auto;
    }
    .issue-detail__title-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--kd-spacing-12);
      margin-bottom: var(--kd-spacing-8);
    }
    .issue-detail__title {
      font: var(--kd-font-heading-04);
      margin: 0;
      color: var(--kd-color-text-level-primary);
    }
    .issue-detail__section-title {
      font: var(--kd-font-heading-06);
      margin: var(--kd-spacing-24) 0 var(--kd-spacing-8);
      color: var(--kd-color-text-level-primary);
    }
    .issue-detail__section-title:first-of-type {
      margin-top: var(--kd-spacing-20);
    }
    .issue-detail__body {
      font: var(--kd-font-body-01);
      color: var(--kd-color-text-level-primary);
      margin: 0;
      max-width: 72ch;
    }
    .issue-detail__list {
      margin: var(--kd-spacing-8) 0 0;
      padding-left: var(--kd-spacing-24);
      font: var(--kd-font-body-01);
      color: var(--kd-color-text-level-primary);
      max-width: 72ch;
    }
    .issue-detail__actions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--kd-spacing-8);
      margin-top: var(--kd-spacing-16);
    }
    .issue-detail__footer {
      display: flex;
      flex-wrap: wrap;
      gap: var(--kd-spacing-8);
      margin-top: auto;
      padding-top: var(--kd-spacing-24);
      border-top: 1px solid var(--kd-color-border-level-secondary);
    }
    .code-pane {
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 0;
      box-sizing: border-box;
      padding: var(--kd-spacing-16);
      overflow: hidden;
    }
    .code-pane kyn-block-code-view {
      flex: 1 1 auto;
      min-height: 0;
      display: block;
    }
  </style>
`;

export default {
  title: 'Patterns/Split View',
  parameters: {
    docs: {
      description: {
        component: `
The Split View pattern arranges two or three columns with draggable vertical dividers. The center column grows and shrinks as you drag; outer columns use minimum widths.

Use **\`kyn-divider\`** with **\`vertical\`** and **\`drag-handle\`** for the affordance (aligned with the resizable side drawer). Interactive sizing for Storybook is demonstrated with **\`<split-view-pattern>\`**, a Storybook-only helper in this folder—it is **not** a published \`kyn-*\` component.
        `,
      },
    },
  },
};

const panePlaceholder = (label) => html`
  <div class="pane--placeholder">${label}</div>
`;

export const TwoPane = {
  render: () => html`
    ${splitViewShellStyles}
    <style>
      .pane--placeholder {
        padding: var(--kd-spacing-16);
        color: var(--kd-color-text-level-secondary);
        font: var(--kd-font-body-01);
      }
    </style>
    <div class="split-view-shell">
      <split-view-pattern
        .panes=${2}
        @on-resize=${(e) => action('on-resize')(e.detail)}
      >
        <div slot="pane-1">${panePlaceholder('Start pane')}</div>
        <div slot="pane-2">${panePlaceholder('Primary pane (flex)')}</div>
      </split-view-pattern>
    </div>
  `,
};

export const ThreePane = {
  render: () => html`
    ${splitViewShellStyles}
    <style>
      .pane--placeholder {
        padding: var(--kd-spacing-16);
        color: var(--kd-color-text-level-secondary);
        font: var(--kd-font-body-01);
      }
    </style>
    <div class="split-view-shell">
      <split-view-pattern
        .panes=${3}
        @on-resize=${(e) => action('on-resize')(e.detail)}
      >
        <div slot="pane-1">${panePlaceholder('Start pane')}</div>
        <div slot="pane-2">${panePlaceholder('Primary pane (flex)')}</div>
        <div slot="pane-3">${panePlaceholder('End pane')}</div>
      </split-view-pattern>
    </div>
  `,
};

export const ThreePaneIssueDetail = {
  render: () => html`
    ${splitViewShellStyles} ${issueDetailStyles}
    <div class="split-view-shell">
      <split-view-pattern
        .panes=${3}
        @on-resize=${(e) => action('on-resize')(e.detail)}
      >
        <div slot="pane-1">
          <div class="issue-list">
            <div class="issue-list__scroll">
              <kyn-card
                type="normal"
                role="article"
                aria-label="Issue"
                ?highlight=${true}
              >
                <div class="issue-card__head">
                  <h3 class="issue-card__title">Issue title goes here</h3>
                  <kyn-tag
                    label="Critical"
                    tagSize="sm"
                    tagColor="red"
                  ></kyn-tag>
                </div>
                <p class="issue-card__meta">Short description of the issue.</p>
                <p class="issue-card__meta">2 min ago</p>
              </kyn-card>
              <kyn-card type="normal" role="article" aria-label="Issue">
                <div class="issue-card__head">
                  <h3 class="issue-card__title">Issue title goes here</h3>
                  <kyn-tag
                    label="High"
                    tagSize="sm"
                    tagColor="spruce"
                  ></kyn-tag>
                </div>
                <p class="issue-card__meta">Short description of the issue.</p>
                <p class="issue-card__meta">2 min ago</p>
              </kyn-card>
              <kyn-card type="normal" role="article" aria-label="Issue">
                <div class="issue-card__head">
                  <h3 class="issue-card__title">Issue title goes here</h3>
                  <kyn-tag label="Medium" tagSize="sm" tagColor="sea"></kyn-tag>
                </div>
                <p class="issue-card__meta">Short description of the issue.</p>
                <p class="issue-card__meta">2 min ago</p>
              </kyn-card>
              <kyn-card type="normal" role="article" aria-label="Issue">
                <div class="issue-card__head">
                  <h3 class="issue-card__title">Issue title goes here</h3>
                  <kyn-tag
                    label="Low"
                    tagSize="sm"
                    tagColor="default"
                  ></kyn-tag>
                </div>
                <p class="issue-card__meta">Short description of the issue.</p>
                <p class="issue-card__meta">2 min ago</p>
              </kyn-card>
            </div>
            <div class="issue-list__footer">
              <kyn-button kind="primary" size="small">Fix all</kyn-button>
            </div>
          </div>
        </div>
        <div slot="pane-2">
          <div class="issue-detail">
            <div class="issue-detail__title-row">
              <h2 class="issue-detail__title">Issue title</h2>
              <kyn-tag label="Critical" tagSize="md" tagColor="red"></kyn-tag>
            </div>
            <div class="issue-detail__actions">
              <kyn-button kind="primary" size="small">Fix issue</kyn-button>
              <kyn-button kind="secondary" size="small"
                >Secondary option</kyn-button
              >
            </div>
            <h3 class="issue-detail__section-title">Root cause analysis</h3>
            <p class="issue-detail__body">
              The service timed out when calling the upstream dependency under
              load.
            </p>
            <h3 class="issue-detail__section-title">Key findings</h3>
            <ul class="issue-detail__list">
              <li>Retry budget was exhausted after 500 errors.</li>
              <li>Connection pool size is below peak traffic needs.</li>
            </ul>
            <h3 class="issue-detail__section-title">Suggested fix</h3>
            <p class="issue-detail__body">
              Increase pool size and add exponential backoff on transient
              failures.
            </p>
            <div class="issue-detail__footer">
              <kyn-button kind="primary">Apply fix</kyn-button>
              <kyn-button kind="secondary">Run diagnostics again</kyn-button>
            </div>
          </div>
        </div>
        <div slot="pane-3">
          <div class="code-pane">
            <kyn-block-code-view
              darkTheme="dark"
              language="javascript"
              codeViewLabel="Suggested patch"
              copyOptionVisible
              ?codeViewExpandable=${false}
              .maxHeight=${null}
              codeSnippet=${DEMO_CODE}
              @on-copy=${(e) => action('on-copy')(e.detail)}
            ></kyn-block-code-view>
          </div>
        </div>
      </split-view-pattern>
    </div>
  `,
};
