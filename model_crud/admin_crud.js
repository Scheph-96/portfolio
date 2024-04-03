const Admin = require('../models/Schema/admin');


class AdminCrud {

    /**
     * @param {Admin} admin admin to create
     * @returns {Promise} the new promise
    */
    create(admin) {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await admin.save();
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
                let result = await Admin.findOne(conditions, options).exec();
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
                let result = await Admin.find({}).exec();
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
                let result = await Admin.findOneAndUpdate(conditions, { $set: update }, options).exec();
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
                let result = await Admin.findOneAndDelete(conditions, options).exec();
                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    }
}


module.exports = AdminCrud;