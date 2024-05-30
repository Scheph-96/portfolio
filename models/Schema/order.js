const mongoose = require('mongoose');
const OrderType = require('../enums/order_type');
const { generateUUID_V4, parseNewOrder } = require('../../tools/util.tool');
const { socketPortalEvent } = require('../class/socket_portal');
const NotificationCrud = require('../../model_crud/notification_crud');

/**
 * THE LOGIC:
 * Specifications are not mandatory but description is.
 * By default we demand the description. That's why when none of description or specification exist
 * we send "Description is required" back to the user because description MUST AT LEAST EXIST! 
 * The user can provide both desciption and specifications but
 * the important one is description.
 * That means an order can be submitted only with specification or only with description
 * But not without both
 * That's why to set which one is required we chech on specification if there is no desciption
 * if there is no description then specifications is required
 * In the same way, when there is no specification description is required
*/
const orderSchema = new mongoose.Schema({
    service: {
        type: String,
        validate: {
            validator: (data) => {
                return /^([a-zA-Z\-]+)$/.test(data);
            },
            message: props => `${props.value} is not a valid service`
        },
        required: true,
    },
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        validate: {
            validator: (data) => {
                return /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(data);
            },
            message: props => `${props.value} is not a valid email`
        },
        required: [true, `Email is required`],
    },
    specifications: {
        type: Boolean,
        required: [function () {
            /**
             * if there is no description then specifications is required
            */
            return !this.description;
        }, 'Specififcations is required'],
    },
    description: {
        type: String,
        required: [function () {
            /**
             * if there is no specifications and no description then description is required
             * if there is no specifications and the description trim return 0 description is required
            */
            return !this.specifications && (!this.description || this.description.trim().length === 0);
        }, 'Description is required']
    },
    status: {
        type: String,
        enum: OrderType.enums,
        default: OrderType.enum.new,
        required: true,
    },
    // To track and recognize each order
    orderNumber: {
        type: String,
        default: generateUUID_V4,
        required: true,
    },
    created: {
        type: Date,
        default: Date.now,
        required: true,
    }
});

const [newOrderSchema, ordinaryOrder] = [orderSchema, orderSchema]


newOrderSchema.post('save', async (newOrder) => {
    /**
     * Do not add a try..catch here.
     * 
     * Any error taised in this function will be catched
     * in the catch block of order.create in app-http.js
     * in the '/submit-order' endpoint
     */

    let parsedOrder = await parseNewOrder(newOrder);
    let notificationCrud = new NotificationCrud();
    await notificationCrud.update({type: "order"}, {notify: true})
    socketPortalEvent.emit(socketPortalEvent.events.newOrderCreated, { data: parsedOrder, type: "order" });
});

// arg1: Model Name
// arg2: Schema
// arg3: collection name in the database
module.exports = {
    NewOrder: mongoose.model('NewOrder', newOrderSchema, 'new_order'),
    Order: mongoose.model('Order', ordinaryOrder, 'order')
}