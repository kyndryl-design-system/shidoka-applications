import { html } from 'lit';
// import '@kyndryl-design-system/shidoka-foundation/css/grid.css';
import '@kyndryl-design-system/shidoka-foundation/components/card';
import './index';
// import { action } from '@storybook/addon-actions';
// import './card.sample';
// import './card.content.sample';

export default {
  title: 'Components/Card - Deprecated',
  component: 'kd-card',
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
      url: 'https://www.figma.com/file/6AovH7Iay9Y7BkpoL5975s/Applications-Specs-for-Devs?type=design&node-id=3881-2&mode=design&t=Vig86P5oNpzRye3u-0',
    },
  },
};

export const Simple = {
  args: {
    type: 'normal',
    href: '',
    rel: '',
    target: '_self',
    hideBorder: true,
  },
  render: (args) => {
    return html`
      <kd-card
        type=${args.type}
        href=${args.href}
        target=${args.target}
        rel=${args.rel}
        ?hideBorder=${args.hideBorder}
      >
        <sample-card-component>
          <div slot="title">This is a card title</div>
          <div slot="description">
            Amazon EC2 Auto Scaling ensures that your application always has the
            right amount of compute capacity by dynamically adjusting the number
            of Amazon EC2 instances based on demand.
          </div>
        </sample-card-component>
      </kd-card>
    `;
  },
};

// export const WithOtherContents = {
//   args: Simple.args,
//   render: (args) => {
//     return html`<kyn-card
//       type=${args.type}
//       href=${args.href}
//       target=${args.target}
//       rel=${args.rel}
//       ?hideBorder=${args.hideBorder}
//     >
//       <sample-card-content-component></sample-card-content-component>
//     </kyn-card>`;
//   },
// };

// export const Clickable = {
//   args: {
//     type: 'clickable',
//     href: 'https://www.kyndryl.com',
//     rel: 'noopener',
//     target: '_blank',
//     hideBorder: false,
//   },
//   render: (args) => {
//     return html`
//       <kyn-card
//         type=${args.type}
//         href=${args.href}
//         target=${args.target}
//         rel=${args.rel}
//         ?hideBorder=${args.hideBorder}
//         @on-card-click=${(e) => action(e.type)(e)}
//       >
//         <sample-card-component>
//           <div slot="title">This is a card title</div>
//           <div slot="description">
//             Amazon EC2 Auto Scaling ensures that your application always has the
//             right amount of compute capacity by dynamically adjusting the number
//             of Amazon EC2 instances based on demand.
//           </div>
//         </sample-card-component>
//       </kyn-card>
//     `;
//   },
// };

// export const InsideGrid = {
//   render: () => {
//     return html`
//       <div class="kd-grid">
//         <div class="kd-grid__col--sm-2 kd-grid__col--md-4 kd-grid__col--lg-3">
//           <kyn-card style="width:100%;height:100%;">
//             <sample-card-component>
//               <div slot="title">This is a card title</div>
//               <div slot="description">
//                 Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
//                 eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
//                 enim ad minim veniam, quis nostrud exercitation ullamco laboris.
//               </div>
//             </sample-card-component>
//           </kyn-card>
//         </div>
//         <div class="kd-grid__col--sm-2 kd-grid__col--md-4 kd-grid__col--lg-3">
//           <kyn-card style="width:100%;height:100%;">
//             <sample-card-component>
//               <div slot="title">This is a card title</div>
//               <div slot="description">
//                 Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
//                 eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
//                 enim ad minim veniam, quis nostrud exercitation ullamco laboris
//                 nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
//                 in reprehenderit in voluptate velit esse cillum
//               </div>
//             </sample-card-component>
//           </kyn-card>
//         </div>
//         <div class="kd-grid__col--sm-2 kd-grid__col--md-4 kd-grid__col--lg-3">
//           <kyn-card style="width:100%;height:100%;">
//             <sample-card-component>
//               <div slot="title">This is a card title</div>
//               <div slot="description">
//                 Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
//                 eiusmod tempor.
//               </div>
//             </sample-card-component>
//           </kyn-card>
//         </div>
//         <div class="kd-grid__col--sm-2 kd-grid__col--md-4 kd-grid__col--lg-3">
//           <kyn-card style="width:100%;height:100%;">
//             <sample-card-component>
//               <div slot="title">This is a card title</div>
//               <div slot="description">
//                 Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
//                 eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
//                 enim ad minim veniam, quis nostrud exercitation ullamco laboris
//                 nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
//                 in reprehenderit in voluptate velit esse cillum dolore eu fugiat
//                 nulla pariatur.
//               </div>
//             </sample-card-component>
//           </kyn-card>
//         </div>
//       </div>
//     `;
//   },
// };

export const VitalCardSkeleton = {
  args: { ...Simple.args, lines: 1, thumbnailVisible: true },
  render: (args) => {
    return html` <kd-card
      type=${args.type}
      href=${args.href}
      target=${args.target}
      rel=${args.rel}
      ?hideBorder=${args.hideBorder}
    >
      <kyn-vital-card-skeleton .lines=${args.lines}></kyn-vital-card-skeleton>
    </kd-card>`;
  },
};

export const InformationalCardSkeleton = {
  args: { ...Simple.args, lines: 2, thumbnailVisible: false },
  render: (args) => {
    return html` <kd-card
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
    </kd-card>`;
  },
};

export const InformationalCardSkeletonWithThumbnail = {
  args: { ...Simple.args, lines: 2, thumbnailVisible: true },
  render: (args) => {
    return html` <kd-card
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
    </kd-card>`;
  },
};
