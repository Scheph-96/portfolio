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
        // case routes().orderSuccess.addressBarUrl:
        //     console.log('3 for order success');
        //     // loadPortfolioPages(routes().home.pageUrl);
        //     // customReplaceState(null, null, '/');

        //     break
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
        if (path === '/order-success') {
            console.log('IS ORDER SUCCESS:: THE COUNT: ', count);
            count+=1;
            console.log('AFTER COUNT: ', count);
            if (count === 2) {
                console.log('COUNT 2');
                routeLoader('/default');
                return
            }
        }
        routeLoader(path);
    } 
}

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