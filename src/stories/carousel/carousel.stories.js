import { html } from 'lit';
import { deepmerge } from 'deepmerge-ts';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import '../../components/reusable/link';
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
      url: 'https://www.figma.com/file/CQuDZEeLiuGiALvCWjAKlu/Applications---Component-Library?node-id=16511-29991&node-type=frame&m=dev',
    },
  },
  decorators: [
    (story) =>
      html`
        <style>
          /* example styles, not to be used */
          .swiper-slide {
            height: 200px;
            padding: 16px;
            background-color: var(--kd-color-background-container-soft);
            border-radius: 8px;
          }
        </style>
        ${story()}
      `,
  ],
};

/**
 * The SwiperTemplate function generates HTML code for a slider with specified number of slides.
 * @param [slides=6] - The `slides` parameter in the `SwiperTemplate` function represents the number of
 * slides you want to generate for the swiper component. By default, it is set to 6, but you can pass a
 * different number to customize the number of slides in the swiper component.
 * @returns The SwiperTemplate function returns an HTML template for a swiper slider with a specified
 * number of slides. The template includes the main swiper container, wrapper, slides, scrollbar,
 * pagination, and navigation buttons. Each slide is labeled with "Slide" followed by its index number.
 */
const SwiperTemplate = (slides = 6, noScrollbar = false) => {
  const Slides = [];
  for (let i = 0; i < slides; i++) {
    Slides.push(i);
  }

  return html`
    <!-- Slider main container -->
    <div class="swiper">
      <!-- Additional required wrapper -->
      <div class="swiper-wrapper">
        <!-- Slides -->
        ${Slides.map((slide) => {
          return html`<div class="swiper-slide">Slide ${slide + 1}</div>`;
        })}
      </div>

      <!-- If we need scrollbar -->
      ${!noScrollbar ? html` <div class="swiper-scrollbar"></div> ` : null}

      <!-- If we need pagination -->
      <div class="swiper-pagination"></div>

      <!-- If we need navigation buttons -->
      <div class="swiper-button-prev"></div>
      <div class="swiper-button-next"></div>
    </div>
  `;
};

export const LargeCards = {
  render: () => {
    return html`
      This example is unmodified, so each slide takes a full page.
      <br /><br />

      ${SwiperTemplate()}
    `;
  },
  play: async () => {
    new Swiper('.swiper', SwiperConfig);
  },
};

export const MiniCards = {
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
  render: () => {
    return html`
      This example sets a fixed width on each slide. At the mobile breakpoint,
      slides will be full width.
      <br /><br />

      ${SwiperTemplate()}
    `;
  },
  play: async () => {
    new Swiper('.swiper', SwiperConfig);
  },
};

export const FullBleed = {
  render: () => {
    return html`
      This example adds the "swiper-full-bleed" class to extend beyond the page
      gutter to the edge of the screen.
      <br /><br />

      ${SwiperTemplate()}
    `;
  },
  play: async () => {
    document.querySelector('.swiper').classList.add('swiper-full-bleed');

    new Swiper('.swiper', SwiperConfig);
  },
};

export const PaginationBullets = {
  render: () => {
    return html`
      This example extends the Shidoka default Swiper config to use the
      "bullets" style of pagination instead of "fractional".
      <br /><br />

      ${SwiperTemplate(6, true)}
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
  render: () => {
    return html`
      This example extends the Shidoka default Swiper config to modify the
      "bullets" style of pagination to convert them to Tabs on larger screen
      sizes. The class "tabs" is also added to the "swiper-pagination" div. Tabs
      should be limited to 5.
      <br /><br />

      ${SwiperTemplate(5, true)}
    `;
  },
  play: async () => {
    document.querySelector('.swiper-pagination').classList.add('tabs');

    const TabTextArr = ['Tab 1', 'Tab 2', 'Tab 3', 'Tab 4', 'Tab 5'];

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
  render: () => {
    return html`
      This example places a link inline with the fractional pagination.
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

        <!-- If we need a link next to pagination -->
        <div class="pagination-with-link">
          <div class="swiper-pagination"></div>

          <kyn-link standalone href="javascript:void(0);">
            Link
            <span slot="icon">${unsafeSVG(arrowRightIcon)}</span>
          </kyn-link>
        </div>

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
