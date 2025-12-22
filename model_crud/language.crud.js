const Language = require('../models/Schema/language');

class LanguageCrud {

    /**
     * Create a new programming language
     * 
     * @param {Language} language 
     * @returns Promise
     */
    create(language) {
        return new Promise((resolve, reject) => {
            try {
                let result = language.save()
            } catch (error) {
                reject(error);
            }
        })
    }

    /**
     * Retrieve the programming language that match the condition
     * 
     * @param {Object} conditions query conditions
     * @param {Object} options query options
     * @returns Promise
     */
    read(conditions, options=null) {
        return new Promise((resolve, reject) =>{
            try{
                let result = Language.findOne(conditions, options).exec();
                resolve(result);
            }catch(error){
                reject(error);
            }
        })
    }

    /**
     * Retrieve every programming language
     * 
     * @returns Promise
     */
    readAll() {
        return new Promise((resolve, reject) => {
            try {
                let results = Language.find({}).exec();
                resolve(results);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Update the programming language that match the condition
     * 
     * @param {Object} conditions query conditions
     * @param {Object} update new values
     * @param {Object} options query options
     * @returns Promise
     */
    update(conditions, update, options=null) {
        return new Promise((resolve, reject) => {
            try {
                let result = Language.findOneAndUpdate(conditions, {$set: update}, options);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Delete the programming language that matcg the request
     * 
     * @param {Object} conditions query conditions
     * @param {Object} options query options
     * @returns Promise
     */
    delete(conditions, options=null) {
        return new Promise((resolve, reject) => {
            try {
                let result = Language.findOneAndDelete(conditions, options);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        })
    }
}

module.exports = LanguageCrud;