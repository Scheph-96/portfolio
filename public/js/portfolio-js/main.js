import { profile, workFilter, moreProgrammingLanguage, orderHandler } from './plugins/website_events.js';


const main = () => {
    profile();
    workFilter();
    moreProgrammingLanguage();
    orderHandler();
}

window.onload = main;


