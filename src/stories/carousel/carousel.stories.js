import { html } from 'lit';

// import Swiper bundle with all modules installed
import Swiper from 'swiper/bundle';

const SwiperConfig = {
  slidesPerView: 1.25,
  centeredSlides: true,
  spaceBetween: 16,
  breakpoints: {
    672: {
      slidesPerView: 'auto',
      spaceBetween: 24,
    },
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  scrollbar: {
    el: '.swiper-scrollbar',
    draggable: true,
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
    type: 'fraction',
  },
};

export default {
  title: 'Patterns/Carousel',
  // component: 'kyn-carousel',
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
            background-color: var(--kd-color-background-ui-default);
            border: 1px solid var(--kd-color-border-light);
            border-radius: 8px;
          }
        </style>
        ${story()}
      `,
  ],
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

export const LargeCards = {
  args: {},
  render: (args) => {
    return html`
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

export const FullBleed = {
  args: {},
  render: (args) => {
    return html`
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
    const Config = JSON.parse(JSON.stringify(SwiperConfig));

    Config.pagination.type = 'bullets';

    new Swiper('.swiper', Config);
  },
};

export const PaginationTabs = {
  args: {},
  render: (args) => {
    return html`
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
    const Config = JSON.parse(JSON.stringify(SwiperConfig));
    const Tabs = ['Tab 1', 'Tab 2', 'Tab 3', 'Tab 4', 'Tab 5', 'Tab 6'];

    Config.pagination.type = 'bullets';
    Config.pagination.renderBullet = function (index, className) {
      return '<span class="' + className + '">' + Tabs[index] + '</span>';
    };

    new Swiper('.swiper', Config);
  },
};
