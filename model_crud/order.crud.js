const {Order, NewOrder} = require('../models/Schema/order');
const OrderType = require('../models/enums/order_type');
const { parseNewOrder } = require('../tools/util.tool');


class OrderCrud {

    /**
     * Create a new order in NewOrder collection
     * @param {NewOrder} order 
     * @returns 
     */
    create(order) {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await order.save();
                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Create an order in Order collection
     * @param {Order} order 
     * @returns 
     */
    createOrder(order) {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await order.save();
                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 
     * @param {*} id 
     * @param {*} options 
     * @returns 
     */
    readById(id, options=null) {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await Order.findById(id, options).exec();
                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 
     * @param {*} id 
     * @param {*} condition 
     * @returns 
     */
    read(condition) {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await Order.findOne(condition).exec();
                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    }
    
    /**
     * 
     * @param {*} condition 
     * @param {*} option 
     * @returns 
     */
    readAll(condition=null, option=null) {
        return new Promise(async (resolve, reject) => {
            try {
                let results = await Order.find(condition, null, option).exec();
                resolve(results);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Parse the order for the order view on dashboard
     * to avoid putting logic on the endpoint
     * 
     * @returns 
     */
    readAllAndParseOrders() {
        return new Promise(async (resolve, reject) => {
            try {
                let results = await Order.find({}).exec();
                resolve(results);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 
     * @param {*} id 
     * @param {*} options 
     * @returns 
     */
    readNewById(id, options=null) {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await NewOrder.findById(id, options).exec();
                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 
     * @param {*} id 
     * @param {*} options 
     * @returns 
     */
    readNew(options) {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await NewOrder.findOne(options).exec();
                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 
     * @returns 
     */
    readNewAll(options=null) {
        return new Promise(async (resolve, reject) => {
            try {
                let results = await NewOrder.find(null, null, options).exec();
                resolve(results);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Read all new order and parse them for view display
     * @returns promise
     */
    readAndParseOrders(type) {
        return new Promise(async (resolve, reject) => {
            try {
                let pardsedNewOrders = [];
                let order;
                if (type === OrderType.enum.new) {
                    order = await this.readNewAll({sort: {created: 'desc'}});
                } else if (type === OrderType.enum.pending) {
                    order = await this.readAll({status: OrderType.enum.pending}, {sort: {created: 'desc'}});
                }

                for (let i = 0; i < order.length; i++) {
                    pardsedNewOrders.push( await parseNewOrder(order[i]) );
                }

                resolve(pardsedNewOrders);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 
     * @param {*} id 
     * @param {*} update 
     * @param {*} options 
     * @returns 
     */
    updateById(id, update, options=null) {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await Order.findByIdAndUpdate(id, { $set: update }, options);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 
     * @param {*} id 
     * @param {*} update 
     * @param {*} options 
     * @returns 
     */
    update(condition, update, options=null) {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await Order.findOneAndUpdate(condition, { $set: update }, options);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 
     * @param {*} id 
     * @param {*} options 
     * @returns 
     */
    delete(id, options=null) {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await Order.findByIdAndDelete(id, options);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 
     * @param {*} id 
     * @param {*} update 
     * @param {*} options 
     * @returns 
     */
    updateNewById(id, update, options=null) {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await NewOrder.findByIdAndUpdate(id, { $set: update }, options);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 
     * @param {*} id 
     * @param {*} update 
     * @param {*} options 
     * @returns 
     */
    updateNew(condition, update, options=null) {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await NewOrder.findOneAndUpdate(condition, { $set: update }, options);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 
     * @param {*} id 
     * @param {*} options 
     * @returns 
     */
    deleteNewById(id, options=null) {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await NewOrder.findByIdAndDelete(id, options);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 
     * @param {*} id 
     * @param {*} options 
     * @returns 
     */
    deleteNew(id, options=null) {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await NewOrder.findOneAndDelete(id, options);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    }

}

module.exports = OrderCrud;