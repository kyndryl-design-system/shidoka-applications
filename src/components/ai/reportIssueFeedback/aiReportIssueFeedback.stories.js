import { html } from 'lit';
import { action } from 'storybook/actions';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import copyIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/copy.svg';
import sourceIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/earth.svg';
import pdfIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/document-pdf.svg';
import './index';
import '../../reusable/checkbox';
import '../../reusable/card/card.sample';
import '../../reusable/textArea/textArea';
import '../../reusable/link/link';
import '../../reusable/radioButton/radioButton';
import '../../reusable/radioButton/radioButtonGroup';

export default {
  title: 'AI / Components / AI Report Issue Feedback',
  component: 'kyn-ai-report-issue-feedback',
  parameters: {
    design: {
      type: 'zeplin',
      url: 'https://app.zeplin.io/project/6953567c0f431be6511df357/screen/6953ca48691fd78b0fc84910',
    },
  },
};

const sourcesData = [
  {
    description: 'String Value',
    icon: unsafeSVG(pdfIcon),
  },
  {
    description: 'String Value',
    icon: unsafeSVG(sourceIcon),
  },
  {
    description: 'String Value',
    icon: unsafeSVG(pdfIcon),
  },
  {
    description: 'String Value',
    icon: unsafeSVG(sourceIcon),
  },
  {
    description: 'String Value',
    icon: unsafeSVG(sourceIcon),
  },
  {
    description: 'String Value',
    icon: unsafeSVG(sourceIcon),
  },
];

const reportIssueOptions = [
  { value: '1', label: 'Incorrect' },
  { value: '2', label: 'Irrelevant' },
  { value: '3', label: 'Too vague' },
];

const args = {
  copy: '',
  sourcesOpened: false,
  sourcesDisabled: false,
  feedbackDisabled: false,
  revealAllSources: false,
  reportIssueOpened: false,
  reportIssueDisabled: false,
  closeText: 'Close',
  textStrings: {
    sourcesText: 'Sources used',
    foundSources: 'Found sources',
    showMore: 'Show more',
    showLess: 'Show less',
    positiveFeedback: 'Share what you liked',
    negativeFeedback: 'Help us improve',
  },
  reportIssueText: 'Report Issue',
};

export const AIReportIssueFeedback = {
  args,
  render: (args) => {
    return html`
      <kyn-ai-report-issue-feedback
        .sourcesOpened=${args.sourcesOpened}
        .reportIssueOpened=${args.reportIssueOpened}
        .reportIssueDisabled=${args.reportIssueDisabled}
        .sourcesDisabled=${args.sourcesDisabled}
        .feedbackDisabled=${args.feedbackDisabled}
        ?revealAllSources=${args.revealAllSources}
        closeText=${args.closeText}
        .textStrings=${args.textStrings}
        @on-toggle=${(e) => action(e.type)({ ...e, detail: e.detail })}
        @on-feedback-selected=${(e) =>
          action(e.type)({ ...e, detail: e.detail })}
        @on-feedback-deselected=${(e) =>
          action(e.type)({ ...e, detail: e.detail })}
        @sources-used-toggle=${(e) =>
          action(e.type)({ ...e, detail: e.detail })}
      >
        <kyn-button
          slot="copy"
          kind="ghost-ai"
          size="small"
          iconPosition="left"
          description="Copy"
          @on-click=${(e) => action(e.type)({ ...e, detail: e.detail })}
        >
          <span class="copy-button-text">${args.copy}</span>
          <span slot="icon" class="copy-icon">${unsafeSVG(copyIcon)}</span>
        </kyn-button>

        <div slot="report-issue-form" class="report-issue-form">
          ${reportIssueFormContent()}
        </div>
      </kyn-ai-report-issue-feedback>
      <style>
        .copy-button-text {
          display: none;

          @media (min-width: 42rem) {
            display: inline;
          }
        }
      </style>
    `;
  },
};

const reportIssueFormContent = () => html`
  <div class="feedback-header">
    <span>
      Help us improve your experience. Tell us what didn’t work as expected.
    </span>
  </div>

  <form
    class="example-form"
    @submit=${(e) => {
      e.preventDefault();
      action('submit')(e);
    }}
  >
    <kyn-radio-button-group ?horizontal=${true}>
      ${reportIssueOptions.map(
        (option) =>
          html`<kyn-radio-button value="${option.value}"
            >${option.label}</kyn-radio-button
          >`
      )}
    </kyn-radio-button-group>

    <kyn-text-area
      aiConnected
      class="input-text-area"
      rows="3"
      placeholder="Provide additional feedback"
    ></kyn-text-area>

    <div class="footer">
      <kyn-button type="submit" kind="primary" size="small">Submit</kyn-button>
      <kyn-button
        kind="secondary"
        size="small"
        @on-click=${(e) => handleCancelClick(e)}
        >Cancel</kyn-button
      >
    </div>
  </form>

  <style>
    kyn-text-area {
      width: 100%;
    }

    .example-form > * {
      margin-top: 8px;
    }

    .footer {
      display: flex;
      gap: 16px;
    }
  </style>
`;

const handleCancelClick = (e) => {
  action(e.type)({ ...e, detail: e.detail });
  console.log('Cancel button clicked');
};
