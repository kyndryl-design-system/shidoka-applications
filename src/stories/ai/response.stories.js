import { html } from 'lit';
import '../../components/reusable/avatar';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import aiResponse from '@kyndryl-design-system/shidoka-foundation/assets/svg/ai/indicator.svg';
import '../../components/reusable/card';

import { AISourcesFeedback } from '../../components/ai/sourcesFeedback/aiSourcesFeedback.stories';

export default {
  title: 'AI/Patterns/Response',
};

const Response = [
  {
    title: 'Assess Business Impact',
    message: [
      {
        msgText:
          '<b>Value to Business:</b> Identify which applications are most critical to core business operations and revenue.',
      },
      {
        msgText:
          '<b>Customer Impact:</b> Prioritize applications that directly affect customer experience or satisfaction.',
      },
      {
        msgText:
          '<b>Strategic Alignment:</b> Focus on applications that align with future business goals or digital transformation strategies.',
      },
    ],
  },
  {
    title: 'Evaluate Technical Factors',
    message: [
      {
        msgText:
          '<b>Technical Debt:</b> Target applications with outdated technology stacks or those that are costly to maintain.',
      },
      {
        msgText:
          '<b>Scalability & Performance:</b> Prioritize apps that struggle with performance issues or scalability bottlenecks.',
      },
      {
        msgText:
          '<b>Integration Complexity:</b> Consider whether the application can integrate easily with modern systems.',
      },
    ],
  },
  {
    title: 'Prioritization Frameworks',
    message: [
      {
        msgText:
          '<b>Impact vs. Effort Matrix:</b> Plot applications based on the potential impact and required effort.',
      },
      {
        msgText:
          '<b>Time-to-Value Assessment:</b> Prioritize apps that can deliver quick, measurable benefits post-modernization.',
      },
      {
        msgText:
          '<b>Risk-Reward Model:</b> Focus on applications with high reward and manageable risks.',
      },
    ],
  },
];

export const UserInput = {
  render: () => {
    return html`
      <div class="response_wrapper">
        <div class="response_title">
          <kyn-avatar initials="A"></kyn-avatar>
          <kyn-card aria-label="Card" aiConnected style="width:100%">
            How do we prioritize which applications to modernize first?
          </kyn-card>
        </div>
      </div>

      <style>
        .response_wrapper {
          display: flex;
          gap: var(--kd-spacing-16);
          .response_title {
            display: flex;
            gap: var(--kd-spacing-16);
          }
        }
      </style>
    `;
  },
};

export const AIResponse = {
  render: () => {
    return html`
      <div class="response_wrapper">
        <span class="response_icon"> ${unsafeHTML(aiResponse)} </span>
        <span class="response_item kd-type--body-02">
          <div>
            Prioritizing which applications to modernize first is crucial for
            maximizing business value and minimizing risk. Here’s a structured
            approach to help with this decision:
          </div>
          ${Response.map((items, index) => {
            return html`
              <div>
                <b>${index + 1}. ${items.title}</b>
              </div>
              <ol
                class="kd-spacing--margin-top-0 kd-spacing--margin-bottom-0 kd-spacing--list-item"
                type="a"
              >
                ${items.message.map((item) => {
                  return html`<li>${unsafeHTML(item.msgText)}</li>`;
                })}
              </ol>
            `;
          })}
          <div class="kd-spacing--margin-top-24">
            Would you like help applying one of these frameworks to your
            specific set of applications?
          </div>
          ${AISourcesFeedback.render(AISourcesFeedback.args)}
        </span>
      </div>
      <style>
        .response_wrapper {
          display: flex;
          gap: var(--kd-spacing-16);
          .response_item {
            display: flex;
            flex-direction: column;
            gap: var(--kd-spacing-16);
          }
          .response_icon {
            svg {
              width: 20px;
              height: 20px;
            }
          }
        }
      </style>
    `;
  },
};
