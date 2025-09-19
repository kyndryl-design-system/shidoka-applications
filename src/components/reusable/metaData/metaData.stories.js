import { html } from 'lit';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import smCube from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/cube.svg';
import './index';

export default {
  title: 'Components/Meta Data',
  component: 'kyn-meta-data',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/qyPEUQckxj8LUgesi1OEES/Component-Library?node-id=39504-5898&m=dev',
    },
  },
};

const args = {
  labelText:
    'Label/Title Label/Title Label/Title Label/Title Label/Title Label/Title Label/Title Label/Title',
  vertical: true,
  showIcon: true,
  showLabel: true,
  showValue: true,
};

export const MetaData = {
  args,
  render: (args) => {
    return html`
      <!-- <div style="max-width: 500px;"> -->
      <kyn-meta-data
        ?vertical=${args.vertical}
        labelText=${args.labelText}
        ?showIcon=${args.showIcon}
        ?showLabel=${args.showLabel}
        ?showValue=${args.showValue}
      >
        <div class="example">
          <div class="cube-icon" style="color:var(--kd-color-icon-brand);">
            ${unsafeSVG(smCube)}<span
              style="    color: var(--kd-color-text-level-primary);"
              class="kd-type--ui-01 kd-type--weight-medium"
            >
              Slot Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
              do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum Lorem ipsum dolor sit
              amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim
              veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
              ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
              voluptate velit esse cillum</span
            >
          </div>
        </div>
      </kyn-meta-data>
      <!-- </div> -->
      <style>
        .example {
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--kd-color-background-container-subtle);
          border: 1px dashed var(--kd-color-utility-variant-border);
          border-radius: 4px;
          width: 100%;
        }
      </style>
    `;
  },
};
