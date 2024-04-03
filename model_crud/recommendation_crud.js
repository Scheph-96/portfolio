const recommendationMethods = require('../models/Schema/recommendation');
const Recommendation = recommendationMethods.Recommendation;
const RecommendationFavorite = recommendationMethods.RecommendationFavorite;
const mongoose = require('mongoose');
const fs = require('fs').promises;
const path = require('path');
const { months, toBase64 } = require('../tools/util.tool');


class RecommendationCrud {

    /**
     * Create a recommendation
     * @param {Recommendation} recommendation the new instance to be create
     * @returns promise
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
     * Create a favorite recommendation
     * @param {RecommendationFavorite} recommendationFavorite the new favorite instance to be create
     * @returns promise
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
     *  Get one recommendation
     * @param {mongoose.Schema.Types.ObjectId} id 
     * @param {Object} options 
     * @returns promise
     */
    read(id, options = null) {
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
     * Get one recommendation with the pic
     * @param {mongoose.Schema.Types.ObjectId} id 
     * @param {Object} options 
     * @returns promise
     */
    readWithPic(id, options = null) {
        return new Promise(async (resolve, reject) => {
            try {
                let recommendation = await this.read(id);
                // get the current directory absolute path
                let currentDir = __dirname;
                // get the current directory parent path
                let parentDir = path.resolve(currentDir, '..');
                let date;

                recommendation.pic.path = await toBase64(parentDir + "/" + recommendation.pic.path);
                // get the creation date
                date = new Date(recommendation.created);

                recommendation.date = `${months[date.getMonth()]} ${date.getDate().toString().padStart(2, '0')}, ${date.getFullYear()}`;


                resolve(recommendation);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 
     * @param {mongoose.Schema.Types.ObjectId} id 
     * @param {Object} options 
     * @returns promise
     */
    readFavorite(id, options = null) {
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
     * @returns promise
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
     * @returns promise
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
     * This function return all recommendation with a specific rate
     * @param {Number} rate the rate that match the request
     * @returns promise
     */
    readAllByRate(rate) {
        return new Promise(async (resolve, reject) => {
            try {
                let results = await Recommendation.find({ rate: rate }).exec();
                resolve(results)
            } catch (error) {
                reject(error);
            }
        })
    }

    /**
     * This function return all recommendation with a specific rate
     *  while also handling the profile pic (convert the image to base64 String)
     * @param {Number} rate 
     * @returns promise
     */
    readAllByRateWithPic(rate) {
        return new Promise(async (resolve, reject) => {
            try {
                let recommendations = await this.readAllByRate(rate);
                // get the current directory absolute path
                let currentDir = __dirname;
                // get the current directory parent path
                let parentDir = path.resolve(currentDir, '..');
                let date;

                for (let i = 0; i < recommendations.length; i++) {
                    recommendations[i].pic.path = await toBase64(parentDir + "/" + recommendations[i].pic.path);
                    // get the creation date
                    date = new Date(recommendations[i].created);

                    recommendations[i].date = `${months[date.getMonth()]} ${date.getDate().toString().padStart(2, '0')}, ${date.getFullYear()}`;
                }

                resolve(recommendations);
            } catch (error) {
                reject(error);
            }
        })
    }

    /**
     * This function return all the recommendations while also handling
     * the profile pic (convert the image to base64 String)
     * @returns promise
     */
    readAllWithPic() {
        return new Promise(async (resolve, reject) => {
            try {
                let recommendations = await this.readAll();
                // get the current directory absolute path
                let currentDir = __dirname;
                // get the current directory parent path
                let parentDir = path.resolve(currentDir, '..');
                let date;

                for (let i = 0; i < recommendations.length; i++) {
                    recommendations[i].pic.path = await toBase64(parentDir + "/" + recommendations[i].pic.path);
                    // get the creation date
                    date = new Date(recommendations[i].created);

                    recommendations[i].date = `${months[date.getMonth()]} ${date.getDate().toString().padStart(2, '0')}, ${date.getFullYear()}`;
                }

                resolve(recommendations);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * This function return the favorites recommendations (The 6 that are displayed on home page)
     * @returns promise
     */
    readAllFavoriteWithPic() {
        return new Promise(async (resolve, reject) => {
            try {
                let recommendations = await this.readAllFavorite();
                // get the current directory absolute path
                let currentDir = __dirname;
                // get the current directory parent path
                let parentDir = path.resolve(currentDir, '..');
                let date;

                for (let i = 0; i < recommendations.length; i++) {
                    recommendations[i].pic.path = await toBase64(parentDir + "/" + recommendations[i].pic.path);
                    // get the creation date
                    date = new Date(recommendations[i].created);

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
     * @returns promise
     */
    update(id, update, options = null) {
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
     * @returns promise
     */
    updateFavorite(id, update, options = null) {
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
     * @returns promise
     */
    delete(id, options = null) {
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
     * @returns promise
     */
    deleteFavorite(id, options = null) {
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