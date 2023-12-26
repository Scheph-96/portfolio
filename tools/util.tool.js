const fs = require('fs').promises;


/**
 * List of months
 */
const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

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
 * Convert a file to String in base64
 * @param {String} filePath the target file path
 * @returns promise
 */
function toBase64(filePath) {

    return new Promise(async (resolve, reject) => {
        try {
            let fileData;
        
            // read the content of the file
            fileData = await fs.readFile(filePath);

            // convert to string in base64
            resolve(fileData.toString('base64'));
            
        } catch (error) {
            reject(error);
        }
        
    })
}


module.exports = {
    formidableFormParser: formidableFormParser,
    toBase64: toBase64,
    months: months,
}