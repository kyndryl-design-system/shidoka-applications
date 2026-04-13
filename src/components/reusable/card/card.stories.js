import { html } from 'lit';
import './index';
import { action } from 'storybook/actions';
import '@kyndryl-design-system/shidoka-foundation/css/typography.css';
import './card.sample';

export default {
  title: 'Components/Layout & Structure/Card',
  component: 'kyn-card',
  argTypes: {
    type: {
      options: ['normal', 'clickable'],
      control: { type: 'select' },
    },
    target: {
      options: ['_self', '_blank', '_top', '_parent'],
      control: { type: 'select' },
    },
    variant: {
      options: ['default', 'notification', 'interaction'],
      control: { type: 'select' },
    },
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/9Q2XfTSxfzTXfNe2Bi8KDS/Component-Viewer?node-id=1-371547&p=f&m=dev',
    },
  },
};

export const BlankCard = {
  args: {
    type: 'normal',
  },

  render: (args) => {
    return html` <kyn-card
      type="normal"
      role="article"
      aria-label="Blank card"
    ></kyn-card>`;
  },
};

export const Simple = {
  args: {
    type: 'normal',
  },
  render: (args) => {
    return html`
      <kyn-card type=${args.type} role="article" aria-label="Simple card">
        <sample-card-component>
          <div slot="title">This is a card title</div>
          <div slot="description">
            Amazon EC2 Auto Scaling ensures that your application always has the
            right amount of compute capacity by dynamically adjusting the number
            of Amazon EC2 instances based on demand.
          </div>
        </sample-card-component>
      </kyn-card>
    `;
  },
};

export const Clickable = {
  args: {
    type: 'clickable',
    href: 'https://www.kyndryl.com',
    rel: 'noopener',
    target: '_blank',
  },
  render: (args) => {
    return html`
      <kyn-card
        type=${args.type}
        href=${args.href}
        target=${args.target}
        rel=${args.rel}
        role="link"
        aria-label="Clickable card"
        @on-card-click=${(e) => action(e.type)({ ...e, detail: e.detail })}
      >
        <sample-card-component>
          <div slot="title">This is a card title</div>
          <div slot="description">
            Amazon EC2 Auto Scaling ensures that your application always has the
            right amount of compute capacity by dynamically adjusting the number
            of Amazon EC2 instances based on demand.
          </div>
        </sample-card-component>
      </kyn-card>
    `;
  },
};

export const InsideGrid = {
  args: {
    type: 'normal',
  },
  render: (args) => {
    return html`
      <div class="kd-grid">
        <div class="kd-grid__col--sm-2 kd-grid__col--md-4 kd-grid__col--lg-3">
          <kyn-card style="width:100%;height:100%;" type=${args.type}>
            <sample-card-component>
              <div slot="title">This is a card title</div>
              <div slot="description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris.
              </div>
            </sample-card-component>
          </kyn-card>
        </div>
        <div class="kd-grid__col--sm-2 kd-grid__col--md-4 kd-grid__col--lg-3">
          <kyn-card style="width:100%;height:100%;" type=${args.type}>
            <sample-card-component>
              <div slot="title">This is a card title</div>
              <div slot="description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum
              </div>
            </sample-card-component>
          </kyn-card>
        </div>
        <div class="kd-grid__col--sm-2 kd-grid__col--md-4 kd-grid__col--lg-3">
          <kyn-card style="width:100%;height:100%;" type=${args.type}>
            <sample-card-component>
              <div slot="title">This is a card title</div>
              <div slot="description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor.
              </div>
            </sample-card-component>
          </kyn-card>
        </div>
        <div class="kd-grid__col--sm-2 kd-grid__col--md-4 kd-grid__col--lg-3">
          <kyn-card style="width:100%;height:100%;" type=${args.type}>
            <sample-card-component>
              <div slot="title">This is a card title</div>
              <div slot="description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur.
              </div>
            </sample-card-component>
          </kyn-card>
        </div>
      </div>
    `;
  },
};

export const AIConnected = {
  args: {
    type: 'normal',
    aiConnected: true,
  },
  render: (args) => {
    return html`
      <kyn-card
        type=${args.type}
        ?aiConnected=${args.aiConnected}
        role="article"
        aria-label="Simple card"
      >
        <sample-card-component>
          <div slot="title">This is a card title</div>
          <div slot="description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor.
          </div>
        </sample-card-component>
      </kyn-card>
    `;
  },
};

export const Playground = {
  args: {
    type: 'normal',
    href: '',
    rel: '',
    target: '_self',
    hideBorder: false,
    variant: 'default',
    compact: false,
    aiConnected: false,
    highlight: false,
  },
  render: (args) => {
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
          margin-top: 16px;
          margin-bottom: 16px;
          font-weight: var(--kd-font-weight-medium);
        }
        .card-subtitle {
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
      </style>
      <kyn-card
        type=${args.type}
        href=${args.href}
        rel=${args.rel}
        target=${args.target}
        ?hideBorder=${args.hideBorder}
        variant=${args.variant}
        ?compact=${args.compact}
        ?aiConnected=${args.aiConnected}
        ?highlight=${args.highlight}
        role="article"
        aria-label="Simple card"
      >
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
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </div>
      </kyn-card>
    `;
  },
};
