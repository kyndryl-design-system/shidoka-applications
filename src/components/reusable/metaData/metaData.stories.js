import { html } from 'lit';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import smCube from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/cube.svg';
import testingIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/testing.svg';
import './index';
import { LinkWithIcon as Link } from '../link/Link.stories.js';
import { Badge } from '../badge/badge.stories.js';

export default {
  title: 'Components/Meta Data',
  component: 'kyn-meta-data',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/qyPEUQckxj8LUgesi1OEES/Component-Library?node-id=39511-307374&m=dev',
    },
  },
  decorators: [
    (story) => html`
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
        .example-content {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          border-radius: 4px;
        }
        .line_height {
          line-height: 18px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }

        td {
          padding: 16px;
          text-align: left;
        }

        tr:not(:first-child) td {
          border-top: 1px solid var(--kd-color-border-level-tertiary);
        }
      </style>
      ${story()}
    `,
  ],
};

const args = {
  horizontal: false,
  noBackground: false,
};

export const MetaData = {
  args,
  render: (args) => {
    return html`
      <div style="max-width: 300px;">
        <kyn-meta-data
          ?horizontal=${args.horizontal}
          ?noBackground=${args.noBackground}
        >
          <div slot="label">Label</div>
          <div slot="icon">${unsafeSVG(testingIcon)}</div>
          <div class="example">
            <div class="cube-icon" style="color:var(--kd-color-icon-brand);">
              ${unsafeSVG(smCube)}
            </div>
            <span class="kd-type--ui-02 kd-type--weight-medium">Slot</span>
          </div>
        </kyn-meta-data>
      </div>
    `;
  },
};

export const WithText = {
  args,
  render: (args) => {
    return html`
      <div style="max-width: 300px;">
        <kyn-meta-data
          ?horizontal=${args.horizontal}
          ?noBackground=${args.noBackground}
        >
          <div slot="label">Label</div>
          <div
            style="color: var(--kd-color-text-level-secondary);"
            class="example-content line_height"
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam
          </div>
        </kyn-meta-data>
      </div>
    `;
  },
};

export const WithLink = {
  args,
  render: (args) => {
    return html`
      <div style="max-width: 300px;">
        <kyn-meta-data
          ?horizontal=${args.horizontal}
          ?noBackground=${args.noBackground}
        >
          <div slot="label">Label</div>
          <div class="line_height">
            ${Link.render({ standalone: true, ...Link.args })}
          </div>
        </kyn-meta-data>
      </div>
    `;
  },
};

export const WithDate = {
  args,
  render: (args) => {
    return html`
      <div style="max-width: 300px;">
        <kyn-meta-data
          ?horizontal=${args.horizontal}
          ?noBackground=${args.noBackground}
        >
          <div slot="label">Label</div>
          <div class="line_height">09/18/2025</div>
        </kyn-meta-data>
      </div>
    `;
  },
};

export const WithBadge = {
  args,
  render: (args) => {
    return html`
      <div style="max-width: 300px;">
        <kyn-meta-data
          ?horizontal=${args.horizontal}
          ?noBackground=${args.noBackground}
        >
          <div slot="label">Label</div>
          <div style="line-height: 18px;">
            ${Badge.render({
              ...Badge.args,
              status: 'success',
              label: 'Badge Label',
            })}
          </div>
        </kyn-meta-data>
      </div>
    `;
  },
};

export const WithTable = {
  args,
  render: (args) => {
    return html`
      <div style="max-width: 100%">
        <h4>With Table</h4>
        <br />
        <kyn-meta-data
          ?horizontal=${args.horizontal}
          ?noBackground=${args.noBackground}
        >
          <div slot="label">Label</div>
          <div slot="icon">${unsafeSVG(testingIcon)}</div>
          <table style="background: var(--kd-color-background-table-row);">
            <tr>
              <td>First Name</td>
              <td>Arya</td>
            </tr>
            <tr>
              <td>Last Name</td>
              <td>Stark</td>
            </tr>
            <tr>
              <td>Birthday</td>
              <td>February 15</td>
            </tr>
            <tr>
              <td>Age</td>
              <td>15</td>
            </tr>
            <tr>
              <td>Full Name</td>
              <td>Arya Stark</td>
            </tr>
            <tr>
              <td>Gender</td>
              <td>Female</td>
            </tr>
            <tr>
              <td>Email</td>
              <td>arya.stark@winterfell.com</td>
            </tr>
          </table>
        </kyn-meta-data>
      </div>
    `;
  },
};

export const ScrollableContent = {
  args,
  render: (args) => {
    return html`
      <div style="max-width: 500px;">
        <kyn-meta-data
          ?horizontal=${args.horizontal}
          ?noBackground=${args.noBackground}
          scrollableContent
          style="height: 150px;"
        >
          <div slot="label">Label</div>
          <div
            style="color: var(--kd-color-text-level-secondary);line-height: 18px;"
            class="example-content"
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
