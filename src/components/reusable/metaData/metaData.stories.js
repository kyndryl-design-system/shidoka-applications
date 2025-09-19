import { html } from 'lit';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import smCube from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/cube.svg';
import './index';

export default {
  title: 'Components/Meta Data',
  component: 'kyn-meta-data',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/qyPEUQckxj8LUgesi1OEES/Component-Library?node-id=39511-307374&m=dev',
    },
  },
};

const args = {
  labelText: '',
  horizontal: false,
  showIcon: true,
  showLabel: true,
  showValue: true,
};

export const MetaData = {
  args: {
    ...args,
    labelText:
      'I am very Long title text that should be truncated if it exceeds the container width',
  },
  render: (args) => {
    return html`
      <div style="max-width: 500px;">
        <kyn-meta-data
          ?horizontal=${args.horizontal}
          labelText=${args.labelText}
          ?showIcon=${args.showIcon}
          ?showLabel=${args.showLabel}
          ?showValue=${args.showValue}
        >
          <div class="example">
            <div class="cube-icon" style="color:var(--kd-color-icon-brand);">
              ${unsafeSVG(smCube)}
            </div>
            <span class="kd-type--ui-02 kd-type--weight-medium">Slot</span>
          </div>
        </kyn-meta-data>
      </div>
      <style>
        .example {
          flex-grow: 1;
          display: flex;
          align-items: center;
          gap: 4px;
          justify-content: center;
          height: 31px;
          border-radius: 4px;
          padding: 4px;
          background: var(--kd-color-background-container-subtle);
          border: 1px dashed var(--kd-color-utility-variant-border);
          .cube-icon {
            display: flex;
            color: var(--kd-color-icon-brand);

            svg {
              height: 23px;
              width: 23px;
            }
          }
        }
      </style>
    `;
  },
};

export const OtherContent = {
  args: { ...args, labelText: 'Label' },
  render: (args) => {
    return html`
      <div style="max-width: 500px;">
        <kyn-meta-data
          ?horizontal=${args.horizontal}
          labelText=${args.labelText}
          ?showIcon=${args.showIcon}
          ?showLabel=${args.showLabel}
          ?showValue=${args.showValue}
        >
          <div
            style="color: var(--kd-color-text-level-secondary);line-height: 18px;"
            class="kd-type--body-02 example-content"
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum Lorem ipsum dolor sit
            amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
            ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
            nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
            consequat. Duis aute irure dolor in reprehenderit in voluptate velit
            esse cillum
          </div>
        </kyn-meta-data>
      </div>
      <style>
        .example-content {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          border-radius: 4px;
        }
      </style>
    `;
  },
};

export const ScrollableContent = {
  args: { ...args, labelText: 'Label' },
  render: (args) => {
    return html`
      <div style="max-width: 500px;">
        <kyn-meta-data
          ?horizontal=${args.horizontal}
          labelText=${args.labelText}
          ?showIcon=${args.showIcon}
          ?showLabel=${args.showLabel}
          ?showValue=${args.showValue}
          scrollableContent
          style="height: 150px;"
        >
          <div
            style="color: var(--kd-color-text-level-secondary);line-height: 18px;"
            class="kd-type--body-02 example-content"
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum Lorem ipsum dolor sit
            amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
            ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
            nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
            consequat. Duis aute irure dolor in reprehenderit in voluptate velit
            esse cillum
          </div>
        </kyn-meta-data>
      </div>
    `;
  },
};

export const truncatedTextContent = {
  args: { ...args, labelText: 'Label' },
  render: (args) => {
    return html`
      <kyn-meta-data
        ?horizontal=${args.horizontal}
        labelText=${args.labelText}
        ?showIcon=${args.showIcon}
        ?showLabel=${args.showLabel}
        ?showValue=${args.showValue}
        truncateContent
      >
        <div
          style="color: var(--kd-color-text-level-secondary);line-height: 18px;overflow: hidden; text-overflow: ellipsis;"
          class="kd-type--body-02"
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum Lorem ipsum dolor sit
          amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
          labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
          exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
        </div>
      </kyn-meta-data>
    `;
  },
};
