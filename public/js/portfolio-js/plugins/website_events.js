// import { AjaxRequest } from '../../tools/ajax_req.tool.js';
// import { appConfig } from '../../../dependencies.js';
import { getCssRule, removeCssPropertyFromRule } from "../../tools/util.js";
import { customReplaceState } from "../../tools/route_loader.tool.js"


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
const main = document.querySelector('main');
const mainFirstDiv = document.querySelector('main > div');
const expandCollapseButton = document.querySelector('.main-content .collapse-expand-sidebar');


// let fileLoader = new AjaxRequest();

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

    let profileDetailsRules = getCssRule('portfolio-style.css', '.profile-details');
    let expandCollapseButtonRules = getCssRule('portfolio-style.css', '.main-content .collapse-expand-sidebar')
    let bodyRules = getCssRule('portfolio-style.css', 'body');
    let mainRules = getCssRule('portfolio-style.css', 'main');

    profileDetailShortcut.addEventListener('click', () => {
        profileDetailsRules.style['transform'] = 'translateX(0px)';
        profileDetailShadow.classList.add('show');
        profileDetailShortcut.classList.add('hide');
    });

    profileDetailShadow.addEventListener('click', () => {
        removeCssPropertyFromRule(profileDetailsRules, 'transform');
        profileDetailShadow.classList.remove('show');
        profileDetailShortcut.classList.remove('hide');
    });

    expandCollapseButton.addEventListener('click', () => {
        if (!mainFirstDiv.classList.contains('sidebar-collapse')) {
            profileDetailsRules.style['transform'] = 'translateX(-350px)';
            profileDetailsRules.style['position'] = 'absolute';
            profileDetailsRules.style['top'] = '0';
            profileDetailsRules.style['left'] = '0';
            expandCollapseButtonRules.style['left'] = '0';
            mainFirstDiv.classList.add('sidebar-collapse');
            expandCollapseButton.innerHTML = `<i class='bx bx-chevron-right'></i>`;
            bodyRules.style['display'] = 'flex';
            bodyRules.style['justify-content'] = 'center';
            bodyRules.style['align-items'] = 'center';
            mainRules.style['width'] = '86%';
        } else {
            removeCssPropertyFromRule(profileDetailsRules, 'transform');
            removeCssPropertyFromRule(profileDetailsRules, 'position');
            removeCssPropertyFromRule(profileDetailsRules, 'top');
            removeCssPropertyFromRule(profileDetailsRules, 'left');
            mainRules.style['width'] = '100vw';
            expandCollapseButtonRules.style['left'] = '-40px';
            mainFirstDiv.classList.remove('sidebar-collapse');
        }
    });
}

function workMenuHandler() {
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
    }

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



function alertToast(alertType, message) {
    let toast = document.createElement('div');
    toast.classList.add("alert", `alert-${alertType}`);
    toast.innerHTML = `<p>
                            ${message}
                       </p>`;

    mainFirstDiv.prepend(toast);

    const alert = document.querySelector('.alert');

    if (alert) {
        setTimeout(() => {
            alert.classList.add('dispose-alert');
            setTimeout(() => {
                alert.remove();
            }, 2000);
        }, 5000);

    }
}

function proceedAfterOrder() {
    const proceedBtn = document.querySelector('.proceed-after-order-button');
    console.log('IN PROCEED AFTER ORDER');
    proceedBtn.addEventListener('click', () => {
        customReplaceState(null, null, '/');
    });
}


export {
    profilHandler as profile,
    workMenuHandler as workFilter,
    programmingLanguageHandler as moreProgrammingLanguage,
    alertToast,
    proceedAfterOrder,
}