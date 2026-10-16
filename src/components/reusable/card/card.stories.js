import { html } from 'lit';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { useArgs } from 'storybook/preview-api';
import chevronRightIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/chevron-right.svg';
import shareIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/32/share.svg';
import './index';
import { action } from 'storybook/actions';
import './card.sample';
import './cardSelection.sample.scss';
import '../overflowMenu';
import '../link';
import '../button';
import '../checkbox';

const hiddenCardArgType = {
  control: false,
  table: { disable: true },
};

export default {
  title: 'Components/Layout & Structure/Card',
  component: 'kyn-card',
  args: {
    hideBorder: false,
    compact: false,
    aiConnected: false,
    highlight: false,
    selectable: false,
    selected: false,
  },
  argTypes: {
    hideBorder: { control: { type: 'boolean' } },
    compact: { control: { type: 'boolean' } },
    aiConnected: { control: { type: 'boolean' } },
    highlight: { control: { type: 'boolean' } },
    selectable: { control: { type: 'boolean' } },
    selected: { control: { type: 'boolean' } },
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
};

export const BlankCard = {
  argTypes: {
    selectable: { control: false },
    selected: { control: false },
  },
  args: {
    type: 'normal',
    href: '',
    rel: '',
    target: '_self',
    hideBorder: true,
    variant: 'default',
    /* The `compact: false` property in the code snippet is a part of the arguments object used in
    defining the different card components. When `compact` is set to `false`, it means that the card
    component will not be displayed in a compact or condensed form. This property likely controls
    the visual styling or layout of the card component to determine whether it should be displayed
    in a more spacious or compact manner. */
    compact: false,
    aiConnected: false,
    highlight: false,
  },
  render: (args) => {
    return html` <kyn-card
      type=${args.type}
      href=${args.href}
      target=${args.target}
      rel=${args.rel}
      role="article"
      ?hideBorder=${args.hideBorder}
      .variant=${args.variant}
      ?compact=${args.compact}
      ?aiConnected=${args.aiConnected}
      ?highlight=${args.highlight}
      aria-label="Blank card"
    ></kyn-card>`;
  },
};

export const Simple = {
  name: 'Static',
  argTypes: {
    selectable: { control: false },
    selected: { control: false },
  },
  args: {
    type: 'normal',
    href: '',
    rel: '',
    target: '_self',
    hideBorder: true,
    variant: 'default',
    compact: false,
    aiConnected: false,
    highlight: false,
  },
  render: (args) => {
    return html`
      <div class="kd-grid" style="grid-auto-rows:1fr;">
        ${[
          html`<kyn-link
            slot="footer"
            standalone
            href="https://www.kyndryl.com"
            target="_blank"
            @on-click=${action('on-link-click')}
          >
            Link
            <span slot="icon" aria-hidden="true">
              ${unsafeSVG(chevronRightIcon)}
            </span>
          </kyn-link>`,
          html`<kyn-button
            slot="footer"
            kind="tertiary"
            size="small"
            iconPosition="center"
            description="View details"
            style="display:flex;justify-content:flex-end;"
            @on-click=${action('View details')}
          >
            <span slot="icon" aria-hidden="true"
              >${unsafeSVG(chevronRightIcon)}</span
            >
          </kyn-button>`,
          html`
            <div
              slot="actions"
              style="display:flex;align-items:center;gap:var(--kd-spacing-16);"
            >
              <kyn-overflow-menu anchorRight assistiveText="Card actions">
                <kyn-overflow-menu-item @on-click=${action('View details')}>
                  View details
                </kyn-overflow-menu-item>
                <kyn-overflow-menu-item @on-click=${action('Edit')}>
                  Edit
                </kyn-overflow-menu-item>
              </kyn-overflow-menu>
              <kyn-checkbox
                value="static-card"
                visiblyHidden
                @on-checkbox-change=${(event) =>
                  action('on-checkbox-change')(event.detail)}
                >Select card</kyn-checkbox
              >
            </div>
            <kyn-link
              slot="footer"
              standalone
              href="https://www.kyndryl.com"
              target="_blank"
              @on-click=${action('on-link-click')}
            >
              Link
              <span slot="icon" aria-hidden="true">
                ${unsafeSVG(chevronRightIcon)}
              </span>
            </kyn-link>
          `,
        ].map(
          (control, index) => html`
            <div
              class="kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-4"
            >
              <kyn-card
                style="width:100%;height:100%;"
                type=${args.type}
                href=${args.href}
                target=${args.target}
                rel=${args.rel}
                ?hideBorder=${args.hideBorder}
                .variant=${args.variant}
                ?compact=${args.compact}
                ?aiConnected=${args.aiConnected}
                ?highlight=${args.highlight}
                role="article"
                aria-label=${`Static card ${index + 1}`}
              >
                <sample-card-component>
                  ${control}
                  <div slot="title">This is a card title</div>
                  <div slot="description">
                    Amazon EC2 Auto Scaling ensures that your application always
                    has the right amount of compute capacity by dynamically
                    adjusting the number of Amazon EC2 instances based on
                    demand.
                  </div>
                </sample-card-component>
              </kyn-card>
            </div>
          `
        )}
      </div>
    `;
  },
};

export const Clickable = {
  name: 'Interactive',
  tags: ['updated'],
  args: {
    type: 'clickable',
    href: 'https://www.kyndryl.com',
    rel: 'noopener',
    target: '_blank',
    hideBorder: true,
    variant: 'default',
    compact: false,
    aiConnected: false,
    highlight: false,
  },
  render: (args) => {
    return html`
      <kyn-card
        type=${args.type}
        href=${args.href}
        target=${args.target}
        rel=${args.rel}
        ?hideBorder=${args.hideBorder}
        .variant=${args.variant}
        ?selectable=${args.selectable}
        .selected=${args.selected}
        ?compact=${args.compact}
        ?aiConnected=${args.aiConnected}
        ?highlight=${args.highlight}
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

export const SelectableCards = {
  tags: ['new'],
  argTypes: {
    type: hiddenCardArgType,
    href: hiddenCardArgType,
    rel: hiddenCardArgType,
    target: hiddenCardArgType,
    selected: hiddenCardArgType,
    selectedServices: {
      options: ['compute', 'storage', 'database'],
      control: { type: 'check' },
    },
  },
  args: {
    selectedServices: ['compute', 'storage', 'database'],
    hideBorder: true,
    selectable: true,
  },
  render: (args) => {
    const [, updateArgs] = useArgs();
    const services = [
      {
        id: 'compute',
        title: 'Compute',
        description: 'Application workloads and virtual machines.',
      },
      {
        id: 'storage',
        title: 'Storage',
        description: 'Object storage for application data and backups.',
      },
      {
        id: 'database',
        title: 'Database',
        description: 'Managed databases for transactional applications.',
      },
    ];
    return html`
      <section class="card-selection-example" aria-label="Services">
        <div
          class="kd-grid service-cards"
          role="group"
          aria-label="Select services"
        >
          ${services.map(
            (service) => html`
              <div
                class="kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-4"
              >
                <kyn-card
                  type="clickable"
                  ?selectable=${args.selectable}
                  .selected=${args.selectedServices.includes(service.id)}
                  ?hideBorder=${args.hideBorder}
                  ?compact=${args.compact}
                  ?aiConnected=${args.aiConnected}
                  ?highlight=${args.highlight}
                  @on-select=${(event) => {
                    action(event.type)({ ...event, detail: event.detail });
                    const selectedServices = event.detail.selected
                      ? [...args.selectedServices, service.id]
                      : args.selectedServices.filter(
                          (selectedService) => selectedService !== service.id
                        );
                    updateArgs({ selectedServices });
                  }}
                >
                  <div class="card-logo-container">
                    <span class="card-logo" aria-hidden="true"
                      >${unsafeSVG(shareIcon)}</span
                    >
                  </div>
                  <h3 class="card-title">${service.title}</h3>
                  <p class="card-description">${service.description}</p>
                  <kyn-checkbox
                    slot="selection-control"
                    .checked=${args.selectedServices.includes(service.id)}
                    .visiblyHidden=${true}
                  >
                    Select ${service.title}
                  </kyn-checkbox>
                </kyn-card>
              </div>
            `
          )}
        </div>
      </section>
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
    variant: 'default',
    aiConnected: false,
    highlight: false,
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
            .variant=${args.variant}
            ?compact=${args.compact}
            ?selectable=${args.selectable}
            .selected=${args.selected}
            ?aiConnected=${args.aiConnected}
            ?highlight=${args.highlight}
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
            .variant=${args.variant}
            ?compact=${args.compact}
            ?selectable=${args.selectable}
            .selected=${args.selected}
            ?aiConnected=${args.aiConnected}
            ?highlight=${args.highlight}
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
            .variant=${args.variant}
            ?compact=${args.compact}
            ?selectable=${args.selectable}
            .selected=${args.selected}
            ?aiConnected=${args.aiConnected}
            ?highlight=${args.highlight}
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
            .variant=${args.variant}
            ?compact=${args.compact}
            ?selectable=${args.selectable}
            .selected=${args.selected}
            ?aiConnected=${args.aiConnected}
            ?highlight=${args.highlight}
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

export const AIConnected = {
  args: {
    type: 'normal',
    href: '',
    rel: '',
    target: '_self',
    hideBorder: false,
    variant: 'default',
    aiConnected: true,
    highlight: false,
  },
  render: (args) => {
    return html`
      <kyn-card
        type=${args.type}
        href=${args.href}
        target=${args.target}
        rel=${args.rel}
        ?hideBorder=${args.hideBorder}
        .variant=${args.variant}
        ?compact=${args.compact}
        ?selectable=${args.selectable}
        .selected=${args.selected}
        ?aiConnected=${args.aiConnected}
        ?highlight=${args.highlight}
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
