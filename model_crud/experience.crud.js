const { default: mongoose } = require('mongoose');
const ExperienceMethods = require('../models/Schema/experience');
const ExperienceFavorite = ExperienceMethods.ExperienceFavorite;
const Experience = ExperienceMethods.Experience;


class ExperienceCrud {

    /**
     * Create a work experience
     * @param {Experience} experience 
     * @returns 
     */
    create(experience) {
        return new Promise((resolve, reject) => {
            try {
                let result = experience.save();
                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Create a wprk experience favorite (the 5 ones that are displayed on home page)
     * @param {ExperienceFavorite} experienceFavorite 
     * @returns 
     */
    createFavorite(experienceFavorite) {
        return new Promise((resolve, reject) => {
            try {
                let result = experienceFavorite.save();
                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Read a work experience
     * @param {mongoose.Schema.Types.ObjectId} id Experience id
     * @param {Object} options mongodb request options
     * @returns promise
     */
    read(id, options = null) {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await Experience.findById(id, options).exec();
                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    }

    /** 
     * Read a work experience favorite
     * @param {mongoose.Schema.Types.ObjectId} id ExperienceFavorite id
     * @param {Object} options mongodb request options
     * @returns promise
     */
    readFavorite(id, options = null) {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await ExperienceFavorite.findById(id, options).exec();
                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Read all work experience that have the type
     * @param {String} type the experience type (web, ui_design, poster, logo)
     * @returns promise
    */
    readAllByType(type) {
        return new Promise(async (resolve, reject) => {
            try {
                let results = Experience.find({ type: type }).exec();
                resolve(results);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Read all work experience favorite that have the type
     * @param {String} type the experience type (web, ui_design, poster, logo)
     * @returns promise
    */
    readAllFavoriteByType(type) {
        return new Promise(async (resolve, reject) => {
            try {
                let results = ExperienceFavorite.find({ type: type }).exec();
                resolve(results);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Read all work experience. Retrieve every single instance of Experience
     * @returns promise
     */
    readAll() {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await Experience.find({}).exec();
                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Read all work experience favorite, Retrieves every instanve of ExperienceFavorite
     * @returns promise
     */
    readAllFavorite() {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await ExperienceFavorite.find({}).exec();
                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Update a work of experience
     * @param {mongoose.Schema.Types.ObjectId} id Experience id
     * @param {Object} update updates
     * @param {Object} options mongodb request options
     * @returns promise
     */
    update(id, update, options = null) {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await Experience.findByIdAndUpdate(id, { $set: update }, options);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Update a work of experience favorite
     * @param {mongoose.Schema.Types.ObjectId} id ExperienceFavorite id
     * @param {Object} update updates
     * @param {Object} options mongodb request options
     * @returns promise
     */
    updateFavorite(id, update, options = null) {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await ExperienceFavorite.findByIdAndUpdate(id, { $set: update }, options);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Delete a work of experience
     * @param {mongoose.Schema.Types.ObjectId} id Experience id
     * @param {Object} options mongodb request options
     * @returns promise
     */
    delete(id, options = null) {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await Experience.findByIdAndDelete(id, options);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Delete a work of experience favorite
     * @param {mongoose.Schema.Types.ObjectId} id ExperienceFavorite id
     * @param {Object} options mongodb request options
     * @returns promise
     */
    deleteFavorite(id, options = null) {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await ExperienceFavorite.findByIdAndDelete(id, options);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    }

}

module.exports = ExperienceCrud;