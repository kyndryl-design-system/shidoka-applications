import { html } from 'lit';
import { action } from '@storybook/addon-actions';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import copyIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/copy.svg';
import './index';
import '../../reusable/checkbox';
import '../../reusable/card/card.sample';
import '../../reusable/textArea/textArea';

export default {
  title: 'AI / Components / AI Sources Feedback',
  component: 'kyn-ai-sources-feedback',
  parameters: {},
};

const sourcesData = [
  {
    title: 'Source Title',
    description: 'Placeholder for the Source Title',
  },
  {
    title: 'Source Title',
    description: 'Placeholder for the Source Title',
  },
  {
    title: 'Source Title',
    description: 'Placeholder for the Source Title',
  },
  {
    title: 'Source Title',
    description: 'Placeholder for the Source Title',
  },
  {
    title: 'Source Title',
    description: 'Placeholder for the Source Title',
  },
  {
    title: 'Source Title',
    description: 'Placeholder for the Source Title',
  },
];

const feedbackOptions = [
  { value: '1', label: 'Option 1' },
  { value: '2', label: 'Option 2' },
  { value: '3', label: 'Option 3' },
];

const args = {
  copy: 'Copy',
  sourcesOpened: false,
  feedbackOpened: false,
  sourcesDisabled: false,
  feedbackDisabled: false,
  revealAllSources: false,
  closeText: 'Close',
  textStrings: {
    sourcesText: 'Sources',
    foundSources: 'Found sources',
    showMore: 'Show more',
    showLess: 'Show less',
    positiveFeedback: 'Share what you liked',
    negativeFeedback: 'Help us improve',
  },
};

export const AISourcesFeedback = {
  args,
  render: (args) => {
    return html`
      <kyn-ai-sources-feedback
        .sourcesOpened=${args.sourcesOpened}
        .feedbackOpened=${args.feedbackOpened}
        .sourcesDisabled=${args.sourcesDisabled}
        .feedbackDisabled=${args.feedbackDisabled}
        ?revealAllSources=${args.revealAllSources}
        closeText=${args.closeText}
        .textStrings=${args.textStrings}
        @on-toggle=${(e) => action(e.type)(e)}
        @oon-feedback-deselected=${(e) => action(e.type)(e)}
      >
        <kyn-button
          slot="copy"
          kind="ghost"
          size="small"
          iconPosition="left"
          description="Copy"
          @on-click=${(e) => action(e.type)(e)}
        >
          <span class="copy-button-text">${args.copy}</span>
          <span slot="icon" class="copy-icon">${unsafeSVG(copyIcon)}</span>
        </kyn-button>

        ${SourcesContent()}

        <div slot="feedback-form" class="feedback-form">
          ${feedbackFormContent()}
        </div>
      </kyn-ai-sources-feedback>
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

const SourcesContent = () => html`
  ${sourcesData.map(
    (card) => html`
      <kyn-card
        style="width:100%;height:100%;"
        slot="sources"
        aiConnected
        type=${args.type}
        href=${args.href}
        target=${args.target}
        rel=${args.rel}
        ?hideBorder=${args.hideBorder}
      >
        <h1 class="card-title">
          <div>${card.title}</div>
        </h1>
        <div class="card-description">
          <kyn-link href="#" @click=${(e) => action(e.type)(e)}>
            ${card.description}
          </kyn-link>
        </div>
      </kyn-card>
    `
  )}
  <style>
    .card-title div {
      @include typography.type-ui-01;
      color: var(--kd-color-text-level-primary);
      font-size: 16px;
      font-weight: 500;
    }
  </style>
`;

const feedbackFormContent = () => html`
  <div class="feedback-header">
    <span> Could you tell us a little bit more ? (optional) </span>
  </div>

  <form
    class="example-form"
    @submit=${(e) => {
      e.preventDefault();
      action('submit')(e);
    }}
  >
    <kyn-checkbox-group ?horizontal=${true}>
      ${feedbackOptions.map(
        (option) =>
          html`<kyn-checkbox value="${option.value}"
            >${option.label}</kyn-checkbox
          >`
      )}
    </kyn-checkbox-group>

    <kyn-text-area
      aiConnected
      class="input-text-area"
      rows="8"
      placeholder="Provide additional feedback"
      ?notResizeable=${true}
    ></kyn-text-area>

    <div class="footer">
      <kyn-button type="submit" kind="primary-ai" size="small"
        >Submit</kyn-button
      >
      <kyn-button
        kind="outline-ai"
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
      margin-top: 0.5rem;
    }

    .footer {
      display: flex;
      gap: 1rem;
    }
  </style>
`;

const handleCancelClick = (e) => {
  action(e.type)(e);
  console.log('Cancel button clicked');
  // Cancel button click logic here to close the feedback form
  // this.feedbackOpened = false;
};
