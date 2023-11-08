import { profile, moreProgrammingLanguage } from './plugins/website_events.js';
import { contentHandlerOnEvent, contentHandlerOnRawCode } from './plugins/navigation.js';
import { renderContentBaseOnUrl } from "../tools/route_loader.tool.js";




const main = () => {
    profile();
    moreProgrammingLanguage();
    renderContentBaseOnUrl();
    contentHandlerOnEvent();

    window.addEventListener('popstate', (e) => {
        // Event triggered when the user navigate backward or forward
        // in the browsing history using the browser navigation buttons
        console.log('POPSTATE');
        renderContentBaseOnUrl();

        e.preventDefault();
    });

    /**
     * The event.detail.state represent the state object associated
     * with the current history entry when the 'popstate' event is triggered.
     * The state object is set when we use the 'pushState' or 'replacestate' 
     * method to add an entry to the browser history stack
    */
    window.addEventListener('pushstate', (event) => {
        console.log('PUSHSTATE');
        if (event.detail.state) {
            console.log('THERe IS A STATE');
            contentHandlerOnRawCode(event.detail.state);
        }

        renderContentBaseOnUrl();
    });

    window.addEventListener('replacestate', (event) => {
        console.log('REPLACESTATE');

        if (event.detail.state) {
            console.log('THERE IS A STATE IN REP');

            contentHandlerOnRawCode(event.detail.state);
        }

        renderContentBaseOnUrl();
    })

    // window.addEventListener('resize', () => {
    //     console.log('Screen resized');

    //     const screenWidth = window.innerWidth;
    //     const screenHeight = window.innerHeight;

    //     console.log(`Window width: ${screenWidth}, Window height: ${screenHeight}`);
    // })
}

window.onload = main;


