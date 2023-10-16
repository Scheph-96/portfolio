import { switchTheme, switchPage, collapseExtendMenuSideBar, __init__ } from "./plugins/website_events.js";


const main = () => {
    __init__();
    switchTheme();
    switchPage();
    collapseExtendMenuSideBar();
}

window.onload = main();