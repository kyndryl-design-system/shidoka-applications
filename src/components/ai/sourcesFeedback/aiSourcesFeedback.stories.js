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
  title: 'AI/Components/AISourcesFeedback',
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
  opened: { sources: false, 'pos-feedback': false, 'neg-feedback': false },
  disabled: { sources: false, 'pos-feedback': true, 'neg-feedback': false },
  revealAllSources: false,
};

export const AISourcesFeedback = {
  args,
  render: (args) => {
    return html`
      <kyn-ai-sources-feedback
        .opened=${args.opened}
        .disabled=${args.disabled}
        ?revealAllSources=${args.revealAllSources}
        @on-toggle=${(e) => action(e.type)(e)}
        @on-view-more=${(e) => action(e.type)(e)}
        @on-feedback-changed=${(e) => action(e.type)(e)}
      >
        <kyn-button
          slot="copy"
          kind="ghost"
          iconPosition="left"
          @click=${(e) => action(e.type)(e)}
        >
          Copy
          <span slot="icon" class="copy-icon">${unsafeSVG(copyIcon)}</span>
        </kyn-button>

        <span slot="sources">
          <div class="kd-grid">
            ${sourcesData.map(
              (card) => html`
                <div
                  class="kd-grid__col--sm-2 kd-grid__col--md-4 kd-grid__col--lg-3"
                >
                  <kyn-card
                    style="width:100%;height:100%;"
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
                      <kyn-link
                        href="#"
                        shade="dark"
                        @click=${(e) => action(e.type)(e)}
                      >
                        <div>${card.description}</div>
                      </kyn-link>
                    </div>
                  </kyn-card>
                </div>
              `
            )}
          </div>
        </span>

        <div slot="pos-feedback-form" class="feedback-form">
          ${feedbackFormContent('positive')}
        </div>

        <div slot="neg-feedback-form" class="feedback-form">
          ${feedbackFormContent('negative')}
        </div>
      </kyn-ai-sources-feedback>
      <style>
        .card-title div {
          @include typography.type-ui-01;
          color: var(--kd-color-text-level-primary);
          font-size: 16px;
          font-weight: 500;
        }
        .close {
          position: absolute;
          right: 32px;
          color: var(--kd-color-icon-primary);

          span {
            display: flex;
          }
        }
        kyn-text-area {
          width: 100%;
        }
        .feedback-header {
          display: flex;
          justify-content: space-between;
        }
        form * {
          margin-top: 0.5rem;
        }
      </style>
    `;
  },
};

const feedbackFormContent = (_selectedFeedback) => html`
  <div class="feedback-header">
    <span> Could you tell us a little bit more ? (optional) </span>
    <span>
      <kyn-button
        class="close"
        @on-click=${(e) => {
          args.opened = { ...args.opened, 'neg-feedback': false };
        }}
        kind="ghost"
        size="small"
      >
        <span slot="icon">${unsafeSVG(closeIcon)}</span>
      </kyn-button>
    </span>
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
      <kyn-button kind="ghost">Cancel</kyn-button>
    </div>
  </form>
`;
