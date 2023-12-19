function formidableFormParser(object) {
    let keys = Object.keys(object);
    let values = Object.values(object);

    let parsedObject = {};

    for (let i = 0; i < keys.length; i++) {
        parsedObject[keys[i]] = values[i][0];
    }

    return parsedObject;
}


module.exports = {
    formidableFormParser: formidableFormParser,
}