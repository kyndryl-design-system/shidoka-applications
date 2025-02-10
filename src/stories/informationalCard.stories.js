import { html } from 'lit';
import '@kyndryl-design-system/shidoka-foundation/css/grid.css';
import '../components/reusable/card';

import './sampleCardComponents/card.sample.ts';
import './sampleCardComponents/card.content.sample.ts';

export default {
  title: 'Patterns/Informational Card',
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
      <kyn-card type="normal" href="" target="" rel="">
        <sample-card-story-component>
          <div slot="title">This is a card title</div>
          <div slot="description">
            Amazon EC2 Auto Scaling ensures that your application always has the
            right amount of compute capacity by dynamically adjusting the number
            of Amazon EC2 instances based on demand.
          </div>
        </sample-card-story-component>
      </kyn-card>

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
      <kyn-card type="normal" href="" target="" rel="">
        <sample-card-story-content-component></sample-card-story-content-component>
      </kyn-card>

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

// export const Clickable = {
//   render: () => {
//     return html`
//       <kyn-card
//         type="clickable"
//         href="https://www.kyndryl.com"
//         target="_blank"
//         rel=""
//         @on-card-click=${(e) => action(e.type)(e)}
//       >
//         <sample-card-story-component>
//           <div slot="title">This is a card title</div>
//           <div slot="description">
//             Amazon EC2 Auto Scaling ensures that your application always has the
//             right amount of compute capacity by dynamically adjusting the number
//             of Amazon EC2 instances based on demand.
//           </div>
//         </sample-card-story-component>
//       </kyn-card>

//       <br /><br />
//       <a
//         href="https://github.com/kyndryl-design-system/shidoka-applications/blob/main/src/stories/sampleCardComponents/card.sample.ts"
//         target="_blank"
//         rel="noopener"
//       >
//         See the full example component code here.
//       </a>
//     `;
//   },
// };

// export const InsideGrid = {
//   render: () => {
//     return html`
//       <div class="kd-grid">
//         <div class="kd-grid__col--sm-2 kd-grid__col--md-4 kd-grid__col--lg-3">
//           <kyn-card style="width:100%;height:100%;">
//             <sample-card-story-component>
//               <div slot="title">This is a card title</div>
//               <div slot="description">
//                 Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
//                 eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
//                 enim ad minim veniam, quis nostrud exercitation ullamco laboris.
//               </div>
//             </sample-card-story-component>
//           </kyn-card>
//         </div>
//         <div class="kd-grid__col--sm-2 kd-grid__col--md-4 kd-grid__col--lg-3">
//           <kyn-card style="width:100%;height:100%;">
//             <sample-card-story-component>
//               <div slot="title">This is a card title</div>
//               <div slot="description">
//                 Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
//                 eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
//                 enim ad minim veniam, quis nostrud exercitation ullamco laboris
//                 nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
//                 in reprehenderit in voluptate velit esse cillum
//               </div>
//             </sample-card-story-component>
//           </kyn-card>
//         </div>
//         <div class="kd-grid__col--sm-2 kd-grid__col--md-4 kd-grid__col--lg-3">
//           <kyn-card style="width:100%;height:100%;">
//             <sample-card-story-component>
//               <div slot="title">This is a card title</div>
//               <div slot="description">
//                 Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
//                 eiusmod tempor.
//               </div>
//             </sample-card-story-component>
//           </kyn-card>
//         </div>
//         <div class="kd-grid__col--sm-2 kd-grid__col--md-4 kd-grid__col--lg-3">
//           <kyn-card style="width:100%;height:100%;">
//             <sample-card-story-component>
//               <div slot="title">This is a card title</div>
//               <div slot="description">
//                 Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
//                 eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
//                 enim ad minim veniam, quis nostrud exercitation ullamco laboris
//                 nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
//                 in reprehenderit in voluptate velit esse cillum dolore eu fugiat
//                 nulla pariatur.
//               </div>
//             </sample-card-story-component>
//           </kyn-card>
//         </div>
//       </div>

//       <br /><br />
//       <a
//         href="https://github.com/kyndryl-design-system/shidoka-applications/blob/main/src/stories/sampleCardComponents/card.sample.ts"
//         target="_blank"
//         rel="noopener"
//       >
//         See the full example component code here.
//       </a>
//     `;
//   },
// };

export const InformationalCardSkeleton = {
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

export const InformationalCardSkeletonWithThumbnail = {
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
