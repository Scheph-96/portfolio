import { customPushState, routeLoader } from "../../../tools/route_loader.tool.js";


function swiper() {
  var swiper = new Swiper(".mySwiper", {
    slidesPerView: 'auto',
    // slidesPerView: 3,
    cssWidthAndHeight: true,
    spaceBetween: 20,
    // centeredSlides: true,
    grabCursor: true,
    initialSlide: 0,
    speed: 1000,
    loop: true,
    // autoplay: {
    //     delay: 3000,
    //     disableOnInteraction: false,
    // },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next-unique',
      prevEl: '.swiper-button-prev-unique'
    }
  });
}

function workSwipe() {
  const swipeContainer = document.querySelector('.swiper-container');
  const workTitles = document.querySelectorAll('.work-filter .title');
  const workSwiperSlides = document.querySelectorAll('.works-content .swiper-slide');

  var swiper = new Swiper(".swiper-container", {
    cssWidthAndHeight: true,
    spaceBetween: 20,
    initialSlide: 0,
    speed: 1000,
  });

  for (let i = 0; i < workTitles.length; i++) {
    console.log('first loop');
    workTitles[i].addEventListener('click', (e) => {
      for (let index = 0; index < workTitles.length; index++) {
        if (workTitles[index].classList.contains('active')) {
          workTitles[index].classList.remove('active');
        }
      }

      e.currentTarget.classList.add('active');
      swipeContainer.swiper.slideTo(i);

      // for (let j = 0; j < workSwiperSlides.length; j++) {
      //   if (workSwiperSlides[j].classList.contains('swiper-slide-active')) {
      //     workSwiperSlides[j].classList.remove('swiper-slide-active');
      //   }

      //   if (workSwiperSlides[j].classList.contains('swiper-slide-prev')) {
      //     workSwiperSlides[j].classList.remove('swiper-slide-prev');
      //   }

      //   if (workSwiperSlides[j].classList.contains('swiper-slide-next')) {
      //     workSwiperSlides[j].classList.remove('swiper-slide-next');
      //   }
      // }

      // for (let j = 0; j < workSwiperSlides.length; j++) {
      //   console.log('THE TARGET: ', e.currentTarget);
      //   console.log('THE SLIDE: ', workSwiperSlides[j]);

      //   if (e.currentTarget.getAttribute('index') === workSwiperSlides[j].getAttribute('data-swiper-slide-index')) {
      //     console.log('SLIDE MATCH');

      //     if ((j - 1) >= 0) {
      //       workSwiperSlides[j - 1].classList.add('swiper-slide-prev');
      //     }

      //     if ((j + 1) <= (workSwiperSlides.length - 1)) {
      //       workSwiperSlides[j + 1].classList.add('swiper-slide-next');
      //     }

      //     workSwiperSlides[j].classList.add('swiper-slide-active');
      //     break;
      //   }
      // }
    });
  }
}

function orderPageHandler() {
  const orderNow = document.querySelectorAll('.order-now');
  console.log('ORDER', orderNow);
  for (let i = 0; i < orderNow.length; i++) {
    orderNow[i].addEventListener('click', (e) => {
      console.log('order now');
      customPushState('', '', `/order/${e.currentTarget.getAttribute('service')}`);

      // ajaxRequest.loadEndPoint(`/order/${e.currentTarget.getAttribute('service')}`)
      //     .then((result) => {
      // routeLoader(e.currentTarget.getAttribute('service'));
      //     mainContentContainer.innerHTML = result;
      //     mainContentContainer.scrollTop = 0;
      //     execOrder();
      // })
      // .catch((error) => {
      //     console.error(`ERROR:: ${error}`);
      // });
    });
  }
}

function workMenuHandler() {
  const workFilterShortcut = document.querySelector('.work-filter-shortcut');
  const workFilterShortcutDisplayer = document.querySelector('.work-filter ul');
  console.log('WORK MENU HANDLER', workFilterShortcut);
  if (workFilterShortcut) {
      workFilterShortcut.addEventListener('click', () => {
          workFilterShortcutDisplayer.classList.add('show');
          console.log(workFilterShortcutDisplayer.classList);
      }, false);

      document.addEventListener('click', (event) => {
          if (!workFilterShortcutDisplayer.contains(event.target)) {
              workFilterShortcutDisplayer.classList.remove('show');
          }
      }, true);
  } else {
      console.log('DOES NOT EXIST');
  }

}

function homeDependencieMain() {
  swiper();
  orderPageHandler();
  workSwipe();
  workMenuHandler();
}

export {
  homeDependencieMain,
}