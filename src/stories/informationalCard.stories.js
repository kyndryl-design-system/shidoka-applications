import { html } from 'lit';
import '@kyndryl-design-system/shidoka-foundation/css/grid.css';
import '@kyndryl-design-system/shidoka-foundation/components/card';

import { action } from '@storybook/addon-actions';

import './sampleCardComponents/card.sample.ts';
import './sampleCardComponents/card.content.sample.ts';
import './skeleton-patterns/informationalCard.skeleton.sample.ts';

export default {
  title: 'Patterns/Informational Card',
};

export const Simple = {
  render: () => {
    return html`
      <kd-card type="normal" href="" target="" rel="">
        <sample-card-story-component>
          <div slot="title">This is a card title</div>
          <div slot="description">
            Amazon EC2 Auto Scaling ensures that your application always has the
            right amount of compute capacity by dynamically adjusting the number
            of Amazon EC2 instances based on demand.
          </div>
        </sample-card-story-component>
      </kd-card>

      <br /><br />
      <a
        href="https://github.com/kyndryl-design-system/shidoka-applications/blob/main/src/stories/sampleCardComponents/card.sample.ts"
        target="_blank"
        rel="noopener"
      >
        See the full example component code here.
      </a>
    `;
  },
};

export const WithOtherContents = {
  render: () => {
    return html`
      <kd-card type="normal" href="" target="" rel="">
        <sample-card-story-content-component></sample-card-story-content-component>
      </kd-card>

      <br /><br />
      <a
        href="https://github.com/kyndryl-design-system/shidoka-applications/blob/main/src/stories/sampleCardComponents/card.content.sample.ts"
        target="_blank"
        rel="noopener"
      >
        See the full example component code here.
      </a>
    `;
  },
};

export const Clickable = {
  render: () => {
    return html`
      <kd-card
        type="clickable"
        href="https://www.kyndryl.com"
        target="_blank"
        rel=""
        @on-card-click=${(e) => action(e.type)(e)}
      >
        <sample-card-story-component>
          <div slot="title">This is a card title</div>
          <div slot="description">
            Amazon EC2 Auto Scaling ensures that your application always has the
            right amount of compute capacity by dynamically adjusting the number
            of Amazon EC2 instances based on demand.
          </div>
        </sample-card-story-component>
      </kd-card>

      <br /><br />
      <a
        href="https://github.com/kyndryl-design-system/shidoka-applications/blob/main/src/stories/sampleCardComponents/card.sample.ts"
        target="_blank"
        rel="noopener"
      >
        See the full example component code here.
      </a>
    `;
  },
};

export const InsideGrid = {
  render: () => {
    return html`
      <div class="kd-grid">
        <div class="kd-grid__col--sm-2 kd-grid__col--md-4 kd-grid__col--lg-3">
          <kd-card style="width:100%;height:100%;">
            <sample-card-story-component>
              <div slot="title">This is a card title</div>
              <div slot="description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris.
              </div>
            </sample-card-story-component>
          </kd-card>
        </div>
        <div class="kd-grid__col--sm-2 kd-grid__col--md-4 kd-grid__col--lg-3">
          <kd-card style="width:100%;height:100%;">
            <sample-card-story-component>
              <div slot="title">This is a card title</div>
              <div slot="description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum
              </div>
            </sample-card-story-component>
          </kd-card>
        </div>
        <div class="kd-grid__col--sm-2 kd-grid__col--md-4 kd-grid__col--lg-3">
          <kd-card style="width:100%;height:100%;">
            <sample-card-story-component>
              <div slot="title">This is a card title</div>
              <div slot="description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor.
              </div>
            </sample-card-story-component>
          </kd-card>
        </div>
        <div class="kd-grid__col--sm-2 kd-grid__col--md-4 kd-grid__col--lg-3">
          <kd-card style="width:100%;height:100%;">
            <sample-card-story-component>
              <div slot="title">This is a card title</div>
              <div slot="description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur.
              </div>
            </sample-card-story-component>
          </kd-card>
        </div>
      </div>

      <br /><br />
      <a
        href="https://github.com/kyndryl-design-system/shidoka-applications/blob/main/src/stories/sampleCardComponents/card.sample.ts"
        target="_blank"
        rel="noopener"
      >
        See the full example component code here.
      </a>
    `;
  },
};

export const SkeletonSimple = {
  render: () => {
    return html` <kd-card type="normal" href="" target="" rel="">
      <info-card-skeleton-sample .lines=${1}></info-card-skeleton-sample>
    </kd-card>`;
  },
};

export const SkeletonWithThumbnail = {
  render: () => {
    return html` <kd-card type="normal" href="" target="" rel="">
      <info-card-skeleton-sample
        .lines=${1}
        ?thumbnailExample=${true}
      ></info-card-skeleton-sample>
    </kd-card>`;
  },
};
