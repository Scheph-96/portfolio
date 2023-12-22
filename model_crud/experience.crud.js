const ExperienceMethods = require('../models/experience');
const ExperienceFavorite = ExperienceMethods.ExperienceFavorite;
const Experience = ExperienceMethods.Experience;


class ExperienceCrud {

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
     * 
     * @param {String} type 
     * @returns 
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

    update(id, update, options = null) {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await Experience.findByIdAndUpdate(id, { $set: update }, options);
            } catch (error) {
                reject(error);
            }
        });
    }

    updateFavorite(id, update, options = null) {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await ExperienceFavorite.findByIdAndUpdate(id, { $set: update }, options);
            } catch (error) {
                reject(error);
            }
        });
    }

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