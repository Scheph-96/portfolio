const mongoose = require("mongoose");
const Order = require("../models/Schema/order");



/**
 * @param {*} model the model to watch
*/
function collectionInsertionNotifier(model) {
    console.log("Listening to insertion change");

    const stream = Order.watch({ operationType: 'insert' });

    stream.on('change', (change) => {
        console.log('THE NEW CHANGE: ', change);
    });
}

module.exports = {
    collectionInsertionNotifier: collectionInsertionNotifier,
}