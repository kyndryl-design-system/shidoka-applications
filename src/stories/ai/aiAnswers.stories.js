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
    return html`
      <div class="ai-answers-wrapper">
        <kyn-button
          size="small"
          kind="secondary-ai"
          name="AI Answer 1"
          description="AI Answer 1"
          @on-click=${(e) => action(e.type)(e)}
          >AI Answer 1</kyn-button
        >
        <kyn-button
          size="small"
          kind="secondary-ai"
          name="AI Answer 2"
          description="AI Answer 2"
          @on-click=${(e) => action(e.type)(e)}
          >AI Answer 2</kyn-button
        >
        <kyn-button
          size="small"
          kind="secondary-ai"
          name="AI Answer 3"
          description="AI Answer 3"
          @on-click=${(e) => action(e.type)(e)}
          >AI Answer 3</kyn-button
        >
        <kyn-button
          size="small"
          kind="secondary-ai"
          name="AI Answer 4"
          description="AI Answer 4"
          @on-click=${(e) => action(e.type)(e)}
          >AI Answer 4</kyn-button
        >
      </div>

      <style>
        .ai-answers-wrapper {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
          align-items: center;
        }
      </style>
    `;
  },
};
