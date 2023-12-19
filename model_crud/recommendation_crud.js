const recommendationMethods = require('../models/recommendation');
const Recommendation = recommendationMethods.Recommendation;
const RecommendationFavorite = recommendationMethods.RecommendationFavorite;
const mongoose = require('mongoose');
const fs = require('fs').promises;
const path = require('path');


class RecommendationCrud {

    /**
     * 
     * @param {Recommendation} recommendation 
     * @returns 
     */
    create(recommendation) {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await recommendation.save();
                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 
     * @param {RecommendationFavorite} recommendationFavorite
     * @returns 
     */
    createFavorite(recommendationFavorite) {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await recommendationFavorite.save();
                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 
     * @param {mongoose.Schema.Types.ObjectId} id 
     * @param {Object} options 
     * @returns 
     */
    read(id, options=null) {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await Recommendation.findById(id, options).exec();
                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 
     * @param {mongoose.Schema.Types.ObjectId} id 
     * @param {Object} options 
     * @returns 
     */
    readFavorite(id, options=null) {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await RecommendationFavorite.findById(id, options).exec();
                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * This function return the raw values of recommendations from the database
     * @returns 
     */
    readAll() {
        return new Promise(async (resolve, reject) => {
            try {
                let results = await Recommendation.find({}).exec();
                resolve(results);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * This function return the raw values of the favorite
     * collection of the recommendations from the database
     * @returns 
     */
    readAllFavorite() {
        return new Promise(async (resolve, reject) => {
            try {
                let results = await RecommendationFavorite.find({}).exec();
                resolve(results);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * This function return all the recommendations while also handling
     * the profile pic (convert the image to base64 String)
     * @returns 
     */
    readAllWithPic() {
        return new Promise(async (resolve, reject) => {
            try {
                const fileData = await fs.readFile();
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * This function return the favorites recommendations (The 6 that are displayed on home page)
     * @returns
     */
    readAllFavoriteWithPic() {
        return new Promise(async (resolve, reject) => {
            try {
                // Define months array
                const months = [
                  'January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'
                ];
                let recommendations = await this.readAllFavorite();
                let fileData;
                let currentDir = __dirname;
                let parentDir = path.resolve(currentDir, '..');
                let date;

                for (let i = 0; i < recommendations.length; i++) {
                    fileData = await fs.readFile(parentDir + "/" + recommendations[i].pic.path);
                    date = new Date(recommendations[i].created);

                    recommendations[i].pic.path = fileData.toString('base64');
                    recommendations[i].date = `${months[date.getMonth()]} ${date.getDate().toString().padStart(2, '0')}, ${date.getFullYear()}`;
                }

                resolve(recommendations);

            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 
     * @param {mongoose.Schema.Types.ObjectId} id 
     * @param {Object} update 
     * @param {Object} options 
     * @returns 
     */
    update(id, update, options=null) {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await Recommendation.findByIdAndUpdate(id, { $set: update }, options);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 
     * @param {mongoose.Schema.Types.ObjectId} id 
     * @param {Object} update 
     * @param {Object} options 
     * @returns 
     */
    updateFavorite(id, update, options=null) {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await RecommendationFavorite.findByIdAndUpdate(id, { $set: update }, options);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 
     * @param {mongoose.Schema.Types.ObjectId} id 
     * @param {Object} options 
     * @returns 
     */
    delete(id, options=null) {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await Recommendation.findByIdAndDelete(id, options);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 
     * @param {mongoose.Schema.Types.ObjectId} id 
     * @param {Object} options 
     * @returns 
     */
    deleteFavorite(id, options=null) {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await RecommendationFavorite.findByIdAndDelete(id, options);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    }

}


module.exports = RecommendationCrud;