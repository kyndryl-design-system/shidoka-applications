import { html } from 'lit';
import '@kyndryl-design-system/shidoka-foundation/css/grid.css';
import '../components/reusable/card';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import './sampleCardComponents/aiInfoCard.ts';
import policeIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/24/police.svg';
import deleteIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/24/delete.svg';
import '../components/reusable/tooltip';
import '../components/reusable/button';

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
      <kyn-card type="normal" ?aiConnected=${true}>
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
    `;
  },
};

export const WithoutTitle = {
  render: () => {
    return html`
      <kyn-card type="normal" ?aiConnected=${true}>
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
          <div slot="rightIcon"><kyn-tooltip>Tooltip content</kyn-tooltip></div>
        </ai-info-card-component>
      </kyn-card>
    `;
  },
};

export const WithAction = {
  render: () => {
    return html`
      <kyn-card type="normal" ?aiConnected=${true}>
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
          <div slot="rightIcon">
            <kyn-button
              iconposition="center"
              kind="primary-app"
              type="button"
              size="small"
              description="Button Description"
              href=""
              name=""
              value=""
              ?ghost=${true}
              ?aiConnected=${true}
            >
              <span style="display:flex;" slot="icon"
                >${unsafeSVG(deleteIcon)}</span
              >
            </kyn-button>
          </div>
        </ai-info-card-component>
      </kyn-card>
    `;
  },
};
