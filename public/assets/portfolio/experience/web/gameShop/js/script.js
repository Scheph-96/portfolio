const header = document.querySelector('header');
const hamburgerMenuIcon = document.querySelector('header .hamburger-menu ion-icon');
const menu = document.querySelector('header .menu');


document.addEventListener('scroll', (e) => {
    if (window.scrollY > 0) {
        header.style.position = 'fixed';
        header.style.top = '0';
        header.style.left = '0';
        header.style.zIndex = '33';
    } else {
        header.style.position = '';
        header.style.top = '';
        header.style.left = '';
        header.style.zIndex = '';
    }
});

hamburgerMenuIcon.addEventListener('click', () => {
    menu.style.transform = 'translate(0%)';
}, false);

document.addEventListener('click', e => {
    if (!menu.contains(e.target)) {
        menu.style.transform = '';
    }
}, true);