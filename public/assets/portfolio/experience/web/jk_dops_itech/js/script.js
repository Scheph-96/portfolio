const body = document.querySelector('body');
const header = document.querySelector('header');
const menuItems = document.querySelectorAll('.menu ul li a');
const menuIcon = document.querySelector('.menu-icon');
const menu = document.querySelector('.menu ul');


for (let i = 0; i < menuItems.length; i++) {
    menuItems[i].addEventListener('click', () => {
        for (let j = 0; j < menuItems.length; j++) {
            if (menuItems[j].classList.contains('active')) {
                menuItems[j].classList.remove('active');
                break;
            }
        }

        menuItems[i].classList.add('active');

    });
    
}

document.addEventListener('scroll', (e) => {
    if (window.scrollY > 0) {
        header.style.background = 'linear-gradient(to bottom right, #54012b, #ff0099)';
    } else {
        header.style.background = '';
    }
});

menuIcon.addEventListener('click', () => {
    menu.style.transform = 'translateX(0)';
}, false);

document.addEventListener('click', (e) => {
    if (!menu.contains(e.target)) {
        menu.style.transform = '';
    }
}, true);

