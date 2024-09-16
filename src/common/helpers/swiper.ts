export const SwiperConfig = {
  slidesPerView: 1.25,
  centeredSlides: true,
  // slidesPerGroupSkip: 1,
  // slidesPerGroup: 2,
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
  on: {
    init: function (swiper: any) {
      DetectOffScreen(swiper);
    },
    slideChangeTransitionEnd: function (swiper: any) {
      DetectOffScreen(swiper);
    },
  },
};

const DetectOffScreen = (swiper: any) => {
  const SwiperWidth = swiper.el.getBoundingClientRect().width;

  swiper.slides.forEach((slide: any) => {
    const SlideBounds = slide.getBoundingClientRect();

    if (SlideBounds.left < 0 || SlideBounds.right > SwiperWidth) {
      slide.classList.add('off-screen');
    } else {
      slide.classList.remove('off-screen');
    }
  });
};
