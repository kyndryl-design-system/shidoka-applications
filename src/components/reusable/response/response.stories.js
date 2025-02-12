import { html } from 'lit';
import './response';
import '../avatar';
// import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
// import aiResponse from '@kyndryl-design-system/shidoka-foundation/assets/svg/ai-response.svg';

export default {
  title: 'AI/Patterns/Response',
};

const args = {};

export const WithAvatarInitials = {
  args,
  render: (args) => {
    return html`
      <kyn-response>
        <kyn-avatar initials="A"></kyn-avatar>

        <span class="response-msg">
          The benefits of adopting Hybrid IT Modernization:
          <ol>
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
      </kyn-response>

      <style>
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
      <kyn-response>
        <kyn-avatar
          ><img src="https://picsum.photos/id/237/112/112" alt="User Name"
        /></kyn-avatar>

        <span class="response-msg">
          The benefits of adopting Hybrid IT Modernization:
          <ol>
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
      </kyn-response>

      <style>
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
      <kyn-response>
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40px"
            height="40px"
            viewBox="0 0 40 40"
            fill="none"
          >
            <g>
              <rect
                width="40"
                height="39.9984"
                rx="19.4286"
                fill="rgba(187, 0, 187, 0.2)"
              />
              <path
                d="M19.9999 34.9986C28.2878 34.9986 35 28.2868 35 19.9992C35 11.7116 28.2878 4.99979 19.9999 4.99979C11.712 4.99979 5 11.7116 5 19.9992C5 28.2868 11.712 34.9986 19.9999 34.9986Z"
                fill="rgba(187, 0, 187, 0.4)"
              />
              <path
                d="M19.9974 28.079C24.5321 28.079 28.2046 24.4067 28.2046 19.8722C28.2046 15.3377 24.5321 11.6654 19.9974 11.6654C15.4627 11.6654 11.7903 15.3377 11.7903 19.8722C11.7903 24.4067 15.4627 28.079 19.9974 28.079Z"
                fill="#BB00BB"
              />
            </g>
          </svg>
        </span>
        <span class="response-msg">
          The benefits of adopting Hybrid IT Modernization:
          <ol>
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
      </kyn-response>

      <style>
        ol {
          margin-left: -1rem;
        }
      </style>
    `;
  },
};
