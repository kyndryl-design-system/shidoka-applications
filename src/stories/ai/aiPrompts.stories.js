import { html } from 'lit';
import { action } from 'storybook/actions';

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
    displayVertical: false,
  },
  render: (args) => {
    return html`
      ${aiPromptsStyles}

      <div
        class="ai-prompts-wrapper ${args.centered
          ? 'centered'
          : ''} ${args.displayVertical ? 'vertical' : ''}"
      >
        <kyn-card
          type="clickable"
          .aiConnected=${true}
          href="javascript:void(0)"
          @on-card-click=${handleCardClick}
          class="kd-type--ui-02"
        >
          <div
            class="card-title kd-type--weight-medium kd-spacing--margin-bottom-8"
          >
            Success Stories
          </div>
          <p class="card-description">
            Help me find previous case studies or Success stories involving
            <code>&lt;industry&gt;</code> or similar clients for
            <code>&lt;business problem&gt;</code> or using
            <code>&lt;Kyndryl service&gt;</code>
          </p>
        </kyn-card>

        <kyn-card
          type="clickable"
          .aiConnected=${true}
          href="javascript:void(0)"
          @on-card-click=${handleCardClick}
          class="kd-type--ui-02"
        >
          <div
            class="card-title kd-type--weight-medium kd-spacing--margin-bottom-8"
          >
            Industry based Search
          </div>
          <p class="card-description">
            Search for documents tailored to the interests of
            <code>&lt;customer&gt;</code> from <code>&lt;industry&gt;</code> for
            a business opportunity focused on
            <code>&lt;Kyndryl service&gt;</code>
          </p>
        </kyn-card>

        <kyn-card
          type="clickable"
          .aiConnected=${true}
          href="javascript:void(0)"
          @on-card-click=${handleCardClick}
          class="kd-type--ui-02"
        >
          <div
            class="card-title kd-type--weight-medium kd-spacing--margin-bottom-8"
          >
            Service fit
          </div>
          <p class="card-description">
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

      &.vertical {
        flex-direction: column;

        &.centered {
          align-items: center;
        }

        kyn-card {
          width: 100%;
        }
      }

      kyn-card {
        width: 100%;
      }
    }

    @media (min-width: 767px) {
      .ai-prompts-wrapper kyn-card {
        width: revert-layer;
      }

      .ai-prompts-wrapper.vertical.centered kyn-card {
        width: auto;
        max-width: 353px;
      }
    }
  </style>
`;

const handleCardClick = (e) => {
  e.preventDefault();
  e.stopPropagation();

  action(e.type)({ ...e, detail: e.detail });
};
