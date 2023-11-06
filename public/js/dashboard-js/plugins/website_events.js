import { themeEvent, getCssRule, getFilename } from '../tools/util.js';
import { AjaxRequest } from '../../services/load_file.service.js';
import { lineChart, barChart, pieChart } from './charts.js';
import { MyLocalStorage } from "./persistent_data/local_storage.js";
// import { emailClick } from "../pages_features/mailbox_features.js";


const body = document.querySelector('body');
const menuSideBar = document.querySelector('.menu-side-bar');
const themeSwitcher = document.querySelector('.theme-switcher');
const themeTitle = document.querySelector('.theme-title');
const switchBtn = document.querySelector('.switch-btn');
const menuItems = document.querySelectorAll('.sidebar-menu-item');
const mainContent = document.querySelector('.main-content');
const headerLogo = document.querySelector('.logo');
const inboxContent = document.querySelector('inbox-content');
const emails = document.querySelectorAll('.email');


let chart, dropdown, cssMainRule, gridContainerRule,
    mainContentRule, localStorage, proceedBtn, proceedWithoutLocalStorage = false;

// Create new AjaxRequest instance use to navigate through the pages using XMLHttpRequest
let ajaxRequest = new AjaxRequest();

// All available pages in the pages folder
const pages = {
    dashboard: '/js/dashboard-js/pages/dashboard.ejs',
    projects: '/js/dashboard-js/pages/projects.ejs',
    customers: '/js/dashboard-js/pages/customers.ejs',
    mailbox: '/js/dashboard-js/pages/mailbox.ejs',
    income: '/js/dashboard-js/pages/income.ejs',
    analytics: '/js/dashboard-js/pages/analytics.ejs',
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
        cssMainRule = getCssRule('style.css', 'main');
        gridContainerRule = getCssRule('style.css', '.grid-container');
        mainContentRule = getCssRule('style.css', 'main .main-content');

        // if theme was dark re-enable it
        if (localStorage.getData(localStorageKeys.theme) === 'dark') {
            body.classList.add('dark');
        }

        // if the sidebar menu is collapse keep it like that (true is store as a string not a bool)
        if (localStorage.getData(localStorageKeys.menuCollapse) === 'true') {
            collapseMenu(cssMainRule, gridContainerRule, mainContentRule);
        }

        // if there is a page stored restore it
        if (localStorage.getData(localStorageKeys.currentPageLoaded)) {
            ajaxRequest.loadHtml(localStorage.getData(localStorageKeys.currentPageLoaded), mainContent, null);
            navigation(true);
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
 * Method to naviguate through the dashboard pages 
 */
function switchPage() {
    // add an event listener to each menu item
    for (let i = 0; i < menuItems.length; i++) {
        menuItems[i].addEventListener('click', (e) => {
            const clickedElement = e.currentTarget;
            navigation(true, clickedElement);

            try {
                // load page for each menu item clicked
                switch (e.currentTarget.getAttribute('menu-item-type')) {
                    case 'dashboard':

                        ajaxRequest.loadHtml(pages.dashboard, mainContent, null);

                        break;

                    case 'projects':

                        ajaxRequest.loadHtml(pages.projects, mainContent, null);

                        break;

                    case 'customers':

                        ajaxRequest.loadHtml(pages.customers, mainContent, null);

                        break;

                    case 'mailbox':

                        ajaxRequest.loadHtml(pages.mailbox, mainContent, null);

                        break;

                    case 'income':

                        ajaxRequest.loadHtml(pages.income, mainContent, null);

                        break;

                    case 'analytics':

                        ajaxRequest.loadHtml(pages.analytics, mainContent, null);

                        break;

                    default:

                        console.log('default');

                        break;
                }
            } catch (error) {
            }

        });

    }
}

/**
 * Method that load the needed page
 * 
 * @param {boolean} once execute the vent listener once
 * @param {Node} clickedElement the menu clicked in the sidebar menu
 */
function navigation(once, clickedElement = null) {

    // the name of the page load from localStorage
    let pageName;

    // listen to file-loaded event, event fire by ajaxRequest object the needed page is load
    mainContent.addEventListener('file-loaded', (readyEvent) => {
        try {
            // in case clickedElement doesn't exist it means that the event is listening from the __init__ function
            // in that case we just load from localStorage the page stored
            if (!clickedElement) {
                pageName = getFilename(localStorage.getData(localStorageKeys.currentPageLoaded));
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
             * if it's from __init__(the page just load) clickedElement doesn't exist, we check the pageName 
               that we get from localStorage above to return the needed dependency
            */
            if ((clickedElement && clickedElement.getAttribute('menu-item-type') === 'dashboard') || pageName === 'dashboard') {
                dashboardPageRequirements();
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
            console.log(`NAVIGATION ERROR: ${error}`);
        }

    }, { once: once });
}

/**
 * Method to handle the dropdown
 */
function dropdownHandler() {
    dropdown = document.querySelector('.dropdown');
    let cssRule = getCssRule('style.css', '.dropdown-content');
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
    lineChart();
    barChart(true);
    dropdownHandler();
    localStorage.setData(localStorageKeys.currentPageLoaded, pages.dashboard);
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
function logoutRequirements() { }

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
}