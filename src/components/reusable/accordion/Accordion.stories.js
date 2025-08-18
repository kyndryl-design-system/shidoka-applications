/**
 * Copyright Kyndryl, Inc. 2023
 */

import { html } from 'lit';
import { action } from 'storybook/actions';

import './accordion';
import './accordionItem';
import '../overflowMenu';
import circleDashIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/24/circle-stroke.svg';
import checkmarkOutlineIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/24/checkmark.svg';
import errorFilledIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/24/close-filled.svg';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';

export default {
  title: 'Components/Accordion',
  component: 'kyn-accordion',
  subcomponents: { 'kyn-accordion-item': 'kyn-accordion-item' },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/9Q2XfTSxfzTXfNe2Bi8KDS/Component-Viewer?node-id=1-346870&p=f&m=dev',
    },
  },
};

const args = {
  filledHeaders: false,
  compact: false,
  showNumbers: false,
  startNumber: 1,
  expandLabel: 'Expand all items',
  collapseLabel: 'Collapse all items',
  togglePosition: 'left',
};

export const Accordion = {
  args: args,
  render: (args) => {
    return html`
      <kyn-accordion
        ?filledHeaders="${args.filledHeaders}"
        ?compact="${args.compact}"
        ?showNumbers="${args.showNumbers}"
        startNumber="${args.startNumber}"
        expandLabel="${args.expandLabel}"
        collapseLabel="${args.collapseLabel}"
        togglePosition="${args.togglePosition}"
      >
        <kyn-accordion-item
          opened
          @on-toggle=${(e) => action(e.type)({ ...e, detail: e.detail })}
        >
          <span slot="title"> Accordion Title 1 </span>
          <span slot="subtitle"> Accordion subtitle 1 </span>
          <div slot="body">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </div>
        </kyn-accordion-item>

        <kyn-accordion-item
          @on-toggle=${(e) => action(e.type)({ ...e, detail: e.detail })}
        >
          <span slot="title"> Accordion Title 2 </span>
          <span slot="subtitle"> Accordion subtitle 2 </span>
          <div slot="body">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </div>
        </kyn-accordion-item>

        <kyn-accordion-item
          disabled
          @on-toggle=${(e) => action(e.type)({ ...e, detail: e.detail })}
        >
          <span slot="title"> Accordion Title 3 </span>
          <span slot="subtitle"> Accordion subtitle 3 </span>
          <div slot="body">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </div>
        </kyn-accordion-item>
      </kyn-accordion>
    `;
  },
};

export const AccordionWithIcons = {
  args: args,
  render: (args) => {
    return html`
      <kyn-accordion
        ?filledHeaders="${args.filledHeaders}"
        ?compact="${args.compact}"
        ?showNumbers="${args.showNumbers}"
        startNumber="${args.startNumber}"
        expandLabel="${args.expandLabel}"
        collapseLabel="${args.collapseLabel}"
      >
        <kyn-accordion-item
          opened
          @on-toggle=${(e) => action(e.type)({ ...e, detail: e.detail })}
        >
          <span
            class="inProgress"
            slot="icon"
            role="img"
            aria-label="in progress"
            >${unsafeSVG(circleDashIcon)}</span
          >
          <span slot="title"> Accordion Title 1 </span>
          <span slot="subtitle"> Accordion subtitle 1 </span>
          <div slot="body">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </div>
        </kyn-accordion-item>

        <kyn-accordion-item
          @on-toggle=${(e) => action(e.type)({ ...e, detail: e.detail })}
        >
          <span class="complete" slot="icon" role="img" aria-label="complete"
            >${unsafeSVG(checkmarkOutlineIcon)}</span
          >
          <span slot="title"> Accordion Title 2 </span>
          <span slot="subtitle"> Accordion subtitle 2 </span>
          <div slot="body">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </div>
        </kyn-accordion-item>

        <kyn-accordion-item
          @on-toggle=${(e) => action(e.type)({ ...e, detail: e.detail })}
        >
          <span class="error" slot="icon" role="img" aria-label="error"
            >${unsafeSVG(errorFilledIcon)}</span
          >
          <span slot="title"> Accordion Title 3 </span>
          <span slot="subtitle"> Accordion subtitle 3 </span>
          <div slot="body">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </div>
        </kyn-accordion-item>
      </kyn-accordion>
      <style>
        .inProgress {
          svg {
            fill: var(--kd-color-icon-disabled);
          }
        }
        .complete {
          svg {
            fill: var(--kd-color-status-success-dark);
          }
        }
        .error {
          svg {
            fill: var(--kd-color-status-error-dark);
          }
        }
      </style>
    `;
  },
};

export const AccordionWithActions = {
  args: args,
  render: (args) => {
    return html`
      <kyn-accordion
        ?filledHeaders="${args.filledHeaders}"
        ?compact="${args.compact}"
        ?showNumbers="${args.showNumbers}"
        startNumber="${args.startNumber}"
        expandLabel="${args.expandLabel}"
        collapseLabel="${args.collapseLabel}"
        togglePosition="${args.togglePosition}"
      >
        <kyn-accordion-item
          opened
          @on-toggle=${(e) => action(e.type)({ ...e, detail: e.detail })}
        >
          <span slot="title"> Accordion Title 1 </span>
          <span slot="subtitle"> Accordion subtitle 1 </span>
          <div slot="overflowmenu">
            <kyn-overflow-menu anchorRight>
              <kyn-overflow-menu-item
                @on-click=${(e) => console.log('Action 1 clicked')}
                >Action 1</kyn-overflow-menu-item
              >
              <kyn-overflow-menu-item
                @on-click=${(e) => action(e.type)({ ...e, detail: e.detail })}
                >Action 2</kyn-overflow-menu-item
              >
            </kyn-overflow-menu>
          </div>
          <div slot="body">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </div>
        </kyn-accordion-item>

        <kyn-accordion-item
          @on-toggle=${(e) => action(e.type)({ ...e, detail: e.detail })}
        >
          <span slot="title"> Accordion Title 2 </span>
          <span slot="subtitle"> Accordion subtitle 2 </span>
          <div slot="body">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </div>
        </kyn-accordion-item>

        <kyn-accordion-item
          disabled
          @on-toggle=${(e) => action(e.type)({ ...e, detail: e.detail })}
        >
          <span slot="title"> Accordion Title 3 </span>
          <span slot="subtitle"> Accordion subtitle 3 </span>
          <div slot="overflowmenu">
            <kyn-overflow-menu anchorRight disabled>
              <kyn-overflow-menu-item
                @on-click=${(e) => console.log('Action 1 clicked')}
                >Action 1</kyn-overflow-menu-item
              >
              <kyn-overflow-menu-item
                @on-click=${(e) => action(e.type)({ ...e, detail: e.detail })}
                >Action 2</kyn-overflow-menu-item
              >
            </kyn-overflow-menu>
          </div>
          <div slot="body">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </div>
        </kyn-accordion-item>
      </kyn-accordion>
    `;
  },
};
