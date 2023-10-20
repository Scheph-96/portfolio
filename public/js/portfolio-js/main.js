import { profile, workFilter, moreProgrammingLanguage, orderHandler, fadeAlert } from './plugins/website_events.js';


const main = () => {
    profile();
    workFilter();
    moreProgrammingLanguage();
    orderHandler();
    fadeAlert();
}

window.onload = main;


