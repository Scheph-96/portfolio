import { websocketClient } from "./plugins/websocket_client.js";
import { switchTheme, switchPage, collapseExtendMenuSideBar, __init__, displayProfileInner, adminLogout } from "./plugins/website_events.js";


const main = () => {
    __init__();
    switchTheme();
    switchPage();
    collapseExtendMenuSideBar();
    displayProfileInner();
    adminLogout();

    websocketClient();
}

window.onload = main();