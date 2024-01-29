import { routes } from "../portfolio-js/routes/routes.js";
import { loadPortfolioPages } from "../portfolio-js/plugins/navigation.js";


function routeLoader(path, param = null) {
    // const path = window.location.pathname;
    console.log('THE PARAM: ', param);
    console.log('THE PATH: ', path);

    switch (path) {
        case routes().home.addressBarUrl:
            console.log('1 for home');
            loadPortfolioPages(routes().home.pageUrl);
            console.log('AFTER LOAD PAGE');

            break
        case routes(param).order.addressBarUrl:
            console.log('2 for order');
            loadPortfolioPages(routes(param).order.pageUrl);

            break
        case routes(param).moreWork.addressBarUrl:
            console.log('4 for moreWork');
            loadPortfolioPages(routes(param).moreWork.pageUrl);

            break
        case routes(param).moreRecommendation.addressBarUrl:
            console.log('5 for moreRecommendation');
            loadPortfolioPages(routes().moreRecommendation.pageUrl);

            break
        case routes(param).review.addressBarUrl:
            console.log('6 for review');
            loadPortfolioPages(routes(param).review.pageUrl);
            // customReplaceState(null, null, '/');

            break

            break
        
        default:
            // mainContentContainer.innerHTML = 'UKNOWN PATH';
            console.log('UKNOWN PATH');
            loadPortfolioPages(routes().default.pageUrl);
            break;
    }
}

function renderContentBaseOnUrl() {
    const path = window.location.pathname;
    let count = 0;
    let splittedPath = path.split('/');
    console.log('SPLITTED PATH: ', splittedPath);
    console.log('LENGTH: ', splittedPath.length);
    /** 
     * Because when we split "/" we get ["", ""] 
     * and when we split "/path" we get ["", "path"]
     * in this code parameters are allowed only at the end
     * when the path looks like /path/param then on split
     * we get ["", "path", "param"]
    */
    if (path !== '/' && splittedPath.length > 2) {
        // pass the parameter to routeLoader
        routeLoader(path, splittedPath[splittedPath.length - 1]);
    } else if (path === '/' || splittedPath.length < 3) {
        console.log('< 3');
        if (path === routes().orderSuccess.addressBarUrl || path === routes().reviewSuccess.addressBarUrl) {
            // order success page have to be shown once
            console.log('IS ORDER SUCCESS/ORDER SUCCESS:: THE COUNT: ', count);
            // Count how many order success page is loaded
            count+=1;
            // if it's load once then redirect to the page
            console.log('AFTER COUNT: ', count);
            if (count === 2) { // but it's load a second time then load 404 page
                console.log('COUNT 2');
                routeLoader('/default');
                return
            }
        }
        routeLoader(path);
    } 
}

/**
 * Push to the history stack
 * @param {*} state 
 * @param {*} title 
 * @param {*} url 
 */
function customPushState(state=null, title=null, url) {
    window.history.pushState(state, title, url);

    window.dispatchEvent(new CustomEvent('pushstate', {
        detail: {
            state: state,
            title: title,
            url: url,
        }
    }));
}

/**
 * Replace in the history stack
 * @param {*} state 
 * @param {*} title 
 * @param {*} url 
 */
function customReplaceState(state=null, title=null, url) {
    window.history.replaceState(state, title, url);

    window.dispatchEvent(new CustomEvent('replacestate', {
        detail: {
            state: state,
            title: title,
            url: url,
        }
    }));
}


export {
    routeLoader,
    renderContentBaseOnUrl,
    customPushState,
    customReplaceState,
}