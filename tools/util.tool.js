// Build-in requirement
const fs = require('fs').promises;
const winston = require('winston');
const formidable = require('formidable');
const { default: mongoose } = require('mongoose');
const uuid = require('uuid');
const path = require('path');
const fileSys = require('fs');

// Custom requirement
const FileUploadError = require('../errors/file_upload.error');
const Log = require('../models/log.js');


/**
 * List of months
 */
const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

let currentDir = __dirname;
let parentDir = path.resolve(currentDir, '..');

// Define log format
const errorLogFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp,level, ip, url, method, message, stacktrace }) => {
        let log = new Log(timestamp, level, ip, url, method, message, stacktrace);
        return log.errorToString();
    })
);

const activityLogFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp,level, ip, url, method}) => {
        let log = new Log(timestamp, level, ip, url, method);
        return log.activityToString();
    })
);

// Create a logger with console and file transports
const ErrorLogger = winston.createLogger({
    format: errorLogFormat,
    transports: [
        // new winston.transports.Console(),
        new winston.transports.File({ filename: parentDir+'/logs/error.log' }),
    ],
});

const ActivityLogger = winston.createLogger({
    format: activityLogFormat,
    transports: [
        // new winston.transports.Console(),
        new winston.transports.File({ filename: parentDir+'/logs/activity.log' }),
    ],
});

/**
 * Return key-value of an object each value is a list of unique value
 * { key: [value] }
 * @param {Object} object  
 * @returns the new object { key: value }
 */
function formidableFormParser(object) {
    let keys = Object.keys(object);
    let values = Object.values(object);

    let parsedObject = {};

    for (let i = 0; i < keys.length; i++) {
        parsedObject[keys[i]] = values[i][0];
    }

    return parsedObject;
}

/**
 * Convert a file to String base64
 * @param {String} filePath the target file path
 * @returns promise
 */
function toBase64(filePath) {

    return new Promise(async (resolve, reject) => {
        try {
            let fileData;

            // read the content of the file
            fileData = await fs.readFile(filePath);

            // convert to string base64
            resolve(fileData.toString('base64'));

        } catch (error) {
            reject(error);
        }

    })
}

/**
 * Generate a v4 UUID
 * @returns new uuid
 */
function generateUUID_V4() {
    return uuid.v4();
}

/**
 * Return a file extension based on the filename
 * @param {String} filename 
 */
function getFileExtension(filename) {
    let splittedString = filename.split(".");
    let extension = splittedString[splittedString.length - 1];

    return extension;
}

/**
 * Write a file to storage with the format {prefix_objectId.extension}
 * @param {String} destination the subfolder in upload folder
 * @param {formidable.Files} files formidable file object (this param represent the file sent from the form)
 * @param {mongoose.Schema.Types.ObjectId} objectId the object id
 * @param {String} objectType the type of the processing app obtained with object.contructor.collection.name
 * @return promise
*/
async function writeOnDisk(destination, files, objectId, objectType) {
    return new Promise((resolve, reject) => {

        try {

            /**
             * This is the files object format: 
             * {
             *      fieldname: [ 
             *          { 
             *              originaleFilename: data, 
             *              mimetype: data, 
             *              etc... 
             *          } 
             *      ]
             * }
             * 
             * the file field name is not static it change according to the processed object
             * eg: specifications for order object and pic for recommendation object
             * 
             * to get the files object data here is the syntax:
             * files.specifications[0] ==> because we saw above that it's a list 
             * which is assigned to the file fieldname so...
             * files.specifications[0].originalFilename to get the originalFilename (specifications example)
             * 
             * but since fieldname is not static to dynamically get the fieldname we use Object.keys(files)
             * calling Object.keys on the files object will return the only key (when it is a single upload)
             * that exist in the files object, with this method this is how we get the files object data
             * files[Object.keys(files)[0]] ==> Object.keys return a list with a single value
             * file[Object.keys(files)[0]][0] ==> remember it's a list  which is assigned to the file fieldname
             * finally 
             * file[Object.keys(files)[0]][0].originalFilename to get the originalFilename and access
             * all the files object data
             */

            let fileExtension = getFileExtension(files[Object.keys(files)[0]][0].originalFilename);
            let prefix;

            if (objectType === "order") {
                if (fileExtension !== 'pdf') {
                    reject(new FileUploadError('Only pdf files are allowed for specifications'));
                    return;
                }
                prefix = "specs_";
            } else if (objectType === "recommendation") {
                if (!["jpg", "jpeg", "png"].includes(fileExtension)) {
                    reject(new FileUploadError('Only jpg jpeg png files are allowed for profile'));
                    return;
                }
                prefix = "pic_";
            } else {
                prefix = null;
            }

            if (prefix) {

                let filePath = 'uploads' + '/' + destination + "/" + prefix + objectId + '.' + fileExtension;
                let fullpath = path.resolve(__dirname, '..') + "/" + 'uploads' + '/' + destination + "/" + prefix + objectId + '.' + fileExtension;

                // get the file temporary location path
                let oldPath = files[Object.keys(files)[0]][0].filepath;
                // set the new location path on disk
                let newPath = fullpath;
                // read the file data from the temporary location
                let rawData = fileSys.readFileSync(oldPath);

                // write the file on disk
                fileSys.writeFileSync(newPath, rawData);
                resolve({ path: filePath, extension: fileExtension });
            } else {
                reject(new FileUploadError('Unknown error'));
            }
        } catch (error) {
            reject(error);
        }
    });
}


module.exports = {
    formidableFormParser: formidableFormParser,
    toBase64: toBase64,
    generateUUID_V4: generateUUID_V4,
    getFileExtension: getFileExtension,
    writeOnDisk: writeOnDisk,
    months: months,
    ErrorLogger: ErrorLogger,
    ActivityLogger: ActivityLogger,
}