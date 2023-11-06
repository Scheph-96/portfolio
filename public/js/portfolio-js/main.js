import { profile, workFilter, moreProgrammingLanguage } from './plugins/website_events.js';
import { contentHandlerOnEvent, contentHandlerOnRawCode } from './plugins/navigation.js';
import { contentBehaviorBasedOnUrl, customPushState } from "../tools/route_loader.tool.js";




const main = () => {
    profile();
    workFilter();
    moreProgrammingLanguage();
    contentBehaviorBasedOnUrl();
    contentHandlerOnEvent();
    
    
    window.addEventListener('popstate', () => {
        console.log('POPSTATE');
        contentBehaviorBasedOnUrl();
    });

    window.addEventListener('pushstate', (event) => {
        console.log('PUSHSTATE');
        if (event.detail.state) {
            console.log('THERe IS A STATE');
            contentHandlerOnRawCode(event.detail.state);
        }

        contentBehaviorBasedOnUrl();
    });

    window.addEventListener('replacestate', (event) => {
        console.log('REPLACESTATE');

        if (event.detail.state) {
            console.log('THERE IS A STATE IN REP');

            contentHandlerOnRawCode(event.detail.state);
        }

        contentBehaviorBasedOnUrl();
    })
    
}

window.onload = main;


