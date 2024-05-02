import { newOrderComponent, notificationComponent } from "./components.js";

function orderUpdateHandler(newOrder) {
    const newOrderBlock = document.querySelector('.new-order-block-tbody');

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
        console.log("WE ARE ON ORDER PAGE");

        newOrderBlock.prepend(newOrderComponent(newOrder));
    }
}


export {
    orderUpdateHandler
}