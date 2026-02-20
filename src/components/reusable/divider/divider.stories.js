import { html } from 'lit';
import './index';

import '../card';
import '../metaData';
import { LinkWithIcon as Link } from '../link/Link.stories.js';

export default {
  title: 'Components/Layout & Structure/Divider',
  component: 'kyn-divider',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/9Q2XfTSxfzTXfNe2Bi8KDS/Component-Viewer?node-id=4550-7394&p=f&m=dev',
    },
  },
  decorators: [
    (story) => html`
      <style>
        .v-align {
          display: flex;
          gap: var(--kd-spacing-8);
        }
        .card-container {
          display: flex;
          flex-direction: column;
        }
      </style>
      ${story()}
    `,
  ],
};

export const Default = {
  args: {
    vertical: false,
  },
  render: (args) => {
    return args.vertical
      ? html`
          <div style="height: 100px;" class="v-align">
            <kyn-divider vertical></kyn-divider>
          </div>
        `
      : html` <kyn-divider .vertical=${args.vertical}></kyn-divider> `;
  },
};

export const Vertical = {
  render: () => {
    return html` <div class="v-align">
      One
      <kyn-divider vertical></kyn-divider>
      Two
      <kyn-divider vertical></kyn-divider>
      Three
    </div>`;
  },
};

export const WithCard = {
  render: () => {
    return html`
      <kyn-card style="width:300px" type="normal">
        <div class="card-container">
          <kyn-meta-data noBackground>
            <div slot="label">Title</div>
            <div>Value text</div>
          </kyn-meta-data>
          <kyn-divider></kyn-divider>
          <kyn-meta-data noBackground>
            <div slot="label">Title</div>
            <div>Value text</div>
          </kyn-meta-data>
          <kyn-divider></kyn-divider>
          <kyn-meta-data noBackground>
            <div slot="label">Title</div>
            <div>Value text</div>
          </kyn-meta-data>
        </div>
      </kyn-card>
    `;
  },
};

export const WithFullPage = {
  render: () => {
    return html`
      <div class="kd-grid">
        <div class="kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-2">
          <kyn-meta-data noBackground>
            <div slot="label">Label</div>
            <div>${Link.render({ standalone: true, ...Link.args })}</div>
          </kyn-meta-data>
        </div>

        <div class="kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-2">
          <kyn-meta-data noBackground>
            <div slot="label">Label</div>
            <div>${Link.render({ standalone: true, ...Link.args })}</div>
          </kyn-meta-data>
        </div>

        <div class="kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-2">
          <kyn-meta-data noBackground>
            <div slot="label">Label</div>
            <div>${Link.render({ standalone: true, ...Link.args })}</div>
          </kyn-meta-data>
        </div>

        <div class="kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-2">
          <kyn-meta-data noBackground>
            <div slot="label">Label</div>
            <div>${Link.render({ standalone: true, ...Link.args })}</div>
          </kyn-meta-data>
        </div>

        <div class="kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-2">
          <kyn-meta-data noBackground>
            <div slot="label">Label</div>
            <div>${Link.render({ standalone: true, ...Link.args })}</div>
          </kyn-meta-data>
        </div>

        <div class="kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-2">
          <kyn-meta-data noBackground>
            <div slot="label">Label</div>
            <div>${Link.render({ standalone: true, ...Link.args })}</div>
          </kyn-meta-data>
        </div>
      </div>

      <kyn-divider
        class="kd-spacing--margin-top-24 kd-spacing--margin-bottom-16"
      ></kyn-divider>

      <div class="kd-grid">
        <div class="kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-2">
          <kyn-meta-data noBackground>
            <div slot="label">Label</div>
            <div>${Link.render({ standalone: true, ...Link.args })}</div>
          </kyn-meta-data>
        </div>

        <div class="kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-2">
          <kyn-meta-data noBackground>
            <div slot="label">Label</div>
            <div>${Link.render({ standalone: true, ...Link.args })}</div>
          </kyn-meta-data>
        </div>

        <div class="kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-2">
          <kyn-meta-data noBackground>
            <div slot="label">Label</div>
            <div>${Link.render({ standalone: true, ...Link.args })}</div>
          </kyn-meta-data>
        </div>

        <div class="kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-2">
          <kyn-meta-data noBackground>
            <div slot="label">Label</div>
            <div>${Link.render({ standalone: true, ...Link.args })}</div>
          </kyn-meta-data>
        </div>
      </div>
      <kyn-divider class="kd-spacing--margin-top-24"></kyn-divider>
    `;
  },
};
