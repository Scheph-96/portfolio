import { websocketClient } from "../tools/websocket_client.js";
import { switchTheme, switchPage, collapseExtendMenuSideBar, __init__, displayProfileInner } from "./plugins/website_events.js";


const main = () => {
    __init__();
    switchTheme();
    switchPage();
    collapseExtendMenuSideBar();
    displayProfileInner();
    websocketClient();
}

window.onload = main();