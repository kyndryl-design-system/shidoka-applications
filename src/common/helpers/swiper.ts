import arrowLeftIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/32/arrow-left.svg';

export const SwiperConfig = {
  slidesPerView: 1.25,
  centeredSlides: true,
  spaceBetween: 16,
  breakpoints: {
    672: {
      slidesPerView: 'auto',
      spaceBetween: 24,
    },
  },
  keyboard: {
    enabled: true,
  },
  mousewheel: {
    enabled: true,
    forceToAxis: true,
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
  on: {
    init: function (swiper: any) {
      swiper.navigation.prevEl.innerHTML = arrowLeftIcon;
      swiper.navigation.nextEl.innerHTML = arrowLeftIcon;

      DetectOffScreen(swiper);
    },
    slideChangeTransitionEnd: function (swiper: any) {
      DetectOffScreen(swiper);
    },
  },
};

const DetectOffScreen = (swiper: any) => {
  const SwiperBounds = swiper.el.getBoundingClientRect();

  swiper.slides.forEach((slide: any) => {
    const SlideBounds = slide.getBoundingClientRect();

    if (
      SlideBounds.left < SwiperBounds.left ||
      SlideBounds.right > SwiperBounds.width + SwiperBounds.left
    ) {
      slide.classList.add('off-screen');
      slide.setAttribute('aria-disabled', 'true');
    } else {
      slide.classList.remove('off-screen');
      slide.setAttribute('aria-disabled', 'false');
    }
  });
};
