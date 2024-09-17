import { html } from 'lit';
import { deepmerge } from 'deepmerge-ts';
import '@kyndryl-design-system/shidoka-foundation/components/link';
import arrowRightIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/arrow-right.svg';

// import Swiper bundle with all modules installed
import Swiper from 'swiper/bundle';

// import Shidoka's Swiper config
import { SwiperConfig } from '../../common/helpers/swiper';

export default {
  title: 'Patterns/Carousel',
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
  decorators: [
    (story) =>
      html`
        <style>
          .swiper-slide {
            height: 200px;
            padding: 16px;
            background-color: var(--kd-color-background-ui-soft);
            border-radius: 8px;
          }
        </style>
        ${story()}
      `,
  ],
};

export const LargeCards = {
  args: {},
  render: (args) => {
    return html`
      This example is unmodified, so each slide takes a full page.
      <br /><br />

      <!-- Slider main container -->
      <div class="swiper">
        <!-- Additional required wrapper -->
        <div class="swiper-wrapper">
          <!-- Slides -->
          <div class="swiper-slide">Slide 1</div>
          <div class="swiper-slide">Slide 2</div>
          <div class="swiper-slide">Slide 3</div>
          <div class="swiper-slide">Slide 4</div>
          <div class="swiper-slide">Slide 5</div>
          <div class="swiper-slide">Slide 6</div>
        </div>

        <!-- If we need scrollbar -->
        <div class="swiper-scrollbar"></div>

        <!-- If we need pagination -->
        <div class="swiper-pagination"></div>

        <!-- If we need navigation buttons -->
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>
      </div>
    `;
  },
  play: async () => {
    new Swiper('.swiper', SwiperConfig);
  },
};

export const MiniCards = {
  args: {},
  decorators: [
    (story) =>
      html`
        <style>
          .swiper-slide {
            width: 264px;
          }
        </style>
        ${story()}
      `,
  ],
  render: (args) => {
    return html`
      This example sets a fixed width on each slide.
      <br /><br />

      <!-- Slider main container -->
      <div class="swiper">
        <!-- Additional required wrapper -->
        <div class="swiper-wrapper">
          <!-- Slides -->
          <div class="swiper-slide">Slide 1</div>
          <div class="swiper-slide">Slide 2</div>
          <div class="swiper-slide">Slide 3</div>
          <div class="swiper-slide">Slide 4</div>
          <div class="swiper-slide">Slide 5</div>
          <div class="swiper-slide">Slide 6</div>
        </div>

        <!-- If we need scrollbar -->
        <div class="swiper-scrollbar"></div>

        <!-- If we need pagination -->
        <div class="swiper-pagination"><a>test</a></div>

        <!-- If we need navigation buttons -->
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>
      </div>
    `;
  },
  play: async () => {
    new Swiper('.swiper', SwiperConfig);
  },
};

export const FullBleed = {
  args: {},
  render: (args) => {
    return html`
      This example adds the "swiper-full-bleed" class to extend beyond the page
      gutter to the edge of the screen.
      <br /><br />

      <!-- Slider main container -->
      <div class="swiper swiper-full-bleed">
        <!-- Additional required wrapper -->
        <div class="swiper-wrapper">
          <!-- Slides -->
          <div class="swiper-slide">Slide 1</div>
          <div class="swiper-slide">Slide 2</div>
          <div class="swiper-slide">Slide 3</div>
          <div class="swiper-slide">Slide 4</div>
          <div class="swiper-slide">Slide 5</div>
          <div class="swiper-slide">Slide 6</div>
        </div>

        <!-- If we need scrollbar -->
        <div class="swiper-scrollbar"></div>

        <!-- If we need pagination -->
        <div class="swiper-pagination"></div>

        <!-- If we need navigation buttons -->
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>
      </div>
    `;
  },
  play: async () => {
    new Swiper('.swiper', SwiperConfig);
  },
};

