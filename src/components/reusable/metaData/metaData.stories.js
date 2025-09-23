import { html } from 'lit';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import smCube from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/cube.svg';
import testingIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/testing.svg';
import './index';
import { LinkWithIcon as Link } from '../link/Link.stories.js';
import { Badge } from '../badge/badge.stories.js';
import '../table';
import { repeat } from 'lit/directives/repeat.js';
import { characters } from '../table/story-helpers/ultils.sample';

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
        .meta-content {
          width: 100%;
          overflow-x: auto;
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

export const Default = {
  args,
  render: (args) => {
    return html`
      <div style="max-width: 300px;">
        <kyn-meta-data
          ?horizontal=${args.horizontal}
          ?noBackground=${args.noBackground}
        >
          <div slot="label">Label</div>
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

export const WithIcon = {
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
  args: {
    ...args,
  },
  parameters: {
    a11y: {
      disable: true,
    },
  },
  render: (args) => {
    return html`
      <kyn-meta-data
        ?horizontal=${args.horizontal}
        ?noBackground=${args.noBackground}
      >
        <div slot="label">Label</div>
        <div slot="icon">${unsafeSVG(testingIcon)}</div>
        <div class="meta-content">
          <kyn-table>
            <kyn-thead>
              <kyn-header-tr>
                <kyn-th .align=${'center'}>ID</kyn-th>
                <kyn-th>First Name</kyn-th>
                <kyn-th>Last Name</kyn-th>
                <kyn-th>Birthday</kyn-th>
                <kyn-th .align=${'right'}>Age</kyn-th>
                <kyn-th>Full Name</kyn-th>
              </kyn-header-tr>
            </kyn-thead>
            <kyn-tbody>
              ${repeat(
                characters,
                (row) => row.id,
                (row) => html`
                  <kyn-tr .rowId=${String(row.id)} key="row-${row.id}">
                    <kyn-td .align=${'center'}>${row.id}</kyn-td>
                    <kyn-td>${row.firstName}</kyn-td>
                    <kyn-td>${row.lastName}</kyn-td>
                    <kyn-td>${row.birthday}</kyn-td>
                    <kyn-td .align=${'right'}>${row.age}</kyn-td>
                    <kyn-td>${row.firstName} ${row.lastName}</kyn-td>
                  </kyn-tr>
                `
              )}
            </kyn-tbody>
          </kyn-table>
        </div>
      </kyn-meta-data>
    `;
  },
};

export const ScrollableContent = {
  args: {
    ...args,
  },
  parameters: {
    a11y: {
      disable: true,
    },
  },
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

export const StaticGrid = {
  args: {
    ...args,
  },
  parameters: {
    a11y: {
      disable: true,
    },
  },
  render: (args) => {
    return html`
      This example uses
      <a
        href="https://shidoka-foundation.netlify.app/?path=/docs/foundation-grid--docs"
        target="_blank"
        rel="noopener"
      >
        Shidoka Foundation Grid
      </a>
      for a static dashboard layout.
      <br /><br />

      <div class="kd-grid">
        <div class="kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-3">
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

        <div class="kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-3">
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

        <div class="kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-3">
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

        <div class="kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-3">
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
      </div>

      <div class="kd-grid" style="margin-top: 32px;">
        <div class="kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-3">
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

        <div class="kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-3">
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

        <div class="kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-3">
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

        <div class="kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-3">
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
      </div>

      <div class="kd-grid" style="margin-top: 32px;">
        <div class="kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-6">
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
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum Lorem ipsum dolor sit
              amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim
              veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
              ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
              voluptate velit esse cillum
            </div>
          </kyn-meta-data>
        </div>

        <div class="kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-6">
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
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum Lorem ipsum dolor sit
              amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim
              veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
              ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
              voluptate velit esse cillum
            </div>
          </kyn-meta-data>
        </div>
      </div>

      <div class="kd-grid" style="margin-top: 32px;">
        <div class="kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-12">
          <kyn-meta-data
            ?horizontal=${args.horizontal}
            ?noBackground=${args.noBackground}
          >
            <div slot="label">Label</div>
            <div
              class="line_height"
              style="color: var(--kd-color-text-level-secondary);font-size: 14px;
          border-radius: 4px;"
            >
              Mauris aliquet elementum dui, a mattis ligula feugiat eu. Ut
              ullamcorper orci lacus, ac efficitur quam tincidunt sit amet.
              Aenean magna ante, pretium non iaculis.
            </div>
          </kyn-meta-data>
        </div>
      </div>

      <div class="kd-grid" style="margin-top: 32px;">
        <div class="kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-6">
          ${WithTable.render({
            ...WithTable.args,
            horizontal: args.horizontal,
          })}
        </div>

        <div class="kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-6">
          ${WithTable.render({
            ...WithTable.args,
            horizontal: args.horizontal,
          })}
        </div>
      </div>
    `;
  },
};
