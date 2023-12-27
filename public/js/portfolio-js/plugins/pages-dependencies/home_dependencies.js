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
  const workFilterShortcut = document.querySelector('.work-filter-shortcut');
  const workFilterShortcutDisplayer = document.querySelector('.work-filter ul');

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
          break;
        }
      }

      e.currentTarget.classList.add('active');
      swipeContainer.swiper.slideTo(i);

      if (workFilterShortcut && workFilterShortcutDisplayer.classList.contains('show')) {
        workFilterShortcutDisplayer.classList.remove('show');
      }

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

function openImage() {
  const body = document.querySelector('body');
  // The images displayed in home page. The 5 ones
  const xpImg = document.querySelectorAll('.experience-img');

  for (let i = 0; i < xpImg.length; i++) {

    xpImg[i].addEventListener('click', () => {
      let xpImgDisplayer = document.createElement('div');
      xpImgDisplayer.classList.add('xpImgDisplayer');
      xpImgDisplayer.innerHTML = `<img class="experience-img-displayed" src="${xpImg[i].getAttribute('src')}" alt ="${xpImg[i].getAttribute('alt')}">`;

      body.appendChild(xpImgDisplayer);

      xpImgDisplayer.addEventListener('click', (e) => {
        body.removeChild(xpImgDisplayer);
      });

    });

  }
}

function showMoreOfExperience() {
  const moreWorks = document.querySelectorAll('.more-work');

  for (let i = 0; i < moreWorks.length; i++) {
    moreWorks[i].addEventListener('click', (e) => {
      customPushState('', '', `/works/${e.currentTarget.getAttribute('more')}`);
    });
  }
}

function showMoreOfRecommendation() {
  const moreRecommendation = document.querySelector('.all-recommendations');

  moreRecommendation.addEventListener('click', () => {
    customPushState('', '', '/recommendations');
  })
}

function homeDependencieMain() {
  swiper();
  orderPageHandler();
  workSwipe();
  workMenuHandler();
  openImage();
  showMoreOfExperience();
  showMoreOfRecommendation();
}

export {
  homeDependencieMain,
}