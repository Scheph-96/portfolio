import { AjaxRequest } from "../../tools/ajax_req.tool.js";
import { alertToast } from "../../tools/util.js";
import { newOrderComponent, notificationComponent, orderTableRowPopup } from "./components.js";
import { tableRowOnClick } from "./website_events.js";

function orderUpdateHandler(newOrder) {
    const newOrderBlock = document.querySelector('.new-order-block-tbody');
    const body = document.querySelector('body');

    /** 
     * Witch means that thd current loaded page is not order page 
     * so that a notification dot is added on the order icon
     * in the sidebar menu 
     */
    if (!newOrderBlock) {
        const menuOrderIcon = document.querySelector('.dashboard-menu-sidebar-icon.order-icon');

        console.log("MENU ORDER ICON: ", notificationComponent);
        console.log("MENU ORDER ICON TYPE: ", typeof notificationComponent);

        menuOrderIcon.appendChild(notificationComponent());
        
    } else {
        let ajaxRequest = new AjaxRequest();
        console.log("WE ARE ON ORDER PAGE");
        const orderComponent = newOrderComponent(newOrder);
        newOrderBlock.prepend(orderComponent);

        orderComponent.addEventListener('click', tableRowOnClick);
    }
}


export {
    orderUpdateHandler
}