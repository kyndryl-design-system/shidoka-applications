import { html } from 'lit';
import { action } from '@storybook/addon-actions';
import '../../components/reusable/button';

export default {
  title: 'AI/Patterns/AI Answers',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/qyPEUQckxj8LUgesi1OEES/Component-Library-2.0?node-id=29524-9666&p=f&m=dev',
    },
  },
};

export const Default = {
  render: () => {
    const handleClick = (e) => {
      const button = e.target.closest('kyn-button');
      const wrapper = button.closest('.ai-answers-wrapper');
      const allButtons = wrapper.querySelectorAll('kyn-button');

      button.classList.add('selected');

      allButtons.forEach((btn) => {
        if (btn !== button) {
          btn.classList.add('unselected');
        }
      });

      setTimeout(() => {
        allButtons.forEach((btn) => {
          btn.classList.add('fade-out');
        });
      }, 400);

      action(e.type)(e);
    };

    return html`
      <div class="ai-answers-wrapper">
        <kyn-button
          size="small"
          kind="secondary-ai"
          name="AI Answer 1"
          description="AI Answer 1"
          @on-click=${handleClick}
          >AI Answer 1</kyn-button
        >
        <kyn-button
          size="small"
          kind="secondary-ai"
          name="AI Answer 2"
          description="AI Answer 2"
          @on-click=${handleClick}
          >AI Answer 2</kyn-button
        >
        <kyn-button
          size="small"
          kind="secondary-ai"
          name="AI Answer 3"
          description="AI Answer 3"
          @on-click=${handleClick}
          >AI Answer 3</kyn-button
        >
        <kyn-button
          size="small"
          kind="secondary-ai"
          name="AI Answer 4"
          description="AI Answer 4"
          @on-click=${handleClick}
          >AI Answer 4</kyn-button
        >
      </div>

      <style>
        .ai-answers-wrapper {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }

        .ai-answers-wrapper kyn-button {
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
        }
      </style>
    `;
  },
};

export const Centered = {
  render: () => {
    const handleClick = (e) => {
      const button = e.target.closest('kyn-button');
      const wrapper = button.closest('.ai-answers-wrapper');
      const allButtons = wrapper.querySelectorAll('kyn-button');

      button.classList.add('selected');

      allButtons.forEach((btn) => {
        if (btn !== button) {
          btn.classList.add('unselected');
        }
      });

      setTimeout(() => {
        allButtons.forEach((btn) => {
          btn.classList.add('fade-out');
        });
      }, 400);

      action(e.type)(e);
    };

    return html`
      <div class="ai-answers-wrapper centered">
        <kyn-button
          size="small"
          kind="secondary-ai"
          name="AI Answer 1"
          description="AI Answer 1"
          @on-click=${handleClick}
          >AI Answer 1</kyn-button
        >
        <kyn-button
          size="small"
          kind="secondary-ai"
          name="AI Answer 2"
          description="AI Answer 2"
          @on-click=${handleClick}
          >AI Answer 2</kyn-button
        >
        <kyn-button
          size="small"
          kind="secondary-ai"
          name="AI Answer 3"
          description="AI Answer 3"
          @on-click=${handleClick}
          >AI Answer 3</kyn-button
        >
        <kyn-button
          size="small"
          kind="secondary-ai"
          name="AI Answer 4"
          description="AI Answer 4"
          @on-click=${handleClick}
          >AI Answer 4</kyn-button
        >
        <kyn-button
          size="small"
          kind="secondary-ai"
          name="AI Answer 5"
          description="AI Answer 5"
          @on-click=${handleClick}
          >AI Answer 5</kyn-button
        >
        <kyn-button
          size="small"
          kind="secondary-ai"
          name="AI Answer 6"
          description="AI Answer 6"
          @on-click=${handleClick}
          >AI Answer 6</kyn-button
        >
      </div>

      <style>
        .ai-answers-wrapper {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }

        .ai-answers-wrapper.centered {
          justify-content: center;
        }

        .ai-answers-wrapper kyn-button {
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
        }
      </style>
    `;
  },
};
