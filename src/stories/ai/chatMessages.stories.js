import { html } from 'lit';
import { User, AI } from './response.stories.js';
import { Default as infoCard } from './infoCard.stories.js';
import { Default as Answers } from './aiAnswers.stories.js';

export default {
  title: 'AI/Patterns/Chat',
};

export const ChatMessages = {
  render: () => {
    return html`
      <div class="main-div">
        ${infoCard.render()} ${User.render()} ${infoCard.render()}
        ${AI.render()} ${Answers.render({})}
      </div>

      <style>
        .main-div {
          display: flex;
          flex-direction: column;
          gap: 16px;
          /* Adjust the margin as needed */
        }
      </style>
    `;
  },
};
