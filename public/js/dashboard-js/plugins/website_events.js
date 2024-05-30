import { AjaxRequest } from '../../tools/ajax_req.tool.js';
import { themeEvent, getCssRule, getFilename } from '../tools/util.js';
import { lineChart, barChart, pieChart } from './charts.js';
import { MyLocalStorage } from "./persistent_data/local_storage.js";
import { customPushState, customReplaceState } from "../../tools/route_loader.tool.js";
import { alertToast } from '../../tools/util.js';
import { notificationComponent, orderTableRowPopup } from './components.js';
// import { emailClick } from "../pages_features/mailbox_features.js";


const body = document.querySelector('body');
const menuSideBar = document.querySelector('.menu-side-bar');
const themeSwitcher = document.querySelector('.theme-switcher');
const themeTitle = document.querySelector('.theme-title');
const switchBtn = document.querySelector('.switch-btn');
const menuItems = document.querySelectorAll('.sidebar-menu-item');
const mainContent = document.querySelector('.main-content');
const headerLogo = document.querySelector('.logo');
const profile = document.querySelector('.profile-info .profile');
const profileInner = document.querySelector('.profile-info .profile-info-inner');
const profileInnerActions = document.querySelectorAll('.profile-info-inner .actions .profile-action')


let chart, dropdown, cssMainRule, gridContainerRule,
    mainContentRule, localStorage, proceedBtn, proceedWithoutLocalStorage = false;

// Create new AjaxRequest instance use to navigate through the pages using XMLHttpRequest
let ajaxRequest = new AjaxRequest();

// All available pages in the pages folder
const pages = {
    dashboard: 'dashboard',
    order: 'order',
    projects: 'projects',
    customers: 'customers',
    mailbox: 'mailbox',
    income: 'income',
    analytics: 'analytics',
}

// All localStorage keys used in this file (I can't remember them)
const localStorageKeys = {
    scrollPosition: 'scrollPosition',
    theme: 'theme',
    menuCollapse: 'menuCollapse',
    currentPageLoaded: 'currentPageLoaded',
}

try {
    // Create new instance of MyLocalStorage
    localStorage = new MyLocalStorage('localStorage');
} catch (error) {

    let newDiv = document.createElement('div');
    newDiv.classList.add('ls-error-container');
    // Load the error message in the newly created div
    newDiv.innerHTML = `
        <div class="ls-error-content">
            <h1>Local Storage is disabled</h1>
            <p>Some functionnalities of the website may not work</p>
            <button class="proceed-with-no-ls">Proceed anyway</button>
            <p>Have you enable it? Then reload the page</p>
        </div>`;
    // Add the created div to body
    body.appendChild(newDiv);

    // Get the error message button
    proceedBtn = document.querySelector('.proceed-with-no-ls');

    // add event listener on the error message button the remove the newly created div
    proceedBtn.addEventListener('click', () => {
        body.removeChild(document.querySelector('.ls-error-container'));
        // set to true to tell that there is no need to throw an error because the
        // user is aware that localStorage in unavailable
        proceedWithoutLocalStorage = true;
    });
}

/**
 * Reload website settings (call when the page is reload)
 */
function __init__() {
    try {
        cssMainRule = getCssRule('dashboard-style.css', 'main');
        gridContainerRule = getCssRule('dashboard-style.css', '.grid-container');
        mainContentRule = getCssRule('dashboard-style.css', 'main .main-content');

        // if theme was dark re-enable it
        if (localStorage.getData(localStorageKeys.theme) === 'dark') {
            body.classList.add('dark');
            switchBtn.style.transform = 'translateX(100%)';
        }

        // if the sidebar menu is collapse keep it like that (true is store as a string not a bool)
        if (localStorage.getData(localStorageKeys.menuCollapse) === 'true') {
            collapseMenu(cssMainRule, gridContainerRule, mainContentRule);
        }

        // if there is a page stored restore it
        if (localStorage.getData(localStorageKeys.currentPageLoaded)) {
            ajaxRequest.loadHtml("/load-admin-pages/" + localStorage.getData(localStorageKeys.currentPageLoaded), mainContent, null);
            loadRequirements(true);
        }
    } catch (error) {
        proceedWithoutLocalStorageFoo(proceedWithoutLocalStorage, error);
    }
}

/**
 * Method that handle the dashboard theme
*/
function switchTheme() {
    themeSwitcher.addEventListener('click', () => {
        try {
            chart = document.querySelector('.my-chart');
            body.classList.toggle('dark');

            if (body.classList.contains('dark')) {
                themeTitle.innerHTML = "Light Mode";
                switchBtn.style.transform = 'translateX(100%)';
                localStorage.setData('theme', 'dark');
            } else {
                themeTitle.innerHTML = "Dark Mode";
                switchBtn.style.transform = 'translateX(0%)';
                localStorage.setData('theme', 'light');
            }
        } catch (error) {
            proceedWithoutLocalStorageFoo(proceedWithoutLocalStorage, error);
        } finally {
            if (document.body.contains(chart)) {
                chart.dispatchEvent(themeEvent); // fire this event to notify the theme change
            }
        }


    });
}

