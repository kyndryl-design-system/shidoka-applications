import { html } from 'lit';
import { action } from '@storybook/addon-actions';
import '../../components/reusable/card';

export default {
  title: 'AI/Patterns/AI Prompts',
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
      <div class="ai-prompts-wrapper">
        <kyn-card
          type="clickable"
          aiConnected
          @on-card-click=${(e) => action(e.type)(e)}
        >
          <sample-card-component>
            <div slot="title">Success Stories</div>
            <div slot="description">
              Help me find previous case studies or Success stories involving
              <code>&lt;industry&gt;</code> or similar clients for
              <code>&lt;business problem&gt;</code> or using
              <code>&lt;Kyndryl service&gt;</code>
            </div>
          </sample-card-component>
        </kyn-card>

        <kyn-card
          type="clickable"
          aiConnected
          @on-card-click=${(e) => action(e.type)(e)}
        >
          <sample-card-component>
            <div slot="title">Industry based Search</div>
            <div slot="description">
              Search for documents tailored to the interests of
              <code>&lt;customer&gt;</code> from
              <code>&lt;industry&gt;</code> for a business opportunity focused
              on <code>&lt;Kyndryl service&gt;</code>
            </div>
          </sample-card-component>
        </kyn-card>

        <kyn-card
          type="clickable"
          aiConnected
          @on-card-click=${(e) => action(e.type)(e)}
        >
          <sample-card-component>
            <div slot="title">Service fit</div>
            <div slot="description">
              Retrieve documents that highlight how our products/services can
              address <code>&lt;customer specific needs&gt;</code> on customer
              <code>&lt;business problem&gt;</code>
            </div>
          </sample-card-component>
        </kyn-card>
      </div>

      <style>
        .ai-prompts-wrapper {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }

        .ai-prompts-wrapper kyn-card {
          width: 250px;
          font-size: 14px;
        }

        sample-card-component [slot='title'] {
          font-weight: 500;
          margin-top: 0;
          margin-bottom: 8px;
        }

        sample-card-component [slot='description'] code {
          font-size: 14px;
        }

        kyn-card::part(card-wrapper) {
          height: 100%;
        }
      </style>
    `;
  },
};

export const Centered = {
  render: () => {
    return html`
      <div class="ai-prompts-wrapper centered">
        <kyn-card
          type="clickable"
          aiConnected
          @on-card-click=${(e) => action(e.type)(e)}
        >
          <sample-card-component>
            <div slot="title">Success Stories</div>
            <div slot="description">
              Help me find previous case studies or Success stories involving
              <code>&lt;industry&gt;</code> or similar clients for
              <code>&lt;business problem&gt;</code> or using
              <code>&lt;Kyndryl service&gt;</code>
            </div>
          </sample-card-component>
        </kyn-card>

        <kyn-card
          type="clickable"
          aiConnected
          @on-card-click=${(e) => action(e.type)(e)}
        >
          <sample-card-component>
            <div slot="title">Industry based Search</div>
            <div slot="description">
              Search for documents tailored to the interests of
              <code>&lt;customer&gt;</code> from
              <code>&lt;industry&gt;</code> for a business opportunity focused
              on <code>&lt;Kyndryl service&gt;</code>
            </div>
          </sample-card-component>
        </kyn-card>

        <kyn-card
          type="clickable"
          aiConnected
          @on-card-click=${(e) => action(e.type)(e)}
        >
          <sample-card-component>
            <div slot="title">Service fit</div>
            <div slot="description">
              Retrieve documents that highlight how our products/services can
              address <code>&lt;customer specific needs&gt;</code> on customer
              <code>&lt;business problem&gt;</code>
            </div>
          </sample-card-component>
        </kyn-card>
      </div>

      <style>
        .ai-prompts-wrapper {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }

        .ai-prompts-wrapper.centered {
          justify-content: center;
        }

        .ai-prompts-wrapper kyn-card {
          width: 250px;
          font-size: 14px;
        }

        sample-card-component [slot='title'] {
          font-weight: 500;
          margin-top: 0;
          margin-bottom: 8px;
        }

        sample-card-component [slot='description'] code {
          font-size: 14px;
        }

        kyn-card::part(card-wrapper) {
          height: 100%;
        }
      </style>
    `;
  },
};
