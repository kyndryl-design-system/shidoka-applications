import { html } from 'lit';
import './index';

import '../card';
import '../metaData';

export default {
  title: 'Components/Divider',
  component: 'kyn-divider',
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
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
    return html` <kyn-card style="width:300px" type="normal">
      <div style="display: flex; flex-direction: column;">
        <kyn-meta-data noBackground>
          <div
            slot="label"
            class="kd-type--ui-02"
            style="color: var(--kd-color-text-level-secondary);"
          >
            Title Text
          </div>
          <div style="color: var(--kd-color-text-level-primary);">
            Value Text here..
          </div>
        </kyn-meta-data>
        <kyn-divider></kyn-divider>
        <kyn-meta-data noBackground>
          <div
            slot="label"
            class="kd-type--ui-02"
            style="color: var(--kd-color-text-level-secondary);"
          >
            Title Text
          </div>
          <div style="color: var(--kd-color-text-level-primary);">
            Value Text here..
          </div>
        </kyn-meta-data>
        <kyn-divider></kyn-divider>
        <kyn-meta-data noBackground>
          <div
            slot="label"
            class="kd-type--ui-02"
            style="color: var(--kd-color-text-level-secondary);"
          >
            Title Text
          </div>
          <div style="color: var(--kd-color-text-level-primary);">
            Value Text here..
          </div>
        </kyn-meta-data>
      </div>
    </kyn-card>`;
  },
};

export const WithOtherContent = {
  render: () => {
    return html` <kyn-card style="width:300px" type="normal">
      <div style="display: flex; flex-direction: column;">
        <kyn-meta-data noBackground>
          <div
            slot="label"
            class="kd-type--ui-02"
            style="color: var(--kd-color-text-level-secondary);"
          >
            Title Text
          </div>
          <div style="color: var(--kd-color-text-level-primary);">
            Value Text here..
          </div>
        </kyn-meta-data>
        <kyn-divider></kyn-divider>
        <kyn-meta-data noBackground>
          <div
            slot="label"
            class="kd-type--ui-02"
            style="color: var(--kd-color-text-level-secondary);"
          >
            Title Text
          </div>
          <div style="color: var(--kd-color-text-level-primary);">
            Value Text here..
          </div>
        </kyn-meta-data>
        <kyn-divider></kyn-divider>
        <kyn-meta-data noBackground>
          <div
            slot="label"
            class="kd-type--ui-02"
            style="color: var(--kd-color-text-level-secondary);"
          >
            Title Text
          </div>
          <div style="color: var(--kd-color-text-level-primary);">
            Value Text here..
          </div>
        </kyn-meta-data>
      </div>
    </kyn-card>`;
  },
};
