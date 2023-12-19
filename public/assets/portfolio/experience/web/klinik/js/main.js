const header = document.querySelector('header');
const menuIcon = document.querySelector('.menu-icon');
const menu = document.querySelector('.menu nav ul');
const dropdown = document.querySelector('.appointments .dropdown');
const dropdownContent = document.querySelector('.appointments .dropdown-content');
const dropdownContentValue = document.querySelector('.appointments .dropdown p');
const dropdownContentValues = document.querySelectorAll('.appointments .dropdown-content p');
const infosNumbers = document.querySelectorAll('.infos .numbers');


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

menuIcon.addEventListener('click', () => {
    menu.style.transform = 'translateX(0)';
    // menu.style.zIndex = '99';
}, false);

document.addEventListener('click', (e) => {
    if (!menu.contains(e.target)) {
        menu.style.transform = '';
    }
}, true);

dropdown.addEventListener('click', () => {
    if (dropdownContent.style.display !== 'block') {
        dropdownContent.style.display = 'block';
    } else {
        dropdownContent.style.display = '';
    }
});

for (let i = 0; i < dropdownContentValues.length; i++) {
    dropdownContentValues[i].addEventListener('click', () => {
        dropdownContentValue.innerHTML = `<p>${dropdownContentValues[i].innerHTML}</p>`;
        dropdownContentValue.style.color = '#131010';
        dropdownContent.style.display = '';
    });
}

let speed = 40;

infosNumbers.forEach(numb => {
    let targetValue = numb.dataset.count;
    let initialValue = +numb.innerHTML;

    let newInc = Math.floor(targetValue / speed);
    const incrementNumbers = () => {
        initialValue += newInc;
        numb.innerHTML = initialValue;

        if (initialValue < targetValue) {
            setTimeout(() => {
                incrementNumbers();
            }, 50);
        }
    }

    incrementNumbers();
});















