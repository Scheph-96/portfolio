const body = document.querySelector('body');
const bookingBtn = document.querySelector('.booking-btn');
const bookTableShadow = document.querySelector('.book-table-shadow');
const bookTable = document.querySelector('.book-table');
const menuShortchut = document.querySelector('.menu-shortcut');
const menu = document.querySelector('header .menu ul');


bookingBtn.addEventListener('click', (e) => {
    bookTableShadow.style.display = 'block';
    body.classList.add('stop-scrolling');
    if (menu.style.transform === 'translateX(0%)') {
        menu.style.transform = '';
    }
});

bookTableShadow.addEventListener('click', (e) => {
    if (!bookTable.contains(e.target)) {
        bookTableShadow.style.display = 'none';
    }
}, true);

menuShortchut.addEventListener('click', () => {
    menu.style.transform = 'translateX(0%)';
}, false);

document.addEventListener('click', e => {
    if (!menu.contains(e.target)) {
        menu.style.transform = '';
    }
}, true);






