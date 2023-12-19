const Order = require('../models/order');


class OrderCrud {

    /**
     * 
     * @param {Order} order 
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
    read(id, options=null) {
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

}

module.exports = OrderCrud;