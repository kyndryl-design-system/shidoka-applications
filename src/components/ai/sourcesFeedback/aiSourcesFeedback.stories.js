import { html } from 'lit';
import { action } from 'storybook/actions';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import copyIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/copy.svg';
import sourceIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/earth.svg';
import './index';
import '../../reusable/checkbox';
import '../../reusable/card/card.sample';
import '../../reusable/textArea/textArea';

export default {
  title: 'AI / Components / AI Sources Feedback',
  component: 'kyn-ai-sources-feedback',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/9Q2XfTSxfzTXfNe2Bi8KDS/Component-Viewer?node-id=7-300053&p=f&m=dev',
    },
  },
};

const sourcesData = [
  {
    description: 'Source Link 1',
  },
  {
    description: 'Source Link 2',
  },
  {
    description: 'Source Link 3',
  },
  {
    description: 'Source Link 4',
  },
  {
    description: 'Source Link 5',
  },
  {
    description: 'Source Link 6',
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
        @on-feedback-deselected=${(e) => action(e.type)(e)}
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
        slot="sources"
        aiConnected
        type="clickable"
        href="#"
        rel="noopener"
        target="_blank"
        ?hideBorder=${args.hideBorder}
        role="link"
        aria-label="Clickable card"
        @on-card-click=${(e) => action(e.type)(e)}
      >
        <div class="card-description">
          <span slot="icon" class="source-icon">${unsafeSVG(sourceIcon)}</span>
          <div class="separator" aria-hidden="true"></div>
          <span class="card-description">${card.description}</span>
        </div>
      </kyn-card>
    `
  )}
  <style>
    kyn-card::part(card-wrapper) {
      padding: 8px 4px;
    }
    .card-description {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 0px 8px;
    }

    .source-icon {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .separator {
      width: 1px;
      height: 16px;
      background-color: var(--color-border, #ccc);
      margin: 0 4px;
      flex-shrink: 0;
    }
    .card-description {
      /* to avoid text overflow for long textStrings */
      word-break: break-word;
      overflow-wrap: break-word;
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
      rows="3"
      placeholder="Provide additional feedback"
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
