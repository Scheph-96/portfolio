const mongoose = require('mongoose');

serviceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    lowestPrice: {
        type: Number,
        required: true,
    },
    highestPrice: {
        type: String,
        required: true,
    },
    value: {
        type: String,
        required: true,
    }
});

// arg1: Model Name
// arg2: Schema
// arg3: collection name in the database
module.exports = mongoose.model('Service', serviceSchema, 'service');