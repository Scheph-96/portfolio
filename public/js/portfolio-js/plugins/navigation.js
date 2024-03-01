import { AjaxRequest } from "../../tools/ajax_req.tool.js";
import { homeDependencieMain } from "./pages-dependencies/home_dependencies.js";
import { orderDependenciesMain } from "./pages-dependencies/order_dependencies.js";
import { recommendationsDependenciesMain } from "./pages-dependencies/recommendations_dependencies.js";
import { proceedAfterOrder } from "./website_events.js"
import { routes } from "../routes/routes.js";
import { reviewDependenciesMain } from "./pages-dependencies/review_dependencies.js";


const mainContentContainer = document.querySelector('.main-content .container');

let ajaxRequest = new AjaxRequest();

/**
 * This function is used to make the single page app possible
 * it load all the necessary page by calling @method loadHtml
 * which is a methos defined exclusively to render html code
 * @param {String} page the page to load
 */
function loadPortfolioPages(page) {
    ajaxRequest.loadHtml(page, mainContentContainer, null);
}

/**
 * This is used the request return a page. 
 * Like we can directly put the code in page 
 * without making another request to get the page
 * @param {*} pageContent the page returned by the request
 */
function contentHandlerOnRawCode(pageContent) {
    mainContentContainer.innerHTML = pageContent;
    mainContentContainer.scrollTop = 0;

    const path = window.location.pathname;

    console.log('THE PATH FOR RAW CODE: ', path);
    if (path === routes().orderSuccess.addressBarUrl || path === routes().reviewSuccess.addressBarUrl) {
        proceedAfterOrder();
    }
}

/**
 * This function listen to event triggered when the function loadPortfolioPages is called
 * It is in a separate function I to launch the listening at the moment the page is loaded
 * so that i dont't that to wait every single time loadPortfolioPages is called
 * this functioon is called in the file main.js (the first file called when the website is reload)
 * 
 */
function contentHandlerOnEvent() {
    console.log("CONTENT HANDLER ON EVENT");
    mainContentContainer.addEventListener('file-loaded', (e) => {
        console.log('IN MAIN CONTAINER FILE LOADED');
        const path = window.location.pathname;

        mainContentContainer.innerHTML = e.detail.data;
        mainContentContainer.scrollTop = 0;
        if (path === '/') {
            homeDependencieMain();
        } else if (path.includes('/order/')) {
            orderDependenciesMain();
        } else if (path.includes('/recommendations')) {
            recommendationsDependenciesMain();
        } else if (path.includes('/review/')) {
            reviewDependenciesMain();
        }
        // if (!splittedPath) {
        //     orderPageHandler();
        //     return;
        // }

        // switch (splittedPath[splittedPath.length - 1]) {
        //     case value:

        //         break;

        //     default:
        //         break;
        // }
    });
}







export {
    loadPortfolioPages,
    contentHandlerOnEvent,
    contentHandlerOnRawCode,
}