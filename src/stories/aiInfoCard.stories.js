import { html } from 'lit';
import '@kyndryl-design-system/shidoka-foundation/css/grid.css';
import '../components/reusable/card';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import './sampleCardComponents/aiInfoCard.ts';
import policeIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/24/police.svg';
import deleteIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/24/delete.svg';
import '../components/reusable/tooltip';
import '../components/reusable/link';

export default {
  title: 'AI Section/Patterns/Info',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/qyPEUQckxj8LUgesi1OEES/Component-Library-2.0?node-id=25977-942236&m=dev',
    },
  },
};

const args = {
  showLeftIcon: true,
  showTitle: true,
  showRightIcon: true,
};

export const Default = {
  args,
  render: (args) => {
    return html`
      <kyn-card style="width:80%" type="normal" ?aiConnected=${true}>
        <ai-info-card-component
          ?showLeftIcon=${args.showLeftIcon}
          ?showTitle=${args.showTitle}
          ?showRightIcon=${args.showRightIcon}
        >
          <div slot="leftIcon">${unsafeSVG(policeIcon)}</div>
          <div slot="title">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit
          </div>
          <div slot="subText">
            Duis aute irure dolor in reprehenderit in voluptate velit esse
            cillum
          </div>
          <div slot="rightIcon"><kyn-tooltip>Tooltip content</kyn-tooltip></div>
        </ai-info-card-component>
      </kyn-card>
    `;
  },
};

export const WithAction = {
  args: { ...args },
  render: (args) => {
    return html`
      <style>
        .card {
          width: 80%;
        }

        .btn {
          background-color: transparent;
          border: none;
          cursor: pointer;
        }
        .btn :hover {
          background: var(--kd-color-background-menu-state-hover);
          color: var(--kd-color-text-button-dark-primary);
          border-radius: 4px;
          transition: background-color 150msease-out, color 150msease-out,
            outline-color 150msease-out;
        }
      </style>
      <kyn-card style="width:80%" type="normal" ?aiConnected=${true}>
        <ai-info-card-component
          ?showLeftIcon=${args.showLeftIcon}
          ?showTitle=${args.showTitle}
          ?showRightIcon=${args.showRightIcon}
        >
          <div slot="leftIcon">${unsafeSVG(policeIcon)}</div>
          <div slot="title">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit
          </div>
          <div slot="subText">
            Duis aute irure dolor in reprehenderit in voluptate velit esse
            cillum
          </div>
          <div slot="rightIcon">
            <button
              class="btn"
              aria-label="Toggle Delete"
              title="Toggle Delete"
              @click=${(e) => console.log(e)}
            >
              <span>${unsafeSVG(deleteIcon)}</span>
            </button>
          </div>
        </ai-info-card-component>
      </kyn-card>
    `;
  },
};

export const Multiple = {
  render: () => {
    return html`
      <style>
        .card {
          width: 80%;
          margin-bottom: 32px;
        }
      </style>
      <kyn-card class="card" type="normal" ?aiConnected=${true}>
        <ai-info-card-component
          ?showLeftIcon=${true}
          ?showTitle=${true}
          ?showRightIcon=${true}
        >
          <div slot="leftIcon">${unsafeSVG(policeIcon)}</div>
          <div slot="title">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit
          </div>
          <div slot="subText">
            Duis aute irure dolor in reprehenderit in voluptate velit esse
            cillum
          </div>
          <div slot="rightIcon"><kyn-tooltip>Tooltip content</kyn-tooltip></div>
        </ai-info-card-component>
      </kyn-card>
      ${Array.from({ length: 2 }).map(
        () => html`
          <kyn-card class="card" type="normal" ?aiConnected=${true}>
            <ai-info-card-component
              ?showLeftIcon=${true}
              ?showTitle=${false}
              ?showRightIcon=${true}
            >
              <div slot="leftIcon">${unsafeSVG(policeIcon)}</div>
              <div slot="title">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit
              </div>
              <div slot="subText">
                Duis aute irure dolor in reprehenderit in voluptate velit esse
                cillum
              </div>
              <div slot="rightIcon">
                <kyn-tooltip>Tooltip content</kyn-tooltip>
              </div>
            </ai-info-card-component>
          </kyn-card>
        `
      )}
    `;
  },
};
