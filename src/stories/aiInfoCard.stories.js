import { html } from 'lit';
import '@kyndryl-design-system/shidoka-foundation/css/grid.css';
import '../components/reusable/card';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import './sampleCardComponents/aiInfoCard.ts';
import policeIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/24/police.svg';
import deleteIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/24/delete.svg';
import '../components/reusable/tooltip';
import '../components/reusable/button';
import { action } from '@storybook/addon-actions';

export default {
  title: 'AI/Patterns/Info',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/qyPEUQckxj8LUgesi1OEES/Component-Library-2.0?node-id=25977-942236&m=dev',
    },
  },
};

export const Default = {
  render: () => {
    return html`
      <kyn-card style="width:80%" type="normal" ?aiConnected=${true}>
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
          <kyn-tooltip slot="rightIcon">Tooltip content</kyn-tooltip>>
        </ai-info-card-component>
      </kyn-card>
    `;
  },
};

export const WithoutTitle = {
  render: () => {
    return html`
      <kyn-card style="width:80%" type="normal" ?aiConnected=${true}>
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
          <kyn-tooltip slot="rightIcon">Tooltip content</kyn-tooltip>
        </ai-info-card-component>
      </kyn-card>
    `;
  },
};

export const WithAction = {
  render: () => {
    return html`
      <kyn-card style="width:80%" type="normal" ?aiConnected=${true}>
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
          <kyn-button
            slot="rightIcon"
            iconposition="center"
            kind="ghost"
            type="button"
            size="small"
            description="Button Description"
            @on-click=${(e) => action(e.type)(e)}
          >
            <span style="display:flex;" slot="icon"
              >${unsafeSVG(deleteIcon)}</span
            >
          </kyn-button>
        </ai-info-card-component>
      </kyn-card>
    `;
  },
};