export const PaginationBullets = {
  args: {},
  render: (args) => {
    return html`
      This example extends the Shidoka default Swiper config to use the
      "bullets" style of pagination instead of "fractional".
      <br /><br />

      <!-- Slider main container -->
      <div class="swiper">
        <!-- Additional required wrapper -->
        <div class="swiper-wrapper">
          <!-- Slides -->
          <div class="swiper-slide">Slide 1</div>
          <div class="swiper-slide">Slide 2</div>
          <div class="swiper-slide">Slide 3</div>
          <div class="swiper-slide">Slide 4</div>
          <div class="swiper-slide">Slide 5</div>
          <div class="swiper-slide">Slide 6</div>
        </div>

        <!-- If we need pagination -->
        <div class="swiper-pagination"></div>

        <!-- If we need navigation buttons -->
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>
      </div>
    `;
  },
  play: async () => {
    const CustomConfig = {
      pagination: {
        type: 'bullets',
      },
    };
    const FinalConfig = deepmerge(SwiperConfig, CustomConfig);

    new Swiper('.swiper', FinalConfig);
  },
};

export const PaginationTabs = {
  args: {},
  render: (args) => {
    return html`
      This example extends the Shidoka default Swiper config to modify the
      "bullets" style of pagination to convert them to Tabs on larger screen
      sizes. The class "tabs" is also added to the "swiper-pagination" div.
      <br /><br />

      <!-- Slider main container -->
      <div class="swiper">
        <!-- Additional required wrapper -->
        <div class="swiper-wrapper">
          <!-- Slides -->
          <div class="swiper-slide">Slide 1</div>
          <div class="swiper-slide">Slide 2</div>
          <div class="swiper-slide">Slide 3</div>
          <div class="swiper-slide">Slide 4</div>
          <div class="swiper-slide">Slide 5</div>
          <div class="swiper-slide">Slide 6</div>
        </div>

        <!-- If we need pagination -->
        <div class="swiper-pagination tabs"></div>

        <!-- If we need navigation buttons -->
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>
      </div>
    `;
  },
  play: async () => {
    const TabTextArr = ['Tab 1', 'Tab 2', 'Tab 3', 'Tab 4', 'Tab 5', 'Tab 6'];

    const CustomConfig = {
      pagination: {
        type: 'bullets',
        renderBullet: function (index, className) {
          return `
            <span class="${className}">
              <span class="tab-text">${TabTextArr[index]}</span>
            </span>
          `;
        },
      },
    };

    const FinalConfig = deepmerge(SwiperConfig, CustomConfig);

    new Swiper('.swiper', FinalConfig);
  },
};

export const WithLink = {
  args: {},
  render: (args) => {
    return html`
      This example injects a link into the fractional pagination.
      <br /><br />

      <!-- Slider main container -->
      <div class="swiper">
        <!-- Additional required wrapper -->
        <div class="swiper-wrapper">
          <!-- Slides -->
          <div class="swiper-slide">Slide 1</div>
          <div class="swiper-slide">Slide 2</div>
          <div class="swiper-slide">Slide 3</div>
          <div class="swiper-slide">Slide 4</div>
          <div class="swiper-slide">Slide 5</div>
          <div class="swiper-slide">Slide 6</div>
        </div>

        <!-- If we need scrollbar -->
        <div class="swiper-scrollbar"></div>

        <!-- If we need pagination -->
        <div class="swiper-pagination"></div>

        <!-- If we need navigation buttons -->
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>
      </div>
    `;
  },
  play: async () => {
    const CustomConfig = {
      pagination: {
        renderFraction: function (currentClass, totalClass) {
          return `
          <span class="${currentClass}"></span> / <span class="${totalClass}"></span>
          <kd-link standalone href="javascript:void(0);">
            View All
            <span slot="icon">${arrowRightIcon}</span>
          </kd-link>
          `;
        },
      },
    };

    const FinalConfig = deepmerge(SwiperConfig, CustomConfig);

    new Swiper('.swiper', FinalConfig);
  },
};
