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
    const handleCardClick = (e) => {
      e.preventDefault();
      e.stopPropagation();

      // Animation to be potentially implemented in the future
      // const card = e.target.closest('kyn-card');
      // const wrapper = card.closest('.ai-prompts-wrapper');
      // const allCards = wrapper.querySelectorAll('kyn-card');
      //
      // card.classList.add('selected');
      //
      // allCards.forEach((c) => {
      //   if (c !== card) {
      //     c.classList.add('unselected');
      //   }
      // });
      //
      // setTimeout(() => {
      //   allCards.forEach((c) => {
      //     c.classList.add('fade-out');
      //   });
      // }, 300);

      action(e.type)(e);
    };

    return html`
      <style>
        .ai-prompts-wrapper {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }

        .ai-prompts-wrapper kyn-card sample-card-component [slot='title'] {
          @include typography.type-ui-01;
          margin-top: 0;
          margin-bottom: 8px;
          font-weight: 500;
        }

        .ai-prompts-wrapper kyn-card {
          width: 250px;
          font-size: 14px;
          transition: transform 0.4s ease, opacity 0.5s ease;
          transform-origin: center;
          position: relative;
          z-index: 1;
        }

        .ai-prompts-wrapper kyn-card::part(card-wrapper) {
          height: 100%;
        }

        .ai-prompts-wrapper kyn-card.selected {
          transform: scale(1.1);
          z-index: 2;
        }

        .ai-prompts-wrapper kyn-card {
          --card-title-margin-top: 0;
          --card-title-margin-bottom: 8px;
        }

        .ai-prompts-wrapper kyn-card.fade-out {
          opacity: 0;
          pointer-events: none;
        }

        .ai-prompts-wrapper
          .ai-prompts-wrapper
          kyn-card
          .ai-prompts-wrapper
          kyn-card.unselected {
          transform: scale(0.95);
          opacity: 0.85;
        }

        .ai-prompts-wrapper
          kyn-card
          sample-card-component
          [slot='description']
          code {
          font-size: 14px;
        }
      </style>

      <div class="ai-prompts-wrapper">
        <kyn-card
          type="clickable"
          aiConnected
          href="javascript:void(0)"
          @on-card-click=${handleCardClick}
        >
          <sample-card-component .showLogo=${false} .subtitle=${null}>
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
          href="javascript:void(0)"
          @on-card-click=${handleCardClick}
        >
          <sample-card-component .showLogo=${false} .subtitle=${null}>
            <div slot="title">Industry based Search</div>
            <div slot="description">
              Search for documents tailored to the interests of
              <code>&lt;customer&gt;</code> from
              <code>&lt;industry&gt;</code> for a business opportunity focused
              on
              <code>&lt;Kyndryl service&gt;</code>
            </div>
          </sample-card-component>
        </kyn-card>

        <kyn-card
          type="clickable"
          aiConnected
          href="javascript:void(0)"
          @on-card-click=${handleCardClick}
        >
          <sample-card-component .showLogo=${false} .subtitle=${null}>
            <div slot="title">Service fit</div>
            <div slot="description">
              Retrieve documents that highlight how our products/services can
              address <code>&lt;customer specific needs&gt;</code> on customer
              <code>&lt;business problem&gt;</code>
            </div>
          </sample-card-component>
        </kyn-card>
      </div>
    `;
  },
};

export const Centered = {
  render: () => {
    const handleCardClick = (e) => {
      e.preventDefault();
      e.stopPropagation();

      // Animation to be potentially implemented in the future
      // const card = e.target.closest('kyn-card');
      // const wrapper = card.closest('.ai-prompts-wrapper');
      // const allCards = wrapper.querySelectorAll('kyn-card');
      //
      // card.classList.add('selected');
      //
      // allCards.forEach((c) => {
      //   if (c !== card) {
      //     c.classList.add('unselected');
      //   }
      // });
      //
      // setTimeout(() => {
      //   allCards.forEach((c) => {
      //     c.classList.add('fade-out');
      //   });
      // }, 300);

      action(e.type)(e);
    };

    return html`
      <style>
        .ai-prompts-wrapper {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }

        .ai-prompts-wrapper kyn-card sample-card-component [slot='title'] {
          @include typography.type-ui-01;
          margin-top: 0;
          margin-bottom: 8px;
          font-weight: 500;
        }

        .ai-prompts-wrapper.centered {
          justify-content: center;
        }

        .ai-prompts-wrapper kyn-card {
          width: 250px;
          font-size: 14px;
          transition: transform 0.4s ease, opacity 0.5s ease;
          transform-origin: center;
          position: relative;
          z-index: 1;
        }

        .ai-prompts-wrapper kyn-card::part(card-wrapper) {
          height: 100%;
        }

        .ai-prompts-wrapper kyn-card.selected {
          transform: scale(1.1);
          z-index: 2;
        }

        .ai-prompts-wrapper kyn-card {
          --card-title-margin-top: 0;
          --card-title-margin-bottom: 8px;
        }

        .ai-prompts-wrapper kyn-card.fade-out {
          opacity: 0;
          pointer-events: none;
        }

        .ai-prompts-wrapper
          .ai-prompts-wrapper
          kyn-card
          .ai-prompts-wrapper
          kyn-card.unselected {
          transform: scale(0.95);
          opacity: 0.85;
        }

        .ai-prompts-wrapper
          kyn-card
          sample-card-component
          [slot='description']
          code {
          font-size: 14px;
        }
      </style>

      <div class="ai-prompts-wrapper centered">
        <kyn-card
          type="clickable"
          aiConnected
          href="javascript:void(0)"
          @on-card-click=${handleCardClick}
        >
          <sample-card-component .showLogo=${false} .subtitle=${null}>
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
          href="javascript:void(0)"
          @on-card-click=${handleCardClick}
        >
          <sample-card-component .showLogo=${false} .subtitle=${null}>
            <div slot="title">Industry based Search</div>
            <div slot="description">
              Search for documents tailored to the interests of
              <code>&lt;customer&gt;</code> from
              <code>&lt;industry&gt;</code> for a business opportunity focused
              on
              <code>&lt;Kyndryl service&gt;</code>
            </div>
          </sample-card-component>
        </kyn-card>

        <kyn-card
          type="clickable"
          aiConnected
          href="javascript:void(0)"
          @on-card-click=${handleCardClick}
        >
          <sample-card-component .showLogo=${false} .subtitle=${null}>
            <div slot="title">Service fit</div>
            <div slot="description">
              Retrieve documents that highlight how our products/services can
              address <code>&lt;customer specific needs&gt;</code> on customer
              <code>&lt;business problem&gt;</code>
            </div>
          </sample-card-component>
        </kyn-card>
      </div>
    `;
  },
};
