import { html } from 'lit';
import '../../components/reusable/avatar';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import aiResponse from '@kyndryl-design-system/shidoka-foundation/assets/svg/ai/response.svg';

export default {
  title: 'AI/Patterns/Response',
};

const args = {};

export const WithAvatarInitials = {
  args,
  render: (args) => {
    return html`
      <div class="response-wrapper">
        <kyn-avatar initials="A"></kyn-avatar>

        <span class="response-msg">
          The benefits of adopting Hybrid IT Modernization:
          <ol class="kd-spacing--list-item">
            <li>
              Cost Efficiency: Hybrid IT allows organizations to combine
              on-premises infrastructure with cloud solutions, optimizing costs
              by only utilizing cloud services for what is needed. It helps
              avoid over-provisioning and can scale as needed without large
              upfront investments.
            </li>
            <li>
              Flexibility and Scalability: Organizations can leverage the
              flexibility of the cloud for specific workloads while maintaining
              critical systems on-premises. This provides the ability to scale
              resources up or down as business needs change, ensuring better
              alignment with demand.
            </li>
            <li>
              Improved Agility: By modernizing IT infrastructure with a hybrid
              approach, businesses can more quickly respond to market changes
              and customer needs. They can experiment with new technologies or
              software without disrupting core operations.
            </li>
          </ol>
        </span>
      </div>

      <style>
        .response-wrapper {
          display: flex;
          gap: 20px;
        }
        ol {
          margin-left: -1rem;
        }
      </style>
    `;
  },
};

export const WithAvatarImage = {
  args,
  render: (args) => {
    return html`
      <div class="response-wrapper">
        <kyn-avatar
          ><img src="https://picsum.photos/id/237/112/112" alt="User Name"
        /></kyn-avatar>

        <span class="response-msg">
          The benefits of adopting Hybrid IT Modernization:
          <ol class="kd-spacing--list-item">
            <li>
              Cost Efficiency: Hybrid IT allows organizations to combine
              on-premises infrastructure with cloud solutions, optimizing costs
              by only utilizing cloud services for what is needed. It helps
              avoid over-provisioning and can scale as needed without large
              upfront investments.
            </li>
            <li>
              Flexibility and Scalability: Organizations can leverage the
              flexibility of the cloud for specific workloads while maintaining
              critical systems on-premises. This provides the ability to scale
              resources up or down as business needs change, ensuring better
              alignment with demand.
            </li>
            <li>
              Improved Agility: By modernizing IT infrastructure with a hybrid
              approach, businesses can more quickly respond to market changes
              and customer needs. They can experiment with new technologies or
              software without disrupting core operations.
            </li>
          </ol>
        </span>
      </div>

      <style>
        .response-wrapper {
          display: flex;
          gap: 20px;
        }
        ol {
          margin-left: -1rem;
        }
      </style>
    `;
  },
};

export const WithAIImage = {
  args,
  render: (args) => {
    return html`
      <div class="response-wrapper">
        <span> ${unsafeHTML(aiResponse)} </span>
        <span class="response-msg">
          The benefits of adopting Hybrid IT Modernization:
          <ol class="kd-spacing--list-item">
            <li>
              Cost Efficiency: Hybrid IT allows organizations to combine
              on-premises infrastructure with cloud solutions, optimizing costs
              by only utilizing cloud services for what is needed. It helps
              avoid over-provisioning and can scale as needed without large
              upfront investments.
            </li>
            <li>
              Flexibility and Scalability: Organizations can leverage the
              flexibility of the cloud for specific workloads while maintaining
              critical systems on-premises. This provides the ability to scale
              resources up or down as business needs change, ensuring better
              alignment with demand.
            </li>
            <li>
              Improved Agility: By modernizing IT infrastructure with a hybrid
              approach, businesses can more quickly respond to market changes
              and customer needs. They can experiment with new technologies or
              software without disrupting core operations.
            </li>
          </ol>
        </span>
      </div>

      <style>
        .response-wrapper {
          display: flex;
          gap: 20px;
        }
        ol {
          margin-left: -1rem;
        }
      </style>
    `;
  },
};
