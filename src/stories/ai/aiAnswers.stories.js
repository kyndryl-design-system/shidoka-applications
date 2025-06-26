import { html } from 'lit';
import { action } from 'storybook/actions';

import '../../components/reusable/button';

export default {
  title: 'AI/Patterns/AI Answers',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/9Q2XfTSxfzTXfNe2Bi8KDS/Component-Viewer?node-id=7-300056&p=f&m=dev',
    },
  },
};

export const Default = {
  args: {
    centered: false,
  },
  render: (args) => {
    return html`
      ${aiAnswersStyles}

      <div class="ai-answers-wrapper ${args.centered ? 'centered' : ''}">
        <kyn-button
          size="small"
          kind="secondary-ai"
          name="AI Answer 1"
          description="AI Answer 1"
          @on-click=${handleClick}
        >
          AI Answer 1
        </kyn-button>

        <kyn-button
          size="small"
          kind="secondary-ai"
          name="AI Answer 2"
          description="AI Answer 2"
          @on-click=${handleClick}
        >
          AI Answer 2
        </kyn-button>

        <kyn-button
          size="small"
          kind="secondary-ai"
          name="AI Answer 3"
          description="AI Answer 3"
          @on-click=${handleClick}
        >
          AI Answer 3
        </kyn-button>

        <kyn-button
          size="small"
          kind="secondary-ai"
          name="AI Answer 4"
          description="AI Answer 4"
          @on-click=${handleClick}
        >
          AI Answer 4
        </kyn-button>
      </div>
    `;
  },
};

const aiAnswersStyles = html` <style>
  .ai-answers-wrapper {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
  }

  .ai-answers-wrapper.centered {
    justify-content: center;
  }

  /** Animation styles to be potentially implemented in the future */
  /* .ai-answers-wrapper kyn-button {
          transition: transform 0.4s ease, opacity 0.5s ease;
          transform-origin: center;
          position: relative;
          z-index: 1;
        }

        .ai-answers-wrapper kyn-button.selected {
          transform: scale(1.1);
          z-index: 2;
          box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
        }

        .ai-answers-wrapper kyn-button.unselected {
          transform: scale(0.95);
          opacity: 0.85;
        }

        .ai-answers-wrapper kyn-button.fade-out {
          opacity: 0;
          pointer-events: none;
        } */
</style>`;

const handleClick = (e) => {
  // Animation to be potentially implemented in the future
  // const button = e.target.closest('kyn-button');
  // const wrapper = button.closest('.ai-answers-wrapper');
  // const allButtons = wrapper.querySelectorAll('kyn-button');
  //
  // button.classList.add('selected');
  //
  // allButtons.forEach((btn) => {
  //   if (btn !== button) {
  //     btn.classList.add('unselected');
  //   }
  // });
  //
  // setTimeout(() => {
  //   allButtons.forEach((btn) => {
  //     btn.classList.add('fade-out');
  //   });
  // }, 400);

  action(e.type)(e);
};
