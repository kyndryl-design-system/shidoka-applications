import { html } from 'lit';
import '@kyndryl-design-system/shidoka-foundation/css/grid.css';
import './index';
import { action } from '@storybook/addon-actions';
import './card.sample';
import './card.content.sample';

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
};

export const Simple = {
  args: {
    type: 'normal',
    href: '',
    rel: '',
    target: '_self',
  },
  render: (args) => {
    return html`
      <kyn-card
        type=${args.type}
        href=${args.href}
        target=${args.target}
        rel=${args.rel}
      >
        <sample-card-component></sample-card-component>
      </kyn-card>
    `;
  },
};

export const WithOtherContents = {
  args: Simple.args,
  render: (args) => {
    return html`<kyn-card
      type=${args.type}
      href=${args.href}
      target=${args.target}
      rel=${args.rel}
    >
      <sample-card-content-component> </sample-card-content-component>
    </kyn-card>`;
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
        @on-card-click=${(e) => action(e.type)(e)}
      >
        <sample-card-component></sample-card-component>
      </kyn-card>
    `;
  },
};

export const InsideGrid = {
  render: () => {
    return html`
      <div class="kd-grid">
        <div class="kd-grid__col--sm-2 kd-grid__col--md-3 kd-grid__col--lg-3">
          <kyn-card style="width:100%;">
            <sample-card-component></sample-card-component>
          </kyn-card>
        </div>
        <div class="kd-grid__col--sm-2 kd-grid__col--md-3 kd-grid__col--lg-3">
          <kyn-card style="width:100%;">
            <sample-card-component></sample-card-component>
          </kyn-card>
        </div>
        <div class="kd-grid__col--sm-2 kd-grid__col--md-3 kd-grid__col--lg-3">
          <kyn-card style="width:100%;">
            <sample-card-component></sample-card-component>
          </kyn-card>
        </div>
        <div class="kd-grid__col--sm-2 kd-grid__col--md-3 kd-grid__col--lg-3">
          <kyn-card style="width:100%;">
            <sample-card-component></sample-card-component>
          </kyn-card>
        </div>
      </div>
    `;
  },
};