/**
 * Method to display or hide the profile panel
 */
function displayProfileInner() {
    try {
        let profileInnerRule = getCssRule('dashboard-style.css', 'header .header-tools .profile-info-inner');

        profile.addEventListener('click', () => {
            if (profileInnerRule.style['opacity'] == '0') {
                profileInnerRule.style['opacity'] = '1';
            } else {
                profileInnerRule.style['opacity'] = '0';
            }
        }, false);

        document.addEventListener('click', (e) => {
            if (!profileInner.contains(e.target) && e.target != profile) {
                profileInnerRule.style['opacity'] = '0';
            }
        }, true);
    } catch (error) {
        console.log("DISPLAY PROFILE INNER ERROR: ", error);
    }
}

/**
 * Method to log the admin out
 */
function adminLogout() {
    for (let i = 0; i < profileInnerActions.length; i++) {
        profileInnerActions[i].addEventListener('click', async (e) => {
            try {
                let isClicked = false;
                profileInnerActions[i].disabled = true;
                if (!isClicked) {
                    isClicked = true;
                    const clickedElement = e.currentTarget;
                    ajaxRequest.loadEndPoint("/sc-admin/profile/actions/" + clickedElement.getAttribute('action'))
                        .then((result) => {
                            console.log("THE LOGIN RESULT: ", result);
                            if (result.message) {
                                alertToast(result.type, result.message);
                            }

                            if (result.redirectionUrl) {
                                window.location.href = window.location.origin + result.redirectionUrl;
                            }
                        })
                        .catch((error) => {
                            if (error.errorMessage) {
                                alertToast(error.errorMessage.type, error.errorMessage.message);
                                if (error.errorMessage.redirectionUrl) {
                                    window.location.href = window.location.origin + error.errorMessage.redirectionUrl;
                                }
                            } else {
                                console.log(`ERR::::::::::::`);
                                console.error(`ERROR:: ${error.error}`);
                                console.error(`JUST ERROR: ${error}`);
                                alertToast('danger', 'Unexpected error. Please try again!');
                            }
                        }).finally(() => {
                            isClicked = false;
                            profileInnerActions[i].disabled = false;
                        });
                }

            } catch (error) {
                console.log("LOGOUT ERROR: ", error);
            }


        })
    }
}

/**
 * Method to naviguate through the dashboard pages 
 */
function switchPage() {
    // add an event listener to each menu item
    for (let i = 0; i < menuItems.length; i++) {
        menuItems[i].addEventListener('click', (e) => {
            const clickedElement = e.currentTarget;
            loadRequirements(true, clickedElement);

            try {
                // load page for each menu item clicked
                switch (e.currentTarget.getAttribute('menu-item-type')) {
                    case 'dashboard':

                        ajaxRequest.loadHtml("/load-admin-pages/" + e.currentTarget.getAttribute('menu-item-type'), mainContent, null);

                        break;

                    case 'order':

                        const menuOrderIcon = document.querySelector('.dashboard-menu-sidebar-icon.order-icon');
                        const notificationDot = document.getElementById('notification-dot');

                        if (notificationDot) {
                            menuOrderIcon.removeChild(notificationDot);
                        }

                        ajaxRequest.loadHtml("/load-admin-pages/" + e.currentTarget.getAttribute('menu-item-type'), mainContent, null);

                        break;

                    case 'projects':

                        ajaxRequest.loadHtml("/load-admin-pages/" + e.currentTarget.getAttribute('menu-item-type'), mainContent, null);

                        break;

                    case 'customers':

                        ajaxRequest.loadHtml("/load-admin-pages/" + e.currentTarget.getAttribute('menu-item-type'), mainContent, null);

                        break;

                    case 'mailbox':

                        ajaxRequest.loadHtml("/load-admin-pages/" + e.currentTarget.getAttribute('menu-item-type'), mainContent, null);

                        break;

                    case 'income':

                        ajaxRequest.loadHtml("/load-admin-pages/" + e.currentTarget.getAttribute('menu-item-type'), mainContent, null);

                        break;

                    case 'analytics':

                        ajaxRequest.loadHtml("/load-admin-pages/" + e.currentTarget.getAttribute('menu-item-type'), mainContent, null);

                        break;

                    default:

                        ajaxRequest.loadHtml("/load-admin-pages/" + "default", mainContent, null);

                        break;
                }
            } catch (error) {
                console.error("SWITCH PAGE ERROR: ", error);
            }

        });

    }
}

