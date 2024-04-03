const {Order, NewOrder} = require('../models/Schema/order');
const { parseNewOrder } = require('../tools/util.tool');


class OrderCrud {

    /**
     * 
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
     * @param {*} options 
     * @returns 
     */
    read(options) {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await Order.find(options).exec();
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
    readAll() {
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
                let result = await NewOrder.find(options).exec();
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
    readNewAll() {
        return new Promise(async (resolve, reject) => {
            try {
                let results = await NewOrder.find({}).exec();
                resolve(results);
            } catch (error) {
                reject(error);
            }
        });
    }

    readAndParseNewOrders() {
        return new Promise(async (resolve, reject) => {
            try {
                let pardsedNewOrders = [];
                let newOrders = await this.readNewAll();

                for (let i = 0; i < newOrders.length; i++) {
                    pardsedNewOrders.push( await parseNewOrder(newOrders[i]) );
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
    update(id, update, options=null) {
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
    updateNew(id, update, options=null) {
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
     * @param {*} options 
     * @returns 
     */
    deleteNew(id, options=null) {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await NewOrder.findByIdAndDelete(id, options);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    }

}

module.exports = OrderCrud;