const Service = require('../models/service');


class ServiceCrud {
    
    /**
     * 
     * @param {Service} service service to create 
     * @returns {Promise} the new promise
     */
    create(service) {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await service.save();
                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 
     * @param {*} service 
     * @returns 
     */
    read(conditions, options=null) {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await Service.findOne(conditions, options).exec();
                resolve(result);
            } catch (error) {
                reject(error);
            }
        })
    }

    /**
     * 
     * @returns 
     */
    readAll() {
        return new Promise(async (resolve, reject) => {
            try {
                let results = await Service.find({}).exec();
                resolve(results);
            } catch (error) {
                reject(error)
            }
        });
    }

    /**
     * 
     * @param {*} conditions 
     * @param {*} update 
     * @returns 
     */
    update(conditions, update, options=null) {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await Service.findOneAndUpdate(conditions, { $set: update}, options);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 
     * @param {*} conditions 
     * @param {*} options 
     * @returns 
     */
    delete(conditions, options=null) {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await Service.findOneAndDelete(conditions, options);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    }
}

module.exports = ServiceCrud;