/**
 * Method that load the each page requirements
 * 
 * @param {boolean} once execute the event listener once
 * @param {Node} clickedElement the menu item clicked in the sidebar menu
 */
function loadRequirements(once, clickedElement = null) {

    // the name of the page load from localStorage
    let pageName;

    // listen to file-loaded event, event fire by ajaxRequest object the needed page is load
    mainContent.addEventListener('file-loaded', (readyEvent) => {
        try {
            // in case clickedElement doesn't exist it means that the event is listening from the __init__ function
            // in that case we just load from localStorage the page stored
            if (!clickedElement) {
                pageName = localStorage.getData(localStorageKeys.currentPageLoaded);
            }

            for (let j = 0; j < menuItems.length; j++) {
                // remove the highlight where it exist
                if (menuItems[j].classList.contains('active-menu')) {
                    menuItems[j].classList.remove('active-menu');
                }

                // highlight menu item if the current menu item lead to the page load from localStorage
                if (menuItems[j].getAttribute('menu-item-type') === pageName) {
                    menuItems[j].classList.add('active-menu');
                    break;
                }
            }

            // in case clickedElement exist it means that the event is listening from switchPage 
            // function and the user has clicked on one of the menu item so we highlight it 
            if (clickedElement && !clickedElement.classList.contains('active-menu')) {
                clickedElement.classList.add('active-menu');
            }

            // load the page in mainContent
            mainContent.innerHTML = readyEvent.detail.data;

            /** 
             * this if else...if block load depedencies for each page
             * each condition check if the event is listening from switchPage or __init__
             *
             * if it's from switchPage(the user click on a menu item on the side bar) clickedElement exist,
               we check the menu-item-type attribute to return the needed dependency
             *
             * if it's from __init__(the page just reload) clickedElement doesn't exist, we check the pageName 
               that we get from localStorage above to return the needed dependency
            */
            if ((clickedElement && clickedElement.getAttribute('menu-item-type') === 'dashboard') || pageName === 'dashboard') {
                dashboardPageRequirements();
            } else if ((clickedElement && clickedElement.getAttribute('menu-item-type') === 'order') || pageName === 'order') {
                orderRequirements();
            } else if ((clickedElement && clickedElement.getAttribute('menu-item-type') === 'projects') || pageName === 'projects') {
                projectsPageRequirements();
            } else if ((clickedElement && clickedElement.getAttribute('menu-item-type') === 'customers') || pageName === 'customers') {
                customersPageRequirements();
            } else if ((clickedElement && clickedElement.getAttribute('menu-item-type') === 'mailbox') || pageName === 'mailbox') {
                mailboxPageRequirements();
            } else if ((clickedElement && clickedElement.getAttribute('menu-item-type') === 'income') || pageName === 'income') {
                incomePageRequirements();
            } else if ((clickedElement && clickedElement.getAttribute('menu-item-type') === 'analytics') || pageName === 'analytics') {
                analyticsPageRequirements();
            }

        } catch (error) {
            proceedWithoutLocalStorageFoo(proceedWithoutLocalStorage, error);
            console.log(`loadRequirements ERROR: ${error}`);
        }

    }, { once: once });
}

/**
 * Method to handle the dropdown in the chart
 */
function dropdownHandler() {
    dropdown = document.querySelector('.dropdown');
    let cssRule = getCssRule('dashboard-style.css', '.dropdown-content');
    dropdown.addEventListener('click', () => {
        if (cssRule.style['transform'] == 'scaleY(0)') {
            cssRule.style['transform'] = 'scaleY(1)';
        } else {
            cssRule.style['transform'] = 'scaleY(0)';
        }
    });
}

/**
 * Method to manipulate menu sidebar size
*/
function collapseExtendMenuSideBar() {
    headerLogo.addEventListener('click', () => {
        try {
            if (!menuSideBar.classList.contains('collapse')) {
                collapseMenu(cssMainRule, gridContainerRule, mainContentRule);
            } else {
                extendMenu(cssMainRule, gridContainerRule, mainContentRule);
            }
        } catch (error) {
            proceedWithoutLocalStorageFoo(proceedWithoutLocalStorage, error);
        }
    });
}

function collapseMenu(cssMainRule, gridContainerRule, mainContentRule) {
    cssMainRule.style['grid-template-columns'] = '80px auto';
    gridContainerRule.style['grid-auto-columns'] = '270px';
    gridContainerRule.style['gap'] = '2rem';
    mainContentRule.style['display'] = 'flex';
    mainContentRule.style['justify-content'] = 'center';
    menuSideBar.classList.add('collapse');
    localStorage.setData(localStorageKeys.menuCollapse, true);
}

