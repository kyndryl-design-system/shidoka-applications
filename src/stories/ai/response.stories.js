import { html } from 'lit';
import '../../components/reusable/avatar';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import aiResponse from '@kyndryl-design-system/shidoka-foundation/assets/svg/ai/indicator.svg';
import '../../components/reusable/card';

import { AISourcesFeedback } from '../../components/ai/sourcesFeedback/aiSourcesFeedback.stories';

export default {
  title: 'AI/Patterns/Response',
};

export const User = {
  render: () => {
    return html`
      <div class="response_wrapper">
        <div class="response_title">
          <kyn-avatar initials="A"></kyn-avatar>
          <kyn-card
            role="region"
            aria-label="User message"
            aiConnected
            style="width:100%"
          >
            User response here...Lorem ipsum dolor sit amet, consectetur
            adipiscing elit
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

export const AI = {
  render: () => {
    return html`
      <div>
        <div class="response_wrapper kd-spacing--margin-bottom-12">
          <div class="response_icon">${unsafeHTML(aiResponse)}</div>
          <div class="response_item kd-type--body-02">
            <div>AI generated response here....</div>
            ${Array.from({ length: 2 }, (_, index) => {
              return html`
                <div>
                  <b>${index + 1}. AI Title Text</b>
                </div>
                <ol
                  class="kd-spacing--margin-top-0 kd-spacing--margin-bottom-0 kd-spacing--list-item"
                  type="a"
                >
                  ${Array.from({ length: 3 }, (_, index) => {
                    return html`
                <li><b>Text ${
                  index + 1
                }:</b> AI Content here...Lorem ipsum dolor sit amet, consectetur adipiscing elit</li>
              </ol>
              `;
                  })}
                </ol>
              `;
            })}
            <div class="kd-spacing--margin-top-24">
              Some more content here...Lorem ipsum dolor sit amet, consectetur
              adipiscing elit
            </div>
            ${AISourcesFeedback.render(AISourcesFeedback.args)}
          </div>
        </div>
      </div>
      <style>
        .response_wrapper {
          display: flex;
          gap: var(--kd-spacing-16);
          .response_item {
            display: flex;
            flex-grow: 1;
            flex-direction: column;
            gap: var(--kd-spacing-16);
          }
          .response_icon {
            svg {
              width: 24px;
              height: 24px;
            }
          }
          ol > li::marker {
            font-weight: bold;
          }
        }
      </style>
    `;
  },
};
