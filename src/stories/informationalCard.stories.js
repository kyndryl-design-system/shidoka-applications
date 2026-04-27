import { html } from 'lit';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import '../components/reusable/card';
import '../components/reusable/overflowMenu';
import '../components/reusable/tag';

import '../components/reusable/button';

import './sampleCardComponents/card.sample.js';
import './sampleCardComponents/card.content.sample.js';

import '@kyndryl-design-system/shidoka-foundation/css/typography.css';
import actionIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/bookmark.svg';

export default {
  title: 'Patterns/Informational Card',
  design: {
    type: 'figma',
    url: 'https://www.figma.com/design/9Q2XfTSxfzTXfNe2Bi8KDS/Component-Viewer?node-id=7-133753&p=f&t=A5tcETiCf23sAgKK-0',
  },
};

const args = {
  type: 'normal',
  href: '',
  rel: '',
  target: '_self',
  hideBorder: false,
};

export const Simple = {
  render: () => {
    return html`
      <style>
        .card-logo-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .card-logo {
          width: 32px;
          height: 32px;
        }
        .card-logo-img {
          min-width: 32px;
          min-height: 32px;
          border-radius: 50%;
        }
        .card-title {
          color: var(--kd-color-text-level-primary);
          margin-top: 16px;
          margin-bottom: 16px;
          font-weight: var(--kd-font-weight-medium);
        }
        .card-subtitle {
          color: var(--kd-color-text-level-primary);
          margin-bottom: 16px;
        }
        .card-description {
          color: var(--kd-color-text-level-primary);
          margin-bottom: 16px;
        }
      </style>
      <kyn-card type="normal" href="" target="" rel="">
        <div class="card-logo-container">
          <div class="card-logo">
            <img
              class="card-logo-img"
              src="https://fastly.picsum.photos/id/163/32/32.jpg?hmac=6Ev67xrdofIgcyzhr8G7E_OCYUUziK4DoqoH3XZ4I08"
              alt="product logo"
            />
          </div>
        </div>
        <h1 class="card-title kd-type--ui-01">This is a card title</h1>
        <div class="card-subtitle kd-type--ui-03">This is card subtitle</div>
        <div class="card-description kd-type--ui-02">
          Amazon EC2 Auto Scaling ensures that your application always has the
          right amount of compute capacity by dynamically adjusting the number
          of Amazon EC2 instances based on demand.
        </div>
      </kyn-card>
    `;
  },
};

export const WithOtherContents = {
  render: () => {
    const tagGroupArr = [
      {
        value: '1',
        text: 'Tag 1',
      },
      {
        value: '2',
        text: 'Tag 2',
      },
      {
        value: '3',
        text: 'Tag 3',
      },
      {
        value: '4',
        text: 'Tag 4',
      },
    ];
    return html`
      <style>
        .card-logo-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .card-logo {
          width: 32px;
          height: 32px;
        }
        .card-logo-img {
          min-width: 32px;
          min-height: 32px;
          border-radius: 50%;
        }
        .card-title {
          color: var(--kd-color-text-level-primary);
          margin-top: 16px;
          margin-bottom: 16px;
          font-weight: var(--kd-font-weight-medium);
        }
        .card-subtitle {
          color: var(--kd-color-text-level-primary);
          margin-bottom: 16px;
        }
        .card-description {
          color: var(--kd-color-text-level-primary);
          margin-bottom: 16px;
        }
        .card-actions {
          display: inline-flex;
        }
        .card-action-btn-class {
          display: flex;
          align-items: center;
        }
        .card-thumbnail-img {
          margin-top: 16px;
          border-radius: 8px;
        }
        .card-link {
          text-align: center;
        }
        .card-link-elements {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-evenly;
        }
        .tags {
          margin-bottom: 16px;
        }
      </style>
      <kyn-card type="normal" href="" target="" rel="">
        <div class="card-logo-container">
          <div class="card-logo">
            <img
              class="card-logo-img"
              src="https://fastly.picsum.photos/id/163/32/32.jpg?hmac=6Ev67xrdofIgcyzhr8G7E_OCYUUziK4DoqoH3XZ4I08"
              alt="product logo"
            />
          </div>
          <div class="card-logo-right">
            <div class="card-actions">
              <!-- Example : Card action button -->
              <div class="card-action-btn-class">
                <kyn-button
                  kind="ghost"
                  size="small"
                  iconPosition="center"
                  description="Action"
                  @click=${(e) => e.preventDefault()}
                >
                  <span slot="icon">${unsafeSVG(actionIcon)}</span>
                </kyn-button>
              </div>

              <div class="card-option-wrapper">
                <!-- Example : overflow menu -->
                <!-- Note : Use e.stopPropogation() / e.preventDefault() for any internal clickable elements when card type is 'clickable' to stop bubbling / prevent event -->
                <kyn-overflow-menu @click=${(e) => e.preventDefault()}>
                  <kyn-overflow-menu-item>Option 1</kyn-overflow-menu-item>
                  <kyn-overflow-menu-item>Option 2</kyn-overflow-menu-item>
                </kyn-overflow-menu>
              </div>
            </div>
          </div>
        </div>
        <!-- Example : Card Thumbnail -->
        <img
          class="card-thumbnail-img"
          alt="Card thumbnail"
          src="https://fastly.picsum.photos/id/521/216/128.jpg?hmac=r5KpZKHm2EaJAOKiLrULNwt5HEtevAOPle1qwxV6V3E"
        />

        <h1 class="card-title kd-type--ui-01">This is a card title</h1>
        <div class="card-subtitle kd-type--ui-03">This is card subtitle</div>
        <div class="card-description kd-type--ui-02">
          Amazon EC2 Auto Scaling ensures that your application always has the
          right amount of compute capacity by dynamically adjusting the number
          of Amazon EC2 instances based on demand.
        </div>

        <div class="tags">
          <!-- Example : Tags -->
          <kyn-tag-group>
            ${tagGroupArr.map(
              (tag) =>
                html` <kyn-tag label=${tag.text} tagColor="spruce"></kyn-tag> `
            )}
          </kyn-tag-group>
        </div>

        <!-- Example : Card links -->
        <div class="card-link">
          <div class="card-link-elements">
            <kyn-button
              href="#"
              kind="outline"
              size="small"
              @click=${(e) => e.preventDefault()}
              >Link 1</kyn-button
            >
            <kyn-button
              href="#"
              kind="outline"
              size="small"
              @click=${(e) => e.preventDefault()}
              >Link 2</kyn-button
            >
          </div>
        </div>
      </kyn-card>
    `;
  },
};

export const WithSkeleton = {
  args: { ...args, lines: 2, thumbnailVisible: false },
  render: (args) => {
    return html` <kyn-card
      type=${args.type}
      href=${args.href}
      target=${args.target}
      rel=${args.rel}
      ?hideBorder=${args.hideBorder}
    >
      <kyn-info-card-skeleton
        .lines=${args.lines}
        ?thumbnailVisible=${args.thumbnailVisible}
      ></kyn-info-card-skeleton>
    </kyn-card>`;
  },
};

export const WithThumbnailSkeleton = {
  args: { ...args, lines: 2, thumbnailVisible: true },
  render: (args) => {
    return html` <kyn-card
      type=${args.type}
      href=${args.href}
      target=${args.target}
      rel=${args.rel}
      ?hideBorder=${args.hideBorder}
    >
      <kyn-info-card-skeleton
        .lines=${args.lines}
        ?thumbnailVisible=${args.thumbnailVisible}
      ></kyn-info-card-skeleton>
    </kyn-card>`;
  },
};
