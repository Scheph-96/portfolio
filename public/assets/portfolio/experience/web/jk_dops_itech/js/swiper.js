var swiper = new Swiper(".mySwiper", {
    slidesPerView: 3,
    spaceBetween: 30,
    autoplay: {
        delay: 3000,
        disableOnInteraction: iteraction,
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
});