function extendMenu(cssMainRule, gridContainerRule, mainContentRule) {
    cssMainRule.style['grid-template-columns'] = '230px auto';
    gridContainerRule.style['grid-auto-columns'] = '259.61px';
    gridContainerRule.style['gap'] = '1rem';
    mainContentRule.style['display'] = '';
    mainContentRule.style['justify-content'] = '';
    menuSideBar.classList.remove('collapse');
    localStorage.setData(localStorageKeys.menuCollapse, false);
}

function dashboardPageRequirements() {
    // lineChart();
    barChart(true);
    dropdownHandler();
    localStorage.setData(localStorageKeys.currentPageLoaded, pages.dashboard);
}
function orderRequirements() {
    tableRowDataDetail();
    localStorage.setData(localStorageKeys.currentPageLoaded, pages.order);
}
function projectsPageRequirements() {
    barChart(false);
    dropdownHandler();
    localStorage.setData(localStorageKeys.currentPageLoaded, pages.projects);
}
function customersPageRequirements() {
    pieChart();
    localStorage.setData(localStorageKeys.currentPageLoaded, pages.customers);
}
function mailboxPageRequirements() {
    // for (let i = 0; i < emails.length; i++) {
    //     // emails[i].addEventListener('click', () => {
    //         // emailClick(emails[i], inboxContent);
    //     // });
    // }
    localStorage.setData(localStorageKeys.currentPageLoaded, pages.mailbox);
}
function incomePageRequirements() {
    localStorage.setData(localStorageKeys.currentPageLoaded, pages.income);
}
function analyticsPageRequirements() {
    localStorage.setData(localStorageKeys.currentPageLoaded, pages.analytics);
}

function tableRowDataDetail() {
    try {
        const tableRows = document.querySelectorAll('tbody tr');

        for (let i = 0; i < tableRows.length; i++) {
            tableRows[i].addEventListener('click', tableRowOnClick);
        }

        document.addEventListener('click', (e) => {
            const tableRowPopupContainer = document.querySelector('.table-row-popup-container');
            const tableRowPopup = document.querySelector('.table-row-popup');
            const tableRowPopupContent = document.querySelector('.table-row-popup-content');
            const submitBtnSection = document.querySelector('.submit-btn-section');

            if (tableRowPopupContainer) {
                if (!tableRowPopup.contains(e.target)) {
                    console.log("THE CLICK:: TARGET: ", e.target);
                    body.removeChild(tableRowPopupContainer);
                }
            }
        });
    } catch (error) {
        console.error("ERROR IN TABLE RAW DETAIL: ", error);
    }
}

function tableRowOnClick(event) {
    ajaxRequest.loadEndPoint(`/load-data/detail/${event.currentTarget.getAttribute('type')}/${event.currentTarget.getAttribute('number')}`)
        .then((data) => {
            body.appendChild(orderTableRowPopup(data.page));

            const cancelBtn = document.querySelectorAll('.close-popup');
            const rejectBtn = document.querySelector('.close-popup .reject');
            const acceptBtn = document.querySelector('.close-popup .accept');

            const tableRowPopupContainer = document.querySelector('.table-row-popup-container');

            for (let cancelIndex = 0; cancelIndex < cancelBtn.length; cancelIndex++) {
                cancelBtn[cancelIndex].addEventListener('click', () => {
                    body.removeChild(tableRowPopupContainer);
                }, { once: true });
            }

            // rejectBtn.addEventListener('click', () => {
            //     ajaxRequest.loadEndPoint();
            // });

        })
        .catch((error) => {
            console.error("TABLE RAW DETAIL REQUEST ERROR: ", error);
            if (error.errorMessage) {
                alertToast(error.errorMessage.type, error.errorMessage.message);
            }
        });

}

/**
 * Do not raise an error when the user know that localStorage in unavailable
 * 
 * @param {boolean} proceedWithoutLocalStorage whether the user choose to use the website with localStorage or not
 * @param {error} error error raised while trying to use unavailable localStorage
*/
function proceedWithoutLocalStorageFoo(proceedWithoutLocalStorage, error) {
    /**
     * proceedWithoutLocalStorage is true (the user choose to continue without localStorage) 
     * check if the error raised is from localStorage
     * error.message is different on firefox and other browsers
     */
    if (proceedWithoutLocalStorage &&
        error.name === 'TypeError' &&
        // other browsers
        (error.message.includes('Cannot read properties of undefined')
            // firefox
            || error.message === 'localStorage is undefined')) { console.log('Authorized'); }
}




export {
    __init__,
    switchTheme,
    switchPage,
    collapseExtendMenuSideBar,
    displayProfileInner,
    adminLogout,
    tableRowOnClick,
}