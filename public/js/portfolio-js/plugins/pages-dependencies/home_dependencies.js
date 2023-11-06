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

function homeDependencieMain() {
  swiper();
  orderPageHandler()
}

export {
  homeDependencieMain,
}