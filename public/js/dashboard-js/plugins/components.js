// THE FILE HOLD HOLD THE COMPONENTS THAT HAVE TO BE DYNAMICALLY ADD TO THE VIEW


/**
 * Create and return a notification dot
 * 
 * @returns 
 */
function notificationComponent() {

    const tempContainer = document.createElement('div');
    tempContainer.id = "notification-dot"
    tempContainer.innerHTML = `
        <span class="notification-component"></span>
    `;

    return tempContainer;

}

/**
 * Create and return a new table row (tr) containing
 * informations about the new Order
 * 
 * @param {*} newOrder A new Order
 * @returns 
 */
function newOrderComponent(newOrder) {
    const tempContainer = document.createElement('tr');
    tempContainer.setAttribute("new-order-number", newOrder.orderNumber);
    tempContainer.innerHTML = `
    <td class="title-section">
        <div class="icon-container new">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24">
            <path fill="silver" d="m17.275 20.25l3.475-3.45l-1.05-1.05l-2.425 2.375l-.975-.975l-1.05 
                    1.075zM6 9h12V7H6zm12 14q-2.075 0-3.537-1.463T13 18q0-2.075 1.463-3.537T18 13q2.075 0 3.538 
                    1.463T23 18q0 2.075-1.463 3.538T18 23M3 22V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 
                    5v6.675q-.7-.35-1.463-.513T18 11H6v2h7.1q-.425.425-.787.925T11.675 
                    15H6v2h5.075q-.05.25-.062.488T11 18q0 1.05.288 2.013t.862 1.837L12 22l-1.5-1.5L9 
                    22l-1.5-1.5L6 22l-1.5-1.5z" />
            </svg>
        </div>
        <p>${newOrder.customer}</p>
    </td>
    <td class="service">
        <p>${newOrder.service}</p>
    </td>
    <td class="time">
        <p>${newOrder.time}</p>
    </td>`;

    return tempContainer;
}

/**
 * Create and return a popup containing every detail about an Order
 * 
 * @param {*} orderDetail an html representation of all the information about a specific Order (All the details)
 * @returns 
 */
function orderTableRowPopup(orderDetail) {
    const tempContainer = document.createElement('div');
    tempContainer.classList.add("table-row-popup-container");

    tempContainer.innerHTML = orderDetail;

    return tempContainer;
}


export {
    notificationComponent,
    newOrderComponent,
    orderTableRowPopup,
}