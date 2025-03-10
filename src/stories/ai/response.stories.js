import { html } from 'lit';
import '../../components/reusable/avatar';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import aiResponse from '@kyndryl-design-system/shidoka-foundation/assets/svg/ai/indicator.svg';
import '../../components/reusable/card';

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

const Template = () => {
  return html` <span class="response_item kd-type--body-02">
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
          <ol class="mg-0 kd-spacing--list-item" type="a">
            ${items.message.map((item) => {
              return html`<li>${unsafeHTML(item.msgText)}</li>`;
            })}
          </ol>
        `;
      })}
      <div class="mg-30">
        Would you like help applying one of these frameworks to your specific
        set of applications?
      </div>
    </span>
    <style>
      .response_item {
        display: flex;
        flex-direction: column;
        gap: 16px;
        color: var(--kd-color-text-level-primary);
      }
      .mg-30 {
        margin-top: 30px;
      }
      .mg-0 {
        margin: 0;
      }
    </style>`;
};

export const WithAvatarInitials = {
  render: () => {
    return html`
      <div class="response_content">
        <div class="response_items">
          <kyn-avatar initials="A"></kyn-avatar>
          ${Template()}
        </div>
      </div>

      <style>
        .response_content {
          display: flex;
          gap: 16px;
          flex-direction: column;
        }
        .response_items {
          display: flex;
          gap: 16px;
          color: var(--kd-color-text-level-primary);
        }
      </style>
    `;
  },
};

export const WithAvatarImage = {
  render: () => {
    return html`
      <div class="response_content">
        <div class="response_items">
          <kyn-avatar
            ><img src="https://picsum.photos/id/237/112/112" alt="User Name"
          /></kyn-avatar>
          ${Template()}
        </div>
      </div>
      <style>
        .response_content {
          display: flex;
          gap: 16px;
          flex-direction: column;
        }
        .response_items {
          display: flex;
          gap: 16px;
          color: var(--kd-color-text-level-primary);
        }
        .response_title {
          display: flex;
          gap: 16px;
        }
      </style>
    `;
  },
};

export const WithAIImage = {
  render: () => {
    return html`
      <div class="response_content">
        <div class="response_items">
          <span class="response_icon"> ${unsafeHTML(aiResponse)} </span>
          ${Template()}
        </div>
      </div>
      <style>
        .response_content {
          display: flex;
          gap: 16px;
          flex-direction: column;
        }
        .response_items {
          display: flex;
          gap: 16px;
          color: var(--kd-color-text-level-primary);
        }
        .response_title {
          display: flex;
          gap: 16px;
        }
        .response_icon {
          svg {
            width: 20px;
            height: 20px;
          }
        }
      </style>
    `;
  },
};

export const WithOtherContent = {
  render: () => {
    return html`
      <div class="response_content">
        <div class="response_items">
          <div class="response_title">
            <span><kyn-avatar initials="A"></kyn-avatar></span>
            <kyn-card aria-label="Card" aiConnected style="width:100%">
              How do we prioritize which applications to modernize first?
            </kyn-card>
          </div>
        </div>
        ${WithAIImage.render()}
        <div class="response_items">
          <div class="response_title">
            <span><kyn-avatar initials="A"></kyn-avatar></span>
            <kyn-card aria-label="Card" aiConnected style="width:100%">
              Yes
            </kyn-card>
          </div>
        </div>
      </div>

      <style>
        .response_content {
          display: flex;
          gap: 16px;
          flex-direction: column;
        }
        .response_items {
          display: flex;
          gap: 16px;
          color: var(--kd-color-text-level-primary);
        }
        .response_title {
          display: flex;
          gap: 16px;
        }
      </style>
    `;
  },
};
