import { html } from 'lit';
import '@kyndryl-design-system/shidoka-foundation/css/grid.css';
import './index';
import { action } from '@storybook/addon-actions';
import './card.sample';

export default {
  title: 'Components/Card',
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
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/5TqtPa7KWfhJbQv6ELnbqf/Foundation---Component-Library?node-id=5842%3A4589&mode=dev',
    },
  },
};

export const BlankCard = {
  args: {
    type: 'normal',
    href: '',
    rel: '',
    target: '_self',
    hideBorder: false,
  },
  render: (args) => {
    return html` <kyn-card
      type=${args.type}
      href=${args.href}
      target=${args.target}
      rel=${args.rel}
      role="article"
      ?hideBorder=${args.hideBorder}
      aria-label="Blank card"
    ></kyn-card>`;
  },
};

export const Simple = {
  args: {
    type: 'normal',
    href: '',
    rel: '',
    target: '_self',
    hideBorder: false,
  },
  render: (args) => {
    return html`
      <kyn-card
        type=${args.type}
        href=${args.href}
        target=${args.target}
        rel=${args.rel}
        ?hideBorder=${args.hideBorder}
        role="article"
        aria-label="Simple card"
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

export const Clickable = {
  args: {
    type: 'clickable',
    href: 'https://www.kyndryl.com',
    rel: 'noopener',
    target: '_blank',
    hideBorder: false,
  },
  render: (args) => {
    return html`
      <kyn-card
        type=${args.type}
        href=${args.href}
        target=${args.target}
        rel=${args.rel}
        ?hideBorder=${args.hideBorder}
        role="link"
        aria-label="Clickable card"
        @on-card-click=${(e) => action(e.type)(e)}
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
    href: '',
    rel: '',
    target: '_self',
    hideBorder: false,
  },
  render: (args) => {
    return html`
      <div class="kd-grid">
        <div class="kd-grid__col--sm-2 kd-grid__col--md-4 kd-grid__col--lg-3">
          <kyn-card
            style="width:100%;height:100%;"
            type=${args.type}
            href=${args.href}
            target=${args.target}
            rel=${args.rel}
            ?hideBorder=${args.hideBorder}
          >
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
          <kyn-card
            style="width:100%;height:100%;"
            type=${args.type}
            href=${args.href}
            target=${args.target}
            rel=${args.rel}
            ?hideBorder=${args.hideBorder}
          >
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
          <kyn-card
            style="width:100%;height:100%;"
            type=${args.type}
            href=${args.href}
            target=${args.target}
            rel=${args.rel}
            ?hideBorder=${args.hideBorder}
          >
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
          <kyn-card
            style="width:100%;height:100%;"
            type=${args.type}
            href=${args.href}
            target=${args.target}
            rel=${args.rel}
            ?hideBorder=${args.hideBorder}
          >
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
