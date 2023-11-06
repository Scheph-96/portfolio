import { AjaxRequest } from "../../tools/ajax_req.tool.js";
import { homeDependencieMain } from "./pages-dependencies/home_dependencies.js";
import { orderDependenciesMain } from "./pages-dependencies/order_dependencies.js";
import { proceedAfterOrder } from "./website_events.js"


const mainContentContainer = document.querySelector('.main-content .container');

let ajaxRequest = new AjaxRequest();

/**
 * 
 * @param {String} page 
 */
function loadPortfolioPages(page) {

    ajaxRequest.loadHtml(page, mainContentContainer, null);

    // ajaxRequest.loadEndPoint(page)
    //     .then((result) => {
    //         mainContentContainer.innerHTML = result;
    //         mainContentContainer.scrollTop = 0;

    //         if (page.includes('order')) {
    //             execOrder();
    //         }
    //     })
    //     .catch((error) => {
    //         console.error('PAGE LOAD ERROR: ', error);
    //     });
    // console.log('OUT THEN');
}

function contentHandlerOnRawCode(pageContent) {
    mainContentContainer.innerHTML = pageContent;
    mainContentContainer.scrollTop = 0;

    const path = window.location.pathname;

    console.log('THE PATH FOR RAW CODE: ', path);
    if (path === '/order-success') {
        proceedAfterOrder();
    }
}

function contentHandlerOnEvent() {
    mainContentContainer.addEventListener('file-loaded', (e) => {
        const path = window.location.pathname;

        mainContentContainer.innerHTML = e.detail.data;
        mainContentContainer.scrollTop = 0;

        if (path.includes('/order/')) {
            orderDependenciesMain();
        } else if (path === '/') {
            homeDependencieMain();
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