const Notification = require('../models/Schema/notification');


class NotificationCrud {

    /**
     * @param {Notification} notification notification to create
     * @returns {Promise} the new promise
    */
    create(notification) {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await notification.save();
                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @param {Object} conditions
     * @param {*} options
     * @returns {Promise} the new promise
    */
    read(conditions, options=null) {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await Notification.findOne(conditions, options).exec();
                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    }
    
    /**
     * @param {Object} conditions
     * @param {*} options
     * @returns {Promise} the new promise
    */
    readAll() {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await Notification.find({}).exec();
                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @param {Object} conditions
     * @param {Object} update
     * @param {*} options
     * @returns {Promise} the new promise
    */
    update(conditions, update, options=null) {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await Notification.findOneAndUpdate(conditions, { $set: update }, options).exec();
                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @param {Object} conditions
     * @param {*} options
     * @returns {Promise} the new promise
    */
    delete(conditions, options=null) {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await Notification.findOneAndDelete(conditions, options).exec();
                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    }
}


module.exports = NotificationCrud;