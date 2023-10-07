const body = document.querySelector('body');
const profileDetails = document.querySelector('.profile-details');
const profileDetailShortcut = document.querySelector('.profile-details-shortcut');
const profileDetailShadow = document.querySelector('.profile-details-shadow');
const profileDetailShortcutIcon = document.querySelector('.bxs-user-circle');
const workFilterShortcut = document.querySelector('.work-filter-shortcut');
const workFilterShortcutIcon = document.querySelector('.bx-dots-vertical-rounded');
const workFilterShortcutDisplayer = document.querySelector('.work-filter-shortcut-displayer');
const moreLanguagesBtn = document.querySelector('.more-languages-btn');
const programmingLanguage = document.querySelector('.programming-language');
const moreLanguages = document.querySelector('.more-languages');


// function hide() {
//     document.addEventListener('click', (event) => {
//         console.log('user clicked: ', event.target);
//         console.log(!profileDetails.contains(event.target) && !profileDetailShortcut.isEqualNode(event.target));
//         console.log('display: ', profileDetails.style.display !== 'none');
//         // console.log(profileDetailShortcut);
//         if (!profileDetails.contains(event.target) && !profileDetailShortcutIcon.isEqualNode(event.target) && profileDetails.style.display !== 'none') {
//             console.log('HERE 1');
//             profileDetails.style.display = 'none';
//             profileDetailShortcut.style.display = 'block';
//         } 

//         if (!workFilterShortcutDisplayer.contains(event.target) && !workFilterShortcutIcon.isEqualNode(event.target)) {
//             console.log('HERE 2');
//             workFilterShortcutDisplayer.style.display = 'none';
//         }
//     });
// }

function profilHandler() {
    profileDetailShortcut.addEventListener('click', () => {
        profileDetails.style.transform = 'translateX(0px)';
        profileDetailShadow.classList.add('show');
        profileDetailShortcut.classList.add('hide');
    });

    profileDetailShadow.addEventListener('click', () => {
        profileDetails.style.transform = '';
        profileDetailShadow.classList.remove('show');
        profileDetailShortcut.classList.remove('hide');
    });
}

function workMenuHandler() {
    workFilterShortcut.addEventListener('click', () => {
        workFilterShortcutDisplayer.classList.add('show');
        console.log(workFilterShortcutDisplayer.classList);
    }, false);

    document.addEventListener('click', (event) => {
        if (!workFilterShortcutDisplayer.contains(event.target)) {
            workFilterShortcutDisplayer.classList.remove('show');
        }
    }, true);
}

function programmingLanguageHandler() {
    moreLanguagesBtn.addEventListener('click', () => {
        programmingLanguage.style.maxHeight = '400px';
        moreLanguagesBtn.style.display = 'none';
    }, false);

    document.addEventListener('click', (event) => {
        if (!programmingLanguage.contains(event.target)) {
            programmingLanguage.style.maxHeight = '';
            moreLanguagesBtn.style.display = '';
        }
    }, true);
}



export {
    profilHandler as profile,
    workMenuHandler as workFilter,
    programmingLanguageHandler as moreProgrammingLanguage,
}