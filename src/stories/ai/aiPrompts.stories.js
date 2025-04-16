import { html } from 'lit';
import { action } from '@storybook/addon-actions';

import '../../components/reusable/card';

export default {
  title: 'AI/Patterns/AI Prompts',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/9Q2XfTSxfzTXfNe2Bi8KDS/Component-Viewer?node-id=7-300056&p=f&m=dev',
    },
  },
};

export const Default = {
  args: {
    centered: true,
  },
  render: (args) => {
    return html`
      ${aiPromptsStyles}

      <div class="ai-prompts-wrapper ${args.centered ? 'centered' : ''}">
        <kyn-card
          type="clickable"
          aiConnected
          href="javascript:void(0)"
          @on-card-click=${handleCardClick}
          class="kd-type--ui-02"
        >
          <div class="kd-type--weight-medium kd-spacing--margin-bottom-8">
            Success Stories
          </div>
          <p>
            Help me find previous case studies or Success stories involving
            <code>&lt;industry&gt;</code> or similar clients for
            <code>&lt;business problem&gt;</code> or using
            <code>&lt;Kyndryl service&gt;</code>
          </p>
        </kyn-card>

        <kyn-card
          type="clickable"
          aiConnected
          href="javascript:void(0)"
          @on-card-click=${handleCardClick}
          class="kd-type--ui-02"
        >
          <div class="kd-type--weight-medium kd-spacing--margin-bottom-8">
            Industry based Search
          </div>
          <p>
            Search for documents tailored to the interests of
            <code>&lt;customer&gt;</code> from <code>&lt;industry&gt;</code> for
            a business opportunity focused on
            <code>&lt;Kyndryl service&gt;</code>
          </p>
        </kyn-card>

        <kyn-card
          type="clickable"
          aiConnected
          href="javascript:void(0)"
          @on-card-click=${handleCardClick}
          class="kd-type--ui-02"
        >
          <div class="kd-type--weight-medium kd-spacing--margin-bottom-8">
            Service fit
          </div>
          <p>
            Retrieve documents that highlight how our products/services can
            address <code>&lt;customer specific needs&gt;</code> on customer
            <code>&lt;business problem&gt;</code>
          </p>
        </kyn-card>
      </div>
    `;
  },
};

const aiPromptsStyles = html`
  <style>
    .ai-prompts-wrapper {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;

      &.centered {
        justify-content: center;
      }

      kyn-card {
        width: 100%;
      }
    }

    @media (min-width: 42rem) {
      .ai-prompts-wrapper kyn-card {
        width: revert-layer;
      }
    }

    /** Animation styles to be potentially implemented in the future */
    /*.ai-prompts-wrapper kyn-card {
      transition: transform 0.4s ease, opacity 0.5s ease;
      transform-origin: center;
      position: relative;
      z-index: 1;
    }*/

    /* .ai-prompts-wrapper kyn-card.selected {
      transform: scale(1.1);
      z-index: 2;
    } */

    /* .ai-prompts-wrapper kyn-card.fade-out {
      opacity: 0;
      pointer-events: none;
    }

    .ai-prompts-wrapper
      .ai-prompts-wrapper
      kyn-card
      .ai-prompts-wrapper
      kyn-card.unselected {
      transform: scale(0.95);
      opacity: 0.85;
    } */
  </style>
`;

const handleCardClick = (e) => {
  e.preventDefault();
  e.stopPropagation();

  // Animation to be potentially implemented in the future
  // const card = e.target.closest('kyn-card');
  // const wrapper = card.closest('.ai-prompts-wrapper');
  // const allCards = wrapper.querySelectorAll('kyn-card');
  //
  // card.classList.add('selected');
  //
  // allCards.forEach((c) => {
  //   if (c !== card) {
  //     c.classList.add('unselected');
  //   }
  // });
  //
  // setTimeout(() => {
  //   allCards.forEach((c) => {
  //     c.classList.add('fade-out');
  //   });
  // }, 300);

  action(e.type)(e);
};
