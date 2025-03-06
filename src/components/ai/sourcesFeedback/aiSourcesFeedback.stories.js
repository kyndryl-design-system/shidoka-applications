import { html } from 'lit';
import { action } from '@storybook/addon-actions';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import copyIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/copy.svg';
import closeIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/close-simple.svg';
import '@kyndryl-design-system/shidoka-foundation/css/grid.css';
import '@kyndryl-design-system/shidoka-foundation/css/typography.css';
import './index';
import '../../reusable/checkbox';
import '../../reusable/card/card.sample';

export default {
  title: 'AI / Components / AISourcesFeedback',
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

const posFeedbackOptions = [
  { value: '1', label: 'Easy to understand' },
  { value: '2', label: 'Exhaustive' },
  { value: '3', label: 'Correct' },
];

const negFeedbackOptions = [
  { value: '1', label: 'Hard to understand' },
  { value: '2', label: 'Limited' },
  { value: '3', label: 'Incorrect' },
];

const args = {
  sourcesOpened: false,
  feedbackOpened: false,
  sourcesDisabled: false,
  feedbackDisabled: false,
  revealAllSources: false,
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
        @on-toggle=${(e) => action(e.type)(e)}
        @on-feedback-changed=${(e) => action(e.type)(e)}
      >
        <kyn-button
          slot="copy"
          kind="ghost"
          size="small"
          iconPosition="left"
          @on-click=${(e) => action(e.type)(e)}
        >
          Copy
          <span slot="icon" class="copy-icon">${unsafeSVG(copyIcon)}</span>
        </kyn-button>
        <span slot="sources" class="sources"> ${SourcesContent()} </span>

        <div slot="pos-feedback-form" class="feedback-form">
          ${feedbackFormContent('positive')}
        </div>

        <div slot="neg-feedback-form" class="feedback-form">
          ${feedbackFormContent('negative')}
        </div>
      </kyn-ai-sources-feedback>
    `;
  },
};

const feedbackFormContent = (_selectedFeedback) => html`
  <div class="feedback-header">
    <span> Could you tell us a little bit more ? (optional) </span>
  </div>
  <form
    @submit=${(e) => {
      e.preventDefault();
      action('submit')(e);
    }}
  >
    <kyn-checkbox-group ?horizontal=${true}>
      ${_selectedFeedback === 'positive'
        ? posFeedbackOptions.map(
            (option) =>
              html`<kyn-checkbox value="${option.value}"
                >${option.label}</kyn-checkbox
              >`
          )
        : negFeedbackOptions.map(
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
      <kyn-button type="submit" kind="primary-ai">Submit</kyn-button>
      <kyn-button kind="outline-ai">Cancel</kyn-button>
    </div>
  </form>
  <style>
    kyn-text-area {
      width: 100%;
    }
    form * {
      margin-top: 0.5rem;
    }
  </style>
`;

const SourcesContent = () => html`
  ${sourcesData.map(
    (card) => html`
      <kyn-card
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
          <kyn-link href="#" shade="dark" @click=${(e) => action(e.type)(e)}>
            <div>${card.description}</div>
          </kyn-link>
        </div>
      </kyn-card>
    `
  )}
  <style>
    kyn-card {
      width: 24%;
    }
    .card-title div {
      @include typography.type-ui-01;
      color: var(--kd-color-text-level-primary);
      font-size: 16px;
      font-weight: 500;
    }
  </style>
`;
