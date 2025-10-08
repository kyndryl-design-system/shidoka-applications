import { html } from 'lit';
import './index';

import '../card';
import '../metaData';
import { LinkWithIcon as Link } from '../link/Link.stories.js';

export default {
  title: 'Components/Divider',
  component: 'kyn-divider',
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
  decorators: [
    (story) => html`
      <style>
        .line_height {
          line-height: 18px;
        }
        .mr-8 {
          margin: 8px 0;
        }
      </style>
      ${story()}
    `,
  ],
};

export const Default = {
  render: () => {
    return html` <kyn-divider></kyn-divider>`;
  },
};

export const Vertical = {
  render: () => {
    return html` <div
      style="display: flex;align-items: center;height: 2rem;gap: 8px;"
    >
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
        <div style="display: flex; flex-direction: column;">
          <kyn-meta-data noBackground>
            <div slot="label" class="kd-type--ui-03 text_label">Title</div>
            <div class="kd-type--ui-02 value_text">Some value here</div>
          </kyn-meta-data>
          <kyn-divider></kyn-divider>
          <kyn-meta-data noBackground>
            <div slot="label" class="kd-type--ui-03 text_label">Title</div>
            <div class="kd-type--ui-02 value_text">Some value here</div>
          </kyn-meta-data>
          <kyn-divider></kyn-divider>
          <kyn-meta-data noBackground>
            <div slot="label" class="kd-type--ui-03 text_label">Title</div>
            <div class="kd-type--ui-02 value_text">Some value here</div>
          </kyn-meta-data>
        </div>
      </kyn-card>
      <style>
        .text_label {
          color: var(--kd-color-text-level-secondary);
        }
        .value_text {
          color: var(--kd-color-text-level-primary);
        }
      </style>
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
            <div class="line_height">
              ${Link.render({ standalone: true, ...Link.args })}
            </div>
          </kyn-meta-data>
        </div>

        <div class="kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-2">
          <kyn-meta-data noBackground>
            <div slot="label">Label</div>
            <div class="line_height">
              ${Link.render({ standalone: true, ...Link.args })}
            </div>
          </kyn-meta-data>
        </div>

        <div class="kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-2">
          <kyn-meta-data noBackground>
            <div slot="label">Label</div>
            <div class="line_height">
              ${Link.render({ standalone: true, ...Link.args })}
            </div>
          </kyn-meta-data>
        </div>

        <div class="kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-2">
          <kyn-meta-data noBackground>
            <div slot="label">Label</div>
            <div class="line_height">
              ${Link.render({ standalone: true, ...Link.args })}
            </div>
          </kyn-meta-data>
        </div>

        <div class="kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-2">
          <kyn-meta-data noBackground>
            <div slot="label">Label</div>
            <div class="line_height">
              ${Link.render({ standalone: true, ...Link.args })}
            </div>
          </kyn-meta-data>
        </div>

        <div class="kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-2">
          <kyn-meta-data noBackground>
            <div slot="label">Label</div>
            <div class="line_height">
              ${Link.render({ standalone: true, ...Link.args })}
            </div>
          </kyn-meta-data>
        </div>
      </div>

      <kyn-divider class="mr-8"></kyn-divider>

      <div class="kd-grid">
        <div class="kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-2">
          <kyn-meta-data noBackground>
            <div slot="label">Label</div>
            <div class="line_height">
              ${Link.render({ standalone: true, ...Link.args })}
            </div>
          </kyn-meta-data>
        </div>

        <div class="kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-2">
          <kyn-meta-data noBackground>
            <div slot="label">Label</div>
            <div class="line_height">
              ${Link.render({ standalone: true, ...Link.args })}
            </div>
          </kyn-meta-data>
        </div>

        <div class="kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-2">
          <kyn-meta-data noBackground>
            <div slot="label">Label</div>
            <div class="line_height">
              ${Link.render({ standalone: true, ...Link.args })}
            </div>
          </kyn-meta-data>
        </div>

        <div class="kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-2">
          <kyn-meta-data noBackground>
            <div slot="label">Label</div>
            <div class="line_height">
              ${Link.render({ standalone: true, ...Link.args })}
            </div>
          </kyn-meta-data>
        </div>
      </div>
      <kyn-divider class="mr-8"></kyn-divider>
    `;
  },
};
